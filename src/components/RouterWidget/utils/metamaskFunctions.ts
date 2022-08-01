//@ts-nocheck
import { ethers } from "ethers";
import { IS_MAINNET } from "../config/config";
const { ethereum } = window;

// let provider: ethers.providers.Web3Provider
// let signer: ethers.providers.JsonRpcSigner

// if(ethereum){
// provider = new ethers.providers.Web3Provider(window.ethereum)
// signer = provider.getSigner()
// }

// export {provider, signer}


//ethereum.selectedAddress//current account address 
//ethereum.networkVersion// current chain network ID
//ethereum.isConnected(): boolean;    Returns true if the provider is connected to the current chain, and false otherwise.



export const getAccountsAddress = async () => {
  try {
    //@ts-ignore
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    //@ts-ignore
    return accounts[0]
  }
  catch (err) {
    console.log('Error: ', err?.message);
  }
}

export const getMetamaskConnectionState = () => {
  if (typeof window.ethereum !== 'undefined') return true
  else return false
}

export const getRpcConnectionState = () => ethereum?.isConnected() //Returns true if the provider is connected to the current chain, and false otherwise.


let params: any

// paramsTestnet[0] is insignificant, it is there as a place  holder
const paramsTestnet = [
  {
    "chainId": "0x2A",
    "chainName": "Kovan Test Network",
    "rpcUrls": [
      "https://ropsten.infura.io/v3/"
    ],
    "iconUrls": [
      "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=010"
    ],
    "blockExplorerUrls": [
      "https://kovan.etherscan.io"
    ],
    "nativeCurrency": {
      "name": "Kovan ETH",
      "symbol": "ETH",
      "decimals": 18
    },
  },
  {
    "chainId": "0x2A",
    "chainName": "Kovan Test Network",
    "rpcUrls": [
      "https://ropsten.infura.io/v3/"
    ],
    "iconUrls": [
      "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=010"
    ],
    "blockExplorerUrls": [
      "https://kovan.etherscan.io"
    ],
    "nativeCurrency": {
      "name": "Kovan ETH",
      "symbol": "ETH",
      "decimals": 18
    },
  },
  {
    "chainId": "0x13881",
    "chainName": "Mumbai Testnet",
    "rpcUrls": [
      "https://rpc-mumbai.maticvigil.com/"
    ],
    "iconUrls": [
      "https://cryptologos.cc/logos/polygon-matic-logo.png?v=010"
    ],
    "blockExplorerUrls": [
      "https://mumbai.polygonscan.com"
    ],
    "nativeCurrency": {
      "name": "Matic Token",
      "symbol": "MATIC",
      "decimals": 18
    },
  },
  {
    "chainId": "0x3",
    "chainName": "Ropsten Test Network",
    "rpcUrls": [
      "https://ropsten.infura.io/v3/"
    ],
    "iconUrls": [
      "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=010"
    ],
    "blockExplorerUrls": [
      "https://ropsten.etherscan.io"
    ],
    "nativeCurrency": {
      "name": "Ropsten ETH",
      "symbol": "ETH",
      "decimals": 18
    },
  },
  {
    "chainId": "0xa869",
    "chainName": "Avalanche FUJI C-Chain",
    "rpcUrls": [
      "https://api.avax-test.network/ext/bc/C/rpc"
    ],
    "iconUrls": [
      "https://cryptologos.cc/logos/huobi-token-ht-logo.png?v=010"
    ],
    "blockExplorerUrls": [
      "https://testnet.snowtrace.io/"
    ],
    "nativeCurrency": {
      "name": "AVAX",
      "symbol": "AVAX",
      "decimals": 18
    },
  },
  // {
  //     "chainId": "0x61",
  //     "chainName": "BSC Testnet",
  //     "rpcUrls": [
  //         "https://data-seed-prebsc-1-s1.binance.org:8545/"
  //     ],
  //     "iconUrls": [
  //         "https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=010"
  //       ],
  //     "blockExplorerUrls": [
  //         "https://testnet.bscscan.com/"
  //     ],
  //     "nativeCurrency": {
  //         "name": "BNB Token",
  //         "symbol": "BNB",
  //         "decimals": 18
  //     },
  // },
  // {
  //     "chainId": "0x100",
  //     "chainName": "Huobi Testnet",
  //     "rpcUrls": [
  //         "https://http-testnet.hecochain.com"
  //     ],
  //     "iconUrls": [
  //         "https://cryptologos.cc/logos/huobi-token-ht-logo.png?v=010"
  //       ],
  //     "blockExplorerUrls": [
  //         "https://testnet.hecoinfo.com/"
  //     ],
  //     "nativeCurrency": {
  //         "name": "Huobi Token",
  //         "symbol": "HT",
  //         "decimals": 18
  //     },
  // },
  // {
  //     "chainId": "0xa869",
  //     "chainName": "Avalanche FUJI C-Chain",
  //     "rpcUrls": [
  //         "https://api.avax-test.network/ext/bc/C/rpc"
  //     ],
  //     "iconUrls": [
  //         "https://cryptologos.cc/logos/huobi-token-ht-logo.png?v=010"
  //       ],
  //     "blockExplorerUrls": [
  //         "https://cchain.explorer.avax-test.network/"
  //     ],
  //     "nativeCurrency": {
  //         "name": "AVAX",
  //         "symbol": "AVAX",
  //         "decimals": 18
  //     },
  // },
  // {
  //     "chainId": "0x41",
  //     "chainName": "OKExChain Testnet",
  //     "rpcUrls": [
  //         "https://exchaintestrpc.okex.org"
  //     ],
  //     "iconUrls": [
  //         "https://cryptologos.cc/logos/huobi-token-ht-logo.png?v=010"
  //       ],
  //     "blockExplorerUrls": [
  //         "https://www.oklink.com/okexchain-test/"
  //     ],
  //     "nativeCurrency": {
  //         "name": "OKT",
  //         "symbol": "OKT",
  //         "decimals": 18
  //     },
  // },
]

