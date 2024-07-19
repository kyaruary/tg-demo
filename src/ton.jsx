import { useIsConnectionRestored, useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useEffect } from "react";
import { useState } from "react";
import { useMemo } from "react";
import { usePayload } from "./use-payload";

export function TonWallet() {
    const [tonConnectUI] = useTonConnectUI();
    const address = useTonAddress(true);
    const wallet = useTonWallet();
    const isConnectionRestored = useIsConnectionRestored();
    const connected = tonConnectUI.connected;
    const [verifying, setVerifying] = useState(false);
    const [success, setSuccess] = useState(false);
    const { hasPayload } = usePayload();

    const handleClick = async () => {
        if (tonConnectUI.connected) {
            await tonConnectUI.disconnect();
        }
        tonConnectUI.modal.open();
    };

    const loading = useMemo(() => {
        if (success) {
            return false;
        }
        if (verifying) {
            return true;
        }
        return isConnectionRestored === false || !hasPayload || connected;
    }, [connected, hasPayload, isConnectionRestored, success, verifying]);

    const text = useMemo(() => {
        if (verifying) {
            return "Connecting...";
        }
        return "Connect Wallet";
    }, [verifying]);

    useEffect(() => {
        if (isConnectionRestored === false || !tonConnectUI.connected) {
            return;
        }
        if (wallet) {
            if (!wallet?.connectItems?.tonProof?.proof) {
                if (tonConnectUI.connected) {
                    tonConnectUI.disconnect();
                }
            } else {
                setVerifying(true);
                setTimeout(() => {
                    setVerifying(false);
                    setSuccess(true);
                }, 10 * 1000);
            }
        }
    }, [isConnectionRestored, tonConnectUI, wallet]);

    return (
        <>
            <button onClick={handleClick}>
                {loading ? "loading..." : ""}
                {text}
            </button>
            <p>{address ?? "--"}</p>
            <p>{wallet?.connectItems?.tonProof.proof?.signature}</p>
            <p>{connected ? "connected" : "not - connected"}</p>
            <p>{success ? "login success" : null}</p>
            <input type="text" placeholder="Amount" />
        </>
    );
}
