const { response } = require('express');
const express = require('express')
const mongoose = require('mongoose');
const axios = require('axios')
const app = express();
const PORT = 3000;
const Store = require('./api/models/store')

const GoogleMapsServices = require('./api/services/googleMapsService')
const googleMapsService = new GoogleMapsServices();

require('dotenv').config()

mongoose.connect('mongodb+srv://leonardo:gQm3Kz7Ht6OYqbAR@cluster0.o0xkr.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

app.use(express.json({ limit: '50mb' }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    next();
})

app.post('/api/stores', (req, res) => {

    let dbStores = [];
    let stores = req.body;
    stores.forEach((store) => {
        var address = store.address
        dbStores.push({
            storeNumber: store.storeNumber,
            storeName: store.name,
            phoneNumber: store.phoneNumber,
            address: address,
            openStatusText: store.openStatusText,
            addressLine: store.addressLines,
            location: {
                type: 'Point',
                coordinates: [
                    store.coordinates.longitude,
                    store.coordinates.latitude,
                ]
            }
        });
    })
    Store.create(dbStores, (err, stores) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(stores);
        }
    })
})

app.get('/api/stores', (req, res) => {
    let filter = {}

    if (req.query.lat && req.query.lng) {
        const lat = req.query.lat
        const lng = req.query.lng

        filter = {
            location: {
                $near: {
                    $maxDistance: 3218,
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat],
                    }
                }
            }
        }
    } else {
        filter = {}
    }
    console.log(filter);
    const stores = Store.find(filter, (err, stores) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(stores);
        }
    });



})

app.delete('/api/stores', (req, res) => {
    Store.deleteMany({}, (err) => {
        res.status(400).send(err);
    })
})

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
})