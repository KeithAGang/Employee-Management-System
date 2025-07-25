import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUnpromotedManagers } from '@/hooks/useUnpromotedManagers';
import { usePromoteManager } from '@/hooks/usePromoteManager';

export function UnpromotedManagersList() {
  const { data: unpromotedManagers, isLoading, isError, error } = useUnpromotedManagers();
  const { mutate: promoteManager, isPending: isPromoting } = usePromoteManager();

  const handlePromote = (email: string) => {
    if (confirm(`Are you sure you want to promote manager ${email}?`)) {
      promoteManager({ email });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-700 text-lg">Loading unpromoted managers...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center py-8 text-red-600">
        <p>Error loading unpromoted managers: {error?.message}</p>
      </div>
    );
  }

  if (!unpromotedManagers || unpromotedManagers.length === 0) {
    return (
      <p className="text-gray-600 text-center py-4">No unpromoted managers found.</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {unpromotedManagers.map((manager) => (
          <Card key={manager.email} className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                {manager.firstName} {manager.lastName}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {manager.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Department:</span>
                <span className="text-gray-900">{manager.department}</span>
              </div>
              <Separator className="bg-gray-200" />
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Office Location:</span>
                <span className="text-gray-900">{manager.officeLocation || 'N/A'}</span>
              </div>
              <Separator className="bg-gray-200" />
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Status:</span>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                  {manager.isActive ? "Active" : "Unpromoted"}
                </span>
              </div>
              <Button
                onClick={() => handlePromote(manager.email)}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 mt-4"
                disabled={isPromoting}
              >
                {isPromoting ? "Promoting..." : "Promote Manager"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
