import Styles from "./modules/Styles.js";
import Identificators from "./modules/Identificators.js";
import Components from "../../www/_components/index.js";

class AdataFlowSSR {
    constructor(options = {}) {
        this.options = options;

        this.styleManager = new Styles(this, this.options.styles || {});
        this.identifyManager = new Identificators(this);
        this.Components = Components;
        this.content = "";
    }

    add(content) {
        this.content += content;
    }

    render() {
        return this.content;
    }
}

export default AdataFlowSSR