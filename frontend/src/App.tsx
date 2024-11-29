import VirkarekisterContainer from 'components/VirkarekisteriContainer';
import msalInstance, { validateAuthState } from './auth/msal-instance';
import { useEffect, useState } from 'react';

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!(await validateAuthState()))
        // if the auth state is "broken" (refresh token has expired or there is some unknown unexpected error),
        // silently "log out" (more accurately, tell MSAL that it needs to clear its state) the user
        await msalInstance.logoutRedirect({
          account: msalInstance.getActiveAccount(),
          onRedirectNavigate: () => false,
        });

      setAppIsReady(true);
    };

    init().catch(console.error);
  }, []);

  if (!appIsReady) return null;

  return <VirkarekisterContainer />;
};
export default App;
