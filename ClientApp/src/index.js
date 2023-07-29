import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "react-query";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const root = document.getElementById("root");

const queryClient = new QueryClient();

createRoot(root).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
