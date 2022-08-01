import styled from "styled-components";
import Switch from "@material-ui/core/Switch";
import { Button } from "@material-ui/core";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import { CircularProgress } from "@material-ui/core";
import ApproveTick from "../../assets/react-components/ApproveTick";
import * as React from 'react';

interface Props {
  shouldSourceApprove: boolean;
  shouldFeeApprove: boolean;
  sourceMaxToggle: boolean;
  feeMaxToggle: boolean;
  sourceLoading: boolean;
  feeLoading: boolean;
  setSourceMaxToggle: (x: boolean) => void;
  setFeeMaxToggle: (x: boolean) => void;
  sourceSymbol: string;
  feeSymbol: string;
  isCrossChain: boolean;
  sourceApproveHandler: () => void;
  feeApproveHandler: () => void;
  close: () => void;
  ctaColor: string; 
  textColor: string;
  backgroundColor: string;
}

const Wrapper = styled.div<{backgroundColor: string; textColor: string;}>`
  position: relative;
  color: ${({textColor}) => textColor !== "" ? textColor :  "#FFFFFF" };
  background: ${({backgroundColor}) => backgroundColor !== "" ? backgroundColor : "linear-gradient(0deg, #212129, #212129)" };
  backdrop-filter: blur(32px);
  font-family: "Inter", sans-serif;
  width: 360px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  padding-top: 30px;
  padding-bottom: 15px;
  @media only screen and (max-width: 750px){
    width: 345px;
  }
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 400;
  text-align: center;
  margin: 10px 0;
  margin-top: 40px;
`;

const SubTitle = styled.div<{textColor: string;}>`
  font-size: 14px;
  padding: 0 15px;
  margin: 15px 0;
  text-align: center;
  color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF35" };
`;

const ButtonWrapper = styled.div`
  margin: 10px 0px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
`;

const ApproveButton = styled(Button)<{ ctaColor: string; textColor: string }>`
  &&& {
    background: ${({ disabled, ctaColor }) =>
      disabled
        ? "linear-gradient(0deg, rgba(88, 88, 99, 0.5), rgba(88, 88, 99, 0.5))"
        : ctaColor
        ? ctaColor
        : "#00A0BE"};
    color: ${({ disabled, textColor }) =>
      disabled ? "#ffffff50" : textColor ? textColor : "#FFFFFF"};
    font-family: "Inter", sans-serif;
    font-size: 1rem;
    width: fit-content;
    height: 45px;
    text-transform: none;
    border-radius: 7px;
    box-shadow: none;
    font-weight: 400;
    width: 100%;
  }
`;

const CrossApproveButton = styled(ApproveButton)`
  &&& {
    font-size: 14px;
    padding: 0 10px;
    max-width: 150px;
  }
`;

const StyledCloseIcon = styled(CloseRoundedIcon)<{textColor: string;}>`
  position: absolute;
  color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF" };
  right: 15px;
  top: 15px;
  width: 1.7rem !important;
  cursor: pointer;
  height: 1.7rem !important;
`;

const StyledCircularProgressWrapper = styled.div`
  padding-left: 2px;
  padding-top: 2px;
`;

const StyledCircularProgress = styled(CircularProgress)<{ textColor: string }>`
  &&& {
    width: 13px !important;
    height: 13px !important;
    color: ${({textColor}) => textColor !== "" ? textColor : "#FFFFFF55"};
    .MuiCircularProgress-colorPrimary {
      color: #FFFFFF55;
  }
`;

const StyledSwitch = styled(Switch)`
  & > .MuiSwitch-colorPrimary.Mui-checked {
    color: ${({ theme }) => theme.blue1} !important;
  }
  & > .MuiSwitch-colorPrimary.Mui-disabled.Mui-checked {
    color: #ffffff55 !important;
  }
  & > .MuiSwitch-colorPrimary.Mui-checked + .MuiSwitch-track {
    background-color: rgba(0, 133, 255, 0.2) !important;
  }
  & > .MuiSwitch-colorPrimary.Mui-disabled + .MuiSwitch-track {
    background-color: #000000 !important;
  }
`;
const CrossChainSwitches = styled.div`
  display: grid;
  row-gap: 15px;
  margin: 20px 0;
`;

const SwitchWrapper = styled.div`
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
  border-radius: 40px;
  padding: 0px 20px;
  font-size: 14px;
`;

const ApprovalMapWrapper = styled.div``;

