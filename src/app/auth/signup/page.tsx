"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { Prisma } from '@prisma/client';


import { useSession } from "next-auth/react";

import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React, { FormEvent, SetStateAction, useState } from "react";
interface SignUpFields {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}
const SignUp = () => {
  const session = useSession();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  if (session.status === "authenticated") router.push("/");

  const [form, setForm] = useState<SignUpFields>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (!name || !value) {
      console.error("Invalid input");
      return;
    }

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      console.error("Passwords do not match");
      toast.toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Passwords don't Match",
      });
      setLoading(false);
      return;
      // return;
    }

    if (form.password.length < 8) {
      console.error("Password must be at least 8 characters long");
      toast.toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Password must be at least 8 characters long",
      });
      setLoading(false);

      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message); // More descriptive error handling
      }
    
      router.push("/");
      toast.toast({
        variant: "default",
        title: "Success!",
        description: "Your account has been created.",
      });
      setLoading(false);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('This email is already in use. Please try a different one.'); // User-friendly error message
        } else {
          console.error('Prisma Client error:', error); // Log other Prisma errors
          throw error; // Rethrow for further handling
        }
      } else {
        console.error('Unexpected error:', error); // Log unexpected errors
        throw error; // Rethrow for further handling
      }
    }
  }

  return (
    <div className=" flex flex-col  w-full min-h-screen  justify-center items-center bg-white  ">
      <div className="h-full lg:w-[350px] md:w-[350px] border border-zinc-800 p-5 rounded-md flex-col  sm:px-4 md:px-4 flex my-auto w-full px-4 gap-4">
        <h1 className="text-2xl font-bold ">Create Your Account</h1>
        <h2>
          Already have an account?{" "}
          <Link href="/auth/signin" className="underline">
            Sign In
          </Link>
        </h2>
        <form className="flex gap-2 flex-col" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <Input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <label htmlFor="firstName">First Name</label>
          <Input
            type="text"
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
          />
          <label htmlFor="lastName">Last Name</label>
          <Input
            type="text"
            id="lastName"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <Input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <Button type="submit" className="bg-sky-700 text-white">
            {loading ? <Spinner /> : "Sign Up"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
