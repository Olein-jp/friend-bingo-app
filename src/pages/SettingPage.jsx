import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bingoData from "../data/bingoData.json";
import "./SettingPage.css";

export default function SettingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "課題ビンゴ生成設定 - ボルダリングスペース フレンド";
  }, []);

  // 利用するリストのデフォルト設定
  const defaultLists = {
    "キッズ課題": true,
    "青テープ": false,
    "ピンクテープ": false,
    "黄テープ": false,
    "水色テープ": false
  };
  const defaultUseFree = true;

  // localStorageから前回選択内容を読み込む
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

  // 選択内容を保存
  useEffect(() => {
    localStorage.setItem("selectedLists", JSON.stringify(selectedLists));
  }, [selectedLists]);

  useEffect(() => {
    localStorage.setItem("useFree", JSON.stringify(useFree));
  }, [useFree]);

  // リストのチェックボックス変更
  const handleCheckboxChange = (key) => {
    setSelectedLists((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // FREEの有無変更
  const handleFreeChange = () => {
    setUseFree((prev) => !prev);
  };

  // 選択内容をクリア
  const handleClearSelection = () => {
    setSelectedLists(defaultLists);
    setUseFree(defaultUseFree);
    localStorage.removeItem("selectedLists");
    localStorage.removeItem("useFree");
  };

  // ビンゴ表を生成
  const generateBingo = () => {
    let pool = [];
    if (selectedLists["キッズ課題"]) pool = [...pool, ...bingoData["キッズ課題"]];
    if (selectedLists["青テープ"]) pool = [...pool, ...bingoData["青テープ"]];
    if (selectedLists["ピンクテープ"]) pool = [...pool, ...bingoData["ピンクテープ"]];
    if (selectedLists["黄テープ"]) pool = [...pool, ...bingoData["黄テープ"]];
    if (selectedLists["水色テープ"]) pool = [...pool, ...bingoData["水色テープ"]];

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
        <h1 className="setting-title">
          ボルダリングスペース フレンド<br />課題ビンゴ生成設定
        </h1>

        {/* リスト選択 */}
        <div className="checkbox-group">
          {Object.keys(defaultLists).map((key) => (
            <label key={key} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedLists[key]}
                onChange={() => handleCheckboxChange(key)}
              />
              {key}
            </label>
          ))}
        </div>

        {/* FREE設定 */}
        <div className="checkbox-group">
          <label>
            <input type="checkbox" checked={useFree} onChange={handleFreeChange} />
            中央をFREEにする
          </label>
        </div>

        {/* ボタン */}
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
