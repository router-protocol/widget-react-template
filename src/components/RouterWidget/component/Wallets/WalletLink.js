import WalletLink from "walletlink";
import { DEFAULT_SOURCE_NETWORK_ID } from "../..";
import routerLogo from "../../assets/images/router-theme.png";
import chainLookUp from "../../config/chainLookUp";

const srcChain = chainLookUp['137'];

export const connectCoinbase = async () => {
  const provider = new WalletLink({
    appName: "Router",
    appLogoUrl: routerLogo,
    darkMode: true,
  });
  const web3Provider = await provider.makeWeb3Provider(
    srcChain.endpoint,
    Number("137")
  );

  return web3Provider;
};
