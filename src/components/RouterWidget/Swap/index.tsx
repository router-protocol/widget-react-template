import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import styled from "styled-components";
import axios from "axios";
import SwapCard from "../component/Card/SwapCard";
import SwapButton from "../component/Button/SwapButton"
import MenuWrapper from "../component/Menu/MenuWrapper";
import SearchMenu from "../component/SearchMenu";
import {
  AssetType,
  assetList,
  assetLogos,
  chainLogos,
  assetListPriceFetch,
  FeeObjectType,
  remoteAssetList,
  TokenListType,
  defaultActiveList,
} from "../config/asset";
import { chains, NetworkType } from "../config/network";
import Menu from "../component/Menu";
import _ from "lodash";
import {
  getBalance,
  getBalanceMulticaller,
  getFeeTokens,
  wrapEth,
  unWrapEth,
  unstakeInPool,
  stakeInPool,
  getFeeFromFeeHandlerMulticaller,
  getApprovalMulticaller,
  getExecutionBlock,
} from "../config/contractFunction";
import swapButtonIcon from "../assets/vectors/swapButtonIcon.svg";
import informationIcon from "../assets/vectors/bi_info-circle.svg";
import { switchNetworkInMetamask } from "../utils/metamaskFunctions";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import {
  explorerLinks,
  chainCoinGas,
  nativeAssetAddress,
} from "../config/flag";
import useDebounce from "../hooks/useDebounce";
import {
  decodeLogForDeposit,
  decodeLogForProposal,
  decodeSettellementLogs,
} from "../utils/decodeLogs";
import {
  calcSlippage,
  getScale,
  expandDecimals,
  formatDecimals,
  getFlagsArray,
} from "../utils/oneSplitUtils";
import {
  IS_INTERNAL_MAINNET,
  MAX_THRESHOLD_FOR_SWAP,
  PATH_FINDER_ENDPOINT,
} from "../config/config";
import { coingeckoPriceList } from "../utils/coingeckoPriceList";
import { warningSeverity } from "../utils/priceImpactSeverity";
import { fixedDecimalPlace, getFlooredFixed } from "../utils";
import ReactGA from "react-ga";
import { ClickAwayListener, useMediaQuery } from "@material-ui/core";
import useTabActive from "../hooks/useTabActive";
import { useInitalRender } from "../hooks/useInitialRender";
import { isMobile } from "react-device-detect";
import { Provider } from "ethers-multicall";
import { BigNumber } from "ethers";
import SettingsIcon from "@material-ui/icons/Settings";
// import { useLocation } from "react-router";
import { getErrorMessage1 } from "../config/errorMessages";
import { balanceCallInterval, gasLimitForStable, gasLimitNormal, pathFinderDataRefesh } from "../config/constants";
import chainLookUp from "../config/chainLookUp";
import FeeMenu from "../component/SearchMenu/FeeMenu";
import { WaitingCard } from "../component/TransactionCards/WaitingCard";
import SwapConfirmationCard from "../component/TransactionCards/SwapConfirmationCard";
import WrappedAssetWarning from "../component/WrappedAssetWarning";
import PriceImpactWarning from "../component/PriceImpactWarning";
import ApprovalWindow from "../component/ApprovalWindow";
import ConfirmOrderWindow from "../component/ConfirmOrderWindow";
import AdvancedTransactionSettings from "../component/AdvancedTransactionSettings";
import ErrorBoxMessage from "../component/ErrorBox/ErrorBoxMessage";
import HoverCard from "../component/HoverCard/HoverCard";
import SwapVisual from "../component/SwapVisual";
import SwapVisualSameChain from "../component/SwapVisual/SwapVisualSameChain";
import SwapVisualMobile from "../component/SwapVisual/SwapVisualMobile"
import { DEFAULT_DESTINATION_NETWORK_ID, DEFAULT_DESTINATION_TOKEN_ADDRESS, DEFAULT_SOURCE_NETWORK_ID, DEFAULT_SOURCE_TOKEN_ADDRESS } from "..";
import { CoinType, LatestActivityType } from "../state/swap/hooks";
import { MEDIA_WIDTHS } from "../constant";
import { RouterProtocol } from "@routerprotocol/router-js-sdk"
import { JsonRpcProvider, Provider as ProviderType } from "@ethersproject/providers";

const { ethers } = require("ethers");
const Web3 = require("web3");

const MIN_WIDTH = 358;
const MAX_WIDTH = 951;
//const HEIGHT = 300;


interface SwapInterFace {
  currentNetwork: NetworkType | '';
  setCurrentNetwork: (e: NetworkType | '') => void;
  walletId: string;
  setWalletId: (e: string) => void;
  currentAccountAddress: string;
  setCurrentAccountAddress: (e: string) => void;
  isWalletConnected: boolean;
  setIsWalletConnected: (e: boolean) => void;
  widgetId: String;
  ctaColor: string;
  textColor: string;
  backgroundColor: string;
}
const Wrapper = styled.div<{ backgroundColor: string }>`
  display: grid;
  height: 100%;
  justify-items: center;
  background: ${({ backgroundColor }) =>
    backgroundColor !== "" ? backgroundColor : "none"};
`;

const SwapWrapper = styled.div`
  font-family: "Inter", sans-serif;
  color: #FFFFFF;
  display: grid;
  place-items: center;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  width: clamp(${MIN_WIDTH}px, 100%, ${MAX_WIDTH}px);
  justify-content: space-between;
  position: relative;
  @media only screen and (max-width: 960px){
       width: clamp(200px,100%,500px) 
  }
  @media only screen and (max-width: 750px){
        width: clamp(200px,100%,350px)
  }
`;

const SelectedTab = styled.div`
  font-weight: 500;
  font-size: 40px;
  margin-bottom: 10px;
  @media only screen and (max-width: 750px){
    font-size: 24px;
    margin-bottom: 5px;
  }
`;

