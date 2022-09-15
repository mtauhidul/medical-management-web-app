/* eslint-disable import/no-cycle */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { db } from '../../API/firebase';
import { DataContext } from '../../App';
import AssistantsCard from '../../Components/Cards/AssistantsCard/AssistantsCard';
import Connect from '../../Components/Cards/AssistantsCard/Connect';
import Del from '../../Modals/Del/Del';
import Update from '../../Modals/Update/Update';

const Assistants = () => {
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
        const citiesRef = db.collection('assistants');
        citiesRef.onSnapshot((querySnapshot) => {
            const drList = [];
            querySnapshot.forEach((doc) => {
                const item = doc.data();
                const appObj = {
                    dr: item?.dr,
                    email: item?.email,
                    phone: item?.phone,
                    name: item?.name,
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
            type: 'assistant',
            collection: 'assistants',
            id,
            onOpenModal,
        });
    };

    const handleUpdateData = (id) => {
        setInfo({
            method: 'update',
            type: 'assistant',
            collection: 'assistants',
            id,
            onOpenModal,
        });
    };

    const handleConnectDr = (id) => {
        setInfo({
            method: 'con',
            type: 'assistant',
            collection: 'assistants',
            id,
            onOpenModal,
        });
    };

    return (
        <Container fluid>
            {drData.map((data, index) => (
                <AssistantsCard
                    key={data.id}
                    handleUpdateData={handleUpdateData}
                    handleDelData={handleDelData}
                    handleConnectDr={handleConnectDr}
                    data={data}
                    index={index}
                />
            ))}
            <Update />
            <Del />
            <Connect />
        </Container>
    );
};

export default Assistants;
