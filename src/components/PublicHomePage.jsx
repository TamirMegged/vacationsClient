import { Button, Grid, Paper, Typography } from '@material-ui/core';
import logo from '../logo.png'
import world from '../world.png'
import React from 'react';
import Vacations from './Vacations';
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';

export default function PublicHomePage() {
    return (
        <>
            <Paper style={{ marginTop: "10vh" }}>
                <Grid container justify="center">
                    <Grid item xs={12}>
                        <Typography style={{ textAlign: "center" }} color="textSecondary"
                            variant="h1">Welcome to <span style={{ color: "black" }}>Fly Away</span><img src={logo} alt="Logo"
                                width="7%"></img></Typography>
                    </Grid>
                    <Grid container xs={12} sm={11} alignItems="center" justify="center">
                        <Grid item xs={5}>
                            <img src={world} alt="World Travel" width="100%" />
                        </Grid>
                        <Grid item xs={7}>
                            <Typography variant="h4">What is Fly Away?</Typography>
                            <Typography color="textSecondary" variant="h5">
                                If you love traveling and visiting new places this is the perfect place for you.
                                Fly Away gives you a chance to see some great vacations' deals before anyone else.
                                You can also follow your favorite vacations and stay updated for changes.
                            </Typography>
                            <Typography variant="h4" style={{ marginTop: "5vh" }}>Do you want to be part of our family?</Typography>
                            <Typography color="textSecondary" variant="h5">
                                By signing up you will be able to follow your favorite vacations and manage your own Wish List.
                                Join us now! Every day new vacations are uploded.
                            </Typography>
                                <Typography variant="h6" style={{ display: "inline" }}>
                                    <Button style={{ margin: "1vh" }} href="/register" variant="outlined" color="primary" size="large">Register</Button>
                                   OR
                                   <Button style={{ margin: "1vh" }} href="/login" variant="outlined" color="primary" size="large">Login</Button>
                                </Typography>
                            <Typography variant="h6">
                                Else, you are welcome to just wander around our vacations.
                            </Typography>
                        </Grid>
                        <Grid item>
                            <KeyboardArrowDownRoundedIcon style={{ width: "10vh", height: "10vh" }} />
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
            <Vacations />
        </>
    )
}
