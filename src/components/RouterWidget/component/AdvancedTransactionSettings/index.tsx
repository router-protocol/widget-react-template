import React, { Dispatch, SetStateAction, useState } from 'react'
import styled from 'styled-components'
import Switch from '@material-ui/core/Switch';
import MenuWrapper from '../Menu/MenuWrapper';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { Button } from '@material-ui/core';
// import { useLocation } from 'react-router';

interface Props {
    close: () => void;
    setTabValue: Dispatch<SetStateAction<number>>;
    expertModeToggle: boolean;
    setExpertModeToggle: Dispatch<SetStateAction<boolean>>;
    slippageTolerance: string;
    setSlippageTolerance: Dispatch<SetStateAction<string>>;
    textColor: string;
    backgroundColor: string;
}

const Wrapper = styled.div<{backgroundColor: string; textColor: string;}>`
    width: clamp(250px,100%,360px);
    height: 100%;
    border-radius: 10px;
    background: ${({backgroundColor}) => backgroundColor !== "" ? backgroundColor : "linear-gradient(0deg, #1E1E25, #1E1E25), linear-gradient(181.2deg, #2E3146 -89.03%, #0A0A0E 206.54%)"};
    backdrop-filter: blur(32px);
    display: grid;
    grid-template-rows: repeat(2,auto);
    padding: 15px;
    align-items: center;
    font-family: 'Inter', sans-serif;
    position: relative;
    color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF"};
    box-shadow: 3px 3px 10px 4px rgba(0, 0, 0, 0.05);
`
const Title = styled.div`
    font-weight: 500;
    font-size: 14px;
    padding-bottom: 10px;
`
const SubHeading = styled.div`
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    font-size: 12px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`
const Error = styled(SubHeading)`
    color: ${({ theme }) => theme.blue2};
`

const ComponentWrapper = styled.div`
    display: grid;
    padding: 5px 0;
`

const PillsWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 5px;
`

const Pill = styled.div<{ selected: boolean; backgroundColor: string;}>`
    background: ${({ selected, backgroundColor}) => !selected ? backgroundColor !== "" ? "rgba(255, 255, 255, 0.15)" : "#222429" : "linear-gradient(0deg, #0085FF, #0085FF), #222429"};
    border: 0.5px solid #585863;
    border-radius: 14px;
    padding: 4px 9px;
    font-family: 'Inter', sans-serif;
    font-weight: 300;
    font-size: 12px;
    cursor: pointer;
    height: 28px;
    min-width: 45px;
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
`
const PillInput = styled.input`
    height: 25px;
    width: 22px;
    background: none;
    border: none;
    color: ${({ theme }) => theme.text1};
    &:focus{
        outline: none;
    }
`
const ToggleButtonWrapper = styled.div`
    display:flex;
    font-size: 14px;
    align-items: center;
    justify-content: left;
`

const ExpertWrapper = styled.div<{
    textColor: string;
    backgroundColor: string;
}>`
    width: 320px;
    color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF" };
    font-family: 'Inter', sans-serif;
    background: ${({backgroundColor}) => backgroundColor !== "" ? backgroundColor : "linear-gradient(0deg, #212129, #212129)" };    
    backdrop-filter: blur(32px);
    border-radius: 15px;
    display: grid;
    place-items: center;
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

const StyledCloseIcon1 = styled(StyledCloseIcon)`
	right: 10px;
	top: 10px;
	width: 1.4rem !important;
	height: 1.4rem !important;
`
const TurnOnButton = styled(Button)`
	&&&{
    background: #00A0BE;
    color: #FFFFFF;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    width: fit-content;
    height: 35px; 
    text-transform: none;
    padding: 0 20px;
    border-radius: 7px;
    box-shadow: none;
    font-weight: 400;
    margin-bottom: 20px;
  }
`

const WarningText = styled.div`
    font-size: 16px;
    text-align: center;
    display: grid;
    row-gap: 10px;
    margin: 20px 0;
`

