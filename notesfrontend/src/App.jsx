import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import CreateNote from "./pages/CreateNote";
import Navbar from "./components/Navbar";
import Fotter from "./components/Fotter";

const App = () => {
  return (
    <>
      <div className="min-h-screen text-[var(--text-primary)]">
        <Navbar />

        <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateNote />} />
          </Routes>
        </main>
      </div>

      <Fotter />
    </>
  );
};

export default App;
