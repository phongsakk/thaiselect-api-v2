export type TLineProfile = {
  sub: string;
  name: string;
  picture: string;
};

export type TInsertStatus = EInsertStatus;

export enum EInsertStatus {
  Failed,
  Inserted,
  Updated,
}
