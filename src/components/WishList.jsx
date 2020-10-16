import React, { useEffect, useState } from 'react';
import Vacation from './Vacation';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Typography } from '@material-ui/core';

export default function WishList() {
    const user = useSelector(state => state.user);
    const vacations = useSelector(state => state.vacations);
    const [isEffected, setIsEffected] = useState(false);
    const dispatch = useDispatch();
    

    useEffect(() => {
        (async () => {
            let res = await fetch(`http://localhost:1000/likes/liked/${user.id}`, {
                method: "GET",
                headers: { "content-type": "application/json", "Authorization": localStorage.token }
            });
            let data = await res.json();
            let newData = data.map(vac => ({ ...vac, isLiked: true }));
            dispatch({ type: "LOAD", payload: newData });
            setIsEffected(true);
        })();
    }, [vacations, user, dispatch])

    return (
        <>
            {user.isLogin && isEffected ? (<>
                <Paper>
                    <Typography variant="h2" style={{ marginTop: "12vh", marginBottom: "5vh", textAlign: "center" }}>
                        My Wish List</Typography>
                </Paper>
                <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
                    {vacations.map((vac) => {
                        return <Vacation key={vac.id} style={{ margin: "10vw" }} vacation={vac} isLiked={true} />
                    })}
                </div></>) : null}
        </>
    )
}