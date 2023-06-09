"use client";

import Image from "next/image";
import logo_colored from "@/assets/logo_colored.svg";
import Link from "next/link";
import { Button } from "../Button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button as ButtonChakra
} from "@chakra-ui/react";
import { HiMenu } from "react-icons/hi";
import { GrFormClose } from "react-icons/gr";
import { useState } from "react";
import clsx from "clsx";
import { useUser } from "@/hooks/useUser";
import { IUser } from "@/context/UserContext/types";
import { ModalEditAddress } from "../ModalEditAddress";
import { ModalEditProfile } from "../ModalEditProfile";
import { usePathname } from "next/navigation";

const UserLoggedLinks = ({ user, loggout }: { user: IUser; loggout: () => void }) => {
  const pathName = usePathname();

  return (
    <>
      <ModalEditProfile />

      <ModalEditAddress />

      {user.is_seller && !pathName.includes("user") && (
        <Link
          href={`/user/${user.uuid}`}
          className="body-1-400 text-grey2 hover:text-grey0 duration-300">
          Meus Anúncios
        </Link>
      )}

      <Button
        onClick={loggout}
        className="text-left body-1-400 text-grey2 hover:text-grey0 duration-300">
        Sair
      </Button>
    </>
  );
};

const LinksLoginAndRegister = () => {
  return (
    <>
      <Link href={"/login"} className="body-1-600 text-grey2 hover:text-grey0 duration-300">
        Fazer Login
      </Link>
      <Link href={"/register"} className="btn-outline-2-big text-center">
        Cadastrar
      </Link>
    </>
  );
};

export const NavBar = () => {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const { user, loggout } = useUser();

  return (
    <header
      className={clsx(
        "flex-col px-4 sm:px-[1.875rem] lg:px-[3.75rem] justify-between items-center border-b-2 border-b-grey6 bg-grey10 overflow-hidden duration-300",
        isOpen
          ? user
            ? user.is_seller
              ? pathName.includes("user") && user.is_seller
                ? "h-[304px]"
                : "h-[372px]"
              : "h-[304px]"
            : "h-[264px]"
          : "h-[78px]"
      )}>
      <div className="w-full min-h-[78px] flex justify-between items-center">
        <figure>
          <Link href={"/"}>
            <Image src={logo_colored} alt="logo" priority={true} />
          </Link>
        </figure>
        <nav className="sm:hidden flex justify-center items-center">
          <Button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <GrFormClose size={20} /> : <HiMenu size={20} />}
          </Button>
        </nav>
        <nav className="min-h-[78px] border-l-2 pl-11 border-l-grey6 sm:flex items-center hidden">
          <div className="w-full flex items-center gap-11">
            {user ? (
              <Popover>
                <PopoverTrigger>
                  <ButtonChakra variant={"unstyled"}>
                    <div className="flex flex-row items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand2 flex justify-center items-center">
                        <p className="text-whiteFixed font-bold text-sm">
                          {user.name[0].toUpperCase() +
                            user.name[user.name.lastIndexOf(" ") + 1].toUpperCase()}
                        </p>
                      </div>
                      <p className="text-grey2 body-1-400">{user.name}</p>
                    </div>
                  </ButtonChakra>
                </PopoverTrigger>

                <PopoverContent className="w-[200px]">
                  <PopoverBody className="flex flex-col gap-4 p-4">
                    <UserLoggedLinks user={user} loggout={loggout} />
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            ) : (
              <LinksLoginAndRegister />
            )}
          </div>
        </nav>
      </div>
      {isOpen ? (
        user ? (
          <div className="w-full py-8 flex flex-col gap-11 sm:hidden">
            <UserLoggedLinks user={user} loggout={loggout} />
          </div>
        ) : (
          <div className="w-full py-8 flex flex-col gap-11 sm:hidden">
            <LinksLoginAndRegister />
          </div>
        )
      ) : null}
    </header>
  );
};
