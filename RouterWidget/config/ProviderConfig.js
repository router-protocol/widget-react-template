import WalletConnectProvider from "@walletconnect/web3-provider";
import Fortmatic from "fortmatic";
import Torus from "@toruslabs/torus-embed";
import Authereum from "authereum";
import { Bitski } from "bitski";
import Portis from "@portis/web3";
import metamaskLogo from "../assets/images/wallet-logos/metamask.svg";
import walletconnectLogo from "../assets/images/wallet-logos/walletconnect-circle.svg";
import fortmaticLogo from "../assets/images/wallet-logos/fortmatic.svg";
import portisLogo from "../assets/images/wallet-logos/portis.svg";
import torusLogo from "../assets/images/wallet-logos/torus.svg";
import bitskiLogo from "../assets/images/wallet-logos/bitski.svg";
import coinbaseLogo from "../assets/images/wallet-logos/coinbase.svg";
import {
  BITSKI_KEY,
  FORTMATIC_KEY,
  INFURA_ID_WALLET,
  PORTIS_KEY,
} from "./config";

const providerOptions = {
  injected: {
    package: null,
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: INFURA_ID_WALLET,
      rpc: {
        137:"https://polygon-rpc.com",
        56:"https://bsc-dataseed.binance.org/",
        43114:"https://api.avax.network/ext/bc/C/rpc",
        250:"https://rpc.ftm.tools/",
        42161:"https://arb-mainnet.g.alchemy.com/v2/IhR5U7voO1FpUS3qn-58FYxlPndKtPnk",
        10:"https://mainnet.optimism.io",
        1:"https://eth-mainnet.alchemyapi.io/v2/ZR4W5xz6Q_Ok6Pvpp9e3yIG01MM39zL6",
        1666600000:"https://api.harmony.one",
        1313161554:"https://mainnet.aurora.dev",
        25:"https://evm.cronos.org",
      },
    },
  },
  torus: {
    package: Torus,
    //options: {}
  },
  fortmatic: {
    package: Fortmatic,
    options: {
      key: FORTMATIC_KEY,
    },
  },
  portis: {
    package: Portis,
    options: {
      id: PORTIS_KEY,
    },
  },
  authereum: {
    package: Authereum,
  },
  bitski: {
    package: Bitski,
    options: {
      clientId: BITSKI_KEY,
      callbackUrl: window.location.href + "bitski-callback.html",
    },
  },
};

const walletList = [
  {
    id: "injected",
    name: "Metamask",
    logo: metamaskLogo,
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    logo: walletconnectLogo,
  },
  {
    id: "walletlink",
    name: "Coinbase",
    logo: coinbaseLogo,
  },
  {
    id: "fortmatic",
    name: "Fortmatic",
    logo: fortmaticLogo,
  },
  {
    id: "portis",
    name: "Portis",
    logo: portisLogo,
  },
  {
    id: "torus",
    name: "Torus",
    logo: torusLogo,
  },
  {
    id: "bitski",
    name: "Bitski",
    logo: bitskiLogo,
  },
];

export { providerOptions, walletList };
