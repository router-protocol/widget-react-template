import React from 'react'
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { IS_MAINNET } from '../../config/config'

interface Props {
    
}

const StyledButton = styled(Button)`
  &&&{
    //background: ${({ theme})=>theme.bg3};
    background: transparent;
    color: ${({ theme})=>theme.gray2};
    border: 2px solid ${({ theme})=>theme.gray1};
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    width: 165px;
    height: 35px; 
    text-transform: none;
    padding: 0;
    padding-left: 2px;
    padding-right: 2px;
    border-radius: 10px;
    box-shadow: none;
    font-weight: 400;
    margin-right: 16px;
    ${({ theme }) => theme.mediaWidth.upToLarge`
        display: none;
  	`};
  }
`

const TestFaucet = (props: Props) => {
    if(!IS_MAINNET) {
      return (
  
        <StyledButton
        variant="contained"
        color="primary"
        endIcon={<OpenInNewIcon style={{width: '16px'}}/>}
        onClick={() => window.open('https://faucet.routerprotocol.com/', '_blank', 'noopener,noreferrer')}
      >
        Testnet Faucet
      </StyledButton> 
      )
    } else {
      return(null)
    }
      
    
}

export default TestFaucet