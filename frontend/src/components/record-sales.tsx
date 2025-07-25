// src/components/RecordSalesForm.tsx
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useRecordSales } from '@/hooks/useRecordSales';
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
  customerName: z.string().min(1, "Customer name is required.").max(100, "Customer name too long."),
  productName: z.string().min(1, "Product name is required.").max(100, "Product name too long."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1.").int("Quantity must be an integer."),
  unitPrice: z.coerce.number().min(0.01, "Unit price must be positive."),
  saleDate: z.string().min(1, "Sale date is required.").refine(val => !isNaN(new Date(val).getTime()), "Invalid sale date."),
  notes: z.string().max(500, "Notes cannot exceed 500 characters.").optional().or(z.literal('')),
});

type RecordSalesFormValues = z.infer<typeof formSchema>;

export function RecordSalesForm() {
  const { mutate: recordSales, isPending: isSubmitting } = useRecordSales();

  const form = useForm<z.input<typeof formSchema>, any, RecordSalesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      productName: "",
      quantity: 1,
      unitPrice: 0.01,
      saleDate: new Date().toISOString().split('T')[0],
      notes: "",
    },
  });

  const onSubmit = (values: RecordSalesFormValues) => {
    const amount = values.quantity * values.unitPrice;
    const payload = {
      ...values,
      amount: parseFloat(amount.toFixed(2)),
    };
    recordSales(payload, {
      onSuccess: () => {
        form.reset({
          customerName: "",
          productName: "",
          quantity: 1,
          unitPrice: 0.01,
          saleDate: new Date().toISOString().split('T')[0],
          notes: "",
        });
      }
    });
  };

  const quantity = Number(form.watch("quantity")) || 0;
  const unitPrice = Number(form.watch("unitPrice")) || 0;
  const calculatedAmount = quantity * unitPrice;

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">Record New Sale</CardTitle>
        <CardDescription className="text-gray-600">
          Enter the details for a new sales record.
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
                    <Input placeholder="e.g., John Doe" {...field} />
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
                    <Input placeholder="e.g., Laptop Pro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value === undefined || field.value === null ? '' : Number(field.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value === undefined || field.value === null ? '' : Number(field.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormItem>
              <FormLabel>Calculated Amount</FormLabel>
              <FormControl>
                <Input type="text" value={`$${calculatedAmount.toFixed(2)}`} readOnly className="font-bold bg-gray-50" />
              </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name="saleDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sale Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes about the sale..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700" disabled={isSubmitting}>
              {isSubmitting ? "Recording..." : "Record Sale"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}