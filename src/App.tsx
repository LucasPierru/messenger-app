import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import Login from "./pages/Login";
import Navbar from "./components/navbar/navbar";
import Chat from "./pages/Chat";
import Register from "./pages/Register";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/conversation" element={<Navbar />}>
        <Route path="/conversation/:id" element={<Chat />} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />;
    </QueryClientProvider>
  );
}

export default App;
