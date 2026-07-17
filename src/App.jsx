import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { Browse } from "./pages/Browse.jsx";
import { ResourceDetail } from "./pages/ResourceDetail.jsx";
import { Solution } from "./pages/Solution.jsx";
import { Community } from "./pages/Community.jsx";
import { About } from "./pages/About.jsx";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/resource/:id" element={<ResourceDetail />} />
          <Route path="/solution" element={<Solution />} />
          <Route path="/community" element={<Community />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
