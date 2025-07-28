import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./BingoPage.css"; // 共通スタイル

export default function BingoPage() {
  const [bingoItems, setBingoItems] = useState([]);
  const [gridSize, setGridSize] = useState(5);
  const navigate = useNavigate();

  // ページタイトル設定＆localStorageからデータ・サイズを復元
  useEffect(() => {
    document.title = "課題ビンゴ表 - ボルダリングスペース フレンド";

    const savedSize = localStorage.getItem("bingoSize");
    if (savedSize) {
      setGridSize(JSON.parse(savedSize));
    }

    const data = localStorage.getItem("bingoItems");
    if (!data) {
      navigate("/");
    } else {
      setBingoItems(JSON.parse(data));
    }
  }, [navigate]);

  // PDFダウンロード
  const downloadPDF = async () => {
    const element = document.querySelector(".bingo-print-area");
    await document.fonts.ready;
    const canvas = await html2canvas(element, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    let imgWidth = pageWidth - 20;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;
    if (imgHeight > pageHeight - 20) {
      imgHeight = pageHeight - 20;
      imgWidth = (canvas.width * imgHeight) / canvas.height;
    }
    const posX = (pageWidth - imgWidth) / 2;
    const posY = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, "PNG", posX, posY, imgWidth, imgHeight);
    pdf.save("bingo.pdf");
  };

  const handleGoBack = () => {
    navigate("/");
  };

  if (bingoItems.length === 0) return null;

  return (
    <div className="page-container">
      {/* 動的に 3x3 or 5x5 のクラスを付与 */}
      <div className={`bingo-print-area size-${gridSize}x${gridSize}`}>
        <h1 className="bingo-title">
          <figure className="page-logo">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="ボルダリングスペース フレンド ロゴ"
            />
          </figure>
          課題ビンゴ表（{gridSize}×{gridSize}）
        </h1>

        <div
          id="bingo-board"
          className="bingo-board"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows:    `repeat(${gridSize}, 1fr)`,
          }}
        >
          {bingoItems.map((item, i) => (
            <div
              key={i}
              className="bingo-cell"
              style={{
                backgroundColor: item.bgColor,
                color: item.fontColor,
              }}
              title={item.text}
            >
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="button-area">
        <button onClick={downloadPDF} className="btn btn-green">
          PDFダウンロード
        </button>
        <button onClick={handleGoBack} className="btn btn-gray">
          戻る
        </button>
      </div>
    </div>
  );
}
