import React from 'react'
import styled from 'styled-components'
import './ReactToastify.css';

const Toast = styled.div`
    display: grid;
    align-items: center;
    grid-template-rows: 28px 20px 20px;
    font-family: 'Inter', sans-serif;
`

const Summary = styled.div`
    font-size: 14px;
    color: #FFFFFF;
`

const Transaction = styled.div`
    font-size: 12px;
    color: #2172E5;
    cursor: pointer;
`

interface Props {
    summary: string;
    srcTxExplorerLink: string;
    dstTxExplorerLink: string;
}

const ToastComponent = ({ summary, srcTxExplorerLink, dstTxExplorerLink }: Props) => {

    return (
        <Toast>
            <Summary>{summary}</Summary>
            <Transaction onClick={() => window.open(srcTxExplorerLink, 'noopener,noreferrer')}>View Source Transaction</Transaction>
            {dstTxExplorerLink && <Transaction onClick={() => window.open(dstTxExplorerLink, 'noopener,noreferrer')}>View Destination Transaction</Transaction>}
        </Toast>
    )
}

export default ToastComponent