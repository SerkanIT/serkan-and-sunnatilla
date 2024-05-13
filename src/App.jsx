import { useCallback, useEffect, useState } from 'react';
import './App.css';
import Card from './components/card/card';
import Cart from './components/cart/cart';
import { getData } from './constants/db';

const telegram = window.Telegram.WebApp;

const App = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        telegram.ready("https://t.me/serkan_priw");
    }, []);

    const onAddItem = item => {
        const existItem = cartItems.find(c => c.id === item.id);
        const updatedCartItems = existItem
            ? cartItems.map(c =>
                c.id === item.id
                    ? { ...existItem, quantity: existItem.quantity + 1 }
                    : c
            )
            : [...cartItems, { ...item, quantity: 1 }];
        setCartItems(updatedCartItems);
    };

    const onRemoveItem = item => {
        const existItem = cartItems.find(c => c.id === item.id);
        const updatedCartItems = existItem.quantity === 1
            ? cartItems.filter(c => c.id !== existItem.id)
            : cartItems.map(c =>
                c.id === existItem.id
                    ? { ...existItem, quantity: existItem.quantity - 1 }
                    : c
            );
        setCartItems(updatedCartItems);
    };

    const onCheckout = () => {
        telegram.MainButton.text = 'Buy book :)';
        telegram.MainButton.show("New order");
    };

    const onSendData = useCallback(() => {
        const queryID = telegram.initDataUnsafe?.query_id;

        if (cartItems.length === 0 || !queryID) {
            console.log("Cart is empty or Query ID is not available. Cannot send data to Telegram.");
            return;
        }

        fetch('https://t.me/serkan_priw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                products: cartItems,
                queryID: queryID,
            }),
        })
        .catch(error => {
            console.error("Error while sending data to Telegram:", error);
        });
    }, [cartItems]);

    useEffect(() => {
        telegram.onEvent('mainButtonClicked', onSendData);

        return () => telegram.offEvent('mainButtonClicked', onSendData);
    }, [onSendData]);

    const courses = getData();

    return (
        <>
            <h1 className='heading'>Books</h1>
            <Cart cartItems={cartItems} onCheckout={onCheckout} />
            <div className='cards__container'>
                {courses.map(course => (
                    <Card
                        key={course.id}
                        course={course}
                        onAddItem={onAddItem}
                        onRemoveItem={onRemoveItem}
                    />
                ))}
            </div>
        </>
    );
};

export default App;
