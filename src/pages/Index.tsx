import { useState } from "react";
import { Search, Building2, Settings, FileText, Clock, X, Copy, Check } from "lucide-react";
import { CNPJSearchForm } from "@/components/CNPJSearchForm";
import { CompanyResult } from "@/components/CompanyResult";
import { CompanyResultSkeleton } from "@/components/CompanyResultSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { SindicatoInfo } from "@/components/SindicatoInfo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { useRecentSearches } from "@/hooks/use-recent-searches";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type SearchStatus = "idle" | "loading" | "success" | "not-found" | "error" | "offline";

const Index = () => {
  const [companyData, setCompanyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchStatus, setSearchStatus] = useState<SearchStatus>("idle");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { recentSearches, addSearch, clearSearches } = useRecentSearches();

  const handleSearch = async (cnpj: string) => {
    if (!navigator.onLine) {
      setSearchStatus("offline");
      return;
    }

    setIsLoading(true);
    setCompanyData(null);
    setSearchStatus("loading");

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
      
      if (!response.ok) {
        setSearchStatus("not-found");
        toast({
          variant: "destructive",
          title: "⚠️ CNPJ não encontrado",
          description: "Verifique o número e tente novamente.",
        });
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setCompanyData(data);
      setSearchStatus("success");
      
      // Add to recent searches
      addSearch(cnpj, data.razao_social || data.nome_fantasia || "Empresa");
      
      toast({
        title: "✅ Consulta realizada",
        description: "Dados da empresa encontrados com sucesso!",
      });
    } catch (error) {
      setSearchStatus("error");
      toast({
        variant: "destructive",
        title: "⚠️ Erro na consulta",
        description: "Não foi possível consultar o CNPJ. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCnpjDisplay = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  };

  const copyResumo = async () => {
    if (!companyData) return;
    
    const resumo = `📋 *${companyData.razao_social}*
📍 CNPJ: ${formatCnpjDisplay(companyData.cnpj)}
🏢 Nome Fantasia: ${companyData.nome_fantasia || "Não informado"}
📌 Situação: ${companyData.descricao_situacao_cadastral}
📅 Abertura: ${companyData.data_inicio_atividade}
🎯 CNAE: ${companyData.cnae_fiscal} - ${companyData.cnae_fiscal_descricao}
📍 ${companyData.municipio}/${companyData.uf}`;

    try {
      await navigator.clipboard.writeText(resumo);
      setCopied(true);
      toast({
        title: "📋 Copiado!",
        description: "Resumo copiado para a área de transferência",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao copiar",
        description: "Não foi possível copiar o resumo",
      });
    }
  };

  const handleNewSearch = () => {
    setCompanyData(null);
    setSearchStatus("idle");
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

                {/* Recent searches */}
                {recentSearches.length > 0 && !companyData && !isLoading && searchStatus === "idle" && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Buscas recentes</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearSearches}
                        className="h-7 text-xs text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Limpar
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search) => (
                        <button
                          key={search.cnpj}
                          onClick={() => handleSearch(search.cnpj)}
                          className="group flex flex-col items-start px-3 py-2 bg-secondary/50 hover:bg-secondary rounded-lg text-left transition-colors"
                        >
                          <span className="text-xs font-mono text-foreground">
                            {formatCnpjDisplay(search.cnpj)}
                          </span>
                          <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                            {search.razaoSocial}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Loading state */}
          {isLoading && (
            <section className="w-full flex justify-center animate-fade-in">
              <CompanyResultSkeleton />
            </section>
          )}

          {/* Empty states */}
          {!isLoading && (searchStatus === "not-found" || searchStatus === "error" || searchStatus === "offline") && (
            <section className="w-full flex justify-center animate-fade-in">
              <EmptyState 
                type={searchStatus} 
                onRetry={handleNewSearch}
              />
            </section>
          )}

          {/* Resultados */}
          {companyData && !isLoading && (
            <>
              {/* Quick actions bar */}
              <section className="w-full max-w-4xl flex flex-wrap gap-3 justify-center animate-fade-in">
                <Button 
                  variant="outline" 
                  onClick={copyResumo}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-success" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copiar Resumo
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleNewSearch}
                  className="gap-2"
                >
                  <Search className="h-4 w-4" />
                  Nova Consulta
                </Button>
              </section>

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
          {!companyData && !isLoading && searchStatus === "idle" && (
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
