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
  path: string;
  explorer: string;
}

const box1Height = 76;
const box1Width = 654;
//const box1BorderRadius = 10

const Progression_04 = keyframes`
    0%{
        width: 0%;
        height: 0px;
    }
    10%{
        width: 0%;
        height: 100%;
    }
    50%{
        width: 50%;
        height: 100%;
    }
   100%{
        width: 50%;
        height: 100%;
    }  
`;

const Progression_05 = keyframes`
    0%{
        width: 0%;
        height: 0%;
        opacity: 0;
    }
    50%{
        width: 0%;
        height: 0%;
        opacity: 0;
    }
    51%{
        width: 0%;
        height: 0%;
        opacity: 1;
    }
    90%{
        width: 50%;
        height: 0%;
        opacity: 1;
    }
    100%{
        width: 50%;
        height: 100%;
        opacity: 1;
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
    animation: ${Progression_04} 3s linear infinite;
  }
  ::after {
    visibility: ${({ animationState }) =>
    animationState === "animate" ? "visible" : "hidden"};
    position: absolute;
    left: 50%;
    bottom: 0;
    content: "";
    width: 0;
    height: 0;
    opacity: 0;
    //border-top: 2px dashed #A3A4A4;
    border-bottom: 2px dashed #FFFFFF;
    border-right: 2px dashed #FFFFFF;
    z-index: 1;
    transform: translate(0.3px, 1.9px);
    animation: ${Progression_05} 3s linear infinite;
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

const SourceAssetWrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-125%, -75%);
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
`;

const PathAssetWrapper = styled.div`
  width: ${box1Width};
  display: flex;
  justify-content: space-evenly;
  transform: translate(0px, 46px);
`;

const PathElement = styled.div`
  display: grid;
  place-items: center;
`;

const PathAssetName = styled.div``;

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
  transform: translate(145%, 65%);
  cursor: pointer;
`;


const SwapVisualSameChain = ({
  animationState,
  animationType,
  sourceChain,
  destinationChain,
  sourceAsset,
  destinationAsset,
  path,
  explorer,
}: Props) => {
  // const showCheckPoint1 = animationState!=='initial' && animationType==='path_12' || animationType==='path_23' || animationState==='final'
  // const showCheckPoint2 = animationState!=='initial' && animationType==='path_23' || animationState==='final'
  const pathArray = path !== "" || !path ? path?.split("->") : [];
  const pathRoute = pathArray?.slice(1, pathArray.length - 1);

  if (!pathRoute) return <></>
  return (
    <Wrapper>
      <Box1 animationState={animationState} animationType={animationType}>
        <Pin1>
          <PinActive show />
        </Pin1>
        <Pin2>
          <PinActive show={animationState === "final"} />
        </Pin2>
        <PathAssetWrapper>
          {pathRoute.length > 0
            ? pathRoute.map((asset, index) => (
              <PathElement key={index}>
                <PathAssetName>{asset}</PathAssetName>
                <Pin>
                  <PinActive show={animationState === "final"} />
                </Pin>
              </PathElement>
            ))
            : null}
        </PathAssetWrapper>
      </Box1>
      <SourceAssetWrapper>
        {<AssetImage src={chainLogos[sourceChain.networkId]} />}
        {sourceAsset && sourceAsset.symbol}
      </SourceAssetWrapper>
      <DestinationAssetWrapper>
        {<AssetImage src={chainLogos[destinationChain.networkId]} />}
        {destinationAsset && destinationAsset.symbol}
      </DestinationAssetWrapper>
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

export default SwapVisualSameChain;
