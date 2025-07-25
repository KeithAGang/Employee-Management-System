import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "@tanstack/react-router"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import axios from "axios"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// Backend DTO for reset password request
interface ResetPasswordRequestDto {
  email: string;
  firstName: string;
  lastName: string;
  newPassword: string; // Matches C# NewPassword
}

// Backend DTO for response (just a message)
interface ResetPasswordResponseDto {
  message: string;
}

const API_BASE_URL = 'https://localhost:7026/api';

// Define the Zod schema for form validation
const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address.").min(1, "Email is required."),
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  newPassword: z.string().min(6, "New password must be at least 6 characters long."),
  confirmNewPassword: z.string().min(1, "Confirm new password is required."),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match.",
  path: ["confirmNewPassword"], // Apply error to confirmNewPassword field
});

// Infer the form data type from the schema
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const {
    mutate,
    isPending,
    isError,
    error,
  } = useMutation<ResetPasswordResponseDto, Error, ResetPasswordRequestDto>({
    mutationFn: async (credentials) => {
      // The backend route is /user/reset-password
      const response = await axios.post(`${API_BASE_URL}/user/reset-password`, credentials, {
        withCredentials: true, // If authentication is needed for this endpoint
      });
      return response.data;
    },
    onSuccess: () => {
      // On successful password reset, navigate to the login page.
      navigate({ to: '/auth/login' });
    },
    onError: (err) => {
      // Handle specific backend errors
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        if (err.response.data.message.includes("User not found")) {
          setError("email", { type: "manual", message: "User not found with provided details." });
        } else if (err.response.data.message.includes("UserDetailsException")) {
          setError("root.serverError", { type: "manual", message: err.response.data.message });
        } else {
          setError("root.serverError", { type: "manual", message: err.response.data.message });
        }
      } else if (err instanceof Error) {
        setError("root.serverError", { type: "manual", message: err.message });
      } else {
        setError("root.serverError", { type: "manual", message: "An unknown error occurred during password reset." });
      }
    },
  });

  // This function is called by react-hook-form's handleSubmit after client-side validation passes
  const onSubmit = (data: ResetPasswordFormData) => {
    mutate({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      newPassword: data.newPassword, // Only send newPassword, not confirmNewPassword
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Your Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">

                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email")}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="firstName">FirstName</Label>
                    <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        {...register("firstName")}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="lastName">LastName</Label>
                    <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        {...register("lastName")}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="newPassword">New Password</Label>
                  </div>
                  <Input
                    id="newPassword"
                    type="password"
                    {...register("newPassword")}
                  />
                  {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
                </div>
                 <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  </div>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    {...register("confirmNewPassword")}
                  />
                  {errors.confirmNewPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmNewPassword.message}</p>}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-black text-white"
                  disabled={isPending || isSubmitting}
                >
                  {isPending ? "Resetting Password..." : "Reset Password"}
                </Button>
                {errors.root?.serverError && (
                  <p className="text-red-500 text-sm text-center mt-2">
                    {errors.root.serverError.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
