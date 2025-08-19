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
            staleTime: 30 * 60 * 1000, // Data được coi là fresh trong 30p
            gcTime: 60 * 60 * 1000, // Giữ data trong memory 1 tiếng ( dù ko dùng )
            refetchOnReconnect: true, // Chỉ refetch khi mất kết nối internet
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            retry: 2,
            structuralSharing: true, // Tối ưu re-render khi data không thay đổi
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
