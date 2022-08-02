import React from "react";
import styled from "styled-components";
//import { useDarkModeManager } from '../../state/toggletheme/hooks';
import Network from "./Network";
import TestFaucet from "../Button/TestFaucet";
// import BetaButton from "../Button/BetaButton";
import { getErrorMessage1 } from "../../config/errorMessages";
// import BetaWarning from "../BetaWarning";
//import CallMadeRoundedIcon from '@material-ui/icons/CallMadeRounded';
//import { IS_MAINNET } from '../../config/config';
// import { useMediaQuery } from "@material-ui/core";
//import { useSourceChain } from '../../state/swap/hooks';
//import { useSelectedChain } from '../../state/liquidity-mining/hooks';
// import { useLocation } from "react-router";
// import PoweredByRouter from "../../assets/react-components/PoweredByRouter"
import WalletBox from "../Wallets/WalletBox";
import { NetworkType } from "../../config/network";
// import { MEDIA_WIDTHS } from "../../constant";

export const MAIN_LOGO_WIDTH = 12;

interface CustomProps {
  currentNetwork: NetworkType | '';
  setCurrentNetwork: (e: NetworkType | '') => void;
  walletId: string;
  setWalletId: (e: string) => void;
  currentAccountAddress: string;
  setCurrentAccountAddress: (e: string) => void;
  isWalletConnected: boolean;
  setIsWalletConnected: (e: boolean) => void;
  networkId: string;
  setNetworkId: (e: string) => void;
  useWidgetWallet: boolean;
  ctaColor: string; 
  textColor: string;
  backgroundColor: string;
}

const HeaderWrapper = styled.div<{
  correctNetwork: boolean;
  backgroundColor: string;
}>`
  width: 100vw;
  margin-top: 15px;
  position: absolute;
  top: ${({ correctNetwork }) => (correctNetwork ? "0px" : "30px")};
  display: flex;
  // justify-content: space-between;
  justify-content: end;
  align-items: center;
  padding: 1.5rem 2.5rem;
  cursor: pointer;
  
  @media only screen and (max-width: 960px){
    padding: 1.5rem;
  }
  @media only screen and (max-width: 750px){
    background: ${({backgroundColor}) => backgroundColor !== "" ? backgroundColor : "#203B41"};
    position: fixed;
    padding: 0.6rem;
    z-index: 6;
    margin-top: 0px;
  }
  background-color: transparent;
  z-index: 5;
`;

const HeaderRightWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 45px;
  @media only screen and (max-width: 960px){
    margin-right: 0px;
		justify-content: flex-end;
  }
`;

// const ThemeSwitch = styled.div`
// 	color: ${({ theme }) => theme.blue2};
// 	border-radius: 50%;
// 	padding: 5px;
// 	display: flex;
// 	justify-content: center;
// 	align-items: center;
// 	background: linear-gradient(0deg, rgba(240, 84, 84, 0.3), rgba(240, 84, 84, 0.3));
// 	mix-blend-mode: normal;
// 	backdrop-filter: blur(1.75281px);
// 	cursor: pointer;
// `;

// const MobileLogoWrapper = styled.div`
//   display: grid;
//   place-content: center;
//   margin-left: 3.1rem;
//   width: 38px;
//   height: 38px;
//   background: rgba(0, 0, 0, 0.25);
//   border-radius: 7.125px;
// `;
// const BetaWarningWrapper = styled.div<{ correctNetwork: boolean }>`
//   position: fixed;
//   top: ${({ correctNetwork }) => (correctNetwork ? "5.2rem" : "113.2px")};
//   left: 0.8rem;
//   opacity: 0;
//   transition: all 0.2s ease-in-out;
//   ${({ theme }) => theme.mediaWidth.upToLarge`
// 		position: absolute;
// 		left: 4rem;
// 		top: 5.2rem;
//   	`};
//   ${({ theme }) => theme.mediaWidth.upToSmall`
// 		top: 4rem;
// 		left: 2.2rem;
//   	`};
// `;

// const BetaButtonWrapper = styled.div<{ correctNetwork: boolean }>`
//   position: fixed;
//   top: ${({ correctNetwork }) => (correctNetwork ? "2.5rem" : "70px")};
//   left: 12.5rem;
//   &:hover ~ ${BetaWarningWrapper} {
//     opacity: 1;
//   }
//   ${({ theme }) => theme.mediaWidth.upToLarge`
// 		position: absolute;
//         left: 16.5rem;
// 		top: 2.25rem;
//   	`};
//   ${({ theme }) => theme.mediaWidth.upToSmall`
// 		position: absolute;
//         left: 5.8rem;
// 		top: 1.7rem;
// 		display: none;
//   	`};
// `;
const NetworkWarningWrapper = styled.div`
  width: 100%;
  position: fixed;
  z-index: 100;
`;

const NetworkWarning = styled.div`
  background: #00A0BE;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 400px;
  width: 100%;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 960px){
    font-size: 11px;
  }
`;
// const SwitchButton = styled.div`
// 	display: flex;
// 	align-items: center;
// 	justify-content: center;
// 	cursor: pointer;
// 	text-decoration: underline;
// `
// const LinkArrow = styled(CallMadeRoundedIcon)`
// 	width: 19px !important;
// 	${({ theme }) => theme.mediaWidth.upToSmall`
// 		width: 12px !important;
//   	`};
// `

