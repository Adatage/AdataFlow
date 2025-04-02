import Handler from "./modules/Handler.js";

class AdataFlowSSR {
    constructor(options = {}) {
        this.options = options;
        this._handlers = [];
    }

    handle(request) {
        const handler = new Handler(this, request);
        this._handlers.push(handler);
    }
}

export default AdataFlowSSR