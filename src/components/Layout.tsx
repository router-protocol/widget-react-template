import { ReactNode } from "react";
import styled from "styled-components";

type Props = {
  children?: ReactNode;
};

const Wrapper = styled.div`
  display: grid;
`

export default function Layout({ children }: Props) {
  return (
    <Wrapper>
      {children}
    </Wrapper>
  );
}
