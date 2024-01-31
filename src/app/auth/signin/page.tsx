"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/spinner";

interface SigninFields {
  email: string;
  password: string;
}
const SignIn = () => {
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<SigninFields>({
    email: "",
    password: "",
  });

  if (session.status === "authenticated") {
    router.push("/");
    return;
  }

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
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      callbackUrl: "/",
    });

    if (res?.error) {
      console.log(res.error);
    } else {
      router.push("/");
    }
  }

  return (
    <>
      <div className=" flex flex-col  w-full min-h-screen  justify-center items-center bg-white  ">
        <div className="h-full lg:w-[350px] md:w-[350px] border border-zinc-800 p-5 rounded-md flex-col  sm:px-4 md:px-4 flex my-auto w-full px-4 gap-4">
          <h1 className="text-2xl font-bold ">Sign in</h1>
          <h2>
            {"Don't"} Have an Acount yet?{" "}
            <Link href="/auth/signup" className="underline">
              Sign up
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
            <label htmlFor="password">Password</label>
            <Input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />

            <Button type="submit" className="bg-sky-700 text-white">
            {loading ? <Spinner /> : "Sign Up"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
