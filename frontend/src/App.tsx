import VirkarekisterContainer from 'components/VirkarekisteriContainer';
import { validateAuthState } from './auth/msal-instance';
import { useEffect, useState } from 'react';

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await validateAuthState();
      setAppIsReady(true);
    };

    init().catch(console.error);
  }, []);

  if (!appIsReady) return null;

  return <VirkarekisterContainer />;
};

export default App;
