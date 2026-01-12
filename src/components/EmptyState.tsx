import { LucideIcon, SearchX, WifiOff, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type EmptyStateType = "not-found" | "offline" | "error";

interface EmptyStateProps {
  type: EmptyStateType;
  onRetry?: () => void;
  message?: string;
}

const stateConfig: Record<EmptyStateType, { icon: LucideIcon; title: string; description: string; iconClass: string }> = {
  "not-found": {
    icon: SearchX,
    title: "CNPJ não encontrado",
    description: "Verifique se o número está correto e tente novamente.",
    iconClass: "text-warning"
  },
  "offline": {
    icon: WifiOff,
    title: "Sem conexão",
    description: "Verifique sua internet e tente novamente.",
    iconClass: "text-destructive"
  },
  "error": {
    icon: AlertCircle,
    title: "Erro na consulta",
    description: "Ocorreu um erro ao buscar os dados. Tente novamente.",
    iconClass: "text-destructive"
  }
};

export const EmptyState = ({ type, onRetry, message }: EmptyStateProps) => {
  const config = stateConfig[type];
  const Icon = config.icon;

  return (
    <Card className="w-full max-w-md mx-auto shadow-card">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className={`p-4 rounded-full bg-muted mb-4`}>
          <Icon className={`h-12 w-12 ${config.iconClass}`} />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {config.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          {message || config.description}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Tentar novamente
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
