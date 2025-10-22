// src/App.tsx
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "./routes/AppRouter";
import "./App.css";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1d4ed8",
          borderRadius: 8,
          fontFamily: "Inter, sans-serif",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </ConfigProvider>
  );
}
