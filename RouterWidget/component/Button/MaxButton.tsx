import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div<{ctaColor: string;}>`
    padding: 1px 5px;
    border: 1px solid ${({ctaColor}) => ctaColor !== "" ? ctaColor : "#00A0BE" };
    // width: 60px;
    // height: 35px;
    background: ${({ctaColor}) => ctaColor !== "" ? ctaColor.concat('20') : "#00A0BE".concat('20')};
    border-radius: 6px;
    color: ${({ctaColor}) => ctaColor !== "" ? ctaColor : "#00A0BE" };
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    display: grid;
    place-items: center;
    // padding: 0 10px;
    cursor: pointer;

    @media only screen and (max-width: 750px){
        width: 45px;
        height: 28px;
        font-size: 14px;
        border-radius: 5px;
    }
`

const MaxButton = ({ctaColor}: {ctaColor: string;}) => {
    return (
        <Wrapper ctaColor={ctaColor !== "" ? ctaColor : ''}>
            MAX
        </Wrapper>
    )
}

export default MaxButton
