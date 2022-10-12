/* eslint-disable react/destructuring-assignment */
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styles from './AddAlertBtn.module.css';

const AddAlertBtn = (props) => {
    return (
        <button
            type="button"
            style={{ padding: '0' }}
            id={styles.AddAlertBtn}
            onClick={props.handleClick}
        >
            <FontAwesomeIcon className={styles.plusIcon} icon={faPlusCircle} size="3x" />
        </button>
    );
};

export default AddAlertBtn;
