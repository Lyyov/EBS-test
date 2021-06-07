import React from 'react';
import { MdShoppingCart } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { useCart } from '../../hooks/useCart';

const Header: React.FC = () => {
  const { cart } = useCart();
  const cartSize = cart.length;

  return (
    <div className="header">
      <div className="container">
        <div className="header__row">
          <Link className="header__link" to="/">
            Home
          </Link>
          <Link className="header__link" to="/cart">
            <MdShoppingCart size={20} color="#000000" />
            <div>
              <span>{cartSize}</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
