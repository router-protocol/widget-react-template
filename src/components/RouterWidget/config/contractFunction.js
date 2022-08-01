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

// const ContractABIs = {
//     Bridge: require(CONTRACT_PATH + '/Bridge-Stake.json'),
//     Erc20Handler: require(CONTRACT_PATH+"/ERC20Handler-Stake.json"),
//     RouterERC20: require(CONTRACT_PATH + "/RouterERC20.json"),
//     ERC20Token: require(CONTRACT_PATH + "/ERC20PresentMinterPauser.json"),
//     StakingRewards: require(CONTRACT_PATH + "/StakingRewards.json"),
// }

// const ContractABIs = {
//     Bridge: require(CONTRACT_PATH + "/Bridge.json"),
//     Erc20Handler: require(CONTRACT_PATH + "/ERC20Handler.json"),
//     ERC20Token: require(CONTRACT_PATH + "/ERC20PresentMinterPauser.json"),
//     RouterERC20: require(CONTRACT_PATH + "/RouterERC20.json"),
//     StakingRewards: require(CONTRACT_PATH + "/StakingRewards.json"),
// }

//const provider = new ethers.providers.Web3Provider(PROVIDER)//new ethers.providers.Web3Provider(window.ethereum);
//const signer = provider.getSigner();

const expandDecimals = (amount, decimals = 18) => {
  return ethers.utils.parseUnits(String(amount), decimals);
};

//let provider = new ethers.providers.JsonRpcProvider(PROVIDER);
//let wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const setApproval = async (args) => {
  try {
    console.log("Aprroval args - ", args);
    const erc20Instance = new ethers.Contract(
      args.erc20Address,
      ContractABIs.ERC20Token.abi,
      args.signer
    );
    //console.log(args, `Approving ${args.recipient} to spend ${args.amount} tokens `);
    const tx = await erc20Instance.approve(
      args.recipient,
      expandDecimals(args.amount, args.decimals)
    );
    //console.log("checking transaction hash ", tx);
    return tx;
    // let result = await args.provider.waitForTransaction(tx.hash);
    // //console.log("Checking setApproval result:",  result)
    // if (result?.status == 1) {
    //   return true;
    // }
    // return false;
  } catch (error) {
    console.log("Error", error);
  }
};

const setApprovalLP = async (args) => {
  try {
    const erc20Instance = new ethers.Contract(
      args.erc20Address,
      ContractABIs.RouterERC20.abi,
      args.signer
    );
    //console.log(args, `Approving ${args.recipient} to spend ${args.amount} tokens `);
    const tx = await erc20Instance.approve(
      args.recipient,
      expandDecimals(args.amount, args.decimals)
    );
    //console.log("checking transaction hash ", tx);
    return tx;
    // let result = await args.provider.waitForTransaction(tx.hash);
    // //console.log("Checking setApproval result:",  result)
    // if (result?.status == 1) {
    //   return true;
    // }
    // return false;
  } catch (error) {
    console.log("Error", error);
  }
};

const getApproval = async (args) => {
  try {
    const erc20Instance = new ethers.Contract(
      args.tokenAddress,
      ContractABIs.ERC20Token.abi,
      args.provider
    );
    const result = await erc20Instance.allowance(
      args.userAddress,
      args.spenderAddress
    );
    // result looks like this : { _hex: '0x021beec43da88aa00000', _isBigNumber: true }

    // this return value needs to be compared with the user amount
    // console.log("get approval args - ",args)
    // console.log("approval value - ",ethers.utils.formatUnits(result.toString(), args.tokenDecimals))
    
    return ethers.utils.formatUnits(result.toString(), args.tokenDecimals);
  } catch (error) {
    console.log("Error", error);
  }
};

const getApprovalMulticaller = (args) => {
  const erc20Instance = new Contract(
    args.tokenAddress,
    ContractABIs.ERC20Token.abi
  );
  return erc20Instance.allowance(args.userAddress,args.spenderAddress);
};

const getApprovalLP = async (args) => {
  try {
    const erc20Instance = new ethers.Contract(
      args.tokenAddress,
      ContractABIs.RouterERC20.abi,
      args.signer
    );
    const result = await erc20Instance.allowance(
      args.userAddress,
      args.spenderAddress
    );
    // result looks like this : { _hex: '0x021beec43da88aa00000', _isBigNumber: true }

    // this return value needs to be compared with the user amount
    return ethers.utils.formatUnits(result.toString(), args.tokenDecimals);
  } catch (error) {
    console.log("Error", error);
  }
};

