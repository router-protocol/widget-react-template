// import React, { useMemo } from 'react'
import * as React from 'react';
import styled, { keyframes } from 'styled-components'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { getFlooredFixed } from '../../utils';
import SpinningIcon from '../../assets/react-components/SpinningIcon';

interface Props {
    close: () => void;
    sourceInput: string;
    destinationInput: string;
    sourceSymbol: string;
    destinationSymbol: string;
    ctaColor: string; 
    textColor: string;
    backgroundColor: string;
}

const Wrapper = styled.div<{ textColor: string, backgroundColor: string }>`
    width: 400px;
    height: 420px;
    border-radius: 20px;
    background-color: ${({backgroundColor}) => backgroundColor !== "" ? backgroundColor : "#1A1B1C"};    
backdrop-filter: blur(32px);
 
    color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"};; 
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

const SpinningImage = styled.div<{ ctaColor: string }>`
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

const SwapState = styled.div`
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    font-style: normal;
    font-weight: 300;
    line-height: 27px;
    letter-spacing: 0em;
    text-align: center;
    @media only screen and (max-width: 750px){
        font-size: 16px;
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
const StyledCloseIcon = styled(CloseRoundedIcon)<{ textColor: string }>`
	position: absolute;
	color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"};
	right:10px;
	top: 10px;
	width: 1.7rem !important;
	height: 1.7rem !important;
	cursor:pointer;
`

export const WaitingCard = ({ sourceInput, destinationInput, sourceSymbol, destinationSymbol, close, backgroundColor, ctaColor, textColor }: Props) => {
    // const location = useLocation()
    // const isWidget = useMemo(() => decodeURIComponent(new URLSearchParams(location.search).get("isWidget") ?? ''), [location])
    // const backgroundColor = useMemo(() => decodeURIComponent(new URLSearchParams(location.search).get("backgroundColor") ?? ''), [location])
    // const textColor = useMemo(() => decodeURIComponent(new URLSearchParams(location.search).get("textColor") ?? ''), [location])
    // const ctaColor = useMemo(() => decodeURIComponent(new URLSearchParams(location.search).get("ctaColor") ?? ''), [location])
    return (
        <Wrapper backgroundColor={backgroundColor} textColor={textColor}>
            <StyledCloseIcon onClick={close} textColor={textColor} />
            <SpinningImage ctaColor={ctaColor}>
                <SpinningIcon color={ctaColor} />
            </SpinningImage>
            <Heading>Waiting for Confirmation</Heading>
            <SwapState>Swapping {getFlooredFixed(Number(sourceInput), 6)} {sourceSymbol} for {getFlooredFixed(Number(destinationInput), 6)} {destinationSymbol}</SwapState>
            <ConfirmAction>Confirm this transaction in your wallet</ConfirmAction>
        </Wrapper>
    )
}
