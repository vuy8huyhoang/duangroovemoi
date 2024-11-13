import axiosLib from "axios";

// const base = "/api/";
const base = "https://api-groove.vercel.app/";

// Tạo một axios của axios
const axios = axiosLib.create({
  baseURL: base, // URL gốc của API
  // baseURL: base + "/api", // URL gốc của API
});

// Thêm một request interceptor để gắn accessToken vào header của mỗi yêu cầu
axios.interceptors.request.use(
  (config: any) => {
    const accessToken = localStorage.getItem("accessToken");
    // const accessToken =
    //   "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6InUyIiwiZXhwIjoxNzYwNTQzMDEzfQ.-rk8KHiVACAVJXe6OOG_winL7vr1nQTmk2VdLbUMlwo";
    if (accessToken) {
      config.headers["token"] = accessToken; // Gắn accessToken vào header với tên 'token'
    }
    return config;
  },
  (error: any) => {
    // Xử lý lỗi nếu có trong quá trình cấu hình yêu cầu
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  // @ts-ignore
  (response) => {
    // Xử lý dữ liệu phản hồi nếu thành công
    return {
      result: response.data,
      newID: response.data?.newID,
      status: response.status,
    };
  },
  (error: any) => {
    if (error.response) {
      // Server trả về phản hồi với status không nằm trong khoảng 2xx
      console.error(`Error Status: ${error.response.status}`);
      console.error("Error Data:", error.response.data); // Dữ liệu trả về từ server
      console.error("Error Headers:", error.response.headers);
    } else if (error.request) {
      // Yêu cầu đã được gửi nhưng không nhận được phản hồi từ server
      console.error("No Response Received:", error);
    } else {
      // Một lỗi khác xảy ra trong quá trình thiết lập yêu cầu
      console.error("Error Message:", error.message);
    }
    return Promise.reject(error); // Tiếp tục trả về lỗi để xử lý ở nơi gọi API
  }
);

export default axios;
