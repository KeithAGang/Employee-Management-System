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
import { useAuthStore } from "@/store/authStore"

interface LoginRequestDto {
  email: string;
  password: string;
}

interface LoginResponseDto {
  fullName: string;
  role: string;
}

const API_BASE_URL = 'https://localhost:7026/api';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    mutate,
    isPending,
    isError,
    error,
  } = useMutation<LoginResponseDto, Error, LoginRequestDto>({
    mutationFn: async (credentials) => {
      const response = await axios.post(`${API_BASE_URL}/user/login`, credentials, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(
        data.fullName, // First argument: fullName
        data.role      // Second argument: role
      );

      if (data.role === 'Manager') {
      //   navigate({ to: '/manager/overview' });
      // } else if (data.role === 'Employee') {
      //   navigate({ to: '/employee/overview' });
        setTimeout(() => {
        navigate({ to: '/manager' });
      }, 900)

      } else {
        setTimeout(() => {
        navigate({ to: '/' });
      }, 900)
      }
    },
    onError: (err) => {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        throw new Error(err.response.data.message);
      } else if (err instanceof Error) {
        throw err;
      } else {
        throw new Error('An unknown error occurred during login.');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
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
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-black text-white"
                  disabled={isPending}
                >
                  {isPending ? "Logging in..." : "Login"}
                </Button>
                {isError && (
                  <p className="text-red-500 text-sm text-center mt-2">
                    {error?.message || "Login failed. Please try again."}
                  </p>
                )}
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/auth/signup" className="decoration-1 underline hover:cursor-pointer">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
