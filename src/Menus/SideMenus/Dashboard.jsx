/* eslint-disable consistent-return */
/* eslint-disable no-else-return */
/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-cycle */
import React, { useContext, useEffect, useState } from 'react';
import { CardDeck, Col, Container, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { addDashData, countUpdate } from '../../API/Api';
import { db } from '../../API/firebase';
import { GlobalContext, ModalContext } from '../../App';
import ResetBtn from '../../Components/Buttons/ResetBtn/ResetBtn';
import StopBtn from '../../Components/Buttons/StopBtn/StopBtn';
import DashCard from '../../Components/Cards/DashCard/DashCard';
import App from '../../Modals/ModalComponent/App';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [mod, setMod] = useContext(ModalContext);
    const [globalData, updateGlobalData] = useContext(GlobalContext);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [state, setState] = useState({});

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
                    email: item?.email,
                    phone: item?.phone,
                    count: item?.count,
                    role: item?.role,
                    rooms: item?.rooms,
                    id: doc.id,
                };
                drList.push(appObj);
            });
            setData(drList);
        });
    }, []);

    const onOpenModal = () => {
        setOpen(true);
    };

    const openAlertModal = () => {
        setMod({
            onOpenModal,
        });
    };

    const reset = (doc) => {
        const emptyRooms = [];
        const newRooms = doc.rooms.map((room) => {
            const rObj = {
                alert: '',
                bg: '',
                border: '',
                id: room.id,
                name: room.id,
                blink: false,
            };
            emptyRooms.push(rObj);
        });
        addDashData({
            dr: {
                dr: doc.dr,
                email: doc.email,
                phone: doc.phone,
                count: doc.count,
                id: doc.id,
            },
            rooms: emptyRooms,
        });
    };

    const countUp = (doc) => {
        countUpdate({
            id: doc.id,
            value: doc.count + 1,
        });
    };

    const countDown = (doc) => {
        if (doc.count === 0) {
            toast.error("Patients can't be less than zero");
        } else {
            countUpdate({
                id: doc.id,
                value: doc.count - 1,
            });
        }
    };

    return (
        <Container fluid id={styles.dashboard}>
            {data.map((doc, index) => (
                <Row key={index} className={styles.drDeck}>
                    <Col md={3} className={styles.drArea}>
                        <div className={styles.drAreaWrapper}>
                            <div className={styles.drAreaTop}>
                                <ResetBtn handleClick={() => reset(doc)} />
                            </div>
                            <div className={styles.drAreaTitle}>
                                <h1>{doc.id}</h1>
                                <p>{doc.role}</p>
                            </div>
                            <div className={styles.drAreaBottom}>
                                <StopBtn handleClick={() => countUp(doc)} sign="Add" />
                                <p
                                    style={{
                                        color: '#FC7E55',
                                        fontWeight: 'bold',
                                        fontSize: '30px',
                                        marginTop: '-9px',
                                    }}
                                >
                                    {doc.count}
                                </p>
                                <StopBtn handleClick={() => countDown(doc)} sign="Remove" />
                            </div>
                        </div>
                    </Col>
                    <Col md={9} sm={8} className={styles.dropBoxParent}>
                        <CardDeck id={styles.DropBox}>
                            {doc.rooms?.map((room, index) => (
                                <DashCard
                                    handler={() =>
                                        updateGlobalData({
                                            ...globalData,
                                            count: doc.count,
                                            arrIndex: index,
                                            docId: doc.id,
                                        })
                                    }
                                    docId={doc.id}
                                    key={room.id}
                                    idx={index}
                                    room={room}
                                    data={doc}
                                    openAlertModal={openAlertModal}
                                />
                            ))}
                        </CardDeck>
                    </Col>
                </Row>
            ))}
            <App />
        </Container>
    );
};

export default Dashboard;
