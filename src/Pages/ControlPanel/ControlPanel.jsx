/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-restricted-globals */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/require-default-props */
/* eslint-disable import/no-cycle */
import {
  faBell,
  faColumns,
  faStethoscope,
  faWaveSquare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useState } from 'react';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import useViewportSizes from 'use-viewport-sizes';
import SignOutBtn from '../../Components/Buttons/SignOutBtn/SignOutBtn';
import Alerts from '../../Menus/SideMenus/Alerts';
import AssistantDashboard from '../../Menus/SideMenus/AssistantDashboard';
import Dashboard from '../../Menus/SideMenus/Dashboard';
import Doctors from '../../Menus/SideMenus/Doctors';
import Sequence from '../../Menus/SideMenus/Sequence';
import Stuff from '../../Menus/SideMenus/Stuff';
import DoctorsSelf from '../../Menus/TabMenus/DoctorsSelf';
import styles from './ControlPanel.module.css';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },

  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
}));

function ControlPanel(props) {
  const [vpWidth, vpHeight] = useViewportSizes();
  const { path, url } = useRouteMatch();
  const [drList, setDrList] = useState([]);

  const history = useHistory();

  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const onCLickToggle = () => {
    if (vpWidth < 600) {
      handleDrawerToggle();
    }
  };

  const logOut = () => {
    sessionStorage.clear();
    location.reload();
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <div style={{ width: drawerWidth }} className={styles.sideBar}>
          <div className={styles.logo}>
            <h1>Logo</h1>
          </div>
          <div className={styles.nav}>
            <ul className={styles.navList}>
              {url.includes('admin') && (
                <li onClick={() => onCLickToggle()}>
                  <Link to={`${url}/dashboard`}>
                    <span>
                      <FontAwesomeIcon
                        className={styles.plusIcon}
                        icon={faColumns}
                        size='2x'
                      />
                    </span>{' '}
                    Dashboard
                  </Link>
                </li>
              )}

              {url.includes('admin') && (
                <li onClick={() => onCLickToggle()}>
                  <Link to={`${url}/stuff/doctors`}>
                    <span>
                      <FontAwesomeIcon
                        className={styles.plusIcon}
                        icon={faStethoscope}
                        size='2x'
                      />
                    </span>{' '}
                    Roles
                  </Link>
                </li>
              )}
              {url.includes('admin') && (
                <li onClick={() => onCLickToggle()}>
                  <Link to={`${url}/alerts`}>
                    <span>
                      <FontAwesomeIcon
                        className={styles.plusIcon}
                        icon={faBell}
                        size='2x'
                      />
                    </span>{' '}
                    Alerts
                  </Link>
                </li>
              )}
              {url.includes('admin') && (
                <li onClick={() => onCLickToggle()}>
                  <Link to={`${url}/sequence`}>
                    <span>
                      <FontAwesomeIcon
                        className={styles.plusIcon}
                        icon={faWaveSquare}
                        size='2x'
                      />
                    </span>{' '}
                    Resources
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div className={styles.signOutBtn}>
            <SignOutBtn handleClick={logOut} />
          </div>
        </div>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position='fixed' id={styles.appBar} className={classes.appBar}>
        <Toolbar style={{ backgroundColor: 'var(--color4)' }}>
          <Typography variant='h6'>Logo</Typography>
          <IconButton
            style={{ marginLeft: 'auto' }}
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            className={classes.menuButton}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label='mailbox folders'>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation='css'>
          <Drawer
            container={container}
            variant='temporary'
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}>
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation='css'>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant='permanent'
            open>
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main style={{ overflowX: 'hidden' }} className={classes.content}>
        <div className={styles.main}>
          <Switch>
            <Route path={`${path}/dashboard`}>
              <Dashboard />
            </Route>
          </Switch>
          <Switch>
            <Route path={`${path}/assistant-dashboard`}>
              <AssistantDashboard />
            </Route>
          </Switch>
          <Switch>
            <Route path={`${path}/stuff`}>
              <Stuff />
            </Route>
          </Switch>
          <Switch>
            <Route path={`${path}/alerts`}>
              <Alerts />
            </Route>
          </Switch>
          <Switch>
            <Route path={`${path}/sequence`}>
              <Sequence drList={drList} />
            </Route>
          </Switch>
          <Switch>
            <Route path={`${path}/doctors`}>
              <Doctors />
            </Route>
          </Switch>
          <Switch>
            <Route path={`${path}/self-sequence`}>
              <DoctorsSelf />
            </Route>
          </Switch>
        </div>
      </main>
    </div>
  );
}

export default ControlPanel;
