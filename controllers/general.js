const express = require('express')
const router = express.Router()
const productModel = require("../models/products.js");
const isAuthenticated = require("../middleware/auth");
const path = require("path");

//routes

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
    
        if(!categories){
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

router.get('/add-to-cart/:id', (req, res)=>{

    var productId = req.params.id;


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
