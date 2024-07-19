import { useCallback } from "react";
import { buildSignature } from "./build-sign";
import { useRef } from "react";
import { useInterval } from "./use-interval";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useState } from "react";

export function usePayload() {
    const init = useRef(true);
    const [tonConnectUI] = useTonConnectUI();
    const [hasPayload, setHasPayload] = useState(false);
    const getPayload = useCallback(async () => {
        if (init.current) {
            init.current = false;
            tonConnectUI.setConnectRequestParameters({
                state: "loading",
            });
        }
        setHasPayload(false);
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
            setHasPayload(true);
        } else {
            tonConnectUI.setConnectRequestParameters(null);
        }
    }, [tonConnectUI]);

    if (init.current) {
        getPayload();
    }

    useInterval(getPayload, 9 * 60 * 1000);

    return {
        hasPayload,
    };
}
