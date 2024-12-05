class Identificators {
    constructor(instance) {
        this.instance = instance;
    }

    randName(fc = "_", l = 10) {
        var chars = 'abcdefghijklmnopqrstuvwxyz01234546789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var className = fc + chars.charAt(Math.floor(Math.random() * (chars.length - 37)));
        for(var i = 0;i!=l-1;i++)
            className += chars.charAt(Math.floor(Math.random() * (chars.length - 1)));
        return className;
    }
}

export default Identificators;