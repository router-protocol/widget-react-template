import ropstenAsset from './token/ropstenTestnet.ethereum.json'
import kovanAsset from './token/kovanTestnet.ethereum.json'
import maticAsset from './token/maticTestnet.ethereum.json'
import bscAsset from './token/bsc.mainnet.json'
import huobiAsset from './token/huobiTestnet.ethereum.json'
import avaxFujiAsset from './token/avax.testnet.json'
import avaxAsset from './token/avax.mainnet.json'
import okexAsset from './token/okex.testnet.json'
import ethereumAsset from './token/ethereum.mainnet.json'
import polgonAsset from './token/polygon.mainnet.json'
import ftmAsset from './token/ftm.mainnet.json'
import arbitrumAsset from './token/arbitrum.mainnet.json'
import optimismAsset from './token/optimism.mainnet.json'
import auroraAsset from './token/aurora.mainnet.json'
import harmonyAsset from './token/harmony.mainnet.json'
import cronosAsset from './token/cronos.mainnet.json'

import ropstenChainIcon from '../assets/images/chain-logos/ropsten-chain.png'
import kovanChainIcon from '../assets/images/chain-logos/kovan-chain.svg'
import maticChainIcon from '../assets/images/chain-logos/polygon-logo.svg'
import bscChainIcon from '../assets/images/chain-logos/bsc-chain.png'
import huobiChainIcon from '../assets/images/chain-logos/huobi-chain.svg'
import avaxChainIcon from '../assets/images/chain-logos/avax.svg'
import okexChainIcon from '../assets/images/chain-logos/okex-chain.png'
import fantomChainIcon from '../assets/images/chain-logos/ftm.svg'
import arbitrumChainIcon from '../assets/images/chain-logos/arbitrum.svg'
import optimismChainIcon from '../assets/images/chain-logos/optimism.png'
import croChainIcon from '../assets/images/chain-logos/cro-chain.svg'
import harmonyChainIcon from '../assets/images/chain-logos/harmony-one-chain.svg'
import auroraChainIcon from '../assets/images/chain-logos/aurora-chain.png'

import usdtAssetIcon from '../assets/images/token-logos/usdt-token.svg'
import bnbAssetIcon from '../assets/images/token-logos/bnb-token.svg'
import usdcAssetIcon from '../assets/images/token-logos/usdc-token.svg'
import daiAssetIcon from '../assets/images/token-logos/dai-token.svg'
import busdAssetIcon from '../assets/images/token-logos/busd-token.svg'
import husdAssetIcon from '../assets/images/token-logos/husd-token.svg'
import routeAssetIcon from '../assets/images/token-logos/route-coin.svg'
import dfynAssetIcon from '../assets/images/token-logos/dfyn-token.png'
import maticAssetIcon from '../assets/images/chain-logos/matic-chain.png'
//import rusdtAssetIcon from '../assets/images/route-rewards.png'

import defaultIcon from '../assets/vectors/warning.svg'
import { ChainId } from './flag'

export interface AssetType {
  name: string;
  symbol: string;
  decimals: string;
  address: string;
  chainId: string;
  logoURI: string;
  lpSymbol: string;
  lpAddress: string;
  stakingRewards: string;
  resourceId: string;
  lpResourceId: string;
  mappedOnBridge: boolean;
  native: boolean;
  hasLpToken: boolean;
  isLpToken: boolean;
  stableAsset: boolean;
  mining: boolean;
  activeMining: boolean;
  enableLiquidityMining: boolean;
}

export interface TokenListType {
  name: string;
  logoURI: string;
  timestamp: string;
  tokens: AssetType[];
}

const ETHEREUM_SUPPORTED_ASSETS: AssetType[] = ethereumAsset

const POLYGON_SUPPORTED_ASSETS: AssetType[] = polgonAsset

const ROPSTEN_NETWORK_ID: string = '3'
const ROPSTEN_SUPPORTED_ASSETS: AssetType[] = ropstenAsset

const KOVAN_SUPPORTED_ASSETS: AssetType[] = kovanAsset

const MATIC_SUPPORTED_ASSETS: AssetType[] = maticAsset

const BSC_SUPPORTED_ASSETS: AssetType[] = bscAsset

const HUOBI_NETWORK_ID: string = '256'
const HUOBI_SUPPORTED_ASSETS: AssetType[] = huobiAsset

