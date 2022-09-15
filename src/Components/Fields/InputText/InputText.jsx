import React from 'react';
import styles from './InputText.module.css';

const InputText = (props) => {
    const { value } = props;
    return (
        <>
            <label className={styles.labelField} htmlFor="InputTextField">
                {value}
            </label>
            <input
                className={styles.InputTextField}
                type="text"
                name="InputText"
                id="InputTextField"
                placeholder={value}
            />
        </>
    );
};

export default InputText;
