const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
require('dotenv').config({path: './config/.env'});
const db = require('./config/db');

mongoose.connect(db.dbURL, {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true});

mongoose.connection.on('connected', () => {
	console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
	console.log('MongoDB connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
	console.log('MongoDB connection close');
});

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json({});
	}
	next();
});

module.exports = app;