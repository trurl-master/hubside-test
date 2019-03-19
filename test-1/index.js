const resolveObjects = require("./resolveObjects.js");

console.log('result:', "\n", resolveObjects({
    a: {
        b: {
            c: 'z',
        },
    },
    'a.b.d': 'y'
}))
