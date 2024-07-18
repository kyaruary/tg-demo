import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useCallback } from "react";
import { useRef } from "react";
import { buildSignature } from "./build-sign";
import { useEffect } from "react";
import { useState } from "react";

export function TonWallet() {
    const init = useRef(true);
    const [tonConnectUI] = useTonConnectUI();
    const address = useTonAddress(true);
    const wallet = useTonWallet();
    const [authorized, setAuthorized] = useState(false);

    const getPayload = useCallback(async () => {
        if (init.current) {
            init.current = false;
            tonConnectUI.setConnectRequestParameters({
                state: "loading",
            });
        }
        const xTimestamp = `${Date.now()}`;
        const response = await fetch("https://gonesis-backend.dev.nftgo.dev/api/v1/login/ton/params", {
            headers: {
                "x-timestamp": xTimestamp,
                "x-signature": buildSignature({}, xTimestamp),
            },
        });
        const json = await response.json();
        const payload = json.data ?? undefined;
        console.log("get payload", payload);
        if (payload) {
            tonConnectUI.setConnectRequestParameters({
                state: "ready",
                value: {
                    tonProof: payload,
                },
            });
        } else {
            tonConnectUI.setConnectRequestParameters(null);
        }
    }, [tonConnectUI]);

    if (init.current) {
        getPayload();
    }

    const handleClick = () => {
        if (tonConnectUI.connected) {
            // pass
        } else {
            tonConnectUI.modal.open();
        }
    };

    useEffect(() => {
        tonConnectUI.onStatusChange((wallet) => {
            if (wallet) {
                if (!wallet?.connectItems?.tonProof?.proof) {
                    tonConnectUI.disconnect();
                } else {
                    setAuthorized(true);
                }
            }

            // if (!wallet) {
            //     setAuthorized(false);
            // }
            // if (wallet.connectItems?.tonProof && "proof" in wallet.connectItems.tonProof) {
            //     console.log("has authorized");
            // }

            // if (!wallet.accessToken) {
            //     console.log("no signature");
            //     tonConnectUI.disconnect();
            //     setAuthorized(false);
            //     return;
            // }

            // setAuthorized(true);
        });
    }, [tonConnectUI]);

    return (
        <>
            <button onClick={handleClick}>Connect Wallet</button>
            <p>{address ?? "--"}</p>
            <p>{authorized ? "authorized" : "not - authorized"}</p>
            <p>{wallet?.connectItems?.tonProof.proof?.signature}</p>
            <p>{tonConnectUI.connected ? "connected" : "not - connected"}</p>
        </>
    );
}
