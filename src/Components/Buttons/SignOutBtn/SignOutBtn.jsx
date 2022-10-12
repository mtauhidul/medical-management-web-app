import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styles from './SignOutBtn.module.css';

const SignOutBtn = (props) => {
    const { handleClick } = props;
    return (
        <button type="button" id={styles.SignOutBtn} onClick={handleClick}>
            <FontAwesomeIcon className={styles.plusIcon} icon={faSignOutAlt} size="2x" /> Sign Out
        </button>
    );
};

export default SignOutBtn;
