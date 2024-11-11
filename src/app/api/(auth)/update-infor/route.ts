import connection from "@/lib/connection";
import { getServerErrorMsg, throwCustomError } from "@/utils/Error";
import { objectResponse } from "@/utils/Response";
import bcrypt from "bcryptjs";
import Checker from "@/utils/Checker";
import { getCurrentUser } from "@/utils/Get";

export const PATCH = async (request: Request) => {
  try {
    const currentUser = await getCurrentUser(request, true);
    const body = await request.json();
    const {
      fullname,
      url_avatar,
      phone,
      gender,
      age,
      birthday,
      country,
      is_banned,
    } = body;

    // Check password format
    Checker.checkString(fullname);
    Checker.checkString(url_avatar);
    Checker.checkString(url_avatar);
    Checker.checkIncluded(gender, ["male", "female"]);
    Checker.checkPhoneNumber(phone);
    Checker.checkInteger(age);
    Checker.checkDate(birthday);
    Checker.checkString(country);
    Checker.checkIncluded(is_banned, [0, 1]);

    const fieldsToUpdate = [];
    const updateData = [];

    if (fullname !== undefined) {
      fieldsToUpdate.push("fullname = ?");
      updateData.push(fullname);
    }

    if (url_avatar !== undefined) {
      fieldsToUpdate.push("url_avatar = ?");
      updateData.push(url_avatar);
    }

    if (phone !== undefined) {
      fieldsToUpdate.push("phone = ?");
      updateData.push(phone);
    }

    if (gender !== undefined) {
      fieldsToUpdate.push("gender = ?");
      updateData.push(gender);
    }

    if (age !== undefined) {
      fieldsToUpdate.push("age = ?");
      updateData.push(age);
    }

    if (birthday !== undefined) {
      fieldsToUpdate.push("birthday = ?");
      updateData.push(birthday);
    }

    if (country !== undefined) {
      fieldsToUpdate.push("country = ?");
      updateData.push(country);
    }

    if (is_banned !== undefined) {
      fieldsToUpdate.push("is_banned = ?");
      updateData.push(is_banned);
    }

    if (fieldsToUpdate.length === 0) {
      return throwCustomError("No fields provided for update", 400);
    }
    const query = `
      UPDATE User
      SET ${fieldsToUpdate.join(", ")}
      WHERE id_user = ?`;

    // Execute the query
    await connection.query(query, [...updateData, currentUser.id_user]);

    return objectResponse(
      { message: "Update user information successfully" },
      200
    );
  } catch (error) {
    return getServerErrorMsg(error);
  }
};
