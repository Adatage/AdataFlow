class Identificators {
    constructor(instance) {
        this.instance = instance;
    }

    _randName(l = 10) {
        var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234546789';
        var className = "";
        for(var i = 0;i!=l;i++)
            className += chars.charAt(Math.floor(Math.random() * (chars.length - 1)));
        return '_'+className;
    }
}

export default Identificators;