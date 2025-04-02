import Handler from "./modules/Handler.js";
import Events from "./modules/Events.js";

class AdataFlowSSR extends Events {
    constructor(options = {}) {
        super();

        this.options = options;
        this._handlers = [];
    }

    handle(request) {
        const handler = new Handler(this, request);
        this._handlers.push(handler);
    }
}

export default AdataFlowSSR