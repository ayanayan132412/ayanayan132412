// server.js
const express = require("express");
const { connectToDb, getDb, MongoClient } = require('./db');
const PORT = 3000;
const app = express();
let db;

connectToDb((err) => {
    if (!err) {
        app.listen(PORT, (err) => {
            err ? console.log(err) : console.log(`Listening port ${PORT}`);
        });
        db = getDb();
    } else {
        console.log(`DB не подключена: ${err}`);
    }
});

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

const uri = 'mongodb://localhost:27017/artss';
const client = new MongoClient(uri);

// Добавляем новый маршрут для загрузки файлов
app.post('/upload', upload.single('photo'), (req, res) => {
    const filePath = req.file.path;

    client.connect(err => {
        if (err) {
            console.error('Error connecting to MongoDB:', err);
            return;
        }

        const db = client.db('mydatabase');
        const collection = db.collection('photos');

        collection.insertOne({ path: filePath }, (dbErr, result) => {
            if (dbErr) {
                console.error('Error inserting document into MongoDB:', dbErr);
                return;
            }
            console.log('Document inserted into MongoDB:', result.ops);
            res.send('File uploaded successfully!');
            client.close();
        });
    });
});
app.post('/upload', upload.single('photo'), (req, res) => {
    if (req.file) {
        const filePath = req.file.path;
        // Дальнейшая обработка файла, например, сохранение пути в базу данных

        res.send('File uploaded successfully!');
    } else {
        res.status(400).send('No file uploaded.');
    }
});