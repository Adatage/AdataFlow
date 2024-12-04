import Styles from "./modules/Styles.js";

class AdataFlowSSR {
    constructor(options = {}) {
        this.options = options;

        this.styleManager = new Styles(this);
    }
}

export default AdataFlowSSR