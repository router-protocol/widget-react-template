import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import theme from "./theme";
import Layout from "./components/Layout";
import ConnectButton from "./components/ConnectButton";
import AccountModal from "./components/AccountModal";
import "@fontsource/inter";
import RouterWidget from "./components/RouterWidget";
import styled from "styled-components";

const WidgetWrapper = styled.div`
  height: 100%;
  width: 100%;
  border: 2px solid black;
`

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    // <ChakraProvider theme={theme}>
      <Layout>
        {/* <h1 style={{ fontSize: "24px" }}>3rd Party Application</h1>
        <ConnectButton handleOpenModal={onOpen} />
        <AccountModal isOpen={isOpen} onClose={onClose} /> */}
        <WidgetWrapper>
          <RouterWidget
            useWidgetWallet={true}
            accountAddress={''}
            widgetId={"24"}
            textColor={"rgb(242,242,242)"}
            ctaColor={"rgb(114,23,244)"}
            backgroundColor={"rgb(18,3,46)"}
            logoURI={"https://app.aavegotchi.com/images/aavegotchi-dark.gif"}
            fromChain={"56"}
            toChain={"137"}
            fromToken={"0x9c08941465EB16982Fa8385A7BbD74F7972C5a27"}
            toToken={"0x101A023270368c0D50BFfb62780F4aFd4ea79C35"}
            srcChains={""}
            dstChains={""}
            srcTokens={""}
            dstTokens={""}
          />
        </WidgetWrapper>
      </Layout>
    // </ChakraProvider>
  );
}

export default App;
