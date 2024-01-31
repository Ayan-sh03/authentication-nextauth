import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <h1 className="text-5xl">Public Home Page</h1>
      <div className="text-4xl white underline m-6 flex flex-col gap-3 ">
        <Link href="/auth/signup" className="text-white">Sign Up!</Link>
        <Link href="/auth/signin" className="text-white">Sign In!</Link>
        <Link href="api/auth/signout" className="text-red-400">Sign Out!</Link>
      </div>
    </div>
  );
}
