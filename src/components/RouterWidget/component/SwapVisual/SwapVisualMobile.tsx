import * as React from 'react';
import styled, { keyframes } from 'styled-components'
import { AssetType, chainLogos } from '../../config/asset'
import head from '../../assets/vectors/animation-head-tiangle.svg'
import { NetworkType } from '../../config/network';

interface Props {
    animationState: string;
    sourceAsset: AssetType;
    destinationAsset: AssetType;
    sourceChain: NetworkType;
    destinationChain: NetworkType;
}

const Wrapper = styled.div`
    font-family: 'Inter', sans-serif;
    display: none;
    width: 358px;
    height: 80px;
    border-radius: 16px;
    border: 1px solid rgba(88, 88, 99, 0.24);
    margin: 35px 0;
    position: relative;
    box-shadow: 3px 3px 10px 4px rgba(0, 0, 0, 0.3);
    ::before {  
      	content: ""; 
        width: 358px;
        height: 80px;
      	background: "linear-gradient(152.97deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)"; 
		opacity: 0.2;
        backdrop-filter: blur(42px);
        border-radius: 16px;
        position: absolute;
        top: 0;
	}
    @media only screen and (max-width: 750px){
        display: grid;
        place-items: center;
    }
`

const Content = styled.div`
    display: flex;
    align-items: center;
    justify-items : center;
    width: 100%;
    z-index: 1;
    margin-left: 20px;
`

const AssetWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: #00000040; 
    width: 110px;
    height: 45px;
    padding: 0 15px;
    border-radius: 10px;
    margin: 0 5px;
`

const AssetImage = styled.img`
    width: 20px;
    margin-right : 7px;
`

const AssetName = styled.div`
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
`

const box1Width = 85
const box1Height = 0

const Animation1 = keyframes`
    0%{
        width: 0px;
    }
    100%{
        width: 100%;
    }
`

const AnimationLine = styled.div`
    display: flex;
    align-items: center;
`

const Line = styled.div<{ animationState: string }>`
    position: relative;
    width: ${box1Width}px;
    height: ${box1Height}px;
    border-bottom: 2px dashed ${({ animationState }) => (animationState === 'final') ? "#FFFFFF" : "#A3A4A4"};
    ::before{
        visibility: ${({ animationState }) => (animationState === 'animate') ? 'visible' : 'hidden'};
        position: absolute;
        content: '';
        width: 0;
        height: 0;
        border-bottom: 2px dashed #FFFFFF;
        z-index:1;
        transform: translate(-2px,0px);
        animation: ${({ animationState }) => (animationState === 'animate') ? Animation1 : 'none'} 1.5s linear infinite;
    }
`
const Arrow = styled.img<{ animationState: string }>`
      opacity: ${({ animationState }) => (animationState === 'final') ? 1 : 0.2};
      transition: all 0.2s ease-in-out;
      transform: rotate(-90deg);
`


const SwapVisualMobile = ({ animationState,destinationChain, sourceChain, destinationAsset, sourceAsset  }: Props) => {
    return (
        <Wrapper>
            <Content>
                <AssetWrapper>
                    <AssetImage src={chainLogos[sourceChain.networkId]} />
                    <AssetName>{sourceAsset && sourceAsset.symbol}</AssetName>
                </AssetWrapper>
                <AnimationLine>
                    <Line animationState={animationState}></Line>
                    <Arrow src={head} animationState={animationState} />
                </AnimationLine>
                <AssetWrapper>
                    <AssetImage src={chainLogos[destinationChain.networkId]} />
                    <AssetName>{destinationAsset && destinationAsset.symbol}</AssetName>
                </AssetWrapper>
            </Content>
        </Wrapper>
    )
}

export default SwapVisualMobile
