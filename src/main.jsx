import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

import { AuthProvider } from "./contexts/authContext/AuthProvider.jsx";
import { NotificationProvider } from "./contexts/notificationContext/NotificationProvider.jsx";
import { FavoritesProvider } from "./contexts/favoritesContext/FavoritesProvider.jsx";

import "./index.css";
import "leaflet/dist/leaflet.css";
import { Toaster } from "./components/ui/toaster.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <FavoritesProvider>
            <App />
            <Toaster />
          </FavoritesProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </>
);
