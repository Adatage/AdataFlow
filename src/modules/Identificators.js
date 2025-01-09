class Identificators {
    constructor(instance) {
        this.instance = instance;
        this._identificators = {
            class: {},
            id: {},
            js: {}
        };
    }

    add(idenfitication) {
        var type = this.getType(idenfitication);
        if(type == null)
            return null;
        if(this._identificators[type][idenfitication] == null)
            this._identificators[type][idenfitication] = this._rand(idenfitication.charAt(0) == '_' ? '_' : '');
        return this._identificators[type][idenfitication];
    }

    get(idenfitication) {
        var type = this.getType(idenfitication);
        return this._identificators[type][idenfitication] != null ? this._identificators[type][idenfitication] : "";
    }

    getType(idenfitication) {
        return {'.':"class",'#':"id",'!':"js"}[idenfitication.charAt(0)] || null;
    }

    _rand(fc = "_", fl = 'x', l = 10) {
        var chars = 'abcdefghijklmnopqrstuvwxyz01234546789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var rnd = fc + fl + chars.charAt(Math.floor(Math.random() * (chars.length - 37)));
        for(var i = 0;i!=l-1;i++)
            rnd += chars.charAt(Math.floor(Math.random() * (chars.length - 1)));
        return rnd;
    }
}

export default Identificators;