// width: clamp(${MIN_WIDTH}px,100%,${MAX_WIDTH}px);
// width: clamp(${MIN_WIDTH}px,100%,${MAX_WIDTH}px);
const CardsWrapper = styled.div<{ error: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  margin-top: 20px;
  border-radius: 16px;
  position: relative;
  border: 1px solid rgba(88, 88, 99, 0.24);
  box-shadow: 3px 3px 10px 4px rgba(0, 0, 0, 0.25);
  ::before {
    display: flex;
    content: "";
    background: linear-gradient(
      94.36deg,
      rgba(255, 255, 255, 0.08) -5.91%,
      rgba(255, 255, 255, 0) 105.6%
    );
    // backdrop-filter: blur(42px);
    opacity: 0.2;
    border-radius: 16px;
    position: absolute;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    @media only screen and (max-width: 960px){
      flex-direction: column;
			width: clamp(200px,100%,500px);
			height: 100%;
    }
    @media only screen and (max-width: 750px){
      width: 358px;
    }
  }
  @media only screen and (max-width: 750px){
    width: 358px;                                  
    border: 1px solid rgba(88, 88, 99, 0.24);
    padding-top: 0;
    padding-bottom: 10px;
  }
  @media only screen and (max-width: 960px){
    flex-direction: column;
		width: clamp(200px,100%,450px);
		margin-top: 25px;
		height: 100%;
		padding: 10px 0;
  }
  transition: all 0.2s ease-in-out;
`;
const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  @media only screen and (max-width: 960px){
       justify-content: center; 
  }
`;

const ReverseIcon = styled(SyncAltIcon) <{ textColor: string }>`
  color: ${({ textColor }) => textColor !== "" ? textColor : "#FFFFFF"} !important;
  width: 18px;
  cursor: pointer;
  transform: translateY(42px);
  transition: all 0.2s ease-in-out;
  @media only screen and (max-width: 960px){
       transform: translateY(0) rotate(90deg); 
  }
  @media only screen and (max-width: 750px){
  }
  transition: all 0.2s ease-in-out;
`;

const ExchangeRateWrapper = styled.div`
  margin-bottom: 20px;
  margin-right: 20px;
  @media only screen and (max-width: 960px){
    transform: translateY(0px);
		margin-top: 40px;
		margin-bottom: 20px;
		margin-right: 0px; 
  }
  @media only screen and (max-width: 750px){
    display: none;
  }
`;

const ExchangeRateWrapperMobile = styled(ExchangeRateWrapper)`
  display: none;
  width: 326px;
  height: 133px;
  margin: 20px 0;
  border-radius: 10px;
  background: #00000040;
  @media only screen and (max-width: 750px){
    display: inline-block;
  }
`;

const ExchangeRate = styled.div`
  width: 100%;
  color: #B2B2B2;
  border-radius: 15px;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 200;
  display: flex;
  align-items: center;
  padding: 15px 0;
  @media only screen and (max-width: 750px){
    display:grid;
		place-items: center;
		font-size: 14px;
		font-style: normal;
		font-weight: 400;
		line-height: 21px;
		letter-spacing: 0em;
		color: #585863;
		text-align: center;   
  }
`;

const SwapData = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 20px;
`;

const SendBodyWrapper = styled.div`
  display: grid;
  height: 100%;
  width: 100%;
  place-items: center;
  @media only screen and (max-width: 960px){
    align-self: start;    
  }
`;

const StyledFlash = styled.div<{ active: boolean }>`
  position: absolute;
  right: 0;
  transform: translate(0, 65px);
  opacity: ${({ active }) => (active ? 1 : 0)};
  transition: all 0.4s ease-in-out;
  z-index: 10;
`;
const ErrorBoxWrapper = styled.div<{ active: boolean }>`
  opacity: ${({ active }) => (active ? 1 : 0)};
  transition: all 0.2s ease-in-out;
  transform: translateY(-15px);
  /* &:hover ~ ${StyledFlash} {
    	opacity: 1;
  	} */
    @media only screen and (max-width: 960px){
        transform: translateY(20px);
    }
    @media only screen and (max-width: 750px){
        transform: translateY(-20px);
		margin-top: 45px;
    }
`;
const SwapButtonWrapper = styled.div`
  transform: translateY(-55px);
  @media only screen and (max-width: 960px){
    transform: translateY(0); 
  }
  @media only screen and (max-width: 750px){
    display: none;
  }
  transition: all 0.2s ease-in-out;
`;
const SwapButtonWrapperMobile = styled(SwapButtonWrapper)`
  display: none;
  @media only screen and (max-width: 750px){
    display: inline-flex;
		margin-bottom: 5px;
		margin-top: 10px;   
  }
`;
// const EstimatedFeeBreakDownWrapper = styled.div`
// 	position: absolute;
// 	left: 48%;
// 	top: 170%;
// 	opacity: 0;
// 	transition: all 0.4s ease-in-out;
// `
// const EstimatedFeeBreakDown = styled.div`
// 	display: grid;
// 	place-items: center;
// 	width: 120px;
// 	font-family: 'Inter', sans-serif;
// 	font-size: 10px;
// 	font-style: normal;
// 	font-weight: 400;
// 	line-height: 15px;
// 	letter-spacing: 0em;
// 	text-align: left;
// 	color: #FFFFFF;
// `

// const HoverIcon1 = styled.img`
// 	margin-left: 7px;
// 	&:hover ~ ${EstimatedFeeBreakDownWrapper} {
//     	opacity: 1;
//   	}
// `

const HoverField = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2px 0;
`;
// const StyledDivider = styled.div`
// 	background: rgba(88, 88, 99, 0.4);
// 	height: 1px;
// 	width: 100%;
// 	margin-bottom: 3px;
// `

const PriceImpactBreakdownWrapper = styled.div`
  position: absolute;
  left: 37%;
  top: 170%;
  opacity: 0;
  transition: all 0.4s ease-in-out;
`;
const PriceImpactBreakdown = styled.div`
  display: grid;
  place-items: center;
  width: 120px;
  font-family: "Inter", sans-serif;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 15px;
  letter-spacing: 0em;
  text-align: left;
  color: #FFFFFF;
`;

const HoverIcon2 = styled.img`
  margin-left: 7px;
  &:hover ~ ${PriceImpactBreakdownWrapper} {
    opacity: 1;
  }
`;
const ErrorText = styled(SwapData) <{ severity?: 0 | 1 | 2 | 3 | 4 }>`
  margin: 0;
  color: ${({ theme, severity }) =>
    severity === 3 || severity === 4
      ? theme.blue2
      : severity === 2
        ? theme.yellow2
        : severity === 1
          ? theme.gray4
          : theme.green2};
`;

const AdvancedWrapper = styled.div`
  position: absolute;
  z-index: 5;
  right: 20px;
  top: 50px;
`;

const SettingsWrapper = styled.div`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  right: 20px;
  top: 14px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 7px;
  position: absolute;
  z-index: 5;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    border: 0.5px solid #585863;
  }
  @media only screen and (max-width: 960px){
    right: 38px;
		top: 20px; 
  }
  @media only screen and (max-width: 750px){
    right: 20px;
		top: 14px;
  }
`;

const StyledSettings = styled(SettingsIcon)`
  &&& {
    width: 18px;
    fill: #585863;
    :hover {
      fill: white;
    }
  }
`;

const Swap = ({ currentNetwork, setCurrentNetwork, walletId, setWalletId, currentAccountAddress, setCurrentAccountAddress, isWalletConnected, setIsWalletConnected, widgetId, ctaColor, textColor, backgroundColor }: SwapInterFace) => {
  const [tabValue, setTabValue] = useState(0);

  const [showSourceChainMenu, setShowSourceChainMenu] = useState(false);
  const [showSourceAssetMenu, setShowSourceAssetMenu] = useState(false);
  const [showDestinationChainMenu, setShowDestinationChainMenu] =
    useState(false);
  const [showDestinationAssetMenu, setShowDestinationAssetMenu] =
    useState(false);
  const [showWaitingCard, setShowWaitingCard] = useState(false);
  const [showTransactionSuccessful, setShowTransactionSuccessful] = useState(false);

  // const [currentAccountAddress] = useAccountAddress();
  // const [isWalletConnected] = useWalletConnected();
  //   const [currentNetwork] = useNetworkManager();

  const [currentSourceAsset, setCurrentSourceAsset] = useState(assetList[DEFAULT_SOURCE_NETWORK_ID].filter((item: AssetType) => item.address.toLowerCase() === DEFAULT_SOURCE_TOKEN_ADDRESS.toLowerCase())[0]);
  const [currentSourceChain, setCurrentSourceChain] = useState<NetworkType>(chainLookUp[DEFAULT_SOURCE_NETWORK_ID]);
  const [currentSourceBalance, setCurrentSourceBalance] = useState("-");
  const [currentDestinationAsset, setCurrentDestinationAsset] = useState(assetList[DEFAULT_DESTINATION_NETWORK_ID].filter((item: AssetType) => item.address.toLowerCase() === DEFAULT_DESTINATION_TOKEN_ADDRESS.toLowerCase())[0]);
  const [currentDestinationChain, setCurrentDestinationChain] = useState<NetworkType>(chainLookUp[DEFAULT_DESTINATION_NETWORK_ID]);
  const [currentDestinationBalance, setCurrentDestinationBalance] = useState("-");
  const [currentInputValue, setCurrentInputValue] = useState(0);
  const [currentRecipientAddress, setCurrentRecipientAddress] = useState('');
  const [feeAsset, setFeeAsset] = useState(assetList[DEFAULT_SOURCE_NETWORK_ID].filter(item => item.native)[0]);
  const [expertModeToggle, setExpertModeToggle] = useState<boolean>(false)

  const [sourceInput, setSourceInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");

  const [sourceUsdBalance, setSourceUsdBalance] = useState("-");
  const [destinationUsdBalance, setDestinationUsdBalance] = useState("-");

  const [balanceTrigger, setBalanceTrigger] = useState<boolean>(false);

  const [isSwapDisabled, setIsSwapDisabled] = useState<boolean>(true);

  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>(
    "Connect Your Wallet"
  );


  const [animationState, setAnimationState] = useState('initial');
  const [animationType, setAnimationType] = useState('');

  const [stableReserveAmount, setStableReserveAmount] = useState<any>();
  const [amountToBeReceived, setAmountToBeReceived] = useState<any>();
  const [srcDistribution, setSrcDistribution] = useState<any>([]);
  const [srcFlags, setSrcFlags] = useState<any>([]);
  const [srcPath, setSrcPath] = useState<any>([]);
  const [pathString, setPathString] = useState("");
  const [txExplorer, setTxExplorer] = useState("");
  const [srcTxExplorer, setSrcTxExplorer] = useState("");
  const [, setShowWarning] = useState(false);
  const [pathFetching, setPathFetching] = useState(false);
  const [srcPriceImpact, setSrcPriceImpact] = useState("-");
  const [dstPriceImpact, setDstPriceImpact] = useState("-");

  const [bridgeFee, setBridgeFee] = useState<BigNumber | string>("-");
  const [gasBalance, setGasBalance] = useState<BigNumber | string>("-");
  const [gasPrice, setGasPrice] = useState<BigNumber | string>("-");
  const [gasLimit, setGasLimit] = useState("-");
  const [estimatedFee, setEstimatedFee] = useState<any[]>(["-", "-", "-", "-"]);
  const [feeAssetBalance, setFeeAssetBalance] = useState<BigNumber | string>(
    "-"
  );
  const [destTokenTvl, setDestTokenTvl] = useState<BigNumber | string>("-");
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const [destStableTokenAmount, setDestStableTokenAmount] = useState("");
  const [destStableTokenAddress, setDestStableTokenAddress] = useState("");

  const gasCoinTemp = Object.entries(chainCoinGas).reduce(
    (acc, item) => ({ ...acc, [item[1]["symbol"]]: "-" }),
    []
  );
  const [gasCoinPrice, setGasCoinPrice] = useState<CoinType>(gasCoinTemp);

  const coinList = assetList['default']
  const coinTemplate: CoinType = coinList.reduce((acc, item) => ({ ...acc, [item.symbol]: '-' }), {})
  const [coinPriceList, setCoinPriceList] = useState({ ...coinTemplate });

  const [destinationTokensBalanceList, setDestinationTokensBalanceList] =
    useState<CoinType>({});
  const [sourceTokensBalanceList, setSourceTokensBalanceList] =
    useState<CoinType>({});

  const [srcResourceId, setSrcResourceId] = useState("");
  const [slippageTolerance, setSlippageTolerance] = useState("1");

  const upToSmall = useMediaQuery(`(max-width: ${MEDIA_WIDTHS.upToSmall}px)`);

  const [showRAssetWarning, setShowRAssetWarning] = useState(false);
  const [wrappedAsset, setWrappedAsset] = useState(currentDestinationAsset);

  const [showPriceImpactWarning, setShowPriceImpactWarning] = useState(false);

  const [tokenListByUrl, setTokenListByUrl] = useState<{ [key: string]: TokenListType; } | null>(null);
  const [activeListUrl, setActiveListUrl] = useState(defaultActiveList);
  const [feePriceFeed, setFeePriceFeed] = useState<undefined | FeeObjectType>();

  const [showApprovalWindow, setShowApprovalWindow] = useState(false);
  const [showConfirmOrderWindow, setShowConfirmOrderWindow] = useState(false);
  const [sourceTokenAllowance, setSourceTokenAllowance] = useState("0");
  const [feeTokenAllowance, setFeeTokenAllowance] = useState("0");
  const [sourceInfiniteApproval, setSourceInfiniteApproval] = useState(true);
  const [feeInfiniteApproval, setFeeInfiniteApproval] = useState(true);
  const [sourceApprovalLoading, setSourceApprovalLoading] = useState(false);
  const [feeApprovalLoading, setFeeApprovalLoading] = useState(false);

  const [shouldFeeApprove, setShouldFeeApprove] = useState(false);
  const [shouldSourceApprove, setShouldSourceApprove] = useState(false);

  const [showSettelementToken, setShowSettelementToken] = useState(false);
  const [finalReceivedAmount, setFinalReceivedAmount] = useState("");
  const [oneInchDataTxn, setOneInchDataTxn] = useState("");
  const [swapExecutionData, setSwapExecutionData] = useState<any>();

  // const location = useLocation();
  // const [searchQuery, setSearchQuery] = useState(location.search);

  const [feeTokenList, setFeeTokenList] = useState<null | AssetType[]>(null);
  const [showFeeMenu, setShowFeeMenu] = useState(false);

  //router-sdk-integrate
  const rpc = currentSourceChain.endpoint
  const provider: ProviderType = useMemo(() => new JsonRpcProvider(rpc), [rpc]);
  const [routerObject, setRouterObject] = useState<RouterProtocol>()
  // const [gasObjectSdk, setGasObjectSdk] = useState<undefined | any[]>()
  // const [getSourceTokenAllowance, setGetSourceTokenAllowance] = useState(second)
  const initialize = useCallback(
    async () => {
      const routerprotocol = new RouterProtocol("24", currentSourceChain.networkId, provider);
      await routerprotocol.initailize()
      setRouterObject(routerprotocol)
    },
    [provider],
  )

  useEffect(() => {
    initialize()
  }, [initialize])

  // useEffect(()=>{
  //   if(routerObject)
  //   {
  //     routerObject.getBridgeFee(currentDestinationChain.networkId).then((res:any[])=>{
  //       setGasObjectSdk(res)
  //       console.log("value::", gasObjectSdk)
  //     })
  //   }
  // },[routerObject])

  // useEffect(()=>{
  //   if(routerObject)
  //   {
  //     routerObject.getSourceTokenAllowance(currentSourceAsset.address, currentDestinationChain.networkId, currentAccountAddress).then((res:any)=>{
  //       // setGasObjectSdk(res)
  //       console.log("Allowance::", res)
  //     })
  //   }
  // },[routerObject])
  // console.log(rpc)

  //****/


  //   const [walletId] = useWalletId();
  const elRef = useRef<null | HTMLDivElement>(null);

  const sourceProvider = useMemo(
    () => new ethers.providers.JsonRpcProvider(currentSourceChain.endpoint),
    [currentSourceChain]
  ); //For Animation
  const destProvider = useMemo(
    () =>
      new ethers.providers.JsonRpcProvider(currentDestinationChain.endpoint),
    [currentDestinationChain]
  ); //For Animation
  const srcWeb3JSONProvider = useMemo(
    () =>
      new Web3(new Web3.providers.HttpProvider(currentSourceChain.endpoint)),
    [currentSourceChain]
  ); //For Animation
  const dstWeb3JSONProvider = useMemo(
    () =>
      new Web3(
        new Web3.providers.HttpProvider(currentDestinationChain.endpoint)
      ),
    [currentDestinationChain]
  ); //For Animation

  const isTabActive = useTabActive();

  const isInitialRender = useInitalRender();

  const operation = tabValue === 1 ? "Send" : "Swap";

  const sourceChainMenuHandler = useCallback(() => {
    setShowSourceChainMenu(true);
  }, []);
  const sourceAssetMenuHandler = useCallback(() => {
    setShowSourceAssetMenu(true);
  }, []);
  const destinationChainMenuHandler = useCallback(() => {
    setShowDestinationChainMenu(true);
  }, []);
  const destinationAssetMenuHandler = useCallback(() => {
    setShowDestinationAssetMenu(true);
  }, []);

  const closeShowWaitingCard = useCallback(() => {
    setShowWaitingCard(false);
  }, []);

  const closeShowTransactionSuccessful = useCallback(() => {
    setShowTransactionSuccessful(false);
    setShowSettelementToken(false);
    setTimeout(() => {
      setFinalReceivedAmount("");
    }, 3000);
  }, [setShowTransactionSuccessful]);

  const selectFeeAsset = useCallback(
    (newFeeAsset: AssetType) => {
      //setCurrentDestinationAsset('');
      setFeeAsset(newFeeAsset);
      setShowFeeMenu(false);
    },
    [setFeeAsset]
  );

  const openFeeMenu = useCallback(() => setShowFeeMenu(true), []);

  const closeShowSourceChainMenu = useCallback(
    () => setShowSourceChainMenu(false),
    []
  );
  const closeShowDestinationChainMenu = useCallback(
    () => setShowDestinationChainMenu(false),
    []
  );
  const closeShowSourceAssetMenu = useCallback(
    () => setShowSourceAssetMenu(false),
    []
  );
  const closeShowDestinationAssetMenu = useCallback(
    () => setShowDestinationAssetMenu(false),
    []
  );

  const selectCurrentSourceAssetHandler = useCallback(
    (newSourceAsset: AssetType) => {
      //setCurrentDestinationAsset('');
      // let searchParams = new URLSearchParams(searchQuery);
      setCurrentSourceAsset(newSourceAsset);
      // searchParams.delete("fromToken");
      // searchParams.append("fromToken", newSourceAsset.address);
      // setSearchQuery(searchParams.toString());
      // history.replace({
      //   pathname: location.pathname,
      //   search: searchParams.toString(),
      // });
      //let nativeAsset = assetList[currentSourceChain.networkId].find(asset => asset.native)
      // if(newSourceAsset.isFeeToken){
      // 	setFeeAsset(newSourceAsset)
      // }else{
      // 	setFeeAsset(nativeAsset??assetList[currentSourceChain.networkId][0])
      // }
      // if(newSourceAsset.isLpToken){
      // 	let asset = assetList[currentDestinationChain.networkId].filter(item => item.symbol===newSourceAsset.symbol)
      // 	setCurrentDestinationAsset(asset[0])
      // }
      // if(currentDestinationAsset&&currentDestinationAsset.isLpToken){
      // 	let asset = assetList[currentDestinationChain.networkId].filter(item => item.symbol===newSourceAsset.symbol)
      // 	setCurrentDestinationAsset(asset[0])
      // }
      setShowSourceAssetMenu(false);
    },
    []
  );
  const selectCurrentSourceChainHandler = useCallback(
    (newSourceChain: NetworkType) => {
      //setCurrentSourceAsset('');

      // if(_.isEqual(currentDestinationChain, newSourceChain)) {
      // 	let current = Number(newSourceChain.id)
      // 	let index = (current===chains.length)?0:current
      // 	setCurrentDestinationChain(chains[index])
      // }
      // let searchParams = new URLSearchParams(searchQuery);
      if (currentDestinationChain.networkId === newSourceChain.networkId) {
        if (currentDestinationAsset.symbol === currentSourceAsset.symbol) {
          if (
            assetList[currentDestinationChain.networkId][0].symbol ===
            currentSourceAsset.symbol
          ) {
            setCurrentDestinationAsset(
              assetList[currentDestinationChain.networkId][1]
            );
            // searchParams.delete("toToken");
            // searchParams.append(
            //   "toToken",
            //   assetList[currentDestinationChain.networkId][1].address
            // );
            // history.replace({
            //   pathname: location.pathname,
            //   search: searchParams.toString(),
            // });
          } else {
            setCurrentDestinationAsset(
              assetList[currentDestinationChain.networkId][0]
            );
            // searchParams.delete("toToken");
            // searchParams.append(
            //   "toToken",
            //   assetList[currentDestinationChain.networkId][0].address
            // );
            // history.replace({
            //   pathname: location.pathname,
            //   search: searchParams.toString(),
            // });
          }
        }
        //currentSourceAsset.isLpToken || currentSourceAsset.native || currentDestinationAsset.isLpToken || currentDestinationAsset.native
        // if(currentSourceAsset.isLpToken || currentDestinationAsset.isLpToken){
        // 	let usdt = assetList[currentSourceChain.networkId].filter(item => item.symbol==='USDT')
        // 	setCurrentSourceAsset(usdt[0])
        // 	setFeeAsset(usdt[0])
        // 	let route = assetList[currentDestinationChain.networkId].filter(item => item.symbol==='ROUTE')
        // 	setCurrentDestinationAsset(route[0])
        // }
      }

      //Replacing the old asset with same asset on new chain
      let newAsset = assetList[newSourceChain.networkId].find(
        (item) => item.symbol === currentSourceAsset.symbol
      );
      // if (urlSrcTokens) {
      //   tokenListByUrl &&
      //     activeListUrl.forEach((url) => {
      //       tokenListByUrl[url]?.tokens?.forEach((token) => {
      //         let newToken = { ...token };
      //         if (
      //           token.chainId.toString() === newSourceChain.networkId &&
      //           urlSrcTokens?.includes(token.address.toString().toLowerCase())
      //         ) {
      //           newToken["lpSymbol"] = "";
      //           newToken["lpAddress"] = "";
      //           newToken["stakingRewards"] = "";
      //           newToken["resourceId"] = "";
      //           newToken["mappedOnBridge"] = false;
      //           newToken["native"] = false;
      //           newToken["hasLpToken"] = false;
      //           newToken["isLpToken"] = false;
      //           newToken["stableAsset"] = false;
      //           newToken["mining"] = false;
      //           newToken["activeMining"] = false;
      //           newToken["enableLiquidityMining"] = false;
      //           newAsset = newToken;
      //         }
      //       });
      //     });
      // }
      //const newfeeAsset =  assetList[newSourceChain.networkId].find(item => item.symbol===feeAsset.symbol)
      //let nativeAsset = assetList[currentSourceChain.networkId].find(asset => asset.native)
      setCurrentSourceAsset(
        newAsset ?? assetList[newSourceChain.networkId][0]
      );
      // searchParams.delete("fromToken");
      // searchParams.append(
      //   "fromToken",
      //   newAsset?.address ?? assetList[newSourceChain.networkId][0].address
      // );
      // history.replace({
      //   pathname: location.pathname,
      //   search: searchParams.toString(),
      // });
      //setFeeAsset(newfeeAsset?.isFeeToken?newfeeAsset:nativeAsset??assetList[currentSourceChain.networkId][0])
      setCurrentSourceChain(newSourceChain);
      // searchParams.delete("fromChain");
      // searchParams.append("fromChain", newSourceChain.networkId);
      // setSearchQuery(searchParams.toString());
      // history.replace({
      //   pathname: location.pathname,
      //   search: searchParams.toString(),
      // });
      setShowSourceChainMenu(false);
    },
    [
      currentDestinationChain,
      currentSourceAsset,
      currentDestinationAsset,
      setCurrentDestinationAsset,
      setCurrentSourceAsset,
      setCurrentSourceChain,
    ]
  );

  const selectCurrentDestinationAssetHandler = useCallback(
    (newDestinationAsset: AssetType) => {
      setCurrentDestinationAsset(newDestinationAsset);
      // if(newDestinationAsset.isLpToken){
      // 	let asset = assetList[currentSourceChain.networkId].filter(item => item.symbol===newDestinationAsset.symbol)
      // 	setCurrentSourceAsset(asset[0])
      // 	setFeeAsset(asset[0])
      // }
      // if(currentSourceAsset&&currentSourceAsset.isLpToken){
      // 	let asset = assetList[currentSourceChain.networkId].filter(item => item.symbol===newDestinationAsset.symbol)
      // 	setFeeAsset(asset[0])
      // }
      setShowDestinationAssetMenu(false);
      // let searchParams = new URLSearchParams(searchQuery);
      // searchParams.delete("toToken");
      // searchParams.append("toToken", newDestinationAsset.address);
      // setSearchQuery(searchParams.toString());
      // history.replace({
      //   pathname: location.pathname,
      //   search: searchParams.toString(),
      // });
    },
    []
  );
  const selectCurrentDestinationChainHandler = useCallback(
    (newDestinationChain: NetworkType) => {
      //setCurrentDestinationAsset('');
      // let searchParams = new URLSearchParams(searchQuery);
      if (currentSourceChain.networkId === newDestinationChain.networkId) {
        if (currentDestinationAsset.symbol === currentSourceAsset.symbol) {
          if (
            assetList[currentSourceChain.networkId][0].symbol ===
            currentDestinationAsset.symbol
          ) {
            setCurrentSourceAsset(assetList[currentSourceChain.networkId][1]);
            // searchParams.delete("fromToken");
            // searchParams.append(
            //   "fromToken",
            //   assetList[currentSourceChain.networkId][1].address
            // );
            // history.replace({
            //   pathname: location.pathname,
            //   search: searchParams.toString(),
            // });
            //setFeeAsset(nativeAsset)
          } else {
            setCurrentSourceAsset(assetList[currentSourceChain.networkId][0]);
            // searchParams.delete("fromToken");
            // searchParams.append(
            //   "fromToken",
            //   assetList[currentSourceChain.networkId][0].address
            // );
            // history.replace({
            //   pathname: location.pathname,
            //   search: searchParams.toString(),
            // });
            //setFeeAsset(nativeAsset)
          }
        }
        //currentSourceAsset.isLpToken || currentSourceAsset.native || currentDestinationAsset.isLpToken || currentDestinationAsset.native
        // if(currentSourceAsset.isLpToken || currentDestinationAsset.isLpToken){
        // 	let usdt = assetList[currentSourceChain.networkId].filter(item => item.symbol==='USDT')
        // 	setCurrentSourceAsset(usdt[0])
        // 	setFeeAsset(usdt[0])
        // 	let route = assetList[currentDestinationChain.networkId].filter(item => item.symbol==='ROUTE')
        // 	setCurrentDestinationAsset(route[0])
        // }
      }

      if (newDestinationChain.networkId === "65") {
        setCurrentSourceAsset(assetList[currentSourceChain.networkId][0]);
        // searchParams.append(
        //   "fromToken",
        //   assetList[currentSourceChain.networkId][0].address
        // );
        // history.replace({
        //   pathname: location.pathname,
        //   search: searchParams.toString(),
        // });
        //setFeeAsset(nativeAsset)
      }
      let newAsset = assetList[newDestinationChain.networkId].filter(
        (item) => item.symbol === currentDestinationAsset.symbol
      )[0];
      // if (urlDstTokens) {
      //   tokenListByUrl &&
      //     activeListUrl.forEach((url) => {
      //       tokenListByUrl[url]?.tokens?.forEach((token) => {
      //         let newToken = { ...token };
      //         if (
      //           token.chainId.toString() === newDestinationChain.networkId &&
      //           urlDstTokens?.includes(token.address.toString().toLowerCase())
      //         ) {
      //           newToken["lpSymbol"] = "";
      //           newToken["lpAddress"] = "";
      //           newToken["stakingRewards"] = "";
      //           newToken["resourceId"] = "";
      //           newToken["mappedOnBridge"] = false;
      //           newToken["native"] = false;
      //           newToken["hasLpToken"] = false;
      //           newToken["isLpToken"] = false;
      //           newToken["stableAsset"] = false;
      //           newToken["mining"] = false;
      //           newToken["activeMining"] = false;
      //           newToken["enableLiquidityMining"] = false;
      //           newAsset = newToken;
      //         }
      //       });
      //     });
      // }
      setCurrentDestinationAsset(
        newAsset ?? assetList[newDestinationChain.networkId][0]
      );
      // searchParams.delete("toToken");
      // searchParams.append(
      //   "toToken",
      //   newAsset?.address ??
      //   assetList[newDestinationChain.networkId][0].address
      // );
      // history.replace({
      //   pathname: location.pathname,
      //   search: searchParams.toString(),
      // });

      setCurrentDestinationChain(newDestinationChain);
      // searchParams.delete("toChain");
      // searchParams.append("toChain", newDestinationChain.networkId);
      // setSearchQuery(searchParams.toString());
      // history.replace({
      //   pathname: location.pathname,
      //   search: searchParams.toString(),
      // });
      setShowDestinationChainMenu(false);
    },
    [
      currentSourceChain,
      currentSourceAsset,
      currentDestinationAsset,
      setCurrentDestinationAsset,
      setCurrentDestinationChain,
      setCurrentSourceAsset,
    ]
  );

  const handleWrappedAssetWarning = useCallback(() => {
    setCurrentDestinationAsset(wrappedAsset);
    setShowRAssetWarning(false);
  }, [setCurrentDestinationAsset, wrappedAsset]);

  const handleWrappedAssetWarningClose = useCallback(() => {
    setShowRAssetWarning(false);
    setSourceInput("");
    setDestinationInput("");
  }, [setSourceInput, setDestinationInput]);

  const handlePriceImpactWarningClose = useCallback(() => {
    setShowPriceImpactWarning(false);
    setSourceInput("");
    setDestinationInput("");
    setSrcPriceImpact("-");
    setDstPriceImpact("-");
  }, [setSourceInput, setDestinationInput]);

  const re = useMemo(() => /^\d*\.?\d*$/, []);
  const srcInputDebouncedValue = useDebounce(sourceInput, 600);

  const sourceInputHandler = useCallback(
    (e: any) => {
      if (re.test(e.target.value)) {
        if (e.target.value === "." && sourceInput === "") return;
        setSourceInput(e.target.value);
        // if (e.target.value !== '') setDestinationInput(String(Number(e.target.value) * exchangeRate));
        // else setDestinationInput('');
      }
    },
    [sourceInput, re, setSourceInput]
  );

  const clickMaxButton = useCallback(() => {
    let maxValue;
    if (
      !IS_INTERNAL_MAINNET &&
      parseFloat(currentSourceBalance) *
      parseFloat(
        coinPriceList[currentSourceAsset && currentSourceAsset.symbol]
      ) >
      Number(MAX_THRESHOLD_FOR_SWAP)
    ) {
      maxValue =
        Number(MAX_THRESHOLD_FOR_SWAP) /
        parseFloat(
          coinPriceList[currentSourceAsset && currentSourceAsset.symbol]
        );
    } else {
      maxValue = currentSourceBalance;
    }

    if (
      typeof bridgeFee !== "string" &&
      currentSourceAsset &&
      currentSourceAsset.address.toLowerCase() ===
      feeAsset.address.toLowerCase()
    ) {
      maxValue =
        parseFloat(currentSourceBalance) -
        parseFloat(formatDecimals(bridgeFee.toString(), feeAsset.decimals));
      if (maxValue < 0) maxValue = 0;
    }

    setSourceInput(getFlooredFixed(Number(maxValue), 4));
  }, [
    currentSourceBalance,
    coinPriceList,
    currentSourceAsset,
    bridgeFee,
    feeAsset,
    setSourceInput,
  ]);

  const destinationInputHandler = useCallback((e: any) => {
    // if (re.test(e.target.value)) {
    // 	setDestinationInput(e.target.value);
    // 	if (e.target.value !== '') setSourceInput(String(Number(e.target.value) / exchangeRate));
    // 	else setSourceInput('');
    // 	setCurrentInputValue(Number(e.target.value) / exchangeRate);
    // }
  }, []);

  const interchangeHandler = useCallback(() => {
    if (animationState === "animate") return;
    let source_chain = { ...currentSourceChain };
    let destination_chain = { ...currentDestinationChain };

    let source_asset;
    source_asset = { ...currentSourceAsset };

    let destination_asset;
    destination_asset = { ...currentDestinationAsset };

    let source_balance = currentSourceBalance;
    let source_usd_balance = sourceUsdBalance;

    let destination_balance = currentDestinationBalance;
    let destination_usd_balance = destinationUsdBalance;

    setCurrentSourceChain(destination_chain);
    setCurrentDestinationChain(source_chain);
    destination_asset && setCurrentSourceAsset(destination_asset);
    destination_asset &&
      setFeeAsset(
        assetList[destination_chain.networkId].filter((item) => item.native)[0]
      );
    source_asset && setCurrentDestinationAsset(source_asset);
    setCurrentSourceBalance(destination_balance);
    setSourceUsdBalance(destination_usd_balance);
    setCurrentDestinationBalance(source_balance);
    setDestinationUsdBalance(source_usd_balance);
    setSourceInput("");
    setDestinationInput("");
    setBridgeFee("-");
  }, [
    currentSourceChain,
    currentSourceAsset,
    currentDestinationChain,
    currentDestinationAsset,
    currentSourceBalance,
    sourceUsdBalance,
    currentDestinationBalance,
    destinationUsdBalance,
    animationState,
    setCurrentDestinationAsset,
    setCurrentDestinationChain,
    setCurrentSourceAsset,
    setCurrentSourceBalance,
    setCurrentSourceChain,
    setDestinationInput,
    setFeeAsset,
    setSourceInput,
  ]);

  // const animationTest = () => {
  // 	setTimeout(() => {
  // 		setAnimationState('animate')
  // 		setAnimationType('path_01')
  // 	}, 4000)
  // 	setTimeout(() => {
  // 		//setAnimationState('animate')
  // 		setAnimationType('path_12')
  // 	}, 8000)
  // 	setTimeout(() => {
  // 		//setAnimationState('animate')
  // 		setAnimationType('path_23')
  // 	}, 12000)
  // 	setTimeout(() => {
  // 		setAnimationState('final')
  // 		setAnimationType('')
  // 	}, 16000)
  // 	setTimeout(() => {
  // 		setAnimationState('initial')
  // 	}, 20000)
  // }

  // useEffect(() => {
  // 	animationTest()
  // }, [])

  let depositFilter = useMemo(() => {
    return {
      address: currentSourceChain.opts.bridge,
      from: currentAccountAddress,
      topics: [
        "0xc9745c10b9322d1d4b7bf22f00dc660872b611832eedcfffdbcdc09ebafcb313",
        ethers.utils.hexZeroPad(
          ethers.BigNumber.from(currentDestinationChain.id),
          32
        ),
      ],
    };
  }, [currentSourceChain, currentDestinationChain, currentAccountAddress]);

  let proposalPassedFilter = useMemo(() => {
    return {
      address: currentDestinationChain.opts.bridge,
      topics: [
        "0x968626a768e76ba1363efe44e322a6c4900c5f084e0b45f35e294dfddaa9e0d5",
      ],
    };
  }, [currentDestinationChain]);

  // let proposalExecutedFilter = {
  // 	address: currentDestinationChain.opts.bridge,
  // 	topics: ["0x968626a768e76ba1363efe44e322a6c4900c5f084e0b45f35e294dfddaa9e0d5"]
  // }

  let sourceWeb3Provider: any;
  let destinationWeb3Provider: any;
  const swapEventListeners = useCallback(
    async (tx: any) => {
      let sourceWeb3Provider = new Web3(
        new Web3.providers.HttpProvider(currentSourceChain.endpoint)
      );
      sourceWeb3Provider.setProvider(
        new Web3.providers.WebsocketProvider(currentSourceChain.socket)
      );

      let destinationWeb3Provider = new Web3(
        new Web3.providers.HttpProvider(currentDestinationChain.endpoint)
      );
      destinationWeb3Provider.setProvider(
        new Web3.providers.WebsocketProvider(currentDestinationChain.socket)
      );

      console.log("trigger events txhash", tx)
      const dateString = new Date().toLocaleString();

      let executionTimer: any;

      let depositNonce: any = null;

      let dstBlk: number;

      dstBlk = await dstWeb3JSONProvider.eth.getBlockNumber();

      let depositFallbackId = setInterval(async () => {
        if (tx === null) {
        } else {
          try {
            const txReceipt =
              await srcWeb3JSONProvider.eth.getTransactionReceipt(tx);
            if (txReceipt?.status) {
              const depositLog = txReceipt?.logs.filter(
                (log: any) =>
                  log.topics[0] ===
                  "0xc9745c10b9322d1d4b7bf22f00dc660872b611832eedcfffdbcdc09ebafcb313"
              );
              let decodedLog = await decodeLogForDeposit(depositLog[0]);
              depositNonce = decodedLog?.depositNonce;
              setSrcTxExplorer(
                explorerLinks[currentSourceChain.networkId] + tx
              );
              setAnimationType("path_12");
              depositNonce = decodedLog?.depositNonce;
              console.log(
                "After Setting State from Deposit Event",
                depositNonce
              );
              listenProposalPassedEvent(depositNonce);
              listenSettelementEvent(depositNonce);
              console.log("Fallback Deposit Success");
              sourceWeb3Provider.eth.clearSubscriptions();
              clearInterval(depositFallbackId);
            } else if (txReceipt?.status === false) {
              setAnimationState("initial");
              setAnimationType("");
              setBalanceTrigger((balanceTrigger) => !balanceTrigger);
              setDestinationInput("");
              setCurrentInputValue(0);
              setSrcPriceImpact("-");
              setDstPriceImpact("-");
              //sourceWeb3Provider.eth.clearSubscriptions()
              //destinationWeb3Provider.eth.clearSubscriptions()
            }
          } catch (e) {
            clearInterval(depositFallbackId);
            console.log("Deposit FallBack Error - ", e);
          }
        }
      }, 30000);

      try {
        sourceWeb3Provider.eth.subscribe(
          "logs",
          depositFilter,
          async (err: any, data: any) => {
            if (err) {
              console.log("Deposit Logs New- ", err);
              sourceWeb3Provider.eth.clearSubscriptions();
            }
            if (tx === null) {
              const transaction = await sourceWeb3Provider.eth.getTransaction(
                data.transactionHash
              );
              console.log("getTransaction - ", transaction);
              if (
                transaction.from.toLowerCase() ===
                currentAccountAddress.toLowerCase()
              ) {
                tx = data.transactionHash;
              }
            }
            console.log("tx hash- ", tx);
            if (data && tx === data?.transactionHash) {
              let decodedLog = await decodeLogForDeposit(data);
              console.log("data for deposit event ------->", data && data);
              console.log(
                "transactionHash for deposit event ------->",
                data && data.transactionHash
              );
              console.log("Decoded Deposit Log ==> ", decodedLog);
              setSrcTxExplorer(
                explorerLinks[currentSourceChain.networkId] +
                data.transactionHash
              );
              setAnimationType("path_12");
              depositNonce = decodedLog?.depositNonce;
              console.log(
                "After Setting State from Deposit Event",
                depositNonce
              );
              clearInterval(depositFallbackId);
              listenProposalPassedEvent(depositNonce);
              listenSettelementEvent(depositNonce);
              sourceWeb3Provider.eth.clearSubscriptions();
            }
          }
        );
      } catch (e) {
        console.log("Source WebSOcket failure", e);
      }

      let proposalPassInterval: any, settelementEventInterval: any;
      const proposalPassFallback = async () => {
        try {
          const latestBlock = await dstWeb3JSONProvider.eth.getBlockNumber();
          const TO_BLOCK =
            latestBlock - dstBlk > 999 ? dstBlk + 999 : latestBlock;
          let proposalPassFilter = {
            address: [currentDestinationChain.opts.bridge],
            topics: [
              "0x968626a768e76ba1363efe44e322a6c4900c5f084e0b45f35e294dfddaa9e0d5",
            ],
            fromBlock: dstBlk,
            toBlock: TO_BLOCK,
          };
          const proposalData = await dstWeb3JSONProvider.eth.getPastLogs(
            proposalPassFilter
          );
          const decodedProposalLogs = proposalData.map((data: any) =>
            decodeLogForProposal(data)
          );
          const proposalLogIndex = decodedProposalLogs.findIndex(
            (data: any) =>
              data.status.toString() === "2" &&
              data.depositNonce.toString() == depositNonce.toString()
          );
          if (proposalLogIndex !== -1) {
            console.log("data for proposal passed event ------->");
            console.log(
              "Decoded Proposal Passed Log ==> ",
              decodedProposalLogs[proposalLogIndex]
            );
            setAnimationType("path_23");
            //Clear Interval
            console.log("Proposal Pass Fallback Success");
            clearInterval(proposalPassInterval);
          } else {
            dstBlk = TO_BLOCK;
          }
        } catch (e) {
          clearInterval(proposalPassInterval);
          console.log("Proposal Pass Event - ", e);
        }
      };

      const settelementEventFallback = async () => {
        try {
          const blockNumber = await getExecutionBlock({
            erc20Handler: currentDestinationChain.opts.erc20Handler,
            provider: destProvider,
            sourceChainId: ethers.utils.hexZeroPad(
              ethers.BigNumber.from(currentSourceChain.id),
              32
            ),
            depositNonce: ethers.utils.hexZeroPad(
              ethers.BigNumber.from(depositNonce),
              32
            ),
          });
          console.log("EXECUTION BLOCK => ", blockNumber);
          if (blockNumber !== "0") {
            console.log("Inside blocknumber");
            let logs;
            try {
              logs = await dstWeb3JSONProvider.eth.getPastLogs({
                address: [currentDestinationChain.opts.bridge],
                topics: [
                  "0xf3eebc917bbcdbb3122520c3cdb2a3e3955672aeb3612717f0c7b2872ed296e7",
                  ethers.utils.hexZeroPad(
                    ethers.BigNumber.from(currentSourceChain.id),
                    32
                  ),
                  ethers.utils.hexZeroPad(
                    ethers.BigNumber.from(depositNonce),
                    32
                  ),
                ],
                fromBlock: Number(blockNumber) - 1,
                toBlock: Number(blockNumber) + 1,
              });
            } catch (e) {
              console.log(
                "getPastLogs error inside settelement fallback - ",
                e
              );
            }
            console.log("Logs settelementEventFallback -", logs);
            const decodedLog = decodeSettellementLogs(logs[0]);
            console.log("decodedLog settelementEventFallback -", logs);
            if (
              currentDestinationAsset &&
              currentDestinationAsset.address.toLowerCase() !==
              decodedLog.settlementToken.toLowerCase()
            ) {
              const settelementTokenArray = assetList[
                currentDestinationChain.networkId
              ].filter(
                (asset) =>
                  asset.address.toLowerCase() ===
                  decodedLog.settlementToken.toLowerCase()
              );
              settelementTokenArray[0] &&
                setCurrentDestinationAsset(settelementTokenArray[0]);
              setShowSettelementToken(true);
              setFinalReceivedAmount(
                formatDecimals(
                  decodedLog.settlementAmount,
                  settelementTokenArray[0].decimals
                )
              );
            } else {
              setFinalReceivedAmount(
                formatDecimals(
                  decodedLog.settlementAmount,
                  currentDestinationAsset && currentDestinationAsset.decimals
                )
              );
            }

            setAnimationState("final");
            setAnimationType("");
            setTxExplorer(
              explorerLinks[currentDestinationChain.networkId] +
              logs[0].transactionHash
            );
            setShowTransactionSuccessful(true);
            setBalanceTrigger((balanceTrigger) => !balanceTrigger);
            setDestinationInput("");
            setCurrentInputValue(0);
            setSourceInput("");
            setSrcPriceImpact("-");
            setDstPriceImpact("-");
            //setBridgeFee('-')
            depositNonce = null;
            console.log("Settellement Event Fallback Success");
            clearTimeout(executionTimer);
            setTimeout(() => {
              setAnimationState("initial");
            }, 15000);
            //Clear Interval
            clearInterval(settelementEventInterval);
            //destinationWeb3Provider.eth.clearSubscriptions()
          } else {
          }
        } catch (e) {
          clearInterval(settelementEventInterval);
          console.log("Settelemnt Fallback Error - ", e);
        }
      };

      const listenProposalPassedEvent = (depositNonce: any) => {
        console.log("listening proposal logs");
        proposalPassFallback();
        proposalPassInterval = setInterval(proposalPassFallback, 30000);
        try {
          destinationWeb3Provider.eth.subscribe(
            "logs",
            proposalPassedFilter,
            async (err: any, data: any) => {
              if (err) {
                console.log("Proposal Error", err);
              }
              let decodedLog = await decodeLogForProposal(data);
              if (
                data &&
                depositNonce &&
                depositNonce.toString() ===
                decodedLog.depositNonce.toString() &&
                decodedLog.status.toString() === "2"
              ) {
                console.log("data for proposal passed event ------->", data);
                console.log("Decoded Proposal Passed Log ==> ", decodedLog);
                setAnimationType("path_23");
                clearInterval(proposalPassInterval);
              }
            }
          );
        } catch (e) {
          console.log("Destination websocket failure - ", e);
        }
      };

      const listenSettelementEvent = (depositNonce: any) => {
        let settelementEventFilter = {
          address: currentDestinationChain.opts.bridge,
          topics: [
            "0xf3eebc917bbcdbb3122520c3cdb2a3e3955672aeb3612717f0c7b2872ed296e7",
            ethers.utils.hexZeroPad(
              ethers.BigNumber.from(currentSourceChain.id),
              32
            ),
            ethers.utils.hexZeroPad(ethers.BigNumber.from(depositNonce), 32),
          ],
        };
        settelementEventFallback();
        settelementEventInterval = setInterval(settelementEventFallback, 30000);
        console.log("listening settelement logs");
        try {
          destinationWeb3Provider.eth.subscribe(
            "logs",
            settelementEventFilter,
            async (err: any, data: any) => {
              if (err) {
                destinationWeb3Provider.eth.clearSubscriptions();
              }
              console.log("settelement logs - ", data);
              let decodedLog = decodeSettellementLogs(data);
              console.log("Decoded SettelementEvent Log ==> ", decodedLog);
              if (
                data &&
                depositNonce &&
                depositNonce.toString() ===
                decodedLog.depositNonce.toString() &&
                decodedLog.status.toString() === "3"
              ) {
                if (
                  currentDestinationAsset &&
                  currentDestinationAsset.address.toLowerCase() !==
                  decodedLog.settlementToken.toLowerCase()
                ) {
                  const settelementTokenArray = assetList[
                    currentDestinationChain.networkId
                  ].filter(
                    (asset) =>
                      asset.address.toLowerCase() ===
                      decodedLog.settlementToken.toLowerCase()
                  );
                  settelementTokenArray[0] &&
                    setCurrentDestinationAsset(settelementTokenArray[0]);
                  setShowSettelementToken(true);
                  setFinalReceivedAmount(
                    formatDecimals(
                      decodedLog.settlementAmount,
                      settelementTokenArray[0].decimals
                    )
                  );
                } else {
                  setFinalReceivedAmount(
                    formatDecimals(
                      decodedLog.settlementAmount,
                      currentDestinationAsset &&
                      currentDestinationAsset.decimals
                    )
                  );
                }

                setAnimationState("final");
                setAnimationType("");
                setTxExplorer(
                  explorerLinks[currentDestinationChain.networkId] +
                  data.transactionHash
                );
                setShowTransactionSuccessful(true);
                setBalanceTrigger((balanceTrigger) => !balanceTrigger);
                setDestinationInput("");
                setCurrentInputValue(0);
                setSourceInput("");
                setSrcPriceImpact("-");
                setDstPriceImpact("-");
                //setBridgeFee('-')
                depositNonce = null;
                clearInterval(settelementEventInterval);
                clearTimeout(executionTimer);
                setTimeout(() => {
                  setAnimationState("initial");
                }, 15000);
                destinationWeb3Provider.eth.clearSubscriptions();
              } else if (
                data &&
                depositNonce &&
                depositNonce === decodedLog.depositNonce.toString() &&
                decodedLog.status.toString() === "4"
              ) {
                setAnimationState("initial");
                setAnimationType("");
                setBalanceTrigger((balanceTrigger) => !balanceTrigger);
                setDestinationInput("");
                setCurrentInputValue(0);
                setSrcPriceImpact("-");
                setDstPriceImpact("-");
                //setBridgeFee('-')
                clearInterval(settelementEventInterval);
                destinationWeb3Provider.eth.clearSubscriptions();
              }
            }
          );
        } catch (e) {
          console.log("Destination socket faliure =>", e);
        }
      };
      //fn end
    },
    [
      currentSourceChain,
      currentDestinationChain,
      operation,
      currentSourceAsset,
      sourceInput,
      destinationInput,
      currentDestinationAsset,
      destProvider,
      srcWeb3JSONProvider,
      dstWeb3JSONProvider,
    ]
  );

  const getSrcAddressPfa = useCallback(() => {
    //For Same Chain Swap Only
    if (currentSourceChain.networkId === currentDestinationChain.networkId) {
      if (currentSourceAsset && currentSourceAsset.native) {
        return nativeAssetAddress[currentSourceChain.networkId];
      }
    }
    return currentSourceAsset && currentSourceAsset.address;
  }, [currentSourceChain, currentDestinationChain, currentSourceAsset]);

  const getDstAddressPfa = useCallback(() => {
    //For Same Chain Swap Only
    if (currentSourceChain.networkId === currentDestinationChain.networkId) {
      if (currentDestinationAsset && currentDestinationAsset.native) {
        return nativeAssetAddress[currentDestinationChain.networkId];
      }
    }
    return currentDestinationAsset && currentDestinationAsset.address;
  }, [currentDestinationChain, currentSourceChain, currentDestinationAsset]);

  const fetchPathFinderData = useCallback(
    async (cancelToken: any) => {
      const args = {
        'fromTokenAddress': currentSourceAsset.address, // USDC on Polygon
        'toTokenAddress': currentDestinationAsset.address, // USDC on Fantom
        'amount': expandDecimals(currentInputValue, currentSourceAsset.decimals).toString(), // 10 USDC (USDC token contract on Polygon has 6 decimal places)
        'fromTokenChainId': currentSourceChain.networkId, // Polygon
        'toTokenChainId': currentDestinationChain.networkId, // Fantom
        'userAddress': currentAccountAddress,
        'feeTokenAddress': feeAsset.address, // ROUTE on Polygon
        'slippageTolerance': slippageTolerance,
        'widgetId': widgetId
      }
      const pathUrl = `${PATH_FINDER_ENDPOINT}/quote`
      console.log("URL - ", pathUrl);

      try {
        const res = await axios.get(pathUrl, {
          params: args,
          cancelToken: cancelToken.token,
        });
        return res.data;
      } catch (e) {
        console.error(`Fetching data from finder: ${e}`);
        if (axios.isCancel(e)) {
          return null;
        } else {
          const err = _.get(e, "response.data", getErrorMessage1(13, ""));
          ReactGA.event({
            category: "Path Finder Error",
            action: `Swapping ${currentSourceAsset.symbol} for ${currentDestinationAsset.symbol} from ${currentSourceChain.name} to ${currentDestinationChain.name} found error ${err}`,
          });
          setAlertOpen(true);
          setShowWarning(true);
          setAlertMessage(err);
          setDestinationInput("");
          setPathFetching(false);
          setTimeout(() => {
            setAlertOpen(false);
            setShowWarning(false);
          }, 10000);
        }
      }
    },
    [
      currentSourceChain,
      currentDestinationChain,
      currentSourceAsset,
      currentDestinationAsset,
      currentInputValue,
      getSrcAddressPfa,
      getDstAddressPfa,
      setDestinationInput,
    ]
  );

  const fetchBridgeFee = useCallback(async () => {
    if (feeTokenList === null) return;

    let newFee = [...estimatedFee];
    newFee[1] = "-";
    setEstimatedFee(newFee);

    let bridgeFee = "-";

    if (currentSourceChain.networkId !== currentDestinationChain.networkId) {
      try {
        if (routerObject) {
          routerObject.getBridgeFee(currentDestinationChain.networkId).then((res: any[]) => {
            const arrangedFeeArray = feeTokenList.map((i: any) => res.filter((j: any) => i.address === j.address)[0])
            const feeArray = arrangedFeeArray.map((i: any) => [i.transferFee, i.exchangeFee, true])
            const feeObj: FeeObjectType = {};
            feeTokenList.forEach((feeToken, index) => {
              feeObj[feeToken.symbol] = {
                fee: [...feeArray[index]],
                feeAmount: formatDecimals(feeArray[index][1], feeToken.decimals),
                feeUsd:
                  coinPriceList[feeToken.symbol] === "-"
                    ? "-"
                    : fixedDecimalPlace(
                      parseFloat(
                        formatDecimals(feeArray[index][1], feeToken.decimals)
                      ) * parseFloat(coinPriceList[feeToken.symbol]),
                      2
                    ),
                show: feeArray[index][2],
              };
            });
            console.log("feeObject", feeObj)

            setFeePriceFeed(feeObj);

            const newFeeTokenList: AssetType[] = [];
            feeTokenList.map(
              (feeToken, index) =>
                feeArray[index][2] && newFeeTokenList.push(feeToken)
            );

            console.log("filtered newFeeTokenList", newFeeTokenList);
          })
        }

      } catch (e) {
        console.log("Fee Error - ", e);
      }
    }

    if (
      currentSourceAsset &&
      currentSourceAsset.mappedOnBridge &&
      feePriceFeed &&
      feePriceFeed[feeAsset.symbol]
    ) {
      bridgeFee = feePriceFeed[feeAsset.symbol].fee[0];
    } else if (feePriceFeed && feePriceFeed[feeAsset.symbol]) {
      bridgeFee = feePriceFeed[feeAsset.symbol].fee[1];
    }

    setBridgeFee(bridgeFee);
  }, [
    feeTokenList,
    estimatedFee,
    sourceProvider,
    currentSourceChain,
    currentDestinationChain,
    feeAsset,
    coinPriceList,
    currentSourceAsset,
    feePriceFeed,
    routerObject
  ]);

  const fetchGasBalance = useCallback(async () => {
    if (!isWalletConnected) return;
    try {
      const balance = await sourceProvider.getBalance(currentAccountAddress);
      setGasBalance(balance);
      //console.log('gas balance',balance)
    } catch (err) {
      console.log("gas balance error- ", err);
    }
  }, [sourceProvider, currentAccountAddress, isWalletConnected]);

  const fetchGasPrice = useCallback(async () => {
    try {
      const gasPrice = await sourceProvider.getGasPrice();
      //console.log('gas price - ',gasPrice)
      setGasPrice(gasPrice);
    } catch (err) {
      console.log("gas price - ", err);
    }
  }, [sourceProvider]);

  const priceFetchForGas = useCallback(async () => {
    const platformId = "ethereum";

    const newCoinPriceTemp: { [key: string]: string } = { ...gasCoinPrice };

    for (const [key] of Object.entries(gasCoinPrice)) {
      if (key === "ETH") {
        try {
          const result = await fetch(
            `https://api.coingecko.com/api/v3/coins/ethereum`
          );
          const data = await result.json();

          newCoinPriceTemp["ETH"] = data?.market_data.current_price.usd;
        } catch (e) {
          console.log("ETH Price Fetch Err - ", e);
        }
      } else if (key === "OKT") {
        try {
          const result = await fetch(
            `https://api.coingecko.com/api/v3/coins/okexchain`
          );
          const data = await result.json();

          newCoinPriceTemp["OKT"] = data?.market_data.current_price.usd;
        } catch (e) {
          console.log("OKT Price Fetch Err - ", e);
        }
      } else {
        try {
          const contractAddress = assetListPriceFetch[key];
          const result = await fetch(
            `https://api.coingecko.com/api/v3/simple/token_price/${platformId}?contract_addresses=${contractAddress}&vs_currencies=usd`
          );
          const data = await result.json();

          newCoinPriceTemp[key] = data[assetListPriceFetch[key]]?.usd;
        } catch (e) {
          console.log("Coin Price Fetch Err - ", e);
        }
      }
    }
    setGasCoinPrice({ ...newCoinPriceTemp });
  }, [gasCoinPrice]);

  const setValuesForDeposit = useCallback(
    async (cancelToken: any) => {
      if (animationState === "animate") {
        return;
      }

      console.log("Fetching Values ==================> ");
      setPathFetching(true);
      priceFetchForGas();
      //currentSourceChain.networkId !== currentDestinationChain.networkId && fetchBridgeFee()
      fetchGasBalance();
      fetchGasPrice();

      const pathFinderData = await fetchPathFinderData(cancelToken).catch(
        (err) => {
          console.log("erroror - ", err);
        }
      );
      console.log("pathFinderData - ", pathFinderData);
      if (
        currentSourceChain.networkId !== currentDestinationChain.networkId &&
        pathFinderData.source.stableReserveAsset && pathFinderData.source.asset.address.toLowerCase() !== pathFinderData.source.stableReserveAsset.address.toLowerCase()
      ) {
        feePriceFeed && setBridgeFee(feePriceFeed[feeAsset?.symbol]?.fee[1])
      }
      if (parseFloat(pathFinderData.source.priceImpact) >= 10 || parseFloat(pathFinderData.destination.priceImpact) >= 10) {
        setShowPriceImpactWarning(true)
      }
      setSrcPriceImpact(pathFinderData.source.priceImpact)
      setSrcPath(pathFinderData.source.path)
      setSrcFlags(pathFinderData.source.flags)
      setSrcDistribution(pathFinderData.source.distribution)
      setDstPriceImpact(pathFinderData.destination.priceImpact)
      if (currentSourceAsset.resourceId !== '' && currentSourceAsset.resourceId.toLowerCase() === pathFinderData?.source?.stableReserveAsset?.resourceID) {
        setGasLimit(gasLimitForStable)
      } else {
        setGasLimit(gasLimitNormal)
      }
      //console.log('Stable reserve amount - ',ethers.BigNumber.from(pathFinderData.destination.tokenAmount))
      if (currentSourceChain.networkId === currentDestinationChain.networkId) {
        setBridgeFee(ethers.BigNumber.from(0))
        setPathString(pathFinderData.source.tokenPath)
        setAmountToBeReceived(calcSlippage(pathFinderData.destination.tokenAmount, slippageTolerance))
        console.log('Formatted Amount -', formatDecimals(pathFinderData.destination.tokenAmount, currentDestinationAsset.decimals))
        setDestinationInput(getFlooredFixed(Number(formatDecimals(pathFinderData.destination.tokenAmount, currentDestinationAsset.decimals)), 6))
        setFinalReceivedAmount(getFlooredFixed(Number(formatDecimals(pathFinderData.destination.tokenAmount, currentDestinationAsset.decimals)), 6))
      } else {
        setAmountToBeReceived(calcSlippage(pathFinderData.destination.tokenAmount, slippageTolerance))
        setDestinationInput(getFlooredFixed(Number(formatDecimals(pathFinderData.destination.tokenAmount, currentDestinationAsset.decimals)), 6))
        setFinalReceivedAmount(getFlooredFixed(Number(formatDecimals(pathFinderData.destination.tokenAmount, currentDestinationAsset.decimals)), 6))
      }

      if (pathFinderData === null) {
        return;
      } else if (pathFinderData === undefined) {
        console.log("error from pf ");
        setPathFetching(false);
        return;
      }
      //console.log(pathFinderData)
      //setBridgeGas(pathFinderData.source.bridgeFee)
      setSwapExecutionData(pathFinderData?.txn?.execution)
      if (pathFinderData?.isWrappedToken) {
        setShowRAssetWarning(true);
        const address = pathFinderData?.destination?.asset?.address;
        const asset = assetList[currentDestinationChain.networkId].find(
          (asset) => asset.address.toLowerCase() === address.toLowerCase()
        );
        //asset set
        if (asset) setWrappedAsset(asset);
      }
      setPathFetching(false);
    },
    [
      currentSourceChain,
      currentSourceAsset,
      currentDestinationChain,
      currentDestinationAsset,
      priceFetchForGas,
      fetchGasBalance,
      fetchGasPrice,
      destTokenTvl,
      currentInputValue,
      feePriceFeed,
      feeAsset,
      animationState,
      fetchPathFinderData,
      setDestinationInput,
      slippageTolerance,
    ]
  );

  const getSourceTokenAddress = useCallback(() => {
    //For Matic Testnet Only
    // if(currentSourceChain.networkId!==currentDestinationChain.networkId){
    // 	if(currentSourceChain.networkId === '80001' && currentSourceAsset && currentSourceAsset.symbol === 'MATIC'){
    // 		return wmaticAddress
    // 	}
    // }
    return currentSourceAsset && currentSourceAsset.address;
  }, [currentSourceAsset]);

  const getDestTokenAddress = useCallback(() => {
    // For Matic Testnet only
    // if(currentSourceChain.networkId!==currentDestinationChain.networkId){
    // 	if(currentDestinationChain.networkId === '80001' && currentDestinationAsset && currentDestinationAsset.symbol === 'MATIC'){
    // 		return wmaticAddress
    // 	}
    // }
    return currentDestinationAsset && currentDestinationAsset.address;
  }, [currentDestinationAsset]);

  const getTotalFee = useCallback(() => {
    if (
      currentSourceAsset &&
      currentSourceAsset.native &&
      feeAsset.native &&
      typeof bridgeFee !== "string"
    ) {
      return bridgeFee.add(
        ethers.BigNumber.from(
          expandDecimals(currentInputValue, currentSourceAsset.decimals)
        )
      );
    } else if (
      currentSourceAsset &&
      currentSourceAsset.native &&
      typeof bridgeFee !== "string"
    ) {
      return ethers.BigNumber.from(
        expandDecimals(currentInputValue, currentSourceAsset.decimals)
      );
    } else if (feeAsset.native && typeof bridgeFee !== "string") {
      return bridgeFee;
    } else {
      return ethers.BigNumber.from(0);
    }
  }, [currentSourceAsset, feeAsset, bridgeFee, currentInputValue]);

  // const widgetTransaction = useCallback(
  //   async (txHash: string) => {
  //     try {
  //       console.log(
  //         "Widget Transaction - ",
  //         txHash,
  //         widgetId,
  //         currentSourceChain.networkId,
  //         currentDestinationChain.id
  //       );
  //       const response = await (
  //         await fetch(`${ROUTER_STATS_HOST}/api/widget?widgetId=${widgetId}`, {
  //           headers: { "Content-Type": "application/json" },
  //           method: "POST",
  //           body: JSON.stringify({
  //             sourceNetworkId: currentSourceChain.networkId,
  //             destinationChainId: currentDestinationChain.id,
  //             sourceTransactionHash: txHash,
  //           }),
  //         })
  //       ).json();
  //       console.log("widget API response=>", response);
  //     } catch (e) {
  //       console.log("widget transaction error =>", e);
  //     }
  //   },
  //   [currentSourceChain, currentDestinationChain]
  // );

  const handleSwap = useCallback(async () => {
    if (pathFetching) {
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.walletProvider)
    const signer = provider?.getSigner();

    setShowConfirmOrderWindow(false);
    setShowWaitingCard(true);

    if (isMobile || walletId !== "injected") {
      swapEventListeners(null);
    }
    let tx;
    try {
      tx = tx = await signer.sendTransaction({ ...swapExecutionData });
    } catch (e) {
      if (e.code?.toString() === "4001") {
        setShowWaitingCard(false);
        setAlertOpen(true);
        setShowWarning(true);
        setAlertMessage(getErrorMessage1(20, ""));
        setTimeout(() => {
          setAlertOpen(false);
          setShowWarning(false);
        }, 5000);
        return;
      } else {
        setShowWaitingCard(false);
        setAlertOpen(true);
        setShowWarning(true);
        setAlertMessage(_.get(e, "data.message", "Error"));
        setTimeout(() => {
          setAlertOpen(false);
          setShowWarning(false);
        }, 5000);
        return;
      }
    }
    setAnimationState("animate");
    upToSmall && elRef && elRef.current && elRef.current.scrollIntoView();
    setAnimationType("path_01");
    setShowWaitingCard(false);
    if (walletId === "injected") {
      swapEventListeners(tx?.hash);
    }
    let result;
    try {
      result = await provider.waitForTransaction(tx?.hash);
    } catch (e) {
      console.log(e);
    }
    const depositSuccess = result?.status === 1 ? true : false;

    if (depositSuccess) {
      setBalanceTrigger((balanceTrigger) => !balanceTrigger);
    } else {
      setAnimationState("initial");
      setAnimationType("");
      sourceWeb3Provider?.eth.clearSubscriptions();
      destinationWeb3Provider?.eth.clearSubscriptions();
    }
  }, [pathFetching,
    swapEventListeners,
    setShowWaitingCard,
    setAlertOpen,
    setShowWarning,
    setAlertMessage,
    setAnimationState,
    setAnimationType,
    setShowWaitingCard,
    setBalanceTrigger,
  ])

  const swapReady = () => {
    if (!isWalletConnected) {
      //setAlertOpen(true);
      setAlertMessage(getErrorMessage1(0, ""));
      setIsSwapDisabled(true);
    } else if (
      (currentNetwork &&
        currentNetwork.networkId !== currentSourceChain.networkId) ||
      currentNetwork === ""
    ) {
      //setAlertOpen(true);
      setAlertMessage(getErrorMessage1(1, currentSourceChain.name));
      setIsSwapDisabled(true);
    }
    // else if (currentSourceAsset === "") {
    //   //setAlertOpen(true);
    //   setAlertMessage(getErrorMessage1(2, ""));
    //   setIsSwapDisabled(true);
    // } else if (currentDestinationAsset === "") {
    //   //setAlertOpen(true);
    //   setAlertMessage(getErrorMessage1(3, ""));
    //   setIsSwapDisabled(true);
    // } 
    else if (
      !IS_INTERNAL_MAINNET &&
      currentInputValue *
      parseFloat(
        coinPriceList[currentSourceAsset && currentSourceAsset.symbol]
      ) >
      Number(MAX_THRESHOLD_FOR_SWAP)
    ) {
      setAlertOpen(true);
      setShowWarning(true);
      setAlertMessage(getErrorMessage1(4, currentSourceAsset.symbol));
      setIsSwapDisabled(true);
      setTimeout(() => {
        setAlertOpen(false);
        setShowWarning(false);
      }, 5000);
    } else if (Number(currentSourceBalance) < Number(sourceInput)) {
      //setAlertOpen(true);
      setAlertMessage(getErrorMessage1(5, currentSourceAsset.symbol));
      setIsSwapDisabled(true);
    } else if (
      currentSourceAsset.address.toLowerCase() ===
      feeAsset.address.toLowerCase() &&
      typeof bridgeFee !== "string" &&
      parseFloat(currentSourceBalance) <
      parseFloat(formatDecimals(bridgeFee.toString(), feeAsset.decimals)) +
      currentInputValue
    ) {
      //setAlertOpen(true);
      setAlertMessage(getErrorMessage1(5, currentSourceAsset.symbol));
      setIsSwapDisabled(true);
    } else if (
      tabValue === 1 &&
      !ethers.utils.isHexString(currentRecipientAddress)
    ) {
      //setAlertOpen(true);
      setAlertMessage(getErrorMessage1(6, ""));
      setIsSwapDisabled(true);
    } else {
      setAlertOpen(false);
      setIsSwapDisabled(false);
    }
  };

  const priceFetchForAssets = useCallback(async () => {
    try {
      let coinList: AssetType[] = [];
      chains.forEach(
        (chain) =>
        (coinList = [
          ...coinList,
          ...assetList[chain.networkId].filter((asset) => !asset.isLpToken),
        ])
      );
      const coinTemplate = coinList.reduce(
        (acc, item) => ({ ...acc, [item.symbol]: "-" }),
        {}
      );
      const priceListTemp = await coingeckoPriceList(coinList, coinTemplate);
      setCoinPriceList({ ...priceListTemp });
    } catch (e) {
      console.log(e);
    }
  }, [setCoinPriceList]);

  const getPriceImpactString = useCallback(
    (priceImpact: string) =>
      parseFloat(priceImpact) === 0
        ? priceImpact
        : parseFloat(priceImpact) <= 0.01
          ? "<0.01"
          : priceImpact,
    []
  );

  const getTotalPriceImpact = useCallback(() => {
    if (srcPriceImpact === "-" || dstPriceImpact === "-") return "-";
    return parseFloat(srcPriceImpact) + parseFloat(dstPriceImpact) === 0
      ? "0.0"
      : (parseFloat(srcPriceImpact) + parseFloat(dstPriceImpact))
        .toFixed(2)
        .toString();
  }, [srcPriceImpact, dstPriceImpact]);

  const getMinimumReceivedString = useCallback(() => {

    if (destinationInput === "") {
      return "-";
    }

    // if (destinationInput === 'Calculating' || destinationInput === 'Calculating.' || destinationInput === 'Calculating..' || destinationInput === 'Calculating...') {
    // 	return '-'
    // }

    return `${fixedDecimalPlace(
      formatDecimals(amountToBeReceived, currentDestinationAsset.decimals),
      2
    )} ${currentDestinationAsset.symbol} (1 ${currentSourceAsset.symbol
      } = ${fixedDecimalPlace(
        parseFloat(
          formatDecimals(amountToBeReceived, currentDestinationAsset.decimals)
        ) / parseFloat(sourceInput),
        2
      )} ${currentDestinationAsset.symbol})`;
  }, [
    currentSourceAsset,
    currentDestinationAsset,
    sourceInput,
    amountToBeReceived,
    destinationInput,
  ]);

  const calculateUsdBalance = useCallback(() => {
    setSourceUsdBalance("-");
    setDestinationUsdBalance("-");

    if (
      sourceInput === "-" ||
      coinPriceList[currentSourceAsset.symbol] === "-"
    )
      return;
    const srcUsd = parseFloat(coinPriceList[currentSourceAsset.symbol])
      ? parseFloat(sourceInput) *
      parseFloat(coinPriceList[currentSourceAsset.symbol])
      : "";
    setSourceUsdBalance(String(srcUsd));

    if (
      destinationInput === "-" ||
      coinPriceList[currentDestinationAsset.symbol] === "-"
    )
      return;
    const dstUsd = parseFloat(coinPriceList[currentDestinationAsset.symbol])
      ? parseFloat(destinationInput) *
      parseFloat(coinPriceList[currentDestinationAsset.symbol])
      : "";
    setDestinationUsdBalance(String(dstUsd));
  }, [
    currentSourceAsset,
    sourceInput,
    coinPriceList,
    currentDestinationAsset,
    destinationInput,
  ]);

  const getEstimatedFee = useCallback((): any => {
    if (typeof gasPrice === "string") return; //['-','-','-','-']
    if (
      currentSourceChain.networkId !== currentDestinationChain.networkId &&
      bridgeFee === "-"
    )
      return;
    if (
      gasCoinPrice[chainCoinGas[currentSourceChain.networkId].symbol] === "-" ||
      coinPriceList[currentSourceAsset && currentSourceAsset.symbol] === "-" ||
      gasLimit === "-"
    )
      return; //['-','-','-']
    if (currentSourceChain.networkId !== currentDestinationChain.networkId) {
      //if(typeof(bridgeGas)==='string')return
      const formattedBridgeFee = formatDecimals(
        Number(bridgeFee),
        feeAsset.decimals
      );
      // console.log('bridge fee - ',bridgeFee)
      // console.log('formattedBridgeFee',formattedBridgeFee)
      const gasLimitBigNumber: BigNumber = ethers.BigNumber.from(gasLimit);
      const networkFee = gasPrice.mul(gasLimitBigNumber);
      //console.log(gasPrice, gasLimit)
      //console.log('networkFee',networkFee)
      const formattedNetworkFee = formatDecimals(
        Number(networkFee),
        chainCoinGas[currentSourceChain.networkId].decimals
      ); //Number(networkFee)/10**Number(chainCoinGas[currentSourceChain.networkId].decimals)//formatDecimals(Number(networkFee), chainCoinGas[currentSourceChain.networkId].decimals)
      //console.log('formattedNetworkFee',formattedBridgeFee)
      const dollarBridgeFee = parseFloat(formattedBridgeFee);
      const dollarNetworkFee =
        parseFloat(formattedNetworkFee.toString()) *
        parseFloat(
          gasCoinPrice[chainCoinGas[currentSourceChain.networkId].symbol]
        );
      // setTotalEstimatedFee((dollarBridgeFee + dollarNetworkFee).toFixed(4))
      // setBreakDownBridgeFee(dollarBridgeFee.toFixed(4))
      // setBreakdownNetworkFee(dollarNetworkFee.toFixed(4))
      setEstimatedFee([
        (dollarBridgeFee + dollarNetworkFee).toFixed(4),
        fixedDecimalPlace(formattedBridgeFee, 4),
        dollarNetworkFee.toFixed(4),
        networkFee,
      ]);
      //return [(dollarBridgeFee + dollarNetworkFee).toFixed(4), dollarBridgeFee.toFixed(4), dollarNetworkFee.toFixed(4),networkFee]
      //console.log('usd value - ', gas)
    } else {
      const gasLimitBigNumber: BigNumber = ethers.BigNumber.from(gasLimit);
      const networkFee = gasPrice.mul(gasLimitBigNumber);
      const formattedNetworkFee = formatDecimals(
        Number(networkFee),
        chainCoinGas[currentSourceChain.networkId].decimals
      );
      const dollarNetworkFee =
        parseFloat(formattedNetworkFee.toString()) *
        parseFloat(
          gasCoinPrice[chainCoinGas[currentSourceChain.networkId].symbol]
        );
      setEstimatedFee([
        dollarNetworkFee.toFixed(4),
        "-",
        dollarNetworkFee.toFixed(4),
        networkFee,
      ]);
    }
  }, [
    gasPrice,
    currentSourceChain,
    currentDestinationChain,
    bridgeFee,
    feeAsset,
    gasCoinPrice,
    coinPriceList,
    gasLimit,
    currentSourceAsset,
  ]);

  const getTokenBalance = useCallback(
    (asset: AssetType, ethcallProvider: any) => {
      if (!isWalletConnected) return;
      if (asset.native) {
        return ethcallProvider.getEthBalance(currentAccountAddress);
      } else {
        return getBalanceMulticaller({
          accountAddress: currentAccountAddress,
          tokenAddress: asset.address,
        });
      }
    },
    [isWalletConnected, currentAccountAddress]
  );

  const balanceFetch = useCallback(
    async (chain: NetworkType, allTokens: any[]) => {
      if (chain) {
        const balanceListTemp: CoinType = {};
        const rpcProvider = new ethers.providers.JsonRpcProvider(
          chain.endpoint
        );
        const ethcallProvider = new Provider(
          rpcProvider,
          Number(chain.networkId)
        );
        try {
          const balanceListMultiCaller = await ethcallProvider.all(
            allTokens.map((asset) => getTokenBalance(asset, ethcallProvider))
          );
          allTokens.forEach((asset, index) => {
            balanceListTemp[asset.symbol] = fixedDecimalPlace(
              formatDecimals(balanceListMultiCaller[index], asset.decimals),
              4
            );
          });
          return balanceListTemp;
        } catch (err) {
          console.log("Multicaller error on Swap Page -", err);
          return {};
        }
      } else {
        return {};
      }
    },
    [getTokenBalance]
  );

  const swapClickHandler = () => {
    if (isSwapDisabled) {
      if (
        (currentNetwork &&
          currentNetwork.networkId !== currentSourceChain.networkId) ||
        currentNetwork === ""
      ) {
        switchNetworkInMetamask(currentSourceChain.id);
      }
      setAlertOpen(true);
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000);
      return;
    }

    if (currentInputValue === 0 || String(currentInputValue) === "") {
      setAlertOpen(true);
      setShowWarning(true);
      setAlertMessage(
        getErrorMessage1(7, currentSourceAsset && currentSourceAsset.symbol)
      );
      setTimeout(() => {
        setAlertOpen(false);
        setShowWarning(false);
      }, 5000);
      return;
    }

    if (String(destinationInput) === "") {
      setAlertOpen(true);
      setShowWarning(true);
      setAlertMessage(getErrorMessage1(8, ""));
      setTimeout(() => {
        setAlertOpen(false);
        setShowWarning(false);
      }, 5000);
      return;
    }

    if (currentSourceChain.networkId === currentDestinationChain.networkId) {
      // if (estimatedFee[3] === '-' || gasBalance === '-') {
      // 	setAlertOpen(true)
      // 	setShowWarning(true)
      // 	setAlertMessage(getErrorMessage1(11, ''))
      // 	setTimeout(() => {
      // 		setAlertOpen(false)
      // 		setShowWarning(false)
      // 	}, 5000)
      // 	return
      // }
      // try{
      // 	if(typeof(gasBalance)!=='string' && typeof(estimatedFee[3])!=='string'
      // 		&& estimatedFee[3].gt(gasBalance)){
      // 		setAlertOpen(true)
      // 		setShowWarning(true)
      // 		setAlertMessage(getErrorMessage1(9,chainCoinGas[currentSourceChain.networkId].symbol))
      // 		setTimeout(() =>{
      // 			setAlertOpen(false)
      // 			setShowWarning(false)
      // 		},5000)
      // 		return
      // 	}
      // }catch(e){
      // 	console.log(e)
      // 	return
      // }
    } else {
      // if (bridgeFee === '-' || estimatedFee[3] === '-' || gasBalance === '-') {
      //  setAlertOpen(true)
      // setShowWarning(true)
      // setAlertMessage(getErrorMessage1(11, ''))
      // setTimeout(() => {
      // 	setAlertOpen(false)
      // 	setShowWarning(false)
      // }, 5000)
      // return
      // }

      try {
        if (
          currentSourceAsset &&
          currentSourceAsset.address.toLowerCase() !==
          feeAsset.address.toLowerCase() &&
          bridgeFee !== "-" &&
          feeAssetBalance !== "-"
        ) {
          if (
            parseFloat(
              formatDecimals(bridgeFee.toString(), feeAsset.decimals)
            ) > parseFloat(feeAssetBalance.toString())
          ) {
            setAlertOpen(true);
            setShowWarning(true);
            setAlertMessage(getErrorMessage1(9, feeAsset.symbol));
            setTimeout(() => {
              setAlertOpen(false);
              setShowWarning(false);
            }, 5000);
            return;
          }
        }
      } catch (e) {
        console.log(e);
        return;
      }

      if (
        currentSourceAsset &&
        currentSourceAsset.address.toLowerCase() ===
        feeAsset.address.toLowerCase() &&
        typeof bridgeFee !== "string"
      ) {
        if (
          parseFloat(currentSourceBalance) <
          parseFloat(formatDecimals(bridgeFee.toString(), feeAsset.decimals)) +
          currentInputValue
        ) {
          setAlertOpen(true);
          setShowWarning(true);
          setAlertMessage(getErrorMessage1(9, feeAsset.symbol));
          setTimeout(() => {
            setAlertOpen(false);
            setShowWarning(false);
          }, 5000);
          return;
        }
      }
    }

    try {
      if (
        typeof gasBalance !== "string" &&
        typeof estimatedFee[3] !== "string" &&
        estimatedFee[3].gt(gasBalance)
      ) {
        // setAlertOpen(true)
        // setShowWarning(true)
        // setAlertMessage(getErrorMessage1(9,chainCoinGas[currentSourceChain.networkId].symbol))
        // setTimeout(() =>{
        // 	setAlertOpen(false)
        // 	setShowWarning(false)
        // },5000)
        // return
      }
    } catch (e) {
      console.log(e);
    }

    if (pathFetching) {
      setAlertOpen(true);
      setShowWarning(true);
      setAlertMessage(getErrorMessage1(12, ""));
      setTimeout(() => {
        setAlertOpen(false);
        setShowWarning(false);
      }, 5000);
      return;
    }

    if (shouldSourceApprove || shouldFeeApprove) {
      setShowApprovalWindow(true);
    } else {
      setShowConfirmOrderWindow(true);
    }
  };

  const getSpenderAddress = () => {
    if (currentSourceChain.networkId !== currentDestinationChain.networkId) {
      return currentSourceChain.opts.reserveHandler;
    } else {
      if (
        currentSourceAsset &&
        currentDestinationAsset &&
        ((currentSourceAsset.isLpToken &&
          currentDestinationAsset.lpAddress.toLowerCase() ===
          currentSourceAsset.address.toLowerCase()) ||
          (currentDestinationAsset.isLpToken &&
            currentSourceAsset.lpAddress.toLowerCase() ===
            currentDestinationAsset.address.toLowerCase()))
      ) {
        return currentSourceChain.opts.reserveHandler;
      } else {
        return currentSourceChain.opts.oneSplit;
      }
    }
  };

  const sourceTokenApproval = useCallback(async () => {
    setSourceApprovalLoading(true);
    const provider = window.modalProvider;
    const signer = provider.getSigner();

    const latestActivity: LatestActivityType[] = [];
    const dateString = new Date().toLocaleString();

    let approvalTx: boolean | undefined;
    let tx: any;
    if (routerObject) {
      routerObject.approveSourceToken(
        currentSourceAsset.address,
        currentAccountAddress,
        sourceInfiniteApproval
          ? formatDecimals(
            ethers.constants.MaxUint256,
            currentSourceAsset.decimals
          )
          : currentInputValue,
        currentDestinationChain.networkId,
        signer
      ).then((res: any) => {
        // setGasObjectSdk(res)
        console.log("approval::", res)
        tx = res
      })
      console.log("Source approval tx hash -", tx);
      let result = tx ? await provider.waitForTransaction(tx.hash) : false;
      if (result?.status?.toString() == "1") {
        approvalTx = true;
        setSourceTokenAllowance(
          sourceInfiniteApproval
            ? formatDecimals(
              ethers.constants.MaxUint256,
              currentSourceAsset.decimals
            )
            : String(currentInputValue)
        );
        setShouldSourceApprove(false);
      } else {
        approvalTx = false;
      }

      if (approvalTx) {
        if (
          feeAsset.address.toLowerCase() ===
          currentSourceAsset.address.toLowerCase() ||
          !shouldFeeApprove
        ) {
          setShowApprovalWindow(false);
          setShowConfirmOrderWindow(true);
        }
        latestActivity.push({
          name: `Approve ${currentSourceAsset.symbol}`,
          status: "Complete",
          icon: "Approve",
          date: dateString,
          txUrl: explorerLinks[currentSourceChain.networkId] + tx?.hash,
        });
      } else {
        // setAnimationState('initial')
        // setAnimationType('')
        // setShowWaitingCard(false)
      }
      setSourceApprovalLoading(false);
    }
    // let tx = await setApproval({
    //   erc20Address: currentSourceAsset.address,
    //   amount: sourceInfiniteApproval
    //     ? formatDecimals(
    //       ethers.constants.MaxUint256,
    //       currentSourceAsset.decimals
    //     )
    //     : currentInputValue,
    //   decimals: currentSourceAsset.decimals,
    //   recipient: getSpenderAddress(),
    //   provider: provider,
    //   signer: signer,
    // });

    // // if (approvalTx === undefined) {
    // // 	setAnimationState('initial')
    // // 	setAnimationType('')
    // // 	setShowWaitingCard(false)
    // // }
    // console.log("Source approval tx hash -", tx);
    // let result = tx ? await provider.waitForTransaction(tx.hash) : false;
    // if (result?.status?.toString() == "1") {
    //   approvalTx = true;
    //   setSourceTokenAllowance(
    //     sourceInfiniteApproval
    //       ? formatDecimals(
    //         ethers.constants.MaxUint256,
    //         currentSourceAsset.decimals
    //       )
    //       : String(currentInputValue)
    //   );
    //   setShouldSourceApprove(false);
    // } else {
    //   approvalTx = false;
    // }

    // if (approvalTx) {
    //   if (
    //     feeAsset.address.toLowerCase() ===
    //     currentSourceAsset.address.toLowerCase() ||
    //     !shouldFeeApprove
    //   ) {
    //     setShowApprovalWindow(false);
    //     setShowConfirmOrderWindow(true);
    //   }
    //   latestActivity.push({
    //     name: `Approve ${currentSourceAsset.symbol}`,
    //     status: "Complete",
    //     icon: "Approve",
    //     date: dateString,
    //     txUrl: explorerLinks[currentSourceChain.networkId] + tx?.hash,
    //   });
    // } else {
    //   // setAnimationState('initial')
    //   // setAnimationType('')
    //   // setShowWaitingCard(false)
    // }
    // setSourceApprovalLoading(false);
  }, [
    currentSourceAsset,
    currentInputValue,
    getSpenderAddress,
    feeAsset,
    shouldFeeApprove,
    sourceInfiniteApproval,
    currentSourceChain,
    routerObject
  ]);

  const feeTokenApproval = useCallback(async () => {
    if (bridgeFee === "-") return;
    //if(feeAsset.native) return
    setFeeApprovalLoading(true);
    const provider = window.modalProvider;
    const signer = provider?.getSigner();

    const latestActivity: LatestActivityType[] = [];
    const dateString = new Date().toLocaleString();

    let approvalTx: boolean | undefined;
    let tx: any;
    if (routerObject) {
      routerObject.approveFeeToken(
        feeAsset.address,
        currentAccountAddress,
        feeInfiniteApproval
          ? formatDecimals(ethers.constants.MaxUint256, feeAsset.decimals)
          : formatDecimals(bridgeFee.toString(), feeAsset.decimals),
        signer
      ).then((res: any) => {
        // setGasObjectSdk(res)
        console.log("approval::", res)
        tx = res
      })
      console.log("Fee approval tx hash -", tx);
      let result = tx ? await provider.waitForTransaction(tx.hash) : false;
      if (result?.status == 1) {
        approvalTx = true;
        setFeeTokenAllowance(
          feeInfiniteApproval
            ? formatDecimals(ethers.constants.MaxUint256, feeAsset.decimals)
            : formatDecimals(bridgeFee.toString(), feeAsset.decimals)
        );
        setShouldFeeApprove(false);
      } else {
        approvalTx = false;
      }

      if (approvalTx) {
        if (
          feeAsset.address.toLowerCase() ===
          currentSourceAsset.address.toLowerCase() ||
          !shouldSourceApprove
        ) {
          setShowApprovalWindow(false);
          setShowConfirmOrderWindow(true);
        }
        latestActivity.push({
          name: `Approve ${currentSourceAsset.symbol}`,
          status: "Complete",
          icon: "Approve",
          date: dateString,
          txUrl: explorerLinks[currentSourceChain.networkId] + tx?.hash,
        });
      } else {
        // setAnimationState('initial')
        // setAnimationType('')
        // setShowWaitingCard(false)
      }
      setFeeApprovalLoading(false);
    }
    // let tx = await setApproval({
    //   erc20Address: feeAsset.address,
    //   amount: feeInfiniteApproval
    //     ? formatDecimals(ethers.constants.MaxUint256, feeAsset.decimals)
    //     : formatDecimals(bridgeFee.toString(), feeAsset.decimals),
    //   decimals: feeAsset.decimals,
    //   recipient: currentSourceChain.opts.reserveHandler,
    //   provider: provider,
    //   signer: signer,
    // });

    // if (approvalTx === undefined) {
    // 	setAnimationState('initial')
    // 	setAnimationType('')
    // 	setShowWaitingCard(false)
    // }
    // console.log("Fee approval tx hash -", tx);
    // let result = tx ? await provider.waitForTransaction(tx.hash) : false;
    // if (result?.status == 1) {
    //   approvalTx = true;
    //   setFeeTokenAllowance(
    //     feeInfiniteApproval
    //       ? formatDecimals(ethers.constants.MaxUint256, feeAsset.decimals)
    //       : formatDecimals(bridgeFee.toString(), feeAsset.decimals)
    //   );
    //   setShouldFeeApprove(false);
    // } else {
    //   approvalTx = false;
    // }

    // if (approvalTx) {
    //   if (
    //     feeAsset.address.toLowerCase() ===
    //     currentSourceAsset.address.toLowerCase() ||
    //     !shouldSourceApprove
    //   ) {
    //     setShowApprovalWindow(false);
    //     setShowConfirmOrderWindow(true);
    //   }
    //   latestActivity.push({
    //     name: `Approve ${currentSourceAsset.symbol}`,
    //     status: "Complete",
    //     icon: "Approve",
    //     date: dateString,
    //     txUrl: explorerLinks[currentSourceChain.networkId] + tx?.hash,
    //   });
    // } else {
    //   // setAnimationState('initial')
    //   // setAnimationType('')
    //   // setShowWaitingCard(false)
    // }
    // setFeeApprovalLoading(false);
  }, [
    currentSourceAsset,
    bridgeFee,
    feeAsset,
    feeInfiniteApproval,
    shouldSourceApprove,
    currentSourceChain,
    routerObject
  ]);

  const updateSourceTokenListBalance = useCallback(() => {
    let tokenListRemote: AssetType[] = [];
    tokenListByUrl &&
      activeListUrl.forEach((url) => {
        tokenListByUrl[url]?.tokens?.forEach((token) => {
          let newToken = { ...token };
          if (token.chainId.toString() === currentSourceChain.networkId) {
            newToken["lpSymbol"] = "";
            newToken["lpAddress"] = "";
            newToken["stakingRewards"] = "";
            newToken["resourceId"] = "";
            newToken["mappedOnBridge"] = false;
            newToken["native"] = false;
            newToken["hasLpToken"] = false;
            newToken["isLpToken"] = false;
            newToken["stableAsset"] = false;
            newToken["mining"] = false;
            newToken["activeMining"] = false;
            newToken["enableLiquidityMining"] = false;
            tokenListRemote.push(newToken);
          }
        });
      });
    let anyToken = localStorage.getItem("anyToken")
      ? JSON.parse(localStorage.getItem("anyToken") || "{}")
      : null;
    let anySourceTokenList =
      anyToken && anyToken[currentAccountAddress]
        ? anyToken[currentAccountAddress][currentSourceChain.networkId]
        : [];
    let allSourceTokens = anySourceTokenList
      ? [
        ...assetList[currentSourceChain.networkId],
        ...tokenListRemote,
        ...anySourceTokenList,
      ]
      : [...assetList[currentSourceChain.networkId], ...tokenListRemote];
    if (
      currentAccountAddress &&
      isWalletConnected &&
      currentSourceChain &&
      allSourceTokens
    ) {
      balanceFetch(currentSourceChain, allSourceTokens).then(
        (balanceList: any) => {
          setSourceTokensBalanceList(balanceList);
        }
      );
    }
  }, [
    tokenListByUrl,
    activeListUrl,
    currentSourceChain,
    currentAccountAddress,
    isWalletConnected,
    balanceFetch,
  ]);

  const destinationTokenListBalance = useCallback(() => {
    let tokenListRemote: AssetType[] = [];
    tokenListByUrl &&
      activeListUrl.forEach((url) => {
        tokenListByUrl[url]?.tokens?.forEach((token) => {
          let newToken = { ...token };
          if (token.chainId.toString() === currentDestinationChain.networkId) {
            newToken["lpSymbol"] = "";
            newToken["lpAddress"] = "";
            newToken["stakingRewards"] = "";
            newToken["resourceId"] = "";
            newToken["mappedOnBridge"] = false;
            newToken["native"] = false;
            newToken["hasLpToken"] = false;
            newToken["isLpToken"] = false;
            newToken["stableAsset"] = false;
            newToken["mining"] = false;
            newToken["activeMining"] = false;
            newToken["enableLiquidityMining"] = false;
            tokenListRemote.push(newToken);
          }
        });
      });
    let anyToken = localStorage.getItem("anyToken")
      ? JSON.parse(localStorage.getItem("anyToken") || "{}")
      : null;
    let anyDestinationTokenList =
      anyToken && anyToken[currentAccountAddress]
        ? anyToken[currentAccountAddress][currentDestinationChain.networkId]
        : [];
    let allDestinationTokens = anyDestinationTokenList
      ? [
        ...assetList[currentDestinationChain.networkId],
        ...tokenListRemote,
        ...anyDestinationTokenList,
      ]
      : [...assetList[currentDestinationChain.networkId], ...tokenListRemote];
    if (
      currentAccountAddress &&
      isWalletConnected &&
      currentDestinationChain &&
      allDestinationTokens
    ) {
      balanceFetch(currentDestinationChain, allDestinationTokens).then(
        (balanceList: any) => {
          setDestinationTokensBalanceList(balanceList);
        }
      );
    }
  }, [
    tokenListByUrl,
    activeListUrl,
    currentDestinationChain,
    currentAccountAddress,
    isWalletConnected,
    balanceFetch,
  ]);

  // const handleBuyRoute = useCallback(() => {
  // 	setCurrentDestinationChain(currentSourceChain)
  // 	setCurrentSourceAsset(assetList[currentSourceChain.networkId].filter(asset => asset.symbol.toLowerCase() === 'usdc' || asset.symbol.toLowerCase() === 'usdc.e')[0])
  // 	setCurrentDestinationAsset(assetList[currentSourceChain.networkId].filter(asset => asset.symbol.toLowerCase() === 'route')[0])
  // }, [])

  // useEffect(
  // 	() => {
  // 		if (currentSourceAsset === '' || currentAccountAddress === '' || !isWalletConnected) return
  // 		const fetchBalances = async () => {
  // 			try {
  // 				const ethcallProvider = new Provider(sourceProvider, Number(currentSourceChain.networkId))
  // 				const balances = await ethcallProvider.all([
  // 					getTokenBalance(currentSourceAsset, ethcallProvider),
  // 					getTokenBalance(feeAsset, ethcallProvider)
  // 				])
  // 				console.log("Source Fee Balances - ", balances)
  // 				setCurrentSourceBalance(balances[0] ? formatDecimals(balances[0], currentSourceAsset.decimals) : "0")
  // 				setFeeAssetBalance(balances[1] ? formatDecimals(balances[1], feeAsset.decimals) : "0")
  // 			} catch (e) {
  // 				console.log("Source Fee Balances error - ", e)
  // 			}
  // 		}
  // 		fetchBalances()
  // 	},
  // 	[currentSourceAsset, currentAccountAddress, balanceTrigger, feeAsset, isWalletConnected]
  // );

  useEffect(() => {
    //const provider = new ethers.providers.JsonRpcProvider(currentSourceChain.endpoint);
    if (sourceTokensBalanceList[currentSourceAsset.symbol]) {
      setCurrentSourceBalance(
        sourceTokensBalanceList[currentSourceAsset.symbol]
      );
    }
    if (currentSourceAsset.native) {
      sourceProvider
        .getBalance(currentAccountAddress)
        .then((balance: any) => {
          if (balance)
            setCurrentSourceBalance(
              formatDecimals(
                balance.toString(),
                chainCoinGas[currentSourceChain.networkId].decimals
              )
            );
          else {
            setCurrentSourceBalance("0");
          }
        })
        .catch((e: any) => console.log(e));
      return;
    }
    getBalance({
      accountAddress: currentAccountAddress,
      tokenAddress: currentSourceAsset.address,
      tokenDecimals: currentSourceAsset.decimals,
      provider: sourceProvider,
    }).then((balance) => {
      if (typeof balance === "string") setCurrentSourceBalance(balance);
      else {
        console.log("Source - ", balance);
        setCurrentSourceBalance("0");
      }
    });
  }, [currentSourceAsset, currentAccountAddress, balanceTrigger]);

  useEffect(() => {
    //const provider = new ethers.providers.JsonRpcProvider(currentDestinationChain.endpoint);
    if (
      tabValue === 0 &&
      destinationTokensBalanceList[currentDestinationAsset.symbol]
    ) {
      setCurrentDestinationBalance(
        destinationTokensBalanceList[currentDestinationAsset.symbol]
      );
    }
    if (tabValue === 1 && !ethers.utils.isHexString(currentRecipientAddress))
      return;
    if (currentDestinationAsset.native) {
      destProvider
        .getBalance(
          tabValue === 1 ? currentRecipientAddress : currentAccountAddress
        )
        .then((balance: any) => {
          if (balance)
            setCurrentDestinationBalance(
              formatDecimals(
                balance.toString(),
                chainCoinGas[currentDestinationChain.networkId].decimals
              )
            );
          else {
            setCurrentDestinationBalance("0");
          }
        })
        .catch((e: any) => console.log(e));
      return;
    }
    getBalance({
      accountAddress:
        tabValue === 1 ? currentRecipientAddress : currentAccountAddress,
      tokenAddress: currentDestinationAsset.address,
      tokenDecimals: currentDestinationAsset.decimals,
      provider: destProvider,
    }).then((balance) => {
      if (typeof balance === "string") setCurrentDestinationBalance(balance);
      else {
        console.log("Destination - ", balance);
        setCurrentDestinationBalance("0");
      }
    });
  }, [
    currentDestinationAsset,
    currentAccountAddress,
    balanceTrigger,
    tabValue,
  ]);

  useEffect(() => {
    if (sourceTokensBalanceList[feeAsset.symbol]) {
      setFeeAssetBalance(sourceTokensBalanceList[feeAsset.symbol]);
    }
    if (feeAsset.native) {
      sourceProvider
        .getBalance(currentAccountAddress)
        .then((balance: any) => {
          if (balance) setFeeAssetBalance(balance);
          else {
            setFeeAssetBalance(ethers.BigNumber.from(0));
          }
        })
        .catch((e: any) => console.log(e));
      return;
    }
    getBalance({
      accountAddress: currentAccountAddress,
      tokenAddress: feeAsset.address,
      tokenDecimals: feeAsset.decimals,
      provider: sourceProvider,
    }).then((balance) => {
      if (typeof balance === "string") setFeeAssetBalance(balance);
      else {
        console.log("Source Fee- ", balance);
        setFeeAssetBalance(ethers.BigNumber.from(0));
      }
    });
  }, [
    currentAccountAddress,
    balanceTrigger,
    feeAsset,
    sourceProvider,
    sourceTokensBalanceList,
  ]);

  useEffect(() => {
    if (currentSourceChain.networkId === currentDestinationChain.networkId)
      return;
    setBridgeFee("-");
    const filterFeeTokens = () => {
      if (routerObject) {
        routerObject.getBridgeFee(currentDestinationChain.networkId).then((res: any) => {
          const feeTokens = res.map((i: any) => i.address)
          const nativeAsset = assetList[currentSourceChain.networkId].filter(
            (asset) => asset.native
          );
          const filteredFeeTokens = assetList[currentSourceChain.networkId]?.filter(
            (asset) =>
              asset?.address !== nativeAsset[0]?.address &&
              feeTokens?.includes(asset?.address)
          );
          setFeeTokenList([...filteredFeeTokens, ...nativeAsset]);
          console.log("feeTokens", feeTokens);
          console.log("native:", nativeAsset);
          console.log("filter fee tokens", filteredFeeTokens);
        })
      }
    };
    filterFeeTokens();
  }, [currentSourceChain, currentDestinationChain, routerObject]);

  useEffect(() => {
    if (!isWalletConnected) return;
    const fetchApproval = () => {
      if (routerObject) {
        routerObject.getSourceTokenAllowance(currentSourceAsset.address, currentDestinationChain.networkId, currentAccountAddress).then((allowances: any) => {
          // setGasObjectSdk(res)
          console.log("Allowance::", allowances)
          setSourceTokenAllowance(
            allowances
              ? formatDecimals(allowances, currentSourceAsset.decimals)
              : "0"
          );
        })
        routerObject.getFeeTokenAllowance(feeAsset.address, currentDestinationChain.networkId, currentAccountAddress).then((allowances: any) => {
          // setGasObjectSdk(res)
          setFeeTokenAllowance(
            allowances ? formatDecimals(allowances, feeAsset.decimals) : "0"
          );
          console.log("Approval Amount Source,Fee Asset => ", allowances);
        })
      }
    };
    fetchApproval();
  }, [currentSourceAsset, currentAccountAddress, feeAsset, isWalletConnected]);

  useEffect(() => {
    getBalance({
      accountAddress: currentDestinationChain.opts.reserveHandler,
      tokenAddress: currentDestinationAsset && currentDestinationAsset.address,
      tokenDecimals:
        currentDestinationAsset && currentDestinationAsset.decimals,
      provider: destProvider,
    }).then((balance) => {
      if (typeof balance === "string") {
        console.log("dest asset TVL - ", balance);
        setDestTokenTvl(balance);
      } else {
        console.log("dest - ", balance);
        setDestTokenTvl(ethers.BigNumber.from(0));
      }
    });
  }, [currentDestinationAsset, balanceTrigger]);

  useEffect(() => {
    if (!feeTokenList) return;
    currentSourceChain.networkId !== currentDestinationChain.networkId &&
      fetchBridgeFee();
  }, [feeTokenList, coinPriceList]);

  useEffect(() => {
    if (!isWalletConnected) return;
    setSourceTokensBalanceList({});
    updateSourceTokenListBalance();
  }, [
    currentAccountAddress,
    isWalletConnected,
    currentSourceChain,
    activeListUrl,
  ]);

  useEffect(() => {
    if (!isWalletConnected) return;
    updateSourceTokenListBalance();
  }, [balanceTrigger]);

  useEffect(() => {
    if (!isWalletConnected) return;
    setDestinationTokensBalanceList({});
    destinationTokenListBalance();
  }, [
    currentAccountAddress,
    isWalletConnected,
    currentDestinationChain,
    activeListUrl,
  ]);

  useEffect(() => {
    if (!isWalletConnected) return;
    destinationTokenListBalance();
  }, [balanceTrigger]);

  useEffect(() => {
    if (!feePriceFeed) return;
    if (!feePriceFeed[feeAsset.symbol]) return;
    let newFee = [...estimatedFee];
    newFee[1] = "-";
    setEstimatedFee(newFee);
    let newBridgeFee = "-";
    if (
      currentSourceAsset &&
      currentSourceAsset.mappedOnBridge &&
      feePriceFeed
    ) {
      newBridgeFee = feePriceFeed[feeAsset.symbol].fee[0];
    } else if (feePriceFeed) {
      newBridgeFee = feePriceFeed[feeAsset.symbol].fee[1];
    }
    setBridgeFee(newBridgeFee);
  }, [feeAsset, feePriceFeed]);

  useEffect(() => {
    if (isInitialRender) return;
    getEstimatedFee();
  }, [gasPrice, gasLimit, bridgeFee, gasCoinPrice, coinPriceList]);

  useEffect(() => {
    if (isInitialRender) return;
    //switchNetworkInMetamask(currentSourceChain.id)
    let sourceAsFee =
      feeTokenList
        ? feeTokenList.find(
          (feeToken) =>
            feeToken.address.toLowerCase() ===
            currentSourceAsset.address.toLowerCase()
        )
        : null;
    let newFeeToken = sourceAsFee
      ? sourceAsFee
      : assetList[currentSourceChain.networkId].filter(
        (item) => item.native
      )[0];
    setFeeAsset(newFeeToken);
  }, [feeTokenList]);

  // useEffect(() => {
  // 	let interval: any
  // 	if (pathFetching) {
  // 		let word = `Calculating`
  // 		let dots = ''
  // 		setDestinationInput(word + dots)
  // 		interval =
  // 			setInterval(() => {
  // 				dots += '.'
  // 				if (dots.length === 4) dots = ''
  // 				setDestinationInput(word + dots)
  // 			}, 500)
  // 	}
  // 	return () => {
  // 		clearInterval(interval)
  // 	}

  // }, [pathFetching])

  useEffect(() => {
    if (currentSourceChain.networkId === currentDestinationChain.networkId) {
      setTabValue(0);
    }
  }, [currentSourceChain, currentDestinationChain]);

  // useEffect(() => {
  //   if (
  //     currentNetwork === "" ||
  //     (currentNetwork && currentNetwork.name === "Loading...")
  //   )
  //     return;
  //   // const query = new URLSearchParams(location.search);
  //   // const fromChain = query.get("fromChain");
  //   // const srcChain: NetworkType | null = fromChain
  //   //   ? chainLookUp[fromChain]
  //   //     ? chainLookUp[fromChain]
  //   //     : null
  //   //   : null;
  //   // if (!srcChain) selectCurrentSourceChainHandler(currentNetwork);
  // }, [currentNetwork]);

  useEffect(() => {
    if (isInitialRender) return;
    if (!isWalletConnected) return;
    fetchGasBalance();
  }, [currentAccountAddress]);

  useEffect(
    () => calculateUsdBalance(),
    [
      sourceInput,
      destinationInput,
      currentSourceAsset,
      currentDestinationAsset,
      coinPriceList,
    ]
  );

  useEffect(() => {
    if (!isTabActive) return;
    priceFetchForAssets();
    priceFetchForGas();
    const priceInterval = setInterval(() => {
      priceFetchForAssets();
      priceFetchForGas();
    }, balanceCallInterval);

    return () => {
      clearInterval(priceInterval);
    };
  }, [currentSourceChain, currentDestinationChain, isTabActive]);

  //Fetch token-list

  useEffect(() => {
    console.log("FETCHING =>");
    const fetchJSON = async (url: string) => {
      try {
        const data = await (await fetch(url)).json();
        return data;
      } catch (e) {
        console.log("Token List Fetching error =>", e);
      }
    };
    const setTokenListData = async () => {
      const data = await Promise.all(
        remoteAssetList.map((url) => fetchJSON(url))
      );
      console.log("DATA =>", data);
      const groupedData: { [key: string]: TokenListType } = {};
      remoteAssetList.map((url, index) => (groupedData[url] = data[index]));
      console.log("groupedData - ", groupedData);
      setTokenListByUrl(groupedData);
    };
    setTokenListData();
  }, []);

  // useEffect(() => {
  //   const selectChainToken = () => {
  //     // const query = new URLSearchParams(location.search);
  //     // const fromChain = query.get("fromChain");
  //     // const toChain = query.get("toChain");
  //     // const fromToken = query.get("fromToken");
  //     // const toToken = query.get("toToken");
  //     // console.log(fromChain, toChain, fromToken, toToken);

  //     // const srcChain: NetworkType | null = fromChain
  //     //   ? chainLookUp[fromChain]
  //     //     ? chainLookUp[fromChain]
  //     //     : null
  //     //   : null;
  //     // const dstChain: NetworkType | null = toChain
  //     //   ? chainLookUp[toChain]
  //     //     ? chainLookUp[toChain]
  //     //     : null
  //     //   : null;

  //     let anyToken = localStorage.getItem("anyToken")
  //       ? JSON.parse(localStorage.getItem("anyToken") || "{}")
  //       : null;
  //     let anySourceTokenList =
  //       anyToken && srcChain && anyToken[currentAccountAddress]
  //         ? anyToken[currentAccountAddress][srcChain.networkId]
  //         : [];
  //     let anyDestTokenList =
  //       anyToken && dstChain && anyToken[currentAccountAddress]
  //         ? anyToken[currentAccountAddress][dstChain.networkId]
  //         : [];

  //     let srcToken: AssetType | null = null;
  //     if (srcChain && fromToken) {
  //       srcToken =
  //         assetList[srcChain.networkId].filter(
  //           (token) => token.address.toLowerCase() === fromToken.toLowerCase()
  //         )[0] ?? null;
  //       if (!srcToken) {
  //         srcToken =
  //           anySourceTokenList.filter(
  //             (token: any) =>
  //               token.address.toLowerCase() === fromToken.toLowerCase()
  //           )[0] ?? null;
  //       }
  //       if (!srcToken) {
  //         tokenListByUrl &&
  //           activeListUrl.forEach((url) => {
  //             tokenListByUrl[url]?.tokens?.forEach((token) => {
  //               let newToken = { ...token };
  //               if (
  //                 token.chainId.toString() === srcChain.networkId &&
  //                 token.address.toString().toLowerCase() ===
  //                 fromToken.toLowerCase()
  //               ) {
  //                 newToken["lpSymbol"] = "";
  //                 newToken["lpAddress"] = "";
  //                 newToken["stakingRewards"] = "";
  //                 newToken["resourceId"] = "";
  //                 newToken["mappedOnBridge"] = false;
  //                 newToken["native"] = false;
  //                 newToken["hasLpToken"] = false;
  //                 newToken["isLpToken"] = false;
  //                 newToken["stableAsset"] = false;
  //                 newToken["mining"] = false;
  //                 newToken["activeMining"] = false;
  //                 newToken["enableLiquidityMining"] = false;
  //                 srcToken = newToken;
  //               }
  //             });
  //           });
  //       }
  //     }

  //     let dstToken: AssetType | null = null;
  //     if (dstChain && toToken) {
  //       dstToken =
  //         assetList[dstChain.networkId].filter(
  //           (token) => token.address.toLowerCase() === toToken.toLowerCase()
  //         )[0] ?? null;
  //       if (!dstToken) {
  //         dstToken =
  //           anyDestTokenList.filter(
  //             (token: any) =>
  //               token.address.toLowerCase() === toToken.toLowerCase()
  //           )[0] ?? null;
  //       }
  //       if (!dstToken) {
  //         tokenListByUrl &&
  //           activeListUrl.map((url) => {
  //             tokenListByUrl[url]?.tokens?.map((token) => {
  //               let newToken = { ...token };
  //               if (
  //                 token.chainId.toString() === dstChain.networkId &&
  //                 token.address.toString().toLowerCase() ===
  //                 toToken.toLowerCase()
  //               ) {
  //                 newToken["lpSymbol"] = "";
  //                 newToken["lpAddress"] = "";
  //                 newToken["stakingRewards"] = "";
  //                 newToken["resourceId"] = "";
  //                 newToken["mappedOnBridge"] = false;
  //                 newToken["native"] = false;
  //                 newToken["hasLpToken"] = false;
  //                 newToken["isLpToken"] = false;
  //                 newToken["stableAsset"] = false;
  //                 newToken["mining"] = false;
  //                 newToken["activeMining"] = false;
  //                 newToken["enableLiquidityMining"] = false;
  //                 dstToken = newToken;
  //               }
  //             });
  //           });
  //       }
  //     }
  //     srcChain && setCurrentSourceChain(srcChain);
  //     dstChain && setCurrentDestinationChain(dstChain);
  //     srcToken && setCurrentSourceAsset(srcToken);
  //     dstToken && setCurrentDestinationAsset(dstToken);
  //   };

  //   selectChainToken();
  // }, [tokenListByUrl]);

  useEffect(() => {
    if (bridgeFee === "-") {
      setShouldFeeApprove(false);
    } else if (
      feeAsset.address !== currentSourceAsset.address &&
      parseFloat(feeTokenAllowance) <
      parseFloat(formatDecimals(bridgeFee.toString(), feeAsset.decimals))
    ) {
      setShouldFeeApprove(true);
    } else {
      setShouldFeeApprove(false);
    }
  }, [feeTokenAllowance, bridgeFee]);

  useEffect(() => {
    // if (currentSourceAsset === "") {
    //   setShouldSourceApprove(false);
    // } 
    if (parseFloat(sourceTokenAllowance) < currentInputValue) {
      return setShouldSourceApprove(true);
    } else {
      return setShouldSourceApprove(false);
    }
  }, [sourceTokenAllowance, currentInputValue]);

  useEffect(
    () => setCurrentInputValue(Number(srcInputDebouncedValue)),
    [srcInputDebouncedValue]
  );

  useEffect(() => {
    if (isInitialRender) return;
    if (!isTabActive) return;
    if (animationState === "animate" || animationState === "final") return;
    if (
      currentInputValue === 0 ||
      sourceInput === ""
    ) {
      setPathFetching(false);
      setDestinationInput("");
      return;
    }
    //if(currentDestinationAsset.isLpToken) return
    const cancelToken = axios.CancelToken.source();
    //setDestinationInput('')
    setSrcPriceImpact("-");
    setDstPriceImpact("-");
    //setBridgeFee('-')
    setAnimationState("initial");
    setAnimationType("");
    if (
      !IS_INTERNAL_MAINNET &&
      currentInputValue *
      parseFloat(
        coinPriceList[currentSourceAsset && currentSourceAsset.symbol]
      ) >
      Number(MAX_THRESHOLD_FOR_SWAP)
    ) {
      setAlertOpen(true);
      setShowWarning(true);
      setAlertMessage(getErrorMessage1(4, MAX_THRESHOLD_FOR_SWAP));
      setTimeout(() => {
        setAlertOpen(false);
        setShowWarning(false);
      }, 5000);
      return;
    }
    setValuesForDeposit(cancelToken);
    return () => {
      cancelToken.cancel(getErrorMessage1(15, ""));
    };
  }, [
    currentSourceChain,
    currentDestinationChain,
    currentSourceAsset,
    currentDestinationAsset,
    currentInputValue,
    animationState,
    slippageTolerance,
  ]);

  useEffect(() => {
    if (!isTabActive) return;
    if (animationState === "animate" || animationState === "final") return;
    if (
      currentInputValue === 0 ||
      sourceInput === ""
    ) {
      setDestinationInput("");
      return;
    }
    if (
      currentSourceAsset.mappedOnBridge &&
      currentDestinationAsset.mappedOnBridge &&
      currentSourceAsset.resourceId !== "" &&
      currentDestinationAsset.resourceId !== "" &&
      currentSourceAsset.resourceId === currentDestinationAsset.resourceId
    )
      return;
    const cancelToken = axios.CancelToken.source();
    const fetchSwapValues = setInterval(
      () => setValuesForDeposit(cancelToken),
      pathFinderDataRefesh
    );

    return () => {
      clearInterval(fetchSwapValues);
      cancelToken.cancel(getErrorMessage1(15, ""));
    };
  }, [
    currentSourceChain,
    currentDestinationChain,
    currentSourceAsset,
    currentDestinationAsset,
    currentInputValue,
    animationState,
    slippageTolerance,
    isTabActive,
  ]);

  useEffect(() => {
    if (isInitialRender) return;
    setAnimationState("initial");
    setAnimationType("");
    setSrcPriceImpact("-");
    setDstPriceImpact("-");
    //setBridgeFee('-')
    sourceWeb3Provider?.eth.clearSubscriptions();
    destinationWeb3Provider?.eth.clearSubscriptions();
  }, [
    currentSourceChain,
    currentDestinationChain,
    currentSourceAsset,
    currentDestinationAsset,
  ]);

  useEffect(() => setDestinationInput(""), [currentDestinationAsset]);

  useEffect(() => {
    if (isInitialRender) return;
    setBalanceTrigger((balanceTrigger) => !balanceTrigger);
  }, [currentRecipientAddress, tabValue]);

  useEffect(() => {
    if (!isTabActive) return;
    if (!isWalletConnected) return;
    const balanceInterval = setInterval(() => {
      fetchGasBalance();
      setBalanceTrigger((balanceTrigger) => !balanceTrigger);
    }, balanceCallInterval);
    return () => clearInterval(balanceInterval);
  }, [isTabActive, currentAccountAddress]);

  useEffect(() => {
    swapReady();
    setShowWarning(true);
    const timeout = setTimeout(() => setShowWarning(false), 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [
    isWalletConnected,
    currentNetwork,
    currentSourceChain,
    currentInputValue,
    currentSourceAsset,
    currentDestinationAsset,
    currentSourceBalance,
    currentRecipientAddress,
    tabValue,
  ]);

  return (
    <>
      <Wrapper backgroundColor={backgroundColor}>
        <SwapWrapper>
          <Header>
            <SelectedTab>Swap</SelectedTab>
            {/* {
                            upToMedium &&
                            (<StyledFlash active={alertOpen}>
                                <Flash message={alertMessage} active={alertOpen} />
                            </StyledFlash>)
                        } */}
            {/* <BuyRouteSpan onClick={handleBuyRoute}>
                                Buy Route
                            </BuyRouteSpan> */}
          </Header>
          <MenuWrapper
            open={showSourceChainMenu}
            onClose={closeShowSourceChainMenu}
          >
            <Menu
              title="Select Chain"
              list={chains
              }
              iconList={chainLogos}
              currentValue={currentSourceChain}
              optionSelectHandler={selectCurrentSourceChainHandler}
              peerValue={currentDestinationChain}
              close={closeShowSourceChainMenu}
              textColor={textColor}
              backgroundColor={backgroundColor}
            />
          </MenuWrapper>

          <MenuWrapper
            open={showDestinationChainMenu}
            onClose={closeShowDestinationChainMenu}
          >
            <Menu
              title="Select Chain"
              list={chains}
              iconList={chainLogos}
              currentValue={currentDestinationChain}
              optionSelectHandler={selectCurrentDestinationChainHandler}
              peerValue={currentSourceChain}
              close={closeShowDestinationChainMenu}
              textColor={textColor}
              backgroundColor={backgroundColor}
            />
          </MenuWrapper>

          <MenuWrapper
            open={showSourceAssetMenu}
            onClose={closeShowSourceAssetMenu}
          >
            <SearchMenu
              chain={currentSourceChain}
              list={assetList[currentSourceChain.networkId]}
              iconList={assetLogos}
              title="Select Asset"
              currentValue={currentSourceAsset}
              optionSelectHandler={selectCurrentSourceAssetHandler}
              chainSelectHandler={selectCurrentSourceChainHandler}
              peerValue={
                currentSourceChain.networkId ===
                  currentDestinationChain.networkId
                  ? currentDestinationAsset
                  : ""
              }
              close={closeShowSourceAssetMenu}
              balanceList={sourceTokensBalanceList}
              isSource={true}
              tokenListByUrl={tokenListByUrl}
              accountAddress={currentAccountAddress}
              activeListUrl={activeListUrl}
              setActiveListUrl={setActiveListUrl}
              currentNetwork={currentNetwork}
              isWalletConnected={isWalletConnected}
              ctaColor={ctaColor}
              textColor={textColor}
              backgroundColor={backgroundColor}
            />
          </MenuWrapper>

          <MenuWrapper
            open={showDestinationAssetMenu}
            onClose={closeShowDestinationAssetMenu}
          >
            <SearchMenu
              chain={currentDestinationChain}
              list={assetList[currentDestinationChain.networkId]}
              iconList={assetLogos}
              title="Select Asset"
              currentValue={currentDestinationAsset}
              optionSelectHandler={selectCurrentDestinationAssetHandler}
              chainSelectHandler={selectCurrentDestinationChainHandler}
              peerValue={currentSourceAsset}
              close={closeShowDestinationAssetMenu}
              balanceList={destinationTokensBalanceList}
              isSource={false}
              tokenListByUrl={tokenListByUrl}
              accountAddress={currentAccountAddress}
              activeListUrl={activeListUrl}
              setActiveListUrl={setActiveListUrl}
              currentNetwork={currentNetwork}
              isWalletConnected={isWalletConnected}
              ctaColor={ctaColor}
              textColor={textColor}
              backgroundColor={backgroundColor}
            />
          </MenuWrapper>

          <MenuWrapper open={showFeeMenu} onClose={() => setShowFeeMenu(false)}>
            <FeeMenu
              list={feeTokenList}
              iconList={assetLogos}
              title="Select Fee Asset"
              currentValue={feeAsset}
              optionSelectHandler={selectFeeAsset}
              feePriceFeed={feePriceFeed}
              balanceList={sourceTokensBalanceList}
              close={() => setShowFeeMenu(false)}
              textColor={textColor}
              backgroundColor={backgroundColor}
            />
          </MenuWrapper>

          <MenuWrapper open={showWaitingCard} onClose={closeShowWaitingCard}>
            <WaitingCard
              close={closeShowWaitingCard}
              sourceInput={sourceInput ?? ""}
              sourceSymbol={currentSourceAsset && currentSourceAsset.symbol}
              destinationInput={destinationInput ?? ""}
              destinationSymbol={
                currentDestinationAsset && currentDestinationAsset.symbol
              }
              ctaColor={ctaColor}
              textColor={textColor}
              backgroundColor={backgroundColor}
            />
          </MenuWrapper>
          <MenuWrapper
            open={showTransactionSuccessful}
            onClose={closeShowTransactionSuccessful}
          >
            <SwapConfirmationCard
              close={closeShowTransactionSuccessful}
              asset={currentDestinationAsset}
              explorer={txExplorer}
              showSettelementToken={showSettelementToken}
              finalReceivedAmount={finalReceivedAmount}
              isCrossChain={
                currentSourceChain.networkId !==
                currentDestinationChain.networkId
              }
              ctaColor={ctaColor}
              textColor={textColor}
              backgroundColor={backgroundColor}
            />
          </MenuWrapper>

          <MenuWrapper
            open={showRAssetWarning}
            onClose={handleWrappedAssetWarningClose}
          >
            <WrappedAssetWarning
              dstAsset={
                currentDestinationAsset && currentDestinationAsset.symbol
              }
              dstChain={currentDestinationChain.name.split(" ")[0]}
              wrappedAsset={wrappedAsset}
              action={handleWrappedAssetWarning}
              close={handleWrappedAssetWarningClose}
              ctaColor={ctaColor}
              textColor={textColor}
              backgroundColor={backgroundColor}
            />
          </MenuWrapper>

          <MenuWrapper
            open={showPriceImpactWarning}
            onClose={handlePriceImpactWarningClose}
          >
            <PriceImpactWarning
              priceImpact={
                parseFloat(srcPriceImpact) >= parseFloat(dstPriceImpact)
                  ? srcPriceImpact
                  : dstPriceImpact
              }
              action={() => setShowPriceImpactWarning(false)}
              close={handlePriceImpactWarningClose}
              ctaColor={ctaColor}
              textColor={textColor}
              backgroundColor={backgroundColor}
            />
          </MenuWrapper>

          <MenuWrapper
            open={showApprovalWindow}
            onClose={() => setShowApprovalWindow(false)}
          >
            <ApprovalWindow
              shouldSourceApprove={shouldSourceApprove}
              shouldFeeApprove={shouldFeeApprove}
              sourceMaxToggle={sourceInfiniteApproval}
              feeMaxToggle={feeInfiniteApproval}
              setSourceMaxToggle={setSourceInfiniteApproval}
              sourceLoading={sourceApprovalLoading}
              feeLoading={feeApprovalLoading}
              setFeeMaxToggle={setFeeInfiniteApproval}
              sourceSymbol={currentSourceAsset ? currentSourceAsset.symbol : ""}
              feeSymbol={feeAsset.symbol}
              isCrossChain={
                currentSourceChain.networkId !==
                currentDestinationChain.networkId
              }
              sourceApproveHandler={sourceTokenApproval}
              feeApproveHandler={feeTokenApproval}
              close={() => setShowApprovalWindow(false)}
              ctaColor={ctaColor}
              textColor={textColor}
              backgroundColor={backgroundColor}
            />
          </MenuWrapper>

          <MenuWrapper
            open={showConfirmOrderWindow}
            onClose={() => setShowConfirmOrderWindow(false)}
          >
            <ConfirmOrderWindow
              inputAmount={sourceInput}
              outputAmount={destinationInput}
              sourceAsset={currentSourceAsset}
              destAsset={currentDestinationAsset}
              sourceChain={currentSourceChain}
              destChain={currentDestinationChain}
              minReturn={
                amountToBeReceived
                  ? formatDecimals(
                    amountToBeReceived,
                    currentDestinationAsset &&
                    currentDestinationAsset.decimals
                  )
                  : ""
              }
              feeTokenSymbol={feeAsset.symbol}
              bridgeFee={
                bridgeFee !== "-" &&
                formatDecimals(bridgeFee?.toString(), feeAsset.decimals)
              }
              isCrossChain={
                currentSourceChain.networkId !==
                currentDestinationChain.networkId
              }
              close={() => setShowConfirmOrderWindow(false)}
              action={handleSwap}
              ctaColor={ctaColor}
              textColor={textColor}
              backgroundColor={backgroundColor}
            />
          </MenuWrapper>

          <SendBodyWrapper>
            <CardsWrapper error={alertOpen}>
              <SettingsWrapper
                onClick={() => setShowAdvancedSettings((x) => !x)}
              >
                <StyledSettings />
              </SettingsWrapper>
              {showAdvancedSettings && (
                <ClickAwayListener
                  onClickAway={() => setShowAdvancedSettings(false)}
                >
                  <AdvancedWrapper>
                    <AdvancedTransactionSettings
                      close={() => setShowAdvancedSettings(false)}
                      setTabValue={setTabValue}
                      expertModeToggle={expertModeToggle}
                      setExpertModeToggle={setExpertModeToggle}
                      slippageTolerance={slippageTolerance}
                      setSlippageTolerance={setSlippageTolerance}
                      textColor={textColor}
                      backgroundColor={backgroundColor}
                    />
                  </AdvancedWrapper>
                </ClickAwayListener>
              )}
              <CardWrapper>
                <SwapCard
                  currentChain={currentSourceChain}
                  currentAsset={currentSourceAsset}
                  tokenBalance={currentSourceBalance}
                  usdBalance={sourceUsdBalance}
                  showChainMenu={sourceChainMenuHandler}
                  showAssetMenu={sourceAssetMenuHandler}
                  inputValue={sourceInput}
                  inputHandler={sourceInputHandler}
                  label="From Send"
                  id="send-source-token"
                  fetching={false}
                  maxButton={clickMaxButton}
                  locked={animationState === "animate"}
                  openFeeMenu={openFeeMenu}
                  currentRecipientAddress={currentRecipientAddress}
                  setCurrentRecipientAddress={setCurrentRecipientAddress}
                  isWalletConnected={isWalletConnected}
                  tabValue={tabValue}
                  setTabValue={setTabValue}
                  accountAddress={currentAccountAddress}
                  sourceChain={currentSourceChain}
                  destinationChain={currentDestinationChain}
                  feeAsset={feeAsset}
                  expertModeToggle={expertModeToggle}
                  ctaColor={ctaColor}
                  backgroundColor={backgroundColor}
                  textColor={textColor}
                />
              </CardWrapper>
              <ReverseIcon
                onClick={interchangeHandler}
                textColor={textColor}
              />
              <CardWrapper>
                <SwapCard
                  currentChain={currentDestinationChain}
                  currentAsset={currentDestinationAsset}
                  tokenBalance={currentDestinationBalance}
                  usdBalance={destinationUsdBalance}
                  showChainMenu={destinationChainMenuHandler}
                  showAssetMenu={destinationAssetMenuHandler}
                  inputValue={destinationInput}
                  inputHandler={destinationInputHandler}
                  label="To Send"
                  id="send-destination-token"
                  fetching={pathFetching}
                  maxButton={clickMaxButton}
                  locked={animationState === "animate"}
                  openFeeMenu={openFeeMenu}
                  currentRecipientAddress={currentRecipientAddress}
                  setCurrentRecipientAddress={setCurrentRecipientAddress}
                  isWalletConnected={isWalletConnected}
                  tabValue={tabValue}
                  setTabValue={setTabValue}
                  accountAddress={currentAccountAddress}
                  sourceChain={currentSourceChain}
                  destinationChain={currentDestinationChain}
                  feeAsset={feeAsset}
                  expertModeToggle={expertModeToggle}
                  ctaColor={ctaColor}
                  backgroundColor={backgroundColor}
                  textColor={textColor}
                />
              </CardWrapper>

              <SwapButtonWrapperMobile>
                <SwapButton
                  clicked={swapClickHandler}
                  isDisabled={isSwapDisabled}
                  locked={animationState === "animate"}
                  icon={swapButtonIcon}
                  title="Swap"
                  ctaColor={ctaColor}
                  textColor={textColor}
                />
              </SwapButtonWrapperMobile>
              {upToSmall && alertOpen && (
                <ErrorBoxWrapper active={alertOpen}>
                  <ErrorBoxMessage message={alertMessage} />
                </ErrorBoxWrapper>
              )}
              {
                <ExchangeRateWrapperMobile>
                  <ExchangeRate>
                    {currentSourceChain.networkId !==
                      currentDestinationChain.networkId && (
                        <SwapData>{`Bridge Fee: ${bridgeFee === "-"
                          ? "-"
                          : fixedDecimalPlace(
                            formatDecimals(bridgeFee, feeAsset.decimals),
                            4
                          )
                          }  ${feeAsset.symbol} = ${feePriceFeed &&
                            feePriceFeed[feeAsset.symbol] &&
                            bridgeFee !== "-"
                            ? "$" + feePriceFeed[feeAsset.symbol]?.feeUsd
                            : "$-"
                          }`}</SwapData>
                      )}
                    {currentSourceChain.networkId ===
                      currentDestinationChain.networkId ? (
                      <SwapData>
                        Price Impact: {getPriceImpactString(srcPriceImpact)}%
                      </SwapData>
                    ) : (
                      <>
                        <SwapData>
                          Source Price Impact:{" "}
                          {getPriceImpactString(srcPriceImpact)}%
                        </SwapData>
                        <SwapData>
                          Destination Price Impact:{" "}
                          {getPriceImpactString(dstPriceImpact)}%
                        </SwapData>
                      </>
                    )}
                    <SwapData>
                      Minimum Received: ${getMinimumReceivedString()}
                    </SwapData>
                  </ExchangeRate>
                </ExchangeRateWrapperMobile>
              }
            </CardsWrapper>
          </SendBodyWrapper>
          <SwapButtonWrapper>
            <SwapButton
              clicked={swapClickHandler}
              isDisabled={isSwapDisabled}
              locked={animationState === "animate"}
              icon={swapButtonIcon}
              title="Swap"
              ctaColor={ctaColor}
              textColor={textColor}
            />
          </SwapButtonWrapper>

          {!upToSmall && (
            <ErrorBoxWrapper active={alertOpen}>
              <ErrorBoxMessage message={alertMessage} />
            </ErrorBoxWrapper>
          )}
          <ExchangeRateWrapper>
            <ExchangeRate>
              <SwapData>
                {currentSourceChain.networkId !==
                  currentDestinationChain.networkId &&
                  `Bridge Fee: ${bridgeFee === "-"
                    ? "-"
                    : fixedDecimalPlace(
                      formatDecimals(bridgeFee, feeAsset.decimals),
                      4
                    )
                  } ${feeAsset.symbol}${feePriceFeed &&
                    feePriceFeed[feeAsset.symbol] &&
                    bridgeFee !== "-"
                    ? " = $" + feePriceFeed[feeAsset.symbol]?.feeUsd
                    : " = $-"
                  }`}
                {/* <HoverIcon1 src={informationIcon} />
                              <EstimatedFeeBreakDownWrapper>
                                  <HoverCard active={true}>
                                      <EstimatedFeeBreakDown>
                                          <HoverField>
                                              <span>
                                                  Network Fee:
                                              </span>
                                              <span>
                                                  ${estimatedFee[2]}
                                              </span>
                                          </HoverField>
                                          <HoverField>
                                              <span>
                                                  
                                              </span>
                                              <span>
                                                  ${estimatedFee[1]}
                                              </span>
                                          </HoverField>
                                          <StyledDivider></StyledDivider>
                                          <HoverField>
                                              <span>
                                                  Total Fee:
                                              </span>
                                              <span>
                                                  ${estimatedFee[0]}
                                              </span>
                                          </HoverField>
                                      </EstimatedFeeBreakDown>
                                  </HoverCard>
                              </EstimatedFeeBreakDownWrapper> */}
              </SwapData>
              {currentSourceChain.networkId ===
                currentDestinationChain.networkId ? (
                <SwapData>
                  Price Impact:&nbsp;
                  <ErrorText
                    severity={
                      srcPriceImpact === "-"
                        ? 1
                        : warningSeverity(srcPriceImpact)
                    }
                  >
                    {getPriceImpactString(srcPriceImpact)}%
                  </ErrorText>
                </SwapData>
              ) : (
                <>
                  <SwapData>
                    Price Impact:&nbsp;
                    <ErrorText
                      severity={
                        getTotalPriceImpact() === "-"
                          ? 1
                          : warningSeverity(getTotalPriceImpact())
                      }
                    >
                      {getPriceImpactString(getTotalPriceImpact())}%
                    </ErrorText>
                    <HoverIcon2 src={informationIcon} />
                    <PriceImpactBreakdownWrapper>
                      <HoverCard active={true}>
                        <PriceImpactBreakdown>
                          <HoverField>
                            <span>Source:</span>
                            <span>{getPriceImpactString(srcPriceImpact)}%</span>
                          </HoverField>
                          <HoverField>
                            <span>Dest:</span>
                            <span>{getPriceImpactString(dstPriceImpact)}%</span>
                          </HoverField>
                        </PriceImpactBreakdown>
                      </HoverCard>
                    </PriceImpactBreakdownWrapper>
                  </SwapData>
                </>
              )}
              <SwapData>
                Minimum Received: {getMinimumReceivedString()}
              </SwapData>
            </ExchangeRate>
          </ExchangeRateWrapper>

          {animationState !== "initial" &&
            (currentSourceChain.networkId !==
              currentDestinationChain.networkId ? (
              <SwapVisual
                animationState={animationState}
                animationType={animationType}
                sourceChain={currentSourceChain}
                destinationChain={currentDestinationChain}
                sourceAsset={currentSourceAsset}
                destinationAsset={currentDestinationAsset}
                explorer={txExplorer}
                srcTxExplorer={srcTxExplorer}
              />
            ) : (
              <SwapVisualSameChain
                animationState={animationState}
                animationType={animationType}
                sourceChain={currentSourceChain}
                destinationChain={currentDestinationChain}
                sourceAsset={currentSourceAsset}
                destinationAsset={currentDestinationAsset}
                path={pathString}
                explorer={txExplorer}
              />
            ))}
          <div ref={elRef}>
            <SwapVisualMobile
              animationState={animationState}
              sourceAsset={currentSourceAsset}
              destinationAsset={currentDestinationAsset}
              sourceChain={currentSourceChain}
              destinationChain={currentDestinationChain}
            />
          </div>
        </SwapWrapper>
      </Wrapper>
    </>
  );
};

export default Swap;
