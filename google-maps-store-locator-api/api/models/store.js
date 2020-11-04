const mongoose = require('mongoose');
const { stringify } = require('querystring');
const store = mongoose.Schema({
    storeNumber: String,
    storeName: String,
    phoneNumber: String,
    address: {},
    openStatusText: String,
    addressLine: Array,
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
})

store.index({ location: '2dsphere' }, { sparse: true })

module.exports = mongoose.model('Store', store)