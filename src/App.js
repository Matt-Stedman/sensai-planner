import React from 'react';
import { createRoot } from 'react-dom/client';
import { Stage, Layer, Text, Circle, Line} from 'react-konva';


const App = () => {
  
  
  let use_data = {
    "vision": "USE MARTIAL ARTS TO ADDRESS MENTAL HEALTH ISSUES FOR ANYONE, ANYWHERE",
    "projects": [
      {
        "title": "",
         "description": "A physical device that anyone, anywhere can use to improve their mental health through martial arts + sensai to collect data on the mental health development and usage of the bag",
         "vision": 0
        }
      ],
    "sprints": [
      { "tite": "",
        "description": "(DBAA) 0th generation: A super basic website that detects punches rates and bag/wall usage + Stream to the cloud",
        "projects": 0
      }
    ],
    "toDos": [
      {
        "title": "Punches by microphone",
        "description": "Website that detects punches via microphone (~1 hr)",
      "sprint": 0
    }]
  }
  
  let labels = [
    "CONVICTION",
    "LONG TERM / PROJECTS",
    "SPRINTS / MILESTONES",
    "TO-DO / TASKS"
  ]
  
  const [st_projects, setStProjects] = React.useState(use_data["projects"].map((each) => ({each, "visible": false })));
  const [st_sprints, setStSprints] = React.useState(use_data["sprints"]);
  const [st_toDos, setStToDos] = React.useState(use_data["toDos"]);
  const [st_navigation, setStNavigation] = React.useState({
    selected: null,
    scale: 1,
    x: 0,
    y: 0
  });

  const design_params = {
    "core": {
      "x_c": window.innerWidth / 2,
      "y_c": window.innerHeight / 2
    },
    "design": {
      "spacing": 100,
      "vision_angle": 360,
      "projects_angle": 120,
      "sprints_angle": 120,
      "label_angle": 45
    }
  }

  function polarToCartesian(r, theta) {
    let x = r * Math.cos(theta);
    let y = r * Math.sin(theta);
    return [x, y];
  }


  var nodeFromNode = (node, direction, angle) => {

    return 0;
  }

  const showProjectText = (e) => {
    setStProjects(
      st_projects.map((st_projects, i) => {
        return {
          ...st_projects,
          visible: (("pr_node_" + i === e.target.id()) ? true : false)
        }
      })
    )
  }
  const hideProjectText = (e) => {
    setTimeout( (i) => {
      setStProjects(
        st_projects.map((st_projects, i) => {
          return {
            ...st_projects,
            visible: false
          }
        })
      )},
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


  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onWheel={handleWheel}
      scaleX={st_navigation.scale}
      scaleY={st_navigation.scale}
      x={st_navigation.x}
      y={st_navigation.y}
    >
        {/* PROJECTS LINES, NODES, AND TEXT */} 
      <Layer id="PROJECTS">
        {labels.map((label, i) => (
          <Circle
            key={"lb_circle_" + i}
            id={"lb_circle_" + i}
            x={design_params["core"]["x_c"]}
            y={design_params["core"]["y_c"]}
            radius={design_params["design"]["spacing"] * i}
            stroke="black" />))
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
      </Layer>
        {/* PROJECTS LINES, NODES, AND TEXT */} 
      <Layer id="PROJECTS">
        {st_projects.map((project, i) => (
          <Line
            key={"pr_line_" + i}
            id={"pr_line_" + i}
            x={design_params["core"]["x_c"]}
            y={design_params["core"]["y_c"]}
            points={[
              polarToCartesian(design_params["design"]["spacing"], design_params["design"]["label_angle"] * i)[0],
              polarToCartesian(design_params["design"]["spacing"], design_params["design"]["label_angle"] * i)[1], 
              polarToCartesian(design_params["design"]["spacing"] * 2, design_params["design"]["label_angle"] * i)[0], 
              polarToCartesian(design_params["design"]["spacing"] * 2, design_params["design"]["label_angle"] * i)[1]]}
            tension={0.5}
            stroke="black" />
        ))}
        {st_projects.map((project, i) => (
          <Circle
            key={"pr_node_" + i}
            id={"pr_node_" + i}
            x={polarToCartesian(design_params["design"]["spacing"] * 2, design_params["design"]["label_angle"] * i)[0] + design_params["core"]["x_c"]}
            y={polarToCartesian(design_params["design"]["spacing"] * 2, design_params["design"]["label_angle"] * i)[1] + design_params["core"]["y_c"]}
            radius={4}
            fill="#0"
            onmouseenter={showProjectText}
            onmouseleave={hideProjectText}
          />
        ))}
        {st_projects.map((project, i) => (
          <Text
            key={"pr_text_" + i}
            id={"pr_text_" + i}
            x={polarToCartesian(design_params["design"]["spacing"] * 2, design_params["design"]["label_angle"] * i)[0] + design_params["core"]["x_c"]}
            y={polarToCartesian(design_params["design"]["spacing"] * 2, design_params["design"]["label_angle"] * i)[1] + design_params["core"]["y_c"]}
            text={use_data["projects"][i]["description"]}
            wrap="word"
            width={300}
            fill="#333388"
            visible={project.visible}
          />
        ))}
      </Layer>
        {/* SPRINTS LINES, NODES, AND TEXT */} 
      <Layer>
        {st_projects.map((project, i) => (
          <Line
            key={"pr_line_" + i}
            id={"pr_line_" + i}
            x={design_params["core"]["x_c"]}
            y={design_params["core"]["y_c"]}
            points={[
              polarToCartesian(design_params["design"]["spacing"], design_params["design"]["label_angle"] * i)[0],
              polarToCartesian(design_params["design"]["spacing"], design_params["design"]["label_angle"] * i)[1], 
              polarToCartesian(design_params["design"]["spacing"] * 2, design_params["design"]["label_angle"] * i)[0], 
              polarToCartesian(design_params["design"]["spacing"] * 2, design_params["design"]["label_angle"] * i)[1]]}
            tension={0.5}
            stroke="black" />
        ))}
        {st_projects.map((project, i) => (
          <Circle
            key={"pr_node_" + i}
            id={"pr_node_" + i}
            x={polarToCartesian(design_params["design"]["spacing"] * 2, design_params["design"]["label_angle"] * i)[0] + design_params["core"]["x_c"]}
            y={polarToCartesian(design_params["design"]["spacing"] * 2, design_params["design"]["label_angle"] * i)[1] + design_params["core"]["y_c"]}
            radius={4}
            fill="#0"
            onmouseenter={showProjectText}
            onmouseleave={hideProjectText}
          />
        ))}
        {st_projects.map((project, i) => (
          <Text
            key={"pr_text_" + i}
            id={"pr_text_" + i}
            x={polarToCartesian(design_params["design"]["spacing"] * 2, design_params["design"]["label_angle"] * i)[0] + design_params["core"]["x_c"]}
            y={polarToCartesian(design_params["design"]["spacing"] * 2, design_params["design"]["label_angle"] * i)[1] + design_params["core"]["y_c"]}
            text={use_data["projects"][i]["description"]}
            wrap="word"
            width={300}
            fill="#333388"
            visible={project.visible}
          />
        ))}
      </Layer>
      <Layer>
        {/* TODOS LINES, NODES, AND TEXT */} 
        {st_projects.map((project, i) => (
          <Line
            key={"pr_line_" + i}
            id={"pr_line_" + i}
            x={design_params["core"]["x_c"]}
            y={design_params["core"]["y_c"]}
            points={[
              polarToCartesian(design_params["design"]["spacing"], design_params["design"]["label_angle"] * i)[0],
              polarToCartesian(design_params["design"]["spacing"], design_params["design"]["label_angle"] * i)[1], 
              polarToCartesian(design_params["design"]["spacing"] * 2, design_params["design"]["label_angle"] * i)[0], 
              polarToCartesian(design_params["design"]["spacing"] * 2, design_params["design"]["label_angle"] * i)[1]]}
            tension={0.5}
            stroke="black" />
        ))}
        {st_projects.map((project, i) => (
          <Circle
            key={"pr_node_" + i}
            id={"pr_node_" + i}
            x={polarToCartesian(design_params["design"]["spacing"] * 2, design_params["design"]["label_angle"] * i)[0] + design_params["core"]["x_c"]}
            y={polarToCartesian(design_params["design"]["spacing"] * 2, design_params["design"]["label_angle"] * i)[1] + design_params["core"]["y_c"]}
            radius={4}
            fill="#0"
            onmouseenter={showProjectText}
            onmouseleave={hideProjectText}
          />
        ))}
        {st_projects.map((project, i) => (
          <Text
            key={"pr_text_" + i}
            id={"pr_text_" + i}
            x={polarToCartesian(design_params["design"]["spacing"] * 2, design_params["design"]["label_angle"] * i)[0] + design_params["core"]["x_c"]}
            y={polarToCartesian(design_params["design"]["spacing"] * 2, design_params["design"]["label_angle"] * i)[1] + design_params["core"]["y_c"]}
            text={use_data["projects"][i]["description"]}
            wrap="word"
            width={300}
            fill="#333388"
            visible={project.visible}
          />
        ))}
      </Layer>
    </Stage>
  )
};

export default App;