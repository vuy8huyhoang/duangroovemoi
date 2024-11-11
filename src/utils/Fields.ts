class User {
  static user(): Array<any> {
    return [
      "email",
      "role",
      "fullname",
      "phone",
      "gender",
      "url_avatar",
      "birthday",
      "country",
      "created_at",
      "last_update",
      "id_google",
    ];
  }

  static admin(): Array<any> {
    return [
      "email",
      "role",
      "fullname",
      "phone",
      "gender",
      "url_avatar",
      "birthday",
      "country",
      "created_at",
      "last_update",
      "id_google",
    ];
  }
}

class Fields {
  static user(role: string) {
    if (role === "user" || role === "membership") return User.user();
    else if (role === "admin") return User.admin();
  }
}

export default Fields;