const toHex = (covertThis, padding) => {
  //This checks if padding < convertThis, then error is not thrown in ethers-v5
  if (
    ethers.utils.hexlify(ethers.BigNumber.from(covertThis)).length >
    2 * padding + 2
  )
    return ethers.utils.hexlify(ethers.BigNumber.from(covertThis));

  return ethers.utils.hexZeroPad(
    ethers.utils.hexlify(ethers.BigNumber.from(covertThis)),
    padding
  );
};

const createERCDepositData = (
  srcTokenAmountOrID,
  stableTokenAmountOrID,
  destStableTokenAmountOrID,
  destTokenAmountOrID,
  isDestNative,
  lenRecipientAddress,
  lenSrcTokenAddress,
  //lenDestStableTokenAddress,
  lenDestTokenAddress,
  widgetId,
  recipientAddress,
  srcTokenAddress,
  destStableTokenAddress,
  destTokenAddress
) => {
  return (
    "0x" +
    toHex(srcTokenAmountOrID, 32).substr(2) + // Token amount or ID to deposit (32 bytes)
    toHex(stableTokenAmountOrID, 32).substr(2) +
    toHex(destStableTokenAmountOrID, 32).substr(2) +
    toHex(destTokenAmountOrID, 32).substr(2) +
    toHex(isDestNative, 32).substr(2) +
    toHex(lenRecipientAddress, 32).substr(2) + // len(recipientAddress)          (32 bytes)
    toHex(lenSrcTokenAddress, 32).substr(2) +
    // toHex(lenDestStableTokenAddress, 32).substr(2) +
    toHex(lenDestTokenAddress, 32).substr(2) +
    toHex(widgetId, 32).substr(2) + // Widget ID (32 bytes)
    recipientAddress.substr(2) + // recipientAddress               (?? bytes)
    srcTokenAddress.substr(2) +
    destStableTokenAddress.substr(2) +
    destTokenAddress.substr(2)
  );
};

const depositForSwap = async (args) => {
  console.log("Deposit ki args - ", args);
  const bridgeInstance = new ethers.Contract(
    args.srcBridgeAddress,
    ContractABIs.Bridge.abi,
    args.signer
  );

  const data = createERCDepositData(
    expandDecimals(args.amount, args.assetDecimals),
    args.stableAmount,
    args.destStableTokenAmount,
    args.dstAmount,
    args.isDestNative, //0 false 1 true
    (args.destUserAddress.length - 2) / 2,
    (args.srcTokenAddress.length - 2) / 2,
    (args.destTokenAddress.length - 2) / 2,
    args.widgetId, //added here
    args.destUserAddress,
    args.srcTokenAddress,
    args.destStableTokenAddress,
    args.destTokenAddress
  );

  console.log(`Constructed deposit:`, data);
  // console.log('DATA:', args.destChainId,
  //   args.assetResourceId,
  //   data,
  //   args.distribution,
  //   args.flags,
  //   args.path,
  //   args.feeTokenAddress);
  let tx = args.native
    ? await bridgeInstance.depositETH(
        args.destChainId, // destination chain id
        args.assetResourceId,
        data,
        args.flags,
        args.path,
        args.dataTx || [],
        args.feeTokenAddress,
        {
          // gasPrice: ethers.utils.hexlify(Number(args.gasPrice)),
          // gasLimit: ethers.utils.hexlify(Number(args.gasLimit)),
          value: args.totalFee,
        }
      )
    : await bridgeInstance.deposit(
        args.destChainId, // destination chain id
        args.assetResourceId,
        data,
        args.flags,
        args.path,
        args.dataTx || [],
        args.feeTokenAddress,
        {
          // gasPrice: ethers.utils.hexlify(Number(args.gasPrice)),
          // gasLimit: ethers.utils.hexlify(Number(args.gasLimit)),
          value: args.totalFee,
        }
      );
  //console.log("tx =============", tx)
  return tx;
};

