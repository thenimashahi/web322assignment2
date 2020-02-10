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

//routes

app.get("/",(req,res)=>{
        
        res.render("index",{
                title : "Home Page",
                derp: "Nima"
        })

});


app.get("/products",(req,res)=>{

        res.render("products",{
                title : "Products Page"
        })
});

app.get("/registration",(req,res)=>{

    res.render("registration",{
            title : "Customer Registration Page"
    })
});

app.get("/login",(req,res)=>{

    res.render("login",{
            title : "Customer Login Page"
    })
});



// open server
const PORT = 3000;
app.listen(PORT , ()=>
{
        console.log(`Web application is up and running. `);
});