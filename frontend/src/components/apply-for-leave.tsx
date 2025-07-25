import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useApplyForLeave } from '@/hooks/useApplyForLeave';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  startDate: z.string().min(1, "Start date is required.").refine(val => !isNaN(new Date(val).getTime()), "Invalid start date."),
  endDate: z.string().min(1, "End date is required.").refine(val => !isNaN(new Date(val).getTime()), "Invalid end date."),
  reason: z.string().min(10, "Reason must be at least 10 characters.").max(500, "Reason cannot exceed 500 characters."),
}).refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
  message: "End date cannot be before start date.",
  path: ["endDate"],
});

type ApplyForLeaveFormValues = z.infer<typeof formSchema>;

export function ApplyForLeaveForm() {
  const { mutate: applyForLeave, isPending: isSubmitting } = useApplyForLeave();

  const form = useForm<ApplyForLeaveFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      reason: "",
    },
  });

  const onSubmit = (values: ApplyForLeaveFormValues) => {
    applyForLeave(values, {
      onSuccess: () => {
        form.reset();
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6 bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">Apply for Leave</CardTitle>
        <CardDescription className="text-gray-600">
          Submit your leave application details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Leave</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide a detailed reason for your leave..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-black text-white hover:bg-blue-700" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
