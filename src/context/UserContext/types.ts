import { AxiosResponse } from "axios";
import { Dispatch, SetStateAction } from "react";
import { FieldError } from "react-hook-form";

export interface IUserProviderProps {
  user: IUser | undefined;
  loading: boolean;
  createAnnouncer: (data: IAnnouncer) => Promise<boolean>;
  updateAnnouncer: (data: IAnnouncer, uuid: string) => Promise<boolean>;
  loggout: () => void;
  setToken: Dispatch<SetStateAction<string | undefined>>;
  setUser: Dispatch<SetStateAction<IUser | undefined>>;
  updateAddress: (data: IAddress) => Promise<boolean | string>;
  updateUser: (data: IUserUpdate) => Promise<boolean | string>;
  deleteUser: () => Promise<boolean | string>;
  deleteImgOfAd: (uuid: string) => Promise<boolean>;
  deleteAd: (uuid: string) => Promise<boolean>;
  createComment: (data: { description: string }, uuidCar: string) => Promise<boolean>;
  updateComment: (
    data: { description: string },
    uuidComment: string
  ) => Promise<AxiosResponse<any, any> | any>;
  deleteComment: (uuidComment: string) => Promise<boolean>;
  getUser: (uuid: string) => void;
}

export interface IAnnouncer {
  brand?: string | FieldError;
  color?: string | FieldError;
  description?: string | FieldError;
  fipe_price?: number;
  fuel_type?: string;
  gallery?: any[];
  img_default?:
    | string
    | {
        name: string;
        img_url: string;
        file: File;
      };
  is_active?: boolean | FieldError;
  mileage?: number | FieldError;
  model?: string | FieldError;
  value?: number;
  year?: number;
}
export interface IDecodeProps {
  email: string;
  exp: number;
  iat: number;
  sub: string;
}

export interface IUser {
  uuid: string;
  name: string;
  email: string;
  cpf: string;
  celphone: string;
  birthday: string;
  description: string;
  imageUrl: string;
  is_seller: boolean;
  address: IAddress;
  randomColor: string;
}

export interface IUserUpdate {
  name: string;
  email: string;
  cpf: string;
  celphone: string;
  birthday: string;
  description: string;
}

export interface IAddress {
  uuid: string;
  cep: string;
  state: string;
  street: string;
  city: string;
  number: string;
  complement: string;
}
