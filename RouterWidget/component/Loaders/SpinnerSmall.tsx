import React from 'react'
import { CircularProgress } from '@material-ui/core'
import styled from 'styled-components'

interface Props {
    loading: boolean;
    ctaColor: string;
}

const StyledCircularProgressWrapper = styled.div`
    display: inline;
    position: relative;
    margin: 0 2px;
`

const StyledCircularProgress = styled(CircularProgress) <{ active: boolean; ctaColor: string }>`
    &&&{
        width: 15px !important;
        height: 15px !important;
        color:  ${({ctaColor}) => ctaColor !== "" ? ctaColor : "#00A0BE"};
        .MuiCircularProgress-colorPrimary{
            color: ${({ctaColor}) => ctaColor !== "" ? ctaColor : "#00A0BE"};
        }
        margin: 0;
        padding: 0;
        position: relative;
        top: 1px;
    }
`


const SpinnerSmall = ({ loading, ctaColor }: Props) => {
    return (
        <StyledCircularProgressWrapper>
            <StyledCircularProgress active={loading} ctaColor={ctaColor} />
        </StyledCircularProgressWrapper>
    )
}

export default SpinnerSmall
