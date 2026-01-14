import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Building2, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyResult } from "@/components/CompanyResult";
import { ThemeToggle } from "@/components/ThemeToggle";

const Share = () => {
  const [searchParams] = useSearchParams();
  const [companyData, setCompanyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get("data");
    
    if (dataParam) {
      try {
        const decodedData = JSON.parse(atob(dataParam));
        setCompanyData(decodedData);
        setError(null);
      } catch (e) {
        console.error("Error parsing share data:", e);
        setError("Não foi possível carregar os dados compartilhados");
      }
    } else {
      setError("Link de compartilhamento inválido");
    }
    
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-lg text-muted-foreground">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error || !companyData) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="w-full border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">Consulta CNPJ</span>
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <div className="p-4 bg-destructive/10 rounded-full inline-block">
              <Building2 className="h-12 w-12 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {error || "Link inválido"}
            </h1>
            <p className="text-muted-foreground max-w-md">
              O link de compartilhamento expirou ou está incorreto.
            </p>
            <Button asChild className="mt-4">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ir para a página inicial
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="w-full border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">Consulta CNPJ</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Nova consulta
            </Link>
          </Button>
        </div>

        <div className="flex justify-center">
          <CompanyResult data={companyData} />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Dados compartilhados via Consulta CNPJ</p>
        </div>
      </footer>
    </div>
  );
};

export default Share;
