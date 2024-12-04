import Styles from "./modules/Styles.js";
import Identificators from "./modules/Identificators.js";

class AdataFlowSSR {
    constructor(options = {}) {
        this.options = options;

        this.styleManager = new Styles(this);
        this.identifyManager = new Identificators(this);
    }
}

export default AdataFlowSSR