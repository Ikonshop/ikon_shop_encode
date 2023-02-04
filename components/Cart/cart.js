import React, { useState, useEffect } from "react";
import BuyCart from './buyCart';
import styles from './Cart.module.css';
import {
    TrashBin
} from 'react-ionicons'

const Cart = (products) => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [allProductIds, setAllProductIds] = useState([]);
    const [invalid, setInvalid] = useState(true);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart"));
        if (cart.length > 0) {
            const firstToken = cart[0].token;
            const firstOwner = cart[0].owner;
            console.log("cart is", cart[0].token);
            setCart(cart);
            setAllProductIds(cart.map((item) => item.id));
                
            // check all items in cart to make sure they have the same owner, if not alert user then setInvalid true
            if(cart.every((item) => item.owner === firstOwner && item.token === firstToken)) {
                console.log("all items in cart have the same owner and token");
                setInvalid(false);
            } else {
                alert("All items in cart must have the same owner and token");
                setInvalid(true);
                // set the background of the cart_item_blob to red on the invalid items
                
            }
            // set total to the sum of all items in cart
            setTotal(cart.reduce((acc, item) => acc + parseFloat(item.price), 0));

            setLoading(false);
        }

        // if cart is empty, setInvalid to true and loading false
        if (cart.length === 0) {
            setInvalid(true);
            setLoading(false);
        }

    }, []);

    // anytime an item is added to the cart, instantly update the display
    // everytime a product is added to localStorage update the cart

    

    useEffect(() => {
        let total = 0;
        cart.forEach((product) => {
            total += parseFloat(product.price);
        });
        setTotal(total);
    }, [cart]);

    const handleRemove = (product) => {
        const newCart = cart.filter((item) => item.id !== product.id);
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
        // if cart is empty, setInvalid to true
        if (newCart.length === 0) {
            setInvalid(true);
        }
        // check cart to see if all products have the same owner and token, if they do setInvalid(false) else setInvalid(true)
        if(newCart.every((item) => item.owner === newCart[0].owner && item.token === newCart[0].token)) {
            console.log("all items in cart have the same owner and token");
            setInvalid(false);
        }
    };


    return(
        <div className={styles.cart_container}>
            {loading ? (
                <div>Loading...</div>
            ) : null}
            {!loading && cart.length > 0 ? (
                <div>
                     
                    {cart.map((product, index) => (
                        // if the product[i].owner or product[i].token is not the same as product[0].owner or product[0].token, set the className to invalid_cart_item_blob
                        <div key={index} className={
                            product.owner !== cart[0].owner || product.token !== cart[0].token ? styles.invalid_cart_item_blob : styles.cart_item_blob
                        }>
                        {/* <div key={index} className={styles.cart_item_blob}> */}
                            <div className={styles.cart_item_left_col}>
                                <img src={product.imageUrl} alt={product.name} />
                            </div>
                            <div className={styles.cart_item_mid_col}>
                                <div className={styles.cart_item_name}>{product.name}</div>
                                <div className={styles.cart_item_price}>{product.price} {product.token.toUpperCase()}</div>
                                <div className={styles.cart_item_owner}>Owner: {product.owner.slice(-5)}</div>
                            </div>
                            <div className={styles.cart_item_right_col}>
                                <TrashBin className={styles.cart_item_remove} onClick={() => handleRemove(product)} /> 
                            </div>
                        </div>
                    ))}
                    <div className={styles.cart_total}>Total: {total} {cart[0].token.toUpperCase()}</div>
                    {cart.length > 0 && !invalid && (
                        <BuyCart
                            cart={cart}
                            total={total}
                            allProductIds={allProductIds}
                            price={total.toString()}
                            token={cart[0].token}
                            owner={cart[0].owner}
                      />
                    )}
                </div>
            ) : (
                <div className={styles.cart_empty}>Your cart is empty</div>
            )}
            
        </div>
    )
}

export default Cart;
