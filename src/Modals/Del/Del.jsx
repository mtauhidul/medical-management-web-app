/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { db } from '../../API/firebase';
import { DataContext } from '../../App';
import DeleteBtn from '../../Components/Buttons/DeleteBtn/DeleteBtn';
import SaveBtn from '../../Components/Buttons/SaveBtn/SaveBtn';
import styles from '../Styles/modal.module.css';

const Del = () => {
  const [info, setInfo] = useContext(DataContext);
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  async function deleteDocument(e) {
    e.preventDefault();
    const res = await db.collection(info.collection).doc(info.id).delete();
    toast.success(`${info.type} deleted successfully`);
    setInfo({});
    onCloseModal();
  }

  useEffect(() => {
    if (info.onOpenModal !== undefined && info.method === 'del') {
      info.onOpenModal = onOpenModal();
    }
  }, [info]);

  return (
    <div>
      <Modal className={styles.modal} open={open} onClose={onCloseModal} center>
        <h4>
          Delete <span>{info.type}</span>
        </h4>
        <br />
        <h6 style={{ textAlign: 'center', fontWeight: '400' }}>
          Are you sure want to delete {info.type}?
        </h6>
        <br />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            margin: '0 auto',
          }}>
          <SaveBtn handleClick={onCloseModal} name='Cancel' />
          <DeleteBtn handleClick={deleteDocument} />
        </div>
        <br />
      </Modal>
    </div>
  );
};

export default Del;
