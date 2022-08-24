import React, { useEffect, useState, useCallback, Dispatch } from "react";
import styled from "styled-components";
import { AssetType, chainLogos, DEFAULT_ROUTE_TOKEN_LIST, remoteAssetList, TokenListType } from "../../config/asset";
import _ from "lodash";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import { ethers } from "ethers";
import { getTokenDetails } from "../../config/contractFunction";
import SearchIcon from "@material-ui/icons/Search";
import { chains, NetworkType } from "../../config/network";
import { Button } from "@material-ui/core";
import { getChainNameById } from "../../utils";
import MenuWrapper from "../Menu/MenuWrapper";
import AddTokenWarning from "./AddTokenWarning";
import { explorerAddressLinks } from "../../config/flag";
import SpinnerSmall from "../Loaders/SpinnerSmall";
import { LaunchOutlined } from "@material-ui/icons";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Switch from "@material-ui/core/Switch";
import ControlPointOutlinedIcon from "@material-ui/icons/ControlPointOutlined";
import { addTokenToMetamask } from "../../utils/metamaskFunctions";
import SettingsIcon from "@material-ui/icons/Settings";
// import { useLocation } from "react-router";
import { CoinType } from "../../state/swap/hooks";

interface Props {
  title: string;
  list: AssetType[];
  currentValue: AssetType | "";
  peerValue: AssetType | "";
  optionSelectHandler: (newAsset: AssetType) => void;
  iconList: { [x: string]: string };
  close: () => void;
  chain: NetworkType;
  balanceList: CoinType;
  chainSelectHandler: (chain: NetworkType) => void;
  isSource: boolean;
  tokenListByUrl: {
    [key: string]: TokenListType;
  } | null;
  currentNetwork: "" | NetworkType;
  activeListUrl: string[];
  setActiveListUrl: Dispatch<React.SetStateAction<string[]>>
  accountAddress: string;
  isWalletConnected: boolean;
  ctaColor: string;
  textColor: string;
  backgroundColor: string;
  srcChains: string;
  dstChains: string;
  srcTokens: string;
  dstTokens: string;
}

const Wrapper = styled.div<{ backgroundColor: string; textColor: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 457px;
  min-height: 469px;
  height: 100%;
  border-radius: 1.5rem;
  color: ${({ textColor }) => textColor !== "" ? textColor : "#FFFFFF"};
  background: ${({ backgroundColor }) => backgroundColor !== "" ? backgroundColor : "#1A1B1C"};
  backdrop-filter: blur(32px);

  border-radius: 1.5rem;
  font-family: "Inter", sans-serif;

  @media only screen and (max-width: 750px){
    width: 90vw;
		max-width: 457px;
	  height: 100%;
  }
`;

const ItemListWrapper = styled.div<{
  backgroundColor: string;
  textColor: string;
}>`
  display: flex;
  flex-direction: column;
  width: 98%;
  height: 21.7rem;
  border-radius: 0px 0px 1.5rem 0rem;
  color: ${({ textColor }) => textColor !== "" ? textColor : "#FFFFFF"};
  background: ${({ backgroundColor }) => backgroundColor !== "" ? backgroundColor : "#1A1B1C"};
  backdrop-filter: blur(32px);

  overflow-x: hidden;
  overflow-y: scroll;
  font-family: "Inter", sans-serif;
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: #A3A4A470;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #A3A4A4;
  }

  @media only screen and (max-width: 750px){
    max-width: 25rem;
		width: 80vw;
  }
`;

const ItemWrapper = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem 0px;
  cursor: pointer;
  margin: 0 10px;
`;

