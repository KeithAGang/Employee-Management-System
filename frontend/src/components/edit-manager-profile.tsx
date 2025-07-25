import * as React from "react"
import { useState, useEffect } from "react"
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import axios from "axios"
import { Separator } from "@/components/ui/separator"

import type { ManagerProfileDto, UpdateManagerProfileDto } from '@/types/dtos'

const API_BASE_URL = 'https://localhost:7026/api';

const updateManagerProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required.").optional(),
  lastName: z.string().min(1, "Last name is required.").optional(),
  department: z.string().min(1, "Department is required.").optional(),
  officeLocation: z.string().optional(),
});

type UpdateManagerProfileFormData = z.infer<typeof updateManagerProfileSchema>;

export function EditManagerProfileForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Get manager profile data from cache
  const cachedManagerProfile = queryClient.getQueryData<ManagerProfileDto>(['managerProfile']);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<UpdateManagerProfileFormData>({
    resolver: zodResolver(updateManagerProfileSchema),
    defaultValues: {
      firstName: cachedManagerProfile?.firstName || "",
      lastName: cachedManagerProfile?.lastName || "",
      department: cachedManagerProfile?.department || "",
      officeLocation: cachedManagerProfile?.officeLocation || "",
    },
  });

  useEffect(() => {
    if (cachedManagerProfile) {
      reset({
        firstName: cachedManagerProfile.firstName,
        lastName: cachedManagerProfile.lastName,
        department: cachedManagerProfile.department,
        officeLocation: cachedManagerProfile.officeLocation || "",
      });
    }
  }, [cachedManagerProfile, isEditing, reset]);

  const {
    mutate,
    isPending,
  } = useMutation<UpdateManagerProfileDto, Error, UpdateManagerProfileDto>({
    mutationFn: async (updateData) => {
      const response = await axios.put<UpdateManagerProfileDto>(
        `${API_BASE_URL}/manager/update-profile`,
        updateData,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managerProfile'] });
      setIsEditing(false);
    },
    onError: (err) => {
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        const message = err.response.data?.message;

        if (status === 401) {
          setError("root.serverError", { type: "manual", message: "Unauthorized. Please log in again." });
        } else if (message) {
          setError("root.serverError", { type: "manual", message });
        } else if (status) {
          setError("root.serverError", { type: "manual", message: `Request failed with status ${status}.` });
        } else {
          setError("root.serverError", { type: "manual", message: err.message || "Network error. Please check your connection." });
        }
      } else if (err instanceof Error) {
        setError("root.serverError", { type: "manual", message: err.message });
      } else {
        setError("root.serverError", { type: "manual", message: "An unknown error occurred during update." });
      }
    },
  });

  const onSubmit = (data: UpdateManagerProfileFormData) => {
    mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      department: data.department,
      officeLocation: data.officeLocation,
    });
  };

  // Check if managerProfile data is available in cache
  if (!cachedManagerProfile) {
    return (
      <div className="flex justify-center items-center h-full bg-white rounded-lg shadow-xl p-8 text-gray-700">
        <p className="text-gray-600 text-center py-4">Manager profile data not found in cache. Please ensure you have viewed the Manager Overview page first, or refresh the page.</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800">Edit My Profile</CardTitle>
          <Button
            onClick={() => {
              setIsEditing(!isEditing);
              if (isEditing) {
                reset({
                  firstName: cachedManagerProfile.firstName,
                  lastName: cachedManagerProfile.lastName,
                  department: cachedManagerProfile.department,
                  officeLocation: cachedManagerProfile.officeLocation || "",
                });
              }
            }}
            variant="outline"
            className="bg-black text-white hover:bg-gray-800 hover:text-white transition-colors"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 text-gray-700 text-base sm:text-lg">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" {...register("firstName")} />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...register("lastName")} />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" {...register("department")} />
                  {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="officeLocation">Office Location (Optional)</Label>
                  <Input id="officeLocation" {...register("officeLocation")} />
                  {errors.officeLocation && <p className="text-red-500 text-xs mt-1">{errors.officeLocation.message}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black text-white mt-4"
                  disabled={isPending || isSubmitting}
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
                {errors.root?.serverError && (
                  <p className="text-red-500 text-sm text-center mt-2">
                    {errors.root.serverError.message}
                  </p>
                )}
              </div>
            </form>
          ) : (
            <div className="grid gap-4 text-gray-700 text-base sm:text-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <span className="font-medium">First Name:</span>
                <span>{cachedManagerProfile.firstName}</span>
              </div>
              <Separator className="bg-gray-200" />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <span className="font-medium">Last Name:</span>
                <span>{cachedManagerProfile.lastName}</span>
              </div>
              <Separator className="bg-gray-200" />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <span className="font-medium">Email:</span>
                <span>{cachedManagerProfile.email}</span>
              </div>
              <Separator className="bg-gray-200" />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <span className="font-medium">Department:</span>
                <span>{cachedManagerProfile.department}</span>
              </div>
              <Separator className="bg-gray-200" />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <span className="font-medium">Office Location:</span>
                <span>{cachedManagerProfile.officeLocation || 'N/A'}</span>
              </div>
              <Separator className="bg-gray-200" />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <span className="font-medium">Status:</span>
                <span>{cachedManagerProfile.isActive ? "Active" : "Inactive"}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
