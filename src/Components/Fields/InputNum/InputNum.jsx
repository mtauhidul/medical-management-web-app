import React from 'react';
import styles from './InputNum.module.css';

const InputNum = (props) => {
    const { value } = props;
    return (
        <>
            <label className={styles.labelField} htmlFor="InputNumField">
                {value}
            </label>
            <input
                className={styles.InputNumField}
                type="number"
                name="InputNum"
                id="InputNumField"
                placeholder={value}
            />
        </>
    );
};

export default InputNum;