const SearchTokenWrapper = styled.div<{ backgroundColor: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-width: 0.0625rem;
  border-style: solid;
  background-color: ${({ backgroundColor }) => backgroundColor !== "" ? backgroundColor : "#1C1C2875"};
  border-color: transparent transparent rgb(225, 225, 225, 0.2);
`;
const FoundToken = styled.div`
  display: flex;
  align-items: center;
`;

const Name = styled.div`
  font-size: 1rem;
`;
const Balance = styled.div`
  font-size: 1rem;
  justify-self: flex-end;
  margin-left: auto;
`;

// const LogoWrapper = styled.div`
// 	width: 2.5rem;
// 	height: 2.5rem;
// 	margin-right: 2rem;
// 	background-color: #ffffff;
// 	display: flex;
// 	align-items: center;
// 	justify-content: center;
// 	border-radius: 50%;
// `;

const Image = styled.img`
  width: 25px;
  margin-right: 10px;
`;

const Title = styled.p`
  font-size: 1.2rem;
  text-align: center;
`;

const StyledCloseIcon = styled(CloseRoundedIcon) <{ textColor: string; }>`
  position: absolute;
  color: ${({ textColor }) => textColor !== "" ? textColor : "#FFFFFF"};
  right: 13px;
  top: 15px;
  width: 1.7rem !important;
  cursor: pointer;
  height: 1.7rem !important;
`;
const StyledBackButton = styled(ArrowBackIcon)`
  position: absolute;
  color: white;
  left: 15px;
  top: 15px;
  width: 1.7rem !important;
  cursor: pointer;
  height: 1.7rem !important;
`;

const StyledInputWrapper = styled.div<{ backgroundColor: string }>`
  width: 421px;
  height: 40px;
  background: ${({ backgroundColor }) => backgroundColor !== "" ? backgroundColor : "linear-gradient(93.89deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%);"};
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 4px;
  padding-left: 10px;
  margin-bottom: 20px;
  border: 1px solid ${({ backgroundColor }) => backgroundColor !== "" ? "rgba(255, 255, 255, 0.05)" : "rgba(88, 88, 99, 0.24)"};;

  @media only screen and (max-width: 750px){
    width: 95%;   
  }
`;

const StyledInput = styled.input<{ textColor: string }>`
  width: 100%;
  color: ${({ textColor }) => textColor !== "" ? textColor : "#FFFFFF"};
  background: none;
  border: none;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 400;
  &:focus {
    outline: none;
  }
`;
const AddButton = styled(Button) <{ ctaColor: string }>`
  &&& {
    background: ${({ ctaColor }) => ctaColor !== "" ? ctaColor : "#2172E5"};
    color: #FFFFFF;
    font-family: "Inter", sans-serif;
    font-size: 1rem;
    width: fit-content;
    height: 35px;
    text-transform: none;
    padding: 0;
    padding-left: 2px;
    padding-right: 2px;
    border-radius: 10px;
    box-shadow: none;
    font-weight: 400;
  }
`;
const StyledLaunchOutlined = styled(LaunchOutlined)`
  &&& {
    margin-left: 0.5rem;
    font-size: 1rem;
    :hover {
      filter: brightness(1.75);
      color: #2172E5;
    }
  }
`;
const TokenListWrapper = styled.div<{ backgroundColor: string }>`
  width: 90%;
  border-radius: 15px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  margin: 10px 0;
  background: ${({ backgroundColor }) => backgroundColor !== "" ? backgroundColor : "linear-gradient(93.89deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%);"};
  padding: 30px 20px;
`;

const TokenListLogo = styled.img`
  width: 40px;
  height: 40px;
`;

const TokenListDetails = styled.div`
  display: grid;
  padding: 2px 0;
  margin: 0 15px;
  width: 255px;
`;

const TokenListToggleWrapper = styled.div``;

const ChainListWrapper = styled.div<{ backgroundColor: string }>`
  width: 70px;
  height: 21.7rem;
  background: ${({ backgroundColor }) => backgroundColor !== "" ? backgroundColor : "linear-gradient(93.89deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%);"};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0px 8px 8px 8px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 3px;
    border-radius: 5px;
  }
  ::-webkit-scrollbar-track {
    background: ${({ backgroundColor }) => backgroundColor !== "" ? "rgba(255, 255, 255, 0.10)" : "#A3A4A440"};
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${({ backgroundColor }) => backgroundColor !== "" ? "rgba(255, 255, 255, 0.10)" : "#A3A4A4"};
  }
`;

const ChainWrapper = styled.div<{ active: boolean }>`
  display: grid;
  place-items: center;
  color: #FFFFFF80; //ChangeColor
  font-size: 9px;
  row-gap: 4px;
  margin: 7px 0;
  cursor: pointer;
`;

const ChainLogoWrapper = styled.div<{ active: boolean }>`
  width: 45px;
  height: 45px;
  background: rgba(138, 138, 155, 0.24);
  border-radius: 8px;
  display: grid;
  place-items: center;
  border: 1px solid
    ${({ active }) => (active ? "#00A0BE" : "transparent")};
`;

const ChainLogo = styled.img`
  width: 26px;
`;

const ChainAssetWrapper = styled.div`
  display: flex;
  width: 100%;
  border-radius: 0px 0px 1.5rem 1.5rem;
`;

const StyledAddIcon = styled(ControlPointOutlinedIcon)`
  &&& {
    color: #00A0BE; //ChangeColor
    width: 16px;
    margin: 0 7px;
  }
`;

// const ManageButton = styled.div`
// 	cursor: pointer;
// 	height: 45px;
// 	width: 100%;
// 	display: grid;
// 	place-items: center;
// 	font-size: 16px;
// 	color: ${({ theme }) => theme.blue2};
// 	background: ${({ theme }) => theme.bg6};
// 	border-radius: 0px 0px 1.5rem 1.5rem;
// 	margin-top: 10px;
// `
const TokenListArrayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 20px;
  max-height: 391px;
  overflow-y: scroll;
`;
const StyledCircularProgressWrapper = styled.div`
  padding-top: 20px;
  margin: 0 auto;
  display: grid;
  place-items: center;
`;

const StyledSettings = styled(SettingsIcon)`
  &&& {
    position: absolute;
    color: white;
    left: 15px;
    top: 18px;
    width: 1.4rem !important;
    cursor: pointer;
    height: 1.4rem !important;
  }
`;

const SearchMenu = ({
  list,
  title,
  currentValue,
  optionSelectHandler,
  iconList,
  peerValue,
  close,
  chain,
  balanceList,
  chainSelectHandler,
  isSource,
  currentNetwork,
  setActiveListUrl,
  activeListUrl,
  accountAddress,
  tokenListByUrl,
  isWalletConnected,
  backgroundColor,
  textColor,
  ctaColor,
  srcChains, 
  dstChains, 
  srcTokens, 
  dstTokens
}: Props) => {
  const [showManageTab, setShowManageTab] = useState(false);

  const urlSrcChains = srcChains?.split(",");
  const urlDstChains = dstChains?.split(",");
  const urlSrcTokens =  srcTokens
      ?.split(",")
      ?.map((token) => token.toLowerCase());

  const urlDstTokens = dstTokens
      ?.split(",")
      ?.map((token) => token.toLowerCase());

  let anyToken: any = null;
  let anyTokenList =
    anyToken && anyToken[accountAddress]
      ? anyToken[accountAddress][chain.networkId]
      : [];
  let tokenListRemote: AssetType[] = [];
  tokenListByUrl &&
    activeListUrl.map((url) => {
      tokenListByUrl[url]?.tokens?.map((token) => {
        let newToken = { ...token };
        if (
          token.chainId.toString() === chain.networkId &&
          list.find(
            (asset) =>
              asset.address.toLowerCase() === token.address.toLowerCase()
          ) === undefined &&
          tokenListRemote.find(
            (asset) =>
              asset.address.toLowerCase() === token.address.toLowerCase()
          ) === undefined
        ) {
          if (DEFAULT_ROUTE_TOKEN_LIST !== url) {
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
          }
          tokenListRemote.push(newToken);
        }
      });
    });
  let allTokens = anyTokenList
    ? [...list, ...tokenListRemote, ...anyTokenList]
    : [...list, ...tokenListRemote];
  allTokens =
    (srcTokens === "" && dstTokens === "")
      ? allTokens
      : isSource
      ? allTokens.filter((token) =>
          urlSrcTokens
            ? urlSrcTokens.includes(token.address.toLowerCase())
            : true
        )
      : allTokens.filter((token) =>
          urlDstTokens
            ? urlDstTokens.includes(token.address.toLowerCase())
            : true
  );
  const sortTokenList = useCallback(
    (list: AssetType[]) =>
      list.sort(
        (a, b) =>
          parseFloat(balanceList[b.symbol]) -
          parseFloat(balanceList[a.symbol]) || a.name.localeCompare(b.name)
      ),
    [balanceList]
  );
  allTokens = sortTokenList(allTokens);
  let [filteredList, setFilteredList] = useState(allTokens);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedToken, setSearchedToken] = useState<
    AssetType | null | undefined
  >(null);
  const [showConfirmMenu, setShowConfirmMenu] = useState(false);
  // const [isWalletConnected] = useWalletConnected();

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    if (searchTerm === "") {
      setFilteredList(allTokens);
      return;
    }
    const filterResult = allTokens?.filter((item: any) =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredList(filterResult);

    if (ethers.utils.isAddress(searchTerm)) {
      const filterResult = allTokens?.filter(
        (item: any) => item.address.toLowerCase() === searchTerm.toLowerCase()
      );
      setFilteredList(filterResult);

      if (filterResult.length === 0) {
        const tokenDetails = await getTokenDetails({
          tokenAddress: searchTerm,
          provider: new ethers.providers.JsonRpcProvider(chain.endpoint),
          networkId: chain.networkId,
        });
        if (tokenDetails) {
          setSearchedToken({
            name: tokenDetails[0],
            symbol: tokenDetails[1],
            decimals: tokenDetails[2],
            address: searchTerm,
            logoURI: "",
            lpSymbol: "",
            lpAddress: "",
            stakingRewards: "",
            resourceId: "",
            lpResourceId: "",
            chainId: chain.networkId,
            mappedOnBridge: false,
            native: false,
            isLpToken: false,
            hasLpToken: false,
            stableAsset: false,
            mining: false,
            activeMining: false,
            enableLiquidityMining: false,
          });
        } else {
          setSearchedToken(undefined);
        }
      }
    }
  };

  const handleWarningConfirm = () => {
    searchedToken && optionSelectHandler(searchedToken);
    if (anyToken) {
      if (anyToken[accountAddress]) {
        if (anyToken[accountAddress][chain.networkId]) {
          if (anyToken[accountAddress][chain.networkId]?.length > 0) {
            anyToken[accountAddress][chain.networkId].push(searchedToken);
          } else {
            anyToken[accountAddress][chain.networkId] = [searchedToken];
          }
        } else {
          anyToken[accountAddress][chain.networkId] = [searchedToken];
        }
      } else {
        anyToken[accountAddress] = {
          [chain.networkId]: [searchedToken],
        };
      }
    } else {
      anyToken = {
        [accountAddress]: {
          [chain.networkId]: [searchedToken],
        },
      };
    }
    setSearchTerm("");
    setSearchedToken(null);
  };

  const handleTokenListToggle = (url: string) => {
    if (activeListUrl.includes(url)) {
      let foundIndex = activeListUrl.findIndex(
        (tokenListUrl) => tokenListUrl === url
      );
      let newList = [...activeListUrl];
      newList.splice(foundIndex, 1);
      setActiveListUrl(newList);
    } else {
      let newList = [...activeListUrl, url];
      setActiveListUrl(newList);
    }
  };

  useEffect(() => {
    searchTerm !== null && setSearchedToken(null);
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    anyToken = null;
    anyTokenList =
      anyToken && anyToken[accountAddress]
        ? anyToken[accountAddress][chain.networkId]
        : [];
    allTokens = anyTokenList
      ? [...list, ...tokenListRemote, ...anyTokenList]
      : [...list, ...tokenListRemote];
    let filterResult = allTokens?.filter((item: any) =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    srcTokens !== "" && dstTokens !== "" &&
      (isSource
        ? (filterResult = filterResult.filter((token) =>
          urlSrcTokens
            ? urlSrcTokens.includes(token.address.toLowerCase())
            : true
        ))
        : (filterResult = filterResult.filter((token) =>
          urlDstTokens
            ? urlDstTokens.includes(token.address.toLowerCase())
            : true
        )));
    setFilteredList(sortTokenList(filterResult));
  }, [accountAddress]);

  useEffect(() => {
    tokenListRemote = [];
    tokenListByUrl &&
      activeListUrl.map((url) => {
        tokenListByUrl[url]?.tokens?.map((token) => {
          let newToken = { ...token };
          if (
            token.chainId.toString() === chain.networkId &&
            list.find(
              (asset) =>
                asset.address.toLowerCase() === token.address.toLowerCase()
            ) === undefined &&
            tokenListRemote.find(
              (asset) =>
                asset.address.toLowerCase() === token.address.toLowerCase()
            ) === undefined
          ) {
            if (DEFAULT_ROUTE_TOKEN_LIST !== url) {
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
            }
            tokenListRemote.push(newToken);
          }
        });
      });
    allTokens = anyTokenList
      ? [...list, ...tokenListRemote, ...anyTokenList]
      : [...list, ...tokenListRemote];
    let filterResult = allTokens?.filter((item: any) =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    srcTokens !== "" && dstTokens !== "" &&
      (isSource
        ? (filterResult = filterResult.filter((token) =>
          urlSrcTokens
            ? urlSrcTokens.includes(token.address.toLowerCase())
            : true
        ))
        : (filterResult = filterResult.filter((token) =>
          urlDstTokens
            ? urlDstTokens.includes(token.address.toLowerCase())
            : true
        )));
    setFilteredList(sortTokenList(filterResult));
  }, [chain, activeListUrl]);

  useEffect(() => {
    let filterResult = [...filteredList];
    srcTokens !== "" && dstTokens !== "" &&
      (isSource
        ? (filterResult = filterResult.filter((token) =>
          urlSrcTokens
            ? urlSrcTokens.includes(token.address.toLowerCase())
            : true
        ))
        : (filterResult = filterResult.filter((token) =>
          urlDstTokens
            ? urlDstTokens.includes(token.address.toLowerCase())
            : true
    )));
    setFilteredList(sortTokenList(filterResult));
    setFilteredList(sortTokenList(filterResult));
  }, [balanceList]);

  return (
    <>
      <MenuWrapper
        open={showConfirmMenu}
        onClose={() => setShowConfirmMenu(false)}
      >
        <AddTokenWarning
          name={searchedToken ? searchedToken.name : ""}
          address={searchedToken ? searchedToken.address : ""}
          explorerLink={
            explorerAddressLinks[chain.networkId.toString()].concat(
              searchedToken ? searchedToken?.address : ""
            ) ?? ""
          }
          close={() => setShowConfirmMenu(false)}
          handleImport={handleWarningConfirm}
        />
      </MenuWrapper>
      {!showManageTab ? (
        <Wrapper backgroundColor={backgroundColor} textColor={textColor}>
          <StyledCloseIcon
            onClick={close}
            textColor={textColor}
          />
          <StyledSettings onClick={() => setShowManageTab(true)} />
          <Title>{title}</Title>
          <StyledInputWrapper
            backgroundColor={backgroundColor}
          >
            <SearchIcon
              style={{ width: "18px", height: "18px", color: "#585863" }}
            />
            <StyledInput
              type="text"
              placeholder="Search name or paste address"
              value={searchTerm}
              onChange={handleChange}
              autoComplete="off"
              textColor={textColor}
            />
          </StyledInputWrapper>
          <ChainAssetWrapper>
            <ChainListWrapper backgroundColor={backgroundColor}>
              {(srcChains !== "" && dstChains !== "")
                ? chains
                  .filter((chain) =>
                    isSource
                      ? urlSrcChains
                        ? urlSrcChains.includes(chain.networkId)
                        : true
                      : urlDstChains
                        ? urlDstChains.includes(chain.networkId)
                        : true
                  )
                  .map((thisChain) => (
                    <ChainWrapper
                      active={thisChain.networkId === chain.networkId}
                      onClick={() => {
                        setFilteredList([]);
                        chainSelectHandler(thisChain);
                      }}
                    >
                      <ChainLogoWrapper
                        active={thisChain.networkId === chain.networkId}
                      >
                        <ChainLogo src={chainLogos[thisChain.networkId]} />
                      </ChainLogoWrapper>
                      <span>{thisChain.name.split(" ")[0]}</span>
                    </ChainWrapper>
                  ))
                : chains.map((thisChain, index) => (
                <ChainWrapper
                  key={index}
                  active={thisChain.networkId === chain.networkId}
                  onClick={() => {
                    setFilteredList([]);
                    chainSelectHandler(thisChain);
                  }}
                >
                  <ChainLogoWrapper
                    active={thisChain.networkId === chain.networkId}
                  >
                    <ChainLogo src={chainLogos[thisChain.networkId]} />
                  </ChainLogoWrapper>
                  <span>{thisChain.name.split(" ")[0]}</span>
                </ChainWrapper>
              ))}
            </ChainListWrapper>
            <ItemListWrapper backgroundColor={backgroundColor} textColor={textColor} >
              {filteredList.length === 0 &&
                !ethers.utils.isAddress(searchTerm) &&
                searchTerm !== "" ? (
                <StyledCircularProgressWrapper>
                  <span
                    style={{
                      marginTop: "5px",
                      color: "#FFFFFF55",
                      fontSize: "16px",
                    }}
                  >
                    Not Found!
                  </span>
                </StyledCircularProgressWrapper>
              ) : filteredList.length === 0 &&
                ethers.utils.isAddress(searchTerm) &&
                searchedToken === undefined ? (
                <StyledCircularProgressWrapper>
                  <span
                    style={{
                      marginTop: "5px",
                      color: "#FFFFFF55",
                      fontSize: "16px",
                    }}
                  >
                    Not Found!
                  </span>
                </StyledCircularProgressWrapper>
              ) : filteredList.length === 0 && searchedToken === null ? (
                <StyledCircularProgressWrapper>
                  <span
                    style={{
                      marginTop: "5px",
                      color: "#FFFFFF55",
                      fontSize: "16px",
                    }}
                  >
                    Loading...
                  </span>
                </StyledCircularProgressWrapper>
              ) : filteredList.length === 0 &&
                searchedToken !== null &&
                searchedToken !== undefined ? (
                <SearchTokenWrapper backgroundColor={backgroundColor} >
                  <FoundToken>
                    <Image
                      src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${getChainNameById(
                        chain.networkId
                      )}/assets/${searchedToken.address}/logo.png`}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src =
                          "https://cdn.shopify.com/s/files/1/1061/1924/products/Thinking_Face_Emoji_small.png?v=1571606036";
                      }}
                    />
                    <Name> {searchedToken.name}</Name>
                  </FoundToken>
                  <AddButton
                    onClick={() => setShowConfirmMenu(true)}
                    ctaColor={ctaColor}
                  >
                    Add
                  </AddButton>
                </SearchTokenWrapper>
              ) : (
                filteredList.map((item, index) => (
                  <ItemWrapper
                    key={index}
                    onClick={() => optionSelectHandler(item)}
                    active={_.isEqual(item, currentValue)}
                  >
                    <Image
                      src={
                        item.logoURI !== ""
                          ? item.logoURI?.slice(0, 4) === "ipfs"
                            ? `https://ipfs.io/ipfs/${item.logoURI?.split("//")[1]
                            }`
                            : item.logoURI
                          : iconList[item.symbol]
                            ? iconList[item.symbol]
                            : `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${getChainNameById(
                              chain.networkId
                            )}/assets/${item.address}/logo.png`
                      }
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src =
                          "https://cdn.shopify.com/s/files/1/1061/1924/products/Thinking_Face_Emoji_small.png?v=1571606036";
                      }}
                    />
                    <Name>{item.name}</Name>
                    {currentNetwork &&
                      currentNetwork.networkId === chain.networkId &&
                      !item.native && (
                        <StyledAddIcon
                          onClick={(event) => {
                            addTokenToMetamask(
                              item.address,
                              item.symbol,
                              item.decimals,
                              ""
                            );
                            event.stopPropagation();
                          }}
                        />
                      )}
                    <Balance>
                      {balanceList[item.symbol] ? (
                        balanceList[item.symbol]
                      ) : isWalletConnected ? (
                        <SpinnerSmall
                          loading={true}
                          ctaColor={ctaColor}
                        />
                      ) : (
                        "-"
                      )}
                    </Balance>
                    <StyledLaunchOutlined
                      onClick={(event) => {
                        window.open(
                          explorerAddressLinks[
                            chain.networkId.toString()
                          ].concat(item?.address) ?? "",
                          "_blank",
                          "noopener,noreferrer"
                        );
                        event.stopPropagation();
                      }}
                    />
                  </ItemWrapper>
                ))
              )}
            </ItemListWrapper>
          </ChainAssetWrapper>
          {/* <ManageButton onClick={() => setShowManageTab(true)}>
							Manage token lists
						</ManageButton> */}
        </Wrapper>
      ) : (
        <Wrapper backgroundColor={backgroundColor} textColor={textColor}>
          <StyledBackButton onClick={() => setShowManageTab(false)} />
          <StyledCloseIcon
            onClick={close}
            textColor={textColor}
          />
          <Title>Manage</Title>
          <TokenListArrayWrapper>
            {tokenListByUrl &&
              remoteAssetList.map((tokenListUrl, index) => (
                <TokenListWrapper
                  key={index}
                  backgroundColor={backgroundColor}
                >
                  <TokenListLogo
                    src={
                      tokenListByUrl[tokenListUrl]?.logoURI?.slice(0, 4) ===
                        "ipfs"
                        ? `https://ipfs.io/ipfs/${tokenListByUrl[tokenListUrl]?.logoURI?.split(
                          "//"
                        )[1]
                        }`
                        : tokenListByUrl[tokenListUrl]?.logoURI
                    }
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src =
                        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thinking_Face_Emoji_small.png?v=1571606036";
                    }}
                  />
                  <TokenListDetails>
                    <span>{tokenListByUrl[tokenListUrl]?.name}</span>
                    <span style={{ fontSize: "12px" }}>
                      {
                        tokenListByUrl[tokenListUrl]?.tokens?.filter(
                          (token) =>
                            token?.chainId.toString() === chain?.networkId
                        ).length
                      }{" "}
                      tokens
                    </span>
                  </TokenListDetails>
                  <TokenListToggleWrapper>
                    <Switch
                      checked={activeListUrl.includes(tokenListUrl)}
                      onChange={() => handleTokenListToggle(tokenListUrl)}
                      name="checkedB"
                      color="primary"
                      disabled={
                        tokenListByUrl[tokenListUrl]?.tokens.filter(
                          (token) =>
                            token?.chainId.toString() === chain?.networkId
                        ).length === 0
                      }
                    />
                  </TokenListToggleWrapper>
                </TokenListWrapper>
              ))}
          </TokenListArrayWrapper>
        </Wrapper>
      )}
    </>
  );
};

export default SearchMenu;
