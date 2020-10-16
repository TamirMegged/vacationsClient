import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardActions, CardContent, CardMedia, Typography, IconButton, Avatar, Modal, Button, Grid } from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import '../App.css';
import { useDispatch, useSelector } from 'react-redux';
import EditVacation from './EditVacation';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
    root: {
        width: 345,
    },
    media: {
        height: 140,
    },
});

export default function Vacation({ vacation }) {
    const user = useSelector(state => state.user);
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();

    const [isLiked, setIsLiked] = useState(vacation.isLiked);
    const [followers, setFollowers] = useState(vacation.followers);
    const { id, image, destination, start_date, end_date, description, price } = vacation;
    const startDateString = moment(start_date).format('DD/MM/yyyy');
    const endDateString = moment(end_date).format('DD/MM/yyyy');

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const deleteVacation = async () => {
        let res = await fetch(`http://localhost:1000/vacations/${id}`, {
            method: "DELETE",
            headers: { "Authorization": localStorage.token }
        });
        let data = await res.json();
        if (data.msg === "Token expected" || data.msg === "Token invalid") {
            dispatch({ type: "LOGOUT" });
            history.push("/login");
        } else {
            dispatch({ type: "LOAD", payload: data });
        }
    }

    const handleLike = async () => {
        try {
            let res = await fetch('http://localhost:1000/likes', {
                method: "POST",
                headers: { "content-type": "application/json", "Authorization": localStorage.token },
                body: JSON.stringify({ userID: user.id, vacationID: id })
            })
            let data = await res.json();
            if (data.msg === "Token expected" || data.msg === "Token invalid") {
                dispatch({ type: "LOGOUT" });
                history.push("/login");
            } else {
                setIsLiked(true);
                setFollowers(followers + 1);
            }
        } catch (err) {

        }
    }

    const handleUnlike = async () => {
        try {
            let res = await fetch('http://localhost:1000/likes', {
                method: "DELETE",
                headers: { "content-type": "application/json", "Authorization": localStorage.token },
                body: JSON.stringify({ userID: user.id, vacationID: id })
            })
            let data = await res.json();
            if (data.msg === "Token expected" || data.msg === "Token invalid") {
                dispatch({ type: "LOGOUT" });
                history.push("/login");
            } else {
                setIsLiked(false);
                setFollowers(followers - 1);
            }
        } catch (err) {

        }
    }

    return (
        <Card className={classes.root} style={{ position: "relative", marginBottom: "2vw" }}>
            <CardMedia
                className={classes.media}
                image={image}
                title={destination}
            />
            <CardContent>
                {user.role === "admin" ? (
                    <CardActions style={{ position: "absolute", right: "0.5vw", top: 140 }}>
                        <IconButton onClick={() => setEditOpen(true)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => setDeleteOpen(true)}>
                            <DeleteIcon />
                        </IconButton>
                    </CardActions>
                ) : null}
                <Typography gutterBottom variant="h4" component="h2">
                    {destination}
                </Typography>
                <Typography gutterBottom variant="body1" component="p">
                    {startDateString} - {endDateString}
                </Typography>
                <Typography gutterBottom variant="body2" color="textSecondary" component="p">
                    {description}
                </Typography>
                <Typography variant="h5" component="p">
                    {price}$
                    </Typography>
                <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                    <div style={{ backgroundColor: "white", width: "35%", margin: "15% auto", padding: "3vh" }}>
                        <Typography variant="h5">Are you sure you want to delete the vacation in {destination}?</Typography>
                        <Grid container justify="center">
                            <Button size="large" onClick={deleteVacation}>Yes</Button>
                            <Button size="large" onClick={() => setDeleteOpen(false)}>No</Button>
                        </Grid>
                    </div>
                </Modal>
                {editOpen ? (
                    <EditVacation setModalOpen={setEditOpen} modalOpen={editOpen} vacation={vacation}></EditVacation>
                ) : null}
            </CardContent>
            <CardActions style={{ position: "absolute", right: "0.5vw", bottom: "0" }}>
                {user.role === "user" ? (
                    isLiked ? (
                        <IconButton onClick={handleUnlike} ><FavoriteIcon style={{ color: "red" }} /></IconButton>
                    ) : (
                            <IconButton onClick={handleLike}><FavoriteBorderIcon /></IconButton>)
                ) : null}
                <Avatar style={{ backgroundColor: "#0f2566" }}>{followers}</Avatar>
            </CardActions>
        </Card >
    );
}