/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-cycle */
/* eslint-disable react/button-has-type */
import { useContext, useEffect, useState } from 'react';
import { db } from '../../API/firebase';
import { ModalContext } from '../../App';
import ModalComponent from './ModalComponent';

function App() {
    const [mod, setMod] = useContext(ModalContext);
    const [open, setOpen] = useState(false);
    const [detail, setDetail] = useState(null);
    const onOpenModal = () => {
        setOpen(true);
    };
    const [state, setState] = useState({});

    const myFunction = () => {
        setState({
            name: 'Jhon',
            surname: 'Doe',
        });
    };

    const [items, setItems] = useState([]);

    const myArr = [
        {
            id: 1,
            name: 'Assistant In',
        },
        {
            id: 2,
            name: 'Assistant Required',
        },
        {
            id: 3,
            name: 'Doctor In',
        },
        {
            id: 4,
            name: 'Doctor Required',
        },
        {
            id: 5,
            name: 'Patient In',
        },
        {
            id: 6,
            name: 'Financial In',
        },
        {
            id: 7,
            name: 'Financial Required',
        },
        {
            id: 8,
            name: 'Emergency',
        },
        {
            id: 9,
            name: 'Empty',
        },
    ];

    useEffect(() => {
        const citiesRef = db.collection('alerts');
        citiesRef.onSnapshot((querySnapshot) => {
            const alertList = [];
            querySnapshot.forEach((doc) => {
                const appObj = {
                    id: doc.id,
                    sound: doc.data().sound,
                    name: doc.data().name || '',
                    bg: doc.data().bg || '',
                    border: doc.data().border || '',
                };
                alertList.push(appObj);
            });
            setItems(alertList);
        });

        if (mod.onOpenModal !== undefined) {
            mod.onOpenModal = onOpenModal();
        }
        myFunction();
        return () => {
            setState({}); // This worked for me
        };
    }, [mod]);

    // console.log(mod.onOpenModal);

    return (
        <div style={{ textAlign: 'center' }}>
            <ModalComponent
                items={items}
                open={open}
                setOpen={setOpen}
                detail={detail}
                setDetail={setDetail}
            />
        </div>
    );
}

export default App;
