/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/no-cycle */
/* eslint-disable react/no-array-index-key */
import React, { useContext, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';
import {
  addAlert,
  getPatientDetails,
  toggleEmergency,
  updateStatusAndTimestamp,
} from '../../../API/Api';
import { GlobalContext, ModalContext } from '../../../App';
import RBtn from '../../Buttons/RBtn/RBtn';
import styles from './DashCard.module.css';
import MyStopwatch from './MyStopWatch';
import './blinker.css';

const DashCard = (props) => {
  const {
    data,
    room,
    alertSelector,
    openAlertModal,
    selectedAlert,
    docId,
    handler,
    idx,
    waiting,
  } = props;
  const [globalData, updateGlobalData] = useContext(GlobalContext);
  const [mod, setMod] = useContext(ModalContext);

  const apiCall = () => {
    addAlert({
      activityType: selectedAlert?.activityType,
      docId,
      arrIndex: idx,
      alert: '',
      bg: '',
      border: '',
      blink: false,
    });

    updateStatusAndTimestamp({
      activityType: selectedAlert?.activityType,
      docId,
      arrIndex: idx,
      alert: '',
      bg: '',
      border: '',
      blink: false,
    });
  };

  // console.log('==>>', data);

  const resetDashCard = () => {
    handler();
    apiCall();
  };

  const addEmergency = () => {
    if (room.blink === false) {
      toggleEmergency({
        docId,
        idx,
        blink: true,
      });
    } else if (room.blink === true) {
      toggleEmergency({
        docId,
        idx,
        blink: false,
      });
    }
  };

  const [patientData, setPatientData] = useState({});

  const getPatient = async () => {
    const response = await getPatientDetails(data.id, room.name);
    setPatientData(response);
  };

  // console.log(patientData);

  useEffect(() => {
    getPatient();
  }, [room.alert]);

  return (
    <div>
      {room.blink ? (
        <div onClick={handler}>
          <Card id='alarming' className={styles.dashCard}>
            <Card.Header className={styles.roomCardTop}>
              <div className={styles.topLeft}>
                <span>{room.name}</span>
                <RBtn handleClick={resetDashCard} />
              </div>
              <button
                data-tip='emergency'
                onClick={() => addEmergency(docId, idx, room)}
                id='emergencyBtn'
                type='button'>
                <i className='fa fa-bell' />
              </button>
              <ReactTooltip>
                <small> Emergency Button</small>
              </ReactTooltip>
              <div className={styles.timer}>
                <span>{room.alert ? <MyStopwatch /> : '00:00'}</span>
              </div>
            </Card.Header>
            <Card.Body className={styles.roomCardMid}>
              <div
                onClick={() =>
                  waiting === 0 && alert === 'Empty' ? null : openAlertModal()
                }
                style={{
                  backgroundColor: `${room.bg}`,
                  borderColor: `${room.border}`,
                  cursor: 'pointer',
                }}
                className={styles.alert}>
                {room.alert === '' || room.alert === 'Empty' ? (
                  <span style={{ color: 'white' }}>{room.count}</span>
                ) : (
                  <span style={{ color: `${room.border}` }}>{room.count}</span>
                )}
              </div>
              <div>
                <div className={styles.wrapper}>{room.alert || 'Empty'}</div>
              </div>
            </Card.Body>
          </Card>
        </div>
      ) : (
        <div onClick={handler}>
          <Card className={styles.dashCard}>
            <Card.Header className={styles.roomCardTop}>
              <div className={styles.topLeft}>
                <span>{room.name}</span>
                <RBtn handleClick={resetDashCard} />
              </div>
              <button
                data-tip='emergency'
                onClick={() => addEmergency(docId, idx, room)}
                id='emergencyBtn'
                type='button'>
                <i className='fa fa-bell' />
              </button>
              <ReactTooltip>
                <small> Emergency Button</small>
              </ReactTooltip>
              <div className={styles.timer}>
                <span>{room.alert ? <MyStopwatch /> : '00:00'}</span>
              </div>
            </Card.Header>
            <Card.Body className={styles.roomCardMid}>
              <div
                onClick={() =>
                  waiting === 0 && (room.alert === '' || room.alert === 'Empty')
                    ? null
                    : openAlertModal()
                }
                style={{
                  backgroundColor: `${room.bg}`,
                  borderColor: `${room.border}`,
                  cursor: 'pointer',
                }}
                className={styles.alert}>
                {room.alert === '' || room.alert === 'Empty' ? (
                  <span style={{ color: 'white' }}>{room.count}</span>
                ) : (
                  <span style={{ color: `${room.border}` }}>{room.count}</span>
                )}
              </div>
              <div>
                <div className={styles.wrapper}>
                  {room.alert || 'Empty'} <br />{' '}
                  <small style={{ color: 'blue' }}>
                    {patientData?.patient
                      ? patientData?.patient.split(', ')[1] +
                        ' ' +
                        patientData?.patient.split(', ')[0]
                      : 'Patient Name'}
                  </small>{' '}
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DashCard;
