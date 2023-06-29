import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Redefinir senha",
  description: "Generated by create next app"
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default RootLayout;
