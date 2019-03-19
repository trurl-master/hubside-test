/*
    Neither express nor bodyParse will change their values, so declaration as const is preferred
*/
let express = require('express');
let bodyParser = require('body-parser');

// const for app also
let app = express();
app.use(bodyParser.json());

/*

    1. Todos is an array and it won't change either, only items of the array will change, so const please

    2. I'd prefer using integer ID's, integer comparison is faster than string comparison, when you need to lookup the item in a very long list, but string is acceptable

    3. In case the order of todo items is not an issue, I'd use id as a key, the lookup of the item (and addition) would have been much easier.

    4. Usually a todo task has some sort of state like NEW, IN-PROGRESS, DONE and so forth... ?
    
    Note: 3 is here because I don't see an API entry to update order of items, but usually todo is sortable, so it can be ignored

*/ 
let todos = [{ id: 'jkhsdjkf', content: 'review this code' }];

/*

    1. The existence of the item with the same ID should be checked before addition and in my opinion it's a strange way of creating ID's. Depending on the situation simple integer ID with increment on POST /todos may be acceptable

    2. As ID is being generated on the server side it is a good practice to return at least this ID in the response, full item is prefered

    3. Depending on the situation, it may be preferable instead of spreading body, to grab (and filter) specific data from the input (in this case — todo content as text or any format required)

*/ 
app.post('/todos', (req, res) => {
    todos.push({
        ...req.body,
        id: Math.random().toString(32).slice(2)
    });
    res.sendStatus(201);
});

/*

    1. Todos is an array of Objects, ID of todo item is not a key of this array, the search function is required

    2. Again instead of assigning all the req.body to existing todo item, it may be preferable to grab (and filter) only the data we need

*/
app.put('/todos/:id', (req, res) => {
    todos[Number(req.params.id)] = req.body;
    res.sendStatus(200);
});

/*

    1. Todos is an array of Objects, ID of todo item is not a key of this array, the search function is required

    2. id variable is not defined, use req.params.id

    3. Please check existence of the item before responding, respond with appropriate HTTP code in case it doesn't

*/
app.get('/todos/:id', (req, res) => {
    res.send(todos[id]);
});

/*

    This route won't work, because of the previous one (`all` gets caught by `:id`), to get the list of all todo items use '/todos' instead

*/
app.get('/todos/all', (req, res) => {
    res.send(todos);
});

app.get('/', (req, res) => {
    res.send('OK');
});

app.listen(8080, () => {
    console.log('Listening on port 8080...');
});