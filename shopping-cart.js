'use strict'

//Declarar Variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCart = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

//Carrito
let cart = [];

//Tomar los productos
class Products{
    async getProducts(){
        try{
            let result = await fetch('products.json');
            let data = await result.json();
            return data;
            return result;
        }catch(error){
            console.log(error);
        }
    }
}

//Display prod
class UI{

}

//Local Storage
class Storage{

}

document.addEventListener('DOMContentLoaded',()=>{
    const ui = new UI();
    const products = new Products();

    //tomar todos los productos
    products.getProducts().then(data => console.log(data));

});







//https://www.youtube.com/watch?v=90PgFUPIybY&t=16s min58,08