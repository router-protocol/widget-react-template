import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    height: 18px;
    width: 40px;
    border-radius: 5px;
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
    letter-spacing: 0em;
    text-align: center;
    display: grid;
    place-items: center;
    color: #00A0BE;
    border: 1px solid #58586355;
    background: #5858633D;
    position: relative;
`

const BetaButton = () => {
    return (
        <Wrapper>
            ALPHA
        </Wrapper>
    )
}

export default BetaButton
