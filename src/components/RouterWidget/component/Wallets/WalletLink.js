import WalletLink from "walletlink";
import routerLogo from "../../assets/images/router-theme.png";
import chainLookUp from "../../config/chainLookUp";
import { DEFAULT_SOURCE_NETWORK_ID } from "../../config/config";

const srcChainId = localStorage.getItem("srcChain")
  ? JSON.parse(localStorage.getItem("srcChain") || "{}")
  : null;
const srcChain = srcChainId
  ? chainLookUp[srcChainId]
  : chainLookUp[DEFAULT_SOURCE_NETWORK_ID];

export const connectCoinbase = async () => {
  const provider = new WalletLink({
    appName: "Router",
    appLogoUrl: routerLogo,
    darkMode: true,
  });
  const web3Provider = await provider.makeWeb3Provider(
    srcChain.endpoint,
    Number(srcChainId)
  );

  return web3Provider;
};
