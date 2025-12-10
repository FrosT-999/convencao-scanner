import { useState } from "react";
import { Search, Building2, Settings, FileText } from "lucide-react";
import { CNPJSearchForm } from "@/components/CNPJSearchForm";
import { CompanyResult } from "@/components/CompanyResult";
import { SindicatoInfo } from "@/components/SindicatoInfo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [companyData, setCompanyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchStatus, setSearchStatus] = useState<string>("");
  const { toast } = useToast();

  const handleSearch = async (cnpj: string) => {
    setIsLoading(true);
    setCompanyData(null);
    setSearchStatus("🔍 Consultando dados do CNPJ...");

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
      
      if (!response.ok) {
        setSearchStatus("");
        toast({
          variant: "destructive",
          title: "⚠️ CNPJ inválido",
          description: "Verifique o número e tente novamente.",
        });
        throw new Error('CNPJ não encontrado');
      }

      const data = await response.json();
      setCompanyData(data);
      setSearchStatus("");
      
      toast({
        title: "✅ Consulta realizada",
        description: "Dados da empresa encontrados com sucesso!",
      });
    } catch (error) {
      if (error instanceof Error && error.message !== 'CNPJ não encontrado') {
        toast({
          variant: "destructive",
          title: "⚠️ Erro na consulta",
          description: "Não foi possível consultar o CNPJ. Tente novamente.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header corporativo */}
      <header className="bg-card border-b shadow-soft sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-primary rounded-xl shadow-medium">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">
                  Consulta CNPJ
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                  Sistema de consulta empresarial
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <ThemeToggle />
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <a href="/settings" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Configurações
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild className="sm:hidden">
                <a href="/settings">
                  <Settings className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-12">
        <div className="flex flex-col items-center gap-8 md:gap-12">
          {/* Hero section com card de busca */}
          <section className="w-full max-w-2xl">
            <Card className="shadow-strong border-0 overflow-hidden">
              <div className="bg-gradient-primary p-6 md:p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-primary-foreground/10 rounded-2xl mb-4 backdrop-blur-sm">
                  <Search className="h-8 w-8 md:h-10 md:w-10 text-primary-foreground" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                  Consultar CNPJ
                </h2>
                <p className="text-primary-foreground/80 text-sm md:text-base max-w-md mx-auto">
                  Acesse informações cadastrais de empresas brasileiras de forma rápida e segura
                </p>
              </div>
              
              <CardContent className="p-6 md:p-8">
                <CNPJSearchForm onSearch={handleSearch} isLoading={isLoading} />
                
                {/* Status de busca */}
                {searchStatus && (
                  <div className="mt-4 p-4 bg-info-100 dark:bg-info/10 rounded-lg text-center animate-fade-in">
                    <p className="text-info-600 dark:text-info font-medium">
                      {searchStatus}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Resultados */}
          {companyData && (
            <>
              <section className="w-full flex justify-center animate-fade-in">
                <CompanyResult data={companyData} />
              </section>
              
              <section className="w-full flex justify-center animate-fade-in">
                <SindicatoInfo 
                  cnae={companyData.cnae_fiscal}
                  uf={companyData.uf}
                  municipio={companyData.municipio}
                />
              </section>
            </>
          )}

          {/* Seção de benefícios quando não há dados */}
          {!companyData && !isLoading && (
            <section className="w-full max-w-4xl animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <Card className="p-6 text-center shadow-card hover:shadow-medium transition-shadow">
                  <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Search className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Consulta Rápida</h3>
                  <p className="text-sm text-muted-foreground">
                    Acesse dados cadastrais em segundos
                  </p>
                </Card>
                
                <Card className="p-6 text-center shadow-card hover:shadow-medium transition-shadow">
                  <div className="w-12 h-12 bg-success-100 dark:bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-6 w-6 text-success" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Exportação Fácil</h3>
                  <p className="text-sm text-muted-foreground">
                    Exporte para PDF ou planilha Excel
                  </p>
                </Card>
                
                <Card className="p-6 text-center shadow-card hover:shadow-medium transition-shadow">
                  <div className="w-12 h-12 bg-cta-100 dark:bg-cta/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-6 w-6 text-cta" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Dados Oficiais</h3>
                  <p className="text-sm text-muted-foreground">
                    Informações da Receita Federal
                  </p>
                </Card>
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-4 md:py-6 text-center text-xs md:text-sm text-muted-foreground">
          <p>Sistema de consulta CNPJ • Dados públicos da Receita Federal</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
