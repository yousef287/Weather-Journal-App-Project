// Setup empty JS object to act as endpoint for all routes
let projectData = {};
const port = 3000;
// require dependencies
const cors = require('cors');
const bodyParser = require('body-parser');

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());
// Initialize the main project folder
app.use(express.static('website'));

//a get route which returns the projectData object
app.get('/getData',(req, res) => {
  res.json(projectData);
});
//a post route which add newEntries to the projectData object
app.post('/addData', (req, res) => {
  projectData.temp = req.body.temp;
  projectData.date = req.body.date;
  projectData.userResponse = req.body.userResponse;
  res.status(200).json({
    message: 'Works!'
  });
});

// Setup Server
app.listen(port,() => {
  console.log(`We are live at http://localhost:${port}`);
});