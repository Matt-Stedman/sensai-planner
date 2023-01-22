import React from 'react';
import { Stage, Layer, Text, Circle, Line } from 'react-konva';


const SpiderCanvas = (props) => {
  if (props === undefined) {
    return
  }
  if (props.airtableData.length === 0) {
    return
  }
  let use_data = props.airtableData;

  console.log(use_data);
  let labels = [
    "CONVICTION",
    "LONG TERM / PROJECTS",
    "SPRINTS / MILESTONES",
    "TO-DO / TASKS",
  ]

  /* POPULATE THE USEABLE AIRTABLE DATA WITH ADDITIONAL DOM ELEMENTS */
  const [st_projects, setStProjects] = React.useState(
    use_data.projects.map((each_pr) => (
      {
        ...each_pr,
        "use_text": each_pr["title"],
        "opacity": .5,
        "sprints": each_pr.sprints.map((each_sp) => (
          {
            ...each_sp,
            "use_text": each_sp["title"],
            "opacity": .5,
            "todos": each_sp.todos.map((each_todo) => (
              {
                ...each_todo,
                "use_text": each_todo["title"],
                "opacity": .5,
              }
            ))
          }
        ))
      })));

  /* CREATE A STATE TO HANDLE NAVIGATION OF THE CANVAS */
  const [st_navigation, setStNavigation] = React.useState({
    selected: null,
    scale: 1,
    x: 0,
    y: 0
  });

  /* DEFINE SOME CANVAS DESIGN ELEMENTS (ANGLES, COLOURS, ETC.) */
  const design_params = {
    "core": {
      "x_c": window.innerWidth / 2,
      "y_c": window.innerHeight / 2
    },
    "design": {
      "spacing": 200,
      "projects_angle": 2 * 3.1415, // All projects will be split evenly between this span (should be 360d)
      "sprints_angle": 2 * 3.1415 / 8, // All sprints will be split evenbly between this span
      "todos_angle": 2 * 3.1415 / 36, // All todos will be seperated by this span (NOT THE SAME AS ABOVE!)
      "label_angle": 2 * 3.1415 / 8
    },
    "colours": {
      "background": "white",
      "trace_unselected": "#8899dd",
      "trace_selected": "#1122ff"
    }
  }

  /* HELPER FUNCTIONS */
  function polarToCartesian(r, theta) {
    let x = r * Math.cos(theta);
    let y = r * Math.sin(theta);
    return [x, y];
  }

  /* INTERACTION FUNCTIONS */
  const showNodeText = (e) => {
    if (e.target.id().includes("pr_node_")) {
      setStProjects(
        st_projects.map((project, i) => {
          return {
            ...project,
            use_text: (("pr_node_" + i === e.target.id()) ? project.title + "\n" + project.description : project.title),
            opacity: (("pr_node_" + i === e.target.id()) ? 1 : 0.5)
          }
        })
      )
    }
    else if (e.target.id().includes("sp_node_")) {
      setStProjects(
        st_projects.map((project, i) => {
          return {
            ...project,
            sprints: project.sprints.map((sprint, j) => {
              return {
                ...sprint,
                use_text: (("sp_node_" + i + "_" + j === e.target.id()) ? sprint.title + "\n" + sprint.description : sprint.title),
                opacity: (("sp_node_" + i + "_" + j === e.target.id()) ? 1 : 0.5)
              }
            })
          }
        })
      )
    }
    else if (e.target.id().includes("td_node_")) {
      setStProjects(
        st_projects.map((project, i) => {
          return {
            ...project,
            sprints: project.sprints.map((sprint, j) => {
              return {
                ...sprint,
                todos: sprint.todos.map((to_do, k) => {
                  return {
                    ...to_do,
                    use_text: (("td_node_" + i + "_" + j + "_" + k === e.target.id()) ? to_do.title + "\n" + to_do.description : to_do.title),
                    opacity: (("td_node_" + i + "_" + j + "_" + k === e.target.id()) ? 1 : 0.5)
                  }
                })
              }
            })
          }
        })
      )
    }

  }
  const hideNodeText = (e) => {
    setTimeout((i) => {
      setStProjects(
        st_projects.map((project, i) => {
          return {
            ...project,
            use_text: project.title,
            opacity: 0.5,
            sprints: project.sprints.map((sprint, j) => {
              return {
                ...sprint,
                use_text: sprint.title,
                opacity: 0.5,
                todos: sprint.todos.map((to_do, k) => {
                  return {
                    ...to_do,
                    use_text: to_do.title,
                    opacity: 0.5,
                  }
                })
              }
            })
          }
        })
      )
    },
      3000)
  }


  const handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.02;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setStNavigation({
      ...st_navigation,
      scale: newScale,
      x: (stage.getPointerPosition().x / newScale - mousePointTo.x) * newScale,
      y: (stage.getPointerPosition().y / newScale - mousePointTo.y) * newScale
    });
  };

  /* RETURN THE ACTUAL HTML ELEMENTS WE NEED */
  return (
    /* OUR KONVA "CANVAS" */
    <Stage
      width={window.innerWidth}
      height={window.innerHeight - 50}
      onWheel={handleWheel}
      draggable={true}
      onDragStart={(e) => { }}
      onDragEnd={(e) => { }}
      scaleX={st_navigation.scale}
      scaleY={st_navigation.scale}
      x={st_navigation.x}
      y={st_navigation.y}
      style={{ background: design_params['colours']['background'] }}
    >
      {/* LAYOUT CIRCLES AND LABELS */}
      <Layer id="LAYOUT">
        {labels.map((label, i) => (
          <Circle
            key={"lb_circle_" + i}
            id={"lb_circle_" + i}
            x={design_params["core"]["x_c"]}
            y={design_params["core"]["y_c"]}
            radius={design_params["design"]["spacing"] * (i + 1)}
            stroke="black"
          />))
        }
        {labels.map((label, i) => (
          <Text
            key={"lb_text_" + i}
            id={"lb_text_" + i}
            x={design_params["core"]["x_c"] + polarToCartesian(3 + design_params["design"]["spacing"] * (i + 1), design_params["design"]["label_angle"])[0]}
            y={design_params["core"]["y_c"] + polarToCartesian(3 + design_params["design"]["spacing"] * (i + 1), design_params["design"]["label_angle"])[1]}
            text={labels[i]}
            fontSize={10}
            fill="#6666ff" />
        )
        )}
        {
          <Text
            x={design_params["core"]["x_c"] - (design_params["design"]["spacing"] * 3 / 4)}
            y={design_params["core"]["y_c"] - (design_params["design"]["spacing"] * 3 / 4)}
            verticalAlign="middle"
            align="center"
            width={design_params["design"]["spacing"] * 3 / 2}
            height={design_params["design"]["spacing"] * 3 / 2}
            text={use_data["conviction"]}
            fontSize={10}
            fill="#6666ff"
          />
        }
      </Layer>
      <Layer id="PROJECTS">
        {st_projects.map((project, i) => {
          /* SPRINTS VARS */
          const sp_angle = design_params["design"]["sprints_angle"];

          /* TO-DO VARS */
          const to_do_angle = design_params["design"]["todos_angle"];

          let startPoint = polarToCartesian(design_params["design"]["spacing"], design_params["design"]["projects_angle"] * i / st_projects.length);

          /* PROJECTS LINES, NODES, AND TEXT */
          let project_features = ([
            <Line
              key={"pr_line_" + i}
              id={"pr_line_" + i}
              x={design_params["core"]["x_c"] + startPoint[0]}
              y={design_params["core"]["y_c"] + startPoint[1]}
              points={[
                0,
                0,
                startPoint[0],
                startPoint[1]]}
              tension={0.5}
              stroke="black"
            />,
            <Circle
              key={"pr_node_" + i}
              id={"pr_node_" + i}
              x={design_params["core"]["x_c"] + startPoint[0] * 2}
              y={design_params["core"]["y_c"] + startPoint[1] * 2}
              radius={4}
              fill="#0"
              onmouseenter={showNodeText}
              onmouseleave={hideNodeText}
            />,
            <Text
              key={"pr_text_" + i}
              id={"pr_text_" + i}
              x={design_params["core"]["x_c"] + startPoint[0] * 2}
              y={design_params["core"]["y_c"] + startPoint[1] * 2}
              text={project.use_text}
              wrap="word"
              width={300}
              fill="#333388"
              opacity={project.opacity}
            />
          ])

          /* SPRINTS LINES, NODES, AND TEXT */
          let sprint_features = project.sprints.map((sprint, j) => {
            let this_project_angle = design_params["design"]["projects_angle"] * i / st_projects.length;
            let this_sprint_angle = sp_angle * (j - ((project.sprints.length - 1) / 2)) / project.sprints.length;
            let startPoint = polarToCartesian(design_params["design"]["spacing"] * 2, this_project_angle);
            let endPoint = polarToCartesian(design_params["design"]["spacing"] * 3, this_project_angle + this_sprint_angle);

            let sprint_int_features =
              [
                <Line
                  key={"sp_line_" + i + "_" + j}
                  id={"sp_line_" + i + "_" + j}
                  x={design_params["core"]["x_c"]}
                  y={design_params["core"]["y_c"]}
                  points={[
                    startPoint[0],
                    startPoint[1],
                    endPoint[0],
                    endPoint[1]
                  ]}
                  tension={0.5}
                  stroke="black"
                />,
                <Circle
                  key={"sp_node_" + i + "_" + j}
                  id={"sp_node_" + i + "_" + j}
                  x={design_params["core"]["x_c"] + endPoint[0]}
                  y={design_params["core"]["y_c"] + endPoint[1]}
                  radius={4}
                  fill="#0"
                  onmouseenter={showNodeText}
                  onmouseleave={hideNodeText}
                />,
                <Text
                  key={"sp_text_" + i + "_" + j}
                  id={"sp_text_" + i + "_" + j}
                  x={design_params["core"]["x_c"] + endPoint[0]}
                  y={design_params["core"]["y_c"] + endPoint[1]}
                  radius={4}
                  text={sprint.use_text}
                  opacity={sprint.opacity}
                  wrap="word"
                  width={300}
                  fill="#333388"
                />
              ];

            /* TO-DO LINES, NODES, AND TEXT */
            let todo_features = sprint.todos.map((to_do, k) => {
              let this_to_do_angle = to_do_angle * (k - ((sprint.todos.length - 1) / 2)) / sprint.todos.length;
              let startPoint = polarToCartesian(design_params["design"]["spacing"] * 3, this_project_angle + this_sprint_angle);
              let endPoint = polarToCartesian(design_params["design"]["spacing"] * 4, this_project_angle + this_sprint_angle + this_to_do_angle);
              return (
                [
                  <Line
                    key={"td_line_" + i + "_" + j + "_" + k}
                    id={"td_line_" + i + "_" + j + "_" + k}
                    x={design_params["core"]["x_c"]}
                    y={design_params["core"]["y_c"]}
                    points={[
                      startPoint[0],
                      startPoint[1],
                      endPoint[0],
                      endPoint[1]
                    ]}
                    tension={0.5}
                    stroke="black"
                  />,
                  <Circle
                    key={"td_node_" + i + "_" + j + "_" + k}
                    id={"td_node_" + i + "_" + j + "_" + k}
                    x={design_params["core"]["x_c"] + endPoint[0]}
                    y={design_params["core"]["y_c"] + endPoint[1]}
                    radius={4}
                    fill="#0"
                    onmouseenter={showNodeText}
                    onmouseleave={hideNodeText}
                  />,
                  <Text
                    key={"td_text_" + i + "_" + j + "_" + k}
                    id={"td_text_" + i + "_" + j + "_" + k}
                    x={design_params["core"]["x_c"] + endPoint[0]}
                    y={design_params["core"]["y_c"] + endPoint[1]}
                    radius={4}
                    text={to_do.use_text}
                    opacity={to_do.opacity}
                    wrap="word"
                    width={300}
                    fill="#333388"
                  />
                ]
              )
            })


            return ([sprint_int_features, todo_features]);
          })

          return ([project_features, sprint_features])
        })}
      </Layer>
    </Stage>
  )
};

export default SpiderCanvas;