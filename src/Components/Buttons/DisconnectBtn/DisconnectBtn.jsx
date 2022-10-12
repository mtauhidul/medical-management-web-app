import React from 'react';
import styles from './DisconnectBtn.module.css';

const DisconnectBtn = (props) => {
    const { handleClick } = props;
    return (
        <button type="button" id={styles.DisconnectBtn} onClick={handleClick}>
            Disconnect
        </button>
    );
};

export default DisconnectBtn;
