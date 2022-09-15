import toast from 'react-hot-toast';

/* eslint-disable no-alert */
function ValidateEmail(value) {
    if (value === '') {
        return true;
    }
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
        return value;
    }
    toast.error('Invalid email address!');
    return false;
}

export default ValidateEmail;
