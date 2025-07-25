import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define Zod schema for login form validation
const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address.")
    .min(1, "Email is required."),
  password: z.string().min(1, "Password is required."),
});

// Infer form data type from schema
type LoginFormData = z.infer<typeof loginSchema>;

interface LoginResponseDto {
  fullName: string;
  email: string;
  role: string;
}

const API_BASE_URL = "https://localhost:7026/api";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError, // setError is now correctly destructured from useForm
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema), // Use Zod for validation
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending, isError, error } = useMutation<
    LoginResponseDto,
    Error,
    LoginFormData
  >({
    mutationFn: async (credentials) => {
      const response = await axios.post(
        `${API_BASE_URL}/user/login`,
        credentials,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.fullName, data.email, data.role);

      setTimeout(() => {
        if (data.role === "Manager") {
          setTimeout(() => {
            navigate({ to: "/manager" });
          }, 900);
        } else if (data.role === "Employee") {
          setTimeout(() => {
            navigate({ to: "/employee" });
          }, 900);
        } else {
          setTimeout(() => {
            navigate({ to: "/" });
          }, 900);
        }
      }, 900);
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const message = err.response?.data?.message;

        if (status === 401) {
          setError("root.serverError", {
            type: "manual",
            message: "Invalid credentials. Please try again.",
          });
        } else if (status === 403) {
          setError("root.serverError", {
            type: "manual",
            message: "Access denied. You do not have permission.",
          });
        } else if (message) {
          // Use the message from the backend if available
          setError("root.serverError", { type: "manual", message });
        } else if (status === 500) {
          setError("root.serverError", {
            type: "manual",
            message: "Server error. Please try again later.",
          });
        } else if (status) {
          // Fallback for other HTTP statuses
          setError("root.serverError", {
            type: "manual",
            message: `Request failed with status ${status}.`,
          });
        } else {
          // Network error or no response
          setError("root.serverError", {
            type: "manual",
            message:
              err.message || "Network error. Please check your connection.",
          });
        }
      } else if (err instanceof Error) {
        // Generic JavaScript error
        setError("root.serverError", { type: "manual", message: err.message });
      } else {
        // Catch-all for unknown errors
        setError("root.serverError", {
          type: "manual",
          message: "An unknown error occurred during login.",
        });
      }
    },
  });

  // onSubmit function for react-hook-form
  const onSubmit = (data: LoginFormData) => {
    mutate({ email: data.email, password: data.password });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
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
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/auth/passreset"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-black text-white"
                  disabled={isPending || isSubmitting} // Disable during submission or pending mutation
                >
                  {isPending ? "Logging in..." : "Login"}
                </Button>
                {errors.root?.serverError && (
                  <p className="text-red-500 text-sm text-center mt-2">
                    {errors.root.serverError.message}
                  </p>
                )}
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  to="/auth/signup"
                  className="decoration-1 underline hover:cursor-pointer"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
