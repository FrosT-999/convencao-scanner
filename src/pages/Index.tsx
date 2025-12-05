import { useState } from "react";
import { Search } from "lucide-react";
import { CNPJSearchForm } from "@/components/CNPJSearchForm";
import { DocumentUpload } from "@/components/DocumentUpload";
import { CompanyResult } from "@/components/CompanyResult";
import { SindicatoInfo } from "@/components/SindicatoInfo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [companyData, setCompanyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (cnpj: string) => {
    setIsLoading(true);
    setCompanyData(null);

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
      
      if (!response.ok) {
        throw new Error('CNPJ não encontrado');
      }

      const data = await response.json();
      setCompanyData(data);
      
      toast({
        title: "Consulta realizada",
        description: "Dados da empresa encontrados com sucesso",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na consulta",
        description: error instanceof Error ? error.message : "Não foi possível consultar o CNPJ",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Consulta CNPJ
                </h1>
                <p className="text-sm text-muted-foreground">
                  Busque informações de empresas brasileiras
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <a href="/" className="text-sm text-primary hover:underline">
                Início
              </a>
              <a href="/settings" className="text-sm text-primary hover:underline">
                Configurações
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-12">
          <section className="w-full flex flex-col items-center gap-6">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
                Pesquise por CNPJ
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Digite o CNPJ da empresa para consultar seus dados cadastrais
                atualizados
              </p>
            </div>
            <CNPJSearchForm onSearch={handleSearch} isLoading={isLoading} />
          </section>

          {companyData && (
            <>
              <section className="w-full flex justify-center animate-in fade-in duration-700">
                <CompanyResult data={companyData} />
              </section>
              
              <section className="w-full flex justify-center animate-in fade-in duration-700 delay-150">
                <SindicatoInfo 
                  cnae={companyData.cnae_fiscal}
                  uf={companyData.uf}
                  municipio={companyData.municipio}
                />
              </section>
            </>
          )}

          <section className="w-full flex flex-col items-center gap-4">
            <div className="text-center mb-2">
              <h2 className="text-2xl font-bold mb-2">
                Anexe Documentos
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Faça upload de documentos relacionados à consulta (PDF, DOCX ou imagens)
              </p>
            </div>
            <DocumentUpload />
          </section>
        </div>
      </main>

      <footer className="border-t bg-card mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Consulta de CNPJ utilizando dados públicos da Receita Federal</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
