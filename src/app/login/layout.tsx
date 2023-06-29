"use client";

import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Entrar",
  description: "Generated by create next app"
};

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default LoginLayout;
