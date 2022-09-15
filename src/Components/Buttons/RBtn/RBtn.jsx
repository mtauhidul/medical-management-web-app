import React from 'react';
import styles from './RBtn.module.css';

const RBtn = (props) => {
    const { handleClick } = props;
    return (
        <button type="button" id={styles.RBtn} onClick={handleClick}>
            R
        </button>
    );
};

export default RBtn;
