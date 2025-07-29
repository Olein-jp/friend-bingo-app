import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bingoData from "../data/bingoData.json";
import "./SettingPage.css";

export default function SettingPage() {
  const navigate = useNavigate();

  // ページタイトル設定
  useEffect(() => {
    document.title = "課題ビンゴ作成 - ボルダリングスペース フレンド";
  }, []);

  // デフォルト値
  const defaultLists = {
    "キッズ課題 - 赤": true,
    "キッズ課題 - 青": true,
    "キッズ課題 - 黄": false,
    "青テープ": true,
    "ピンクテープ": false,
    "黄テープ": false,
    "水色テープ": false,
  };
  const defaultUseFree = true;
  const defaultGridSize = 5;

  // localStorage から状態を復元
  const loadState = () => {
    const savedLists = localStorage.getItem("selectedLists");
    const savedUseFree = localStorage.getItem("useFree");
    const savedGridSize = localStorage.getItem("gridSize");
    return {
      selectedLists: savedLists ? JSON.parse(savedLists) : defaultLists,
      useFree: savedUseFree !== null ? JSON.parse(savedUseFree) : defaultUseFree,
      gridSize:
        savedGridSize !== null ? JSON.parse(savedGridSize) : defaultGridSize,
    };
  };

  const [selectedLists, setSelectedLists] = useState(
    loadState().selectedLists
  );
  const [useFree, setUseFree] = useState(loadState().useFree);
  const [gridSize, setGridSize] = useState(loadState().gridSize);

  // 状態を localStorage に保存
  useEffect(() => {
    localStorage.setItem("selectedLists", JSON.stringify(selectedLists));
  }, [selectedLists]);

  useEffect(() => {
    localStorage.setItem("useFree", JSON.stringify(useFree));
  }, [useFree]);

  useEffect(() => {
    localStorage.setItem("gridSize", JSON.stringify(gridSize));
  }, [gridSize]);

  // チェック操作ハンドラ
  const handleCheckboxChange = (key) => {
    setSelectedLists((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const handleFreeChange = () => setUseFree((prev) => !prev);
  const handleSizeChange = (size) => setGridSize(size);

  // クリア
  const handleClearSelection = () => {
    setSelectedLists(defaultLists);
    setUseFree(defaultUseFree);
    setGridSize(defaultGridSize);
    localStorage.removeItem("selectedLists");
    localStorage.removeItem("useFree");
    localStorage.removeItem("gridSize");
  };

  // ビンゴ生成
  const generateBingo = () => {
    let pool = [];
    if (selectedLists["キッズ課題 - 赤"])
      pool = [...pool, ...bingoData["キッズ課題 - 赤"]];
    if (selectedLists["キッズ課題 - 青"])
      pool = [...pool, ...bingoData["キッズ課題 - 青"]];
    if (selectedLists["キッズ課題 - 黄"])
      pool = [...pool, ...bingoData["キッズ課題 - 黄"]];
    if (selectedLists["青テープ"])
      pool = [...pool, ...bingoData["青テープ"]];
    if (selectedLists["ピンクテープ"])
      pool = [...pool, ...bingoData["ピンクテープ"]];
    if (selectedLists["黄テープ"])
      pool = [...pool, ...bingoData["黄テープ"]];
    if (selectedLists["水色テープ"])
      pool = [...pool, ...bingoData["水色テープ"]];

    const total = gridSize * gridSize;
    if (pool.length < total) {
      alert(`選択されたリストに十分なアイテムがありません（${total}個必要）。`);
      return;
    }

    // シャッフル＆抽出
    pool = pool.sort(() => Math.random() - 0.5).slice(0, total);

    // 中央をFREEに
    if (useFree) {
      pool[Math.floor(total / 2)] = bingoData.free;
    }

    // 保存してページ遷移
    localStorage.setItem("bingoItems", JSON.stringify(pool));
    localStorage.setItem("bingoSize", JSON.stringify(gridSize));
    navigate("/bingo");
  };

  return (
    <div className="page-container">
      <div className="setting-container">
        <h1 className="setting-title">
          <figure className="page-logo">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="ボルダリングスペース フレンド ロゴ"
            />
          </figure>
          課題ビンゴ作成
        </h1>

        {/* ビンゴサイズ選択 */}
        <div className="checkbox-group">
          <label>
            <input
              type="radio"
              name="gridSize"
              checked={gridSize === 5}
              onChange={() => handleSizeChange(5)}
            />
            5×5
          </label>
          <label>
            <input
              type="radio"
              name="gridSize"
              checked={gridSize === 3}
              onChange={() => handleSizeChange(3)}
            />
            3×3
          </label>
        </div>

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
            <input
              type="checkbox"
              checked={useFree}
              onChange={handleFreeChange}
            />
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
