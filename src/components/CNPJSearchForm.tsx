import { useState } from "react";
import { Search, Loader2, ClipboardPaste, Wifi, WifiOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const cnpjSchema = z.string()
  .trim()
  .nonempty({ message: "CNPJ não pode estar vazio" })
  .refine((val) => {
    const cleaned = val.replace(/\D/g, '');
    return cleaned.length === 14;
  }, { message: "CNPJ deve conter 14 dígitos" });

interface CNPJSearchFormProps {
  onSearch: (cnpj: string) => Promise<void>;
  isLoading: boolean;
}

export const CNPJSearchForm = ({ onSearch, isLoading }: CNPJSearchFormProps) => {
  const [cnpj, setCnpj] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  // Monitor online status
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
  }

  const formatCNPJ = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 14);
    
    if (limited.length <= 2) return limited;
    if (limited.length <= 5) return `${limited.slice(0, 2)}.${limited.slice(2)}`;
    if (limited.length <= 8) return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5)}`;
    if (limited.length <= 12) return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8)}`;
    return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8, 12)}-${limited.slice(12)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setCnpj(formatted);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const formatted = formatCNPJ(text);
      setCnpj(formatted);
      toast({
        title: "📋 CNPJ colado",
        description: "CNPJ copiado da área de transferência",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao colar",
        description: "Não foi possível acessar a área de transferência",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOnline) {
      toast({
        variant: "destructive",
        title: "📡 Sem conexão",
        description: "Verifique sua internet e tente novamente.",
      });
      return;
    }

    try {
      cnpjSchema.parse(cnpj);
      const cleanedCNPJ = cnpj.replace(/\D/g, '');
      await onSearch(cleanedCNPJ);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "CNPJ inválido",
          description: error.errors[0].message,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="00.000.000/0000-00"
            value={cnpj}
            onChange={handleInputChange}
            disabled={isLoading}
            className="h-14 text-lg font-mono shadow-soft pr-12"
            autoComplete="off"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handlePaste}
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-muted-foreground hover:text-foreground"
            title="Colar CNPJ"
          >
            <ClipboardPaste className="h-5 w-5" />
          </Button>
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || !isOnline}
          size="lg"
          className="h-14 px-8 shadow-soft min-w-[120px]"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Search className="h-5 w-5 mr-2" />
              Buscar
            </>
          )}
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Digite ou cole o CNPJ da empresa
        </p>
        <div className="flex items-center gap-1.5 text-xs">
          {isOnline ? (
            <>
              <Wifi className="h-3.5 w-3.5 text-success" />
              <span className="text-success">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5 text-destructive" />
              <span className="text-destructive">Offline</span>
            </>
          )}
        </div>
      </div>
    </form>
  );
};
