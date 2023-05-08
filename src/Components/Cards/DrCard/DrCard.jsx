/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
/* eslint-disable react/button-has-type */
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styles from './DrCard.module.css';

const DrCard = (props) => {
    const { key, id, name, email, phone, rooms } = props.data;
    const { index, handleUpdateData, handleDelData } = props;

    const updateHandler = (event, id) => {
        event.stopPropagation();
        handleUpdateData(id);
    };

    const delHandler = (event, id) => {
        event.stopPropagation();
        handleDelData(id);
    };

    return (
        <>
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
                                <td style={{ width: '10%', marginLeft: '4%' }}>{phone}</td>
                                <td
                                    style={{
                                        width: '15%',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {rooms.map((alert, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    marginLeft: '5px',
                                                    minWidth: '13px',
                                                    minHeight: '13px',
                                                    backgroundColor: `${alert.border}`,
                                                    border: `0.2px solid ${alert.border}`,
                                                    borderRadius: '50%',
                                                }}
                                            />
                                        ))}
                                    </div>
                                </td>
                                <td
                                    style={{
                                        width: '30%',
                                    }}
                                >
                                    <span style={{ marginRight: '5px' }}>Rooms</span>{' '}
                                    {rooms?.map((room) => ` ${room.name}, `)}
                                </td>
                            </div>
                            <td
                                style={{ width: '15%', float: 'right', marginLeft: 'auto' }}
                                className={[styles.tdBtn, styles.iconBtn].join(' ')}
                            >
                                <button onClick={(event) => updateHandler(event, id)}>
                                    <FontAwesomeIcon icon={faPen} />
                                </button>{' '}
                                <button onClick={(event) => delHandler(event, id)}>
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default DrCard;
