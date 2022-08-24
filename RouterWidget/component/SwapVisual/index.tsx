import React from "react";
import styled, { keyframes } from "styled-components";
import { AssetType, chainLogos } from "../../config/asset";
import { NetworkType } from "../../config/network";

interface Props {
  animationState: string;
  animationType: string;
  sourceChain: NetworkType;
  destinationChain: NetworkType;
  sourceAsset: AssetType | "";
  destinationAsset: AssetType | "";
  explorer: string;
  srcTxExplorer: string;
}

const box1Height = 76;
const box1Width = 654;
const box1WidthMobile = 480;
//const box1BorderRadius = 10

const Progression_01 = keyframes`
    0%{
        width: 0%;
        height: 0px;
    }
    35%{
        width: 0%;
        height: 100%;
    }
    100%{
        width: 25%;
        height: 100%;
    }
`;
const Progression_02 = keyframes`
    0%{
        width: 25%;
        height: 100%;
    }
    100%{
        width: 75%;
        height: 100%;
    }
`;
const Progression_02_Hault = keyframes`
    0%{
        width: 75%;
        height: 100%;
    }
    100%{
        width: 75%;
        height: 100%;
    }
`;
const Progression_03 = keyframes`
    0%{
        width: 0%;
        height: 0%;
    }
    45%{
        width: 25%;
        height: 0%;
    }
    100%{
        width: 25%;
        height: 100%;
    }
`;

const Wrapper = styled.div`
  position: relative;
  margin-bottom: 50px;
  margin-top: 20px;
  font-family: "Inter", sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: #FFFFFF;

  @media only screen and (max-width: 750px){
    display: none;
    transform: rotate(90deg) translate(60%,50%);
  }		
`;

const Box1 = styled.div<{ animationState: string; animationType: string }>`
  position: relative;
  width: ${box1Width}px;
  height: ${box1Height}px;
  border: 2px dashed
    ${({ animationState }) =>
      animationState === "final" ? "#FFFFFF" : "#A3A4A4"};
  border-top: none;
  ::before {
    visibility: ${({ animationState }) =>
      animationState === "animate" ? "visible" : "hidden"};
    position: absolute;
    content: "";
    width: 0;
    height: 0;
    //border-top: 2px dashed #A3A4A4;
    border-bottom: 2px dashed #FFFFFF;
    border-left: 2px dashed #FFFFFF;
    z-index: 1;
    transform: translate(-1.1px, 0px);
    animation: ${({ animationType }) =>
        animationType === "path_01"
          ? Progression_01
          : animationType === "path_12"
          ? Progression_02
          : animationType === "path_23"
          ? Progression_02_Hault
          : "none"}
      1.5s linear infinite;
  }
  ::after {
    visibility: ${({ animationState }) =>
      animationState === "animate" ? "visible" : "hidden"};
    position: absolute;
    left: 75%;
    bottom: 0;
    content: "";
    width: 0;
    height: 0;
    //border-top: 2px dashed "#A3A4A4";
    border-bottom: 2px dashed #FFFFFF;
    border-right: 2px dashed #FFFFFF;
    z-index: 1;
    transform: translate(0.3px, 1.5px);
    animation: ${({ animationType }) =>
        animationType === "path_23" ? Progression_03 : "none"}
      1.5s linear infinite;
  }

  @media only screen and (max-width: 960px){
     width: ${box1WidthMobile}px;   
  }
`;

const Pin = styled.div`
  width: 14px;
  height: 14px;
  border: 1px solid #FFFFFF;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #151515;
`;

const PinActive = styled.div<{ show: boolean }>`
  width: 6px;
  height: 6px;
  background: #00ffb9;
  border-radius: 50%;
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: all 0.2s ease-in-out;
`;
const Pin1 = styled(Pin)`
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-8px, -14px);
  z-index: 1;
`;

