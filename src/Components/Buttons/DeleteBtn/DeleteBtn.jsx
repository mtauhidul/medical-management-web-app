import React from 'react';
import styles from './DeleteBtn.module.css';

const DeleteBtn = (props) => {
    const { handleClick } = props;
    return (
        <button type="button" id={styles.DeleteBtn} onClick={handleClick}>
            Delete
        </button>
    );
};

export default DeleteBtn;
