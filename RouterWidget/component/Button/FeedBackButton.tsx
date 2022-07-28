import { Button } from '@material-ui/core'
import React, { useMemo } from 'react'
import { useLocation } from 'react-router'
import styled from 'styled-components'

const Wrapper = styled(Button)`
    &&&{
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    padding: 5px 10px;
    text-align: center;
    margin:0px;
    background:#FF931E;
    border: 1px solid rgba(88, 88, 99, 0.24);
    z-index:15;
    border-radius: 5px 5px 0px 0px;
    -moz-transform:rotate(-90deg);
    -ms-transform:rotate(-90deg);
    -o-transform:rotate(-90deg);
    -webkit-transform:rotate(-90deg);
    transform-origin: bottom right;
    position: fixed;
    right: 0px;
    bottom: 30vh;
    color: #FFFFFF;
    letter-spacing: 2px;
    }
`

const FeedBackButton = ({ feedBackURL }: { feedBackURL: string }) => {
    const location = useLocation()
    const isWidget = useMemo(() => new URLSearchParams(location.search).get("isWidget"), [location])
    return (
        <>
            {
                isWidget?.toLowerCase() !== 'true' &&
                <Wrapper onClick={() => window.open(feedBackURL, '_blank', 'noopener,noreferrer')}>
                    FEEDBACK
                </Wrapper>
            }
        </>
    )
}

export default FeedBackButton
