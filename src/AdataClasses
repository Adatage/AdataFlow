export default function AdataClasses(classes) {
    class Classes {
        constructor() {
            classes.forEach((cClass) => Object.assign(this, new cClass()));
        }
    }
    
    classes.forEach((cClass) => {
        Object.getOwnPropertyNames(cClass.prototype).filter((prop) => prop != 'constructor').forEach((prop) => Classes.prototype[prop] = cClass.prototype[prop]);
    });
    return Classes;
}
