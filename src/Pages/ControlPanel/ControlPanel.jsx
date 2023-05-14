/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-restricted-globals */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/require-default-props */
/* eslint-disable import/no-cycle */
import {
  faBell,
  faChartBar,
  faColumns,
  faFileMedical,
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
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useState } from 'react';
import {
  Link,
  Route,
  Switch,
  matchPath,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import useViewportSizes from 'use-viewport-sizes';
import ModeSwitch from '../../Components/Buttons/ModeSwitch/ModeSwitch';
import SignOutBtn from '../../Components/Buttons/SignOutBtn/SignOutBtn';
import Alerts from '../../Menus/SideMenus/Alerts';
import AssistantDashboard from '../../Menus/SideMenus/AssistantDashboard';
import Dashboard from '../../Menus/SideMenus/Dashboard';
import Doctors from '../../Menus/SideMenus/Doctors';
import Patients from '../../Menus/SideMenus/Patients';
import Reports from '../../Menus/SideMenus/Reports';
import Sequence from '../../Menus/SideMenus/Sequence';
import Stuff from '../../Menus/SideMenus/Stuff';
import DoctorsSelf from '../../Menus/TabMenus/DoctorsSelf';
import PatientInfo from '../PatientsInfo/PatientInfo';
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
  const history = useHistory();

  const [drList, setDrList] = useState([]);

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
    history.push('/');
    // location.reload();
  };

  const navList = [
    {
      name: 'Dashboard',
      url: `${url}/dashboard`,
      Icon: (
        <FontAwesomeIcon
          icon={faColumns}
          size='2x'
          className={`${url}/dashboard` ? styles.activeIcon : styles.plusIcon}
        />
      ),
    },
    {
      name: 'Patients',
      url: `${url}/patients`,
      Icon: (
        <FontAwesomeIcon
          icon={faFileMedical}
          size='2x'
          className={`${url}/patients` ? styles.activeIcon : styles.plusIcon}
        />
      ),
    },
    {
      name: 'Reports',
      url: `${url}/reports`,
      Icon: (
        <FontAwesomeIcon
          icon={faChartBar}
          size='2x'
          className={`${url}/reports` ? styles.activeIcon : styles.plusIcon}
        />
      ),
    },
    {
      name: 'Roles',
      url: `${url}/stuff/doctors`,
      Icon: (
        <FontAwesomeIcon
          icon={faStethoscope}
          size='2x'
          className={
            `${url}/stuff/doctors` ? styles.activeIcon : styles.plusIcon
          }
        />
      ),
    },
    {
      name: 'Status',
      url: `${url}/alerts`,
      Icon: (
        <FontAwesomeIcon
          icon={faBell}
          size='2x'
          className={`${url}/alerts` ? styles.activeIcon : styles.plusIcon}
        />
      ),
    },
    {
      name: 'Resources',
      url: `${url}/sequence`,
      Icon: (
        <FontAwesomeIcon
          icon={faWaveSquare}
          size='2x'
          className={`${url}/sequence` ? styles.activeIcon : styles.plusIcon}
        />
      ),
    },
  ];

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <div style={{ width: drawerWidth }} className={styles.sideBar}>
          <div className={styles.logo}>
            <h1>Care Sync</h1>
          </div>
          <div className={styles.nav}>
            <ul className={styles.navList}>
              {navList.map((item) => (
                <li onClick={() => onCLickToggle()}>
                  <Link
                    to={item.url}
                    className={
                      matchPath(location.pathname, {
                        path: `${item.url}`,
                        exact: true,
                      }) && styles.active
                    }>
                    <span>{item.Icon}</span>
                    <span className={styles.navText}>{item.name}</span>
                  </Link>
                </li>
              ))}

              {/* {url.includes("admin") && (
                <li onClick={() => onCLickToggle()}>
                  <Link to={`${url}/stuff/doctors`}>
                    <span>
                      <FontAwesomeIcon
                        className={styles.plusIcon}
                        icon={faStethoscope}
                        size="2x"
                      />
                    </span>{" "}
                    Roles
                  </Link>
                </li>
              )} */}
              {/* {url.includes("admin") && (
                <li onClick={() => onCLickToggle()}>
                  <Link to={`${url}/alerts`}>
                    <span>
                      <FontAwesomeIcon
                        className={styles.plusIcon}
                        icon={faBell}
                        size="2x"
                      />
                    </span>{" "}
                    Alerts
                  </Link>
                </li>
              )} */}
              {/* {url.includes("admin") && (
                <li onClick={() => onCLickToggle()}>
                  <Link to={`${url}/sequence`}>
                    <span>
                      <FontAwesomeIcon
                        className={styles.plusIcon}
                        icon={faWaveSquare}
                        size="2x"
                      />
                    </span>{" "}
                    Resources
                  </Link>
                </li>
              )} */}
              {/* {url.includes("admin") && (
                <li
                  style={{ paddingLeft: "5px" }}
                  onClick={() => onCLickToggle()}
                >
                  <Link
                    to={`${url}/patients`}
                    className={
                      matchPath(location.pathname, {
                        path: `${url}/patients`,
                        exact: true,
                      }) && styles.active
                    }
                  >
                    <span>
                      <FontAwesomeIcon
                        className={
                          matchPath(location.pathname, {
                            path: `${url}/patients`,
                            exact: true,
                          })
                            ? styles.activeIcon
                            : styles.plusIcon
                        }
                        icon={faFileMedical}
                        size="2x"
                      />
                    </span>{" "}
                    Patients
                  </Link>
                </li>
              )} */}
            </ul>
          </div>
          <div className={styles.signOutBtn}>
            <ModeSwitch />
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
          <Typography variant='h6'>Care Sync</Typography>
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
      {/* style={{ overflowX: 'hidden' }} */}
      <main className={classes.content}>
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
            <Route path={`${path}/patients`} exact>
              <Patients />
            </Route>
          </Switch>
          <Switch>
            <Route path={`${path}/patients/:date`} exact>
              <PatientInfo />
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
            <Route path={`${path}/reports`}>
              <Reports />
            </Route>
          </Switch>
        </div>
      </main>
    </div>
  );
}

export default ControlPanel;
