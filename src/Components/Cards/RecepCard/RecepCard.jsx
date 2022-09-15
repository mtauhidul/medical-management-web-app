/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
/* eslint-disable react/button-has-type */
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styles from './RecepCard.module.css';

const RecepCard = (props) => {
    const { id, name, email, phone } = props.data;
    const { index, handleUpdateData, handleDelData } = props;

    const alerts = [
        { border: '#63BFF2', bg: '#63BFF2' },
        { border: '#939DFF', bg: '#939DFF' },
        { border: '#F2D775', bg: '#F2D775' },
        { border: '#74C386', bg: '#74C386' },
        { border: '#FC6666', bg: '#FC6666' },
        { border: '#DDDDDD', bg: '#FFFFFF' },
    ];

    const url = window.location.href;

    return (
        <div className={[styles.tableContainer].join(' ')}>
            <table>
                <tbody>
                    <tr className={[styles.tableRow].join(' ')} key={id}>
                        <td
                            style={{ width: '40px', marginRight: '10px', height: 'inherit' }}
                            className={styles.tdNumber}
                        >
                            <div>
                                <span>{index + 1}</span>
                            </div>
                        </td>
                        <div className={styles.innerRow}>
                            <td style={{ width: '20%' }}>{id}</td>
                            <td style={{ width: '25%' }}>{email}</td>
                            <td style={{ width: '10%' }}>{phone}</td>
                        </div>
                        <td
                            style={{ width: '10%', float: 'right', marginLeft: 'auto' }}
                            className={[styles.tdBtn, styles.iconBtn].join(' ')}
                        >
                            <button onClick={() => handleUpdateData(id)}>
                                <FontAwesomeIcon icon={faPen} />
                            </button>{' '}
                            <button onClick={() => handleDelData(id)}>
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default RecepCard;
