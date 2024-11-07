import VirkarekisterContainer from 'components/VirkarekisteriContainer';
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { Button } from '@mui/material';
import { loginRequest } from './auth/auth-config';
import { getTestFunc1, getTestFunc2, getTestFunc3 } from './services/functions/functions-service';
import msalInstance from './auth/msal-instance';

const MainContent = () => {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  const handleRedirect = () => {
    instance.loginRedirect(loginRequest).catch((error) => console.log(error));
  };

  const silenttoken = async () => {
    const response = await instance.acquireTokenSilent({
      scopes: loginRequest.scopes,
      account: activeAccount!,
    });
    console.log(response);
    // console.log(getTestFunc1(response.accessToken));
    // console.log(getTestFunc2(response.accessToken));
    console.log(getTestFunc3(response.accessToken));
  };

  const logout = async () => {
    await instance.logoutRedirect({ account: activeAccount });
  };

  return (
    <>
      {/*<VirkarekisterContainer />*/}
      <AuthenticatedTemplate>
        <p>koira</p>
        <Button onClick={silenttoken}>Get Silent Token</Button>
        <Button onClick={logout}>Logout</Button>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Button onClick={handleRedirect}>Sign up</Button>
      </UnauthenticatedTemplate>
    </>
  );
};

const App = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <MainContent />
    </MsalProvider>
  );
};

export default App;
