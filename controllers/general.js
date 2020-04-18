const express = require('express')
const router = express.Router()
const productModel = require("../models/products.js");
const isAuthenticated = require("../middleware/auth");
const path = require("path");
var Cart = require('../models/cart');
const userModel = require("../models/user");


//routes

//home route
router.get("/",(req,res)=>{

    productModel.find()
    .then((products)=>{



    const bestSellers = products.filter(tasks=>tasks.bestSeller == '1').map(tasks=>{
        return {
            id: tasks._id,
            description:tasks.description,
            title:tasks.title,
            price:tasks.price,
            category:tasks.category,
            bestSeller:tasks.bestSeller,
            productPic: tasks.productPic
        }
    })



    res.render("index",{
        title : "Products Page",
        bestSeller: bestSellers
        
        
})

})
.catch(err=>console.log(`Error when pulling the products from the database.`))

});

//searching the products page for the categories entered
router.post("/products", (req,res)=>{

        let errors = "";
        let isError = false;

    const search = req.body.searchcategory;

    if (search == ""){
        errors = "Please enter a valid category (Weights, Accessories, or Barbells). ";
        isError = true;
    }

    productModel.find()
    .then((products)=>{

        

        const categories = products.filter(tasks=>tasks.category == search).map(tasks=>{
            return {
                description:tasks.description,
                title:tasks.title,
                price:tasks.price,
                category:tasks.category,
                productPic: tasks.productPic
            }
        })
    
        if(!Array.isArray(categories) || !categories.length){
            errors = "Please enter a valid category (Weights, Accessories, or Barbells). ";
            isError = true;
        }
        
        res.render("products",{
            title : "Products Page",
            data: categories,
            errors: errors,
            isError: isError
            
    })

    })
    .catch(err=>console.log(`Error when pulling the products from the database.`))

});

//loading all the products
router.get("/products",(req,res)=>{

    productModel.find()
    .then((products)=>{

        
        const filteredProducts = products.map(tasks=>{

            return {
                id: tasks._id,
                description:tasks.description,
                title:tasks.title,
                price:tasks.price,
                category:tasks.category,
                bestSeller:tasks.bestSeller,
                productPic: tasks.productPic
            }


        });



        res.render("products",{
            title : "Products Page",
            data: filteredProducts
            
    })

    })
    .catch(err=>console.log(`Error when pulling the products from the database.`))

});

//route to add the selected product to shopping cart 
router.get('/add-to-cart/:id', (req, res)=>{

    var productId = req.params.id;

    var cart = new Cart(req.session.cart ? req.session.cart : {});

    productModel.findById(productId, function(err, product){
        if (err){
            return res.redirect('/products');
        }

        cart.add(product, product.id);
        req.session.cart = cart;

    
        res.redirect("/products")

    });


});

//route to reduce shopping cart items by one
router.get('/reduce/:id', (req,res)=>{
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);

    req.session.cart = cart;
    res.redirect("/shopping-cart");
})

//route to clear shopping cart 
router.get('/remove/:id', (req,res)=>{
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);

    req.session.cart = cart;
    res.redirect("/shopping-cart");
})

//route to show items in shopping cart
router.get('/shopping-cart', (req, res)=>{
    if (!req.session.cart) {
        return res.render('shopping-cart', {products: null});

    }

    var cart = new Cart (req.session.cart);
    res.render('shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice.toFixed(2)})

});

router.post('/shopping-cart', (req, res)=>{

    var cart = new Cart(req.session.cart ? req.session.cart : {});
    //importing SGmail for the order summmary email 
    const sgMail = require('@sendgrid/mail');

    //setting sendgrid API key
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

    userModel.findOne({email: req.session.userInfo.email})
    .then(user=>{
        const msg = {
            to: req.session.userInfo.email,
            from: 'nima@mycompany.ca',
            subject: 'Order Details',
            html: `

            Hello ${req.session.userInfo.fname}, thank you for ordering from our website. Here is a summary of your order: <br>
            <br>
            <strong>Order Details</strong>:
            

           ${cart.generateEmailArray()}

            <br> 

            <strong>Total: $${cart.totalPrice.toFixed(2)} </strong>
            `,
          };
    
          //asynchronous operation dealings (then for success / catch for unsuccess)
          sgMail.send(msg)
          .then(()=>{
                  req.session.cart = {};
                  res.redirect("/products")
          })
          .catch(err=>{
                  console.log(`Error ${err}`);
          })
    })
    .catch(err=>"Error when sending message")

    
});

//admin routes because only admins can edit / add products

router.get("/admin",(req,res)=>{

        productModel.find()
        .then((products)=>{
    
            
            const filteredProducts = products.map(tasks=>{
    
                return {
                    id: tasks._id,
                    description:tasks.description,
                    title:tasks.title,
                    price:tasks.price,
                    category:tasks.category,
                    bestSeller:tasks.bestSeller,
                    productPic: tasks.productPic
                }
    
    
            });
    
    
    
            res.render("admin",{
                title : "Admin Page",
                data: filteredProducts
                
        })
    
        })
        .catch(err=>console.log(`Error when pulling the products from the database.`))
    
    });

//edit item route (for admin)
router.get("/admin/edit/:id", (req,res)=>{


productModel.findById(req.params.id)
.then((task)=>{


    const {_id, description, title, price, category, bestSeller, productPic} = task;

    res.render("adminproductsedit", {
        _id,
        description,
        title,
        price,
        category,
        bestSeller,
        productPic
    })

})
.catch(err=>console.log(`Error when finding the id from the database.`))


})




//add product route for admin
router.post("/admin", (req,res)=> {

    
    const newProduct = {
        description: req.body.description,
        title: req.body.title,
        price: req.body.price, 
        category: req.body.category,
        bestSeller: req.body.bestSeller
    }

    const product = new productModel(newProduct);
    product.save()
        .then((user)=>{

            req.files.productPic.name = `productPic_${user._id}${path.parse(req.files.productPic.name).ext}`
           


           req.files.productPic.mv(`public/uploads/${req.files.productPic.name}`)
           .then(()=>{


            productModel.updateOne({_id:user._id}, {
                productPic: req.files.productPic.name
            })
            .then(()=>{

                res.redirect("/profile")
            })

           })
           
            
        })
        .catch(err=>console.log(`Error occurred when adding new product. `))

});


module.exports = router;
