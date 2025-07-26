import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./BingoPage.css"; // 同一デザイン用CSS

export default function BingoPage() {
  const [bingoItems, setBingoItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("bingoItems");
    if (!data) {
      navigate("/");
    } else {
      setBingoItems(JSON.parse(data));
    }
  }, [navigate]);

  /** A4横向きにビンゴ表を最大化してPDF化 */
  const downloadPDF = async () => {
    const element = document.querySelector(".bingo-print-area"); // 表示部分全体をキャプチャ

    const canvas = await html2canvas(element, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth(); // 297mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 210mm

    // 画像サイズをA4横向きに合わせて調整
    let imgWidth = pageWidth - 20; // 左右10mmの余白
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    // 高さが溢れる場合は幅を調整
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
      <div className="bingo-print-area">
        <h1 className="bingo-title">ビンゴ表</h1>
        <div id="bingo-board" className="bingo-board">
          {bingoItems.map((item, i) => (
            <div
              key={i}
              className="bingo-cell"
              style={{
                backgroundColor: item.bgColor,
                color: item.fontColor,
              }}
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
