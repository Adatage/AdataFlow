import Enums from "./Enums.js";
import Logger from "./Logger.js";
import Headers from "./Headers.js";

class Handler {
    constructor(instance, request) {
        this.instance = instance;
        this.request = request;

        this.headers = new Headers(instance);
        this.headers.load(request.headers);
    }
}

export default Handler