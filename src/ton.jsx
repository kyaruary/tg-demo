import { useTonAddress, useTonConnectModal, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

export function TonWallet() {
    const [tonConnectUI] = useTonConnectUI();
    const { open } = useTonConnectModal();
    const address = useTonAddress(false);
    const wallet = useTonWallet();

    const connect = async () => {
        if (tonConnectUI.connected) {
            await tonConnectUI.disconnect();
        }
        tonConnectUI.setConnectRequestParameters({
            state: "loading",
        });
        // tonConnectUI.uiOptions = {
        //   actionsConfiguration: {
        //     returnStrategy: 'none',
        //     twaReturnUrl: 'https://t.me/ChatCoinAppBot/chat',
        //   },
        // };
        open();
        const response = await fetch("https://gonesis-backend.dev.nftgo.dev/api/v1/login/ton/params");
        const json = await response.json();
        const payload = json.data ?? undefined;
        tonConnectUI.setConnectRequestParameters({
            state: "ready",
            value: {
                tonProof: payload,
            },
        });
    };

    return (
        <>
            <button onClick={connect}>Connect Wallet</button>
            <p>{address ?? "--"}</p>
            <p>{wallet?.connectItems?.tonProof.proof?.signature}</p>
        </>
    );
}
