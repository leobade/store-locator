const express = require('express')
const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', '*')
    next();
})
app.post('/api/stores', (req, res) => {

    let dbStores = req.body;
    res.send('hello ')
})

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
})