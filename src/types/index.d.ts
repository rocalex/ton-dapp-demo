export {}

declare global {
    interface Window {
        ton: any;
        tonProtocolVersion: number;
    }
}

window.ton = window.ton || {}