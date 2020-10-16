import { Fab, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Vacation from './Vacation';
import AddIcon from '@material-ui/icons/Add';
import { useDispatch, useSelector } from 'react-redux';
import AddVacation from './AddVacation';
import { useHistory } from 'react-router-dom';
// import OrderBy from './OrderBy';

export default function Vacations({ isSearchMode }) {
    const user = useSelector(state => state.user);
    const vacations = useSelector(state => state.vacations);
    const [addOpen, setAddOpen] = useState(false);
    // const [orderBy, setOrderBy] = useState("Default");
    const [isEffected, setIsEffected] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        if (!isSearchMode) {
            if (user.role === "user") {
                let likedVacations = [];
                (async () => {
                    let res = await fetch(`http://localhost:1000/likes/liked/${user.id}`, {
                        method: "GET",
                        headers: { "content-type": "application/json", "Authorization": localStorage.token }
                    });
                    let data = await res.json();
                    if (data.msg === "Token expected" || data.msg === "Token invalid") {
                        dispatch({ type: "LOGOUT" });
                        history.push("/login");
                    } else {
                        likedVacations = data.map(vac => ({ ...vac, isLiked: true }));
                        loadVacations();
                    }
                })();
                const loadVacations = async () => {
                    let res = await fetch(`http://localhost:1000/likes/rest/${user.id}`, {
                        method: "GET",
                        headers: { "content-type": "application/json", "Authorization": localStorage.token }
                    });
                    let data = await res.json();
                    let newData = data.map(vac => ({ ...vac, isLiked: false }));
                    let unlikedVacations = newData;
                    let allVacations = [...likedVacations, ...unlikedVacations];
                    dispatch({ type: "LOAD", payload: allVacations });
                    setIsEffected(true);
                }
            } else {
                (async () => {
                    let res = await fetch("http://localhost:1000/vacations");
                    let data = await res.json();
                    dispatch({ type: "LOAD", payload: data });
                    setIsEffected(true);
                })();
            }
        }
    }, [user, dispatch, history, isSearchMode]);

    return (
        <>
            {isEffected ? (<div style={{ display: "flex", justifyContent: "space-around", marginTop: "10vh", flexWrap: "wrap" }}>
                {vacations.length ? vacations.map((vac) => {
                    return (<Vacation key={vac.id} style={{ margin: "10vw" }} vacation={vac} />)
                }) : <Typography variant="h4">No vacations to show..</Typography>}
                {user.role === "admin" ? (<Fab color="secondary" aria-label="add" onClick={() => setAddOpen(true)}
                    title="Add vacation" style={{
                        width: "5vw",
                        height: "5vw",
                        position: "fixed",
                        right: "3vw",
                        bottom: "5vh",
                    }}>
                    <AddIcon fontSize="large" style={{ color: "white" }} />
                </Fab>) : null}
                <AddVacation modalOpen={addOpen} setModalOpen={setAddOpen} />
                {/* <OrderBy /> */}
            </div>) : null}
        </>
    )
}