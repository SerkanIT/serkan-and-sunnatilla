import { totalPrice } from '../../units/total-price';
import Button from '../button/button';
import './cart.css';

const Cart = ({ cartItems, onCheckout }) => {
	return (
		<div className='cart__container'>
			<p>
				Price:{' '}
				{totalPrice(cartItems).toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD',
				})}
			</p>

			<Button
				title={`${
					cartItems.length === 0 ? 'Payment' : "Order"
				}`}
				disable={cartItems.length === 0 ? true : false}
				type={'checkout'}
				onClick={onCheckout}
			/>
		</div>
	);
};

export default Cart;
