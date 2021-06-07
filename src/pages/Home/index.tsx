import React, { useEffect, useState } from 'react';
import { MdAddShoppingCart, MdRemoveShoppingCart } from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { Product, Category } from '../../types';

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: string]: number;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'all',
      name: 'All Categories',
    },
  ]);
  const [sortByPrice, setSortByPrice] = useState<number>(0);
  const [sortByCategories, setSortByCategories] = useState<string>('all');
  const { addProduct, removeProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    return { ...sumAmount, [product.name]: product.amount };
  }, {} as CartItemsAmount);

  useEffect(() => {
    async function loadProducts() {
      const { data: productsDB } = await api.get<Product[]>('/products');

      const formattedProducts: ProductFormatted[] = productsDB.map((product) => {
        return {
          ...product,
          priceFormatted: formatPrice(product.price),
        };
      });
      setProducts(formattedProducts);
    }
    async function loadCategories() {
      const { data: categoriesDB } = await api.get<Category[]>('/product/categories');

      setCategories([...categories, ...categoriesDB]);
    }
    loadProducts();
    loadCategories();
  }, []);

  async function handleAddProduct(id: string) {
    await addProduct(id);
  }
  async function handleRemoveProduct(id: string) {
    await removeProduct(id);
  }
  const handleSortPrice = () => {
    if (sortByPrice === 1 || sortByPrice === 0) {
      const asc = products.sort((a, b) => Number(a.price) - Number(b.price));
      setProducts(asc);
      setSortByPrice(-1);
    } else {
      const desc = products.sort((a, b) => Number(b.price) - Number(a.price));
      setProducts(desc);
      setSortByPrice(1);
    }
  };
  const handleSortByCategory = (id: string) => {
    setSortByCategories(id);
  };

  return (
    <div className="container">
      <div className="categories">
        {categories.map((category) => {
          return (
            <span
              onClick={() => handleSortByCategory(category.id)}
              key={category.id}
              className={category.id !== sortByCategories ? 'categories__item' : 'categories__item active'}
            >
              {category.name}
            </span>
          );
        })}
      </div>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Name</th>
            <th>
              <span className="sortByPrice" onClick={() => handleSortPrice()}>
                Price
                <span>^</span>
              </span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products
            .filter((product) => {
              if (sortByCategories !== 'all') {
                return product.category.id === sortByCategories;
              } else {
                return product;
              }
            })
            .map((product) => {
              return (
                <tr key={product.name}>
                  <td>{product.category.name}</td>
                  <td>{product.name}</td>
                  <td>{product.priceFormatted}</td>
                  <td style={{ textAlign: 'center' }}>
                    {cartItemsAmount[product.name] < 1 || cartItemsAmount[product.name] === undefined ? (
                      <button type="button" onClick={() => handleAddProduct(product.name)}>
                        <MdAddShoppingCart size={16} color="#FFF" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="removeProduct"
                        onClick={() => handleRemoveProduct(product.name)}
                        style={{ marginLeft: '5px' }}
                      >
                        <MdRemoveShoppingCart size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
