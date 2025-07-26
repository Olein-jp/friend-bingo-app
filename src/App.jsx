import { BrowserRouter, Routes, Route } from "react-router-dom";
import SettingPage from "./pages/SettingPage";
import BingoPage from "./pages/BingoPage";

export default function App() {
  const basename =
    import.meta.env.MODE === "production" ? "/friend-bingo-app" : "/";

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<SettingPage />} />
        <Route path="/bingo" element={<BingoPage />} />
      </Routes>
    </BrowserRouter>
  );
}
