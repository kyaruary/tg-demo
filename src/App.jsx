import { useEffect, useState } from "react";
export default function App() {
    const [insets, setInsets] = useState();
    const [frames, setFrames] = useState();
    useEffect(() => {
        const element = createContextElement();
        document.body.appendChild(element);
        const onEnd = () => {
            const { paddingTop, paddingBottom, paddingLeft, paddingRight } = window.getComputedStyle(element);

            const insets = {
                top: paddingTop ? parseInt(paddingTop, 10) : 0,
                bottom: paddingBottom ? parseInt(paddingBottom, 10) : 0,
                left: paddingLeft ? parseInt(paddingLeft, 10) : 0,
                right: paddingRight ? parseInt(paddingRight, 10) : 0,
            };
            const frame = {
                x: 0,
                y: 0,
                width: document.documentElement.offsetWidth,
                height: document.documentElement.offsetHeight,
            };
            setFrames(frame);
            setInsets(insets);
            console.log({ frame, insets });
        };
        element.addEventListener(getSupportedTransitionEvent(), onEnd);
        onEnd();
        return () => {
            document.body.removeChild(element);
            element.removeEventListener(getSupportedTransitionEvent(), onEnd);
        };
    }, []);
    return (
        <div className="container">
            <div className="content">
                <div>frame</div>
                <div>x: {frames?.x},</div>
                <div>y: {frames?.y},</div>
                <div>width: {frames?.width},</div>
                <div>height: {frames?.height},</div>
                <div>insets</div>
                <div>top: {insets?.top},</div>
                <div>bottom: {insets?.bottom},</div>
                <div>left: {insets?.left},</div>
                <div>right: {insets?.right},</div>
            </div>
            <div className="footer"></div>
        </div>
    );
}

const CSSTransitions = {
    WebkitTransition: "webkitTransitionEnd",
    Transition: "transitionEnd",
    MozTransition: "transitionend",
    MSTransition: "msTransitionEnd",
    OTransition: "oTransitionEnd",
};

let _supportedTransitionEvent = null;
function getSupportedTransitionEvent() {
    if (_supportedTransitionEvent != null) {
        return _supportedTransitionEvent;
    }
    const element = document.createElement("invalidtype");

    _supportedTransitionEvent = CSSTransitions.Transition;
    for (const key in CSSTransitions) {
        if (element.style[key] !== undefined) {
            _supportedTransitionEvent = CSSTransitions[key];
            break;
        }
    }
    return _supportedTransitionEvent;
}

let _supportedEnv = null;
function getSupportedEnv() {
    if (_supportedEnv !== null) {
        return _supportedEnv;
    }
    const { CSS } = window;
    if (CSS && CSS.supports && CSS.supports("top: constant(safe-area-inset-top)")) {
        _supportedEnv = "constant";
    } else {
        _supportedEnv = "env";
    }
    return _supportedEnv;
}

function getInset(side) {
    return `${getSupportedEnv()}(safe-area-inset-${side})`;
}

function createContextElement() {
    const element = document.createElement("div");
    const { style } = element;
    style.position = "fixed";
    style.left = "0";
    style.top = "0";
    style.width = "0";
    style.height = "0";
    style.zIndex = "-1";
    style.overflow = "hidden";
    style.visibility = "hidden";
    // Bacon: Anything faster than this and the callback will be invoked too early with the wrong insets
    style.transitionDuration = "0.05s";
    style.transitionProperty = "padding";
    style.transitionDelay = "0s";
    style.paddingTop = getInset("top");
    style.paddingBottom = getInset("bottom");
    style.paddingLeft = getInset("left");
    style.paddingRight = getInset("right");
    return element;
}
