class Events {
    constructor() {
        this._events = {};
    }

    on(name, callback) {
        if(!this._events)
            this._events[name] = [];
        this._events[name].push(callback);
    }

    emit(name, ...data) {
        if(typeof this._events[name] === 'object')
            this._events[name].forEach(evnt => evnt(...data));
    }
}

export default Events