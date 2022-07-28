import { IS_MAINNET } from "./config";

const rewardRate = "166";
const gasLimitForStable = IS_MAINNET ? "400000" : "1000000";
const gasLimitNormal = IS_MAINNET ? "600000" : "1000000";

const wmaticAddress = "0x136B1009Ab6324973BE63F100AED7578CC13f3Bc";

const balanceCallInterval = 60000; //in milliseconds
const rewardFetchingCall = 60000; //in milliseconds
const userInactivityTimer = 600000; //in milliseconds
const pathFinderDataRefesh = 30000; //in milliseconds

export {
  rewardRate,
  gasLimitForStable,
  gasLimitNormal,
  balanceCallInterval,
  rewardFetchingCall,
  userInactivityTimer,
  pathFinderDataRefesh,
  wmaticAddress,
};