const Pin2 = styled(Pin)`
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(8px, -14px);
  z-index: 2;
`;
// const Pin3 = styled(Pin)`
//     position: absolute;
//     bottom: 0;
//     right: 0;
//     left: 0;
//     margin: 0 auto;
//     transform: translateY(8px);
//     z-index: 2;
// `
const Pin4 = styled(Pin)`
  position: absolute;
  bottom: 0;
  left: 25%;
  margin: 0 auto;
  transform: translateY(8px);
  z-index: 2;
`;
const Pin5 = styled(Pin)`
  position: absolute;
  bottom: 0;
  right: 25%;
  transform: translateY(8px);
  z-index: 2;
`;

const SourceAssetWrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-125%, -75%);
  @media only screen and (max-width: 750px){
    transform: rotate(-90deg) translate(100%,-145%);  
  }
`;
const AssetImage = styled.img`
  width: 25px;
  margin-right: 10px;
`;
const DestinationAssetWrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(125%, -75%);
  @media only screen and (max-width: 750px){
    transform: rotate(-90deg) translate(100%,160%);
  }
`;

const CheckPoint1 = styled.div`
  position: absolute;
  bottom: 0;
  left: 25%;
  transform: translate(-5px, -8px);
`;

const CheckPoint2 = styled.div`
  position: absolute;
  bottom: 0;
  left: 75%;
  transform: translate(-21px, -8px);
`;
const ExplorerHyperLink = styled.div`
  width: 82px;
  height: 36px;
  font-size: 12px;
  line-height: 18px;
  color: #00a0be;
  text-align: center;
  text-decoration-line: underline;
  text-shadow: 0px 0px 24px rgba(255, 255, 255, 0.25);
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(111%, 55%);
  cursor: pointer;
`;

const ExplorerHyperLinkSrc = styled.div`
  width: 82px;
  height: 36px;
  font-size: 12px;
  line-height: 18px;
  color: #00a0be;
  text-align: center;
  text-decoration-line: underline;
  text-shadow: 0px 0px 24px rgba(255, 255, 255, 0.25);
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(-673px, 55%);
  cursor: pointer;
`;

const SwapVisual = ({
  animationState,
  animationType,
  sourceChain,
  destinationChain,
  sourceAsset,
  destinationAsset,
  explorer,
  srcTxExplorer,
}: Props) => {
  //console.log(animationState,animationType)

  const showCheckPoint1 =
    (animationState !== "initial" && animationType === "path_12") ||
    animationType === "path_23" ||
    animationState === "final";
  const showCheckPoint2 =
    (animationState !== "initial" && animationType === "path_23") ||
    animationState === "final";

  return (
    <Wrapper>
      {srcTxExplorer !== "" && animationType !== "path_01" ? (
        <ExplorerHyperLinkSrc
          onClick={() =>
            window.open(srcTxExplorer, "_blank", "noopener,noreferrer")
          }
        >
          Click to view on Explorer
        </ExplorerHyperLinkSrc>
      ) : null}
      <Box1 animationState={animationState} animationType={animationType}>
        <Pin1>
          <PinActive show />
        </Pin1>
        <Pin2>
          <PinActive show={animationState === "final"} />
        </Pin2>
        <Pin4>
          <PinActive show={showCheckPoint1} />
        </Pin4>
        <Pin5>
          <PinActive show={showCheckPoint2} />
        </Pin5>
      </Box1>
      <SourceAssetWrapper>
        {<AssetImage src={chainLogos[sourceChain.networkId]} />}
        {sourceAsset && sourceAsset.symbol}
      </SourceAssetWrapper>
      <DestinationAssetWrapper>
        {<AssetImage src={chainLogos[destinationChain.networkId]} />}
        {destinationAsset && destinationAsset.symbol}
      </DestinationAssetWrapper>
      <CheckPoint1>
        {sourceChain && <AssetImage src={chainLogos[sourceChain.networkId]} />}
      </CheckPoint1>
      <CheckPoint2>
        {destinationChain && (
          <AssetImage src={chainLogos[destinationChain.networkId]} />
        )}
      </CheckPoint2>
      {explorer !== "" && animationState === "final" ? (
        <ExplorerHyperLink
          onClick={() => window.open(explorer, "_blank", "noopener,noreferrer")}
        >
          Click to view on Explorer
        </ExplorerHyperLink>
      ) : null}
    </Wrapper>
  );
};

export default SwapVisual;
