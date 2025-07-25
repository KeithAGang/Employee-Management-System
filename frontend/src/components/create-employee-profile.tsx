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
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import axios from "axios"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

interface CreateEmployeeProfileRequestDto {
  position: string;
  jobTitle: string;
  dateHired: string; // Sending as string (ISO format)
  managerEmail: string;
}

interface CreateEmployeeProfileResponseDto {
  message: string;
}

const API_BASE_URL = 'https://localhost:7026/api';

// Define the Zod schema for form validation for employee profile creation
const createEmployeeProfileSchema = z.object({
  position: z.string().min(1, "Position is required."),
  jobTitle: z.string().min(1, "Job Title is required."),
  dateHired: z.string().min(1, "Date Hired is required.").refine((val) => !isNaN(new Date(val).getTime()), "Invalid date format."), // Basic date validation
  managerEmail: z.string().email("Invalid manager email address.").min(1, "Manager email is required."),
});

type CreateEmployeeProfileFormData = z.infer<typeof createEmployeeProfileSchema>;

export function CreateEmployeeProfileForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CreateEmployeeProfileFormData>({
    resolver: zodResolver(createEmployeeProfileSchema),
    defaultValues: {
      position: "",
      jobTitle: "",
      dateHired: "",
      managerEmail: "",
    },
  });

  const {
    mutate,
    isPending,
  } = useMutation<CreateEmployeeProfileResponseDto, Error, CreateEmployeeProfileRequestDto>({
    mutationFn: async (credentials) => {
      const response = await axios.post(`${API_BASE_URL}/employee/create-profile`, credentials, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      setTimeout(() => {
        navigate({ to: '/' });
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
        } else if (message?.includes("User not found")) {
          setError("root.serverError", { type: "manual", message: "Authenticated user not found." });
        } else if (message?.includes("Manager not found")) {
          setError("managerEmail", { type: "manual", message: "Manager email not found or invalid." });
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
        setError("root.serverError", { type: "manual", message: "An unknown error occurred during profile creation." });
      }
    },
  });

  const onSubmit = (data: CreateEmployeeProfileFormData) => {
    mutate({
      position: data.position,
      jobTitle: data.jobTitle,
      dateHired: data.dateHired,
      managerEmail: data.managerEmail,
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create Employee Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">

                <div className="grid gap-3">
                    <Label htmlFor="position">Position</Label>
                    <Input
                        id="position"
                        type="text"
                        placeholder="Software Engineer"
                        {...register("position")}
                    />
                    {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>}
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                        id="jobTitle"
                        type="text"
                        placeholder="Frontend Developer"
                        {...register("jobTitle")}
                    />
                    {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle.message}</p>}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="dateHired">Date Hired</Label>
                  <Input
                    id="dateHired"
                    type="date" // Use type="date" for date input
                    {...register("dateHired")}
                  />
                  {errors.dateHired && <p className="text-red-500 text-xs mt-1">{errors.dateHired.message}</p>}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="managerEmail">Manager Email</Label>
                  <Input
                    id="managerEmail"
                    type="email"
                    placeholder="manager@example.com"
                    {...register("managerEmail")}
                  />
                  {errors.managerEmail && <p className="text-red-500 text-xs mt-1">{errors.managerEmail.message}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black text-white"
                  disabled={isPending || isSubmitting}
                >
                  {isPending ? "Creating Profile..." : "Create Profile"}
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
