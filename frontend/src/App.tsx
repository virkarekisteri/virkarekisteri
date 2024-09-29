import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import vitestLogo from '/vitest.svg';
import reduxLogo from '/redux.svg';
import swaCliLogo from '/swa-cli.svg';
import daisyuiLogo from '/daisyui.svg';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import {
  decrement,
  increment,
  incrementAsync,
  selectCount,
  selectStatus,
  setValue,
} from './redux/slices/counter-slice';
import Logo from './components/Logo';
import { getTestTable } from './redux/slices/test-table-slice';

const App = () => {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectCount);
  const status = useAppSelector(selectStatus);
  const { entries: messages } = useAppSelector((state) => state.messages);

  return (
    <>
      <div className="flex justify-center space-x-4 p-6">
        <Logo src={viteLogo} alt="Vite logo" href="https://vitejs.dev" label="Vite" />
        <Logo src={reactLogo} alt="React logo" href="https://react.dev" label="React" spin={true} />
        <Logo src={vitestLogo} alt="Vitest logo" href="https://vitest.dev/" label="Vitest" />
        <Logo src={reduxLogo} alt="Redux logo" href="https://redux.js.org" label="Redux Toolkit" />
        <Logo src={daisyuiLogo} alt="daisyUI logo" href="https://daisyui.com/" label="daisyUI" />
        <Logo src={swaCliLogo} alt="SWA CLI logo" href="https://azure.github.io/static-web-apps-cli/" label="SWA CLI" />
      </div>
      <div className="card mt-6 items-center rounded-lg bg-base-200 p-8 shadow-lg">
        <p className="text-lg">Status: {status}</p>
        <div className="mt-4 flex space-x-4">
          <button className="btn btn-error" onClick={() => dispatch(decrement())}>
            -
          </button>
          <button className="btn btn-primary" onClick={() => dispatch(setValue(0))}>
            count is {count}
          </button>
          <button className="btn btn-success" onClick={() => dispatch(increment())}>
            +
          </button>
        </div>
        <button className="btn btn-outline mt-4" onClick={() => dispatch(incrementAsync())}>
          Increment Async
        </button>
        <button className="btn btn-outline mt-4" onClick={() => dispatch(getTestTable())}>
          Fetch TestTable1
        </button>
        {messages
          .filter((msg) => msg.displayMessage)
          .map((msg) => (
            <p key={msg.coolNumber} className="mt-4">
              {msg.coolMessage + ' ' + msg.coolNumber}
            </p>
          ))}
        <p className="mt-4">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="mt-8 text-center text-sm text-gray-500">Click on the logos to learn more</p>
    </>
  );
};

export default App;
