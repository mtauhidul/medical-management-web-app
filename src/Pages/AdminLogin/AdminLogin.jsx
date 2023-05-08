/* eslint-disable import/no-cycle */
/* eslint-disable no-alert */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useContext, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { db } from '../../API/firebase';
import { AuthContext, UserContext } from '../../App';
import styles from './AdminLogin.module.css';

const AdminLogin = () => {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const [auth, setAuth] = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  // console.log(
  //   '🚀 ~ file: AdminLogin.jsx ~ line 21 ~ AdminLogin ~ loading',
  //   loading
  // );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const history = useHistory();

  const historyCheck = () => {
    if (auth.provider === '') {
      history.push('/');
    }
  };

  historyCheck();

  console.log(auth);

  const pageRedirect = () => {
    history.push(`${auth.address}`);
  };
  const onSubmit = (data) => {
    setLoading(true);

    async function queryData() {
      const ref = db.collection(auth.collection);
      if (auth.provider === 'Admin') {
        ref
          .doc('administrator')
          .get()
          .then((doc) => {
            if (
              doc.data().email === data.email &&
              doc.data().password === data.password
            ) {
              toast.success('Sign In Successful!');
              window.sessionStorage.setItem('user', doc.data().email);
              pageRedirect();
              setLoading(false);
            } else {
              toast.error('Error: Not registered!');
              setLoading(false);
            }
          });
      } else {
        const queryRef = ref.where('email', '==', data.email);
        await queryRef.get().then((res) => {
          if (res.empty) {
            toast.error('Not registered');
            setLoading(false);
          } else if (!res.empty) {
            toast.success('Successful');
            res.forEach((doc) => {
              window.sessionStorage.setItem('user', doc.data().email);
              pageRedirect();
            });
            setLoading(false);
          }
        });
      }
    }

    queryData();
  };
  return (
    <Container fluid className={styles.AdminLoginContainer}>
      <div className={styles.AdminLoginWrapper}>
        <h1>
          <span>{auth.provider}</span> Login
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type='text'
            placeholder='Email'
            {...register('email', { required: true })}
          />
          {auth.provider === 'Admin' ? (
            <input
              type='password'
              placeholder='Password'
              {...register('password', { required: true })}
            />
          ) : null}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}>
            {loading && (
              <div
                style={{
                  height: '75px',
                }}>
                <CircularProgress />
              </div>
            )}
            <input
              type='submit'
              disabled={loading}
              style={{
                cursor: loading ? 'not-allowed' : 'pointer',
                display: loading ? 'none' : 'block',
              }}
            />
          </div>
        </form>
      </div>
      <Link to='/' className={styles.exitBtn} type='button'>
        <FontAwesomeIcon
          className={styles.plusIcon}
          icon={faArrowAltCircleLeft}
          size='1x'
        />{' '}
        EXIT
      </Link>
    </Container>
  );
};

export default AdminLogin;
