import connection from "@/lib/connection";
import { throwCustomError } from "./Error";

export const getUserbyId = async (idUser: string) => {
  const [rows]: Array<any> = await connection.query(
    `
    SELECT
        u.id_user,
        u.fullname,
        u.role,
        u.email,
        u.password,
        u.url_avatar,
        u.phone,
        u.gender,
        u.id_google,
        u.is_banned,
        u.last_update,
        u.created_at,
        u.role
    FROM
        User u
    WHERE u.id_user = ?;
    `,
    [idUser]
  );

  if (rows.length === 0) return "User not found";
  const user = rows[0];
  if (user.is_banned === "1") return "Cannot verify authentication";
  return user;
};

export const getCurrentUser = async (
  req: Request,
  isRequired: boolean = true
) => {
  const userId = req.headers.get("userId") || "";

  const user = await getUserbyId(userId);

  if (isRequired) {
    if (!userId || user === "User not found")
      throwCustomError("Token not found", 401);
    if (user === "Cannot verify authentication")
      throwCustomError("Login failed", 403);
    if (typeof user === "string")
      throwCustomError("Cannot verify authentication", 401);
    return user;
  } else {
    return user;
  }
};

export const getRandomVerifyEmailCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const getByRole = (role: string | null, columnField = "is_show") => {
  return role === "admin" ? "" : `AND ${columnField} = 1`;
};

export const getByLike = (field: any, columnName: string) => {
  return (field !== undefined && `AND ${columnName} LIKE '%${field}%'`) || "";
};

export const getByEqual = (field: any, columnName: string) => {
  return (field !== undefined && `AND ${columnName} = '${field}'`) || "";
};

export const getByLimitOffset = (
  limit: any,
  offset: any,
  orderField: string,
  orderType: string = "DESC"
) => {
  return `
  ${
    limit !== undefined || offset !== undefined
      ? ` ORDER BY ${orderField} ${orderType}`
      : ""
  }
  ${limit !== undefined ? ` LIMIT ${limit}` : ""}
  ${offset !== undefined ? ` OFFSET ${offset}` : ""}
  `;
};
