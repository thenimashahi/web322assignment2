const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({

productPic:
{
type: String
},

description:
{
    type:String,
    required: true,
}, 

title:
{
    type:String,
    required:true
},

price:
{
    type:String,
    required:true
},

category:
{
    type:String,
    required: true
},

bestSeller:
{
    type:Number
},

dateCreated:
{
    type:Date,
    default:Date.now()
},

/*createdBy:
{

}*/

});


//static database
/*const products = {

    fakeDB: [],

    init(){
        this.fakeDB.push({
            image: "images/product1.jpg",
            description: "An iron kettlebell to help you with strength training!",
            title: "10 lb. Kettlebell",
            price: 25.99,
            category: "Weights",
            bestSeller: 1
        }); 

        this.fakeDB.push({
            image: "images/product2.jpg",
            description: "A set of olympic weightlifting plates.",
            title: "Olympic Plates",
            price: 300.99,
            category: "Weights",
            bestSeller: 0
        });

        this.fakeDB.push({
            image: "images/product3.jpg",
            description: "A lightweight dumbbell. ",
            title: "5 lb. Dumbbell",
            price: 5.99,
            category: "Weights",
            bestSeller: 1
        });

        this.fakeDB.push({
            image: "images/product4.jpg",
            description: "A BAR used to help set up weightlifting plates. (Weights not included.) ",
            title: "Olympic Bar",
            price: 45.99,
            category: "Equipment",
            bestSeller: 0
        });

        this.fakeDB.push({
            image: "images/product5.jpg",
            description: "Straps used to assist weightlifting movements.",
            title: "Weightlifting Straps",
            price: 10.99,
            category: "Accessories",
            bestSeller: 1
        });

        this.fakeDB.push({
            image: "images/product6.jpg",
            description: "A set of battle ropes used for definition and conditioning.",
            title: "Battle Ropes",
            price: 30.99,
            category: "Conditioning",
            bestSeller: 0
        });
    },

    getAllProducts()
    {

        return this.fakeDB;
    },

    getBestSellers(){

        var tempArray = [];

        for(var i=0; i < this.fakeDB.length; i++){

            if (this.fakeDB[i].bestSeller == 1){
            tempArray.push(this.fakeDB[i]);
            }

        }

        return tempArray;
    },

    getCategories(){
        
        var tempArray = [];

        for(var i=0; i < this.fakeDB.length; i++){
            
            if (this.fakeDB[i].category)
            tempArray.push(this.fakeDB[i]);
            
        }

        for (var i=0; i < tempArray.length; i++){
            if(tempArray[i].category == tempArray[i].category){
                tempArray.splice(i, 1);
            }
        }

        

        return tempArray;
    
    }

}

products.init();
module.exports=products;*/


const productModel = mongoose.model('Products', productSchema);

module.exports = productModel;
