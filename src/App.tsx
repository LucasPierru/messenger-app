import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { useEffect } from "react";
import Login from "./pages/Login";
import Navbar from "./components/navbar/navbar";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import ChangePassword from "./pages/ChangePassword";
import { useAuthStore } from "./store/useAuthStore";
import { useChatSocket } from "./hooks/useChatSocket";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/conversation" element={<Navbar />}>
        <Route path="/conversation/:id" element={<Chat />} />
      </Route>
    </Route>
  )
);

function App() {
  const { connectSocket } = useAuthStore();
  useChatSocket();

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
