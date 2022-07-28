// import React, { useMemo } from 'react'
import * as React from 'react';
import styled from 'styled-components'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import metamaskLogo from '../../assets/images/wallet-logos/metamask.svg'
import { AssetType } from '../../config/asset';
import { addTokenToMetamask } from '../../utils/metamaskFunctions';
//import approveIcon from "../../assets/vectors/approve.svg"
import WarningTwoToneIcon from '@material-ui/icons/WarningTwoTone';
import { fixedDecimalPlace } from '../../utils';
// import { useLocation } from 'react-router';
import CompletedIcon from '../../assets/react-components/CompletedIcon';

interface Props {
    close: () => void;
    asset: AssetType | '';
    explorer: string;
    showSettelementToken: boolean;
    isCrossChain: boolean;
    finalReceivedAmount: string;
    ctaColor: string; 
    textColor: string;
    backgroundColor: string;
}

const Wrapper = styled.div<{ textColor: string, backgroundColor: string }>`
    width: 370px;
    min-height: 420px;
    height: 100%;
    border-radius: 20px;
    background-color: ${({backgroundColor}) => backgroundColor !== "" ? backgroundColor : "#1A1B1C"};    
backdrop-filter: blur(32px);
 
    color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"}; 
    font-family: 'Inter', sans-serif;
    display: grid;
    place-items: center;
    padding: 30px 0;

    @media only screen and (max-width: 750px){
        max-width: 350px;
        width: 95vw; 
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
// const TransactionIcon = styled.div`
//     width: 86px;
//     height: 86px;
//     display: grid;
//     place-items: center;
// `
const InfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 140px;
    padding-top: 20px;
`

const Heading = styled.div`
    font-family: 'Inter', sans-serif;
    font-size: 22px;
    font-style: normal;
    font-weight: 300;
    text-align: center;

    @media only screen and (max-width: 750px){
        font-size: 22px;
    }
`

const Explorer = styled.div<{ ctaColor: string }>`
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 2px;
    text-align: center;
    text-decoration-line: underline;
    color: ${({ctaColor}) => ctaColor !== "" ? ctaColor : "#00A0BE"}; 
    cursor: pointer;

    @media only screen and (max-width: 750px){
        font-size: 16px;
    }
`

const Add = styled.div<{ backgroundColor: string }>`
    height: 30px;
    background: ${({backgroundColor}) => backgroundColor !== "" ? backgroundColor : "#00A0BE44"}; 
    border-radius: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    font-size: 14px;
    cursor: pointer;

    @media only screen and (max-width: 750px){
        font-size: 14px;
    }
`
const AlertWrapper = styled.div<{ textColor: string, backgroundColor: string }>`
    width: 300px;
    background: ${({ backgroundColor }) => backgroundColor !== "" ? 'none' : 'rgba(242, 201, 76, 0.15)'};
    color:  ${({textColor}) => textColor !== "" ? textColor : "#F2C94C"};
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    display: grid;
    padding: 10px;
    border-radius: 5px;
    margin: 20px;
`
const WarningText1 = styled.div`
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    width: 100%;
    justify-content: center;
`

const WarningText2 = styled.div`
    font-size: 14px;
    font-weight: 300;
    text-align: center;
`

const WarningIcon = styled(WarningTwoToneIcon)`
    &&&{
        height: 15px;
        fill: #F2C94C; //ChangeColor
    }
`

const CloseButton = styled.div<{ ctaColor: string }>`
    width: 300px;
    height: 55px;
    background: ${({ctaColor}) => ctaColor !== "" ? ctaColor : "#00A0BE"}; 
    border-radius: 10px;
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 22px;
    display: grid;
    place-items: center;
    cursor: pointer;

    @media only screen and (max-width: 750px){
        font-size: 20px;
        width: 95%;
        height: 50px;
    }
    margin-top: 10px;
`

// const ApproveLogo = styled.img`
//     width: 120px;
// `

const MetaMaskLogo = styled.img`
    width: 20px;
    height: 20px;
    margin-left: 5px;
    margin-bottom: 2px;
`

const SwapConfirmationCard = ({ close, asset, explorer, showSettelementToken, finalReceivedAmount, isCrossChain, backgroundColor, ctaColor, textColor }: Props) => {

    const openTransaction = () => {
        window.open(explorer, '_blank', 'noopener,noreferrer')
    }

    return (
        <Wrapper backgroundColor={backgroundColor} textColor={textColor}>
            <StyledCloseIcon onClick={close} textColor={textColor}/>
            <CompletedIcon color={ctaColor} />
            <InfoWrapper>
                <Heading>
                    Transaction Successful
                </Heading>
                <Explorer onClick={openTransaction} ctaColor={ctaColor}>
                    View on explorer
                </Explorer>
                <Add
                    backgroundColor={backgroundColor}
                    onClick={() => !isCrossChain && addTokenToMetamask(asset && asset.address, asset && asset.symbol, asset && asset.decimals, '')}>
                    <span>You have received {fixedDecimalPlace(finalReceivedAmount, 4)} {asset && asset.symbol}</span>
                    {!isCrossChain && <MetaMaskLogo src={metamaskLogo} />}
                </Add>
            </InfoWrapper>
            {
                showSettelementToken &&
                <AlertWrapper backgroundColor={backgroundColor} textColor={textColor}>
                    <WarningText1>
                        <WarningIcon />Alert
                    </WarningText1>
                    <WarningText2>
                        Due to low liquidity settlement has been done in <span style={{ fontWeight: 600 }}>{asset && asset.symbol}</span>
                    </WarningText2>
                </AlertWrapper>
            }
            <CloseButton onClick={close} ctaColor={ctaColor} >
                Close
            </CloseButton>
        </Wrapper>
    )
}

export default SwapConfirmationCard
