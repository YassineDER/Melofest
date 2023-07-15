// This file is the entry point of the application.
const express = require('express');
const app = express();
const mysql = require('mysql');
const configs = require('./ressources/configs');

//View engine setup, static files and middlewares initialization
app.set('view engine', 'ejs');
app.use('/favicon.ico', express.static('ressources/images/favicon.ico'));
app.use(express.static('public'));
app.use(express.static('ressources/images/'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connection = mysql.createConnection(configs.database);
connection.connect((err) => { if (err) throw err });


// Defining routes

// Main page route. Fetching news articles from the database and render the EJS template with the retrieved articles
app.get('/', (req, res) => {
    const query = "SELECT photo, title, DATE_FORMAT(publicationDate, '%d %M %Y') AS date, tags FROM newsletter ORDER BY publicationDate DESC";
    connection.query(query, (err, results) => {
        if (err) {
            console.log(err);
            res.status(400).send({ error: err.message });
        }
        res.render('pages/index', { articles: results });
    });
});



// Lineup page route. Fetching the lineup from the database and render the EJS template with the retrieved lineup
app.get('/lineup', (req, res) => {
    query = "SELECT A.name AS name, A.music_type AS type, A.photo as photo, St.name AS stage, DATE_FORMAT(Sch.start, '%W %d %M %Y at %H:%i') as start FROM artist A JOIN schedule Sch on A.artist_id = Sch.artist_id JOIN stage St on St.stage_id = Sch.stage_id ORDER BY name ASC";
        connection.query(query, (err, results) => {
            if (err) {
                console.log(err);
                res.status(400).send({ error: err.message });
            }
            res.render('pages/lineup', { artists: results , alphabetic: true})
        });
});


app.get('/lineup/getSchedules', (req, res) => {
    const dataFilter = req.headers["x-filter"]
    let query = '';
    if (dataFilter === 'alphabetic'){
        query = "SELECT A.name AS name, A.music_type AS type, A.photo as photo, St.name AS stage, DATE_FORMAT(Sch.start, '%W %d %M %Y at %H:%i') as start FROM artist A JOIN schedule Sch on A.artist_id = Sch.artist_id JOIN stage St on St.stage_id = Sch.stage_id ORDER BY name ASC";
        connection.query(query, (err, results) => {
            if (err) {
                console.log(err);
                res.status(400).send({ error: err.message });
            }
            res.send( { artists: results , alphabetic: true})
        });
    }
    else {
        query = "SELECT A.name AS name, A.music_type AS type, A.photo AS photo, St.name AS stage, DATE_FORMAT(Sch.start, '%W %d %M %Y at %H:%i') AS start FROM artist A JOIN schedule Sch ON A.artist_id = Sch.artist_id JOIN stage St ON St.stage_id = Sch.stage_id WHERE DATE(Sch.start) = STR_TO_DATE(?, '%d/%m/%Y') ORDER BY A.name ASC";
        connection.query(query, [dataFilter], (err, results) => {
            if (err) {
                console.log(err);
                res.status(400).send({ error: err.message });
            }
            res.send({ artists: results , alphabetic: false})
        });
    }
});



// Contact page route
app.get('/contact', (req, res) => { res.render('pages/contact')});

// Contact form submission
app.post('/send_contact', (req, res) => {
    const { name, email, message } = req.body;

    // Form validation
    if (!name || !email || !message) 
        return res.status(400).send({ error: 'All fields are required' });
    const nameRegex = /^[a-zA-Z\s-]+$/;
    if (!nameRegex.test(name))
        return res.status(400).send({ error: 'Invalid name. Only letters, spaces and hyphens are allowed' });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
        return res.status(400).send({ error: 'Invalid email address' });
    const msgRegex = /^[\w\s.,!?()\-'"&]+$/
    if (!msgRegex.test(message))
        return res.status(400).send({ error: 'Invalid message. Only letters, numbers and punctuation marks are allowed' });

    // Save the data to the database
    const query = 'INSERT INTO contact (name, email, message) VALUES (?, ?, ?)';
    connection.query(query, [name, email, message], (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(400).send({ "success": false, error: err.message });
        }
        res.status(200).send({"success": true});
    });
});

// FAQ page route
app.get('/faq', (req, res) => { res.render('pages/faq')});



// Start the server
app.listen(5000, () => {console.log(`Server running on port 5000`)});
