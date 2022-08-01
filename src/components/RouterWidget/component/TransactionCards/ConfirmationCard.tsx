import React from 'react'
import styled from 'styled-components'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import metamaskLogo from '../../assets/images/wallet-logos/metamask.svg'
import { AssetType } from '../../config/asset';
import { addTokenToMetamask } from '../../utils/metamaskFunctions';
import approveIcon from "../../assets/vectors/approve.svg"

interface Props {
    close: () => void;
    asset: AssetType | '';
    explorer: string;
}

const Wrapper = styled.div`
  width: 370px;
  min-height: 420px;
  height: 100%;
  border-radius: 20px;
  background-color: #1A1B1C;
  backdrop-filter: blur(32px);

  color: #FFFFFF;
  font-family: "Inter", sans-serif;
  display: grid;
  place-items: center;
  padding-top: 20px;
  padding-bottom: 12px;

  @media only screen and (max-width: 750px){
    max-width: 350px;
	width: 95vw; 
    }
`;
const StyledCloseIcon = styled(CloseRoundedIcon)`
  position: absolute;
  color: #FFFFFF;
  right: 10px;
  top: 10px;
  width: 1.7rem !important;
  height: 1.7rem !important;
  cursor: pointer;
`;
// const TransactionIcon = styled.div`
//     width: 86px;
//     height: 86px;
//     display: grid;
//     place-items: center;
// `
const Heading = styled.div`
  margin-top: 35px;
  font-family: "Inter", sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 300;
  line-height: 0px;
  letter-spacing: 0em;
  text-align: center;

    @media only screen and (max-width: 750px){
        font-size: 22px;
    }
`;

const Explorer = styled.div`
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: 300;
  font-size: 18px;
  line-height: 2px;
  text-align: center;
  text-decoration-line: underline;
  color: #00A0BE;
  cursor: pointer;
  @media only screen and (max-width: 750px){
    font-size: 16px;
    }
`;

const Add = styled.div`
  height: 30px;
  background: #00a0be;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  cursor: pointer;
  @media only screen and (max-width: 750px){
     font-size: 14px;
    }
`;

const CloseButton = styled.div`
  width: 300px;
  height: 55px;
  background: #00A0BE;
  border-radius: 10px;
  font-family: "Inter", sans-serif;
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
`;

const ApproveLogo = styled.img`
  width: 120px;
`;

const MetaMaskLogo = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 5px;
  margin-bottom: 2px;
`;

const SwapConfirmationCard = ({ close, asset, explorer }: Props) => {

    const openTransaction = () => {
        window.open(explorer, '_blank', 'noopener,noreferrer')
    }

    return (
        <Wrapper>
            <StyledCloseIcon onClick={close}  />
            <ApproveLogo src={approveIcon} />
            <Heading>
                Transaction Successful
            </Heading>
            <Explorer onClick={openTransaction}>
                View on explorer
            </Explorer>
            {
                asset &&
                <Add onClick={() => addTokenToMetamask(asset && asset.address, asset && asset.symbol, asset && asset.decimals, '')}>
                    <span>Add {asset && asset.symbol} to MetaMask</span>
                    <MetaMaskLogo src={metamaskLogo} />
                </Add>
            }
            <CloseButton onClick={close}>
                Close
            </CloseButton>
        </Wrapper>
    )
}

export default SwapConfirmationCard
