// src/components/EmployeeProfileForm.tsx
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useEmployeeProfile } from '@/hooks/useEmployeeProfile';
import { useUpdateEmployeeProfile } from "@/hooks/useUpdateEmployeeProfile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required.").max(50, "First name too long.").optional().or(z.literal('')),
  lastName: z.string().min(1, "Last name is required.").max(50, "Last name too long.").optional().or(z.literal('')),
  position: z.string().max(100, "Position too long.").optional().or(z.literal('')),
  jobTitle: z.string().max(100, "Job title too long.").optional().or(z.literal('')),
});

type EmployeeProfileFormValues = z.infer<typeof formSchema>;

export function EmployeeProfileForm() {
  const { data: employeeProfile, isLoading, isError, error } = useEmployeeProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateEmployeeProfile();

  // Derive firstName and lastName from fullName for form initialization
  const initialFirstName = employeeProfile?.fullName?.split(' ')[0] || "";
  const initialLastName = employeeProfile?.fullName?.split(' ').slice(1).join(' ') || "";

  const form = useForm<EmployeeProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      position: "",
      jobTitle: "",
    },
    values: {
      firstName: initialFirstName,
      lastName: initialLastName,
      position: employeeProfile?.position || "",
      jobTitle: employeeProfile?.jobTitle || "",
    },
  });

  const onSubmit = (values: EmployeeProfileFormValues) => {
    const payload: Partial<EmployeeProfileFormValues> = {};

    // Compare current form values with initial values derived from employeeProfile
    if (values.firstName !== initialFirstName) payload.firstName = values.firstName;
    if (values.lastName !== initialLastName) payload.lastName = values.lastName;
    if (values.position !== (employeeProfile?.position || "")) payload.position = values.position;
    if (values.jobTitle !== (employeeProfile?.jobTitle || "")) payload.jobTitle = values.jobTitle;

    if (Object.keys(payload).length === 0) {
      console.log("No changes detected, not submitting.");
      return;
    }

    updateProfile(payload);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-700 text-lg">Loading profile data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center py-8 text-red-600">
        <p>Error loading profile: {error?.message || "An unknown error occurred."}</p>
      </div>
    );
  }

  if (!employeeProfile) {
    return (
      <p className="text-gray-600 text-center py-4">No employee profile data available.</p>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-2 bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">Update My Profile</CardTitle>
        <CardDescription className="text-gray-600">
          Update your personal and professional details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="Your position" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Your job title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-4" />

            <div className="grid gap-3 text-gray-700 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">Email:</span>
                <span>{employeeProfile.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Date Hired:</span>
                <span>{new Date(employeeProfile.dateHired).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Manager:</span>
                <span>{employeeProfile.managerName || 'N/A'}</span>
              </div>
              {employeeProfile.managerEmail && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Manager Email:</span>
                  <span>{employeeProfile.managerEmail}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="font-medium">Leave Days Taken:</span>
                <span>{employeeProfile.leaveDaysTaken}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Leave Days:</span>
                <span>{employeeProfile.totalLeaveDays}</span>
              </div>
            </div>

            <Button type="submit" className="w-full bg-black text-white hover:bg-blue-700" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
