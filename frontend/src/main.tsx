import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import './react-i18n.config';
import msalInstance, { setupMsalEventListeners } from './auth/msal-instance';
import { MsalProvider } from '@azure/msal-react';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

const theme = createTheme({
  components: {
    MuiPopover: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiPopper: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiDialog: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiModal: {
      defaultProps: {
        container: rootElement,
      },
    },
  },
});

msalInstance.initialize().then(() => {
  setupMsalEventListeners(store);

  root.render(
    <StrictMode>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <CssBaseline />
            <MsalProvider instance={msalInstance}>
              <App />
            </MsalProvider>
          </Provider>
        </ThemeProvider>
      </StyledEngineProvider>
    </StrictMode>,
  );
});
