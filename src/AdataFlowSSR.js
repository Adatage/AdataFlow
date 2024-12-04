import Styles from "./modules/Styles.js";
import Identificators from "./modules/Identificators.js";
import Components from "./modules/Components.js";

class AdataFlowSSR {
    constructor(options = {}) {
        this.options = options;

        this.styleManager = new Styles(this, this.options.styles || {});
        this.identifyManager = new Identificators(this);
        this.componentsManager = new Components(this);

        this.content = "hello world from AdataFlow";
    }

    render() {
        return this.content;
    }
}

export default AdataFlowSSR