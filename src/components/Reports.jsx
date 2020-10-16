import React, { useEffect, useState } from 'react';
import Chart from 'chart.js';
import { Grid, Paper, Typography } from '@material-ui/core';

export default function Reports() {
    const [vacations, setVacations] = useState([]);

    useEffect(() => {
        (async () => {
            let res = await fetch("http://localhost:1000/vacations");
            let data = await res.json();
            setVacations(data.filter(vac => vac.followers > 0));
        })();
    }, []);

    useEffect(() => {
        createChart();
    }, [vacations])

    const createVacsWithColors = () => {
        let backgroundColors = [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ]
        let borderColors = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ]
        let newVacations = vacations.map((vac, index) => {
            let i = index % backgroundColors.length;
            return { ...vac, backgroundColor: backgroundColors[i], borderColor: borderColors[i] };
        })
        return newVacations;
    }

    const createChart = () => {
        const ctx = document.getElementById('likesChart');
        let vacations = createVacsWithColors();
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: vacations.map(vac => (vac.destination)),
                datasets: [{
                    label: '# of followers',
                    data: vacations.map(vac => (vac.followers)),
                    backgroundColor: vacations.map(vac => (vac.backgroundColor)),
                    borderColor: vacations.map(vac => (vac.borderColor)),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function (value) { if (value % 1 === 0) { return value; } }
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Number of Followers',
                            fontSize: 20
                        }
                    }],
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Destination',
                            fontSize: 20
                        }
                    }]
                },
                legend: {
                    display: false
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return tooltipItem.yLabel;
                        }
                    }
                }
            }
        });
    }

    return (
        <Grid container justify="center" style={{ marginTop: "10vh" }}>
            <Grid xs={12}>
                <Paper>
                    <Typography variant="h2" style={{ textAlign: "center", marginBottom: "5vh" }}>
                        Followed Vacations Reports</Typography>
                </Paper>
            </Grid>
            <Grid item xs={8}>
                <canvas id="likesChart"></canvas>
            </Grid>
        </Grid>
    )
}