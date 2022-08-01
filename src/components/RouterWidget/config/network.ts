import networkMainnet from './network/network.mainnet.json'

import { ALLOWED_CHAINS } from "./config";

const network = networkMainnet

export interface NetworkType {
    name: string;
    type: string;
    networkId: string;
    id: string;
    endpoint: string;
    socket: string;
    from: string;
    stakingRewardsFactory: string;
    rewardsToken: string;
    feeHandler: string;
    opts: {
        http: string;
        bridge: string;
        erc20Handler: string;
        reserveHandler: string;
        oneSplit: string;
        genericHandler: string;
        gasLimit: string;
        maxGasPrice: string;
    };
}


const networkObj = JSON.parse(JSON.stringify(network))

const allowedChains = ALLOWED_CHAINS && ALLOWED_CHAINS?.split(',')

const allowedNetworks = allowedChains ? networkObj.chains.filter((network: NetworkType) => allowedChains.find(networkId => networkId === network.networkId)) : networkObj.chains

const chains: NetworkType[] = allowedNetworks.map((network: NetworkType) => {
    //network.endpoint = network.endpoint+process.env.REACT_APP_NETWORK_INFURA_KEY
    switch (network.networkId) {
        case "1":
            // network.endpoint = ETH_MAINNET_RPC_URL;
            // network.socket = ETH_MAINNET_SOCKET_URL;
            break;
        case "137":
            // network.endpoint = POLYGON_MAINNET_RPC_URL;
            // network.socket = POLYGON_MAINNET_SOCKET_URL;
            break;
        case "65":
            break;
        case "3":
            break;
        case "80001":
            //network.endpoint = MUMBAI_TESTNET_URL;
            break;
        default:
        //network.endpoint = network.endpoint+INFURA_KEY_NETWORK;
    }
    return network
})

//console.log(chains)

export { chains }