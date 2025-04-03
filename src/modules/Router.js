import Utils from "./Utils.js";

class Router {
    constructor() {
        this._routes = [];
    }

    route(routes) {
        this._routes = routes;
    }
}

export default Router