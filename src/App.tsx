import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import vitestLogo from '/vitest.svg';
import reduxLogo from '/redux.svg';
import swaCliLogo from '/swa-cli.svg';
import './App.css';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { decrement, increment, incrementAsync, selectCount, selectStatus, setValue } from './redux/slices/counterSlice';

const App = () => {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectCount);
  const status = useAppSelector(selectStatus);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://vitest.dev/" target="_blank" rel="noreferrer">
          <img src={vitestLogo} className="logo vitest" alt="Vitest logo" />
        </a>
        <a href="https://redux.js.org" target="_blank" rel="noreferrer">
          <img src={reduxLogo} className="logo redux" alt="Redux logo" />
        </a>
        <a href="https://azure.github.io/static-web-apps-cli/" target="_blank" rel="noreferrer">
          <img src={swaCliLogo} className="logo swa-cli" alt="SWA CLI logo" />
        </a>
      </div>
      <h1>Vite + React + Vitest + Redux Toolkit + SWA CLI</h1>
      <div className="card">
        <p>Status: {status}</p>
        <button onClick={() => dispatch(decrement())}>-</button>
        <button onClick={() => dispatch(setValue(0))}>count is {count}</button>
        <button onClick={() => dispatch(increment())}>+</button>
        <br />
        <button onClick={() => dispatch(incrementAsync())}>Increment Async</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
};

export default App;
