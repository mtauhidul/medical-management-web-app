/* eslint-disable import/no-cycle */
import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Nav, Navbar, NavDropdown, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { db } from '../../API/firebase';
import { ApiContext, DataContext } from '../../App';
import SaveBtn from '../../Components/Buttons/SaveBtn/SaveBtn';
import Table2 from '../../Components/Tables/Table2/Table2';
import Add from '../../Modals/Add/Add';
import Update from '../../Modals/Update/Update';
import styles from './Alerts.module.css';

const Alerts = () => {
    const [header, setHeader] = useContext(ApiContext);
    const [info, setInfo] = useContext(DataContext);
    const [open, setOpen] = useState(null);
    const [addState, setAddState] = useState({ modal: false });
    const [editState, setEditState] = useState({ modal: false });
    const [allAlerts, setAllAlerts] = useState([]);
    const [alertId, setAlertId] = useState();
    const [state, setState] = useState({});

    const myFunction = () => {
        setState({
            name: 'Jhon',
            surname: 'Doe',
        });
    };

    const selectModalAdd = () => {
        setAddState({ modal: !addState.modal });
    };

    const selectModalEdit = () => {
        setEditState({ modal: !editState.modal });
    };

    useEffect(() => {
        const citiesRef = db.collection('alerts');
        citiesRef.onSnapshot((querySnapshot) => {
            const alertList = [];
            querySnapshot.forEach((doc) => {
                const item = doc.data();
                const appObj = {
                    name: doc.data().name,
                    bg: doc.data().bg,
                    border: doc.data().border,
                    id: doc.id,
                };
                alertList.push(appObj);
            });
            const sortedList = alertList.sort((a, b) => a.name.localeCompare(b.name));
            setAllAlerts(sortedList);
        });
    }, []);

    const onOpenModal = () => {
        setOpen(true);
    };

    // CRUD
    const handleAddData = () => {
        setInfo({
            method: 'add',
            type: 'alert',
            collection: 'alerts',
            onOpenModal,
        });
    };

    const handleUpdateData = (list) => {
        const { id } = list;
        setInfo({
            method: 'update',
            type: 'alert',
            collection: 'alerts',
            id,
            onOpenModal,
        });
    };

    async function countSelected(value) {
        const aTuringRef = db.collection('counterAlert').doc('yb9ciS93fi2rkrwTWnfm');

        await aTuringRef.set({ value }).then((res) => {
            toast.success(`${value} added`);
        });
    }

    return (
        <Container id={styles.alertsContainer} fluid>
            <Navbar variant="light" bg="light" expand="lg">
                <Container fluid>
                    <Navbar.Toggle aria-controls="navbar-dark-example" />
                    <Navbar.Collapse id="navbar-dark-example">
                        <Nav
                            fluid
                            style={{
                                display: 'flex',
                                justifyContent: 'spaceBetween',
                                width: '100%',
                            }}
                        >
                            <NavDropdown
                                style={{
                                    width: '100%',
                                    minWidth: '300px',
                                    border: '1px dotted lightgrey',
                                    paddingLeft: '15px',
                                }}
                                id="nav-dropdown-dark-example"
                                title="Select for count "
                                menuVariant="dark"
                            >
                                {allAlerts.map((alrt) => {
                                    return (
                                        <NavDropdown.Item onClick={() => countSelected(alrt.name)}>
                                            {alrt.name}
                                        </NavDropdown.Item>
                                    );
                                })}
                            </NavDropdown>
                            <div style={{ height: '10px', width: '20px' }} />
                            <SaveBtn handleClick={handleAddData} name="Add new" />
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Row
                style={{
                    display: 'flex',
                    height: 'auto',
                    minHeight: '85vh',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Col
                    md={12}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        padding: '0px ',
                    }}
                >
                    <div className={styles.alertContainer}>
                        <Table2 items={allAlerts} handleUpdateData={handleUpdateData} />
                    </div>
                </Col>
            </Row>
            <Add />

            <Update />
        </Container>
    );
};

export default Alerts;
