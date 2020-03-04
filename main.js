const express= require("express");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');
const productModel = require("./models/products.js");



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
                categories: productModel.getCategories(),
                bestSellers: productModel.getBestSellers()
                
        })

});


app.get("/products",(req,res)=>{

        res.render("products",{
                title : "Products Page",
                data: productModel.getAllProducts()
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


//post requests 

app.post('/login', (req, res) => {

var re = /\S+@\S+\.\S+/;

const errorMessages = [];
var emailErrorMessage;
var emailErrorMessageBool;
var passwordErrorMessage;
var passwordErrorMessageBool;

if (req.body.email == ""){
        emailErrorMessage = "Please enter an e-mail."
        errorMessages.push(emailErrorMessage);
        emailErrorMessageBool = true;
        
} else if (!re.test(req.body.email)){
        emailErrorMessage = "Please enter a valid e-mail format."
        errorMessages.push(emailErrorMessage);
        emailErrorMessageBool = true;
}

if (req.body.psw == ""){
        passwordErrorMessage = "Please enter a password."
        errorMessages.push(passwordErrorMessage);
        passwordErrorMessageBool = true;
}

if (errorMessages.length > 0){
        res.render("login", {
                uemail: req.body.email,
                errors: errorMessages,
                emailError: emailErrorMessage,
                isEmailError: emailErrorMessageBool,
                isPasswordError: passwordErrorMessageBool,
                passwordError: passwordErrorMessage
        })
}


})



// open server
const PORT = 3000;
app.listen(PORT , ()=>
{
        console.log(`Web application is up and running. `);
});