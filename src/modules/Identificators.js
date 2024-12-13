class Identificators {
    constructor(instance) {
        this.instance = instance;
        this.aliases = {};
    }

    add(idenfitication) {
        if(this.aliases[idenfitication] == null)
            this.aliases[idenfitication] = this.randName(idenfitication.charAt(0) == '_' ? '_' : '');
        return this.aliases[idenfitication];
    }

    get(idenfitication) {
        return this.aliases[idenfitication] != null ? this.aliases[idenfitication] : "";
    }

    randName(fc = "_", xstart = true, l = 10) {
        var chars = 'abcdefghijklmnopqrstuvwxyz01234546789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var className = fc + (xstart ? 'x' : '') + chars.charAt(Math.floor(Math.random() * (chars.length - 37)));
        for(var i = 0;i!=l-1;i++)
            className += chars.charAt(Math.floor(Math.random() * (chars.length - 1)));
        return className;
    }
}

export default Identificators;