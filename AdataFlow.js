class AdataFlow {
    constructor(element) {
        this.element = document.querySelector(element);

        this.component = {};
        this._components = {};
        this._componentThree = {};
        this._globalCss = {};

        this._loadFunctions();
    }

    render(content) {

    }

    _componentExecute(name, ...args) {
        if(typeof this._components[name] == 'undefined')
            throw "Component doesn't exist";
        var element = null;
        try {
            element = this._components[name](...args);
        } catch(e) {
            throw "Component error: "+e;
        }
        return element;
    }

    _componentRegister(name, call) {
        if(typeof this._components[name] != 'undefined')
            throw "Component with this name is already registered";
        this._components[name] = call;
        if(typeof this._components[name] != 'function')
            throw "Failed to register component";
    }

    _loadFunctions() {
        this.component = {
            register: this._componentRegister.bind(this),
            execute: this._componentExecute.bind(this)
        };
    }
}

var test = new AdataFlow(document.querySelector("body"));

test.component.register('cd', (a = {}, c = null) => {
    var e = document.createElement("div");
    Object.keys(a).forEach((k) => {
        e.setAttribute(k, a[k]);
    });
    if(c != null)
        e.innerHTML = c;
    return e;
});