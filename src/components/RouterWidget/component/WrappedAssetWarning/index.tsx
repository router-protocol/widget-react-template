import styled from 'styled-components'
import { AssetType } from '../../config/asset'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { Button } from '@material-ui/core';
import * as React from 'react';
interface Props {
    wrappedAsset: '' | AssetType;
    dstAsset: string;
    dstChain: string;
    action: () => void;
    close: () => void;
    ctaColor: string; 
    textColor: string;
    backgroundColor: string;
}

const WrappedWarningWrapper = styled.div<{ textColor: string; backgroundColor: string }>`
	font-family: 'Inter', sans-serif;
    color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"};;
    width: 360px;
    height: 275px;
    border-radius: 20px;
    background: ${({ backgroundColor }) => backgroundColor ? backgroundColor : "linear-gradient(0deg, #212129, #212129)"};    
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

// const WarningAssetWrapper = styled.div`
//     display: grid;
//     grid-template-columns: 28px auto;
//     align-items: center;
// `

// const WarningAssetImage = styled.img`
//     width: 22px;
//     height: 22px;
// `

// const AssetImage = styled.img`
//     width: 20px;
//     height: 20px;
//     transform: translateY(4px);
// `

// const WarningAssetTitle = styled.div`
//     font-size: 24px;
//     font-weight: 500;
// `

const StyledCloseIcon = styled(CloseRoundedIcon)`
	position: absolute;
	color:white;
	right: 7px;
	top: 7px;
	width: 25px !important;
	height: 25px !important;
	cursor:pointer;
`

const AddButton = styled(Button)<{textColor: string, ctaColor: string}>`
	&&&{
    background: ${({ctaColor}) => ctaColor !== "" ? ctaColor : "#00A0BE" };
    color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"};
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
const Explorer = styled.div<{ ctaColor: string }>`
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 14px;
    line-height: 2px;
    text-align: center;
    text-decoration-line: underline;
    color: ${({ctaColor}) => ctaColor !== "" ? ctaColor : "#00A0BE"};
    cursor: pointer;
    @media only screen and (max-width: 750px){
        font-size: 16px;
    }
`

const WrappedAssetWarning = ({ wrappedAsset, dstAsset, dstChain, action, close, ctaColor, backgroundColor, textColor }: Props) => {
    return (
        <WrappedWarningWrapper backgroundColor={backgroundColor} textColor={textColor}>
            <StyledCloseIcon onClick={close} />
            <Title>
                Alert!
            </Title>
            <WarningTitle>
                Due to low liquidity reserves on the {dstChain} chain,you might receive a RAsset,which can later be claimed for its original  version
            </WarningTitle>
            <Explorer onClick={() => window.open("https://docs.routerprotocol.com/more-about-router-protocol/r-assets", '_blank', 'noopener,noreferrer')} ctaColor={ctaColor}>
                Learn more about RAsset
            </Explorer>
            {/* <WarningAssetWrapper>
                <WarningAssetImage src={assetLogos[wrappedAsset&&wrappedAsset.symbol]}/>
                <WarningAssetTitle>
                    {wrappedAsset&&wrappedAsset.symbol}
                </WarningAssetTitle>
            </WarningAssetWrapper> */}
            <AddButton onClick={action} textColor={textColor} ctaColor={ctaColor}>
                Accept
            </AddButton>
        </WrappedWarningWrapper>
    )
}

export default WrappedAssetWarning