// const HeaderLogoWrapper = styled.div`
//   display: flex;
//   align-items: center;
// `;
// const OuterBorder = styled.div<{ textColor: string }>`
//   border-radius: 50%;
//   height: 36px;
//   width: 36px;
//   position: relative;
//   border: 1px solid
//     ${({ textColor, theme }) => (textColor ? textColor : theme.text1)};
//   display: grid;
//   place-items: center;
// `;

// const InnerLogo = styled.img`
//   height: 30px;
//   width: 30px;
// `;
// const VerticalSeperator = styled.div<{ textColor: string }>`
//   height: 34px;
//   border-left: 1px solid
//     ${({ textColor, theme }) => (textColor ? textColor : theme.text1)};
//   margin: 0 10px;
// `;

const Header: React.FunctionComponent<CustomProps> = ({ currentNetwork, setCurrentNetwork, walletId, setWalletId, currentAccountAddress, setCurrentAccountAddress, isWalletConnected, setIsWalletConnected, networkId, setNetworkId, useWidgetWallet, ctaColor, textColor, backgroundColor }: CustomProps) => {
  //const [darkMode, toggleSetDarkMode] = useDarkModeManager();

  //const windowSize: WindowSizeType = useWindowSize()

  //const HeadLogo = () => windowSize.width!==undefined?(windowSize.width<=MEDIA_WIDTHS.upToSmall? <MainLogo src={halfLogo} /> :<MainLogo src={logoDark} />):<MainLogo src={logoDark} />
  // const currentRoute = useLocation();
  // const backgroundColor = useMemo(
  //   () =>
  //     decodeURIComponent(
  //       new URLSearchParams(currentRoute.search).get("backgroundColor") ?? ""
  //     ),
  //   [currentRoute]
  //const [headerMobile, setHeaderMobile] = useState(false)

  // useEffect(() => {
  //   const listenScrollEvent = () => {
  //     if (window.scrollY < 30) {
  //       setHeaderMobile(false)
  //     } else {
  //       setHeaderMobile(true)
  //     }
  //   }

  //   window.addEventListener('scroll', listenScrollEvent, { passive: true });

  //   return () =>
  //     window.removeEventListener('scroll', listenScrollEvent);
  // }, []);


  // const HeadLogo = () =>
  //   upToSmall ? (
  //     <MainLogo src={halfLogo} />
  //   ) : (
  //     <MainLogo src={logoDark} />
  //   );
  //const HeadLogo = () => <MainLogo src={logoDark} />
  // const [sourceChain] = useSourceChain()
  // const [selectedChain] = useSelectedChain()

  // const getNetworkName = () => {
  // 	if (currentRoute.pathname === '/swap') {
  // 		return sourceChain.name.split(' ')[0]
  // 	} else if (currentRoute.pathname === '/manageliquidity') {
  // 		return selectedChain?.name.split(' ')[0]
  // 	} else {
  // 		const network = IS_MAINNET ? 'Ethereum' : 'Kovan'
  // 		return network
  // 	}
  // }

  // const getNetworkId = () => {
  // 	if (currentRoute.pathname === '/swap') {
  // 		return sourceChain.id
  // 	} else if (currentRoute.pathname === '/manageliquidity') {
  // 		return selectedChain ? selectedChain.id : "0"
  // 	} else {
  // 		const id = IS_MAINNET ? '0' : '1'
  // 		return id
  // 	}
  // }

  const HeaderRight = () => (
    <HeaderRightWrapper>
      <TestFaucet />
      <Network
        currentNetwork={currentNetwork}
        isWalletConnected={isWalletConnected}
        textColor={textColor}
        backgroundColor={backgroundColor}
      />
      {
        useWidgetWallet &&
        <WalletBox
          currentNetwork={currentNetwork}
          setCurrentNetwork={setCurrentNetwork}
          walletId={walletId}
          setWalletId={setWalletId}
          currentAccountAddress={currentAccountAddress}
          setCurrentAccountAddress={setCurrentAccountAddress}
          isWalletConnected={isWalletConnected}
          setIsWalletConnected={setIsWalletConnected}
          setNetworkId={setNetworkId}
          textColor={textColor}
          ctaColor={ctaColor}
          backgroundColor={backgroundColor}
        />
      }
      {/* <ThemeSwitch>
				{darkMode ? <NightsStayIcon onClick={toggleSetDarkMode} /> : <FlareIcon onClick={toggleSetDarkMode} />}
			</ThemeSwitch> */}
    </HeaderRightWrapper>
  );

  // const HeaderLeft = () => (
  //   <div
  //     style={{
  //       display: "flex",
  //       alignItems: "center",
  //       justifyContent: "space-between",
  //     }}
  //   >
  //     {/* <HeadLogo /> */}
  //   </div>
  // );


  return (
    <>
      <HeaderWrapper
        //headerMobile={headerMobile}
        correctNetwork={
          isWalletConnected ? (currentNetwork !== "" ? true : false) : true
        }
        backgroundColor={backgroundColor}
      >
        {/* <HeaderLeft /> */}
        <HeaderRight />
      </HeaderWrapper>
      {isWalletConnected && (
        <NetworkWarningWrapper>
          {!currentNetwork && (
            <NetworkWarning>
              {getErrorMessage1(16, networkId)}
              {/* &nbsp;
				{	walletId === 'injected' &&
					<SwitchButton onClick={()=>switchNetworkInMetamask(getNetworkId())}>
						Switch To {getNetworkName()}
						<LinkArrow/>
					</SwitchButton>
				} */}
            </NetworkWarning>
          )}
        </NetworkWarningWrapper>
      )}
    </>
  );
};

export default Header;
