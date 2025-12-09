import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "@/context/AppContext";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AppToaster } from "./components/ui/Toaster";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <App />
      </AppProvider>
      <AppToaster />
    </QueryClientProvider>
  </React.StrictMode>
);
