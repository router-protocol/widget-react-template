import { assetListPriceFetch } from "../config/asset"
import { CoinType } from "../state/swap/hooks"
//@ts-ignore
export const coingeckoPriceList = async (coinList: CoinType[], coinTemplate: CoinType) => {
	try {
		const platformId = 'ethereum'

		//const combinedAddresses = coinList.map(item=> item.address).join() //FOR MAINNET

		let combinedAddresses = ""
		coinList.map((item) => assetListPriceFetch[item.symbol] && (combinedAddresses += assetListPriceFetch[item.symbol] + ','))
		const result = await fetch(`https://api.coingecko.com/api/v3/simple/token_price/${platformId}?contract_addresses=${combinedAddresses}&vs_currencies=usd`)
		const data = await result.json()
		const priceListTemp = { ...coinTemplate }

		let platformId_individual
		let tokenAddress

		let data_individual: any

		if (priceListTemp['HUSD']) {
			platformId_individual = 'huobi-token'
			tokenAddress = assetListPriceFetch['HUSD']
			try {
				const result = await fetch(`https://api.coingecko.com/api/v3/simple/token_price/${platformId_individual}?contract_addresses=${tokenAddress}&vs_currencies=usd`)
				data_individual = await result.json()
			} catch (e) {
				console.log('HUSD Price Fetch Err - ', e)
			}
		} else if (priceListTemp['BUSD']) {
			platformId_individual = 'binance-smart-chain'
			tokenAddress = assetListPriceFetch['BUSD']
			try {
				const result = await fetch(`https://api.coingecko.com/api/v3/simple/token_price/${platformId_individual}?contract_addresses=${tokenAddress}&vs_currencies=usd`)
				data_individual = await result.json()
			} catch (e) {
				console.log('BUSD Price Fetch Err - ', e)
			}
		}
		// const result_individual = (assetListPriceFetch['BUSD'] || assetListPriceFetch['HUSD']) && await fetch(`https://api.coingecko.com/api/v3/simple/token_price/${platformId_individual}?contract_addresses=${tokenAddress}&vs_currencies=usd`)
		// const data_individual =  (result_individual!=='') && await result_individual.json()

		// let data_individual: {[key:string]:{[key: string]:any}}

		let ethPrice: any;
		if (priceListTemp['ETH'] || priceListTemp['WETH']) {
			try {
				const result = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum`)
				const data = await result.json()
				ethPrice = data?.market_data.current_price.usd
			} catch (e) {
				console.log('ETH Price Fetch Err - ', e)
			}
		}

		let bnbPrice: any;
		if (priceListTemp['BNB'] || priceListTemp['WBNB']) {
			try {
				const result = await fetch(`https://api.coingecko.com/api/v3/coins/binancecoin`)
				const data = await result.json()
				bnbPrice = data?.market_data.current_price.usd
			} catch (e) {
				console.log('BNB Price Fetch Err - ', e)
			}
		}

		let maticPrice: any;
		if (priceListTemp['MATIC'] || priceListTemp['WMATIC']) {
			try {
				const result = await fetch(`https://api.coingecko.com/api/v3/coins/matic-network`)
				const data = await result.json()
				maticPrice = data?.market_data.current_price.usd
			} catch (e) {
				console.log('matic Price Fetch Err - ', e)
			}
		}

		let avaxPrice: any;
		if (priceListTemp['AVAX'] || priceListTemp['WAVAX']) {
			try {
				const result = await fetch(`https://api.coingecko.com/api/v3/coins/avalanche-2`)
				const data = await result.json()
				avaxPrice = data?.market_data.current_price.usd
			} catch (e) {
				console.log('avax Price Fetch Err - ', e)
			}
		}

		let ftmPrice: any;
		if (priceListTemp['FTM'] || priceListTemp['WFTM']) {
			try {
				const result = await fetch(`https://api.coingecko.com/api/v3/coins/fantom`)
				const data = await result.json()
				ftmPrice = data?.market_data.current_price.usd
			} catch (e) {
				console.log('ftm Price Fetch Err - ', e)
			}
		}

		let oktPrice: any;
		if (priceListTemp['OKT']) {
			try {
				const result = await fetch(`https://api.coingecko.com/api/v3/coins/okexchain`)
				const data = await result.json()
				oktPrice = data?.market_data.current_price.usd
			} catch (e) {
				console.log('ETH Price Fetch Err - ', e)
			}
		}

		coinList.map(item => {
			//priceListTemp[item.symbol] = data[item.address].usd //FOR MAINNET
			if (item.symbol === 'HUSD' || item.symbol === 'BUSD') {
				priceListTemp[item.symbol] = data_individual[assetListPriceFetch[item.symbol]]?.usd
			} else if (item.symbol === 'USDC.e') {
				priceListTemp[item.symbol] = data[assetListPriceFetch['USDC']]?.usd
			} else if (item.symbol === 'ETH' || item.symbol === 'WETH' || item.symbol === 'RETH') {
				priceListTemp['ETH'] = ethPrice
				priceListTemp['WETH'] = ethPrice
				priceListTemp['RETH'] = ethPrice
			} else if (item.symbol === 'BNB' || item.symbol === 'WBNB' || item.symbol === 'RBNB') {
				priceListTemp['BNB'] = bnbPrice
				priceListTemp['WBNB'] = bnbPrice
				priceListTemp['RBNB'] = bnbPrice
			} else if (item.symbol === 'MATIC' || item.symbol === 'WMATIC' || item.symbol === 'RMATIC') {
				priceListTemp['MATIC'] = maticPrice
				priceListTemp['WMATIC'] = maticPrice
				priceListTemp['RMATIC'] = maticPrice
			} else if (item.symbol === 'AVAX' || item.symbol === 'WAVAX' || item.symbol === 'RAVAX') {
				priceListTemp['AVAX'] = avaxPrice
				priceListTemp['WAVAX'] = avaxPrice
				priceListTemp['RAVAX'] = avaxPrice
			} else if (item.symbol === 'FTM' || item.symbol === 'WFTM' || item.symbol === 'RFTM') {
				priceListTemp['FTM'] = ftmPrice
				priceListTemp['WFTM'] = ftmPrice
				priceListTemp['RFTM'] = ftmPrice
			} else if (item.symbol === 'OKT') {
				priceListTemp['OKT'] = oktPrice
			} else {
				if (data[assetListPriceFetch[item.symbol]]?.usd) {
					priceListTemp[item.symbol] = data[assetListPriceFetch[item.symbol]]?.usd
				} else {
					priceListTemp[item.symbol] = data[assetListPriceFetch[item.symbol.substring(1)]]?.usd
				}
			}
		})
		return priceListTemp
	} catch (e) {
		console.log('Price Fetch Error -', e)
	}
}