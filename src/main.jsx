import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

import { AuthProvider } from "./contexts/authContext/AuthProvider.jsx";
import { NotificationProvider } from "./contexts/notificationContext/NotificationProvider.jsx";

import "./index.css";
import { Toaster } from "./components/ui/toaster.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <App />
          <Toaster />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </>
);
