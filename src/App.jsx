import "./App.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { TonWallet } from "./ton";

function App() {
    return (
        <TonConnectUIProvider
            manifestUrl="https://gonesis-backend.dev.nftgo.dev/ton/manifest.json"
            restoreConnection={false}
            enableAndroidBackHandler={false}
            actionsConfiguration={{
                twaReturnUrl: "https://t.me/ChatCoinAppBot",
            }}
        >
            <TonWallet />
        </TonConnectUIProvider>
    );
}

export default App;
