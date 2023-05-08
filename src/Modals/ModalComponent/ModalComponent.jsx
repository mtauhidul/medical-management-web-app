/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { addAlert, countUpdate } from '../../API/Api';
import { db } from '../../API/firebase';
import { GlobalContext, ModalContext } from '../../App';
import sound from '../../Assets/beep.mp3';
import './ModalBuiltIn.css';
import styles from './ModalComponent.module.css';

const ModalComponent = ({ open, setOpen, items, detail, setDetail }) => {
    const [data, setData] = useState({});
    const [mod, setMod] = useContext(ModalContext);
    const [globalData, updateGlobalData] = useContext(GlobalContext);
    const [counterAlert, setCounterAlert] = useState('');

    const middleIndex = Math.ceil(items.length / 2);
    const leftSideItems = items.slice().splice(0, middleIndex);
    const rightSideItems = items.slice(middleIndex);

    useEffect(() => {
        const citiesRef = db.collection('counterAlert');
        citiesRef.onSnapshot((querySnapshot) => {
            const alertList = [];
            querySnapshot.forEach((doc) => {
                setCounterAlert(doc.data().value);
            });
        });
    }, [setCounterAlert]);

    const apiCall = () => {
        setOpen(false);
    };

    const onCloseModal = (item) => {
        setMod({ ...mod, item });
        if (item !== null) {
            console.log(globalData);

            addAlert({
                docId: globalData.docId,
                arrIndex: globalData.arrIndex,
                alert: item?.name,
                bg: item?.bg,
                border: item?.border,
            });
        }
        const countDown = () => {
            countUpdate({
                id: globalData.docId,
                value: globalData.count - 1,
            });
        };
        if (globalData.count > 0 && item?.name === counterAlert) {
            countDown();
        }
        apiCall();
        if (item?.sound === true) {
            new Audio(sound).play();
        }
    };

    return (
        <div>
            <Modal open={open} onClose={() => setOpen(false)} center>
                <div className={styles.modalContainer}>
                    <div className={styles.rightSideItems}>
                        {leftSideItems.length > 0 &&
                            leftSideItems.map((item, index) => (
                                <div
                                    onClick={() => onCloseModal(item)}
                                    className={
                                        item.id === detail?.id
                                            ? [styles.items, styles.active].join(' ')
                                            : [styles.items].join(' ')
                                    }
                                    key={item.id}
                                >
                                    <div>
                                        <h1
                                            style={{
                                                border: `2.5px solid ${item.border}`,
                                                backgroundColor: `${item.bg}`,
                                                color: `${
                                                    item.name.toLowerCase().includes('required')
                                                        ? '#FC6666'
                                                        : item.border
                                                }`,
                                            }}
                                        >
                                            {item.name.slice(0, 1)}
                                        </h1>
                                        <p>{item.name}</p>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className={styles.middleBorder} />

                    <div className={styles.rightSideItems}>
                        {rightSideItems.length > 0 &&
                            rightSideItems.map((item, index) => (
                                <div
                                    onClick={() => onCloseModal(item)}
                                    className={
                                        item.id === detail?.id
                                            ? [styles.items, styles.active].join(' ')
                                            : [styles.items].join(' ')
                                    }
                                    key={item.id}
                                >
                                    <div>
                                        <h1
                                            style={{
                                                border: `2.5px solid ${item.border}`,
                                                backgroundColor: `${item.bg}`,
                                                color: `${
                                                    item.name.toLowerCase().includes('required')
                                                        ? '#FC6666'
                                                        : item.border
                                                }`,
                                            }}
                                        >
                                            {item.name.slice(0, 1)}
                                        </h1>
                                        <p>{item.name}</p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ModalComponent;