const AVAX_SUPPORTED_ASSETS: AssetType[] = avaxAsset
const FTM_SUPPORTED_ASSETS: AssetType[] = ftmAsset
const ARBITRUM_SUPPORTED_ASSETS: AssetType[] = arbitrumAsset
const OPTIMISM_SUPPORTED_ASSETS: AssetType[] = optimismAsset
const AURORA_SUPPORTED_ASSETS: AssetType[] = auroraAsset
const HARMONY_SUPPORTED_ASSETS: AssetType[] = harmonyAsset
const CRONOS_SUPPORTED_ASSETS: AssetType[] = cronosAsset
const FUJI_SUPPORTED_ASSETS: AssetType[] = avaxFujiAsset

const OKEX_TESTNET_NETWORK_ID: string = '65'
const OKEX_TESTNET_SUPPORTED_ASSETS: AssetType[] = okexAsset

const DEFAULT_ICON = 'default'

const assetList = {
  [ROPSTEN_NETWORK_ID]: ROPSTEN_SUPPORTED_ASSETS,
  [ChainId.KOVAN]: KOVAN_SUPPORTED_ASSETS,
  [ChainId.MUMBAI]: MATIC_SUPPORTED_ASSETS,
  [ChainId.BSC]: BSC_SUPPORTED_ASSETS,
  [HUOBI_NETWORK_ID]: HUOBI_SUPPORTED_ASSETS,
  [ChainId.AVALANCHE]: AVAX_SUPPORTED_ASSETS,
  [ChainId.FUJI]: FUJI_SUPPORTED_ASSETS,
  [ChainId.MAINNET]: ETHEREUM_SUPPORTED_ASSETS,
  [ChainId.POLYGON]: POLYGON_SUPPORTED_ASSETS,
  [ChainId.FANTOM]: FTM_SUPPORTED_ASSETS,
  [ChainId.ARBITRUM]: ARBITRUM_SUPPORTED_ASSETS,
  [ChainId.OPTIMISM]: OPTIMISM_SUPPORTED_ASSETS,
  [ChainId.AURORA]: AURORA_SUPPORTED_ASSETS,
  [ChainId.HARMONY]: HARMONY_SUPPORTED_ASSETS,
  [ChainId.CRONOS]: CRONOS_SUPPORTED_ASSETS,
  [OKEX_TESTNET_NETWORK_ID]: OKEX_TESTNET_SUPPORTED_ASSETS,
  [DEFAULT_ICON]: KOVAN_SUPPORTED_ASSETS,
}

export const DEFAULT_ROUTE_TOKEN_LIST = "https://raw.githubusercontent.com/router-protocol/reserve-asset-list/main/router-reserve-asset.json"

const remoteAssetList = [
  "https://raw.githubusercontent.com/dfyn/new-host/main/list-token.tokenlist.json",
  "https://unpkg.com/quickswap-default-token-list@1.2.20/build/quickswap-default.tokenlist.json",
  "https://tokens.pancakeswap.finance/pancakeswap-extended.json",
  "https://tokens.pancakeswap.finance/pancakeswap-top-100.json",
  "https://tokens.uniswap.org/",
  "https://raw.githubusercontent.com/pangolindex/tokenlists/main/pangolin.tokenlist.json",
  "https://raw.githubusercontent.com/pangolindex/tokenlists/main/wgm.tokenlist.json",
  "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/joe.tokenlist.json",
  "https://bridge.arbitrum.io/token-list-42161.json",
  "https://static.optimism.io/optimism.tokenlist.json",
  "https://raw.githubusercontent.com/SpookySwap/spooky-info/master/src/constants/token/spookyswap.json",
  DEFAULT_ROUTE_TOKEN_LIST
]

const defaultActiveList = [
  "https://raw.githubusercontent.com/dfyn/new-host/main/list-token.tokenlist.json",
  "https://tokens.pancakeswap.finance/pancakeswap-extended.json",
  "https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/joe.tokenlist.json",
  "https://bridge.arbitrum.io/token-list-42161.json",
  "https://static.optimism.io/optimism.tokenlist.json",
  "https://raw.githubusercontent.com/SpookySwap/spooky-info/master/src/constants/token/spookyswap.json",
  "https://tokens.uniswap.org/",
  "https://aurora.dev/tokens.json",
  "https://token-list.sushi.com/",
  DEFAULT_ROUTE_TOKEN_LIST
]

