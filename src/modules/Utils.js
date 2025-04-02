class Utils {
    static generateUUIDv4() {
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return uuid;
    }

    static getTimestamp() {
        return (new Date()).getTime();
    }

    static getUTCDate() {
        return (new Date()).toUTCString();
    }

    static formatDate(format, date = new Date()) {
        const lets = { Y: "year", A: "month", N: "day", H: "hours", M: "minutes", S: "seconds", I: "miliseconds" };
        const dt = { year: date.getFullYear(), month: date.getMonth()+1, day: date.getDay(), hours: date.getHours(), minutes: date.getMinutes(), seconds: date.getSeconds(), miliseconds: date.getMilliseconds() };
        var response = format;
        Object.keys(lets).forEach(function(letter) {
            if(letter != "I") {
                response = response.replaceAll(letter+letter, dt[lets[letter]] < 10 ? "0"+dt[lets[letter]] : dt[lets[letter]]);
                response = response.replaceAll(letter, dt[lets[letter]]);
            } else {
                response = response.replaceAll(letter+letter, dt[lets[letter]] < 100 ? (dt[lets[letter]] < 10 ? "00"+dt[lets[letter]] : "0"+dt[lets[letter]]) : dt[lets[letter]]);
                response = response.replaceAll(letter, dt[lets[letter]]);
            }
        });
        return response;
    }
}

export default Utils