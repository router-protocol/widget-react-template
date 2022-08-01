import React, { useState } from 'react'
import styled from 'styled-components'
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import WarningTwoToneIcon from '@material-ui/icons/WarningTwoTone';
import { Button } from '@material-ui/core';

interface Props {
    name: string;
    address: string;
    explorerLink: string;
    close: () => void;
    handleImport: () => void;
}

const Wrapper = styled.div`
    width: 360px;
    color:#FFFFFF;
    font-family: 'Inter', sans-serif;
    background: #1A1B1C;
    border-radius: 15px;
    display: grid;
    place-items: center;
    padding: 10px;
    @media only screen and (max-width: 750px){
        width: 320px;
    }
`

const StyledCloseIcon = styled(CloseRoundedIcon)`
	position: absolute;
	color:white;
	right: 15px;
	top: 15px;
	width: 1.7rem !important;
	cursor:pointer;
	height: 1.7rem !important;
`
const Title = styled.p`
	font-size: 1.2rem;
	text-align: center;
`;

const AssetWrapper = styled.div`
    width: 93%;
    background: #272833;
    border-radius: 4px;
    padding: 12px 4px;
    margin: 5px auto;
`

const AssetTitle = styled.div`
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 5px;
`

const ExplorerHyperLink = styled.div`
    font-size: 12px;
    cursor: pointer;
    color: #2172E5;
`
const WarningWrapper = styled.div`
    width: 93%;
    background: #00A0BE21;
    border-radius: 4px;
    padding: 15px 10px;
    margin: 25px auto;
    display: grid;
    color: #00A0BE;
    place-items: center;
`
const AddButton = styled(Button) <{ disabled: boolean }>`
	&&&{
    background: ${({ disabled }) => disabled ? "#00A0BE88" : "#00A0BE"};
    color: #FFFFFF;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    width: 93%;
    height: 45px; 
    text-transform: none;
    padding: 0 20px;
    border-radius: 7px;
    box-shadow: none;
    font-weight: 400;
    margin-bottom: 20px;
  }
`

const WarningIcon = styled(WarningTwoToneIcon)`
    &&&{
        width: 15px;
        fill: #00A0BE;
    }
`
const WarningText1 = styled.div`
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: left;
`

const WarningText2 = styled.div`
    font-size: 12px;
    margin-bottom: 10px;
`

const WarningText3 = styled.div`
    font-size: 12px;
    font-weight: 600;
    margin: 5px 0;
`
const StyledInput = styled.input`
	color: #FFFFFF;
	background: none;
	border: none;
	&:focus{
		outline: none;
	}
`
const CheckboxWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: left;
    width: 100%;
    margin-top: 10px;
`

const AddTokenWarning = ({ name, address, explorerLink, close, handleImport }: Props) => {
    const [checked, setChecked] = useState(false)
    return (
        <Wrapper>
            <StyledCloseIcon onClick={close} />
            <Title>
                Import Token
            </Title>
            <AssetWrapper>
                <AssetTitle>
                    {name}
                </AssetTitle>
                <ExplorerHyperLink onClick={() => window.open(explorerLink, '_blank', 'noopener,noreferrer')}>
                    {address}
                </ExplorerHyperLink>
            </AssetWrapper>
            <WarningWrapper>
                <WarningText1>
                    <WarningIcon />
                    Trade at your own risk!
                </WarningText1>
                <WarningText2>
                    Anyone can create a token, including creating fake versions of existing tokens that claim to represent
                    projects.
                </WarningText2>
                <WarningText3>
                    If you purchase this token, you may not be able to sell it back.
                </WarningText3>
                <WarningText3 style={{ fontWeight: 400 }}>
                    Note: Token with restricted transfer functionality can cause loss of funds
                </WarningText3>
                <CheckboxWrapper>
                    <StyledInput
                        type="checkbox"
                        checked={checked}
                        onChange={() => setChecked(x => !x)}
                    />
                    <WarningText3>
                        I understand
                    </WarningText3>
                </CheckboxWrapper>
            </WarningWrapper>
            <AddButton onClick={handleImport} disabled={!checked}>
                Import
            </AddButton>
        </Wrapper>
    )
}

export default AddTokenWarning
