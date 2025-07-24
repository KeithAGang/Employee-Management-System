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

// Backend DTO for creating manager profile request
interface CreateManagerProfileRequestDto {
  officeLocation?: string; // Optional string
  department: string;
}

// Backend DTO for response (just a message)
interface CreateManagerProfileResponseDto {
  message: string;
}

const API_BASE_URL = 'https://localhost:7026/api';

// Define the Zod schema for form validation for manager profile creation
const createManagerProfileSchema = z.object({
  department: z.string().min(1, "Department is required."),
  officeLocation: z.string().optional(),
});

// Infer the form data type from the schema
type CreateManagerProfileFormData = z.infer<typeof createManagerProfileSchema>;

export function CreateManagerProfileForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CreateManagerProfileFormData>({
    resolver: zodResolver(createManagerProfileSchema),
    defaultValues: {
      department: "",
      officeLocation: "",
    },
  });

  const {
    mutate,
    isPending,
    isError,
    error,
  } = useMutation<CreateManagerProfileResponseDto, Error, CreateManagerProfileRequestDto>({
    mutationFn: async (credentials) => {
      // The backend route is /manager/create-profile
      const response = await axios.post(`${API_BASE_URL}/manager/create-profile`, credentials, {
        withCredentials: true, // Sends the JWT cookie for user ID
      });
      return response.data;
    },
    onSuccess: () => {
      // On successful profile creation, navigate to the root after a delay
      setTimeout(() => {
        navigate({ to: '/' });
      }, 900);
    },
    onError: (err) => {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        if (err.response.data.message.includes("User not found")) {
          setError("root.serverError", { type: "manual", message: "Authenticated user not found." });
        } else {
          setError("root.serverError", { type: "manual", message: err.response.data.message });
        }
      } else if (err instanceof Error) {
        setError("root.serverError", { type: "manual", message: err.message });
      } else {
        setError("root.serverError", { type: "manual", message: "An unknown error occurred during profile creation." });
      }
    },
  });

  // This function is called by react-hook-form's handleSubmit after client-side validation passes
  const onSubmit = (data: CreateManagerProfileFormData) => {
    mutate({
      department: data.department,
      officeLocation: data.officeLocation || undefined,
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create Manager Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">

                <div className="grid gap-3">
                    <Label htmlFor="department">Department</Label>
                    <Input
                        id="department"
                        type="text"
                        placeholder="Human Resources"
                        {...register("department")}
                    />
                    {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="officeLocation">Office Location (Optional)</Label>
                    <Input
                        id="officeLocation"
                        type="text"
                        placeholder="Building A, Floor 3"
                        {...register("officeLocation")}
                    />
                    {errors.officeLocation && <p className="text-red-500 text-xs mt-1">{errors.officeLocation.message}</p>}
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
