export const getVariableName = (varObj: any) => {
  return Object.keys(varObj)[0];
};
export function formatTimeFromNow(dateString: string): string {
  // Lấy thời gian hiện tại và chuyển thành UTC
  // console.log(dateString);

  const currentDate = new Date();
  const currentDateTime = currentDate.getTime();

  // Lấy thời gian từ chuỗi và chuyển thành UTC
  const inputDate = new Date(dateString);
  const inputDateTime = inputDate.getTime();

  // Điều chỉnh múi giờ, ví dụ UTC+7 (chỉnh sửa theo múi giờ bạn muốn)
  const adjustedInputDateTime = inputDateTime + -7 * 60 * 60 * 1000; // Điều chỉnh 7 giờ

  // Tính toán sự khác biệt thời gian sau khi điều chỉnh múi giờ
  const timeDiff = currentDateTime - adjustedInputDateTime; // difference in milliseconds

  const seconds = Math.floor(timeDiff / 1000); // Convert milliseconds to seconds
  // console.log("Seconds:", seconds); // Log the seconds to check the value

  if (seconds < 0) {
    const day = inputDate.getDate().toString().padStart(2, "0");
    const month = (inputDate.getMonth() + 1).toString().padStart(2, "0");
    const year = inputDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const minutes = Math.floor(seconds / 60); // Convert seconds to minutes
  const hours = Math.floor(minutes / 60); // Convert minutes to hours
  const days = Math.floor(hours / 24); // Convert hours to days

  // Nếu thời gian nhỏ hơn 1 phút
  if (seconds < 60) {
    return "Vừa xong";
  }
  // Nếu thời gian dưới 1 giờ
  if (minutes < 60) {
    return `${minutes} phút trước`;
  }
  // Nếu thời gian dưới 1 ngày
  if (hours < 24) {
    return `${hours} giờ trước`;
  }
  // Nếu thời gian dưới 7 ngày
  if (days < 7) {
    return `${days} ngày trước`;
  }
  // Nếu đã quá 7 ngày, trả về thời điểm cụ thể
  const day = inputDate.getDate().toString().padStart(2, "0");
  const month = (inputDate.getMonth() + 1).toString().padStart(2, "0");
  const year = inputDate.getFullYear();
  return `${day}/${month}/${year}`;
}

export function convertToHttps(url) {
  if (typeof url !== "string" || !url.startsWith("http://")) {
    return url; // Trả về URL gốc nếu nó đã là HTTPS hoặc không hợp lệ
  }
  return url.replace("http://", "https://");
}
