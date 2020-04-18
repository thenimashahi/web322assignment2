const express = require('express')
const router = express.Router();
const userModel = require("../models/user");
const productModel = require("../models/products.js");
const bcrypt = require("bcryptjs");
const isAuthenticated = require("../middleware/auth");
const dashboardLoader = require("../middleware/authorization");
const path = require("path");

router.get("/registration",(req,res)=>{

            res.render("registration",{
                title : "Customer Registration Page"
        })
});

router.get("/login",(req,res)=>{

            res.render("login",{
                    title : "Customer Login Page"
            })
});

router.get("/dashboard",(req,res)=>{

    res.render("dashboard",{
            title : "Welcome!"
    })
});

router.get("/profile", isAuthenticated, dashboardLoader);



router.get("/logout", (req, res)=>{
        req.session.destroy();
        res.redirect("/login")
})



router.get("/adminproducts", isAuthenticated, (req,res)=>{
        res.render("adminproducts", {
                title: "Add Products"
        })
});

router.get("/adminproductsedit", isAuthenticated, (req,res)=>{
        res.render("adminproductsedit", {
                title: "Edit Products"
        })
})

router.put("/admin/edit/:id", (req, res)=> {

        const task = 
        {
                description:req.body.description,
                title:req.body.title,
                price:req.body.price,
                category:req.body.category,
                bestSeller:req.body.bestSeller
        }

        if (req.files){

           req.files.productPic.name = `productPic_${req.params.id}${path.parse(req.files.productPic.name).ext}`
           
           req.files.productPic.mv(`public/uploads/${req.files.productPic.name}`)
           .then(()=>{
                productModel.updateOne({_id:req.params.id}, task)
                .then(()=>{
                        res.redirect("/admin")
                })

           })



        } else { //the user didn't upload anything

        productModel.updateOne({_id:req.params.id}, task)
        .then(()=>{
                res.redirect("/admin")
        })
        .catch(err=>console.log(`Error when trying to update the database.`))
        }
});


router.delete("/admin/delete/:id", (req, res)=> {

        productModel.deleteOne({_id:req.params.id})
        .then(()=>{
                res.redirect("/admin")
        })
        .catch(err=>console.log(`Error when trying to delete from the database.`))

});



//Login page POST request

router.post('/login', (req, res) => {

 var re = /\S+@\S+\.\S+/;

const errorMessages = [];
var emailErrorMessage;
var emailErrorMessageBool;
var passwordErrorMessage;
var passwordErrorMessageBool;       

         //checking to see if email already exists
    userModel.findOne({email: req.body.email})
    .then(user=>{



        //email not found
        if (user == null)
        {
                emailErrorMessage = "Email or password was incorrect."
                errorMessages.push(emailErrorMessage);
                emailErrorMessageBool = true;
                res.render("login", {
                        uemail: req.body.email,
                        errors: errorMessages,
                        emailError: emailErrorMessage,
                        isEmailError: emailErrorMessageBool,
                        isPasswordError: passwordErrorMessageBool,
                        passwordError: passwordErrorMessage
                })
        } 
        //email is found
        else
        {
                bcrypt.compare(req.body.psw, user.password)
                .then(isMatched=>{
                        
                if (isMatched)
                {
                  //create our session
                  req.session.userInfo = user;
                  res.redirect("/profile")
                } 
                else 
                {
                                emailErrorMessage = "Your password or email was incorrect"
                                errorMessages.push(emailErrorMessage);
                                emailErrorMessageBool = true;
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
                .catch(err=>console.log(`Error when de-hashing password.`))
        }

    })
    .catch(err=>console.log(`Error when finding the email address.`))



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

router.post('/registration', (req, res) => {
   

    //allowing a new user to register

    const newUser =
    {       fname: req.body.fname,
            lname: req.body.lname,
            email : req.body.email,
            password : req.body.psw
    }

    const user = new userModel(newUser);
    user.save()
    .then(()=>{
            //maybe redirect here?
            res.redirect("/login");
    })
    .catch(err=>console.log(`Error while inserting data into the database`));

    
     //requiring sendgrid package
     const sgMail = require('@sendgrid/mail');

    //setting sendgrid API key
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);


    var re = /\S+@\S+\.\S+/;
    var passRe = /^[a-zA-Z0-9]+$/;
    
    //creating error messages and booleans to pass through with handlebars.
    const errorMessages = [];
    var emailErrorMessage;
    var emailErrorMessageBool;
    var passwordErrorMessage;
    var passwordErrorMessageBool;
    var passwordMatchBool;
    var passwordMatchErrorMessage;

    
    // form validation, if an invalid form is submitted:
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
    } else {
            // when a valid form is submitted:
            const msg = {
                    to: req.body.email,
                    from: 'nima@mycompany.ca',
                    subject: 'Welcome to our website!',
                    html: `
                    Welcome to our crossfit supplies website! We are happy you joined! Stay tuned for the lastest crossfit news. 
                    `,
                  };

                  //asynchronous operation dealings (then for success / catch for unsuccess)
                  sgMail.send(msg)
                  .then(()=>{
                          res.redirect("/dashboard")
                  })
                  .catch(err=>{
                          console.log(`Error ${err}`);
                  })
    }
    
    
    });

    module.exports = router;