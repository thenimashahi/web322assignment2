require('dotenv').config({path:"./config/.env"});
const express= require("express");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');



const app = express();

//load static resources
app.use(express.static("public"));


//Set Handlebars as the Express enginge for the app
app.engine('handlebars', exphbs( {defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))

//loading controllers
const generalController = require("./controllers/general");
const loginController = require("./controllers/loginregister")

//mapping the controllers to the app object
app.use("/", generalController);
app.use("/", loginController)

// open server
const PORT = process.env.PORT
app.listen(PORT , ()=>
{
        console.log(`Web application is up and running. `);
});