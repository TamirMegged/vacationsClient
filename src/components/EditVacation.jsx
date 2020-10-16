import { Button, Grid, InputAdornment, Modal, TextField, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

export default function EditVacation({ modalOpen, setModalOpen, vacation }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertContent, setAlertContent] = useState("");
    const [destination, setDestination] = useState("");
    const [image, setImage] = useState("");
    const [start_date, setStart_date] = useState("");
    const [end_date, setEnd_date] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    useEffect(() => {
        setDestination(vacation.destination);
        setImage(vacation.image);
        setStart_date(vacation.start_date);
        setEnd_date(vacation.end_date);
        setDescription(vacation.description);
        setPrice(vacation.price);
    }, [vacation])

    const handleSubmit = async e => {
        e.preventDefault();
        if (destination && image && start_date && end_date && description && price) {
            if (start_date < end_date) {
                try {
                    let res = await fetch(`http://localhost:1000/vacations/${vacation.id}`, {
                        method: "PUT",
                        headers: { "content-type": "application/json", "Authorization": localStorage.token },
                        body: JSON.stringify({ destination, image, start_date, end_date, description, price })
                    })
                    let data = await res.json();
                    if (data.msg === "Token expected" || data.msg === "Token invalid") {
                        dispatch({ type: "LOGOUT" });
                        history.push("/login");
                    } else {
                        setModalOpen(false);
                        setAlertOpen(false);
                        dispatch({ type: "LOAD", payload: data });
                    }
                } catch (err) {
                    console.log(err);
                }
            } else {
                setAlertOpen(true);
                setAlertContent("Land date is earlier than takeoff date. Please change and try again.");
            }
        } else {
            setAlertOpen(true);
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
                }}>Edit {destination} <EditOutlinedIcon fontSize="large" style={{ color: "white" }} /></Typography>
                <Grid container justify="center">
                    <Grid container xs={12} justify="space-around" style={{ marginBottom: "5vh" }}>
                        <TextField value={destination} onChange={e => setDestination(e.target.value)} label="Destination" type="text" />
                        <TextField value={price} onChange={e => setPrice(e.target.value)} label="Price (in USD)"
                            InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} type="number" />
                    </Grid>
                    <Grid container xs={12} sm={10} style={{ marginBottom: "5vh" }}>
                        <TextField fullWidth value={image} onChange={e => setImage(e.target.value)} label="Image" type="text" />
                    </Grid>
                    <Grid container xs={12} justify="space-around" style={{ marginBottom: "5vh" }}>
                        <TextField label="Takeoff Date" type="date" defaultValue={moment(start_date).format("yyyy-MM-DD")}
                            InputLabelProps={{ shrink: true }} onChange={e => setStart_date(e.target.value)} />
                        <TextField label="Land Date" type="date" defaultValue={moment(end_date).format("yyyy-MM-DD")}
                            InputLabelProps={{ shrink: true }} onChange={e => setEnd_date(e.target.value)} />
                    </Grid>
                    <Grid container xs={9} >
                        <TextField multiline fullWidth rows={5} variant="outlined" value={description} style={{ margin: "1vw" }}
                            onChange={e => setDescription(e.target.value)} label="Description" type="text" />
                    </Grid>
                    {alertOpen ? (<Grid xs={12}><Alert severity="error">{alertContent}</Alert></Grid>) : null}
                    <Grid container xs={12} justify="space-evenly" style={{ margin: "3vh" }}>
                        <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
                        <Button onClick={handleCancel} variant="contained">Cancel</Button>
                    </Grid>
                </Grid>
            </div>
        </Modal >
    )

}
