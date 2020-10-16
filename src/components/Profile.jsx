import { Avatar, Button, Card, CardActions, CardContent, Divider, Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

export default function Profile() {
    const history = useHistory();
    const user = useSelector(state => state.user);
    const { first_name, last_name, username, role } = user;

    return (
        <Card style={{ margin: "15vh auto", width: "30%" }}>
            <CardContent style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                <div>
                    {role === "user" ? (<Typography variant="h5" color="textSecondary">My Account</Typography>) : null}
                    <Typography variant="h3">{username}</Typography>
                    <Typography variant="h4">{first_name} {last_name}</Typography>
                    {role === "admin" ? (<Typography color="textSecondary" variant="h5">Website Admin</Typography>) : null}
                </div>
                <Avatar style={{ backgroundColor: "#0f2566" }}>{first_name.slice(0, 1)}{last_name.slice(0, 1)}</Avatar>
            </CardContent>
            <Divider />
            <CardActions style={{ justifyContent: "flex-end" }}>
                {role === "user" ? (<Button size="large" color="primary" onClick={() => { history.push("/wishlist") }}>Wish List</Button>) : null}
                {role === "admin" ? (<Button size="large" color="primary" onClick={() => { history.push("/reports") }}>Reports</Button>) : null}
            </CardActions>
        </Card>
    )
}
