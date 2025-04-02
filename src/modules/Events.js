class Events {
    constructor() {
        this._events = {};
    }

    on(name, callback) {
        if(this._events[name] == null)
            this._events[name] = [];
        this._events[name].push(callback);
    }

    emit(name, ...data) {
        if(this._events[name] != null)
            this._events[name].forEach(evnt => evnt(...data));
    }
}

export default Events