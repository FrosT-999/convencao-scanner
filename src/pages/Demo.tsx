import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Search, 
  FileText, 
  Download, 
  Settings, 
  Webhook, 
  Key,
  Building2,
  Upload,
  Moon,
  Sun,
  CheckCircle2,
  Play
} from "lucide-react";

const Demo = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const features = [
    {
      icon: Search,
      title: "Busca de CNPJ",
      description: "Pesquise informações detalhadas de empresas brasileiras usando o número do CNPJ.",
      details: ["Nome da empresa", "Endereço completo", "CNAE principal e secundários", "Situação cadastral"]
    },
    {
      icon: Building2,
      title: "Dados Completos",
      description: "Acesse informações completas sobre qualquer empresa registrada no Brasil.",
      details: ["Capital social", "Natureza jurídica", "Data de abertura", "Quadro societário"]
    },
    {
      icon: Upload,
      title: "Upload de Documentos",
      description: "Faça upload de documentos relacionados às empresas pesquisadas.",
      details: ["PDF, DOCX, imagens", "Armazenamento seguro", "Organização por empresa", "Acesso rápido"]
    },
    {
      icon: Download,
      title: "Exportação de Dados",
      description: "Exporte os dados encontrados em diferentes formatos para uso posterior.",
      details: ["Exportar para PDF", "Exportar para Excel", "Relatórios formatados", "Dados estruturados"]
    },
    {
      icon: Webhook,
      title: "Integração Webhook",
      description: "Configure webhooks para enviar dados automaticamente para sistemas externos.",
      details: ["Integração com n8n", "Envio automático", "Histórico de logs", "Suporte a múltiplos endpoints"]
    },
    {
      icon: Key,
      title: "Gerenciamento de API Keys",
      description: "Gerencie suas chaves de API para integrações com terceiros.",
      details: ["Criar/editar chaves", "Ativar/desativar", "Descrições personalizadas", "Segurança avançada"]
    }
  ];

  const steps = [
    { title: "Acesse a página inicial", description: "Comece na página principal do sistema" },
    { title: "Digite o CNPJ", description: "Insira o número do CNPJ no campo de busca" },
    { title: "Visualize os dados", description: "Veja todas as informações da empresa" },
    { title: "Exporte ou integre", description: "Exporte para PDF/Excel ou envie via webhook" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Demonstração</h1>
                  <p className="text-sm text-muted-foreground">Conheça as funcionalidades do sistema</p>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-8">
          <Badge variant="secondary" className="px-4 py-1">
            Sistema de Consulta CNPJ
          </Badge>
          <h2 className="text-4xl font-bold text-foreground">
            Consulte empresas brasileiras de forma <span className="text-primary">rápida e fácil</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nossa plataforma oferece acesso completo a informações de empresas registradas no Brasil, 
            com recursos de exportação, integração via webhook e muito mais.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate("/")}>
              <Search className="h-5 w-5 mr-2" />
              Começar Agora
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/settings")}>
              <Settings className="h-5 w-5 mr-2" />
              Configurações
            </Button>
          </div>
        </section>

        {/* How it works */}
        <section className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground">Como Funciona</h3>
            <p className="text-muted-foreground mt-2">Siga estes passos simples para consultar CNPJs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <Card 
                key={index}
                className={`cursor-pointer transition-all duration-300 ${
                  activeStep === index 
                    ? "ring-2 ring-primary shadow-lg scale-105" 
                    : "hover:shadow-md hover:scale-102"
                }`}
                onClick={() => setActiveStep(index)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      activeStep >= index 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {activeStep > index ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                    </div>
                    <CardTitle className="text-base">{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground">Funcionalidades</h3>
            <p className="text-muted-foreground mt-2">Explore todos os recursos disponíveis</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>{feature.description}</CardDescription>
                  <ul className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Theme Demo */}
        <section className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground">Tema Claro e Escuro</h3>
            <p className="text-muted-foreground mt-2">Alterne entre os temas usando o botão no canto superior direito</p>
          </div>

          <div className="flex justify-center gap-8">
            <Card className="w-64 text-center">
              <CardContent className="pt-6">
                <div className="p-4 bg-background border rounded-lg mb-4">
                  <Sun className="h-12 w-12 mx-auto text-yellow-500" />
                </div>
                <h4 className="font-semibold">Tema Claro</h4>
                <p className="text-sm text-muted-foreground">Ideal para uso diurno</p>
              </CardContent>
            </Card>

            <Card className="w-64 text-center">
              <CardContent className="pt-6">
                <div className="p-4 bg-slate-900 border rounded-lg mb-4">
                  <Moon className="h-12 w-12 mx-auto text-blue-400" />
                </div>
                <h4 className="font-semibold">Tema Escuro</h4>
                <p className="text-sm text-muted-foreground">Confortável para os olhos</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-12 space-y-6 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl">
          <h3 className="text-3xl font-bold text-foreground">Pronto para começar?</h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Comece a consultar CNPJs agora mesmo e descubra todas as informações que você precisa sobre empresas brasileiras.
          </p>
          <Button size="lg" onClick={() => navigate("/")}>
            <Search className="h-5 w-5 mr-2" />
            Ir para Consulta
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Sistema de Consulta CNPJ © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Demo;
