import React from 'react';
import { MdAddCircleOutline, MdDelete, MdRemoveCircleOutline } from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';

interface Product {
  name: string;
  category: Category;
  price: number;
  amount: number;
}
interface Category {
  id: string;
  name: string;
}

const Cart: React.FC = () => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted = cart.map((product) => ({
    ...product,
    priceFormatted: formatPrice(product.price * product.amount),
  }));

  const total = formatPrice(
    cart.reduce((sumTotal, product) => {
      sumTotal += product.price * product.amount;

      return sumTotal;
    }, 0),
  );

  function handleProductIncrement(product: Product) {
    updateProductAmount({
      productName: product.name,
      amount: product.amount + 1,
    });
  }

  function handleProductDecrement(product: Product) {
    updateProductAmount({
      productName: product.name,
      amount: product.amount - 1,
    });
  }

  function handleRemoveProduct(productName: string) {
    removeProduct(productName);
  }

  return (
    <div className="container">
      <table className="productTable">
        <thead>
          <tr>
            <th>Category</th>
            <th>Name</th>
            <th>QTD</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartFormatted.map((product) => (
            <tr key={product.name}>
              <td>{product.category.name}</td>
              <td>{product.name}</td>
              <td>{product.amount}</td>
              <td>{product.priceFormatted}</td>
              <td>
                <div className="cart__actions">
                  <button type="button" disabled={product.amount <= 1} onClick={() => handleProductDecrement(product)}>
                    <MdRemoveCircleOutline size={20} />
                  </button>
                  <button type="button" onClick={() => handleRemoveProduct(product.name)}>
                    <MdDelete size={20} />
                  </button>
                  <button type="button" onClick={() => handleProductIncrement(product)}>
                    <MdAddCircleOutline size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer>
        <div className="total">
          <span>TOTAL </span>
          <strong> {total}</strong>
        </div>
      </footer>
    </div>
  );
};

export default Cart;
