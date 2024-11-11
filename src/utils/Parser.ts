export default class Parser {
  static queryObject(str: string[]): string {
    return `
    JSON_OBJECT(
      ${str.join(",\n")}
    )
    `;
  }

  static queryArray(str: string): string {
    return `
    IFNULL(CONCAT('[', GROUP_CONCAT(
      DISTINCT ${str}
    SEPARATOR ','), ']'), '[]')
    `;
  }

  static convertJson(arr: Array<any>, ...fields: any) {
    arr.forEach((item) => {
      fields.forEach((field: any) => {
        item[field] = JSON.parse(item[field]);
      });
      return arr;
    });
  }

  static filterObjectKeys = (
    obj: Record<string, any>,
    keys: string[]
  ): Record<string, any> => {
    return keys.reduce((result, key) => {
      if (key in obj) {
        result[key] = obj[key as string];
      }
      return result;
    }, {} as Record<string, any>);
  };

  static removeNullObjects(array: any[]) {
    return array.filter((obj) => {
      // Kiểm tra nếu tất cả thuộc tính của đối tượng là null
      return !Object.values(obj).every((value) => value === null);
    });
  }
}
