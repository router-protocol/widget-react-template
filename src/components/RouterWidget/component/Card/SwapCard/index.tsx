import React, { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { NetworkType } from "../../../config/network";
import {
  assetLogos,
  assetLogosForCard,
  AssetType,
  chainLogos,
} from "../../../config/asset";
import {
  fixedDecimalPlace,
  getChainNameById,
  shortenAddress,
} from "../../../utils";
import ReceipientAddress from "../../ReceipientAddressInputBox";
import { useMediaQuery } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import checkedIcon from "../../../assets/vectors/checked-icon.svg";
import SpinnerSmall from "../../Loaders/SpinnerSmall";
import MaxButton from "../../Button/MaxButton";
import informationIcon from "../../../assets/vectors/bi_info-circle.svg";
import HoverCard from "../../HoverCard/HoverCard";
import { MEDIA_WIDTHS } from "../../../constant";

interface Props {
  currentChain: NetworkType;
  currentAsset: AssetType | "";
  tokenBalance: number | string;
  usdBalance: number | string;
  showChainMenu: () => void;
  showAssetMenu: () => void;
  inputValue: string;
  inputHandler: (e: any) => void;
  label: string;
  id: string;
  fetching: boolean;
  locked: boolean;
  maxButton: () => void;
  openFeeMenu: () => void;
  currentRecipientAddress: string;
  setCurrentRecipientAddress: (e: string) => void;
  isWalletConnected: boolean;
  tabValue: number;
  setTabValue: Dispatch<SetStateAction<number>>;
  accountAddress: string;
  feeAsset: AssetType;
  sourceChain: NetworkType;
  destinationChain: NetworkType;
  expertModeToggle: boolean;
  ctaColor: string; 
  textColor: string;
  backgroundColor: string;
}

const CardWrapper = styled.div<{
  darkMode: boolean;
  showSendTo: boolean;
  labelSendTo: boolean;
  expertMode: boolean;
}>`
  border-radius: 22px;
  display: grid;
  grid-template-rows: ${({ showSendTo }) =>
    showSendTo ? "40px 40px 80px 90px" : "40px 50px 145px"};
  border-radius: 17px;
  margin: 35px;
  margin-bottom: ${({ showSendTo }) => (showSendTo ? "20px" : "10px")};
  font-family: "Inter", sans-serif;
  position: relative;
  z-index: 2;
  transition: all 0.2s ease-in-out;
  @media only screen and (max-width: 960px){
      grid-template-rows:  60px auto;
      grid-template-columns: auto auto;
      align-items: center;
      margin: 0px;  
  }
  @media only screen and (max-width: 750px){
      grid-template-rows: ${({ labelSendTo, expertMode }) =>
        labelSendTo
          ? expertMode
            ? "60px auto 70px"
            : "60px auto 5px"
          : "60px auto 45px"};
      margin-bottom: 0;
  }
  transition: all 0.2s ease-in-out;
`;

const ChainDropdown = styled.div<{textColor: string;}>`
  width: 140px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.15);

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  cursor: pointer;
  font-size: 16px;
  color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF" };
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.06);
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

  @media only screen and (max-width: 960px){
    justify-self: start;
    grid-column: span 2;
  }
  @media only screen and (max-width: 750px){
    width: 130px;
    height: 35px;
    font-size: 14px;
  }
  transition: all 0.2s ease-in-out;
`;
const AssetWrapper = styled.div<{ backgroundColor: string }>`
  width: 370px;
  align-self: center;
  display: grid;
  height: fit-content;
  background: ${({backgroundColor}) => backgroundColor !== "" ? backgroundColor : "rgba(0, 0, 0, 0.25)"}; //ColorChange
  border: 1px solid ${({backgroundColor}) => backgroundColor !== "" ? "rgba(255, 255, 255, 0.05)" : "rgba(88, 88, 99, 0.24)"};
  border-radius: 10px;
  padding: 10px 10px;
  padding-left: 13px;
  box-shadow: ${({ backgroundColor }) =>
    backgroundColor == ""
    ? "3px 3px 10px 4px rgba(0, 0, 0, 0.1)"
    : "3px 3px 10px 4px rgba(0, 0, 0, 0.3)"};
  @media only screen and (max-width: 960px){
    grid-column: span 2; 
  }
  @media only screen and (max-width: 750px){
    width: 320px; 
  }
`;

const AssetItemWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const AssetItemWrapper1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AssetInput = styled.input<{ fetching: boolean; textColor: string}>`
  width: 180px;
  font-family: "Inter", sans-serif;
  //font-weight: ${({ fetching }) => (fetching ? 400 : 500)};
  font-weight: 500;
  //font-size: ${({ fetching }) => (fetching ? "20px" : "24px")};
  font-size: 24px;
  text-align: left;
  //color: ${({ fetching }) => (fetching ? "#E8425AA6" : "#FFFFFF")};
  color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"};
  background: none;
  border: none;
  &:focus {
    outline: none;
  }
  @media only screen and (max-width: 750px){
        width: 150px;
        border-radius: 10px;
        padding-bottom: 0px;
  }
`;

const AssetDropdown = styled.div<{ textColor: string }>`
  width: fit-content;
  height: 35px;
  border-radius: 10px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"};
  cursor: pointer;
  :hover {
    background: rgba(109, 195, 200, 0.15);
    border-radius: 10px;
  }
  @media only screen and (max-width: 750px){
  }
  transition: all 0.2s ease-in-out;
`;

// const BalanceWrapper = styled.div`
//     width: 100%;
//     display: flex;
//     justify-content: space-between;
//     font-family: 'Inter', sans-serif;
//     text-align: center;
//     ${({ theme }) => theme.mediaWidth.upToMedium`
//        grid-column: span 2;
//   	`};
//     transition: all 0.2s ease-in-out;
// `

const BalanceTokens = styled.div<{textColor: string;}>`
  font-size: 12px;
  color: ${({textColor}) => textColor !== "" ? textColor : "#A3A4A4" };
  padding-right: 5px;
  @media only screen and (max-width: 960px){
    font-size: 14px;
  }
  transition: all 0.2s ease-in-out;
`;

const Label = styled(BalanceTokens)`
  font-size: 16px;
  @media only screen and (max-width: 960px){
    font-size: 1rem;
  }
`;

const Image = styled.img`
  width: 18px;
  margin-right: 5px;
  @media only screen and (max-width: 750px){
    width: 17px; 
  }
`;

const AssetImage = styled.img`
  width: 20px;
  margin: 0 5px;
  @media only screen and (max-width: 750px){
    width: 16px;
    height: 16px; 
  }
`;

const StyledExpandMoreIcon = styled(ExpandMoreIcon)<{textColor: string;}>`
  &&& {
    color: #8a8a9b;
  }
`;

const StyledExpandMoreIcon1 = styled(ExpandMoreIcon)<{textColor: string;}>`
  &&& {
    width: 20px;
    height: 20px;
    color: ${({textColor}) => textColor !== "" ? textColor : "#A3A4A4"};
  }
`;

const FromAddress = styled.div`
  visibility: hidden;
  display: grid;
  height: 50px;
  align-items: center;
  font-family: "Inter", sans-serif;
  font-size: 20px;
  font-weight: 400;
  display: flex;
  @media only screen and (max-width: 960px){
     display:none;   
  }
  transition: all 0.2s ease-in-out;
`;
const AddressLabel = styled.div<{textColor: string;}>`
  color: ${({textColor}) => textColor !== "" ? "rgba(255, 255, 255, 0.10)" : "#A3A4A4"};
`;
const CurrentAddress = styled.div<{textColor: string;}>`
  color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"}; #FFFFFF;
`;
const ReceipientAddressWrapper = styled.div`
  display: grid;
  justify-content: center;
  align-self: center;
  @media only screen and (max-width: 960px){
    display:none;
  }
  transition: all 0.2s ease-in-out;
`;

const CheckBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-top: 5px;
  color: rgba(255, 255, 255, 0.5);
  @media only screen and (max-width: 750px){
      font-size: 12px;  
  }
`;
const StyledCheckBox = styled.div`
  height: 18.33px;
  width: 18.33px;
  border-radius: 3px;
  border: 2px solid #fff;
  background-color: #3B4256;
  margin-right: 4.7px;
  margin-left: 1px;
  @media only screen and (max-width: 750px){
      width: 16.5px;
      height: 16px;  
  }
`;

const CheckedIcon = styled.img`
  margin-right: 4px;
  @media only screen and (max-width: 750px){
      width: 18px;
      height: 18px;  
  }
`;

const StyledCircularProgressWrapper = styled.div<{ active: boolean }>`
  margin-right: 5px;
  display: ${({ active }) => (active ? "block" : "none")};
`;

const StyledCircularProgress = styled(CircularProgress)<{ ctaColor: string }>`
  &&& {
    width: 25px !important;
    height: 25px !important;
    color: ${({ctaColor}) => ctaColor !== "" ? ctaColor : "#00A0BE"};
    .MuiCircularProgress-colorPrimary {
      color: ${({ctaColor}) => ctaColor !== "" ? ctaColor : "#00A0BE"};
    }
  }
`;

const ReceipientAddressWrapperMobile = styled(ReceipientAddressWrapper)`
  display: none;
  @media only screen and (max-width: 960px){
      display: grid;
      grid-column: span 2;  
  }
  @media only screen and (max-width: 750px){
     grid-template-rows: 40px 25px;
      margin-top: 10px;   
  }
`;
const MaxButtonWrapper = styled.div`
  padding-right: 5px;
  @media only screen and (max-width: 750px){
  }
`;

const ChainDropdownWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ToggleButton = styled.button<{
  textColor: string;
  backgroundColor: string;
}>`
  width: 73px;
  height: 26px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: ${({backgroundColor}) => backgroundColor !== "" ? "rgba(255, 255, 255, 0.10)" : "rgba(88, 88, 99, 0.24)"};
  border: 1px solid ${({backgroundColor}) => backgroundColor !== "" ? "rgba(255, 255, 255, 0.15)" : "#A3A4A4"};
  color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"};
  font-size: 12px;
  cursor: pointer;
`;
const FeeAssetWrapper = styled.div`
  display: flex;
  @media only screen and (max-width: 960px){
    margin: 15px 0;
  }
`;

const FeeImage = styled.img`
  width: 14px;
  @media only screen and (max-width: 750px){
    width: 14px;
    height: 14px;
  }
  margin-right: 3px;
`;

const FeeAssetButton = styled.button<{
  backgroundColor: string;
  textColor: string;
}>`
  width: fit-content;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid ${({textColor}) => textColor !== "" ? textColor : "rgba(255, 255, 255, 0.15)" };
  color: #FFFFFF;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  box-shadow: ${({ backgroundColor }) =>
    backgroundColor !== ""
    ? "3px 3px 10px 4px rgba(0, 0, 0, 0.1)"
    : "3px 3px 10px 4px rgba(0, 0, 0, 0.3)"};
  :hover {
    border: 1px solid rgba(0, 110, 130, 0.5);
  }
