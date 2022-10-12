import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styles from './StopBtn.module.css';

const StopBtn = (props) => {
    const { handleClick, name, sign } = props;
    return (
        <button type="button" id={styles.StopBtn} onClick={handleClick}>
            {sign === 'Add' ? (
                <FontAwesomeIcon className={styles.plusIcon} icon={faPlus} />
            ) : (
                <FontAwesomeIcon className={styles.plusIcon} icon={faMinus} />
            )}{' '}
            <span>{name}</span>
        </button>
    );
};

export default StopBtn;
