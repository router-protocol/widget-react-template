import React, { ReactChild, ReactChildren } from 'react';
import styled from 'styled-components';

interface Props {
	active: boolean;
    children: ReactChild | ReactChildren
}

const FlashWrapper = styled.div < { show: boolean} >`
	font-family: 'Inter', sans-serif;
	font-size: 12px;
    font-weight: 400px;
    max-width: 400px;
	width: 100%;
	background: #1A1B1C;
	border-radius: 16px;
	display: ${({ show }) => (show ? 'flex' : 'none')};
	justify-content: center;
	align-items: center;
	padding: 10px 12.5px;
	position: relative;
	z-index: 3;
//visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
`;

const PointingTraingle = styled.div`
	position: absolute;
	top: 0;
	right:0;
	transform: translate(-45px,-14px);
`
const Pointer = () => (
	<svg width="18" height="15" viewBox="0 0 18 15" fill='#212129' xmlns="http://www.w3.org/2000/svg">
    	<path d="M9 0L17.6603 15H0.339746L9 0Z" fill='#212129' />
	</svg>
)


const HoverCard = ({ children, active }: Props) => {
	return (
		<FlashWrapper show={active}>
			<PointingTraingle>
				<Pointer/>
			</PointingTraingle>
			{/*<WarningIcon style={{ marginRight: '5px' }} />*/}
			{children}
		</FlashWrapper>
	);
};

export default HoverCard;
