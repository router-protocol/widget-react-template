import React from "react";
import styled from "styled-components";
import WarningIcon from "../../assets/react-components/WarningIcon";

const Wrapper = styled.div<{ warning: boolean }>`
  height: 35px;
  background: ${({ warning }) =>
    !warning ? "#E8425A" : "#F3841E"}20;
  border-radius: 10px;
  color: ${({ warning }) => (!warning ? "#E8425A" : "#F3841E")};
  font-family: "Inter", sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 0 10px;

  @media only screen and (max-width: 750px){
    height: 100%;
    padding: 5px 5px;
    margin: 0 15px;
  }
`;
const WarningIconWrapper = styled.div`
  transform: scale(0.5) translateX(4px);
  margin-top: 1.75px;
`;

const ErrorBoxMessage = ({ message }: { message: string }) => {
  const warning = message.split(" : ")[0] === "Warning" ? true : false;
  return (
    <Wrapper warning={warning}>
      <WarningIconWrapper>
        <WarningIcon fill={!warning ? "#E8425A" : "#F3841E"} />
      </WarningIconWrapper>
      {message}
    </Wrapper>
  );
};

export default ErrorBoxMessage;
