import React from 'react';
import styles from './ResetBtn.module.css';

const ResetBtn = (props) => {
    const { handleClick } = props;
    return (
        <button type="button" id={styles.ResetBtn} onClick={handleClick}>
            Reset
        </button>
    );
};

export default ResetBtn;
