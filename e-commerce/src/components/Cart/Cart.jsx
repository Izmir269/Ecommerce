import React from 'react';
import {Container, Typography, Button, Grid, Toolbar} from '@material-ui/core';
import useStyles from './styles';
import CartItem from '../Cart/CartItem/CartItem'; 
import {Link} from 'react-router-dom';

const Cart = ({cart, onUpdateCartQty, onRemoveFromCart, onEmptyCart}) => {
    const classes = useStyles();
    

    //Simple fonctions renvoyant du JSX
    const EmptyCart = () => (
        <Typography variant="subtitle1">
            Tu n'as pas d'articles dans le panier, commence à en ajouter, <Link to="/" className={classes.link}>Ajouter au panier</Link>
            </Typography>
    );
    const FiledCart = () => (
        //empty fragment
        <>
            <Grid container spacing={3}>
                {cart.line_items.map((item) => (
                    <Grid item xs={12} sm={4} key={item.id}>
                        <CartItem item={item} onUpdateCartQty= {onUpdateCartQty} onRemoveFromCart = {onRemoveFromCart}/>
                        
                    </Grid>
                ))}

            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant="h4"> Subtotal: {cart.subtotal.formatted_with_symbol}</Typography>
                <div>
                    <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary" onClick={onEmptyCart}>Empty Cart</Button>
                    <Button component={Link} to="/checkout" className={classes.checkoutButton} size="large" type="button" variant="contained" color="primary">Checkout</Button>

                </div>
            </div>
        </>

    );

    if(!cart.line_items) return 'Loading...';
    return (
        <Container>
            <div className={classes.toolbar}/>
            <Typography className= {classes.title} variant="h3" gutterBottom>Le contenu du panier</Typography>
            {
                /**
                 * On va rendre un composant différent en fonction de si le panier est vide ou pas
                 */
            }
            {!cart.line_items.length ? <EmptyCart /> : <FiledCart />}
        </Container>
    )
}

export default Cart
