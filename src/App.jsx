import "./App.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { TonWallet } from "./ton";

function App() {
    return (
        <TonConnectUIProvider
            manifestUrl="https://gonesis-backend.dev.nftgo.dev/ton/manifest.json"
            enableAndroidBackHandler={false}
            actionsConfiguration={{
                twaReturnUrl: "https://t.me/gonesis_ai_bot/chat",
            }}
        >
            <TonWallet />
        </TonConnectUIProvider>
    );
}

export default App;
