/* eslint-disable import/no-cycle */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react';
import { DataContext } from '../../../App';
import Del from '../../../Modals/Del/Del';
import styles from './Table.module.css';
import styles2 from './Table2.module.css';

const Table2 = ({ items, selectedAlert, handleUpdateData }) => {
    const [info, setInfo] = useContext(DataContext);
    const [open, setOpen] = useState(null);
    const handleUpdate = (item) => {
        handleUpdateData(item);
    };

    const onOpenModal = () => {
        setOpen(true);
    };

    const handleDelData = (id) => {
        setInfo({
            method: 'del',
            type: 'alert',
            collection: 'alerts',
            id,
            onOpenModal,
        });
    };

    return (
        <div className={[styles.tableContainer].join(' ')}>
            <table>
                <tbody>
                    {items.map((item, index) => (
                        <tr className={[styles.tableRow].join(' ')} key={index}>
                            <td className={[styles.tdNumber]}>
                                <div>{index + 1}</div>
                            </td>
                            <td style={{ width: '65%' }}>{item?.name}</td>

                            <td className={styles.circle}>
                                <div
                                    style={{
                                        backgroundColor: `${item.bg}`,
                                        border: `2px solid ${item.border}`,
                                    }}
                                />
                            </td>

                            <td className={[styles.tdBtn, styles2.iconBtn].join(' ')}>
                                <button>
                                    <FontAwesomeIcon
                                        onClick={() => handleUpdate(item)}
                                        icon={faPen}
                                    />
                                </button>{' '}
                                <button
                                    onClick={() => handleDelData(item.id)}
                                    id={styles.alertDelBtn}
                                >
                                    <i className="fa fa-trash" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Del />
        </div>
    );
};

export default Table2;
