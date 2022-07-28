import numeral from "numeral"

  
export function shortenAddress(address: string, chars = 4): string {
    return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`
  }

export const numeralformat = (value:any) => {
  if(value==='-') return '-'
  else return numeral(value).format('0.00a').toUpperCase()
}

export const numeralFormatNumber = (value:any) => {
  if(value==='-') return '-'
  else return numeral(value).format()
}

export const fixedDecimalPlace = (value:any,decimalPlace:number) => {
  if(value==='-') return '-'
  else return getFlooredFixed(parseFloat(value.toString()),decimalPlace)
}

export function getFlooredFixed(v:any, d:number) {
  v = v?Number(v):0
  return (parseFloat((Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d))*1).toString();
}

export const getChainNameById = (chainId: string) =>{
  switch(chainId) {
  case "1": return 'ethereum';
  case "42": return 'kovan';
  case "250": return 'fantom';
  case "137": return 'polygon';
  case "80001": return 'mumbai';
  case "56": return 'smartchain';
  default: return '';
  }
}