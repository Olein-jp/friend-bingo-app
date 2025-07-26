import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SettingPage from "./pages/SettingPage";
import BingoPage from "./pages/BingoPage";

function App() {
  return (
    <Router basename="/friend-bingo-app">
      <Routes>
        <Route path="/" element={<SettingPage />} />
        <Route path="/bingo" element={<BingoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