const depositForSwapSameChain = async (args) => {
  try{
    
      console.log("====> same chain swap args - ", args);
      const oneSplitInstance = new ethers.Contract(
        args.contractAddress,
        ContractABIs.OneSplit.abi,
        args.signer
      );
      const res = await oneSplitInstance.swapMultiWithRecipient(
          args.path,
          args.amount, //Amount
          args.dstAmount,
          args.flags,
          args.dataTx || [],
          false,
          args.destUserAddress,
          {
            value: args.native ? args.amount : ethers.utils.parseEther("0"),
            //gasPrice: ethers.utils.hexlify(Number(args.gasPrice)),
            //gasLimit: ethers.utils.hexlify(Number(args.gasLimit)),
          }
        )
      return res;
  } catch (e) {
      console.log("Same Chain Swap Error - ", e);
  }
  // try {
  // } catch (e) {
  //   if (e.code == 4001) {
  //     return false;
  //   }
  //   console.log("Same Chain Swap Error - ", e);
  // }
};

const wrapEth = async (args) => {
  console.log("wrapEth args - ", args);
  const wethInstance = new ethers.Contract(
    args.wethAddress,
    ContractABIs.Weth,
    args.signer
  );
  const res = await wethInstance.deposit({ value: args.amount });
  return res;
};

