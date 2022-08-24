import { Contract, Provider } from "ethers-multicall";
const ethers = require("ethers");
const Web3 = require("web3");

const CONTRACT_PATH = "./contracts/abis";

const ContractABIs = {
  Bridge: require(CONTRACT_PATH + "/Bridge.json"),
  Erc20Handler: require(CONTRACT_PATH + "/ERC20Handler.json"),
  OneSplit: require(CONTRACT_PATH + "/OneSplitWrap.json"),
  RouterERC20: require(CONTRACT_PATH + "/RouterERC20.json"),
  ERC20Token: require(CONTRACT_PATH + "/ERC20PresentMinterPauser.json"),
  StakingRewards: require(CONTRACT_PATH + "/StakingRewards.json"),
  FeeHandler: require(CONTRACT_PATH + "/FeeHandler.json"),
  Weth: require(CONTRACT_PATH + "/Weth.json"),
  PositionNFT: require(CONTRACT_PATH + "/Position-Nft.json"),
  UniV3Staker: require(CONTRACT_PATH + "/Staker.json"),
};

const getBalance = async (args) => {
  try {
    //console.log('getBalance - ',args)
    const erc20Instance = new ethers.Contract(
      args.tokenAddress,
      ContractABIs.ERC20Token.abi,
      args.provider
    );
    //console.log('instance =============', erc20Instance)
    const result = await erc20Instance.balanceOf(args.accountAddress);
    //console.log('====-------',result)
    // result looks like this : { _hex: '0x021beec43da88aa00000', _isBigNumber: true }
    return ethers.utils.formatUnits(result.toString(), args.tokenDecimals);
  } catch (error) {
    //console.log("Error ", error);
  }
};

const getBalanceMulticaller = (args) => {
  const erc20Instance = new Contract(
    args.tokenAddress,
    ContractABIs.ERC20Token.abi
  );
  return erc20Instance.balanceOf(args.accountAddress);
};

const getTokenDetails = async (args) => {
  const erc20Instance = new Contract(
    args.tokenAddress,
    ContractABIs.ERC20Token.abi
  );
  //rpc provider required
  const ethcallProvider = new Provider(args.provider, Number(args.networkId));
  try {
    const tokenDetails = await ethcallProvider.all([
      erc20Instance.name(),
      erc20Instance.symbol(),
      erc20Instance.decimals(),
    ]);
    console.log("tokenDetails - ", tokenDetails);
    //returns an array
    return tokenDetails;
  } catch (e) {
    console.log("Find token error -", e);
  }
};

const getExecutionBlock = async (args) => {
  try {
    const erc20HandlerInstance = new ethers.Contract(
      args.erc20Handler,
      ContractABIs.Erc20Handler.abi,
      args.provider
    );
    const record = await await erc20HandlerInstance.executeRecord(
      args.sourceChainId,
      args.depositNonce
    );
    return record.toString();
  } catch (e) {
    console.log("getExecutionBlock error contract functions - ", e);
  }
};

export {
  getBalance,
  getBalanceMulticaller,
  getTokenDetails,
  getExecutionBlock,
};