const ApprovalWindow = ({
  shouldSourceApprove,
  shouldFeeApprove,
  sourceMaxToggle,
  feeMaxToggle,
  setSourceMaxToggle,
  setFeeMaxToggle,
  sourceLoading,
  feeLoading,
  sourceSymbol,
  isCrossChain,
  feeSymbol,
  sourceApproveHandler,
  feeApproveHandler,
  close,
  ctaColor, 
  textColor, 
  backgroundColor,
}: Props) => {
  return (
    <Wrapper
      backgroundColor={backgroundColor}
      textColor={textColor}
    >
      <StyledCloseIcon
        onClick={close}
        textColor={textColor}
      />
      <ApproveTick
        color={ctaColor ? ctaColor : "#00A0BE"}
      />
      <Title>
        Approve{" "}
        {isCrossChain && feeSymbol !== sourceSymbol
          ? `${feeSymbol} & ${sourceSymbol}`
          : sourceSymbol}{" "}
        transfer
      </Title>
      <SubTitle textColor={textColor}>
        Give permission to smart contract in order to move{" "}
        {isCrossChain && feeSymbol !== sourceSymbol
          ? `${feeSymbol} & ${sourceSymbol}`
          : sourceSymbol}{" "}
        on your behalf.
      </SubTitle>
      <SwitchWrapper></SwitchWrapper>
      {isCrossChain && feeSymbol !== sourceSymbol ? (
        <CrossChainSwitches>
          <SwitchWrapper>
            {feeSymbol} Infinite Approval
            <StyledSwitch
              checked={feeMaxToggle}
              onChange={
                feeMaxToggle
                  ? () => setFeeMaxToggle(false)
                  : () => setFeeMaxToggle(true)
              }
              name="checkedB"
              color="primary"
              disabled={!shouldFeeApprove}
            />
          </SwitchWrapper>
          <SwitchWrapper>
            {sourceSymbol} Infinite Approval
            <StyledSwitch
              checked={sourceMaxToggle}
              onChange={
                sourceMaxToggle
                  ? () => setSourceMaxToggle(false)
                  : () => setSourceMaxToggle(true)
              }
              name="checkedB"
              color="primary"
              disabled={!shouldSourceApprove}
            />
          </SwitchWrapper>
        </CrossChainSwitches>
      ) : (
        <SwitchWrapper style={{ margin: "10px 0" }}>
          {sourceSymbol} Infinite Approval
          <StyledSwitch
            checked={sourceMaxToggle}
            onChange={
              sourceMaxToggle
                ? () => setSourceMaxToggle(false)
                : () => setSourceMaxToggle(true)
            }
            name="checkedB"
            color="primary"
            disabled={!shouldSourceApprove}
          />
        </SwitchWrapper>
      )}

      <ApprovalMapWrapper></ApprovalMapWrapper>

      {isCrossChain && feeSymbol !== sourceSymbol ? (
        <ButtonWrapper>
          <CrossApproveButton
            onClick={feeApproveHandler}
            disabled={feeLoading || !shouldFeeApprove}
            textColor={textColor}
            ctaColor={ctaColor}
          >
            {feeLoading ? (
              <>
                <span>Approving&nbsp;{feeSymbol}&nbsp;</span>
                <StyledCircularProgressWrapper>
                  <StyledCircularProgress
                      textColor={textColor}
                  />
                </StyledCircularProgressWrapper>
              </>
            ) : (
              `Approve ${feeSymbol}`
            )}
          </CrossApproveButton>
          <CrossApproveButton
            onClick={sourceApproveHandler}
            disabled={sourceLoading || !shouldSourceApprove}
            textColor={textColor}
            ctaColor={ctaColor}
          >
            {sourceLoading ? (
              <>
                <span>Approving&nbsp;{sourceSymbol}&nbsp;</span>
                <StyledCircularProgressWrapper>
                  <StyledCircularProgress
                      textColor={textColor}
                  />
                </StyledCircularProgressWrapper>
              </>
            ) : (
              `Approve ${sourceSymbol}`
            )}
          </CrossApproveButton>
        </ButtonWrapper>
      ) : (
        <ButtonWrapper>
          <ApproveButton
            onClick={sourceApproveHandler}
            disabled={sourceLoading || !shouldSourceApprove}
            textColor={textColor}
            ctaColor={ctaColor}
          >
            {sourceLoading ? (
              <>
                <span>Approving&nbsp;{sourceSymbol}&nbsp;</span>
                <StyledCircularProgressWrapper>
                  <StyledCircularProgress
                    textColor={textColor}
                  />
                </StyledCircularProgressWrapper>
              </>
            ) : (
              `Approve ${sourceSymbol}`
            )}
          </ApproveButton>
        </ButtonWrapper>
      )}
    </Wrapper>
  );
};

export default ApprovalWindow;
