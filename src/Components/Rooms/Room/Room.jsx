import React from 'react';
import RBtn from '../../Buttons/RBtn/RBtn';
import styles from './Room.module.css';

const Room = () => {
    return (
        <div className={styles.room}>
            <div className={styles.roomTop}>
                <div className={styles.roomTopLeft}>
                    <div className={styles.roomNo}>1b</div>
                    <RBtn />
                </div>
                <div className={styles.roomTopRight}>
                    <div className={styles.time}>10:56</div>
                </div>
            </div>
            <div className={styles.roomCenter}>
                <div className={styles.liveAlert}>1</div>
            </div>
            <div className={styles.roomBottom}>
                <select name="alertSelector" id="alertSelector">
                    <option value="value 1">Assistant Required</option>
                    <option value="value 1">Assistant Required</option>
                    <option value="value 1">Assistant Required</option>
                </select>
            </div>
        </div>
    );
};

export default Room;