`;

const FeeInfoWrapper = styled.div`
  position: absolute;
  right: -45px;
  top: 90px;
  display: none;
`;

const HoverIcon = styled.img`
  margin-right: 7px;
  cursor: pointer;
  &:hover ~ ${FeeInfoWrapper} {
    opacity: 1;
    display: inline-block;
  }
`;

const FeeInfo = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 12px;
  font-weight: 300;
  width: 250px;
`;

const SwapCard = ({ openFeeMenu, currentChain, currentAsset, tokenBalance, usdBalance, showChainMenu, showAssetMenu, inputValue, inputHandler, label, id, fetching, maxButton, locked, setCurrentRecipientAddress, currentRecipientAddress, isWalletConnected, tabValue, setTabValue, feeAsset, sourceChain, destinationChain, accountAddress, expertModeToggle, backgroundColor, textColor, ctaColor }: Props) => {
    // const [currentRecipientAddress, setCurrentRecipientAddress] = useRecipientAddress();
    // const [accountAddress] = useAccountAddress();
    // // const [tabValue, setTabValue] = useRecipientAddressSwitch()
    // const [sourceChain] = useSourceChain();
    // const [destinationChain] = useDestinationChain();
    // // const [isWalletConnected] = useWalletConnected()
    // const [feeAsset] = useFeeAsset()

    const upToMedium = useMediaQuery(`(max-width: ${MEDIA_WIDTHS.upToMedium}px)`)

    const handleCheckbox = (e: any) => {
        setTabValue(tabValue === 0 ? 1 : 0)
    };


    return (
        <>
          <CardWrapper
            darkMode
            labelSendTo={label === "To Send"}
            showSendTo={tabValue === 1}
            expertMode={expertModeToggle}
          >
          {!upToMedium && (
            <Label textColor={textColor}>
              {label.split(" ")[0]}
            </Label>
          )}
          {upToMedium ? (
            <ChainDropdown
              onClick={showChainMenu}
              textColor={textColor}
            >
              <Image src={chainLogos[currentChain?.networkId]} />
              <span>{currentChain?.name?.split(" ")[0]}</span>
              <StyledExpandMoreIcon
                textColor={textColor}
              />
            </ChainDropdown>
          ) : label === "From Send" ? (
            <ChainDropdownWrapper>
              <ChainDropdown
                onClick={showChainMenu}
                textColor={textColor}
              >
                <Image src={chainLogos[currentChain?.networkId]} />
                <span>{currentChain?.name?.split(" ")[0]}</span>
                <StyledExpandMoreIcon
                  textColor={textColor}
                />
              </ChainDropdown>
              {sourceChain.networkId !== destinationChain.networkId && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <HoverIcon src={informationIcon} />
                  {label === "From Send" && (
                    <FeeInfoWrapper>
                      <HoverCard active={true}>
                        <FeeInfo>
                          The token in which you want to pay the bridge fees. You
                          can select from multiple fee options as per your
                          convenience
                        </FeeInfo>
                      </HoverCard>
                    </FeeInfoWrapper>
                  )}
                  <FeeAssetWrapper>
                    <FeeAssetButton
                      onClick={openFeeMenu}
                      disabled={
                        sourceChain.networkId === destinationChain.networkId
                      }
                      backgroundColor={backgroundColor}
                      textColor={textColor}
                    >
                      Fee Token :&nbsp;
                      <FeeImage
                        src={assetLogosForCard(feeAsset.symbol)}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src =
                            "https://cdn.shopify.com/s/files/1/1061/1924/products/Thinking_Face_Emoji_small.png?v=1571606036";
                        }}
                      />
                      <span>{feeAsset.symbol}</span>
                      <StyledExpandMoreIcon1
                        textColor={textColor}
                      />
                    </FeeAssetButton>
                  </FeeAssetWrapper>
                </div>
              )}
            </ChainDropdownWrapper>
          ) : label === "To Send" ? (
            <ChainDropdownWrapper>
              <ChainDropdown
                onClick={showChainMenu}
                textColor={textColor}
              >
                <Image src={chainLogos[currentChain?.networkId]} />
                <span>{currentChain?.name?.split(" ")[0]}</span>
                <StyledExpandMoreIcon
                  textColor={textColor}
                />
              </ChainDropdown>
              {expertModeToggle ? (
                tabValue === 0 ? (
                  <ToggleButton
                    onClick={handleCheckbox}
                    backgroundColor={backgroundColor}
                    textColor={textColor}
                  >
                    + send to
                  </ToggleButton>
                ) : (
                  <ToggleButton
                    onClick={handleCheckbox}
                    backgroundColor={backgroundColor}
                    textColor={textColor}
                  >
                    - send to
                  </ToggleButton>
                )
              ) : null}
            </ChainDropdownWrapper>
          ) : null}

          {label === "From Send" && tabValue === 1 && (
            <FromAddress>
              <AddressLabel
                textColor={textColor}
              >
                {"Address: "}
              </AddressLabel>
              &nbsp;
              <CurrentAddress
                textColor={textColor}
              >
                {accountAddress
                  ? shortenAddress(accountAddress)
                  : " Connect Your Wallet"}
              </CurrentAddress>
            </FromAddress>
          )}
          {label === "To Send" && expertModeToggle && tabValue === 1 && (
            <ReceipientAddressWrapper>
              <ReceipientAddress
                inputValue={currentRecipientAddress}
                inputHandler={(e) => setCurrentRecipientAddress(e.target.value)}
                disabled={false}
              />
            </ReceipientAddressWrapper>
          )}

          {/* {
                      <Tempdiv></Tempdiv>
                  } */}

          <AssetWrapper
            backgroundColor={backgroundColor}
          >
            <AssetItemWrapper style={{ marginBottom: "5px" }}>
              <div id={id}>
                <AssetInput
                  placeholder="0.0"
                  value={inputValue}
                  onChange={inputHandler}
                  disabled={label === "To Send" || locked}
                  className="token-input"
                  fetching={fetching}
                  textColor={textColor}
                />
              </div>
              <AssetItemWrapper1>
                {label === "From Send" && isWalletConnected ? (
                  <MaxButtonWrapper onClick={maxButton}>
                    <MaxButton ctaColor={ctaColor} />
                  </MaxButtonWrapper>
                ) : (
                  <StyledCircularProgressWrapper active={fetching}>
                    <StyledCircularProgress
                      ctaColor={ctaColor}
                    />
                  </StyledCircularProgressWrapper>
                )}
                <AssetDropdown
                  onClick={showAssetMenu}
                  textColor={textColor}
                >
                  {currentAsset !== "" && (
                    <AssetImage
                      src={
                        currentAsset.logoURI !== ""
                          ? currentAsset.logoURI
                          : assetLogos[currentAsset?.symbol]
                          ? assetLogos[currentAsset?.symbol]
                          : `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${getChainNameById(
                              label === "From Send"
                                ? sourceChain?.networkId
                                : destinationChain?.networkId
                            )}/assets/${currentAsset?.address}/logo.png`
                      }
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src =
                          "https://cdn.shopify.com/s/files/1/1061/1924/products/Thinking_Face_Emoji_small.png?v=1571606036";
                      }}
                    />
                  )}
                  {currentAsset ? currentAsset.symbol : "Select Token"}
                  <StyledExpandMoreIcon
                    textColor={textColor}
                  />
                </AssetDropdown>
              </AssetItemWrapper1>
            </AssetItemWrapper>
            <AssetItemWrapper>
              <BalanceTokens
                textColor={textColor}
              >
                {usdBalance !== "" && "~$" + fixedDecimalPlace(usdBalance, 4)}
              </BalanceTokens>
              <BalanceTokens
                textColor={textColor}
              > 
                Balance:{" "}
                {currentAsset !== "" ? (
                  tokenBalance === "-" ? (
                    isWalletConnected ? (
                      <SpinnerSmall
                        loading={true}
                        ctaColor={ctaColor}
                      />
                    ) : (
                      "-"
                    )
                  ) : (
                    fixedDecimalPlace(tokenBalance, 4)
                  )
                ) : (
                  "-"
                )}
                {/* {(currentAsset !== '') ?
                                  usdBalance === '-' ? " = $" : parseFloat(usdBalance.toString()) === 0 ? "" : " = $"
                                  : '-'
                              }
                              {(currentAsset !== '') ?
                                  usdBalance === '-' ? (isWalletConnected ? <SpinnerSmall loading={true} /> : '-') : parseFloat(usdBalance.toString()) === 0 ? "" : fixedDecimalPlace(usdBalance, 4)
                                  : '-'
                              } */}
              </BalanceTokens>
            </AssetItemWrapper>
          </AssetWrapper>
          {/* <BalanceWrapper>
                      <BalanceTokens>
                          Balance:{' '}
                          {(currentAsset !== '') ?
                              tokenBalance === '-' ? (isWalletConnected ? <SpinnerSmall loading={true} /> : '-') : fixedDecimalPlace(tokenBalance, 4)
                              : '-'
                          }
                          {(currentAsset !== '') ?
                              usdBalance === '-' ? " = $" : parseFloat(usdBalance.toString()) === 0 ? "" : " = $"
                              : '-'
                          }
                          {(currentAsset !== '') ?
                              usdBalance === '-' ? (isWalletConnected ? <SpinnerSmall loading={true} /> : '-') : parseFloat(usdBalance.toString()) === 0 ? "" : fixedDecimalPlace(usdBalance, 4)
                              : '-'
                          }
                      </BalanceTokens>
                  </BalanceWrapper> */}
          {label === "To Send" ? (
            expertModeToggle ? (
              <ReceipientAddressWrapperMobile>
                <ReceipientAddress
                  inputValue={currentRecipientAddress}
                  inputHandler={(e) => setCurrentRecipientAddress(e.target.value)}
                  disabled={tabValue === 0}
                />
                {
                  <CheckBoxWrapper>
                    {tabValue === 0 ? (
                      <CheckedIcon src={checkedIcon} onClick={handleCheckbox} />
                    ) : (
                      <StyledCheckBox onClick={handleCheckbox}></StyledCheckBox>
                    )}
                    <span>Same as sender</span>
                  </CheckBoxWrapper>
                }
              </ReceipientAddressWrapperMobile>
            ) : null
          ) : (
            upToMedium &&
            sourceChain.networkId !== destinationChain.networkId && (
              <FeeAssetWrapper>
                <FeeAssetButton
                  onClick={openFeeMenu}
                  disabled={sourceChain.networkId === destinationChain.networkId}
                  backgroundColor={backgroundColor}
                  textColor={textColor}
                >
                  Fee Token :&nbsp;
                  <FeeImage
                    src={assetLogosForCard(feeAsset.symbol)}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src =
                        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thinking_Face_Emoji_small.png?v=1571606036";
                    }}
                  />
                  <span>{feeAsset.symbol}</span>
                </FeeAssetButton>
              </FeeAssetWrapper>
          )
        )}
      </CardWrapper>
    </>
  );
};

export default SwapCard;
