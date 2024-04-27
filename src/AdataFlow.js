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
        this.styleElement = document.createElement("style");

        // Register functions into special paths
        this._loadFunctions();
    }

    /**
     * Main function used to read AdataFlow element and rewrite it using custom defined components
     */
    render() {
        var childs = [];
        this.element.head.appendChild(this.styleElement);
        this.element.body.childNodes.forEach((e) => childs.push(e));
        this.element.body.innerHTML = null;
        this._log(this.LogLevel.INFO, "Renderer", "Starting page renderer");
        for(var child of childs) {
            var g = this._componentExecute(child);
            if(typeof g == 'object')
                this.element.body.appendChild(g);
            else
                this.element.body.innerHTML += g;
        }
    }

    /**
     * Execute component function executes component and return built html element with included childs
     * @param {Object} component AdataFlow element form original source
     * @returns {Object|string} HTML based element or plain text built using basic one or more html elements
     */
    _componentExecute(component) {
        var comName = component.nodeName.toLowerCase();
        var com = null;
        if(typeof this._components[comName] == 'undefined' && comName != "#text")
            this._log(this.LogLevel.WARNING, "ComponentExecute", "Tryed to execute component which not exist: "+comName);
        else if(comName == "#text")
            return component.wholeText;
        else {
            var com = this._components[comName].call(component);
            com.classList.add(this._components[comName].identificator, this._randomClassName(15));
            for(var child of component.childNodes) {
                var g = this._componentExecute(child);
                if(typeof g == 'object')
                    com.appendChild(g);
                else
                    com.innerHTML += g;
            }
            if(com.getAttribute("link") != null) {
                var link = document.createElement("a");
                link.href = com.getAttribute("link");
                com = link.appendChild(com);
            }
        }
        return com;
    }

    /**
     * Register component function register single or multiple components (aliases for function) which will be called in building HTML code
     * @param {Array|string} names One (string) or more (Array) names of for the current component function
     * @param {function} call Call should be function that return HTML Element
     */
    _componentRegister(names, call, style = {}) {
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
            this._components[name] = { identificator: this._randomClassName(10), call: call };
            var styleKeys = Object.keys(style);
            if(styleKeys.length != 0) {
                var properties = {
                    default: '',
                    extended: ''
                };
                styleKeys.forEach((key) => {
                    if(typeof style[key] != 'object')
                        properties.default += key+':'+style[key]+';';
                    else {
                        console.log(key);
                        properties.extended = '';
                        Object.keys(style[key]).forEach((sub) => properties.extended += sub+':'+style[key][sub]+';');
                        this.styleElement.innerHTML += '.'+this._components[name].identificator+key+'{'+properties.extended+'}';
                    }
                    this.styleElement.innerHTML += '.'+this._components[name].identificator+'{'+properties.default+'}';
                });
                
            }
            this._log(this.LogLevel.INFO, "ComponentRegister", "Setting up unique class name for component: ");
            if(typeof this._components[name] != 'function')
                this._log(this.LogLevel.ERROR, "ComponentRegister", "Failed to register component");
        }
    }

    /**
     * Function used to generate random class names
     * @param {integer} length How long should be the returned class name
     * @returns Generated class name which starting with _
     */
    _randomClassName(length = 10) {
        var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234546789';
        var className = "";
        for(var i = 0;i!=length;i++)
            className += chars.charAt(Math.floor(Math.random() * (chars.length - 1)));
        return '_'+className;
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
