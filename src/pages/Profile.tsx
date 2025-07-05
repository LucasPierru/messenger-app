import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { fetchProfile } from "@/api/profile/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProfileFormData, profileSchema } from "@/lib/inputValidation/profileValidation";
import { useAuthStore } from "@/store/useAuthStore";

export interface IProfileProps {}

export default function Profile(props: IProfileProps) {
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const { updateProfile } = useAuthStore();
  const { data, isLoading } = profileQuery;
  const { profile } = data || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        bio: profile.bio || "",
        birthday: profile.birthday,
        phoneNumber: profile.phoneNumber || "",
        location: profile.location || "",
        status: profile.status || "",
        gender: profile.gender,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (profileForm: ProfileFormData) => {
    const { firstName, lastName, bio, birthday, phoneNumber, location, status, gender } = profileForm;
    const { error } = await updateProfile({
      firstName,
      lastName,
      bio,
      birthday,
      phoneNumber,
      location,
      status,
      gender,
    });
    if (error) {
      console.error("Login failed");
      return;
    }
    reset();
  };

  /* if (isLoading) {
    return (
      <div className="flex flex-col items-center max-w-7xl mx-auto max-h-screen py-8">
        <LoaderCircleIcon className="animate-spin w-24 h-24" />
      </div>
    );
  } */

  return (
    <main className="flex flex-col items-center max-w-7xl mx-auto max-h-screen py-8">
      <Avatar className="w-24 h-24">
        <AvatarImage src="/Punks.jpg" />
        <AvatarFallback className="text-3xl">
          {profile?.firstName[0]}
          {profile?.lastName[0]}
        </AvatarFallback>
      </Avatar>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 mt-4 max-w-md w-full">
        <Input {...register("firstName")} placeholder="e.g. John" />
        <Input {...register("lastName")} placeholder="e.g. Doe" />
        <Input {...register("status")} className="col-span-2" placeholder="Tell us how you're feeling..." />
        <Textarea
          {...register("bio")}
          placeholder="Tell us a bit about yourself..."
          className="col-span-2 resize-none"
        />
        <Button className="col-span-2" variant="default">
          Save
        </Button>
      </form>
    </main>
  );
}
