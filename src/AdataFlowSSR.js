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
            Object.keys(content.css).forEach((identificator) => {
                var id = this.identifyManager.add(identificator);
                this.styleManager.add(id, content.css[identificator]);
            });
        }
        if(typeof content.html == 'string')
            this.html += content.html;
    }

    render() {
        return this.html;
    }
}

export default AdataFlowSSR