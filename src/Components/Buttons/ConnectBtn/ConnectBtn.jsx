import React from 'react';
import styles from './ConnectBtn.module.css';

const ConnectBtn = (props) => {
    const { handleClick, name } = props;
    return (
        <button type="button" id={styles.ConnectBtn} onClick={handleClick}>
            {name}
        </button>
    );
};

export default ConnectBtn;
