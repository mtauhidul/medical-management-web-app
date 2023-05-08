/* eslint-disable import/no-cycle */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { db } from '../../API/firebase';
import { DataContext } from '../../App';
import DrCard from '../../Components/Cards/DrCard/DrCard';
import Del from '../../Modals/Del/Del';
import Update from '../../Modals/Update/Update';

const Doctors = () => {
    const [info, setInfo] = useContext(DataContext);
    const [open, setOpen] = useState(null);
    const [drData, setDrData] = useState([]);
    const [drId, setDrId] = useState(null);
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

    const handleDelData = (id) => {
        setInfo({
            method: 'del',
            type: 'doctor',
            collection: 'dashboard',
            id,
            onOpenModal,
        });
    };

    const handleUpdateData = (id) => {
        setInfo({
            method: 'update',
            type: 'doctor',
            collection: 'dashboard',
            id,
            onOpenModal,
        });
    };

    // console.log(drData.rooms);

    return (
        <Container fluid>
            {data.map((pass, index) => (
                <DrCard
                    key={index}
                    data={pass}
                    index={index}
                    handleDelData={handleDelData}
                    handleUpdateData={handleUpdateData}
                />
            ))}
            <Del />
            <Update />
        </Container>
    );
};

export default Doctors;
