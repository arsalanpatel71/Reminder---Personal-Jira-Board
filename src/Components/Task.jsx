import { createRef } from "react";
import ContentEditable from "react-contenteditable";
import { FaTimes } from "react-icons/fa";

const Task = (props) => {
  return (
    <div className="task ascend" tabIndex={0}>
      <div className="taskTopper">
        <FaTimes
          className="redButton"
          onClick={props.handleDeleteTask}
          style={{ cursor: "pointer" }}
        />
        <div
          className={`taskColor`}
          style={{
            backgroundColor: props.color,
          }}
        />
        <ContentEditable
          innerRef={createRef()}
          html={props.name}
          disabled={false}
          onChange={() => {}}
          onBlur={(e) => {
            props.handleChangeTask({
              ...props,
              name: e.target.innerText,
            });
          }}
          tagName="h2"
          className="taskHeader"
        />
      </div>
      <ContentEditable
        placeholder="Description"
        innerRef={createRef()}
        html={props.description}
        disabled={false}
        onChange={() => {}}
        onBlur={(e) => {
          props.handleChangeTask({
            ...props,
            description: e.target.innerText,
          });
        }}
        tagName="p"
        className="taskDescription"
      />
    </div>
  );
};

export default Task;
