/* eslint-disable react/destructuring-assignment */
import React from 'react';
import styles from './SaveBtn.module.css';

const SaveBtn = (props) => {
    const { handleClick } = props;
    return (
        <button type="submit" className={styles.SaveBtn} onClick={handleClick}>
            {props.name}
        </button>
    );
};

export default SaveBtn;
