const Web3EthAbi = require('web3-eth-abi');

export const decodeLogForDeposit = async (log:any) => {
    try {
        // let result = Web3EthAbi.decodeLog(
        //     [
        //         {
        //             "indexed": true,
        //             "internalType": "uint8",
        //             "name": "destinationChainID",
        //             "type": "uint8"
        //         },
        //         {
        //             "indexed": true,
        //             "internalType": "bytes32",
        //             "name": "resourceID",
        //             "type": "bytes32"
        //         },
        //         {
        //             "indexed": true,
        //             "internalType": "uint64",
        //             "name": "depositNonce",
        //             "type": "uint64"
        //         }
        //     ],
        //     log.data,
        //     log.topics
        // );
        let result = {
			destinationChainID: parseInt(log.topics[1],16).toString(),
			resourceID: log.topics[2],
			depositNonce: parseInt(log.topics[3],16).toString(),
		}
        return result;
    } catch (error) {
        console.error(`Error while decoding txn log ${error}`);
        return null;
    }
};

export const decodeLogForProposal = async (log:any) => {
    try {
        let result = Web3EthAbi.decodeLog(
            [
                {
                    // "indexed": true,
                    "internalType": "uint8",
                    "name": "originChainID",
                    "type": "uint8"
                },
                {
                    // "indexed": true,
                    "internalType": "uint64",
                    "name": "depositNonce",
                    "type": "uint64"
                },
                {
                    // "indexed": true,
                    "internalType": "Bridge.ProposalStatus",
                    "name": "status",
                    "type": "uint8"
                },
                {
                    // "indexed": true,
                    "internalType": "bytes32",
                    "name": "dataHash",
                    "type": "bytes32"
                },
            ],
            log.data,
            log.topics
        );
        return result;
    } catch (error) {
        console.error(`Error while decoding txn log ${error}`);
        return null;
    }
};

export const decodeSettellementLogs = (log:any) => {
    try {
      let result = Web3EthAbi.decodeLog(
        [
          {
            internalType: "address",
            name: "settlementToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "settlementAmount",
            type: "uint256",
          },
          {
            internalType: "Bridge.ProposalStatus",
            name: "status",
            type: "uint8",
          },
        ],
        log.data,
        log.topics
      );
      result.originChainID = parseInt(log.topics[1], 16).toString();
      result.depositNonce = parseInt(log.topics[2], 16).toString();
      return result;
    } catch (error) {
      console.error(`Error while decoding txn log ${error}`);
      return null;
    }
  };