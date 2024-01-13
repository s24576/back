const express = require('express');
const mongoose = require('mongoose');
const ProductRoutes = require('./routes/ProductRoutes');
const URL = "mongodb+srv://s24576:haslo@cluster.umylqpm.mongodb.net/";

const app = express();
mongoose.connect(URL)
    .then(()=>{
        console.log('connected to DB');
    })
    .catch((error)=>{
        console.log(error);
    })

const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use("/products", ProductRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});