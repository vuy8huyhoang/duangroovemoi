// "use client";
// import { NextResponse } from "next/server";
// import { getServerErrorMsg, throwCustomError } from "./utils/Error";
// import { jwtVerify, JWTVerifyResult } from "jose";
// import { getQueryParams, objectResponse } from "./utils/Response";

// const secretToken = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

// export async function middleware(request: Request) {
//   console.log("Running middle...");

//   // Giả sử bạn cần gọi API để xác thực token
//   // const token = request.headers.get("token");
//   // const response = NextResponse.next();

//   // // Check if there is no token
//   // if (!token) {
//   //   response.headers.set("user", "Unauthorized");
//   //   return;
//   // }

//   // try {
//   //   // Decoded and get ID user
//   //   let decoded: JWTVerifyResult | null = null;
//   //   try {
//   //     decoded = await jwtVerify(token, secretToken);
//   //   } catch (error) {
//   //     throwCustomError("Wrong token", 400);
//   //   }
//   //   // return objectResponse("test");
//   //   if (!decoded?.payload) {
//   //     throwCustomError("Failed to verify token", 500);
//   //   }
//   //   const userId: string = (decoded?.payload.id as string) || "";
//   //   response.headers.set("userId", userId);

//   //   // GetParams
//   //   // response.headers.set("params", JSON.stringify(getQueryParams(request)));

//   //   return response;
//   // } catch (error) {
//   //   return getServerErrorMsg(error);
//   // }
// }

// // Cấu hình matcher để áp dụng middleware chỉ cho các route cụ thể
// export const config = {
//   matcher: ["/"],
//   // matcher: ["/:path*"],
//   // matcher: ["/api/profile", "/api/change-password", "/api/update-infor"],
// };
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import { NextResponse } from "next/server";

// const goBack = () => {
//   return NextResponse.redirect("/");
// };

// const userAuth = (req, res?) => {
//   console.log("User middle...");
//   if (typeof window !== "undefined") {
//     if (localStorage.getItem("accessToken")) {
//       console.log("Đã đăng nhập");
//     } else {
//       console.log("Chưa đăng nhập");
//     }
//   }
// };

// const adminAuth = (req, res?) => {
//   console.log("Admin middle...");
//   if (typeof window !== "undefined") {
//     if (localStorage.getItem("accessToken")) {
//       console.log("Đã đăng nhập");
//     } else {
//       console.log("Chưa đăng nhập");
//     }
//   }
// };

export function middleware(request) {
  //   const userRoutes = ["/thuvien", "/profile"];
  //   const adminRoutes = [];
  //   if (userRoutes.includes(request.nextUrl.pathname)) {
  //     return userAuth(request);
  //   } else if (
  //     adminRoutes.includes(request.nextUrl.pathname) ||
  //     request.nextUrl.pathname.startsWith("/admin")
  //   ) {
  //     return adminAuth(request);
  //   }
  //   return NextResponse.next();
}
