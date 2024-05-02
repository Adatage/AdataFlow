class AdataSocket {
    static protocol = Object.freeze({
        WEBSOCKET: 0,
        WEBTRANSPORT: 1,
        WEBRTC: 2
    });

    constructor(uri, protocol, format) {
        this.uri = uri;
        this.protocol = protocol;
        this.format = format;
        this.connectionState = 0;
        this.connection = null;
        this.listeners = {};
    }

    connect() {
        switch(this.protocol) {
            case this.protocol.WEBSOCKET:
                this.connectionState = 1;
                try {
                    this.connection = new WebSocket(this.uri);
                    this.connectionState = 5;
                } catch(e) {
                    this.connectionState = 2;
                }
            break;
            case this.protocol.WEBTRANSPORT:

            break;
            case this.protocol.WEBRTC:

            break;
        }
    }

    disconnect() {

    }

    send() {

    }

    on(name, callback) {
        this.listeners[name] = callback;
    }
}

export default AdataSocket
