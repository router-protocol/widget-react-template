import React from "react";

import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
`;

const UpperLeftCircle = styled.div`
  position: fixed;
  width: 511px;
  height: 511px;
  left: -225px;
  top: -375px;
  background: #196c80;
  -webkit-filter: blur(500px);
  filter: blur(500px);
`;
const LowerLeftCircle = styled.div`
  position: fixed;
  width: 150px;
  height: 150px;
  left: 100px;
  top: 950px;
  background: #8b5a64;
  -webkit-filter: blur(100px);
  filter: blur(150px);
`;

const LowerRightCircle = styled.div`
  position: fixed;
  width: 150px;
  height: 150px;
  left: 1150px;
  top: 1050px;
  background: #e64f11;
  -webkit-filter: blur(250px);
  filter: blur(250px);
`;

const UpperRightCircle = styled.div`
  position: fixed;
  width: 100px;
  height: 100px;
  left: 1450px;
  top: -50px;
  background: #8b5a64;
  -webkit-filter: blur(400px);
  filter: blur(100px);
`;

function Background() {
  return (
    <Wrapper>
      <UpperLeftCircle />
      <LowerLeftCircle />
      <LowerRightCircle />
      <UpperRightCircle />
    </Wrapper>
  );
}

export default Background;
