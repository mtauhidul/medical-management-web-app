/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-cycle */
import React, { useContext, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useRouteMatch } from 'react-router';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { DataContext } from '../../App';
import SaveBtn from '../../Components/Buttons/SaveBtn/SaveBtn';
import Add from '../../Modals/Add/Add';
import Assistants from '../TabMenus/Assistants';
import Receptionists from '../TabMenus/Receptionists';
import Doctors from './Doctors';
import styles from './Stuff.module.css';

const Stuff = () => {
    const { path, url } = useRouteMatch();
    const [info, setInfo] = useContext(DataContext);
    const [open, setOpen] = useState(null);

    const onOpenModal = () => {
        setOpen(true);
    };

    const handleAddDrData = () => {
        setInfo({
            method: 'add',
            type: 'doctor',
            collection: 'dashboard',
            onOpenModal,
        });
    };

    const handleAddAsData = () => {
        setInfo({
            method: 'add',
            type: 'assistant',
            collection: 'assistants',
            onOpenModal,
        });
    };

    const handleAddReData = () => {
        setInfo({
            method: 'add',
            type: 'receptionist',
            collection: 'receptionists',
            onOpenModal,
        });
    };

    return (
        <Router>
            <Container fluid style={{ padding: '30px' }} className={styles.stuff_container}>
                <Row className={styles.stuff_wrapper}>
                    <Col md={8} xs={12} style={{ maxWidth: '510px' }}>
                        <ul
                            className={styles.tabLinks}
                            style={{
                                listStyleType: 'none',
                                padding: '0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                height: '50px',
                            }}
                        >
                            <li>
                                <Link to={`${path}/doctors`}>Doctors</Link>
                            </li>
                            <li>
                                <Link to={`${path}/assistants`}>Assistants</Link>
                            </li>
                            <li>
                                <Link to={`${path}/receptionists`}>Receptionists</Link>
                            </li>
                        </ul>
                    </Col>
                    <Col
                        md={4}
                        xs={12}
                        className={styles.button_wrapper}
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                        <Switch>
                            <Route path={`${path}/doctors`}>
                                <SaveBtn handleClick={handleAddDrData} name="Add new" />
                            </Route>
                        </Switch>
                        <Switch>
                            <Route path={`${path}/assistants`}>
                                <SaveBtn handleClick={handleAddAsData} name="Add new" />
                            </Route>
                        </Switch>
                        <Switch>
                            <Route path={`${path}/receptionists`}>
                                <SaveBtn handleClick={handleAddReData} name="Add new" />
                            </Route>
                        </Switch>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col md={12} xs={12}>
                        <div>
                            <Switch>
                                <Route path={`${path}/doctors`}>
                                    <Doctors />
                                </Route>
                            </Switch>
                        </div>

                        <div>
                            <Switch>
                                <Route path={`${path}/assistants`}>
                                    <Assistants />
                                </Route>
                            </Switch>
                        </div>
                        <div>
                            <Switch>
                                <Route path={`${path}/receptionists`}>
                                    <Receptionists />
                                </Route>
                            </Switch>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Add />
        </Router>
    );
};

export default Stuff;