const unWrapEth = async (args) => {
  console.log("unWrapEth args - ", args);
  const wethInstance = new ethers.Contract(
    args.wethAddress,
    ContractABIs.Weth,
    args.signer
  );
  const res = await wethInstance.withdraw(args.amount);
  return res;
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

const getBalanceLp = async (args) => {
  try {
    //console.log('getBalance - ',args)
    const erc20Instance = new ethers.Contract(
      args.tokenAddress,
      ContractABIs.RouterERC20.abi,
      args.provider
    );
    //console.log('instance =============', erc20Instance)
    const result = await erc20Instance.balanceOf(args.accountAddress);
    //console.log('====-------',result)
    // result looks like this : { _hex: '0x021beec43da88aa00000', _isBigNumber: true }
    return ethers.utils.formatUnits(result.toString(), args.tokenDecimals);
  } catch (error) {
    console.log("Error ", error);
  }
};

const getBalanceLpMulticaller = (args) => {
  const erc20Instance = new Contract(
    args.tokenAddress,
    ContractABIs.RouterERC20.abi
  );
  return erc20Instance.balanceOf(args.accountAddress);
};

const getStakedRecord = async (args) => {
  try {
    //console.log('getBalance - ',args)
    //console.log(args)
    const erc20HandlerInstance = new ethers.Contract(
      args.erc20Handler,
      ContractABIs.Erc20Handler.abi,
      args.provider
    );
    //console.log('instance =============', erc20Instance)
    const result = await erc20HandlerInstance.getStakedRecord(
      args.accountAddress,
      args.tokenAddress
    );
    //console.log('====-------',result)
    // result looks like this : { _hex: '0x021beec43da88aa00000', _isBigNumber: true }
    //console.log(ethers.utils.formatUnits(result.toString(), args.tokenDecimals))
    return ethers.utils.formatUnits(result.toString(), args.tokenDecimals);
  } catch (error) {
    console.log("Get Staked Balance Error -", error);
  }
};

const getStakedRecordMulticaller = (args) => {
  const erc20HandlerInstance = new Contract(
    args.erc20Handler,
    ContractABIs.Erc20Handler.abi
  );
  console.log("erc20HandlerInstance - ", erc20HandlerInstance);
  return erc20HandlerInstance.getStakedRecord(
    args.accountAddress,
    args.tokenAddress
  );
};

const getPoolSize = async (args) => {
  try {
    //console.log('getBalance - ',args)
    const erc20Instance = new ethers.Contract(
      args.tokenAddress,
      ContractABIs.ERC20Token.abi,
      args.provider
    );
    //console.log('instance =============', erc20Instance)
    const result = await erc20Instance.balanceOf(args.erc20Handler);
    //console.log('====-------',result)
    // result looks like this : { _hex: '0x021beec43da88aa00000', _isBigNumber: true }
    return ethers.utils.formatUnits(result.toString(), args.tokenDecimals);
  } catch (error) {
    console.log("Error ", error);
  }
};

const getPoolSizeMulticaller = (args) => {
  const erc20Instance = new Contract(
    args.tokenAddress,
    ContractABIs.ERC20Token.abi
  );
  return erc20Instance.balanceOf(args.erc20Handler);
};

const getDepositedLp = async (args) => {
  try {
    //console.log('getBalance - ',args)
    //console.log(args)
    const erc20Instance = new ethers.Contract(
      args.tokenAddress,
      ContractABIs.StakingRewards.abi,
      args.provider
    );
    //console.log('instance =============', erc20Instance)
    const result = await erc20Instance.balanceOf(args.accountAddress);
    //console.log('====-------',ethers.utils.formatUnits(result.toString(), args.tokenDecimals))
    // result looks like this : { _hex: '0x021beec43da88aa00000', _isBigNumber: true }
    return ethers.utils.formatUnits(result.toString(), args.tokenDecimals);
  } catch (error) {
    console.log("Error ", error);
  }
};

const getDepositedLpMulticaller = (args) => {
  const stakingRewardsInstance = new Contract(
    args.tokenAddress,
    ContractABIs.StakingRewards.abi
  );
  return stakingRewardsInstance.balanceOf(args.accountAddress);
};

// = { bridgeAddress, handlerAddress, tokenAddress, fromAddress, amount, decimals }

const stakeInPool = async (args) => {
  try {
    console.log("depositInPool - ", args);
    let tokenAmountInUnits = expandDecimals(args.amount, args.decimals);
    const bridgeInstance = new ethers.Contract(
      args.bridgeAddress,
      ContractABIs.Bridge.abi,
      args.signer
    );
    //const handlerInstance = new ethers.Contract(args.handlerAddress, ContractABIs.HandlerHelpers.abi, signer);
    //const ERC20MintableContract = new ethers.Contract(args.tokenAddress, ContractABIs.ERC20Token.abi, signer);
    const tx = args.native
      ? await bridgeInstance.stakeETH(
          args.handlerAddress,
          //args.resourceID,
          //args.tokenAddress,
          //tokenAmountInUnits,
          {
            value: args.native
              ? tokenAmountInUnits
              : ethers.utils.parseEther("0"),
          }
        )
      : await bridgeInstance.stake(
          args.handlerAddress,
          //args.resourceID,
          args.tokenAddress,
          tokenAmountInUnits,
          {
            value: args.native
              ? tokenAmountInUnits
              : ethers.utils.parseEther("0"),
          }
        );
    //console.log("tx ==============", tx);
    return tx;
    // let result = await args.provider.waitForTransaction(tx.hash);
    // if (result?.status == 1) {
    //   return true;
    // } else {
    //   return false;
    // }
    // const LPTokenInstance = await ERC20MintableContract.at(retrievedLPAddress)
    // let lpBalance = await LPTokenInstance.balanceOf(args.fromAddress)
    // let stakedBalance = await ERC20MintableInstance.balanceOf(args.fromAddress)
    // console.log("nkdlg dgasdsfb ================", { lpBalance, stakedBalance })
    // assert.strictEqual(lpBalance.toString(), tokenAmount);
    // assert.strictEqual(stakedBalance.toString(), '0');
  } catch (error) {
    console.log("Staking Error - ", error);
  }
};

const unstakeInPool = async (args) => {
  try {
    console.log(args);
    let tokenAmountInUnits = expandDecimals(args.amount, args.decimals);
    const bridgeInstance = new ethers.Contract(
      args.bridgeAddress,
      ContractABIs.Bridge.abi,
      args.signer
    );
    //const handlerInstance = new ethers.Contract(args.handlerAddress, ContractABIs.HandlerHelpers.abi, signer);
    //const ERC20MintableContract = new ethers.Contract(args.tokenAddress, ContractABIs.ERC20Token.abi, signer);
    // debugger;
    const tx = args.native
      ? await bridgeInstance.unstakeETH(
          args.handlerAddress,
          //args.resourceID,
          //args.tokenAddress,
          tokenAmountInUnits
        )
      : await bridgeInstance.unstake(
          args.handlerAddress,
          //args.resourceID,
          args.tokenAddress,
          tokenAmountInUnits
        );
    return tx;
    //console.log("tx ==============", tx);
    // let result = await args.provider.waitForTransaction(tx.hash);
    // //console.log(result)
    // if (result?.status == 1) {
    //   return true;
    // } else {
    //   return false;
    // }
    // const LPTokenInstance = await ERC20MintableContract.at(retrievedLPAddress)
    // let lpBalance = await LPTokenInstance.balanceOf(args.fromAddress)
    // let stakedBalance = await ERC20MintableInstance.balanceOf(args.fromAddress)
    // console.log("nkdlg dgasdsfb ================", { lpBalance, stakedBalance })
    // assert.strictEqual(lpBalance.toString(), tokenAmount);
    // assert.strictEqual(stakedBalance.toString(), '0');
  } catch (error) {
    console.log(error);
  }
};

// {stakingRewardsAddressForUSDC, RUSDC, 18, 100 }
// { stakingRewardsAddress, stakingToken, stakingTokenDecimals, stakeAmount }

const depositLP = async (args) => {
  console.log(args);
  try {
    const stakingRewardsInstance = new ethers.Contract(
      args.stakingRewardsAddress,
      ContractABIs.StakingRewards.abi,
      args.signer
    );
    const tx = await stakingRewardsInstance.stake(
      expandDecimals(args.stakeAmount, args.stakingTokenDecimals).toString()
    );
    return tx;
    // let result = await args.provider.waitForTransaction(tx.hash);
    // if (result?.status == 1) {
    //   return true;
    // } else {
    //   return false;
    // }
  } catch (error) {
    console.log(error);
  }
};

//fetch rewards
// = { stakingRewardsAddress, accountAddress, rewardTokenDecimals }
const checkRewardsEarned = async (args) => {
  //console.log(args)
  try {
    const stakingRewardsInstance = new ethers.Contract(
      args.stakingRewardsAddress,
      ContractABIs.StakingRewards.abi,
      args.provider
    );
    let result = await stakingRewardsInstance.earned(args.accountAddress);
    return ethers.utils.formatUnits(
      result.toString(),
      args.rewardTokenDecimals
    );
    //console.log("result  ==============", result);
  } catch (error) {
    console.log(error);
  }
};

const checkRewardsEarnedMulticaller = (args) => {
  const stakingRewardsInstance = new Contract(
    args.stakingRewardsAddress,
    ContractABIs.StakingRewards.abi
  );
  return stakingRewardsInstance.earned(args.accountAddress);
};

//cliam rewards
// = { stakingRewardsAddress, accountAddress, rewardTokenDecimals }
const getRewards = async (args) => {
  try {
    console.log(args);
    const stakingRewardsInstance = new ethers.Contract(
      args.stakingRewardsAddress,
      ContractABIs.StakingRewards.abi,
      args.signer
    );
    const tx = await stakingRewardsInstance.getReward();
    return tx;
    // let result = await args.provider.waitForTransaction(tx.hash);
    // if (result?.status == 1) {
    //   return true;
    // } else {
    //   return false;
    // }
  } catch (error) {
    console.log(error);
  }
};

// withdraw LP
//  = { stakingRewardsAddress, accountAddress, lpAmountToWithdraw, lpTokenDecimals }
const withdrawLP = async (args) => {
  try {
    console.log(args);
    const stakingRewardsInstance = new ethers.Contract(
      args.stakingRewardsAddress,
      ContractABIs.StakingRewards.abi,
      args.signer
    );
    const tx = await stakingRewardsInstance.withdraw(
      expandDecimals(args.lpAmountToWithdraw, args.lpTokenDecimals).toString()
    );
    return tx;
    // let result = await args.provider.waitForTransaction(tx.hash);
    // if (result?.status == 1) {
    //   return true;
    // } else {
    //   return false;
    // }
  } catch (error) {
    console.log(error);
  }
};

const getBridgeInstance = (args) => {
  // const bridgeInstance = new ethers.Contract(args.srcBridgeAddress, ContractABIs.Bridge.abi, args.signer)
  // return bridgeInstance
  const web3 = new Web3(args.provider);

  return new web3.eth.Contract(ContractABIs.Bridge.abi, args.srcBridgeAddress);
};

// const getBridgeFee = async (args) => {
//   const bridgeInstance = new ethers.Contract(
//     args.srcBridgeAddress,
//     ContractABIs.Bridge.abi,
//     args.signer
//   );

//   try {
//     const fee = await bridgeInstance._fee();
//     return fee;
//   } catch (e) {
//     console.log("Bridge fee error - ", e);
//   }
// };

// const getFeeFromFeeHandler = async (args) => {
//   const feeHandlerInstance = new ethers.Contract(
//     args.feeHandlerAddress,
//     ContractABIs.FeeHandler.abi,
//     args.provider
//   );

//   try {
//     const fee = await feeHandlerInstance.getFee(
//       args.dstChainID,
//       args.feeTokenAddress
//     );
//     return fee;
//   } catch (e) {
//     console.log("Bridge fee error - ", e);
//   }
// };

const getFeeFromFeeHandler = async (args) => {
  const feeHandlerInstance = new ethers.Contract(
    args.feeHandlerAddress,
    ContractABIs.FeeHandler.abi,
    args.provider
  );

  try {
    const fee = await feeHandlerInstance.getFeeSafe(
      args.dstChainID,
      args.feeTokenAddress
    );
    return fee;
  } catch (e) {
    console.log("Bridge fee error - ", e);
  }
};

const getFeeFromFeeHandlerMulticaller = (args) => {

  const feeHandlerInstance = new Contract(
    args.feeHandlerAddress,
    ContractABIs.FeeHandler.abi
  );

 return feeHandlerInstance.getFeeSafe(args.dstChainID,args.feeTokenAddress);

};

const getPositionDataMulticaller = (args) => {
  const positionNFTContractInstance = new Contract(
    args.positionsContractAddress,
    ContractABIs.PositionNFT.abi
  );
 return positionNFTContractInstance.positions(args.tokenId);
};

const getRewardInfoMulticaller = (args) => {

  const uniV3StakerInstance = new Contract(
    args.stakerContractAddress,
    ContractABIs.UniV3Staker.abi
  );
 return uniV3StakerInstance.getRewardInfo(args.key,args.tokenId);

};

const getClaimableRewards = async (args) => {
  const uniV3StakerInstance = new ethers.Contract(
    args.stakerContractAddress,
    ContractABIs.UniV3Staker.abi,
    args.provider
  )
  try {
    const rewards = await uniV3StakerInstance.rewards(args.rewardTokenAddress,args.accountAddress);
    return rewards;
  } catch (e) {
    console.log("getClaimableRewards error - ", e);
  }
};

/**
        @notice Used to get listed fee tokens for given chain.
        @param  destChainId id of the destination chain.
    */
//       function getChainFeeTokens(uint8 destChainId) public view virtual returns (address [] memory) {
//         return _chainFeeTokens[destChainId];
//     }

// function getFeeSafe(uint8 destChainId, address feeToken) public view virtual returns (uint256, uint256, bool) {
//         Fees storage fees = _fees[destChainId][feeToken];
//         return (fees._transferFee, fees._exchangeFee, fees.accepted);
//     }

const getFeeTokens = async (args) => {
  const feeHandlerInstance = new ethers.Contract(
    args.feeHandlerAddress,
    ContractABIs.FeeHandler.abi,
    args.provider
  );

  try {
    const tokens = await feeHandlerInstance.getChainFeeTokens(args.dstChainID);
    return tokens;
  } catch (e) {
    console.log("Fee handler error - ", e);
  }
};

// const getFeeForTransaction = async (args) => {
//   const bridgeInstance = new ethers.Contract(
//     args.srcBridgeAddress,
//     ContractABIs.Bridge.abi,
//     args.provider
//   );
//   try {
//     const fee = await bridgeInstance.getFee();
//     return fee;
//   } catch (e) {
//     console.log("Bridge fee error - ", e);
//   }
// };

// const getEstimatedGas1 = async (args) => {
//   const bridgeInstance = new ethers.Contract(
//     args.src,
//     ContractABIs.Bridge.abi,
//     args.provider
//   );
//   try {
//     bridgeInstance.methods.deposit.estimateGas(
//       {
//         from: args.accountAddress,
//         to: args.srcBridgeAddress,
//         gasPrice: args.gasPrice,
//       },
//       function (error, estimatedGas) {
//         console.log("estimatedGas - ", estimatedGas);
//       }
//     );
//   } catch (e) {
//     console.log("estimatedGas error - ", e);
//   }
// };

const getEstimatedGas = async (args) => {
  const bridgeInstance = new ethers.Contract(
    args.srcBridgeAddress,
    ContractABIs.Bridge.abi,
    args.provider
  );
  console.log("gasEstimate Args -", args);
  try {
    const estimatedGas = await args.provider.estimateGas({
      to: args.srcBridgeAddress,
      data: "0x15e3661d",
      value: args.value,
    });
    console.log("Estimated gas - ", estimatedGas);
  } catch (e) {
    console.log("estimatedGas error - ", e);
  }
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
  try{
    const erc20HandlerInstance = new ethers.Contract(
      args.erc20Handler,
      ContractABIs.Erc20Handler.abi,
      args.provider
    );
    const record = await await erc20HandlerInstance.executeRecord(args.sourceChainId, args.depositNonce)
    return record.toString()
  }catch(e){
    console.log("getExecutionBlock error contract functions - ",e)
  }
}

const depositUniV3 = async (args) => {
  try {
    console.log(args);
    const positionNftInstance = new ethers.Contract(
      args.positionsContractAddress,
      ContractABIs.PositionNFT.abi,
      args.signer
    );
    const tx = await positionNftInstance.safeTransferFrom(args.from,args.to,args.tokenId);
    return tx;
    // let result = await args.provider.waitForTransaction(tx.hash);
    // if (result?.status == 1) {
    //   return true;
    // } else {
    //   return false;
    // }
  } catch (error) {
    console.log(error);
  }
};

const depositStakeUniV3 = async (args) => {
  try {
    console.log(args);
    const positionNftInstance = new ethers.Contract(
      args.positionsContractAddress,
      ContractABIs.PositionNFT.abi,
      args.signer
    );
    const tx = await positionNftInstance.safeTransferFrom(args.from,args.to,args.tokenId,args.data);
    return tx;
    // let result = await args.provider.waitForTransaction(tx.hash);
    // if (result?.status == 1) {
    //   return true;
    // } else {
    //   return false;
    // }
  } catch (error) {
    console.log(error);
  }
};

const stakeUniV3 = async (args) => {
  try {
    console.log(args);
    const uniV3StakerInstance = new ethers.Contract(
      args.uniV3StakerAddress,
      ContractABIs.UniV3Staker.abi,
      args.signer
    );
    const tx = await uniV3StakerInstance.stakeToken(args.key, args.tokenId);
    return tx;
    // let result = await args.provider.waitForTransaction(tx.hash);
    // if (result?.status == 1) {
    //   return true;
    // } else {
    //   return false;
    // }
  } catch (error) {
    console.log(error);
  }
};


const unstakeUniV3 = async (args) => {
  try {
    console.log(args);
    const uniV3StakerInstance = new ethers.Contract(
      args.uniV3StakerAddress,
      ContractABIs.UniV3Staker.abi,
      args.signer
    );
    const tx = await uniV3StakerInstance.unstakeToken(args.key, args.tokenId);
    return tx;
    // let result = await args.provider.waitForTransaction(tx.hash);
    // if (result?.status == 1) {
    //   return true;
    // } else {
    //   return false;
    // }
  } catch (error) {
    console.log(error);
  }
};

const claimRewardUniV3 = async (args) => {
  try {
    console.log(args);
    const uniV3StakerInstance = new ethers.Contract(
      args.uniV3StakerAddress,
      ContractABIs.UniV3Staker.abi,
      args.signer
    );
    const tx = await uniV3StakerInstance.claimReward(args.rewardTokenAddress, args.to,0);
    return tx;
    // let result = await args.provider.waitForTransaction(tx.hash);
    // if (result?.status == 1) {
    //   return true;
    // } else {
    //   return false;
    // }
  } catch (error) {
    console.log(error);
  }
};

const withdrawUniV3 = async (args) => {
  try {
    console.log(args);
    const uniV3StakerInstance = new ethers.Contract(
      args.uniV3StakerAddress,
      ContractABIs.UniV3Staker.abi,
      args.signer
    );
    const tx = await uniV3StakerInstance.withdrawToken(args.tokenId, args.to,0);
    return tx;
    // let result = await args.provider.waitForTransaction(tx.hash);
    // if (result?.status == 1) {
    //   return true;
    // } else {
    //   return false;
    // }
  } catch (error) {
    console.log(error);
  }
};

const unstakeWithdrawUniV3 = async (args) => {
  try {
    let web3 = new Web3(args.rpc);
    console.log(args);
    const uniV3StakerInstance = new ethers.Contract(
      args.uniV3StakerAddress,
      ContractABIs.UniV3Staker.abi,
      args.signer
    );
    const unstakeTokenEncoded = web3.eth.abi.encodeFunctionCall({
      name: 'unstakeToken',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
      inputs: [
                  {
                      "components": [
                          {
                              "internalType": "contract IERC20Minimal",
                              "name": "rewardToken",
                              "type": "address"
                          },
                          {
                              "internalType": "contract IUniswapV3Pool",
                              "name": "pool",
                              "type": "address"
                          },
                          {
                              "internalType": "uint256",
                              "name": "startTime",
                              "type": "uint256"
                          },
                          {
                              "internalType": "uint256",
                              "name": "endTime",
                              "type": "uint256"
                          },
                          {
                              "internalType": "address",
                              "name": "refundee",
                              "type": "address"
                          }
                      ],
                      "internalType": "struct IUniswapV3Staker.IncentiveKey",
                      "name": "key",
                      "type": "tuple"
                  },
                  {
                      "internalType": "uint256",
                      "name": "tokenId",
                      "type": "uint256"
                  }
              ]
          
  }, [args.key,args.tokenId])

  const withdrawTokenEncoded =  web3.eth.abi.encodeFunctionCall({
    name: 'withdrawToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
        inputs: [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ]
        
      
    }, [args.tokenId,args.to,"0x"])
    console.log("unstakeTokenEncoded , withdrawTokenEncoded",unstakeTokenEncoded, withdrawTokenEncoded)
    const tx = await uniV3StakerInstance.multicall([unstakeTokenEncoded, withdrawTokenEncoded]);
    return tx;
    // let result = await args.provider.waitForTransaction(tx.hash);
    // if (result?.status == 1) {
    //   return true;
    // } else {
    //   return false;
    // }
  } catch (error) {
    console.log(error);
  }
};


export {
  setApproval,
  getApproval,
  depositForSwap,
  getBalance,
  stakeInPool,
  unstakeInPool,
  setApprovalLP,
  getApprovalLP,
  depositLP,
  checkRewardsEarned,
  getRewards,
  withdrawLP,
  getBalanceLp,
  getDepositedLp,
  getStakedRecord,
  getPoolSize,
  getBridgeInstance,
  depositForSwapSameChain,
  getFeeFromFeeHandler,
  getEstimatedGas,
  getBalanceMulticaller,
  getPoolSizeMulticaller,
  getDepositedLpMulticaller,
  getStakedRecordMulticaller,
  checkRewardsEarnedMulticaller,
  getBalanceLpMulticaller,
  getTokenDetails,
  getFeeTokens,
  wrapEth,
  unWrapEth,
  getFeeFromFeeHandlerMulticaller,
  getApprovalMulticaller,
  getExecutionBlock,
  getPositionDataMulticaller,
  getRewardInfoMulticaller,
  getClaimableRewards,
  depositUniV3,
  stakeUniV3,
  unstakeUniV3,
  claimRewardUniV3,
  withdrawUniV3,
  depositStakeUniV3,
  unstakeWithdrawUniV3
};

// setApproval({
//     erc20Address: "0x51869b88c4659d2f98056b461f4cb85d71363b3b",
//     amount: "100000",
//     decimals: 18,
//     recipient: "0xAB16c8659083e00521BA94e111c3B94b7DC424d8"
// })

// await getApproval({
//     tokenAddress: "0x51869b88c4659d2f98056b461f4cb85d71363b3b",
//     spenderAddress: "0xAB16c8659083e00521BA94e111c3B94b7DC424d8",
//     userAddress: "0x67368c8D9B5835FD66CA4E3e5ad6D2486776CFc7",
//     tokenDecimals: 18
// })

// depositForSwap({
//     srcBridgeAddress: "0xfBaEC8A36ACe509C2884135e5e1135731E3c6056",
//     assetResourceId: "0x000000000000000000000000000000c76ebe4a02bbc34786d860b355f5a5ce02",
//     destUserAddress: "0x67368c8D9B5835FD66CA4E3e5ad6D2486776CFc7",
//     destChainId: 1,
//     amount: "1",
//     assetDecimals: "18",
//     gasLimit: "1000000",
//     gasPrice: "10000000000"
// })
