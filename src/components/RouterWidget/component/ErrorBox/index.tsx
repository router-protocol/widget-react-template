import React from 'react'
import styled from 'styled-components'
import WarningIcon from '../../assets/react-components/WarningIcon'

const Wrapper = styled.div`
    width: 112px;
    height: 42px;
    background: #00A0BE20;
    border-radius: 10px;
    color: #00A0BE;
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: 0 10px;

    @media only screen and (max-width: 750px){
        font-size: 16px;
        width: 85px;
        height: 35px;
    }
`

const WarningIconWrapper = styled.div`
    margin-top: 5px;

    @media only screen and (max-width: 750px){
        transform: scale(0.8);
    }
`

const ErrorBox = () => {
    return (
        <Wrapper>
            <WarningIconWrapper style={{}}>
                <WarningIcon/>
            </WarningIconWrapper>
            Error
        </Wrapper>
    )
}

export default ErrorBox
