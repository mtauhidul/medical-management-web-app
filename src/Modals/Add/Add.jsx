/* eslint-disable consistent-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { db } from '../../API/firebase';
import { DataContext } from '../../App';
import SaveBtn from '../../Components/Buttons/SaveBtn/SaveBtn';
import styles from '../Styles/modal.module.css';
import ValidateEmail from '../Validator/Validator';

const Add = () => {
  const [info, setInfo] = useContext(DataContext);
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const [colorName, setColorName] = useState(null);
  const [activityType, setActivityType] = useState('');

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const colors = [
    { border: '#F2D775', bg: '#FDF8E5' },
    { border: '#62BFF2', bg: '#E1F3FD' },
    { border: '#939DFF', bg: '#DFE2FF' },
    { border: '#74C387', bg: '#E5F4E8' },
    { border: '#FC6666', bg: '#FED1D1' },
    { border: '#DDDDDD', bg: '#FFFFFF' },
    { border: '#487D36', bg: '#DCE6D9' },
    { border: '#1F7E74', bg: '#D4E6E5' },
    { border: '#3842AB', bg: '#DADBF0' },
    { border: '#F8FB66', bg: '#FEFEE2' },
    { border: '#78F275', bg: '#E5FEE5' },
    { border: '#EE5997', bg: '#FCDFEB' },
    { border: '#FA710D', bg: '#FEE4D2' },
    { border: '#E485F3', bg: '#FAE8FD' },
    { border: '#86E8EF', bg: '#E8FBFC' },
    { border: '#C4E6E9', bg: '#F4FAFB' },
    { border: '#3a405a', bg: '#aec5eb' },
    { border: '#27FB6B', bg: '#0A2E36' },
    { border: '#3E92CC', bg: '#0A2463' },
    { border: '#F71735', bg: '#011627' },
    { border: '#1A936F', bg: '#114B5F' },
    { border: '#FBF2C0', bg: '#48392A' },
    { border: '#305252', bg: '#77878B' },
    { border: '#270722', bg: '#ECCE8E' },
    { border: '#FFBA49', bg: '#20A39E' },
    { border: '#465775', bg: '#EF6F6C' },
    { border: '#131200', bg: '#78BC61' },
    { border: '#01295F', bg: '#FE5D26' },
  ];

  const colorSetter = (color) => {
    setData({ ...data, bg: color.bg, border: color.border });
    if (data.sound) {
      setData({ ...data, sound: false });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    async function storeData() {
      if (info.collection === null) {
        return false;
        // eslint-disable-next-line no-else-return
      } else {
        const aTuringRef = db.collection(info.collection).doc(data.name);

        await aTuringRef.set(data);

        toast.success(`${info.type} created successfully`);

        setInfo({});
      }
    }

    storeData();
    onCloseModal();
  };

  const onCheck = () => {
    setData({ ...data, sound: true });
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (info.type === 'doctor') {
      setData({
        ...data,
        [e.target.name]: e.target.value,
        count: [],
        rooms: [],
      });
    } else if (info.type === 'assistant') {
      setData({ ...data, [e.target.name]: e.target.value, dr: '' });
    } else if (info.type === 'room') {
      setData({
        ...data,
        blink: false,
        [e.target.name]: e.target.value,
        alert: {
          name: '',
          bg: '',
          border: '',
        },
      });
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const handleChangeActivityType = (e) => {
    setActivityType(e.target.value);
    setData({ ...data, activityType: e.target.value });
  };

  const emailValidation = (e) => {
    e.preventDefault();
    const res = ValidateEmail(e.target.value);
    setData({ ...data, email: res });
  };

  useEffect(() => {
    if (info.onOpenModal !== undefined && info.method === 'add') {
      info.onOpenModal = onOpenModal();
    }
  }, [info]);

  return (
    <div>
      <Modal className={styles.modal} open={open} onClose={onCloseModal} center>
        <h4>
          Add <span>{info.type}</span>
        </h4>
        <br />
        <form
          id='addRoomForm'
          onSubmit={handleSubmit}
          className={styles.addRoomForm}>
          <label htmlFor='name'>Name</label>
          <input
            required
            onChange={(e) => handleChange(e)}
            type='text'
            name='name'
            id='name'
          />
          {(info.type === 'doctor' ||
            info.type === 'assistant' ||
            info.type === 'receptionist') && (
            <>
              <label htmlFor='email'>Email</label>
              <input
                required
                onBlur={(e) => emailValidation(e)}
                type='text'
                name='email'
                id='email'
              />
            </>
          )}
          {(info.type === 'doctor' ||
            info.type === 'assistant' ||
            info.type === 'receptionist') && (
            <>
              <label htmlFor='phone'>Phone Number</label>
              <input
                required
                onChange={(e) => handleChange(e)}
                type='number'
                name='phone'
                id='phone'
              />
            </>
          )}
          {info.type === 'alert' && (
            <>
              <label htmlFor='color'>Color</label>
              <div className={styles.ccWrapper}>
                <div className={styles.ccContainer}>
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      value={colorName}
                      className={[styles.colorContainer]}
                      onClick={() => colorSetter(color)}
                      style={{
                        border: `2px solid${color.border}`,
                        borderRadius: '50%',
                        backgroundColor: `${color.bg}`,
                      }}>
                      <input type='radio' name='cc' id='cc' />
                      <div />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {info.type === 'alert' ? (
            <div>
              <label style={{ height: '16px', color: 'green' }}>
                <input
                  onChange={() => onCheck()}
                  style={{ marginRight: '7px', marginTop: '3px' }}
                  type='checkbox'
                  name='Add notification sound'
                  id=''
                />
                Add notification sound
              </label>
            </div>
          ) : (
            <div />
          )}
          {info.type === 'alert' && (
            <FormControl fullWidth>
              <InputLabel id='demo-select-small'>Activity Type</InputLabel>
              <Select
                labelId='demo-select-small'
                id='demo-select-small'
                value={activityType}
                label='Activity Type'
                onChange={handleChangeActivityType}>
                <MenuItem value='patient'>Patient</MenuItem>
                <MenuItem value='doctor'>Doctor</MenuItem>
                <MenuItem value='staff'>Staff</MenuItem>
              </Select>
            </FormControl>
          )}
          {info.type === 'doctor' && (
            <>
              <label htmlFor='role'>Role</label>
              <input
                required
                onChange={(e) => handleChange(e)}
                type='text'
                name='role'
                id='role'
              />
            </>
          )}
          <br />
          <SaveBtn name='Save' />
        </form>
      </Modal>
    </div>
  );
};

export default Add;
