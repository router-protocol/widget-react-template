import * as React from 'react';
import { Button } from '@material-ui/core'
import styled from 'styled-components'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { assetLogos, AssetType } from '../../config/asset';
import halfLogo from '../../assets/images/route-rewards.png'
import { fixedDecimalPlace, getChainNameById } from '../../utils';
import { NetworkType } from '../../config/network';

interface Props {
    inputAmount: string;
    outputAmount: string;
    sourceAsset: AssetType | '';
    destAsset: AssetType | '';
    sourceChain: NetworkType;
    destChain: NetworkType;
    minReturn: string;
    feeTokenSymbol: string;
    bridgeFee: string;
    isCrossChain: boolean;
    close: () => void;
    action: () => void;
    ctaColor: string; 
    textColor: string;
    backgroundColor: string;
}

const Wrapper = styled.div<{ backgroundColor: string, textColor: string }>`
    width: 410px;
    height: 500px;
    background:  ${({backgroundColor }) => backgroundColor !== "" ? backgroundColor : "linear-gradient(0deg, #212129, #212129)"};    
    backdrop-filter: blur(32px);
    color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"};
    font-family: 'Inter', sans-serif;
    border-radius: 20px;
    display: grid;
    place-items: center;
    grid-template-rows: 80px 200px auto;
    padding: 10px 0;
    @media only screen and (max-width: 750px){
        width: 360px;
    }
`

const Title = styled.div`
    font-size: 20px;
    font-weight: 400;
    text-align: center;
`

const AssetSummaryWrapper = styled.div`
    height: 100%;
`

const MinReturnStatement = styled.div`
    font-weight: 500;
    font-size: 12px;
    font-style: italic;
    padding: 10px 20px;
`

const TransactionDetailsWrapper = styled.div`
    width: 100%;
    height: 100%;
    //background: ${({ theme }) => theme.bg4};
    padding: 0 20px;
    border-radius: 0 0 20px 20px;
    display: grid;
    place-items: center;
`

const ConfirmButton = styled(Button)<{ ctaColor: string, textColor: string }>`
	&&&{
    background: ${({ disabled, ctaColor }) => disabled ? (ctaColor ? ctaColor.concat("88") : "#00A0BE88") : ctaColor !== "" ? ctaColor : "#00A0BE"};
    color: #FFFFFF;
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    width: fit-content;
    height: 55px; 
    width: 100%;
    text-transform: none;
    padding: 0 20px;
    border-radius: 7px;
    box-shadow: none;
    font-weight: 400;
  }
`
const StyledCloseIcon = styled(CloseRoundedIcon) <{ textColor: string }>`
	position: absolute;
	color:white;
	right: 15px;
	top: 15px;
	width: 1.7rem !important;
	cursor:pointer;
	height: 1.7rem !important;
`

const AssetDetailsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    font-size: 24px;
    font-weight: 500;
    margin: 5px 0;

    @media only screen and (max-width: 750px){
        font-size: 20px;
    }
`

const AssetWrapper = styled.div`
    display: flex;
    align-items: center;
`

const AssetImage = styled.img`
    width: 20px;
    height: 20px;
    margin-right: 10px;
`

const TransactionDetail = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 5px 0px;
    width: 100%;
    font-size: 14px;
`

const TransactionParamsWrapper = styled.div`
    height: auto;
    max-height: 110px;
    width: 100%;
    background: rgba(0, 0, 0, 0.2);
    display: grid;
    place-items: center;
    padding: 10px;
    border-radius: 8px;
`

const Label = styled.span`
    

`

const Value = styled.div`
    font-weight: 500;
`

const RouteImage = styled.div`
    display: grid;
    padding-left: 25px;
`

const ConfirmOrderWindow = ({
    inputAmount,
    outputAmount,
    sourceAsset,
    destAsset,
    sourceChain,
    destChain,
    minReturn,
    feeTokenSymbol,
    bridgeFee,
    isCrossChain,
    close,
    action,
    backgroundColor, 
    textColor, 
    ctaColor
}: Props) => {
    return (
        <Wrapper backgroundColor={backgroundColor} textColor={textColor}>
            <StyledCloseIcon onClick={close} textColor={textColor} />
            <Title>
                Confirm Swap
            </Title>
            <AssetSummaryWrapper>
                <AssetDetailsWrapper>
                    <AssetWrapper>
                        <AssetImage
                            src={assetLogos[sourceAsset && sourceAsset.symbol] ? assetLogos[sourceAsset && sourceAsset.symbol] : `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${getChainNameById(sourceChain.networkId)}/assets/${sourceAsset && sourceAsset.address}/logo.png`}
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src = "https://cdn.shopify.com/s/files/1/1061/1924/products/Thinking_Face_Emoji_small.png?v=1571606036";
                            }}
                        />
                        <span>{fixedDecimalPlace(inputAmount, 4)}</span>
                    </AssetWrapper>
                    <span>{sourceAsset && sourceAsset.symbol} ({sourceChain.name?.split(' ')[0]})</span>
                </AssetDetailsWrapper>
                <RouteImage>
                    <img src={halfLogo} height="20px" alt="" />
                </RouteImage>
                <AssetDetailsWrapper>
                    <AssetWrapper>
                        <AssetImage
                            src={assetLogos[destAsset && destAsset.symbol] ? assetLogos[destAsset && destAsset.symbol] : `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${getChainNameById(destChain.networkId)}/assets/${destAsset && destAsset.address}/logo.png`}
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src = "https://cdn.shopify.com/s/files/1/1061/1924/products/Thinking_Face_Emoji_small.png?v=1571606036";
                            }}
                        />
                        <span>{outputAmount.includes("Calculating") ? outputAmount : fixedDecimalPlace(outputAmount, 4)}</span>
                    </AssetWrapper>
                    <span>{destAsset && destAsset.symbol} ({destChain.name?.split(' ')[0]})</span>
                </AssetDetailsWrapper>
                <MinReturnStatement>
                    Output is estimated. You will receive at least {fixedDecimalPlace(minReturn, 6)} {destAsset && destAsset.symbol} or the transaction will be settled in stable or wrapper assets.
                </MinReturnStatement>
            </AssetSummaryWrapper>

            <TransactionDetailsWrapper>
                <TransactionParamsWrapper>
                    <TransactionDetail>
                        <Label>Price</Label>
                        <Value>{fixedDecimalPlace(parseFloat(outputAmount) / parseFloat(inputAmount), 4)}&nbsp;{sourceAsset && sourceAsset.symbol}/{destAsset && destAsset.symbol}</Value>
                    </TransactionDetail>
                    <TransactionDetail>
                        <Label>Minimum Received</Label>
                        <Value>{fixedDecimalPlace(minReturn, 6)}&nbsp;{destAsset && destAsset.symbol}</Value>
                    </TransactionDetail>
                    {
                        isCrossChain &&
                        <TransactionDetail>
                            <Label>Bridge Fee</Label>
                            <Value>{fixedDecimalPlace(bridgeFee, 4)}&nbsp;{feeTokenSymbol}</Value>
                        </TransactionDetail>
                    }
                </TransactionParamsWrapper>
                <ConfirmButton onClick={action} textColor={textColor} ctaColor={ctaColor}>
                    Confirm Swap
                </ConfirmButton>
            </TransactionDetailsWrapper>
        </Wrapper>
    )
}

export default ConfirmOrderWindow
