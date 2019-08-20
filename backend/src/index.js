const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const routes    = require('./routes');


const uri = 'mongodb+srv://...url';
mongoose.connect(uri, {useNewUrlParser: true});

const server = express();

server.use(cors());
server.use(express.json());
server.use(routes); 

server.listen(3333);

