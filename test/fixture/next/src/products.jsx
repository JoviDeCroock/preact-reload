import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { StoreContext } from './context.jsx';

const products = ['apple', 'peach']

export const Products = () => {
  const { addItem, removeItem, items } = useContext(StoreContext);
  return products.map(id => (
    <div className={`${id}-div`} key={id} onClick={() => items.includes(id) ? removeItem(id) : addItem(id)}>
      {id}
    </div>
  ))
}
