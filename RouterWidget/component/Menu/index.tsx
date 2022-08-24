import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { NetworkType } from '../../config/network';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

interface Props {
	title: string;
	list: NetworkType[];
	currentValue: NetworkType;
	peerValue: NetworkType | '';
	optionSelectHandler: (newNetwork: NetworkType) => void;
	iconList: { [x: string]: string };
	close: () => void;
	backgroundColor: string;
	textColor: string;
}

const Wrapper = styled.div<{ backgroundColor: string, textColor: string }>`
	display: flex;
	flex-direction: column;
	width: 40rem;
	height: 30rem;
	color:  ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"};
	background: ${({ backgroundColor }) => backgroundColor !== "" ? backgroundColor : "#1A1B1C"};
	backdrop-filter: blur(32px);

	border-radius: 1.5rem;
	overflow: hidden;
	font-family: 'Inter', sans-serif;
    position: relative;
    z-index:4;
	@media only screen and (max-width: 750px){
    	max-width: 25rem;
		width: 80vw;
	    height: 80vh;
		max-height: 30rem;
	}
`;

const ItemWrapper = styled.div < { active: boolean, backgroundColor: string} >`
	display: flex;
	align-items: center;
	padding : 1rem 2rem;
	border-width: 0.0625rem;
	border-style: solid;
	border-color: transparent transparent rgb(225, 225, 225,0.2);
	background-color: ${({ active, backgroundColor }) => backgroundColor !== "" ? "rgba(255, 255, 255, 0.15)" : (active ? "#272833" : 'none')};
	cursor: pointer;
`
const Name = styled.div`font-size: 1rem;`;

const Image = styled.img`
	margin-right: 15px;
	width: 2rem;
`

const Title = styled.p`
	font-size: 1rem;
	text-align: center;
	padding-top: 1rem;
`;


const StyledCloseIcon = styled(CloseRoundedIcon)<{ textColor: string }>`
	position: absolute;
	color:  ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"}
	right: 15px;
	top: 15px;
	width: 1.7rem !important;
	height: 1.7rem !important;
	cursor:pointer;
`
const ChainListWrapper = styled.div`
	max-height: 391px;
	overflow-y: scroll;
	::-webkit-scrollbar {
	width: 10px;
	}
	::-webkit-scrollbar-track {
	background:#A3A4A470;//ChangeColor
	}
	
	/* Handle */
	::-webkit-scrollbar-thumb {
	background:#A3A4A4;//ChangeColor
	}

	@media only screen and (max-width: 750px){
    	max-width: 25rem;
		width: 80vw;
	}
`

const Menu = ({ title, list, currentValue, optionSelectHandler, iconList, peerValue, close, backgroundColor, textColor }: Props) => {

	let filteredList = list;
	if (peerValue === '') {
		//
	} else {
		if (peerValue.networkId === '65')
			filteredList = list.filter((item) => item.networkId !== peerValue.networkId)
	}

	return (
		<Wrapper backgroundColor={backgroundColor} textColor={textColor}>
			<StyledCloseIcon onClick={close} textColor={textColor} />
			<Title>{title}</Title>
			<ChainListWrapper>
				{filteredList.map((item, index) => (
					<ItemWrapper
						key={index}
						onClick={() => optionSelectHandler(item)}
						active={_.isEqual(item, currentValue)}
						backgroundColor={backgroundColor}
					>
						<Image src={iconList[item.networkId] ? iconList[item.networkId] : iconList['default']} />
						<Name>{item.name}</Name>
					</ItemWrapper>
				))}
			</ChainListWrapper>
		</Wrapper>
	);
};

export default Menu;
