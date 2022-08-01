import { MAX_THRESHOLD_FOR_SWAP } from "./config";

export const placeHolder1 = "%$XYZ#&1";

export const errorMessages = {
  0: `Error : Connect your wallet`,
  1: `Error : Change the network in your wallet to ${placeHolder1}`, //Source Chain Name
  2: `Error : Select an asset on source`,
  3: `Error : Select An Asset On destination`,
  4: `Error : Cannot swap more than $${MAX_THRESHOLD_FOR_SWAP} of ${placeHolder1} in value`, // Max threshold for dollar value
  5: `Error : Insufficient ${placeHolder1} to complete this transaction`, // Asset Name
  6: `Error : The destination address entered is incorrect. Enter a valid destination address`,
  7: `Error : Cannot leave this field blank. Enter the amount of ${placeHolder1} to be transferred.`, // Asset Name
  8: `Error : Wait while we fetch the destination amount`,
  9: `Error : Insufficient ${placeHolder1} to complete this transaction`, //chainCoinGas[currentSourceChain.networkId].symbol
  10: `Error : Connect to ${placeHolder1} in your wallet or change network in dropdown`, //${selectedChain.name.split(' ')[0]}
  11: `Error : Wait while we calculate the estimated fee`,
  12: `Error : Wait while we fetch the destination amount`,
  13: `Error : Error while fetching data, please try again`,
  14: `This is an Alpha release. While sufficient care has been taken to ensure the utmost security, please use the platform at your own risk`,
  15: `Error : Cancelling the previous request`,
  16: `Error : The app doesn’t support the current network, kindly switch to a different network`,
  17: `Warning : Due to low liquidity, you might receive RAsset `,
  18: `Error : Unexpected error occured  `,
  19: `Error : ${placeHolder1}`,
  20: `Error : Transaction rejected by user in metamask`,
};

export const getErrorMessage1 = (index, message) => {
  const msg = errorMessages[index].replace(placeHolder1, message);
  return msg;
};
