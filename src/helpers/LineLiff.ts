import axios, { AxiosError } from "axios";
import { TLineProfile } from "../types";
class LineLiff {
  static verify = async (accessToken: string) => {
    return await axios
      .get(
        "https://api.line.me/oauth2/v2.1/verify?access_token=" + accessToken,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(({ data }) => {
        if (
          data.client_id !== process.env.LIFF_CLIENT_ID ||
          data.expired_in <= 0
        ) {
          return false;
        }

        return true;
      })
      .catch(() => {
        return false;
      });
  };

  static getProfile = async (accessToken: string) => {
    return await axios
      .get("https://api.line.me/oauth2/v2.1/userinfo", {
        headers: { Authorization: "Bearer " + accessToken },
      })
      .then(({ data }) => {
        console.log(data);
        return data as TLineProfile;
      })
      .catch((error) => {
        console.log(error);
        if (error instanceof AxiosError) {
          return null;
        }
        return null;
      });
  };
}

export default LineLiff;
