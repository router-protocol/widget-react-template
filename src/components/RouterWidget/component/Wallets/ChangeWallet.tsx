import { Button } from '@material-ui/core'
import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { walletList } from '../../config/ProviderConfig'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import { shortenAddress } from '../../utils'
import * as React from 'react';
interface Props {
    action: () => void;
    close: () => void;
    disconnect: ()=>void;
    accountAddress: string;
    walletId: string;
    ctaColor: string; 
    textColor: string;
    backgroundColor: string;
}

const Wrapper = styled.div<{ textColor: string, backgroundColor: string }>`
    font-size: 24px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    background: ${({backgroundColor}) => backgroundColor !== "" ? backgroundColor : "#1A1B1C"};
    color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"};
    width: 25rem;
    max-width: 25rem;
    height: 15rem;
    display: grid;
    place-items: center;
    border-radius: 20px;
    padding: 25px 20px;
    @media only screen and (max-width: 750px){
        width: 90vw;
    }
    padding-bottom: 40px;
`
const ButtonGroup=styled.div`
 display: flex;
    width: 100%;
    justify-content: space-between;
`

const ChangeButton = styled(Button)<{ ctaColor: string, backgroundColor: string }>`
    &&&{
	width: auto;
	height: 32px;
	background: ${({ backgroundColor }) => backgroundColor !== "" ? backgroundColor : "linear-gradient(93.89deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%);"};
	color: ${({ctaColor}) => ctaColor !== "" ? ctaColor : "#00A0BE"};
	border-radius: 10px;
	font-family: 'Inter', sans-serif;
	font-weight: 400;
	font-size: 16px;
	border:none;
	text-transform: none ;
	}
`
const StyledCloseIcon = styled(CloseRoundedIcon)<{ textColor: string }>`
	position: absolute;
	color:  ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"};
	right:10px;
	top: 10px;
	width: 1.7rem !important;
	height: 1.7rem !important;
	cursor:pointer;
`
const CopyAddressWrapper = styled.div<{ textColor: string }>`
    display: flex;
    align-items: center;
    color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"}50;
    font-weight: 300;
	font-size: 14px;
    /* margin-left: 20px; */
    margin-bottom: 20px;
    cursor: pointer;
`

const StyledFileCopyIcon = styled(FileCopyIcon)`
    &&&{
        margin-right: 5px;
        width: 14px;
    }
`
const StyledCheck = styled(CheckCircleOutlineRoundedIcon)`
    &&&{
        margin-right: 5px;
        width: 16px;
    }
`

const ChangeWallet = ({ action, close,disconnect, walletId, accountAddress, backgroundColor, textColor, ctaColor }: Props) => {
    // const [walletId] = useWalletId()
    // const [accountAddress] = useAccountAddress()
    const [copied, setCopied] = useState(false)

    const wallet = walletList.find(wallet => wallet.id === walletId)

    const copyToClipboard = useCallback(() => {
        navigator.clipboard.writeText(accountAddress)
        setCopied(true)
        setTimeout(() => setCopied(false), 4000)
    }, [setCopied])

    return (
        <Wrapper backgroundColor={backgroundColor} textColor={textColor}>
            <StyledCloseIcon onClick={close} textColor={textColor} />
            <img src={wallet?.logo} style={{ width: '80px', height: '80px' }} />
            <span style={{margin:"8px 0" }}>{wallet?.name}</span>
            <CopyAddressWrapper onClick={copyToClipboard} textColor={textColor} >
                {/* <span></span> */}
                {copied ? "Copied" : shortenAddress(accountAddress)}
                &nbsp;
                {copied ? <StyledCheck /> : <StyledFileCopyIcon />}
            </CopyAddressWrapper>
            <ButtonGroup>
            <ChangeButton onClick={action} ctaColor={ctaColor} backgroundColor={backgroundColor}>Change</ChangeButton>
            <ChangeButton onClick={disconnect} ctaColor={ctaColor} backgroundColor={backgroundColor}>Disconnect</ChangeButton>
            </ButtonGroup>
        </Wrapper>
    )
}

export default ChangeWallet
