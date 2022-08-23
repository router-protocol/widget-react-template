// import React, { useMemo } from 'react'
import * as React from 'react';
import styled from 'styled-components'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { Button } from '@material-ui/core';
// import { useLocation } from 'react-router';

interface Props {
    priceImpact: string;
    action: () => void;
    close: () => void;
    ctaColor: string; 
    textColor: string;
    backgroundColor: string;
}

const WrappedWarningWrapper = styled.div<{ textColor: string, backgroundColor: string }>`
	font-family: 'Inter', sans-serif;
    color:  ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"};
    width: 360px;
    height: 255px;
    border-radius: 20px;
    background: ${({ backgroundColor }) => backgroundColor !== "" ? backgroundColor : "linear-gradient(0deg, #212129, #212129)"};    
    backdrop-filter: blur(32px);display: grid;
    place-items: center;
    padding: 15px 20px;
    position: relative;

    @media only screen and (max-width: 960px){
        width: 340px;
    }
`
const Title = styled.div`
    font-size: 20px;
    font-weight: 500;
    @media only screen and (max-width: 960px){
        font-size: 20px;
    }
`

const WarningTitle = styled.div`
    text-align: center;
    line-height: 25px;
    font-size: 16px;
`

const StyledCloseIcon = styled(CloseRoundedIcon)<{ textColor: string }>`
	position: absolute;
	color:  ${({textColor}) => textColor !== "" ? textColor : 'white'};
	right: 7px;
	top: 7px;
	width: 25px !important;
	height: 25px !important;
	cursor:pointer;
`

const AddButton = styled(Button)<{ ctaColor: string, textColor: string }>`
	&&&{
    background: ${({ ctaColor }) => ctaColor !== "" ? ctaColor : "#00A0BE"};
    color:  ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"};
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    width: fit-content;
    width: 100%;
    height: 50px;
    text-transform: none;
    border-radius: 7px;
    box-shadow: none;
    font-weight: 400;

    @media only screen and (max-width: 960px){
        font-size: 16px;
    }
  }
`

const PriceImpactWarning = ({ action, close, priceImpact, backgroundColor, textColor, ctaColor }: Props) => {
    return (
        <WrappedWarningWrapper  backgroundColor={backgroundColor} textColor={textColor}>
            <StyledCloseIcon onClick={close} textColor={textColor} />
            <Title>
                Warning
            </Title>
            <WarningTitle>
                This swap has a price impact of at least {priceImpact}%. Please confirm that you would like to continue with this swap.
            </WarningTitle>
            <AddButton onClick={action} textColor={textColor} ctaColor={ctaColor}>
                Confirm
            </AddButton>
        </WrappedWarningWrapper>
    )
}

export default PriceImpactWarning
