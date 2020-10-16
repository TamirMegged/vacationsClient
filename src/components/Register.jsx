import { Button, Divider, Grid, Paper, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import Alert from '@material-ui/lab/Alert';


export default function Register({ history }) {

    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async e => {
        e.preventDefault();
        try {
            let res = await fetch("http://localhost:1000/users/register", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ first_name, last_name, username, password })
            })
            let data = await res.json();
            if (data.error) {
                setError(data.msg);
            } else {
                history.push("/login");
            }
        } catch (err) {
            setError(err);
            console.log(error);
        }
    }

    return (
        <>
            <Paper style={{ width: "40%", margin: "15vh auto", padding: "5vh" }}>
                <Grid container justify="space-evenly" style={{ marginBottom: "5vh" }}>
                    <Grid container justify="center" xs={6}>
                        <TextField label="First Name" type="text" onChange={e => setFirst_name(e.target.value)} />
                    </Grid>
                    <Grid container justify="center" xs={6}>
                        <TextField label="Last Name" type="text" onChange={e => setLast_name(e.target.value)} />
                    </Grid>
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
                    <Button color="primary" onClick={handleRegister}>Register</Button>
                    <Typography>
                        Already signed up? <Button color="default" href="/login">Login</Button>
                    </Typography>
                </Grid>
            </Paper >
        </>
    )
}
