"use strict";

//Declarar Variables - seleccionando elementos del DOM

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCart = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

//Carrito
let cart = [];

//buttons
let buttonsDOM = [];


//Tomar los productos de JSON
class Products {
    async getProducts() {
        try {
            let result = await fetch("products.json");
            let data = await result.json();

            let products = data.items;
            products = products.map((item) => {
                const {
                    title,
                    price
                } = item.fields;
                const {
                    id
                } = item.sys;
                const image = item.fields.image.fields.file.url;
                return {
                    title,
                    price,
                    id,
                    image,
                };
            });
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}

//Display prod
class UI {
    displayProducts(products) {
        //console.log(products);
        let result = "";
        products.forEach((product) => {
            result += `
            <!-- Single Product -->
            <article class="product">
                <div class="img-container">
                <img src=${product.image} alt="product" class="product-img" />

                <button class="bag-btn" data-id=${product.id}>
                    <i class="fas fa-shopping-cart"></i>add to bag
                </button>
            </div>
            <h3>${product.title}</h3>
            <h4>${product.price}€</h4>
        </article>
        <!-- end of Single Product -->`;
        });
        productsDOM.innerHTML = result;
    }
    getBagButtons() {
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach((button) => {
            let id = button.dataset.id;
            // console.log(id);
            let inCart = cart.find((item) => item.id === id);
            if (inCart) {
                button.innerText = "in cart";
                button.disabled = true;
            } else {
                button.addEventListener("click", (event) => {
                    event.target.innerText ='in cart';
                    event.target.disabled = true;
                    //console.log(event);

                    //get product from products
                    let cartItem = {...Storage.getProduct(id),amount:1};
                    console.log(cartItem);


                    //add product to the cart
                    cart = [...cart,cartItem];
                    //console.log(cart);

                    //Save cart in lstorage
                    Storage.saveCart(cart)
                    //Set cart values
                    this.setCartValues(cart);
                    //display cart item
                    this.addCartItem(cartItem)
                    //Show the cart


                    
                });
            }
        });
    }
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item =>{
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
        console.log(cartTotal,cartItems);
    }

    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = ` 
        <img src=${item.image} alt="product">
        <div>
            <h4>${item.title}</h4>
            <h5>${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">data-id=${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>`;
        cartContent.appendChild(div);
        console.log(cartContent);
    }
    
}

//Local Storage
class Storage {
    static saveProduct(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id){
        let products=JSON.parse(localStorage.getItem('products'));
        return products.find(product=>product.id===id);
    }
    static saveCart(cart){
        localStorage.setItem('cart',JSON.stringify(cart));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();

    //tomar todos los productos
    products
        .getProducts()
        .then((products) => {
            ui.displayProducts(products);
            Storage.saveProduct(products);
        })
        .then(() => {
            ui.getBagButtons();
        });
});

//https://www.youtube.com/watch?v=90PgFUPIybY&t=16s min 2:36:46