/* eslint-disable import/no-cycle */
import React, { useContext } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../App';
import styles from './Home.module.css';

const Home = () => {
    const [auth, setAuth] = useContext(AuthContext);
    return (
        <Container fluid className={styles.homeContainer}>
            <div className={styles.homeWrapper}>
                <h1>Care SYNC Web</h1>
                <Link to="/admin/dashboard">
                    <button
                        type="button"
                        onClick={() =>
                            setAuth({
                                provider: 'Admin',
                                collection: 'admin',
                                address: '/admin/dashboard',
                            })
                        }
                        className={styles.homeButtons}
                    >
                        Admin Login
                    </button>
                </Link>
                <br />
                <Link to="/receptionist/dashboard">
                    <button
                        type="button"
                        onClick={() =>
                            setAuth({
                                provider: 'Receptionist',
                                collection: 'receptionists',
                                address: '/receptionist/dashboard',
                            })
                        }
                        className={styles.homeButtons}
                    >
                        Receptionist Login
                    </button>
                </Link>
                <br />
                <Link to="/doctor/self-sequence">
                    <button
                        type="button"
                        onClick={() =>
                            setAuth({
                                provider: 'Doctor',
                                collection: 'dashboard',
                                address: '/doctor/self-sequence',
                            })
                        }
                        className={styles.homeButtons}
                    >
                        Continue as a Doctor
                    </button>
                </Link>
                <br />
                <Link to="/assistant/dashboard">
                    <button
                        type="button"
                        onClick={() =>
                            setAuth({
                                provider: 'Assistant',
                                collection: 'assistants',
                                address: '/assistant/assistant-dashboard',
                            })
                        }
                        className={styles.homeButtons}
                    >
                        Continue as a Assistant
                    </button>
                </Link>
            </div>
        </Container>
    );
};

export default Home;
