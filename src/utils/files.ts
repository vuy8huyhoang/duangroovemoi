import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
// import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";

export const exportToExcel = (data, fileName) => {
  // Tạo một worksheet từ mảng đối tượng
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Tạo một workbook và thêm worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Xuất workbook ra file Excel
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  // Lưu file
  saveAs(blob, `${fileName}.xlsx`);
};
