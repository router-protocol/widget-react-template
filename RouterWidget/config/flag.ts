export enum ChainId {
    MAINNET = "1",
    ROPSTEN = "3",
    RINKEBY = "4",
    GÖRLI = "5",
    KOVAN = "42",
    POLYGON = "137",
    MUMBAI = "80001",
    OKEX = "66",
    ARBITRUM = "42161",
    FANTOM = "250",
    OPTIMISM = "10",
    XDAI = "100",
    BSC = "56",
    AVALANCHE = "43114",
    FUJI = "43113",
    CRONOS = "25",
    AURORA = "1313161554",
    HARMONY = "1666600000"
}

export const DISABLE_ALL = '0x20000000'

export const exchangeCodes: {
    [key: string]: string
} = {
    [ChainId.KOVAN]: "0x400000000000",
    [ChainId.ROPSTEN]: "0x400000000000",
    [ChainId.MUMBAI]: "0x800",
    [ChainId.MAINNET]: "0x400000000000",
    [ChainId.POLYGON]: "0x800",
    [ChainId.BSC]: "0x80",
    [ChainId.FUJI]: "0x80",
    [ChainId.AVALANCHE]: "0x40000000000",
    [ChainId.FANTOM]: "0x1000000",
    [ChainId.ARBITRUM]: "0x1000000",
    [ChainId.OPTIMISM]: "0x800",
    [ChainId.CRONOS]: "0x800",
    [ChainId.AURORA]: "0x800",
    [ChainId.HARMONY]: "0x1000000",
}

export const explorerLinks: { [key: string]: string } = {
    [ChainId.KOVAN]: "https://kovan.etherscan.io/tx/",
    [ChainId.ROPSTEN]: "https://ropsten.etherscan.io/tx/",
    [ChainId.MUMBAI]: "https://mumbai.polygonscan.com/tx/",
    [ChainId.MAINNET]: "https://etherscan.io/tx/",
    [ChainId.POLYGON]: "https://polygonscan.com/tx/",
    [ChainId.BSC]: "https://bscscan.com/tx/",
    [ChainId.FUJI]: "https://testnet.snowtrace.io/tx/",
    [ChainId.AVALANCHE]: "https://snowtrace.io/tx/",
    [ChainId.FANTOM]: "https://ftmscan.com/tx/",
    [ChainId.ARBITRUM]: "https://arbiscan.io/tx/",
    [ChainId.OPTIMISM]: "https://optimistic.etherscan.io/tx/",
    [ChainId.CRONOS]: "https://cronoscan.com/tx/",
    [ChainId.AURORA]: "https://aurorascan.dev/tx/",
    [ChainId.HARMONY]: "https://explorer.harmony.one/tx/",
}

export const explorerAddressLinks: { [key: string]: string } = {
    [ChainId.KOVAN]: "https://kovan.etherscan.io/address/",
    [ChainId.ROPSTEN]: "https://ropsten.etherscan.io/address/",
    [ChainId.MUMBAI]: "https://mumbai.polygonscan.com/address/",
    [ChainId.MAINNET]: "https://etherscan.io/address/",
    [ChainId.POLYGON]: "https://polygonscan.com/address/",
    [ChainId.BSC]: "https://bscscan.com/address/",
    [ChainId.FUJI]: "https://testnet.snowtrace.io/address/",
    [ChainId.AVALANCHE]: "https://snowtrace.io/address/",
    [ChainId.FANTOM]: "https://ftmscan.com/address/",
    [ChainId.ARBITRUM]: "https://arbiscan.io/address/",
    [ChainId.OPTIMISM]: "https://optimistic.etherscan.io/address/",
    [ChainId.CRONOS]: "https://cronoscan.com/address/",
    [ChainId.AURORA]: "https://aurorascan.dev/address/",
    [ChainId.HARMONY]: "https://explorer.harmony.one/address/",
}

export const chainCoinGas: {
    [key: string]: {
        [key: string]: string
    }
} = {
    [ChainId.KOVAN]: {
        decimals: "18",
        symbol: "ETH"
    },
    [ChainId.MUMBAI]: {
        decimals: "18",
        symbol: "MATIC"
    },
    [ChainId.MAINNET]: {
        decimals: "18",
        symbol: "ETH"
    },
    [ChainId.POLYGON]: {
        decimals: "18",
        symbol: "MATIC"
    },
    [ChainId.BSC]: {
        decimals: "18",
        symbol: "BNB"
    },
    [ChainId.ROPSTEN]: {
        decimals: "18",
        symbol: "ETH"
    },
    [ChainId.FANTOM]: {
        decimals: "18",
        symbol: "FTM"
    },
    [ChainId.ARBITRUM]: {
        decimals: "18",
        symbol: "ETH"
    },
    [ChainId.OPTIMISM]: {
        decimals: "18",
        symbol: "ETH"
    },
    [ChainId.AVALANCHE]: {
        decimals: "18",
        symbol: "AVAX"
    },
    [ChainId.FUJI]: {
        decimals: "18",
        symbol: "AVAX"
    },
    [ChainId.CRONOS]: {
        decimals: "18",
        symbol: "CRO"
    },
    [ChainId.AURORA]: {
        decimals: "18",
        symbol: "AOA"
    },
    [ChainId.HARMONY]: {
        decimals: "18",
        symbol: "ONE"
    },
}

export const nativeAssetAddress: { [key: string]: string } = {
    [ChainId.MAINNET]: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    [ChainId.RINKEBY]: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    [ChainId.ROPSTEN]: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    [ChainId.GÖRLI]: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    [ChainId.KOVAN]: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    [ChainId.MUMBAI]: "0x0000000000000000000000000000000000001010",
    [ChainId.POLYGON]: "0x0000000000000000000000000000000000001010",
    [ChainId.OKEX]: "0x0000000000000000000000000000000000001010",
    [ChainId.ARBITRUM]: "0x0000000000000000000000000000000000001010",
    [ChainId.XDAI]: "0x0000000000000000000000000000000000001010",
    [ChainId.FANTOM]: "0x0100000000000000000000000000000000000001",
    [ChainId.OPTIMISM]: "0x0000000000000000000000000000000000001010",
    [ChainId.HARMONY]: "0x0000000000000000000000000000000000001010",
    [ChainId.BSC]: "0x0100000000000000000000000000000000000001",
    [ChainId.AVALANCHE]: "0x0100000000000000000000000000000000000001",
    [ChainId.CRONOS]: "0x0000000000000000000000000000000000000001",
    [ChainId.AURORA]: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    [ChainId.HARMONY]: "0x03fF0ff224f904be3118461335064bB48Df47938",
}
