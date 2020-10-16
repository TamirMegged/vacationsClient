import { Button, ButtonGroup } from '@material-ui/core';
import React from 'react';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { useSelector } from 'react-redux';
import { useState } from 'react';

export default function OrderBy() {
    const user = useSelector(state => state.user);
    const [orderBy, setOrderBy] = useState("Default");

    const handleSelect = e => {

    }

    return (
        <>
            {/* <FormControl variant="outlined" style={{ width: "15vw" }}>
                <InputLabel>Order By</InputLabel>
                <Select label="Order By" value={orderBy}>
                    <MenuItem value={"Default"}>Default</MenuItem>
                    <MenuItem value={"PriceAsc"}>Price <ArrowUpwardIcon /></MenuItem>
                    <MenuItem value={"PriceDesc"}>Price <ArrowDownwardIcon /></MenuItem>
                </Select>
            </FormControl> */}
            {user.isLogin ? (<ButtonGroup color="primary" style={{
                backgroundColor: "white",
                position: "fixed",
                left: "3vw",
                bottom: "5vh",
            }}>
                <Button onClick={handleSelect} variant="contained">Default</Button>
                <Button onClick={handleSelect}>Date <ArrowUpwardIcon /></Button>
                <Button onClick={handleSelect}>Date <ArrowDownwardIcon /></Button>
                <Button onClick={handleSelect}>Price <ArrowUpwardIcon /></Button>
                <Button onClick={handleSelect}>Price <ArrowDownwardIcon /></Button>
            </ButtonGroup>) : null}
        </>
    )
}
