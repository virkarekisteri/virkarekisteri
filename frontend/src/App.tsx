import VirkarekisterContainer from 'components/VirkarekisteriContainer';
import msalInstance from './auth/msal-instance';
import { MsalProvider } from '@azure/msal-react';

const App = () => (
  <MsalProvider instance={msalInstance}>
    <VirkarekisterContainer />
  </MsalProvider>
);
export default App;
