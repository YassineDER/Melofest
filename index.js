// This file is the entry point of the application.
const express = require('express');
const mysql = require('mysql');
const configs = require('./ressources/configs');
const app = express();

//View engine setup and static files
app.set('view engine', 'ejs');
app.use('/favicon.ico', express.static('ressources/images/favicon.ico'));
app.use(express.static('public'));
app.use(express.static('ressources/images/'));

// Database connection
const connection = mysql.createConnection(configs.database);
connection.connect((err) => { if (err) throw err });


// Defining routes
app.get('/', (req, res) => {
  // Fetch data from the database
  const query = "SELECT photo, title, DATE_FORMAT(publicationDate, '%d %M %Y') AS date, tags FROM newsletter ORDER BY publicationDate DESC";
  connection.query(query, (err, results) => {
    if (err) throw err;
    // Render the EJS template with the retrieved data
    res.render('pages/index', { articles: results });
  });
});

app.get('/page1', (req, res) => {
    res.render('pages/page1');
});




// Start the server
app.listen(5000, () => {
  console.log(`Server running on port 5000`);
});
