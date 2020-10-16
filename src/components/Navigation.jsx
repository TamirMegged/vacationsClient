import React, { useState } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { fade, makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { AppBar, Toolbar, Button, IconButton, Typography, InputBase, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import FavoriteIcon from '@material-ui/icons/Favorite';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AssignmentIcon from '@material-ui/icons/Assignment';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PlaceIcon from '@material-ui/icons/Place';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import FlightLandIcon from '@material-ui/icons/FlightLand';
import FlightIcon from '@material-ui/icons/Flight';
import Alert from '@material-ui/lab/Alert';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '17ch',
            color: "rgba(255, 255, 255, 0.5)"
        }, '&:focus': {
            color: "white",
        },
    },
}));


export default function Navigation({ setSearchMode }) {
    const user = useSelector(state => state.user);
    const classes = useStyles();
    const history = useHistory();
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertContent, setAlertContent] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchContent, setSearchContent] = useState(null);
    const [start_limit, setStart_limit] = useState("");
    const [end_limit, setEnd_limit] = useState("");
    const dispatch = useDispatch();

    const handleLogout = () => {
        try {
            dispatch({ type: "LOGOUT" });
            history.push("/");
            setDrawerOpen(false);
        } catch (err) {

        }
    }

    const handleSearch = async () => {
        if (searchContent || start_limit || end_limit) {
            if (start_limit && end_limit) {
                if (end_limit < start_limit) {
                    setAlertOpen(true);
                    setAlertContent("Land date limit is earlier than takeoff date limit. Please change and try again.");
                    return;
                }
            }
            try {
                setSearchMode(true);
                history.push("/vacations");
                let res = await fetch(`http://localhost:1000/vacations/search`, {
                    method: "PUT",
                    headers: { "content-type": "application/json", "Authorization": localStorage.token },
                    body: JSON.stringify({ searchContent, start_limit, end_limit })
                });
                let data = await res.json();
                if (data.msg === "Token expected" || data.msg === "Token invalid") {
                    dispatch({ type: "LOGOUT" });
                    history.push("/login");
                } else {
                    setAlertOpen(false);
                    dispatch({ type: "LOAD", payload: data });
                }
            } catch (err) {

            }
        } else {
            setAlertOpen(true);
            setAlertContent("Please fill search fields and try again.");
        }
    }

    return (
        <div className={classes.root}>
            <AppBar position="fixed" style={{ marginBottom: "5vh" }}>
                <Toolbar>
                    <IconButton onClick={() => setDrawerOpen(true)} edge="start" className={classes.menuButton} color="inherit">
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.title} variant="h4" noWrap>Fly Away</Typography>
                    {user.isLogin ? (
                        <>
                            <div className={classes.search} title="Insert starting date limit">
                                <IconButton color="inherit" size="small" className={classes.searchIcon}>
                                    <FlightTakeoffIcon />
                                </IconButton>
                                <InputBase type="date"
                                    onChange={e => setStart_limit(moment(e.target.value).format("yyyy-MM-DD"))} classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }} />
                            </div>
                            <div className={classes.search} title="Insert ending date limit">
                                <IconButton color="inherit" size="small" className={classes.searchIcon}>
                                    <FlightLandIcon />
                                </IconButton>
                                <InputBase type="date"
                                    onChange={e => setEnd_limit(moment(e.target.value).format("yyyy-MM-DD"))} classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }} />
                            </div>
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <PlaceIcon />
                                </div>
                                <InputBase placeholder="Search" title="Insert destination or part of description"
                                    onChange={e => setSearchContent(e.target.value)} classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                />
                            </div>
                            <IconButton color="inherit" title="Search" onClick={handleSearch}>
                                <SearchIcon />
                            </IconButton>
                            <IconButton color="inherit" title="Clear search - Back to all vacations" style={{ marginRight: "2vw" }}
                                onClick={() => {
                                    setAlertOpen(false);
                                    setSearchMode(false);
                                    history.push("/");
                                }}>
                                <FlightIcon />
                            </IconButton>
                            <Typography variant="h6" noWrap>Hello {user.first_name}</Typography>
                            <IconButton color="inherit" title="Go to my account"
                                onClick={() => { history.push("/profile") }}>
                                <AccountCircle />
                            </IconButton>
                        </>
                    ) : (
                            <>
                                <Button color="inherit" href="/login">Login</Button>
                                <Button color="inherit" href="/register">Register</Button>
                            </>
                        )}
                </Toolbar>
                {alertOpen ? (<Alert severity="error">{alertContent}</Alert>) : null}
            </AppBar>
            <Drawer open={drawerOpen} anchor={"left"} onClose={() => setDrawerOpen(false)}>
                <List>
                    <ListItem button onClick={() => {
                        setSearchMode(false);
                        history.push("/");
                        setDrawerOpen(false);
                    }}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home"></ListItemText>
                    </ListItem>
                    {user.isLogin ? (<>
                        {user.role === "user" ?
                            (<ListItem button onClick={() => {
                                history.push('/wishlist');
                                setDrawerOpen(false);
                            }}>
                                <ListItemIcon>
                                    <FavoriteIcon />
                                </ListItemIcon>
                                <ListItemText primary="Wish List"></ListItemText>
                            </ListItem>) : null}
                        {user.role === "admin" ? (
                            <ListItem button onClick={() => {
                                history.push('/reports');
                                setDrawerOpen(false);
                            }}>
                                <ListItemIcon>
                                    <EqualizerIcon />
                                </ListItemIcon>
                                <ListItemText primary="Reports"></ListItemText>
                            </ListItem>) : null}
                        <ListItem button onClick={() => {
                            history.push('/profile');
                            setDrawerOpen(false);
                        }}>
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="Profile"></ListItemText>
                        </ListItem>
                        <ListItem button onClick={handleLogout}>
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout"></ListItemText>
                        </ListItem>
                    </>) : null
                    }
                    {!user.isLogin ? (<>
                        <ListItem button onClick={() => {
                            history.push('/register');
                            setDrawerOpen(false);
                        }}>
                            <ListItemIcon>
                                <AssignmentIcon />
                            </ListItemIcon>
                            <ListItemText primary="Register"></ListItemText>
                        </ListItem>
                        <ListItem button onClick={() => {
                            history.push('/login');
                            setDrawerOpen(false);
                        }}>
                            <ListItemIcon>
                                <LockOpenIcon />
                            </ListItemIcon>
                            <ListItemText primary="Login"></ListItemText>
                        </ListItem>
                    </>) : null}
                </List>
            </Drawer>
        </div>
    );
}