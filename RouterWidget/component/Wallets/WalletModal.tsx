import React, { useMemo } from 'react'
import styled from 'styled-components'
import { walletList } from '../../config/ProviderConfig'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

const Wrapper = styled.div<{ backgroundColor: string, textColor: string }>`
   width: 420px;
   height: 33rem;
   font-family: 'Inter', sans-serif;
   color: ${({ textColor }) => textColor !== "" ? textColor : "#FFFFFF"};
   background:${({ backgroundColor }) => backgroundColor !== "" ? backgroundColor : "#1A1B1C"};
   border-radius: 1.5rem;
   grid-template-rows: auto auto;
   justify-items: center;
   @media only screen and (max-width: 750px){
        max-width: 25rem;
		width: 80vw;
	    height: 80vh;
        display: flex;
        flex-direction: column;
    }
`
const WalletsWrapper = styled.div`
    display: grid;
    place-items: center;
	overflow: hidden;
	font-family: 'Inter', sans-serif;
    z-index:4;
    width: 90%;
    height: 90%;
    overflow-y: scroll;
    padding: 5px 30px;
    margin-top: 10px;
    @media only screen and (max-width: 750px){
        max-width: 25rem;
		width: 70vw;
	    height: 80vh;
        display: flex;
        flex-direction: column;
    }
`

const Logo = styled.img`
    height: 40px;
    width: 40px;
    transition: all 0.2s ease-in-out;
    @media only screen and (max-width: 750px){
        height: 33px;
        width: 33px;
    }
`

const WalletWrapper = styled.div<{ backgroundColor: string }>`
    width: 100%;
    height: 4rem;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;
    border-radius: 10px;
    padding: 0 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 2px;
    border: 1px solid transparent;
    background: ${({ backgroundColor }) => backgroundColor ? backgroundColor : "linear-gradient(93.89deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%);"};
    :hover{
        border: 1px solid #A3A4A4;
    }
    @media only screen and (max-width: 750px){
        margin-bottom: 20px;
    }
`

const WalletName = styled.div`
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
`

const Title = styled.div`
    font-size: 20px;
    grid-column: span 2;
    font-weight: 500;
    text-align: center;
    margin-top: 20px;
`
const StyledCloseIcon = styled(CloseRoundedIcon) <{ textColor: string }>`
	position: absolute;
	color: ${({ textColor }) => textColor !== "" ? textColor : "#FFFFFF"};
	right: 15px;
	top: 15px;
	width: 1.7rem !important;
	height: 1.7rem !important;
	cursor:pointer;
`
const OnlineSign = styled.div<{ show: boolean }>`
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: rgb(117, 241, 169);
  margin-right: 7px;
  opacity: ${({ show }) => show ? 1 : 0};
`

interface Props {
    action: (walletId: string, trigger: string) => Promise<void>
    close: () => void;
    walletId: string;
    backgroundColor: string;
    textColor: string;
}

const WalletModal = ({ action, close, walletId, backgroundColor, textColor }: Props) => {
    const newWalletList = useMemo(() => !window.ethereum ? walletList.slice(1) : walletList, [])
    return (
        <Wrapper backgroundColor={backgroundColor} textColor={textColor}>
            <StyledCloseIcon onClick={close} textColor={textColor} />
            <Title>Connect To</Title>
            <WalletsWrapper>
                {
                    newWalletList.map((wallet, index) => (
                        <WalletWrapper key={index} onClick={() => action(wallet.id, 'click')} backgroundColor={backgroundColor}>
                            <WalletName>
                                <OnlineSign show={walletId === wallet.id}></OnlineSign>
                                {wallet.name}
                            </WalletName>
                            <Logo src={wallet.logo} />
                        </WalletWrapper>
                    ))
                }
            </WalletsWrapper>
        </Wrapper>
    )
}

export default WalletModal
