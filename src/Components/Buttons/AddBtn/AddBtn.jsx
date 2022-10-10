import React from "react";
import styles from "./AddBtn.module.css";

const AddBtn = (props) => {
  const { handleClick, makeStyle } = props;
  return (
    <button
      type="button"
      id={styles.AddBtn}
      onClick={handleClick}
      style={makeStyle}
    >
      {props.title || "Add"}
    </button>
  );
};

export default AddBtn;
