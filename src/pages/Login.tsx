import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema, RegisterFormData } from "../lib/inputValidation/registrationValidation";
// import { login } from "../api/auth/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const onSubmit = async (data: RegisterFormData) => {
    const { email, password } = data;
    const userData = await login({
      email,
      password,
    });
    if (!userData) {
      console.error("Login failed");
      return;
    }
    reset();
    navigate(userData.lastConversationId ? `/conversation/${userData.lastConversationId}` : "/conversation");
  };

  return (
    <main className="bg-[#fffefe]">
      <div className="max-w-screen-xl p-4 h-screen flex items-center mx-auto gap-8 pt-14">
        <div className="flex flex-col">
          <h1 className="text-7xl font-semibold bg-messenger-gradient bg-clip-text text-primary">
            A place for meaningful conversations
          </h1>
          <p className="my-5 text-gray-600">
            Connect with your friends and family, build your community, and deepen your interests.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 max-w-md">
            <input
              className="bg-[#f4f5f4] text-black py-2 px-4 rounded-xl col-span-full outline-none border focus:border-[#0B7CFE]"
              placeholder="Email"
              {...register("email")}
            />
            <input
              className="bg-[#f4f5f4] text-black py-2 px-4 rounded-xl col-span-full outline-none border focus:border-[#0B7CFE]"
              placeholder="Password"
              type="password"
              {...register("password")}
            />
            <Button
              type="submit"
              className="!bg-[#0B7CFE] mt-4 text-white w-fit h-fit rounded-full py-2 px-4 font-semibold text-lg cursor-pointer">
              Log in
            </Button>
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
