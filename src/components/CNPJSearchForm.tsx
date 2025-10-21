import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
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
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex gap-3">
        <Input
          type="text"
          placeholder="00.000.000/0000-00"
          value={cnpj}
          onChange={handleInputChange}
          disabled={isLoading}
          className="flex-1 h-12 text-base shadow-soft"
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          size="lg"
          className="h-12 px-8 shadow-soft"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </Button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Digite o CNPJ da empresa que deseja consultar
      </p>
    </form>
  );
};
