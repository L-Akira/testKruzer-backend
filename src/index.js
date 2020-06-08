const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = 3333;
const server = require('http').Server(app);
const routes = require('./routes');

app.use(cors());

const mongoURL = 'mongodb://localhost:27017';

mongoose.connect(mongoURL,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true 
});
mongoose.connection.on('error', ()=>{
    console.log(`Problems at connect at ${mongoURL}`);
});
mongoose.connection.on('connected', ()=>{
    console.log(`Connected at ${mongoURL}`);
});

app.use(express.json());
app.use(routes);

server.listen(PORT,()=>console.log(`Server running at port ${PORT}`));