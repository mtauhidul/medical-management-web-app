/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-onchange */
/* eslint-disable no-undef */
/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Modal from 'react-responsive-modal';
import { db } from '../../../API/firebase';
import { DataContext } from '../../../App';
import SaveBtn from '../../Buttons/SaveBtn/SaveBtn';
import styles from './AssistantsCard.module.css';

const Connect = (props) => {
    const [info, setInfo] = useContext(DataContext);
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({});
    const [drId, setDrId] = useState('');
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);

    const myFunction = () => {
        setState({
            name: 'Jhon',
            surname: 'Doe',
        });
    };

    useEffect(() => {
        const citiesRef = db.collection('dashboard');
        citiesRef.onSnapshot((querySnapshot) => {
            const drList = [];
            querySnapshot.forEach((doc) => {
                const item = doc.data();
                const appObj = {
                    dr: item?.dr,
                    id: doc.id,
                };
                drList.push(appObj);
            });
            setData(drList);
        });
    }, []);

    useEffect(() => {
        if (info.onOpenModal !== undefined && info.method === 'con') {
            info.onOpenModal = onOpenModal();
        }
    }, [info]);

    const drSelect = (e) => {
        e.preventDefault();
        setDrId(e.target.value);
    };

    async function updateDr() {
        const cityRef = db.collection('assistants').doc(info.id);
        const res = await cityRef.update({ dr: drId });
        onCloseModal();
        toast.success('Doctor connected');
    }

    return (
        <div>
            <Modal className={styles.modal} open={open} onClose={onCloseModal} center>
                <h4>Connect to the doctor</h4>
                <br />
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        padding: '0px 30px',
                    }}
                >
                    <label style={{ marginRight: 'auto' }} htmlFor="DrSelect">
                        <span style={{ fontWeight: '500', marginBottom: '10px' }}>
                            Choose a doctor
                        </span>
                    </label>
                    <div className={styles.wrapper}>
                        <select
                            name="DrSelect"
                            id="DrSelect"
                            onChange={(e) => drSelect(e)}
                            className={styles.DrSelect}
                        >
                            <option>Select Doctor</option>
                            {data.map((dr) => (
                                <option key={dr.id} value={dr.id}>
                                    {dr.id}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <br />
                <div style={{ margin: '0 auto !important', width: '100%', paddingLeft: '135px' }}>
                    <SaveBtn handleClick={updateDr} name="Save" />
                </div>
            </Modal>
        </div>
    );
};

export default Connect;
