import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Carts from "./pages/Carts";
import Post from "./pages/Post";
import Product from "./pages/Product";
import Recipes from "./pages/Recipes";
import Comments from "./pages/Comments"; // Tambahkan Quotes
import Todos from "./pages/Todos";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProductDetail from "./pages/ProductDetail";
import Home from "./pages/Home";
// Tambahkan Todos

const queryClient = new QueryClient();

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="product" element={<Product />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="recipes" element={<Recipes />} />
        <Route path="posts" element={<Post />} />
        <Route path="carts" element={<Carts />} />
        <Route path="/comments" element={<Comments />} />
        <Route path="/todos" element={<Todos />} />
      </Route>
    )
  );
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}

export default App;