// paramsMainnet[0] is insignificant, it is there as a place  holder

const paramsMainnet = [
  {
    "chainId": "0x1",
    "chainName": "Ethereum Mainnet",
    "rpcUrls": [
      "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    ],
    "iconUrls": [
      "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=010"
    ],
    "blockExplorerUrls": [
      "https://etherscan.io"
    ],
    "nativeCurrency": {
      "name": "Ethereum",
      "symbol": "ETH",
      "decimals": 18
    },
  },
  {
    "chainId": "0x89",
    "chainName": "Polygon",
    "rpcUrls": [
      "https://polygon-rpc.com",
    ],
    "iconUrls": [
      "https://cryptologos.cc/logos/polygon-matic-logo.png?v=010"
    ],
    "blockExplorerUrls": [
      "https://polygonscan.com/"
    ],
    "nativeCurrency": {
      "name": "Matic Token",
      "symbol": "MATIC",
      "decimals": 18
    },
  },
  {
    "chainId": "0x38",
    "chainName": "BSC",
    "rpcUrls": [
      "https://bsc-dataseed.binance.org",
    ],
    "iconUrls": [
      "https://cryptologos.cc/logos/polygon-matic-logo.png?v=010"
    ],
    "blockExplorerUrls": [
      "https://bscscan.com/"
    ],
    "nativeCurrency": {
      "name": "BNB Token",
      "symbol": "BNB",
      "decimals": 18
    },
  },
  {
    "chainId": "0xa86a",
    "chainName": "Avalanche",
    "rpcUrls": [
      "https://api.avax.network/ext/bc/C/rpc",
    ],
    "iconUrls": [
      "https://cryptologos.cc/logos/polygon-matic-logo.png?v=010"
    ],
    "blockExplorerUrls": [
      "https://snowtrace.io/"
    ],
    "nativeCurrency": {
      "name": "AVAX Token",
      "symbol": "AVAX",
      "decimals": 18
    },
  },
  {
    "chainId": "0xfa",
    "chainName": "Fantom",
    "rpcUrls": [
      "https://rpc.ftm.tools/",
    ],
    "iconUrls": [
      "https://cryptologos.cc/logos/fantom-ftm-logo.png?v=022"
    ],
    "blockExplorerUrls": [
      "https://ftmscan.com/"
    ],
    "nativeCurrency": {
      "name": "FTM Token",
      "symbol": "FTM",
      "decimals": 18
    },
  },
  {
    "chainId": "0xa4b1",
    "chainName": "Arbitrum",
    "rpcUrls": [
      "https://arb1.arbitrum.io/rpc",
    ],
    "iconUrls": [
      "https://cryptologos.cc/logos/polygon-matic-logo.png?v=010"
    ],
    "blockExplorerUrls": [
      "https://arbiscan.io"
    ],
    "nativeCurrency": {
      "name": "ETH",
      "symbol": "ETH",
      "decimals": 18
    },
  },
  {
    "chainId": "0xa",
    "chainName": "Optimism",
    "rpcUrls": [
      "https://mainnet.optimism.io/",
    ],
    "iconUrls": [
      "https://cryptologos.cc/logos/polygon-matic-logo.png?v=010"
    ],
    "blockExplorerUrls": [
      "https://optimistic.etherscan.io"
    ],
    "nativeCurrency": {
      "name": "ETH",
      "symbol": "ETH",
      "decimals": 18
    },
  },
  {
    "chainId": "0x1",
    "chainName": "ETH",
    "rpcUrls": [
      "https://mainnet.infura.io/v3",
    ],
    "iconUrls": [
      "https://cryptologos.cc/logos/polygon-matic-logo.png?v=010"
    ],
    "blockExplorerUrls": [
      "https://etherscan.io"
    ],
    "nativeCurrency": {
      "name": "ETH",
      "symbol": "ETH",
      "decimals": 18
    },
  },
  {
    "chainId": "0x63564c40",
    "chainName": "Harmony",
    "rpcUrls": [
      "https://api.harmony.one",
    ],
    "iconUrls": [
      "https://cryptologos.cc/logos/polygon-matic-logo.png?v=010"
    ],
    "blockExplorerUrls": [
      "https://explorer.harmony.one/"
    ],
    "nativeCurrency": {
      "name": "ONE",
      "symbol": "ONE",
      "decimals": 18
    },
  },
  {
    "chainId": "0x4e454152",
    "chainName": "Aurora",
    "rpcUrls": [
      "https://mainnet.aurora.dev",
    ],
    "iconUrls": [
      "https://cryptologos.cc/logos/polygon-matic-logo.png?v=010"
    ],
    "blockExplorerUrls": [
      "https://aurorascan.dev/"
    ],
    "nativeCurrency": {
      "name": "ETH",
      "symbol": "ETH",
      "decimals": 18
    },
  },
  {
    "chainId": "0x19",
    "chainName": "Cronos",
    "rpcUrls": [
      "https://evm.cronos.org",
    ],
    "iconUrls": [
      "https://cryptologos.cc/logos/polygon-matic-logo.png?v=010"
    ],
    "blockExplorerUrls": [
      "https://cronoscan.com"
    ],
    "nativeCurrency": {
      "name": "CRO",
      "symbol": "CRO",
      "decimals": 18
    },
  },
]

params = IS_MAINNET ? paramsMainnet : paramsTestnet

export const switchNetworkInMetamask = (id: string) => {
  if (ethereum) {
    // @ts-ignore
    if (IS_MAINNET && id === '7') {
      const formattedChainId = ethers.utils.hexStripZeros(ethers.BigNumber.from(params[Number(id)]['chainId']).toHexString())
      ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: formattedChainId }]
      }).catch((e: any) => console.log(e))
      return
    }
    if (!IS_MAINNET && (id === '1' || id === '3')) {
      const formattedChainId = ethers.utils.hexStripZeros(ethers.BigNumber.from(params[Number(id)]['chainId']).toHexString())
      ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: formattedChainId }]
      }).catch((e: any) => console.log(e))
      return
    }

    console.log('switch non-ethereum chains')

    ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [params[Number(id)]], // you must have access to the specified account
    })
      .then((result: any) => {
      })
      .catch((error: any) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log('We can encrypt anything without the key.');
        } else {
          console.error(error);
        }
      });
  }

}

export const addTokenToMetamask = async (address: string, symbol: string, decimals: any, url: string) => {

  if (!ethereum) return

  const res =
    await ethereum
      .request({
        method: 'wallet_watchAsset',
        params: {
          //@ts-ignore
          type: 'ERC20',
          options: {
            address: address,
            symbol: symbol,
            decimals: decimals,
            image: url,
          },
        },
      })

  return res
}
