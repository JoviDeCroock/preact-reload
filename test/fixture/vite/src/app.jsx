import { h } from 'preact';
import { useCounter } from './useCounter';
import { StoreProvider } from './context';
import { Products } from './products';
import { Greeting } from './greeting';
import { Effect } from './effect';
import { GenericContext } from './genericCtx';
import { setup } from 'goober';
import { Style } from './styles';

setup(h);

function Test() {
  const [count, increment] = useCounter();
  return (
    <div>
      <p className="value">Count: {count}</p>
      <button className="button" onClick={increment}>Increment</button>
    </div>
  )
}

export function App(props) {
  return (
    <Style id="color">
      <Test />
      <Greeting />
      <StoreProvider>
        <Products />
      </StoreProvider>
      <Effect />
      <GenericContext />
    </Style>
  )
}
