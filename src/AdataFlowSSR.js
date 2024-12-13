import Styles from "./modules/Styles.js";
import Identificators from "./modules/Identificators.js";
import Components from "../../www/_components/index.js";

class AdataFlowSSR {
    constructor() {
        this.options = {};
        this.styleManager = null;
        this.identifyManager = null;
        this.Components = Components;
        this.head = {};
        this.body = {};
        this.html = "";
    }

    initialize(options = {}) {
        this.options = options;

        this.styleManager = new Styles(this, this.options.styles || {});
        this.identifyManager = new Identificators(this);
    }

    add(component) {
        if(typeof component != 'object' || typeof component.get != 'function')
            return;
        var content = component.get();
        if(typeof content.css == 'object') {
            this.styleManager.addVars(content.cssGlobals);
            Object.keys(content.css).forEach((identificator) => {
                var idTemp;
                if(identificator.includes("{{")) {
                    idTemp = identificator
                    let classMatch;
                    while(classMatch = /\{\{(.*?)\}\}/g.exec(idTemp)) {
                        if(classMatch == null)
                            break;
                        idTemp = idTemp.replaceAll(classMatch[0], this.identifyManager.add(classMatch[1]));
                    }
                } else
                    idTemp = this.identifyManager.add(identificator.replaceAll('_', '-'));
                this.styleManager.add(idTemp, content.css[identificator]);
            });
        }
        if(typeof content.html == 'string')
            this.html += content.html;
        let classMatch;
        while(classMatch = /\{\{(.*?)\}\}/g.exec(this.html)) {
            if(classMatch == null)
                break;
            this.html = this.html.replaceAll(classMatch[0], this.identifyManager.add(classMatch[1]));
        }
    }

    render() {
        return this.html.replaceAll("\n", "").replaceAll("  ", "");
    }
}

export default AdataFlowSSR