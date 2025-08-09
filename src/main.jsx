import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/index.js";
import "./index.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            retry: 3,
        },
    },
});

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <App />
            </Provider>
        </QueryClientProvider>
    </BrowserRouter>
);
