import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordFormData, changePasswordSchema } from "../lib/inputValidation/registrationValidation";
import { changePassword } from "../api/auth/auth";

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: ChangePasswordFormData) => {
    const { email, password } = data;
    const { data: userData, error } = await changePassword({
      email,
      password,
    });
    console.log({ userData, error });
    if (error) {
      console.error("Error signing up:", error);
      return;
    }
    reset();
    navigate("/");
  };

  return (
    <main className="bg-[#fffefe]">
      <div className="max-w-screen-xl h-screen flex items-center mx-auto gap-8 pt-14">
        <div className="flex flex-col">
          <h1 className="text-7xl font-semibold bg-messenger-gradient bg-clip-text text-[transparent]">
            A place for meaningful conversations
          </h1>
          <p className="my-5 text-gray-600">
            Connect with your friends and family, build your community, and deepen your interests.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-2 max-w-md">
            <input
              className="bg-[#f4f5f4] text-black py-2 px-4 rounded-xl col-span-full outline-none border focus:border-[#0B7CFE]"
              placeholder="Email"
              {...register("email")}
            />
            <input
              className="bg-[#f4f5f4] text-black py-2 px-4 rounded-xl col-span-full outline-none border focus:border-[#0B7CFE]"
              placeholder="Password"
              {...register("password")}
              type="password"
            />
            <input
              className="bg-[#f4f5f4] text-black py-2 px-4 rounded-xl col-span-full outline-none border focus:border-[#0B7CFE]"
              placeholder="Confirm password"
              {...register("confirmPassword")}
              type="password"
            />
            <button type="submit" className="bg-[#0B7CFE] mt-4 text-white w-fit rounded-full py-2 px-4 font-bold">
              Change Password
            </button>
          </form>
        </div>
        <img className="w-1/2" src="/login_hero.png" alt="login hero" />
      </div>
    </main>
  );
}
