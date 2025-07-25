import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSubordinateSalesRecords } from '@/hooks/useSubordinateSalesRecords';

export function SubordinateSalesRecordsCards() {
  const { data: salesRecords, isLoading, isError, error } = useSubordinateSalesRecords();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <p className="text-gray-700 text-lg">Loading sales records...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center py-4 text-red-600">
        <p>Error loading sales records: {error?.message || "An unknown error occurred."}</p>
      </div>
    );
  }

  if (!salesRecords || salesRecords.length === 0) {
    return (
      <p className="text-gray-600 text-center py-4">No sales records found for your subordinates.</p>
    );
  }

  return (
    <div className="flex w-full justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {salesRecords.map((record) => (
          <Card key={record.salesRecordId} className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-800">
                Sale by {record.subordinateName}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Customer: {record.customerName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Separator className="bg-gray-200" />
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Sale Date:</span>
                <span className="text-gray-900">{formatDate(record.saleDate)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Quantity:</span>
                <span className="text-gray-900">{record.quantity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Unit Price:</span>
                <span className="text-gray-900">${record.unitPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-gray-700">Total Amount:</span>
                <span className="text-green-600">${record.totalAmount.toFixed(2)}</span>
              </div>
              {record.notes && (
                <>
                  <Separator className="bg-gray-200" />
                  <div>
                    <span className="font-medium text-gray-700">Notes:</span>
                    <p className="mt-1 text-gray-900">{record.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
