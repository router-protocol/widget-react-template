import * as React from 'react';
import styled from 'styled-components';
import { AssetType, FeeObjectType } from '../../config/asset';
import _ from 'lodash';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { CoinType } from '../../state/swap/hooks';

interface Props {
	title: string;
	list: AssetType[] | null;
	currentValue: AssetType | '';
	optionSelectHandler: (newAsset: AssetType) => void;
	iconList: { [x: string]: string };
	close: () => void;
	balanceList: CoinType;
	feePriceFeed: FeeObjectType | undefined;
    textColor: string;
    backgroundColor: string;
}

const Wrapper = styled.div<{ backgroundColor: string, textColor: string }>`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 40rem;
	height: 30rem;
	color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"};
	background: ${({backgroundColor}) => backgroundColor !== "" ? backgroundColor : "#1A1B1C"};   
	backdrop-filter: blur(32px);

	border-radius: 1.5rem;
	font-family: 'Inter', sans-serif;

	@media only screen and (max-width: 750px){
        max-width: 25rem;
		width: 80vw;
	    height: 80vh;
    }
`;

const ItemListWrapper = styled.div<{ textColor: string, backgroundColor: string }>`
	display: flex;
	flex-direction: column;
	width: 98%;
	height: 24rem;
	color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"};
	background: ${({backgroundColor}) => backgroundColor !== "" ? backgroundColor : "#1A1B1C"};    
	backdrop-filter: blur(32px);

	overflow-x: hidden;
	overflow-y: scroll;
	font-family: 'Inter', sans-serif;
	::-webkit-scrollbar {
	width: 10px;
	}
	::-webkit-scrollbar-track {
	background: #A3A4A470; 
	}
	
	/* Handle */
	::-webkit-scrollbar-thumb {
	background: #A3A4A4;
	}

	@media only screen and (max-width: 750px){
        max-width: 25rem;
		width: 80vw;
    }
`

const ItemWrapper =
	styled.div <
		{ active: boolean,  backgroundColor: string} >
		`
	display: flex;
	align-items: center;
	padding : 1rem 2rem;
	border-width: 0.0625rem;
	border-style: solid;
	border-color: transparent transparent rgb(225, 225, 225,0.2);
	background-color: ${({ active, backgroundColor }) => (active ? backgroundColor ?  "rgba(255, 255, 255, 0.15)" : "#1C1C2875" : 'none')};
	cursor: pointer;
`;
const Name = styled.div`font-size: 1rem;`;

// const LogoWrapper = styled.div`
// 	width: 2.5rem;
// 	height: 2.5rem;
// 	margin-right: 2rem;
// 	background-color: #ffffff;
// 	display: flex;
// 	align-items: center;
// 	justify-content: center;
// 	border-radius: 50%;
// `;

const Image = styled.img`
	width: 2rem;
	margin-right: 15px;
`

const Title = styled.p<{ textColor: string }>`
	font-size: 1.2rem;
	text-align: center;
	padding-top: 1rem;
	textColor: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"};
`;


const StyledCloseIcon = styled(CloseRoundedIcon)<{ textColor: string }>`
	position: absolute;
	color:white;
	right: 15px;
	top: 15px;
	width: 1.7rem !important;
	height: 1.7rem !important;
	cursor:pointer;
	color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"} !important;
`
const Balance = styled.div<{ textColor: string }>`
	font-size: 1rem;
	justify-self: flex-end;
	margin-left: auto;
	font-weight: 300;
	font-family: 'Inter', sans-serif;
	color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"};

	@media only screen and (max-width: 500px){
        font-size: 12px;
    }
`;

const BalanceSymbol = styled.div<{ textColor: string }>`
	display: flex;
	flex-direction: column;
	color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"};
`

const TokenBalance = styled.div<{ textColor: string }>`
	margin-top: 3px;
	font-weight: 200;
	font-size: 0.9rem;
	color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF55"};
	@media only screen and (max-width: 500px){
        font-size: 10px;
    }
`

const TextStyle = styled.span<{ textColor: string }>`
	font-size: 1rem;
	font-weight: 200;
	color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF55"};
	@media only screen and (max-width: 500px){
        font-size: 12px;
    }
`
const FeeMenu = ({ list, feePriceFeed, title, currentValue, optionSelectHandler, iconList, balanceList, close, backgroundColor, textColor }: Props) => {
	// const currentRoute = useLocation()
	// const isWidget = useMemo(() => new URLSearchParams(currentRoute.search).get("isWidget"), [currentRoute])
	// const backgroundColor = useMemo(() => decodeURIComponent(new URLSearchParams(currentRoute.search).get("backgroundColor") ?? ''), [currentRoute])
	// const textColor = useMemo(() => decodeURIComponent(new URLSearchParams(currentRoute.search).get("textColor") ?? ''), [currentRoute])
	let filteredList = feePriceFeed ? list?.filter(asset => feePriceFeed[asset.symbol]?.show) : list
	return (
		<Wrapper backgroundColor={backgroundColor} textColor={textColor}>
			<StyledCloseIcon onClick={close} textColor={textColor} />
			<Title textColor={textColor}>{title}</Title>
			<ItemListWrapper backgroundColor={backgroundColor} textColor={textColor}>
				{filteredList?.map((item, index) => (
					<ItemWrapper
						key={index}
						onClick={() => optionSelectHandler(item)}
						active={_.isEqual(item, currentValue)}
						backgroundColor={backgroundColor}
					>
						<Image src={iconList[item.symbol] ? iconList[item.symbol] : iconList['default']} />
						<BalanceSymbol textColor={textColor}>
							<Name>{item.name}</Name>
							<TokenBalance textColor={textColor}>Balance: {balanceList[item.symbol]}</TokenBalance>
						</BalanceSymbol>

						{
							feePriceFeed &&
							<Balance textColor={textColor}>
								<TextStyle textColor={textColor}>Fees: </TextStyle>
								{feePriceFeed[item.symbol].feeAmount}&nbsp;
								{
									feePriceFeed[item.symbol].feeUsd !== '0' &&
									<span style={{color: textColor !== "" ? textColor : "#FFFFFF55", fontWeight: 200 }}>
										(~${feePriceFeed[item.symbol].feeUsd})
									</span>
								}
							</Balance>
						}
					</ItemWrapper>
				))}
			</ItemListWrapper>
		</Wrapper>
	);
};

export default FeeMenu;