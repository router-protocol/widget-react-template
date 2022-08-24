import { CircularProgress, useMediaQuery } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { MEDIA_WIDTHS } from "../../constant";

interface Props {
  clicked: () => void;
  isDisabled: boolean;
  icon: string;
  title: string;
  locked: boolean;
  ctaColor: string; 
  textColor: string;
}

const Wrapper = styled.div`
  position: relative;
`;

const ButtonWrapper = styled.button<{
  active: boolean;
  locked: boolean;
  textColor: string;
  ctaColor: string;
}>`
  &&& {
    font-family: "Inter", sans-serif;
    width: 100px;
    height: 100px;
    min-width: 0;
    min-height: 0;
    border-radius: 50%;
    background: ${({ctaColor}) => ctaColor !== "" ? ctaColor : "linear-gradient(0deg, #212129, #212129)" };
    backdrop-filter: blur(42px);
    font-weight: 600;
    font-size: 20px;
    display: grid;
    place-items: center;
    color: ${({ active, locked, textColor }) =>
      locked
        ? "#585863"
        : active
        ? textColor
        ? textColor
        : "#FFFFFF"
        : "#585863"};
    cursor: ${({ locked }) => (locked ? "default" : "pointer")};
    border: 1px solid
      ${({ active, locked }) =>
        locked ? "#00A0BE55" : active ?  "#00A0BE55" : "#585863"};
    transition: all 0.2s ease-in-out;
    :active {
      outline: none;
      border: none;
    }
    :focus {
      outline: none;
      border: none;
    }
    :hover {
      filter: ${({ active, ctaColor }) =>
        active
          ? ctaColor
          ? `drop-shadow( 0 0 20px ${ctaColor})`
          : "drop-shadow( 0 0 20px #00A0BE)"
          : "none"};
    }

    @media only screen and (max-width: 750px){
      width: 326px;
      height: 50px;
      border-radius: 10px;
      border: 1px solid #A3A4A480;
      filter: none;
      box-shadow: 0px 0px 11px -21px #00A0BE;
      font-family: 'Inter', sans-serif;
      font-size: 18px;
      font-weight: 500;
      text-align: center;
    }
`;

const StyledCircularProgressWrapper = styled.div<{ active: boolean }>`
  display: ${({ active }) => (active ? "inline-block" : "none")};
  position: absolute;
  top: -1.5px;
  left: -2px;

  @media only screen and (max-width: 750px){
    display: none;
  }
`;

const StyledCircularProgress = styled(CircularProgress)<{ctaColor: string;}>`
  &&& {
    width: 103px !important;
    height: 103px !important;
    color: ${({ctaColor}) => ctaColor !== "" ? ctaColor : "#00A0BE" };

    .MuiCircularProgress-colorPrimary {
      color: ${({ctaColor}) => ctaColor !== "" ? ctaColor : "#00A0BE" };
    }
  }
`;

//
const SwapButton = ({ clicked, isDisabled, icon, title, locked, ctaColor, textColor }: Props) => {
  const upToSmall = useMediaQuery(`(max-width: ${MEDIA_WIDTHS.upToSmall}px)`);
  return (
    <Wrapper>
      <StyledCircularProgressWrapper active={locked}>
        <StyledCircularProgress
          ctaColor={ctaColor}
        />
      </StyledCircularProgressWrapper>
      <ButtonWrapper
        disabled={locked}
        onClick={clicked}
        className="abc"
        active={!isDisabled}
        locked={locked}
        textColor={textColor}
        ctaColor={ctaColor}
      >
        {upToSmall ? title : title.toUpperCase()}
        {/*<img src={icon} style={{fill: '#FFFF !important',width:'1rem'}}/>*/}
      </ButtonWrapper>
    </Wrapper>
  );
};

export default SwapButton;
