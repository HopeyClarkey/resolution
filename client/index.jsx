import { createRoot } from "react-dom/client";
import { store } from '../client/components/store/store';
import { Provider } from "react-redux";
import App from "./components/App.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';

const appRoot = document.getElementById("app");

const root = createRoot(appRoot);

root.render(
  <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>
);
