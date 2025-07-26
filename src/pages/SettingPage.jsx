import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bingoData from "../data/bingoData.json";
import "./SettingPage.css";

export default function SettingPage() {
  const navigate = useNavigate();

  // 初期値
  const defaultLists = { A: true, B: false, C: false };
  const defaultUseFree = true;

  const loadState = () => {
    const savedLists = localStorage.getItem("selectedLists");
    const savedUseFree = localStorage.getItem("useFree");
    return {
      selectedLists: savedLists ? JSON.parse(savedLists) : defaultLists,
      useFree: savedUseFree !== null ? JSON.parse(savedUseFree) : defaultUseFree
    };
  };

  const [selectedLists, setSelectedLists] = useState(loadState().selectedLists);
  const [useFree, setUseFree] = useState(loadState().useFree);

  useEffect(() => {
    localStorage.setItem("selectedLists", JSON.stringify(selectedLists));
  }, [selectedLists]);

  useEffect(() => {
    localStorage.setItem("useFree", JSON.stringify(useFree));
  }, [useFree]);

  const handleCheckboxChange = (key) => {
    setSelectedLists((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFreeChange = () => {
    setUseFree((prev) => !prev);
  };

  const handleClearSelection = () => {
    setSelectedLists(defaultLists);
    setUseFree(defaultUseFree);
    localStorage.removeItem("selectedLists");
    localStorage.removeItem("useFree");
  };

  const generateBingo = () => {
    let pool = [];
    if (selectedLists.A) pool = [...pool, ...bingoData.listA];
    if (selectedLists.B) pool = [...pool, ...bingoData.listB];
    if (selectedLists.C) pool = [...pool, ...bingoData.listC];

    if (pool.length < 25) {
      alert("選択されたリストに十分なアイテムがありません。");
      return;
    }

    pool = pool.sort(() => Math.random() - 0.5).slice(0, 25);

    if (useFree) {
      const freeItem =
        bingoData.free || { text: "FREE", bgColor: "#FFF3B0", fontColor: "#000000" };
      pool[12] = freeItem;
    }

    localStorage.setItem("bingoItems", JSON.stringify(pool));
    navigate("/bingo");
  };

  return (
    <div className="page-container">
      <div className="setting-container">
        <h1 className="setting-title">ボルダリングスペース フレンド<br />課題ビンゴ生成設定</h1>

        <div className="checkbox-group">
          {["A", "B", "C"].map((key) => (
            <label key={key} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedLists[key]}
                onChange={() => handleCheckboxChange(key)}
              />
              {` List ${key}`}
            </label>
          ))}
        </div>

        <div className="checkbox-group">
          <label>
            <input type="checkbox" checked={useFree} onChange={handleFreeChange} />
            中央をFREEにする
          </label>
        </div>

        <div className="button-area">
          <button onClick={generateBingo} className="btn btn-blue">
            ビンゴ生成
          </button>
          <button onClick={handleClearSelection} className="btn btn-gray">
            選択内容をクリア
          </button>
        </div>
      </div>
    </div>
  );
}
