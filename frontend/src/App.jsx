import { useState } from "react";
import "./App.css";
import Product from "./pages/Product";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <h1 className="text-3xl font-bold text-blue-600">CartiMart</h1> */}
      <Product/>
    </>
  );
}

export default App;
