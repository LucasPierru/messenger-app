import { FormEvent } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const onSubmit = (formData: FormEvent<HTMLFormElement>) => {};

  return (
    <main className="bg-[#fffefe]">
      <div className="max-w-screen-xl h-screen flex items-center mx-auto gap-8 pt-14">
        <div className="flex flex-col">
          <h1 className="text-7xl font-semibold bg-messenger-gradient bg-clip-text text-[transparent]">
            A place for meaningful conversations
          </h1>
          <p className="my-5 text-gray-600">
            Connect with your friends and family, build your community, and
            deepen your interests.
          </p>
          <form onSubmit={onSubmit} className="flex flex-col gap-2 max-w-md">
            <input
              className="bg-[#f4f5f4] py-2 px-4 rounded-xl outline-none border focus:border-[#0B7CFE]"
              placeholder="Email"
            />
            <input
              className="bg-[#f4f5f4] py-2 px-4 rounded-xl outline-none border focus:border-[#0B7CFE]"
              placeholder="Password"
            />
            <button
              type="submit"
              className="bg-[#0B7CFE] mt-4 text-white w-fit rounded-full py-2 px-4 font-bold"
            >
              Log in
            </button>
          </form>
          <span className="mt-4 text-gray-600">
            Don&apos;t have an account?&nbsp;
            <Link to="/register" className="text-[#0B7CFE]">
              Sign up
            </Link>
          </span>
        </div>

        <img className="w-1/2" src="/login_hero.png" alt="login hero" />
      </div>
    </main>
  );
}
