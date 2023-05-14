/* eslint-disable no-alert */
/* eslint-disable object-shorthand */
/* eslint-disable jsx-a11y/no-onchange */
/* eslint-disable import/no-cycle */
/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useEffect, useState } from 'react';
import { Card, CardDeck, Col, Container, Row } from 'react-bootstrap';
import { ErrorBoundary } from 'react-error-boundary';
import toast from 'react-hot-toast';
import { addDashData } from '../../API/Api';
import { db } from '../../API/firebase';
import { DataContext, GlobalContext, ModalContext } from '../../App';
import AddAlertBtn from '../../Components/Buttons/AddAllertBtn/AddAlertBtn';
import SaveBtn from '../../Components/Buttons/SaveBtn/SaveBtn';
import RoomCard from '../../Components/Cards/RoomCard/RoomCard';
import DroppedRoom from '../../Components/Rooms/DroppedRoom/DroppedRoom';
import ErrorFallback from '../../ErrorFallback';
import Add from '../../Modals/Add/Add';
import Del from '../../Modals/Del/Del';
import Update from '../../Modals/Update/Update';
import styles from './Sequence.module.css';

const Sequence = () => {
  const [globalData, updateGlobalData] = useContext(GlobalContext);
  const [mod, setMod] = useContext(ModalContext);

  const [info, setInfo] = useContext(DataContext);
  const [roomData, setRoomData] = useState([]);
  const [open, setOpen] = useState(null);
  const [specificDr, setSpecificDr] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [mainData, setMainData] = useState([]);
  const [sequence, setSequence] = useState([]);
  const [state, setState] = useState({});
  const [drList, setDrList] = useState([]);

  const myFunction = () => {
    setState({
      name: 'Jhon',
      surname: 'Doe',
    });
  };

  useEffect(() => {
    const citiesRef = db.collection('dashboard');

    citiesRef.onSnapshot((querySnapshot) => {
      const drArray = [];
      querySnapshot.forEach((doc) => {
        const appObj = {
          id: doc.id,
          name: doc.id,
          email: doc.data().email,
          phone: doc.data().phone,
          count: doc.data().count,
          role: doc.data().role,
          rooms: doc.data().rooms,
          waiting: doc.data().waiting,
        };
        drArray.push(appObj);
      });
      setDrList(drArray);
    });
  }, []);

  useEffect(() => {
    async function getData() {
      const roomList = [];
      const snapshot = await db.collection('rooms').get();
      snapshot.forEach((doc) => {
        const appObj = {
          id: doc.id,
          name: doc.data().name,
          alert: '',
          bg: '',
          border: '',
          blink: doc.data().blink,
        };
        roomList.push(appObj);
      });
      setRoomData(roomList);
    }
    getData();

    updateGlobalData();
    myFunction();
    return () => {
      setState({}); // This worked for me
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomData, specificDr]);

  const onOpenModal = () => {
    setOpen(true);
  };

  const handleAddData = () => {
    setInfo({
      method: 'add',
      type: 'room',
      collection: 'rooms',
      onOpenModal,
    });
  };

  const handleDelData = (id) => {
    setInfo({
      method: 'del',
      type: 'room',
      collection: 'rooms',
      id,
      onOpenModal,
    });
  };

  const handleSearchUpdate = (id) => {
    setInfo({
      method: 'update',
      type: 'room',
      collection: 'rooms',
      id,
      onOpenModal,
    });
  };

  const handleUpdateData = (id) => {
    setInfo({
      method: 'update',
      type: 'room',
      collection: 'rooms',
      id,
      onOpenModal,
    });
  };

  const updateData = () => {
    addDashData(sequence);

    setRooms([]);
    setSpecificDr({});
    updateGlobalData({});
  };

  const drApiCall = (e) => {
    e.preventDefault();

    updateData();
  };

  const drSelect = (e) => {
    const selectedDr = drList.find((dr) => dr.id === e.target.value);

    setSpecificDr(selectedDr);
    setSequence({
      dr: selectedDr,
      rooms: rooms,
    });
  };

  const view = () => {
    // rooms.map((room) =>
    //     setSequence({
    //         ...sequence,
    //         rooms: [
    //             {
    //                 id: room.id,
    //                 room: room.name,
    //                 alert: {
    //                     alert: '',
    //                     bg: '',
    //                     border: '',
    //                 },
    //             },
    //         ],
    //     })
    // );
  };

  const selected = (room) => {
    if (rooms?.find((rm) => rm.id.includes(room.id))) {
      toast.error('Already added');
    } else if (specificDr.rooms?.find((r) => r.id.includes(room.name))) {
      toast.error('Already added');
    } else {
      rooms.push(room);
      view();
    }
  };

  const updateRoomList = (roomList) => {
    setRooms(roomList);
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        document.location.reload(true);
      }}>
      <Container fluid className={styles.sequenceContainer}>
        <div className={styles.sequenceTop}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <label htmlFor='DrSelect'>
                Choose a Doctor
                <div className={styles.wrapper}>
                  <select
                    name='DrSelect'
                    id='DrSelect'
                    onChange={(e) => drSelect(e)}
                    className={styles.DrSelect}>
                    <option value='' />
                    {drList.map((dr, index) => (
                      <option key={index}>{dr.id}</option>
                    ))}
                  </select>
                </div>
              </label>
            </div>
          </div>
          <div style={{ marginTop: '30px' }}>
            <SaveBtn handleClick={drApiCall} name='Save' />
          </div>
        </div>

        <Row>
          <Col md={12} className={styles.dropBoxParent}>
            <div id={styles.DropBox}>
              {rooms.map((room, index) => {
                return (
                  <DroppedRoom
                    room={room}
                    key={index}
                    handleDelData={handleDelData}
                    handleUpdateData={handleUpdateData}
                    selected={selected}
                    specificDr={specificDr}
                    rooms={rooms}
                    updateRoomList={updateRoomList}
                    handleSearchUpdate={handleSearchUpdate}
                  />
                );
              })}
            </div>
          </Col>
        </Row>

        <h2 style={{ marginBottom: '20px', marginLeft: '0px' }}>
          Select rooms to show in the box
        </h2>
        <CardDeck
          style={{
            paddingLeft: '1.6vw',
            display: 'flex',
            flexWrap: 'wrap',
          }}
          className={styles.cardDeckContainer}>
          <Card className={styles.createRoom}>
            <AddAlertBtn handleClick={handleAddData} />
            <span style={{ marginTop: '5px' }}>Add a room</span>
          </Card>
          {roomData.map((room, index) => (
            <RoomCard
              room={room}
              key={index}
              handleDelData={handleDelData}
              handleUpdateData={handleUpdateData}
              selected={selected}
              specificDr={specificDr}
              rooms={rooms}
            />
          ))}
        </CardDeck>

        <Add />
        <Del />
        <Update />
      </Container>
    </ErrorBoundary>
  );
};

export default Sequence;
