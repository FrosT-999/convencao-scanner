import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export const CompanyResultSkeleton = () => {
  return (
    <Card className="w-full max-w-4xl shadow-strong animate-pulse">
      <CardHeader className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Dados básicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-full" />
            </div>
          ))}
        </div>

        <Separator />

        {/* Endereço */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        </div>

        <Separator />

        {/* CNAE */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>

        <Separator />

        {/* Sócios */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-28" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>

        <Separator />

        {/* Botões */}
        <div className="flex flex-wrap gap-3 pt-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-28" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
