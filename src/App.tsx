import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import Login from "./pages/Login";
import Navbar from "./components/navbar/navbar";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import ChangePassword from "./pages/ChangePassword";
import Profile from "./pages/Profile";
import { useAuthStore } from "./store/useAuthStore";
import { useChatSocket } from "./hooks/useChatSocket";

const queryClient = new QueryClient();

function App() {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();
  useChatSocket();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="size-20 animate-spin text-foreground" />
      </div>
    );

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={!authUser ? <Login /> : <Navigate to="/conversation" />} />
          <Route path="/register" element={!authUser ? <Register /> : <Navigate to="/conversation" />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/conversation" element={authUser ? <Navbar /> : <Navigate to="/" />}>
            <Route path="/conversation/:id" element={<Chat />} />
          </Route>
          <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
