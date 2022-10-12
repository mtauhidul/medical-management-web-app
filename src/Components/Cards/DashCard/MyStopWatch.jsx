/* eslint-disable react/button-has-type */
import React from 'react';
import { useStopwatch } from 'react-timer-hook';

function MyStopwatch() {
    const { seconds, minutes, hours, days, isRunning, start, pause, reset } = useStopwatch({
        autoStart: true,
    });

    return (
        <div style={{ textAlign: 'center' }}>
            <div>
                <span>{minutes}</span>:<span>{seconds}</span>
            </div>
        </div>
    );
}
export default MyStopwatch;
