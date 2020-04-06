const express = require('express')
const router = express.Router()
const productModel = require("../models/products.js");

//routes

router.get("/",(req,res)=>{

    res.render("index",{
            title : "Home Page",
            categories: productModel.getCategories(),
            bestSellers: productModel.getBestSellers()
            
    })

});


router.get("/products",(req,res)=>{

    res.render("products",{
            title : "Products Page",
            data: productModel.getAllProducts()
    })
});


    module.exports = router;
