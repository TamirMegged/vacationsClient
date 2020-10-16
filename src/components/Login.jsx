import { Button, Divider, Grid, Paper, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';
import Alert from '@material-ui/lab/Alert';


export default function Login({ history }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    const handleLogin = async e => {
        e.preventDefault();
        try {
            let res = await fetch("http://localhost:1000/users/login", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ username, password })
            })
            let data = await res.json();
            if (data.error) {
                setError(data.msg);
            } else {
                localStorage.token = data.access_token;
                let { id, first_name, last_name, username, role } = decode(data.access_token);
                dispatch({ type: "LOGIN", payload: { id, first_name, last_name, username, role } });
                history.push("/");
            }
        } catch (err) {

        }
    }

    return (
        <Paper style={{ width: "40%", margin: "15vh auto", padding: "5vh" }}>
            <Grid container justify="space-evenly" style={{ marginBottom: "5vh" }}>
                <Grid container justify="center" xs={6}>
                    <TextField onChange={e => setUsername(e.target.value)} label="Username" type="text" />
                </Grid>
                <Grid container justify="center" xs={6}>
                    <TextField onChange={e => setPassword(e.target.value)} label="Password" type="password" />
                </Grid>
            </Grid>
            {error ? (<Alert open={true} severity="error">{error}</Alert>) : null}
            <Divider />
            <Grid container direction="column" alignItems="center">
                <Button color="primary" onClick={handleLogin}>Login</Button>
                <Typography>
                    Don't have an account? <Button color="default" href="/register">Register</Button>
                </Typography>
            </Grid>
        </Paper >
    )
}
