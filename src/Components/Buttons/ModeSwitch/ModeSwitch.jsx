import { Switch } from '@material-ui/core';
import { useEffect, useState } from 'react';

export default function ModeSwitch() {
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    sessionStorage.setItem('mode', event.target.checked);
  };

  useEffect(() => {
    const mode = sessionStorage.getItem('mode');
    if (mode === 'true') {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: '1rem',
        background: '#F2F2F2',
        borderRadius: '0.7rem',
      }}>
      <strong
        style={{
          color: '#212155',
          fontSize: '0.9rem',
          marginLeft: '1rem',
        }}>
        Advance Mode
      </strong>
      <Switch
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'controlled' }}
        color='primary'
      />
    </div>
  );
}
