import { Button, Grid, InputAdornment, Modal, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import moment from 'moment';
import AddToPhotosOutlinedIcon from '@material-ui/icons/AddToPhotosOutlined';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

export default function AddVacation({ modalOpen, setModalOpen }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertContent, setAlertContent] = useState("");
    const [destination, setDestination] = useState("");
    const [image, setImage] = useState("");
    const [start_date, setStart_date] = useState(moment().format("yyyy-MM-DD"));
    const [end_date, setEnd_date] = useState(moment().add(1, 'days').format("yyyy-MM-DD"));
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    const handleSubmit = async e => {
        e.preventDefault();
        if (destination && image && start_date && end_date && description && price) {
            if (start_date < end_date) {
                try {
                    let res = await fetch("http://localhost:1000/vacations/add", {
                        method: "POST",
                        headers: { "content-type": "application/json", "Authorization": localStorage.token },
                        body: JSON.stringify({ destination, image, start_date, end_date, description, price })
                    })
                    let data = await res.json();
                    if (data.msg === "Token expected" || data.msg === "Token invalid") {
                        dispatch({ type: "LOGOUT" });
                        history.push("/login");
                    } else {
                        setAlertOpen(false);
                        setModalOpen(false);
                        dispatch({ type: "LOAD", payload: data })
                    }
                } catch (err) {

                }
            } else {
                setAlertOpen(true);
                setAlertContent("Land date is earlier than takeoff date. Please change and try again.");
            }
        } else {
            setAlertOpen(true);
            setAlertContent("Please fill all fields.");
        }
    }

    const handleCancel = e => {
        e.preventDefault();
        setModalOpen(false);
    }

    return (
        <Modal open={modalOpen} onClose={handleCancel}>
            <div style={{
                backgroundColor: "white",
                width: "30%",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
            }}>
                <Typography variant="h4" style={{
                    color: "white", backgroundColor: "#0f2566", padding: "1vw",
                    textAlign: "center", marginBottom: "3vh"
                }}>Add a Vacation <AddToPhotosOutlinedIcon fontSize="large" style={{ color: "white" }} /></Typography>
                <Grid container justify="center">
                    <Grid container xs={12} justify="space-around" style={{ marginBottom: "5vh" }}>
                        <TextField onChange={e => setDestination(e.target.value)} label="Destination" type="text" />
                        <TextField onChange={e => setPrice(e.target.value)} label="Price (in USD)"
                            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} type="number" />
                    </Grid>
                    <Grid container xs={12} sm={10} style={{ marginBottom: "5vh" }}>
                        <TextField fullWidth onChange={e => setImage(e.target.value)} label="Image URL" type="text" />
                    </Grid>
                    <Grid container xs={12} justify="space-around" style={{ marginBottom: "5vh" }}>
                        <TextField label="Takeoff Date" type="date" defaultValue={start_date}
                            InputLabelProps={{ shrink: true }} onChange={e => setStart_date(e.target.value)} />
                        <TextField label="Land Date" type="date" defaultValue={end_date}
                            InputLabelProps={{ shrink: true }} onChange={e => setEnd_date(e.target.value)} />
                    </Grid>
                    <Grid container xs={9}>
                        <TextField fullWidth multiline rows={5} variant="outlined" onChange={e => setDescription(e.target.value)}
                            label="Description" type="text" />
                    </Grid>
                    <Grid item>
                    </Grid>
                    {alertOpen ? (<Grid xs={12}><Alert severity="error">{alertContent}</Alert></Grid>) : null}
                    <Grid container xs={12} justify="space-evenly" style={{ margin: "3vh" }}>
                        <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
                        <Button onClick={handleCancel} variant="contained">Cancel</Button>
                    </Grid>
                </Grid>
            </div >
        </Modal >
    )
}
