import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { chainLogos } from "../../config/asset";
//import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import MenuWrapper from "../Menu/MenuWrapper";
import { chains, NetworkType } from "../../config/network";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import { switchNetworkInMetamask } from "../../utils/metamaskFunctions";
import { useMediaQuery } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { MEDIA_WIDTHS } from "../../constant";

interface CustomProps{
  isWalletConnected: boolean; 
  currentNetwork: NetworkType | '';
  textColor: string;
  backgroundColor: string;
}

const Wrapper = styled.div`
`;

const NetworkOptionsWrapper = styled.div<{
  backgroundColor: string;
  textColor: string;
}>`
  color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"};;
  font-family: "Inter", sans-serif;
  width: 340px;
  background:  ${({ backgroundColor }) => backgroundColor !== "" ? backgroundColor : "#1A1B1C"};
  backdrop-filter: blur(32px);

  padding: 0 15px;
  border-radius: 10px;
`;

const NetworkBody = styled.div<{ selected: boolean; backgroundColor: string}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 97%;
  border: 1px solid ${({ backgroundColor }) => backgroundColor !== "" ? "rgba(255, 255, 255, 0.10)" : "rgba(88, 88, 99, 0.24)"};
  height: 51px;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 0 10px;
  cursor: pointer;
  background: ${({ selected }) =>
    selected ? "linear-gradient(0deg, #212129, #212129)" : "none"};
  :hover {
    border: 1px solid #A3A4A4;
  }
`;
const NetworkName = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NetworkTitle = styled.div`
  font-size: 16px;
  padding: 15px 0;
  position: relative;
  margin-bottom: 10px;
`;

const OnlineSign = styled.div<{ show: boolean }>`
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: rgb(117, 241, 169);
  margin-right: 7px;
  opacity: ${({ show }) => (show ? 1 : 0)};
`;

const NetworkImage = styled.img`
  width: 20px;
`;
const StyledCloseIcon = styled(CloseRoundedIcon)`
  position: absolute;
  color: white;
  right: 0;
  width: 1.7rem !important;
  height: 1.7rem !important;
  cursor: pointer;
`;

const NetworkWrapper = styled.div<{
  show: boolean;
  backgroundColor: string;
  textColor: string;
}>`
  height: 35px;
  padding: 0px 10px;

  margin-right: 16px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  line-height: 30px;
  background-size: cover;
  display: ${({ show }) => (show ? "flex" : "none")};

  @media only screen and (max-width: 960px){
    height: 35px;
  }

  @media only screen and (max-width: 750px){
    padding: 0px 10px;
    padding-right: 8px;
    background: linear-gradient(94.38deg, rgba(0, 0, 0, 0.2) -16.59%, rgba(0, 0, 0, 0) 114.58%);
    border: 1px solid rgba(255, 255, 255, 0.25);
    filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.04)) drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.06));
  	
  }
  background: rgba(255, 255, 255, 0.15);
  color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"};
  box-shadow: ${({ backgroundColor }) =>
    backgroundColor !== ""
    ? "3px 3px 10px 4px rgba(0, 0, 0, 0.1)"
    : "3px 3px 10px 4px rgba(0, 0, 0, 0.3)"};
  //transform: translateX(16px);
  :hover {
    background: linear-gradient(
      94.38deg,
      rgba(255, 255, 255, 0.2) -16.59%,
      rgba(255, 255, 255, 0) 114.58%
    );
    border: 1px solid rgba(255, 255, 255, 0.25);
    filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.04))
      drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.06));
  }
`;

const CurrentNetwork = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  @media only screen and (max-width: 960px){
    justify-content: flex-start;
  }
`;

const Image = styled.img`
  width: 18px;
  margin-right: 7px;
  margin-left: 2px;
  @media only screen and (max-width: 960px){
    width: 16px;
  }
`;
const StyledExpandMoreIcon = styled(ExpandMoreIcon)`
  &&& {
  }
`;

// const StyledArrowForwardIosIcon = styled(ArrowForwardIosIcon)`
// &&&{
//         width: 14px;
//         margin-left:3px;
//         ${({ theme }) => theme.mediaWidth.upToMedium`
//             display: none;
//   	    `};
//     }
// `

const NetworkArrayWrapper = styled.div<{ backgroundColor: string }>`
  height: 300px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
    background:  ${({ backgroundColor }) => backgroundColor !== "" ? "#3B4256" : "#A3A4A470"};
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${({ backgroundColor }) => backgroundColor !== "" ? "#3B4256" : "#A3A4A4"};;
  }
`;

const Network: React.FunctionComponent<CustomProps> = ({isWalletConnected, currentNetwork, backgroundColor, textColor}: CustomProps) => {
  const upToSmall = useMediaQuery(`(max-width: ${MEDIA_WIDTHS.upToSmall}px)`);
  const [openNetworkMenu, setOpenNetworkMenu] = useState(false);
  return (
    <Wrapper>
      <MenuWrapper
        open={openNetworkMenu}
        onClose={() => setOpenNetworkMenu(false)}
      >
        <NetworkOptionsWrapper
          backgroundColor={backgroundColor}
          textColor={textColor}
        >
          <NetworkTitle>
            Connect to a network
            <StyledCloseIcon onClick={() => setOpenNetworkMenu(false)} />
          </NetworkTitle>
          <NetworkArrayWrapper backgroundColor={backgroundColor}>
            {chains.map((chain, index) => <NetworkBody key={index} selected={currentNetwork !== '' && currentNetwork.networkId === chain.networkId} onClick={() => switchNetworkInMetamask(chain.id)} backgroundColor={backgroundColor}>
              <NetworkName>
                <OnlineSign show={currentNetwork !== '' && currentNetwork.networkId === chain.networkId}></OnlineSign>
                {chain.name?.split(' ')[0]}
              </NetworkName>
              <NetworkImage src={chainLogos[chain.networkId]} />
            </NetworkBody>)}
          </NetworkArrayWrapper>
        </NetworkOptionsWrapper>
      </MenuWrapper>
      <NetworkWrapper
        show={
          isWalletConnected
            ? currentNetwork === ""
              ? true
              : currentNetwork.name === "Loading..."
                ? false
                : true
            : false
        }
        onClick={() => setOpenNetworkMenu(true)}
        textColor={textColor}
        backgroundColor={backgroundColor}
      >
        <CurrentNetwork>
          <Image
            src={
              chainLogos[
              currentNetwork !== "" && currentNetwork.name !== "Loading..."
                ? currentNetwork?.networkId
                : "default"
              ]
            }
          />
          {!upToSmall
            ? currentNetwork
              ? currentNetwork?.name.split(" ")[0]
              : "Unsupported"
            : null}
        </CurrentNetwork>
        <StyledExpandMoreIcon />
      </NetworkWrapper>
    </Wrapper>
  );
};

export default Network;
