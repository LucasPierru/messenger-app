import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/navbar/navbar";
import Chat from "./pages/Chat";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Navbar />}>
      <Route index element={<Home />} />
      <Route path="/:id" element={<Chat />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
