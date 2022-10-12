/* eslint-disable no-alert */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Container } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { db } from '../../API/firebase';
import styles from './ReceptionistLogin.module.css';

const ReceptionistLogin = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const onSubmit = (data) => {
        async function queryData() {
            const ref = db.collection('receptionists');
            const queryRef = ref.where('email', '==', data.email);
            await queryRef.get().then((res) => {
                if (res.empty) {
                    toString.error('Not registered');
                } else if (!res.empty) {
                    toast.success('Successful');
                }
            });
        }

        queryData();
    };

    return (
        <Container fluid className={styles.ReceptionistLoginContainer}>
            <div className={styles.ReceptionistLoginWrapper}>
                <h1>Receptionist Login</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="text"
                        placeholder="Receptionist Email"
                        {...register('email', { required: true })}
                    />

                    <input type="submit" />
                </form>
            </div>
        </Container>
    );
};

export default ReceptionistLogin;
