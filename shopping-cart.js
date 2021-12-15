"use strict";

//Darle una vuelta

//const contentful = require('contentful');
const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: "ijpoc4c9z0nq",
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: "mgyVfeTIJ1nJIYiPm9opFAL9lypDwRSroGd2d6rAuIE"
  });
  console.log(client);

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
                    <i class="fas fa-shopping-cart"></i>add to cart
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
                    event.target.innerText = 'in cart';
                    event.target.disabled = true;
                    //console.log(event);

                    //get product from products
                    let cartItem = {
                        ...Storage.getProduct(id),
                        amount: 1
                    };
                    console.log(cartItem);


                    //add product to the cart
                    cart = [...cart, cartItem];
                    //console.log(cart);

                    //Save cart in lstorage
                    Storage.saveCart(cart)
                    //Set cart values
                    this.setCartValues(cart);
                    //display cart item
                    this.addCartItem(cartItem)
                    //Show the cart
                    this.showCart()


                });
            }
        });
    }
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
        console.log(cartTotal, cartItems);
    }

    addCartItem(item) {
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
            <p class="item-amount" data-id=${item.id}>${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>`;
        cartContent.appendChild(div);
        // console.log(cartContent);

    }
    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }
    setupApp() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart)
    };
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item))
        closeCartBtn.addEventListener('click', this.hideCart)

    }
    hideCart() {
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }
    cartLogic() {
        //Clear Cart Button
        clearCart.addEventListener('click', () => {
            this.clearCart();
        });
        //Cart Functionality
        cartContent.addEventListener('click', event => {
            //console.log(event.target);
            if (event.target.classList.contains('remove-item')) {
                let removeItem = event.target;
                //console.log(removeItem);
                let id = removeItem.dataset.id;
                // console.log((removeItem.parentElement));
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id)
            }else if(event.target.classList.contains('fa-chevron-up')){
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                //console.log(addAmount);
                let tempItem = cart.find(item =>item.id ===id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveProduct(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            }else if(event.target.classList.contains('fa-chevron-down')){
                let lowerAmount = event.target;
                let id=lowerAmount.dataset.id;
                let tempItem = cart.find(item =>item.id ===id);
                tempItem.amount = tempItem.amount - 1;
                if(tempItem.amount > 0){
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                }else{
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this,this.removeItem(id);
                }
            }
        })
    }
    clearCart() {
        let cartItems = cart.map(item => item.id);
        //console.log(cartItems);
        cartItems.forEach(id => this.removeItem(id));
        console.log(cartContent.children);
        //Remove items from DOM
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0])
        }
        this.hideCart();

    }
    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
    }
    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}

//Local Storage
class Storage {
    static saveProduct(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    //Setup app

    ui.setupApp()

    //tomar todos los productos
    products
        .getProducts()
        .then((products) => {
            ui.displayProducts(products);
            Storage.saveProduct(products);
        })
        .then(() => {
            ui.getBagButtons();
            ui.cartLogic();
        });
});





//https://www.youtube.com/watch?v=90PgFUPIybY&t=16s min 3:59:46 - Conectando a la API...