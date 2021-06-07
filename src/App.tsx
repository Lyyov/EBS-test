import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './routes';
import './styles/global.css';
import Header from './components/Header';
import { CartProvider } from './hooks/useCart';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <Header />
        <Routes />
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
