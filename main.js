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


//Login page POST request

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

// Registration page POST request

app.post('/registration', (req, res) => {

        var re = /\S+@\S+\.\S+/;
        var passRe = /^[a-zA-Z0-9]+$/;
        
        const errorMessages = [];
        var emailErrorMessage;
        var emailErrorMessageBool;
        var passwordErrorMessage;
        var passwordErrorMessageBool;
        var passwordMatchBool;
        var passwordMatchErrorMessage;
        
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
        } else if (req.body.psw.length < 8){
                passwordErrorMessage = "Your password must be at least 8 characters long."
                errorMessages.push(passwordErrorMessage);
                passwordErrorMessageBool = true;
        } else if (!passRe.test(req.body.psw)){
                passwordErrorMessage = "Please only enter numbers or letters for the password."
                errorMessages.push(passwordErrorMessage);
                passwordErrorMessageBool = true;
        }

        if (req.body.pswrepeat == ""){
                passwordMatchErrorMessage = "Please re-enter the password."
                errorMessages.push(passwordMatchErrorMessage);
                passwordMatchBool = true;
        } else if(req.body.psw != req.body.pswrepeat){
                passwordMatchErrorMessage = "The passwords entered must match."
                errorMessages.push(passwordMatchErrorMessage);
                passwordMatchBool = true;
        }
        
        if (errorMessages.length > 0){
                if (req.body.remember){
                        res.render("registration", {
                                uemail: req.body.email,
                                errors: errorMessages,
                                emailError: emailErrorMessage,
                                isEmailError: emailErrorMessageBool,
                                isPasswordError: passwordErrorMessageBool,
                                passwordError: passwordErrorMessage,
                                isPasswordMatchError: passwordMatchBool,
                                passwordMatch: passwordMatchErrorMessage
                        })
                } else {

                res.render("registration", {
                        errors: errorMessages,
                        emailError: emailErrorMessage,
                        isEmailError: emailErrorMessageBool,
                        isPasswordError: passwordErrorMessageBool,
                        passwordError: passwordErrorMessage
                })
        }
        }
        
        
        })



// open server
const PORT = 3000;
app.listen(PORT , ()=>
{
        console.log(`Web application is up and running. `);
});