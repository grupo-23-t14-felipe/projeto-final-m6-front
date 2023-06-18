"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import registerSchema, { TRegisterData } from "./validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { NavBar } from "@/components/Navbar";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { PatternFormat } from "react-number-format";
import axios from "axios";
import { IResponseCepApi } from "./types";
import clsx from "clsx";
import { AuthProvider } from "@/context/AuthContext";

const Register = () => {
  const [typeAccount, setTypeAccount] = useState(false);
  const [cpf, setCpf] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [resultCep, setResultCep] = useState<IResponseCepApi>();

  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors
  } = useForm<TRegisterData>({
    resolver: zodResolver(registerSchema)
  });

  const onFormSubmit: SubmitHandler<TRegisterData> = (formData) => {
    const regex = /\D/g;
    clearErrors("cpf");
    clearErrors("cellphone");

    if (cpf.replace(regex, "").length < 11) {
      setError("cpf", { type: "required", message: "Digite seu CPF" });
    } else if (cellphone.replace(regex, "").length < 11) {
      setError("cellphone", { type: "required", message: "Digite seu CPF" });
    } else {
      const newFormData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        cpf: cpf.replace(regex, ""),
        celphone: cellphone.replace(regex, ""),
        birthday: formData.birthday,
        description: formData.description,
        imageUrl: "",
        is_seller: typeAccount,
        address: {
          cep: resultCep?.cep.replace(regex, ""),
          street: resultCep?.logradouro,
          state: resultCep?.uf,
          city: resultCep?.localidade,
          number: formData.number,
          complement: formData.complement
        }
      };

      registerUser(newFormData);
    }
  };

  const consultCep = async (cep: string) => {
    const regex = /\D/g;
    clearErrors("cep");

    if (cep.replace(regex, "").length < 8) {
      return setError("cep", { type: "required", message: "Digite seu CEP" });
    }
    if (resultCep?.cep === cep) {
      return;
    } else if (cep.replace(regex, "").length === 8) {
      const response = await axios.get(`https://viacep.com.br/ws/${cep.replace(regex, "")}/json/`);

      if (response.data.erro) {
        return setError("cep", { type: "required", message: "Digite um CEP válido" });
      }

      setResultCep(response.data);
    }
  };

  return (
    <AuthProvider>
      <NavBar />
      <main className="bg-grey8 flex items-center justify-center pt-11 pb-24 px-4">
        <form
          className="bg-grey10 max-w-[412px] w-full py-11 px-7 sm:px-12 flex flex-col gap-8 rounded"
          onSubmit={handleSubmit(onFormSubmit)}>
          <h1 className="heading-5-500 text-grey0">Cadastro</h1>
          <div className="flex flex-col gap-6">
            <p className="body-2-500 text-grey0">Informações Pessoais</p>

            <div className="flex flex-col gap-2">
              <Input
                inputType="text"
                placeHolder="Ex: Samuel Leão"
                inputClass={clsx("input-outline", errors.name && "border-feedbackAlert1")}
                labelClass="body-2-500 text-grey1"
                labelChildren="Nome"
                register={register("name")}
              />
              {errors.name && (
                <p className="body-2-500 text-sm text-feedbackAlert1">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Input
                inputType="text"
                placeHolder="samuel@kenzie.com"
                inputClass={clsx("input-outline", errors.email && "border-feedbackAlert1")}
                labelClass="body-2-500 text-grey1"
                labelChildren="E-mail"
                register={register("email")}
              />
              {errors.email && (
                <p className="body-2-500 text-sm text-feedbackAlert1">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="body-2-500 text-grey1">CPF</label>
              <PatternFormat
                format="###.###.###-##"
                className={clsx("input-outline", errors.cpf && "border-feedbackAlert1")}
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
              {errors.cpf && (
                <p className="body-2-500 text-sm text-feedbackAlert1">{errors.cpf.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="body-2-500 text-grey1">Celular</label>
              <PatternFormat
                format="(##) #####-####"
                className={clsx("input-outline", errors.cellphone && "border-feedbackAlert1")}
                placeholder="(01) 91234-5678"
                onChange={(e) => setCellphone(e.target.value)}
              />
              {errors.cellphone && (
                <p className="body-2-500 text-sm text-feedbackAlert1">{errors.cellphone.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Input
                inputType="date"
                placeHolder="00/00/0000"
                labelChildren="Data de Nascimento"
                inputClass={clsx("input-outline", errors.birthday && "border-feedbackAlert1")}
                labelClass="body-2-500 text-grey1"
                register={register("birthday")}
              />
              {errors.birthday && (
                <p className="body-2-500 text-sm text-feedbackAlert1">{errors.birthday.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="body-2-500 text-grey1">Descrição</label>
              <textarea
                className="input-outline resize-none h-[80px]"
                placeholder="Digitar descrição"
                {...register("description")}
              />
            </div>

            <p className="body-2-500 text-grey0">Informações de Endereço</p>

            <div className="flex flex-col gap-2">
              <label className="body-2-500 text-grey1">CEP</label>
              <PatternFormat
                format="#####-###"
                className={clsx("input-outline", errors.cep && "border-feedbackAlert1")}
                placeholder="00000-000"
                onChange={async (e) => await consultCep(e.target.value)}
              />
              {errors.cep && (
                <p className="body-2-500 text-sm text-feedbackAlert1">{errors.cep.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-3">
              <div className="flex flex-col gap-2">
                <Input
                  inputType="text"
                  inputClass={clsx(
                    "input-outline",
                    resultCep ? "" : "opacity-50 cursor-not-allowed"
                  )}
                  labelClass="body-2-500 text-grey1"
                  labelChildren="Estado"
                  disable={true}
                  value={resultCep ? resultCep.uf : ""}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Input
                  inputType="text"
                  inputClass={clsx(
                    "input-outline",
                    resultCep ? "" : "opacity-50 cursor-not-allowed"
                  )}
                  labelClass="body-2-500 text-grey1"
                  labelChildren="Cidade"
                  disable={true}
                  value={resultCep ? resultCep.localidade : ""}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Input
                inputType="text"
                inputClass={clsx("input-outline", resultCep ? "" : "opacity-50 cursor-not-allowed")}
                labelClass="body-2-500 text-grey1"
                labelChildren="Rua"
                disable={true}
                value={resultCep ? resultCep.logradouro : ""}
              />
            </div>

            <div className="grid grid-cols-2 gap-x-3">
              <div className="flex flex-col gap-2">
                <Input
                  inputType="text"
                  placeHolder="Digitar número"
                  inputClass={clsx("input-outline", errors.number && "border-feedbackAlert1")}
                  labelClass="body-2-500 text-grey1"
                  labelChildren="Número"
                  maxLength={8}
                  register={register("number")}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Input
                  inputType="text"
                  placeHolder="Ex: Apto 307"
                  inputClass={clsx("input-outline", errors.complement && "border-feedbackAlert1")}
                  labelClass="body-2-500 text-grey1"
                  labelChildren="Complemento"
                  register={register("complement")}
                />
              </div>
            </div>

            <fieldset className="flex gap-x-3 fieldset-radios">
              <legend className="body-2-500 text-grey0 mb-7">Tipo de conta</legend>

              <Input
                inputType="radio"
                inputName="buyer"
                inputId="buyer"
                value="true"
                inputClass="absolute w-0 h-0"
                labelClass="hidden"
                inputChecked={!typeAccount && true}
              />
              <label
                htmlFor="buyer"
                className={clsx(
                  "relative button-big border-2 border-grey4 rounded text-center cursor-pointer px-0 w-full"
                )}
                onClick={() => setTypeAccount(false)}>
                Comprador
              </label>

              <Input
                inputType="radio"
                inputName="announcer"
                inputId="announcer"
                value="false"
                inputClass="absolute w-0 h-0"
                labelClass="hidden"
                inputChecked={typeAccount}
              />
              <label
                htmlFor="announcer"
                className={clsx(
                  "relative button-big border-2 border-grey4 rounded text-center cursor-pointer px-0 w-full"
                )}
                onClick={() => setTypeAccount(true)}>
                Anunciante
              </label>
            </fieldset>

            <div className="flex flex-col gap-2">
              <Input
                inputType="password"
                placeHolder="Digite sua senha"
                inputClass={clsx("input-outline", errors.password && "border-feedbackAlert1")}
                labelClass="body-2-500 text-grey1"
                labelChildren="Senha"
                register={register("password")}
              />
              {errors.password && (
                <p className="body-2-500 text-sm text-feedbackAlert1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Input
                inputType="password"
                placeHolder="Confirme sua senha"
                inputClass={clsx("input-outline", errors.confirm && "border-feedbackAlert1")}
                labelClass="body-2-500 text-grey1"
                labelChildren="Confirmar senha"
                register={register("confirm")}
              />
              {errors.confirm && (
                <p className="body-2-500 text-sm text-feedbackAlert1">{errors.confirm.message}</p>
              )}
            </div>

            <Button type="submit" className="btn-brand1-big">
              Finalizar cadastro
            </Button>
          </div>
        </form>
      </main>
      <Footer />
    </AuthProvider>
  );
};

export default Register;
