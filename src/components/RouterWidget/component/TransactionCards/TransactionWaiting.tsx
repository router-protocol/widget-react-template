import React from 'react'
import styled, { keyframes } from 'styled-components'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import SpinningIcon from '../../assets/react-components/SpinningIcon';

interface Props {
    close: () => void;
}

const Wrapper = styled.div`
    width: 400px;
    height: 420px;
    border-radius: 20px;
    background-color: #1A1B1C;    
backdrop-filter: blur(32px);
 
    color: #FFFFFF; 
    display: grid;
    place-items: center;
    padding-top: 60px;
    padding-bottom: 25px;
    position: relative;
    @media only screen and (max-width: 750px){
        max-width: 350px;
        width: 95vw; 
    }
`

const FullRotate = keyframes`
    0%{
        transform: rotate(0deg)
    }
    100%{
        transform: rotate(360deg)
    }
`

const SpinningImage = styled.div`
    animation: ${FullRotate} 1.3s ease-in-out infinite;
    margin-bottom: 20px;
    width: 150px;
    height: 150px;
`
const Heading = styled.div`
    font-family: 'Inter', sans-serif;
    font-size: 24px;
    font-style: normal;
    font-weight: 300;
    line-height: 36px;
    letter-spacing: 0em;
    text-align: center;
    @media only screen and (max-width: 750px){
        font-size: 22px;
    }
`

const ConfirmAction = styled.div`
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 300;
    line-height: 24px;
    letter-spacing: 0em;
    text-align: center;
    color: #585863;
    @media only screen and (max-width: 750px){
        font-size: 14px;
    }
`
const StyledCloseIcon = styled(CloseRoundedIcon)`
	position: absolute;
	color: #FFFFFF;
	right:10px;
	top: 10px;
	width: 1.7rem !important;
	height: 1.7rem !important;
	cursor:pointer;
`

export const TransactionWaiting = ({ close }: Props) => {
    return (
        <Wrapper>
            <StyledCloseIcon onClick={close} />
            <SpinningImage>
                <SpinningIcon />
            </SpinningImage>
            <Heading>Waiting for Confirmation</Heading>
            <ConfirmAction>Confirm this transaction in your wallet</ConfirmAction>
        </Wrapper>
    )
}
