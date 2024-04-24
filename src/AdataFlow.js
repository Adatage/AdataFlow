class AdataFlow {
    constructor(element) {
        this.element = element;

        // Enums definition
        this.LogLevel = {
            INFO: 0,
            WARNING: 1,
            ERROR: 2,
            DEBUG: 3
        };

        // Basic variables initialization
        this.component = {};
        this._components = {};
        this._componentThree = {};
        this._globalCss = {};

        // Register functions into special paths
        this._loadFunctions();
    }

    /**
     * Main function used to read AdataFlow element and rewrite it using custom defined components
     */
    render() {
        var childs = [];
        this.element.body.childNodes.forEach((e) => childs.push(e));
        this.element.body.innerHTML = null;
        childs.forEach((e) => this.element.body.appendChild(this._componentExecute(e)));
    }

    /**
     * Execute component function executes component and return built html element with included childs
     * @param {Object} component AdataFlow element form original source
     * @returns {Object} HTML based element built using basic one or more html elements
     */
    _componentExecute(component) {
        var comName = component.nodeName.toLowerCase();
        if(comName == "#text")
            return component;
        if(typeof this._components[comName] == 'undefined')
            throw "Component \""+comName+"\" doesn't exist";
        var com = this._components[comName](component);
        for(var child of component.childNodes)
            if(child.nodeName == "#text")
                com.innerHTML += child.wholeText;
            else
                com.appendChild(this._componentExecute(child));
        return com;
    }

    /**
     * Register component function register single or multiple components (aliases for function) which will be called in building HTML code
     * @param {Array|string} names One (string) or more (Array) names of for the current component function
     * @param {function} call Call should be function that return HTML Element
     */
    _componentRegister(names, call) {
        if(!Array.isArray(names)) {
            this._log(this.LogLevel.DEBUG, "ComponentRegister", "Converting single component name into array");
            names = [names];
        }
        for(var name of names) {
            if(typeof this._components[name] != 'undefined') {
                this._log(this.LogLevel.ERROR, "ComponentRegister", "Component with this name is already registered");
                continue;
            }
            this._log(this.LogLevel.INFO, "ComponentRegister", "Registering new component with name: "+name);
            this._components[name] = call;
            if(typeof this._components[name] != 'function')
                this._log(this.LogLevel.ERROR, "ComponentRegister", "Failed to register component");
        }
    }

    /**
     * Log function allows print out informations warnings and errors to the console
     * @param {LogLevel} level Log level (INFO, WARNING, ERROR, DEBUG) 
     * @param {string} path Back track of function/path which called this log
     * @param {string} text Text which will be shown in log
     */
    _log(level, path, text) {
        var d = new Date();
        console.log("["+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"."+d.getMilliseconds()+"] ["+["INFO","WARNING","ERROR","DEBUG"][level]+"] ["+path+"] "+text);
    }

    /**
     * Function that creates structure which is being used in writing with usage of this framwork
     */
    _loadFunctions() {
        this.component = {
            register: this._componentRegister.bind(this),
            execute: this._componentExecute.bind(this)
        };
    }
}
