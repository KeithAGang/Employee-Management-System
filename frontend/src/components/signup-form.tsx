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
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import axios from "axios"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// Backend DTO for registration request
interface RegisterRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Updated: Backend DTO for registration response, matching the actual backend output
interface RegisterResponseDto {
  message: string; // The backend only returns a message
}

const API_BASE_URL = 'https://localhost:7026/api';

// Define the Zod schema for form validation
const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Invalid email address.").min(1, "Email is required."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
  passwordConfirm: z.string().min(1, "Confirm password is required."),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords do not match.",
  path: ["passwordConfirm"],
});

// Infer the form data type from the schema
type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const {
    mutate,
    isPending,
    isError,
    error,
  } = useMutation<RegisterResponseDto, Error, RegisterRequestDto>({
    mutationFn: async (credentials) => {
      const response = await axios.post(`${API_BASE_URL}/user/register`, credentials, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      setTimeout(() => {
        navigate({ to: '/auth/login' });
      }, 900)
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const message = err.response?.data?.message;

        if (status === 401) {
          setError("root.serverError", { type: "manual", message: "Unauthorized. Please log in." });
        } else if (status === 403) {
          setError("root.serverError", { type: "manual", message: "You do not have permission to perform this action." });
        } else if (message?.includes("email already exists")) {
          setError("email", { type: "manual", message: "This email is already registered." });
        } else if (message) {
          setError("root.serverError", { type: "manual", message });
        } else if (status === 500) {
          setError("root.serverError", { type: "manual", message: "Server error. Please try again later." });
        } else if (status) {
          setError("root.serverError", { type: "manual", message: `Request failed with status ${status}.` });
        } else {
          setError("root.serverError", { type: "manual", message: err.message });
        }
      } else if (err instanceof Error) {
        setError("root.serverError", { type: "manual", message: err.message });
      } else {
        setError("root.serverError", { type: "manual", message: "An unknown error occurred during registration." });
      }
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome !</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">

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
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
                 <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="passwordConfirm">Confirm Password</Label>
                  </div>
                  <Input
                    id="passwordConfirm"
                    type="password"
                    {...register("passwordConfirm")}
                  />
                  {errors.passwordConfirm && <p className="text-red-500 text-xs mt-1">{errors.passwordConfirm.message}</p>}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-black text-white"
                  disabled={isPending || isSubmitting}
                >
                  {isPending ? "Signing up..." : "Signup"}
                </Button>
                {errors.root?.serverError && (
                  <p className="text-red-500 text-sm text-center mt-2">
                    {errors.root.serverError.message}
                  </p>
                )}
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/auth/login" className="decoration-1 hover:cursor-pointer">Login</Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
