import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { Grid, useMediaQuery } from '@material-ui/core';

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5
    },
    colorPrimary: {
        // backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
    },
}))(LinearProgress);

// Inspired by the former Facebook spinners.

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

export default function CustomizedProgressBars({ tokenSaleProgress }) {
    const classes = useStyles();

    const calculateTimeLeft = () => {
        let year = new Date().getFullYear();
        let difference = +new Date(`10/01/${year}`) - +new Date();
      
        let timeLeft = {};
      
        if (difference > 0) {
          timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
          };
        }
        return timeLeft;
      }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
    });

    return (
        <div className={classes.root}>
            <Grid container spacing={2} alignItems='center' justify='center' direction={'row'}>
                <Grid item xs={12} md={6} container alignItems='left' justify='left' style={{ width: '100%' }}>
                    <Typography variant='h6' align='left'>Time Left:{  timeLeft.hours.toLocaleString("en", {minimumIntegerDigits:2}) + ':' + timeLeft.minutes.toLocaleString("en", {minimumIntegerDigits:2}) + ':' + timeLeft.seconds.toLocaleString("en", {minimumIntegerDigits:2})}</Typography>
                </Grid>
                <Grid item xs={12} md={6} container alignItems='flex-end' justify='flex-end'>
                    <Typography variant='h6' align='right'> {tokenSaleProgress} % SOLD</Typography>
                </Grid>
            </Grid>
            <BorderLinearProgress variant="determinate" value={tokenSaleProgress} />
        </div>
    );
}