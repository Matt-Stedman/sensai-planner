import React from 'react';
import AirtableIntegration from './components/AirtableIntegration'
import SpiderCanvas from './components/SpiderCanvas';
import Airtable from 'airtable';

var populateUseData = async function populateUseData(longTermTable, sprintTable, todoTable) {
    var useData = {
        "conviction": "",
        "projects": [], // .. {"sprints": [.. {"todos": []}]}
        "unassigned": {
            "projects": [],
            "sprints": [],
            "todos": []
        }
    }
    await longTermTable.select().all().then(
        (records) => {
            for (let i = 0; i < records.length; i++) {
                let project = records[i];
                let fields = project._rawJson.fields;
                let tmpProjDict = {};
                tmpProjDict["id"] = project.id;
                tmpProjDict["title"] = fields.Name;
                tmpProjDict["description"] = fields.Description;
                tmpProjDict["sprints"] = [];
                useData.projects.push(tmpProjDict);
            }
        })
        .catch(function () {
            console.log("Oh dear, Projects/Long-terms failed..");
        });
    await sprintTable.select().all().then(
        (records) => {
            for (let i = 0; i < records.length; i++) {
                let sprint = records[i];
                let fields = sprint._rawJson.fields;
                if (Object.keys(fields).length === 0) {
                    continue;
                }
                let tmpSprintDict = {};
                tmpSprintDict["id"] = sprint.id;
                tmpSprintDict["title"] = fields.Name;
                tmpSprintDict["description"] = fields.Notes;
                tmpSprintDict["todos"] = [];
                useData.projects.find(project =>
                    project.id === fields["Projects/long term goals"][0]
                )["sprints"].push(tmpSprintDict);
            }
        })
        .catch(function () {
            console.log("Oh dear, Sprints failed..");
        });

    await todoTable.select().all().then(
        (records) => {
            for (let i = 0; i < records.length; i++) {
                let toDo = records[i];
                let fields = toDo._rawJson.fields;
                if (Object.keys(fields).length === 0) {
                    continue;
                }
                let tmpToDoDict = {};
                tmpToDoDict["id"] = toDo.id;
                tmpToDoDict["title"] = fields.Name;
                tmpToDoDict["description"] = fields.Notes;
                if (fields["Projects/long term goals (from Sprints)"] === undefined) {
                    useData.unassigned.todos.push(tmpToDoDict)
                    continue;
                } else if (fields["Projects/long term goals (from Sprints)"].length === 0) {
                    useData.unassigned.todos.push(tmpToDoDict)
                    continue;
                }
                // for each project, check each sprint, then match this todo to it's sprint array.
                useData.projects.find(project =>
                    project.id === fields["Projects/long term goals (from Sprints)"][0]
                )["sprints"].find(sprint =>
                    sprint.id === fields["Sprints"][0]
                )["todos"].push(tmpToDoDict)
            }
        })
        .catch(function () {
            console.log("Oh dear, Todos failed..");
        });

    return useData;
}

const App = () => {
    Airtable.configure({
        endpointUrl: 'https://api.airtable.com',
        apiKey: process.env.REACT_APP_AIRTABLE_TOKEN
    });
    var base = Airtable.base('appmuvlU8q5Y40LqG');
    const [airtableData, setAirtableData] = React.useState([]);
    React.useEffect(() => {
        populateUseData(
            base.table("Projects/long term goals"),
            base.table("Sprints"),
            base.table("To-dos")).then(setAirtableData);
    }, []);
    return (
        <div>
            <AirtableIntegration />
            <SpiderCanvas airtableData={airtableData}/>
        </div>
    )
};

export default App;