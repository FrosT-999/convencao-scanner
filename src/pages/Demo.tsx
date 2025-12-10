import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/hooks/use-scroll-reveal";
import { 
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
  Sparkles,
  Zap,
  Shield,
  Globe,
  ChevronDown,
  History
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const stats = [
    { icon: Zap, value: "< 1s", label: "Tempo de resposta" },
    { icon: Globe, value: "100%", label: "Empresas BR" },
    { icon: Shield, value: "Seguro", label: "Dados protegidos" },
    { icon: Sparkles, value: "24/7", label: "Disponibilidade" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Consulta CNPJ</h1>
                <p className="text-sm text-muted-foreground">Sistema de consulta empresarial</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Settings className="h-4 w-4" />
                    Menu
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-popover border border-border">
                  <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/webhook-logs")} className="cursor-pointer">
                    <History className="h-4 w-4 mr-2" />
                    Logs de Webhook
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />
          </div>

          <ScrollReveal animation="fade-down" delay={0}>
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 mr-2 inline" />
              Sistema de Consulta CNPJ
            </Badge>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={100}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Consulte empresas brasileiras
              <br />
              <span className="text-primary relative">
                de forma rápida e fácil
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C50 4 100 2 150 4C200 6 250 8 298 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary/40" />
                </svg>
              </span>
            </h2>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Nossa plataforma oferece acesso completo a informações de empresas registradas no Brasil, 
              com recursos de exportação, integração via webhook e muito mais.
            </p>
          </ScrollReveal>
          
          <ScrollReveal animation="zoom-in" delay={300}>
            <div className="flex gap-4 justify-center pt-6 flex-wrap">
              <Button 
                size="lg" 
                onClick={() => navigate("/consulta")}
                className="group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <Search className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Começar Agora
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate("/settings")}
                className="group"
              >
                <Settings className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-500" />
                Configurações
              </Button>
            </div>
          </ScrollReveal>
        </section>

        {/* Stats Section */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
                <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <div className="p-3 bg-primary/10 rounded-xl w-fit mx-auto mb-3 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="space-y-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center">
              <Badge variant="outline" className="mb-4">Passo a Passo</Badge>
              <h3 className="text-3xl font-bold text-foreground">Como Funciona</h3>
              <p className="text-muted-foreground mt-2">Siga estes passos simples para consultar CNPJs</p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2 z-0" />
            
            {steps.map((step, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 150}>
                <Card 
                  className={`cursor-pointer transition-all duration-500 relative z-10 ${
                    activeStep === index 
                      ? "ring-2 ring-primary shadow-xl shadow-primary/20 scale-105" 
                      : "hover:shadow-lg hover:scale-102 hover:-translate-y-1"
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        activeStep >= index 
                          ? "bg-primary text-primary-foreground scale-110" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {activeStep > index ? (
                          <CheckCircle2 className="h-5 w-5 animate-scale-in" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <CardTitle className="text-base">{step.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{step.description}</CardDescription>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="space-y-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center">
              <Badge variant="outline" className="mb-4">Recursos</Badge>
              <h3 className="text-3xl font-bold text-foreground">Funcionalidades</h3>
              <p className="text-muted-foreground mt-2">Explore todos os recursos disponíveis</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <ScrollReveal 
                key={index} 
                animation={index % 2 === 0 ? "fade-right" : "fade-left"} 
                delay={index * 100}
              >
                <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden relative">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardHeader className="relative">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                        <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 relative">
                    <CardDescription className="group-hover:text-foreground/80 transition-colors">
                      {feature.description}
                    </CardDescription>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li 
                          key={idx} 
                          className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors"
                          style={{ transitionDelay: `${idx * 50}ms` }}
                        >
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Theme Demo */}
        <section className="space-y-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center">
              <Badge variant="outline" className="mb-4">Personalização</Badge>
              <h3 className="text-3xl font-bold text-foreground">Tema Claro e Escuro</h3>
              <p className="text-muted-foreground mt-2">Alterne entre os temas usando o botão no canto superior direito</p>
            </div>
          </ScrollReveal>

          <div className="flex justify-center gap-8 flex-wrap">
            <ScrollReveal animation="fade-right" delay={0}>
              <Card className="w-64 text-center group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <CardContent className="pt-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border rounded-xl mb-4 relative group-hover:scale-105 transition-transform">
                    <Sun className="h-14 w-14 mx-auto text-yellow-500 group-hover:rotate-180 transition-transform duration-700" />
                  </div>
                  <h4 className="font-semibold text-lg">Tema Claro</h4>
                  <p className="text-sm text-muted-foreground">Ideal para uso diurno</p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal animation="fade-left" delay={100}>
              <Card className="w-64 text-center group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <CardContent className="pt-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border rounded-xl mb-4 relative group-hover:scale-105 transition-transform">
                    <Moon className="h-14 w-14 mx-auto text-blue-400 group-hover:-rotate-12 transition-transform duration-500" />
                    {/* Stars animation */}
                    <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full animate-pulse" />
                    <div className="absolute top-4 right-6 w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
                    <div className="absolute bottom-4 left-4 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
                  </div>
                  <h4 className="font-semibold text-lg">Tema Escuro</h4>
                  <p className="text-sm text-muted-foreground">Confortável para os olhos</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA Section */}
        <ScrollReveal animation="zoom-in">
          <section className="text-center py-16 space-y-6 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-primary/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
            </div>
            
            <div className="relative z-10">
              <ScrollReveal animation="fade-down" delay={100}>
                <Sparkles className="h-10 w-10 mx-auto text-primary mb-4 animate-bounce" />
              </ScrollReveal>
              
              <ScrollReveal animation="fade-up" delay={200}>
                <h3 className="text-3xl md:text-4xl font-bold text-foreground">Pronto para começar?</h3>
              </ScrollReveal>
              
              <ScrollReveal animation="fade-up" delay={300}>
                <p className="text-muted-foreground max-w-xl mx-auto mt-4">
                  Comece a consultar CNPJs agora mesmo e descubra todas as informações que você precisa sobre empresas brasileiras.
                </p>
              </ScrollReveal>
              
              <ScrollReveal animation="fade-up" delay={400}>
                <Button 
                  size="lg" 
                  onClick={() => navigate("/consulta")}
                  className="mt-6 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Ir para Consulta
                  </span>
                </Button>
              </ScrollReveal>
            </div>
          </section>
        </ScrollReveal>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <ScrollReveal animation="fade-up">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>Sistema de Consulta CNPJ © {new Date().getFullYear()}</p>
            <p className="mt-2 text-xs">Feito com dedicação para o mercado brasileiro</p>
          </div>
        </ScrollReveal>
      </footer>
    </div>
  );
};

export default Demo;
