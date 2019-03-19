function resolve(obj) {
    
    for (const key in obj) {

        if (!obj.hasOwnProperty(key)) {
            continue;
        }

        const value = obj[key];

        const parts = key.split('.');

        if (parts.length > 1) {

            let o = obj, i;

            for (i = 0; i < parts.length - 1; i++) {
                if (typeof o[parts[i]] === 'undefined') {
                    o[parts[i]] = {}
                }

                o = o[parts[i]];
            }

            o[parts[i]] = value;

            delete obj[key];
        }
        
    }

    return obj;
}

module.exports = obj => resolve(obj);