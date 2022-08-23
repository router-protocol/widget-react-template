import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import Background from './Background'
import Header from './component/Header'
import chainLookUp from './config/chainLookUp'
import { NetworkType } from './config/network'
import Swap from './Swap'



const initialNetwork = {
  "name": "Loading...",
  "type": "ethereum",
  "networkId": "00",
  "id": "100",
  "endpoint": "https://kovan.infura.io/v3/3877c4f6eadd45358883ddd7524c683d",
  "socket": "",
  "from": "0x56198cf901DF71ff3619A5320e5241F920f0BdAE",
  "stakingRewardsFactory": "0x75aE0D811A13F23d6E3267c4fecDb4814022A144",
  "rewardsToken": "0xDAb5Ef1E852c3a77D1BCe6f143A55838CF72b060",
  "feeHandler": "",
  "opts": {
    "http": "true",
    "bridge": "0x123e8Bc6d55F667ae9B0e3cFEB74DaB5C09a8da2",
    "erc20Handler": "0xa3f8f05f1Bebf50022f947c7a122c12d350728F9",
    "reserveHandler": "",
    "oneSplit": "",
    "genericHandler": "0x13a9252379872004F19Ca0D1D0cbcEE06Eb0b8ce",
    "gasLimit": "1000000",
    "maxGasPrice": "10000000000"
  }
}

export const DEFAULT_SOURCE_NETWORK_ID = "137"
export const DEFAULT_DESTINATION_NETWORK_ID = "56"
export const DEFAULT_SOURCE_TOKEN_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
export const DEFAULT_DESTINATION_TOKEN_ADDRESS = "0xfD2700c51812753215754De9EC51Cdd42Bf725B9"

declare global {
  interface Window {
    //@ts-ignore
    ethereum: any;
    modalProvider: any;
    walletProvider: any;
  }
}

const Content = styled.div<{ backgroundColor: string }>`
  width:100%;
  height:100%;
  background: ${({ backgroundColor }) => backgroundColor ? backgroundColor : "linear-gradient(180deg, #2E3146 -165.39%, #0A0A0E 100%)"};
  display: flex;
  justify-content: center;
  padding-top: 150px;
  max-width: 100vw;
  overflow-x: hidden;
  `
//const provider = window.walletProvider //Take this from user
//const provider = window.ethersProvider //Make this in the app
export default function RouterWidget({ useWidgetWallet, accountAddress, widgetId, ctaColor, textColor, backgroundColor }: { useWidgetWallet: boolean; accountAddress: string, widgetId: string, ctaColor: string, textColor: string, backgroundColor: string }) {
  const [currentNetwork, setCurrentNetwork] = useState<NetworkType | ''>(initialNetwork)
  const [walletId, setWalletId] = useState('')
  const [currentAccountAddress, setCurrentAccountAddress] = useState(accountAddress)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [networkId, setNetworkId] = useState('')

  const changeChainListener = useCallback(() => {
    const provider = window.walletProvider
    provider?.on('chainChanged', () => {
      //chamge current wallet network
      console.log('Wallet Chain Changed')
      setTimeout(() => {
        setNetworkId(parseInt(provider.chainId, 16).toString());
        if (chainLookUp[parseInt(provider.chainId, 16).toString()]) {
          setCurrentNetwork(chainLookUp[parseInt(provider.chainId, 16).toString()]);
        } else {
          setCurrentNetwork('');
        }
      }, 0);
    });
  }, [setNetworkId, setCurrentNetwork])

  useEffect(() => {
    if (!useWidgetWallet) {
      changeChainListener()
    }
    return () => {
      window?.walletProvider?.removeAllListeners()
    }
  }, [changeChainListener])

  return (
    <>
      {/* <Background /> */}
      <Content backgroundColor={backgroundColor}>
        <Header
          currentNetwork={currentNetwork}
          setCurrentNetwork={setCurrentNetwork}
          walletId={walletId}
          setWalletId={setWalletId}
          currentAccountAddress={currentAccountAddress}
          setCurrentAccountAddress={setCurrentAccountAddress}
          isWalletConnected={isWalletConnected}
          setIsWalletConnected={setIsWalletConnected}
          networkId={networkId}
          setNetworkId={setNetworkId}
          useWidgetWallet={useWidgetWallet}
          ctaColor={ctaColor}
          textColor={textColor}
          backgroundColor={backgroundColor}
        />
        <Swap
          currentNetwork={currentNetwork}
          setCurrentNetwork={setCurrentNetwork}
          walletId={walletId}
          setWalletId={setWalletId}
          currentAccountAddress={currentAccountAddress}
          setCurrentAccountAddress={setCurrentAccountAddress}
          isWalletConnected={isWalletConnected}
          setIsWalletConnected={setIsWalletConnected}
          widgetId={widgetId}
          ctaColor={ctaColor}
          textColor={textColor}
          backgroundColor={backgroundColor}
        />
      </Content>
    </>
  )
}
