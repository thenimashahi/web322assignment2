require('dotenv').config({path:"./config/.env"});
const express= require("express");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const MongoStore = require('connect-mongo')(session);

//mongoose connectivity
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
        console.log(`Connected to MongoDB Database`);
})
.catch(err=>console.log(`Error occurred when connecting to database.`));


//creation of app object
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
const userController = require("./controllers/user")

//middleware functions 

app.use(session({
        secret: `${process.env.SECRET_KEY}`,
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: mongoose.connection}),
        cookie: {maxAge: 30 * 60 * 1000}  //auto expiration of cookie after 30 minutes  
      }))

app.use((req, res, next) =>{

        res.locals.user = req.session.userInfo;
        res.locals.session = req.session;

        next();

})


//redirecting put / delete requests
app.use((req,res,next)=>{

        if(req.query.method=="PUT")
        {
                req.method="PUT"
        }

        else if(req.query.method=="DELETE") 
        {
                req.method="DELETE"
        }

        next();

})


//importing express-fileupload middleware into app object
app.use(fileUpload());

//mapping the controllers to the app object
app.use("/", generalController);
app.use("/", userController)



// open server
const PORT = process.env.PORT
app.listen(PORT , ()=>
{
        console.log(`Web application is up and running. `);
});