const chainLogos: { [x: string]: string; } = {
  [ROPSTEN_NETWORK_ID]: ropstenChainIcon,
  [ChainId.KOVAN]: kovanChainIcon,
  [ChainId.MUMBAI]: maticChainIcon,
  [ChainId.BSC]: bscChainIcon,
  [HUOBI_NETWORK_ID]: huobiChainIcon,
  [ChainId.AVALANCHE]: avaxChainIcon,
  [ChainId.FUJI]: avaxChainIcon,
  [ChainId.MAINNET]: ropstenChainIcon,
  [ChainId.POLYGON]: maticChainIcon,
  [ChainId.FANTOM]: fantomChainIcon,
  [ChainId.ARBITRUM]: arbitrumChainIcon,
  [ChainId.OPTIMISM]: optimismChainIcon,
  [ChainId.AURORA]: auroraChainIcon,
  [ChainId.HARMONY]: harmonyChainIcon,
  [ChainId.CRONOS]: croChainIcon,
  [OKEX_TESTNET_NETWORK_ID]: okexChainIcon,
  [DEFAULT_ICON]: defaultIcon,
}

const assetLogos: { [key: string]: string } = {
  "USDT": usdtAssetIcon,
  "USDC": usdcAssetIcon,
  "USDC.e": usdcAssetIcon,
  "DAI": daiAssetIcon,
  "BUSD": busdAssetIcon,
  "HUSD": husdAssetIcon,
  "ROUTE": routeAssetIcon,
  "DFYN": dfynAssetIcon,
  "AVAX": avaxChainIcon,
  "WAVAX": avaxChainIcon,
  "RAVAX": avaxChainIcon,
  "ETH": ropstenChainIcon,
  "WETH": ropstenChainIcon,
  "MATIC": maticAssetIcon,
  "WMATIC": maticAssetIcon,
  "RUSDT": usdtAssetIcon,
  "RETH": ropstenChainIcon,
  "RMATIC": maticAssetIcon,
  "RUSDC": usdcAssetIcon,
  "RDAI": daiAssetIcon,
  "RBUSD": busdAssetIcon,
  "RHUSD": husdAssetIcon,
  "RROUTE": routeAssetIcon,
  "RDFYN": dfynAssetIcon,
  "BNB": bnbAssetIcon,
  "WBNB": bnbAssetIcon,
  "RBNB": bnbAssetIcon,
  "FTM": fantomChainIcon,
  "WFTM": fantomChainIcon,
  "RFTM": fantomChainIcon,
  "ONE": harmonyChainIcon,
  "CRO": croChainIcon,
  "RONE": harmonyChainIcon,
  "RCRO": croChainIcon,
  [DEFAULT_ICON]: "https://cdn.shopify.com/s/files/1/1061/1924/products/Thinking_Face_Emoji_small.png?v=1571606036",
}

const assetLogosForCard = (symbol: string) => {
  switch (symbol) {
    case "USDT":
      return usdtAssetIcon
    case "USDC":
      return usdcAssetIcon
    case "USDC.e":
      return usdcAssetIcon
    case "DAI":
      return daiAssetIcon
    case "BUSD":
      return busdAssetIcon
    case "HUSD":
      return husdAssetIcon
    case "ROUTE":
      return routeAssetIcon
    case "DFYN":
      return dfynAssetIcon
    case "RUSDT":
      return usdtAssetIcon
    case "ETH":
      return ropstenChainIcon
    case "AVAX":
      return avaxChainIcon
    case "WAVAX":
      return avaxChainIcon
    case "RAVAX":
      return avaxChainIcon
    case "WETH":
      return ropstenChainIcon
    case "RETH":
      return ropstenChainIcon
    case "MATIC":
      return maticAssetIcon
    case "WMATIC":
      return maticAssetIcon
    case "RMATIC":
      return maticAssetIcon
    case "BNB":
      return bnbAssetIcon
    case "WBNB":
      return bnbAssetIcon
    case "RBNB":
      return bnbAssetIcon
    case "FTM":
      return fantomChainIcon
    case "WFTM":
      return fantomChainIcon
    case "RFTM":
      return fantomChainIcon
    case "ONE":
      return harmonyChainIcon
    case "CRO":
      return croChainIcon
    case "RONE":
      return harmonyChainIcon
    case "RCRO":
      return croChainIcon
    default:
      return "https://cdn.shopify.com/s/files/1/1061/1924/products/Thinking_Face_Emoji_small.png?v=1571606036"
  }
}

