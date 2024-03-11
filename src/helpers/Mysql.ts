import mysql from "mysql";
import { EInsertStatus, TInsertStatus, TLineProfile } from "../types";

export default class Mysql {
  static createInstance = () => {
    return mysql.createConnection({
      host: "localhost",
      port: 8889,
      user: "root",
      password: "root",
      database: "db_thaiselect",
    });
  };

  static InsertUser = async (user: TLineProfile): Promise<TInsertStatus> => {
    try {
      const db = this.createInstance();
      db.connect();

      db.query(
        "INSERT INTO users (unique_id, display_name, picture_url, has_consent) \
      VALUES (?, ?, ?, ?) \
      ON DUPLICATE KEY \
      UPDATE display_name = VALUES(display_name), picture_url = VALUES(picture_url), has_consent = VALUES(has_consent)",
        [user.sub, user.name, user.picture, false],
        (error, results, fields) => {
          console.log(error, results, fields);
        }
      );

      db.end();
      return EInsertStatus.Inserted;
    } catch (error) {
      return EInsertStatus.Failed;
    }
  };

  static selectUserById = async (unique_id: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const db = this.createInstance();
      db.connect();

      db.query(
        "SELECT display_name, picture_url, has_consent FROM users WHERE unique_id = ?",
        [unique_id],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows[0]);
        }
      );

      db.end();
    });
  };

  static setAsConsent = async (unique_id: string): Promise<TInsertStatus> => {
    return new Promise((resolve, reject) => {
      const db = this.createInstance();
      db.connect();

      db.query(
        "UPDATE users SET has_consent = 1 WHERE unique_id = ?",
        [unique_id],
        (error, results) => {
          if (error) {
            reject(error);
            return;
          }

          if (results.affectedRows > 0) {
            resolve(EInsertStatus.Updated);
          } else {
            resolve(EInsertStatus.Failed);
          }
        }
      );

      db.end();

      return EInsertStatus.Inserted;
    });
  };
}
