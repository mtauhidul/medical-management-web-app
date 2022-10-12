/* eslint-disable import/no-cycle */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { db } from '../../API/firebase';
import { DataContext } from '../../App';
import RecepCard from '../../Components/Cards/RecepCard/RecepCard';
import Del from '../../Modals/Del/Del';
import Update from '../../Modals/Update/Update';

const Receptionists = () => {
    const [info, setInfo] = useContext(DataContext);
    const [open, setOpen] = useState(null);
    const [drData, setDrData] = useState([]);
    const [drId, setDrId] = useState(null);
    const [state, setState] = useState({});

    const myFunction = () => {
        setState({
            name: 'Jhon',
            surname: 'Doe',
        });
    };

    useEffect(() => {
        const citiesRef = db.collection('receptionists');
        citiesRef.onSnapshot((querySnapshot) => {
            const drList = [];
            querySnapshot.forEach((doc) => {
                const item = doc.data();
                const appObj = {
                    name: item?.name,
                    email: item?.email,
                    phone: item?.phone,
                    id: doc.id,
                };
                drList.push(appObj);
            });
            setDrData(drList);
        });
    }, []);

    const onOpenModal = () => {
        setOpen(true);
    };

    const handleDelData = (id) => {
        setInfo({
            method: 'del',
            type: 'receptionist',
            collection: 'receptionists',
            id,
            onOpenModal,
        });
    };

    const handleUpdateData = (id) => {
        setInfo({
            method: 'update',
            type: 'receptionist',
            collection: 'receptionists',
            id,
            onOpenModal,
        });
    };

    return (
        <Container fluid>
            {drData.map((data, index) => (
                <RecepCard
                    key={data.id}
                    handleUpdateData={handleUpdateData}
                    handleDelData={handleDelData}
                    data={data}
                    index={index}
                />
            ))}
            <Update />
            <Del />
        </Container>
    );
};

export default Receptionists;
