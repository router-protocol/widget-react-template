import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import MenuWrapper from '../Menu/MenuWrapper';
import { shortenAddress } from '../../utils';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import WarningIcon from '@material-ui/icons/Warning';
import chainLookUp from '../../config/chainLookUp';
import metamaskIcon from '../../assets/vectors/metamask-fox.svg';
import WalletModal from './WalletModal';
import Web3 from "web3"
import Web3Modal from "web3modal";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { ethers } from 'ethers';
import ChangeWallet from './ChangeWallet';
import ReactGA from 'react-ga';
import { connectCoinbase } from './WalletLink';
import { useInitalRender } from '../../hooks/useInitialRender';
import { NetworkType } from '../../config/network';
import { providerOptions } from '../../config/ProviderConfig';

interface CustomProps {
	currentNetwork: NetworkType | '';
	setCurrentNetwork: (e: NetworkType | '') => void;
	walletId: string;
	setWalletId: (e: string) => void;
	currentAccountAddress: string;
	setCurrentAccountAddress: (e: string) => void;
	isWalletConnected: boolean;
	setIsWalletConnected: (e: boolean) => void;
	setNetworkId: (e: string) => void;
	ctaColor: string;
	textColor: string;
	backgroundColor: string;
}

const WalletWrapper = styled.div`
`;

const Wallet = styled.div<{ connected: boolean }>`
	width: ${({ connected }) => connected ? '150px' : '200px'};
	height: 35px;
	font-family: 'Inter', sans-serif;
	font-size: 1rem;
	font-weight: 400;
	line-height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #00A0BE;
	background: #1A1B1C;
	border: 1px solid rgba(88, 88, 99, 0.24);
	border-radius: 10px;
	cursor: pointer;
	transition: all 0.4s ease-in-out;
	//transform: translateX(-16px);

	@media only screen and (max-width: 960px){
        font-size: 16px;
		height: 35px;
		border: 1px solid rgba(88, 88, 99, 0.24);
		width: ${({ connected }) => connected ? '161px' : '180px'};
    }
	box-shadow: 0px 0px 34px rgba(0, 0, 0, 0.15);
`;

const InfoCard = styled.div`
	width: 450px;
	height: 100px;
	border-radius: 15px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-family: Manrope;
	font-size: 18px;
	background: "linear-gradient(180deg, #2E3146 -94.22%, #1A1B1C 100%)";
	color: #FFFFFF;
	box-shadow: -2px 2px 18px 10px rgba(0, 0, 0, 0.15);
	-webkit-box-shadow: -2px 2px 18px 10px rgba(0, 0, 0, 0.15);
	-moz-box-shadow: -2px 2px 18px 10px rgba(0, 0, 0, 0.15);
	&:focus {
		outline: none;
	}
`;

