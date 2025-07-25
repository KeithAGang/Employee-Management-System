// src/components/SalesRecordEditForm.tsx
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useEmployeeSalesRecords } from '@/hooks/useEmployeeSalesRecords'; // Changed from useSalesRecord
import { useUpdateSalesRecord } from '@/hooks/useUpdateSalesRecord';
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
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  customerName: z.string().min(1, "Customer name is required.").max(100, "Customer name too long.").optional().or(z.literal('')),
  productName: z.string().min(1, "Product name is required.").max(100, "Product name too long.").optional().or(z.literal('')),
  notes: z.string().max(500, "Notes cannot exceed 500 characters.").optional().or(z.literal('')),
});

type SalesRecordEditFormValues = z.infer<typeof formSchema>;

interface SalesRecordEditFormProps {
  salesRecordId: string;
}

export function SalesRecordEditForm({ salesRecordId }: SalesRecordEditFormProps) {
  // Fetch ALL sales records for the employee
  const { data: allSalesRecords, isLoading, isError, error } = useEmployeeSalesRecords();
  const { mutate: updateSalesRecord, isPending: isUpdating } = useUpdateSalesRecord();

  // Find the specific sales record from the fetched list
  const salesRecord = React.useMemo(() => {
    return allSalesRecords?.find(record => record.salesRecordId === salesRecordId);
  }, [allSalesRecords, salesRecordId]);

  const form = useForm<SalesRecordEditFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      productName: "",
      notes: "",
    },
    values: {
      customerName: salesRecord?.customerName || "",
      productName: salesRecord?.productName || "",
      notes: salesRecord?.notes || "",
    },
  });

  const onSubmit = (values: SalesRecordEditFormValues) => {
    const payload: Partial<SalesRecordEditFormValues> & { salesRecordId: string } = {
      salesRecordId: salesRecordId,
    };

    if (values.customerName !== (salesRecord?.customerName || "")) payload.customerName = values.customerName;
    if (values.productName !== (salesRecord?.productName || "")) payload.productName = values.productName;
    if (values.notes !== (salesRecord?.notes || "")) payload.notes = values.notes;

    if (Object.keys(payload).length === 1 && payload.salesRecordId) {
      console.log("No changes detected, not submitting.");
      return;
    }

    updateSalesRecord(payload);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-700 text-lg">Loading sales record...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center py-8 text-red-600">
        <p>Error loading sales record: {error?.message || "An unknown error occurred."}</p>
      </div>
    );
  }

  if (!salesRecord) {
    return (
      <p className="text-gray-600 text-center py-4">Sales record not found.</p>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">Edit Sales Record</CardTitle>
        <CardDescription className="text-gray-600">
          Modify details for Sales Record ID: <span className="font-mono text-xs">{salesRecord.salesRecordId}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Customer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any additional notes..." className="min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-4" />

            <div className="grid gap-3 text-gray-700 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">Sale Date:</span>
                <span>{formatDate(salesRecord.saleDate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Quantity:</span>
                <span>{salesRecord.quantity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Unit Price:</span>
                <span>${salesRecord.unitPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span className="font-bold text-green-600">${salesRecord.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
