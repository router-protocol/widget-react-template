import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import theme from "./theme";
import Layout from "./components/Layout";
import ConnectButton from "./components/ConnectButton";
import AccountModal from "./components/AccountModal";
import "@fontsource/inter";
import RouterWidget from "./components/RouterWidget";
import styled from "styled-components";

const WidgetWrapper = styled.div`
  height: 610px;
  width: 100%;
  border: 2px solid black;
`

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <h1 style={{ fontSize: "24px" }}>3rd Party Application</h1>
        <ConnectButton handleOpenModal={onOpen} />
        <AccountModal isOpen={isOpen} onClose={onClose} />
        <WidgetWrapper>
          <RouterWidget
            useWidgetWallet={false}
            accountAddress={''}
            widgetId={"24"}
            textColor={""}
            ctaColor={""}
            backgroundColor={""}
          />
        </WidgetWrapper>
      </Layout>
    </ChakraProvider>
  );
}

export default App;
