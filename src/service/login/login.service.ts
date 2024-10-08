"use server";


import {
  LoginBodyRequestType,
  LoginPostResponseAType,
  LoginResponseType,
  SignInAuthType,
  signInSchema,
} from "@/types/authType/login.d";
import { signIn } from "@/auth";
import { CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";
import { postServerFetch } from "@/utils/server-utils/fetchServerSide";

export async function postLogin(
  body: LoginBodyRequestType
): Promise<LoginResponseType> {
  try {
    // validate
    await signInSchema.validate(body);
    const login = await postServerFetch<LoginPostResponseAType>(
      "auth/login",
      JSON.stringify(body),
      {
        "Content-Type": "application/json",
      }
    );
    return {
      isValid: true,
      ...login,
    };
  } catch (error) {
    console.error("Error login:", error);
    return {
      isValid: false,
    };
  }
}

export async function SignInAuth({ values }: SignInAuthType) {
  let isValidSignin;

  try {
    isValidSignin = await signIn("credentials", {
      redirect: false,
      username: values.username,
      password: values.password,
    });
  } catch (error) {
    const signInError = error as CredentialsSignin;
    console.error("Sign-in error:", signInError);
    return signInError.message;
  }

  // if signin is valid
  // redirect to todo page
  if (isValidSignin) {
    redirect("/todo");
  }
}