const AdvancedTransactionSettings = ({ close, setTabValue, expertModeToggle, setExpertModeToggle, slippageTolerance, setSlippageTolerance, textColor, backgroundColor}: Props) => {
    // const [slippageTolerance, slippageTolerance] = useSlippageTolerance()
    const [showError, setShowError] = useState(false)
    // const [expertModeToggle, setExpertModeToggle] = useExpertModeToggle()
    const [showExpertTurnOn, setShowExpertTurnOn] = useState(false)
    // const [, setTabValue] = useRecipientAddressSwitch()

    const re = /^\d*\.?\d*$/

    const handlePillInput = (e: any) => {
        if (re.test(e.target.value)) {
            if (parseFloat(e.target.value) >= 50) {
                setShowError(true)
                setSlippageTolerance("49")
                return
            }
            if (showError) {
                setShowError(false)
            }
            setSlippageTolerance(e.target.value);
        } else {
            e.target.value = slippageTolerance
        }
    }

    const handleSlippageTolerance = (tolerance: string) => {
        setSlippageTolerance(tolerance)
    }

    const handleTurnOnClick = () => {
        // let sign = prompt("Please type the word \"confirm\" to enable expert mode.What's your sign?")
        // if(sign==="confirm"){
        // }
        setExpertModeToggle(true)
        setShowExpertTurnOn(false)
    }

    const ExpertTurnOn = () => (
        <ExpertWrapper backgroundColor={backgroundColor} textColor={textColor}>
            <StyledCloseIcon onClick={() => setShowExpertTurnOn(false)} />
            <WarningText>
                <span>Are you sure?</span>
                <span>Expert mode turns off the confirm transaction prompt and allows high slippage trades that often result in bad rates and lost funds.</span>
                <span>ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.</span>
            </WarningText>
            <TurnOnButton onClick={handleTurnOnClick}>Turn On Expert Mode</TurnOnButton>
        </ExpertWrapper>
    )

    return (
        <>
            <MenuWrapper open={showExpertTurnOn} onClose={() => setShowExpertTurnOn(false)}>
                <ExpertTurnOn />
            </MenuWrapper>
            <Wrapper backgroundColor={backgroundColor} textColor={textColor}>
                <StyledCloseIcon1 onClick={close} />
                <Title>Transaction Settings</Title>
                <ComponentWrapper>
                    <SubHeading>Slippage tolerance</SubHeading>
                    <PillsWrapper>
                        <Pill backgroundColor={backgroundColor} selected={slippageTolerance === "1"} onClick={() => handleSlippageTolerance("1")}>1%</Pill>
                        <Pill backgroundColor={backgroundColor} selected={slippageTolerance === "5"} onClick={() => handleSlippageTolerance("5")}>5%</Pill>
                        <Pill backgroundColor={backgroundColor} selected={slippageTolerance === "10"} onClick={() => handleSlippageTolerance("10")}>10%</Pill>
                        <Pill backgroundColor={backgroundColor} selected={false}><PillInput placeholder={slippageTolerance} onChange={handlePillInput} />%</Pill>
                    </PillsWrapper>
                    {
                        showError &&
                        <Error>Enter a valid slippage percentage</Error>
                    }
                </ComponentWrapper>
                <ComponentWrapper>
                    <ToggleButtonWrapper>
                        <span>Toggle Expert Mode</span>
                        <Switch
                            checked={expertModeToggle}
                            onChange={expertModeToggle ? () => { setExpertModeToggle(false); setTabValue(0) } : () => setExpertModeToggle(true)}
                            name="checkedB"
                            color="primary"
                        />
                    </ToggleButtonWrapper>
                </ComponentWrapper>
                {/* <ComponentWrapper>
                    <SubHeading>Bridge Fee Token <StyledQuestion/></SubHeading>
                    <PillsWrapper>
                        <Pill selected={sourceToken?feeAsset.symbol === sourceToken.symbol:false}>{sourceToken&&sourceToken.symbol}</Pill>
                        <Pill selected={feeAsset.symbol === "ETH"}>ETH</Pill>
                        <Pill selected={feeAsset.symbol === "USDT"}>USDT</Pill>
                    </PillsWrapper>
                </ComponentWrapper> */}
            </Wrapper>
        </>
    )
}

export default AdvancedTransactionSettings
