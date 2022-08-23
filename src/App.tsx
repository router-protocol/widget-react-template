import Layout from "./components/Layout";
import "@fontsource/inter";
import RouterWidget from "./components/RouterWidget";
import styled from "styled-components";

const WidgetWrapper = styled.div`
  height: 100%;
  width: 100%;
`

function App() {
  return (
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
            toToken={"0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7"}
            srcChains={""}
            dstChains={""}
            srcTokens={""}
            dstTokens={""}
          />
      </WidgetWrapper>
  );
}

export default App;
