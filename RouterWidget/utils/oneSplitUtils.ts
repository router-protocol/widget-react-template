import { DISABLE_ALL, exchangeCodes } from '../config/flag';
import oneSplitContract from '../config/contracts/abis/OneSplitWrap.json'
import { NetworkType } from '../config/network';
const { ethers } = require('ethers');
const BN = require('bn.js');

export const getFlagsArray = (pathArrayLength = 2, networkId: string) => {
    let flagCode = new BN(DISABLE_ALL?.split('x')[1], 16).add(new BN(exchangeCodes[networkId]?.split('x')[1], 16))
    let flagsArray: string[] = new Array(pathArrayLength - 1).fill(flagCode.toString())
    return flagsArray
}

export const getAmountAndDistrbution = async (network: NetworkType, pathArray: string[], flagsArray: string[], amount: string) => {

    const provider = new ethers.providers.JsonRpcProvider(network.endpoint)
    const contractInstance = new ethers.Contract(network.opts.oneSplit, oneSplitContract.abi, provider)

    const length = pathArray.length < 1 ? 1 : pathArray.length - 1

    try {

        const res = await contractInstance.getExpectedReturnWithGasMulti(
            pathArray,
            amount,//Amount
            new Array(length).fill('1'),
            flagsArray,
            new Array(length).fill('0')
        )
        return res
    } catch (e) {
        console.log(e)
    }
}

export const expandDecimals = (amount: any = 0, decimals = "18") => {
    return ethers.utils.parseUnits(String(amount), decimals);
}

export const formatDecimals = (amount: any = 0, decimals = "18") => {
    if (parseFloat(amount) == 0) return "0"
    return ethers.utils.formatUnits(String(amount), decimals)
}

export const calcSlippage = (amount: any, slippage: any, scale: number = 1) => {
    try {
        amount = ethers.BigNumber.from(amount)
        return amount.mul((100 * scale) - (parseFloat(slippage) * scale)).div(100 * scale)
    } catch (e) {
        console.log("CalcSlppage error - ", e)
    }
}

export const countDecimals = (value: any) => {
    let text = value.toString()
    // verify if number 0.000005 is represented as "5e-6"
    if (text.indexOf('e-') > -1) {
        let [, trail] = text?.split('e-');
        let deg = parseInt(trail, 10);
        return deg;
    }
    // count decimals for number in representation like "0.123456"
    if (Math.floor(value) !== value) {
        return value.toString()?.split(".")[1]?.length || 0;
    }
    return 0;
}

export const getScale = (value: any) => {
    const decimals = countDecimals(value)
    if (decimals === 0) return 1
    else return 10 ** decimals
}