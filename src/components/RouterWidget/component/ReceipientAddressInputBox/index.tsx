import React from 'react'
import styled from 'styled-components'

interface Props {
    inputValue: string;
    inputHandler:(e:any)=>void
    disabled: boolean;
}

const Wrapper = styled.div`
    display: grid;
    height: 50px;
`

const AssetInput = styled.input`
    font-family: 'Inter', sans-serif;
    width: 350px;
    font-size: 18px;
    text-align: left;
    color: #FFFFFF;
    background: none;
    border: none;
    border-bottom: 1px solid #272833;
    &:focus{
        outline: none;
    }
    @media only screen and (max-width: 750px){
        font-size: 14px;
		width: 324px;
        height: 35px;
    }
`
const ReceipientAddress = ({inputValue, inputHandler ,disabled}:Props) => {
    return (
        <Wrapper>
            <AssetInput placeholder="Destination Address" value={inputValue} onChange={inputHandler} disabled={disabled}/>
        </Wrapper>
    )
}

export default ReceipientAddress
