const express = require('express');
const cors = require('cors')
require('dotenv').config();
const product = require('./products')

const app = express();
app.use(express.json());
app.use(cors())



//READ Request Handlers
app.get('/', (req, res) => {
    res.send('Welcome to Foodista REST API with Node.js!!');
});

app.get('/api/product', (req, res) => {
    const apiKey = req.query.apiKey;
    if (apiKey && apiKey === 'foodistagWC91AJPrXEHpZci9LFoZ1pJ6eAbAFgJ0hoaqm6bMU748pcL3jvDBQbWD8CugZFxaO3wDMTRCWQmyNKA0hTfSwLwP7iROuK7CPA0n0TGY3VuRBINPjRL4ZAN') {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    for (let i = 0; i < product.length; i++) {
        const category = Object.keys(product[i])[0];
        // console.log(category)
        const items = product[i][category];

        const paginatedItems = items.slice(startIndex, endIndex);

        results[category] = paginatedItems;

        if (endIndex < items.length) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }
    }
    res.send(results);
}else{
    res.status(401).send('Unauthorized'); // Return an error response if the API key is missing or invalid
}
});

app.get('/api/product/:_id', (req, res) => {
    let itemFound = false;
    for (let i = 0; i < product.length; i++) {
        const category = Object.keys(product[i])[0];
        const items = product[i][category];
        const item = items.find(c => c._id === req.params._id);
        if (item) {
            itemFound = true;
            res.send(item);
            break;
        }
    }
    if (!itemFound) {
        res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>');
    }
});


//CREATE Request Handler
app.post('/api/product', (req, res) => {
    const item = {
        _id: req.body._id,
        favoriteDish: req.body.favoriteDish,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        platesAvailable: req.body.platesAvailable,
        __v: req.body.__v
    };
    product.push(item);
    res.send(item);
});

//UPDATE Request Handler
app.put('/api/product/:_id', (req, res) => {
    const item = product.find(c => c._id === req.params._id);
    if (!item) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Not Found!! </h2>');

    item.title = req.body.title;
    res.send(item);
});

//DELETE Request Handler
app.delete('/api/product/:_id', (req, res) => {

    const item = product.find(c => c._id === req.params._id);
    if (!item) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;"> Not Found!! </h2>');

    const index = product.indexOf(item);
    product.splice(index, 1);

    res.send(item);
});


//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));