const WalletBox: React.FunctionComponent<CustomProps> = ({ setCurrentNetwork, walletId, setWalletId, currentAccountAddress, setCurrentAccountAddress, isWalletConnected, setIsWalletConnected, setNetworkId, textColor, ctaColor, backgroundColor }: CustomProps) => {
	const { ethereum } = window;

	const [showUnsupportedNetwork, setShowUnsupportedNetwork] = useState<boolean>(false);
	const [showInstallMetamask, setShowInstallMetamask] = useState<boolean>(false);
	const [showLockedWallet, setShowLockedWallet] = useState<boolean>(false);
	const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
	const [showChangeWalletModal, setShowChangeWalletModal] = useState<boolean>(false);

	// const [, setNetworkId] = useNetworkId();
	// const [isWalletConnected, setIsWalletConnected] = useWalletConnected();
	// const [, setCurrentNetwork] = useNetworkManager();
	// const [currentWalletId, setWalletId] = useWalletId()
	const isInitialRender = useInitalRender()

	//const [ providerOptionsRpc, setProviderOptionsRpc] = useState<any>(providerOptions);
	//const [ web3Modal, setWeb3Modal] = useState<any>( new Web3Modal({cacheProvider:true, providerOptions: providerOptions,}) )


	const web3Modal = new Web3Modal({
		//network: getNetwork(),
		cacheProvider: true,
		providerOptions: providerOptions,
	});

	const walletDetailsInit = async (modalProvider: any, walletId: string) => {

		if (walletId === 'injected') {
			const accounts = await modalProvider.request({ method: 'eth_requestAccounts' }).catch((e: any) => console.log(e));
			console.log('Intialized Accounts - ', accounts)
			const address = accounts && accounts[0];

			if (!address) {
				console.log('here')
				setShowLockedWallet(true)
				return
			}

			const walletConnectModal = modalProvider
			//@ts-ignore
			const etherProvider = new ethers.providers.Web3Provider(modalProvider)


			setCurrentAccountAddress(address)
			let chainId = await modalProvider.request({ method: 'eth_chainId' }).catch((e: any) => console.log(e));
			//@ts-ignore
			chainId = parseInt(chainId, 16).toString()
			console.log('Intialized ChainId - ', chainId)
			//@ts-ignore
			setNetworkId(chainId)
			setIsWalletConnected(true)
			setShowWalletModal(false)
			setShowChangeWalletModal(false)
			setWalletId(walletId)
			//@ts-ignore
			if (chainLookUp[chainId]) {
				//@ts-ignore
				setCurrentNetwork(chainLookUp[chainId])
			} else {
				setCurrentNetwork('')
			}

			window.modalProvider = etherProvider
			window.walletProvider = walletConnectModal
			return
		}

		if (walletId === 'walletlink') {
			console.log('inside wallet link connection - ', modalProvider)
			await modalProvider.enable()
			const accounts = await modalProvider.request({ method: 'eth_requestAccounts' }).catch((e: any) => console.log(e));
			console.log('Intialized wallet link Accounts - ', accounts)
			const address = accounts && accounts[0];

			if (!address) {
				console.log('here')
				setShowLockedWallet(true)
				return
			}

			const walletConnectModal = modalProvider
			//@ts-ignore
			const etherProvider = new ethers.providers.Web3Provider(modalProvider)


			setCurrentAccountAddress(address)
			const chainChangedListener = async () =>
				new Promise<string>((resolve) =>
					Object.defineProperty(modalProvider, 'hasMadeFirstChainChangedEmission', {
						configurable: true,
						set(value) {
							if (modalProvider.isChainOverridden)
								resolve(modalProvider._chainId)
						},
					}),
				)
			chainChangedListener().then(chainId => {
				console.log('Intialized walletlink ChainId - ', chainId)
				setNetworkId(chainId)
				//@ts-ignore
				if (chainLookUp[chainId]) {
					//@ts-ignore
					setCurrentNetwork(chainLookUp[chainId])
				} else {
					setCurrentNetwork('')
				}
			})
			//@ts-ignore
			// setTimeout(async() =>{
			// },2000)
			setIsWalletConnected(true)
			setShowWalletModal(false)
			setShowChangeWalletModal(false)
			setWalletId(walletId)

			window.modalProvider = etherProvider
			window.walletProvider = walletConnectModal
			return
		}

		const walletConnectModal = modalProvider

		const web3 = new Web3(walletConnectModal)

		const etherProvider = new ethers.providers.Web3Provider(modalProvider)

		const accounts = await web3.eth.getAccounts();

		const address = accounts[0];

		setCurrentAccountAddress(address)

		//console.log(address)

		//const networkId = await web3.eth.net.getId();

		const chainId = await web3.eth.getChainId();

		setNetworkId(chainId.toString())

		setIsWalletConnected(true)
		setShowWalletModal(false)
		setShowChangeWalletModal(false)

		setWalletId(walletId)
		//console.log('chainID',chainId)
		if (chainLookUp[chainId]) {
			setCurrentNetwork(chainLookUp[chainId])
		} else {
			setCurrentNetwork('')
		}
		window.modalProvider = etherProvider
		window.walletProvider = walletConnectModal
	}

	const connectWallet = async (walletId: string, reason: string) => {
		//console.log(walletId, reason)
		localStorage.removeItem('walletconnect')
		if (walletId === 'injected') {
			ReactGA.event({
				category: 'Wallet',
				action: `Connected to Metamask`
			});

			if (ethereum) {
				try {
					await walletDetailsInit(window.ethereum, 'injected')
				} catch (e) {
					console.log(e)
				}
			} else {
				setShowInstallMetamask(true)
			}
			return
		}

		if (walletId === 'walletlink') {
			try {
				const modalProvider = await connectCoinbase()
				await walletDetailsInit(modalProvider, 'walletlink')
			} catch (e) {
				console.log('Wallet link Error - ', e)
			}
			return
		}

		ReactGA.event({
			category: 'Wallet',
			action: `Connected to ${walletId}`
		});

		try {
			const modalProvider = await web3Modal.connectTo(walletId)
			walletDetailsInit(modalProvider, walletId)
		} catch (e) {
			console.log('Wallet Error - ', e)
		}
	};

	const disconnect = async () => {
		web3Modal.clearCachedProvider();
		setCurrentAccountAddress("")
		setIsWalletConnected(false)
		setShowChangeWalletModal(false)
		setWalletId("")
		setCurrentNetwork('')

	}

	const subscribeInjectedWallet = async () => {

		if (ethereum) {
			ethereum.on('accountsChanged', () => {
				//change current wallet address
				console.log('Metamask Account Changed')
				if (ethereum.selectedAddress) {
					setCurrentAccountAddress(ethereum.selectedAddress);
				} else {
					setIsWalletConnected(false);
					setCurrentAccountAddress('');
					setNetworkId('');
				}
			});
			ethereum.on('chainChanged', () => {
				//chamge current wallet network
				console.log('Metamask Chain Changed')
				setTimeout(() => {
					setNetworkId(parseInt(ethereum.chainId, 16).toString());
					if (chainLookUp[parseInt(ethereum.chainId, 16).toString()]) {
						setCurrentNetwork(chainLookUp[parseInt(ethereum.chainId, 16).toString()]);
						// if (accountAddress === null || accountAddress === '') {
						// 	setIsWalletConnected(false);
						// } else {
						// 	setIsWalletConnected(true);
						// }
					} else {
						setCurrentNetwork('');
					}
				}, 0);
			});
		}
	}

	const subscribeProvider = async () => {

		const provider = window.walletProvider
		provider.enable()

		if (!provider?.on) {
			return;
		}
		//provider.on("close", () => resetApp());

		provider.on("accountsChanged", async (accounts: string[]) => {
			console.log('Wallet Account Changed')
			setCurrentAccountAddress(accounts[0])
		});

		provider.on("chainChanged", async (chainId: number) => {
			//console.log('provider chain changed trigger')
			console.log('Wallet Chain Changed To', chainId)
			setNetworkId(chainId.toString())

			if (chainLookUp[chainId]) {

				setCurrentNetwork(chainLookUp[chainId])

				// if (accountAddress === null || accountAddress === '') {
				//     setIsWalletConnected(false);
				// } else {
				//     setIsWalletConnected(true);
				// }

			} else {
				setCurrentNetwork('');
			}
		});

		// Subscribe to provider connection
		provider.on("connect", (info: { chainId: number }) => {
			//console.log(info);
		});

		// Subscribe to provider disconnection
		provider.on("disconnect", (error: { code: number; message: string }) => {
			//console.log(error);
		});

	};

	const removeAllListeners = () => {
		if (window.ethereum) {
			window.ethereum.removeAllListeners()
		}
		if (window.walletProvider) {
			window.walletProvider.removeAllListeners()
		}
	}

	const activateEventListener = async () => {
		if (!walletId) return
		if (walletId === 'injected') {
			await subscribeInjectedWallet()
		} else {
			await subscribeProvider()
		}
	}

	//Initialization
	useEffect(() => {
		if (walletId === 'injected') {
			connectWallet(walletId, 'auto')
		}
	}, [])

	//Event Listeners
	useEffect(() => {
		if (isInitialRender && walletId !== 'injected') return
		activateEventListener()
		return () => {
			removeAllListeners()
		}
	}, [walletId])

	const changeModalHandler = () => {
		setShowWalletModal(true)
	}

	const closeChangeWalletModal = () => setShowChangeWalletModal(false)
	const closeShowWalletModal = () => setShowWalletModal(false)

	return (
		<WalletWrapper>
			<MenuWrapper open={showWalletModal} onClose={closeShowWalletModal}>
				<WalletModal action={connectWallet} close={closeShowWalletModal} walletId={walletId} backgroundColor={backgroundColor} textColor={textColor} />
			</MenuWrapper>
			<MenuWrapper open={showChangeWalletModal} onClose={closeChangeWalletModal}>
				<ChangeWallet disconnect={disconnect} action={changeModalHandler} close={closeChangeWalletModal} accountAddress={currentAccountAddress} walletId={walletId} ctaColor={ctaColor} backgroundColor={backgroundColor} textColor={textColor}/>
			</MenuWrapper>
			<MenuWrapper open={showInstallMetamask} onClose={() => setShowInstallMetamask(false)}>
				<InfoCard>
					Install MetaMask <img src={metamaskIcon} style={{ width: '7%', marginLeft: '5px' }} />
				</InfoCard>
			</MenuWrapper>
			<MenuWrapper open={showLockedWallet} onClose={() => setShowLockedWallet(false)}>
				<InfoCard>
					<LockOpenIcon style={{ marginRight: '2px' }} />
					Unlock Wallet
				</InfoCard>
			</MenuWrapper>
			<MenuWrapper open={showUnsupportedNetwork} onClose={() => setShowUnsupportedNetwork(false)}>
				<InfoCard>
					<WarningIcon style={{ marginRight: '5px' }} /> Unsupported Network
				</InfoCard>
			</MenuWrapper>

			{!isWalletConnected && <Wallet onClick={() => setShowWalletModal(true)} connected={isWalletConnected}>Connect Your Wallet</Wallet>}
			{isWalletConnected && (
				<Wallet onClick={() => setShowChangeWalletModal(true)} connected={isWalletConnected}>
					{shortenAddress(currentAccountAddress ? ethers.utils.getAddress(currentAccountAddress) : '')}
					<AccountBalanceWalletIcon style={{ width: '17px', marginLeft: '7px' }} />
				</Wallet>
			)}
		</WalletWrapper>
	);
};

export default WalletBox;
