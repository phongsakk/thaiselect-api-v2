import { Request, Response } from "express";
import LineLiff from "../helpers/LineLiff";
import { EInsertStatus, TInsertStatus, TLineProfile } from "../types";
import Mysql from "../helpers/Mysql";

export default {
  me: async (req: Request, res: Response): Promise<Response> => {
    try {
      const is_verified = await LineLiff.verify(req.body.lineToken);
      if (!is_verified) {
        return res.status(401).json({ message: "Session หมดอายุ" });
      }

      const profile = await LineLiff.getProfile(req.body.lineToken);
      if (!profile) {
        return res.status(401).json({ message: "Session หมดอายุ" });
      }

      const user = await Mysql.selectUserById(profile.sub);

      if (!user) {
        return res.status(404);
      }

      return res.status(200).json(user);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        return res.status(500).json({ error: err.message });
      } else {
        return res.status(500).json({ error: "Unknown Error" });
      }
    }
  },
  checkuser: async (req: Request, res: Response) => {
    try {
      const is_verified = LineLiff.verify(req.body.lineToken);

      if (!is_verified) {
        return res.status(401).json({ message: "Session หมดอายุ" });
      }

      const profile = await LineLiff.getProfile(req.body.lineToken);

      if (!profile) {
        return res.status(401).json({ message: "Session หมดอายุ" });
      }

      const user = await Mysql.selectUserById(profile.sub);
      console.log(user);

      res.status(200).json({ message: "ok", user: user });
    } catch (e) {
      if (e instanceof Error) {
        console.error(e);
        return res.status(500).json({ message: e.message });
      }
    }
  },

  register: async (req: Request, res: Response) => {
    const body: TRegisterRequest = req.body;

    let message: string = "";
    const keys = Object.keys(body);
    const values = Object.values(body);
    for (let i = 0; i < keys.length; i++) {
      if (values[i] === "") {
        message += "<b>" + nameof[i] + "</b>ต้องไม่เป็นค่าว่าง<br />";
      }
    }

    if (message !== "") {
      message = message.slice(0, -6);
      console.log(message);
      return res.status(403).json({ message: message });
    }

    const is_verified = LineLiff.verify(body.lineToken);

    if (!is_verified) {
      return res.status(401).json({ message: "Session หมดอายุ" });
    }

    const profile: TLineProfile | null = await LineLiff.getProfile(
      body.lineToken
    );

    if (!profile) {
      return res.status(401).json({ message: "Session หมดอายุ" });
    }

    const success: TInsertStatus = await Mysql.InsertUser(profile);

    if (
      success === EInsertStatus.Inserted ||
      success === EInsertStatus.Updated
    ) {
      return res.status(200).json({ message: "ลงทะเบียนสำเร็จ" });
    } else {
      return res.status(500).json({ message: "ลงทะเบียนสำเร็จ" });
    }
  },

  setAsConsent: async (req: Request, res: Response) => {
    try {
      const is_verified = await LineLiff.verify(req.body.lineToken);

      if (!is_verified) {
        return res.status(401).json({ message: "Session หมดอายุ" });
      }

      const profile = await LineLiff.getProfile(req.body.lineToken);

      if (!profile) {
        return res.status(401).json({ message: "Session หมดอายุ" });
      }

      const insertStatus = await Mysql.setAsConsent(profile.sub);

      console.log(insertStatus);
    } catch (error) {}
  },
};

const nameof = [
  "lineToken",
  "ชื่อ",
  "นามสกุล",
  "ที่อยู่",
  "จังหวัด",
  "รหัสไปรษณีย์",
  "เบอร์ติดต่อ",
  "acceptTerms",
];

type LabelDictionary<T> = {
  [K in keyof T]: string;
};

type TRegisterRequest = {
  lineToken: string;
  firstname: string;
  lastname: string;
  address: string;
  province: string;
  postcode: string;
  tel: string;
  acceptTerms?: boolean;
};
