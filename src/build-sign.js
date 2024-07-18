import { sha256 } from "js-sha256";

export function buildSignature(params, xTimestamp) {
    const clonedParams = { ...params, xTimestamp };
    const flatParams = function (params) {
        return Object.keys(params)
            .sort()
            .map((key) => {
                if (params[key] === undefined) {
                    return "";
                }
                if (params[key] instanceof Object) {
                    return `${key}=${encodeURIComponent(flatParams(params[key]))}`;
                }
                return `${key}=${encodeURIComponent(params[key])}`;
            })
            .filter((str) => str !== "")
            .join("&");
    };

    const signatureBase = flatParams(clonedParams) + "/" + "";
    const signature = sha256(signatureBase);
    return signature;
}
