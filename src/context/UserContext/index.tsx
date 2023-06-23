"use client";

import { api } from "@/services/api";
import { ReactNode, createContext, useEffect, useState } from "react";
import { IAddress, IDecodeProps, IUser, IUserProviderProps, IUserUpdate } from "./types";
import { parseCookies, destroyCookie, setCookie } from "nookies";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/navigation";

export const UserContext = createContext<IUserProviderProps>({} as IUserProviderProps);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const cookies = parseCookies();

  const [token, setToken] = useState<string | undefined>(cookies.token_kenzie_cars);

  const [user, setUser] = useState<IUser | undefined>();

  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  useEffect(() => {
    if (token) {
      const decoded: IDecodeProps = jwtDecode(token);

      setUser(decoded.user);
      window.location.reload();
    }
  }, []);

  const loggout = () => {
    destroyCookie(undefined, "token_kenzie_cars");
    setToken(undefined);
    setUser(undefined);
    window.location.reload();
  };

  const createAnnouncer = async (data: any) => {
    try {
      await api.post("/cars", data);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const updateAddress = async (data: IAddress) => {
    try {
      const result: { data: IAddress } = await api.patch(`user/${user?.uuid}/address`, data);

      const newAddressUser = {
        ...user!,
        address: result.data
      };

      setUser(newAddressUser);

      return true;
    } catch (error: any) {
      console.error(error);
      return error.data.message;
    }
  };

  const updateUser = async (data: IUserUpdate) => {
    try {
      const result: { data: IUser } = await api.patch(`users/${user?.uuid}`, data);

      console.log(result);

      const updatedUser = {
        ...user!,
        ...result.data
      };

      setUser(updatedUser);

      return true;
    } catch (error: any) {
      console.error(error);
      return error.data.message;
    }
  };

  const deleteUser = async () => {
    try {
      await api.delete(`/users/${token}`);

      setToken(undefined);
      setUser(undefined);

      router.refresh();

      return true;
    } catch (error: any) {
      console.log(error);
      return error.data.message;
    }
  };

  return (
    <UserContext.Provider
      value={{
        createAnnouncer,
        user,
        loggout,
        setToken,
        setUser,
        updateAddress,
        deleteUser,
        updateUser
      }}>
      {children}
    </UserContext.Provider>
  );
};