const platformIdLookup = {
  [ChainId.KOVAN]: 'ethereum',
  [ChainId.MUMBAI]: 'ethereum',
  [ChainId.BSC]: 'binance-smart-chain',
  [HUOBI_NETWORK_ID]: 'huobi-token',
  [DEFAULT_ICON]: 'ethereum',
}


const assetListPriceFetch: { [key: string]: string } = {
  'USDC': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  'USDT': '0xdac17f958d2ee523a2206206994597c13d831ec7',
  'RUSDT': '0xdac17f958d2ee523a2206206994597c13d831ec7',
  'DAI': '0x6b175474e89094c44da98b954eedeac495271d0f',
  'BUSD': '0xe9e7cea3dedca5984780bafc599bd69add087d56',
  'HUSD': '0x0298c2b32eae4da002a15f36fdf7615bea3da047',
  'ROUTE': '0x16eccfdbb4ee1a85a33f3a9b21175cd7ae753db4',
  'DFYN': '0x9695e0114e12c0d3a3636fab5a18e6b737529023',
  'MATIC': '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
  'RMATIC': '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
  'OKT': '0x70c1c53E991F31981d592C2d865383AC0d212225',
  'AAVE': "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
  AMP: "0x0621d647cecbFb64b79E44302c1933cB4f27054d",
  ANT: "0x960b236A07cf122663c4303350609A66A7B288C0",
  BAL: "0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3",
  BAND: "0xA8b1E0764f85f53dfe21760e8AfE5446D82606ac",
  BNT: "0xc26D47d5c33aC71AC5CF9F776D63Ba292a4F7842",
  COMP: "0x8505b9d2254A7Ae468c0E9dd10Ccea3A837aef5c",
  CRV: "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
  CVC: "0x66Dc5A08091d1968e08C16aA5b27BAC8398b02Be",
  DNT: "0x0AbdAce70D3790235af448C88547603b945604ea",
  ENS: "0xbD7A5Cf51d22930B8B3Df6d834F9BCEf90EE7c4f",
  GNO: "0x5FFD62D3C3eE2E81C00A7b9079FB248e7dF024A8",
  GRT: "0x5fe2B58c013d7601147DcdD68C143A77499f5531",
  KEEP: "0x42f37A1296b2981F7C3cAcEd84c5096b2Eb0C72C",
  KNC: "0x324b28d6565f784d596422B0F2E5aB6e9CFA1Dc7",
  LINK: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
  LOOM: "0x66EfB7cC647e0efab02eBA4316a2d2941193F6b3",
  LRC: "0x84e1670F61347CDaeD56dcc736FB990fBB47ddC1",
  MANA: "0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4",
  MKR: "0x6f7C932e7684666C9fd1d44527765433e01fF61d",
  MLN: "0xec67005c4E498Ec7f55E092bd1d35cbC47C91892",
  NMR: "0x0Bf519071b02F22C17E7Ed5F4002ee1911f46729",
  NU: "0x4fE83213D56308330EC302a8BD641f1d0113A4Cc",
  OXT: "0x9880e3dDA13c8e7D4804691A45160102d31F6060",
  REN: "0x19782D3Dc4701cEeeDcD90f0993f0A9126ed89d0",
  REP: "0x1985365e9f78359a9B6AD760e32412f4a445E862",
  REPv2: "0x6563c1244820CfBd6Ca8820FBdf0f2847363F733",
  SNX: "0x50B728D8D964fd00C2d0AAD81718b71311feF68a",
  STORJ: "0xd72357dAcA2cF11A5F155b9FF7880E595A3F5792",
  TBTC: "0x50a4a434247089848991DD8f09b889D4e2870aB6",
  UMA: "0x3066818837c5e6eD6601bd5a91B0762877A6B731",
  UNI: "0xb33EaAd8d922B1083446DC23f610c2567fB5180f",
  WBTC: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
  WETH: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
  WMATIC: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
  YFI: "0xDA537104D6A5edd53c6fBba9A898708E465260b6",
  ZRX: "0x5559Edb74751A0edE9DeA4DC23aeE72cCA6bE3D5",
  sUSD: "0xF81b4Bec6Ca8f9fe7bE01CA734F55B2b6e03A7a0",
}

export interface FeeObjectType {
  [key: string]: {
    fee: any[];
    feeAmount: string;
    feeUsd: string;
    show: boolean;
  }
}

export {
  assetList,
  chainLogos,
  assetLogos,
  assetLogosForCard,
  platformIdLookup,
  assetListPriceFetch,
  remoteAssetList,
  defaultActiveList
} 