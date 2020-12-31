import React, {useState, useEffect} from 'react';
import {commerce} from './lib/commerce';

import {Products, Navbar, Cart, Checkout} from './components'; 

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

/*
A la place de 
import Products from './components/Products/Products';
import Navbar from './components/Navbar/Navbar';
on fait un seul import :
import {Products, Navbar} from './components'; 
Mais pour celà on doit créer un fichier index.js dans le dossier components où on doit exporter tous les components
*/

const App = () => {
    //produits
    const [products, setProducts] = useState([]);
    //panier
    const [cart, setCart] = useState({});
    //orders
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    //ENVOYER LES PRODUITS QUI SONT DANS COMMERCE.JS
    const fetchProducts = async () => {
        const {data} = await commerce.products.list(); //data est un paramètre contenu dans un objet response. Contient les produits

        setProducts(data);
    }
    //ENVOYER LES PRODUITS QUI SONT DANS LE PANIER
    const fetchCart = async () => {
        setCart(await commerce.cart.retrieve());
    }

    //Ajout dans le panier 
    const handleAddToCart = async(productId, quantity) => {
        const item = await commerce.cart.add(productId, quantity);

        setCart(item.cart); //La carte de l'item
    }
    //Mis à jour de la quantité d'un produit
    const handleUpdateCartQty = async (productId, quantity) => {
        const {cart} = await commerce.cart.update(productId, {quantity});
        setCart(cart);

    }
    //Suppression d'un produit du panier
    const handleRemoveFromCart = async (productId) => {
        const {cart} = await commerce.cart.remove(productId);

        setCart(cart);
    }
    //Vider son panier
    const handleEmptyCart = async () => {
        const {cart} = await commerce.cart.empty();

        setCart(cart);
    }

    const refreshCart = async() => {
        const newCart = await commerce.cart.refresh();

        setCart(newCart);
    }

    const handleCaptureCheckOut = async (checkoutTokenId, newOrder) => {
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);

            setOrder(incomingOrder);
            refreshCart();
        } catch(error) {
            setErrorMessage(error.data.error.message);
        }
    }

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);


    return (
        
        <Router>
            <div>
            <Navbar totalItems={cart.total_items}/>
            <Switch>
                <Route exact path="/">
                    <Products products={products} onAddToCart={handleAddToCart}/>
                </Route>
                
                <Route exact path="/cart">
                    <Cart 
                    cart={cart}
                    onUpdateCartQty={handleUpdateCartQty}
                    onRemoveFromCart={handleRemoveFromCart}
                    onEmptyCart={handleEmptyCart}
                    />
                </Route>
                <Route exact path="/checkout">
                    <Checkout cart={cart} order={order} onCaptureCheckOut={handleCaptureCheckOut} error={errorMessage}/>
                </Route>
            </Switch>
           
        </div>
        </Router>
    )
}

export default App
