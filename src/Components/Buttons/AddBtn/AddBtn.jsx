import React from 'react';
import styles from './AddBtn.module.css';

const AddBtn = (props) => {
    const { handleClick } = props;
    return (
        <button type="button" id={styles.AddBtn} onClick={handleClick}>
            Add
        </button>
    );
};

export default AddBtn;
