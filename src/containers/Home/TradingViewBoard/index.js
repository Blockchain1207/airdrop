import React,{ useState, useCallback }  from 'react';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Grid } from '@material-ui/core';
import { useSnackbar } from 'notistack';

import ContainedButton from 'components/UI/Buttons/ContainedButton';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import SectionHeader from 'components/UI/SectionHeader';
import { MemoizedOutlinedTextField } from 'components/UI/OutlinedTextField';

const useStyles = makeStyles(theme => ({
    root: {},
    image: {
        boxShadow:
            '25px 60px 125px -25px rgba(80,102,144,.1), 16px 40px 75px -40px rgba(0,0,0,.2)',
        borderRadius: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            maxWidth: 500,
        },
    },
    tradingBoard: {
        width: '100%',
        height: '100%',
        [theme.breakpoints.down('sm')]: {
            height: 360,
            width: '100%'
        },
    },
    referral: {
        backgroundColor: theme.palette.error.light
    }
}));

const Hero = props => {
    const { account, className, ...rest } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true,
    });
    const [state, setState] = useState({
        bepaddress: "",
    });
    const { enqueueSnackbar } = useSnackbar();

    const getReferrallink = () => {
        if (account) {
            let referaladd = state.bepaddress;
            if(!referaladd){
                enqueueSnackbar('Please enter your BEP20 address', { variant: 'warning' })
            }else{
            if(!/^(0x){1}[0-9a-fA-F]{40}$/i.test(referaladd)){
                enqueueSnackbar('your address is invalid', { variant: 'warning' })
            }else{    
                let linkaddress = 'https://your.site/?ref=' + referaladd;
                setState({
                    bepaddress: linkaddress
                })
            }
            }
        }
        else {
            enqueueSnackbar('Please connect your wallet', { variant: 'warning' })
        }
    }
    const inputChangeHandler = useCallback(event => {
        const { name, value } = event.target;
        setState(prevState => ({
                ...prevState, [name]: value
        }));
    }, []);
    return (
        <div className={clsx(classes.root, className)} {...rest}>
        </div>
    );
};

Hero.propTypes = {
    /**
     * External classes
     */
    className: PropTypes.string,
};

export default Hero;
