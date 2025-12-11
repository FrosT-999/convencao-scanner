import { useState } from "react";
import { 
  Building2, MapPin, Phone, Mail, Calendar, FileText, FileDown, 
  FileSpreadsheet, Send, Share2, Briefcase, Hash, CheckCircle, Loader2,
  Users, DollarSign, Landmark
} from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { exportToPDF, exportToExcel } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SindicatoInfo } from "@/components/SindicatoInfo";

interface Socio {
  nome_socio: string;
  qualificacao_socio: string;
  data_entrada_sociedade?: string;
}

interface CompanyData {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  cnaes_secundarios?: Array<{ codigo: number; descricao: string }>;
  natureza_juridica: string;
  data_inicio_atividade: string;
  situacao_cadastral: string;
  opcao_pelo_simples?: boolean;
  opcao_pelo_mei?: boolean;
  uf: string;
  municipio: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  cep: string;
  ddd_telefone_1: string;
  email: string;
  capital_social?: number;
  qsa?: Socio[];
}

interface CompanyResultProps {
  data: CompanyData;
}

export const CompanyResult = ({ data }: CompanyResultProps) => {
  const [isSending, setIsSending] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const { toast } = useToast();

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  };

  const formatDate = (date: string) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getSituacaoColor = (situacao: string | number | null | undefined) => {
    if (!situacao) return 'secondary';
    const situacaoStr = String(situacao).toLowerCase();
    if (situacaoStr.includes('ativa') || situacaoStr === '2') return 'default';
    if (situacaoStr.includes('suspensa')) return 'secondary';
    return 'destructive';
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    toast({ title: "⏳ Gerando PDF...", description: "Aguarde um momento" });
    
    try {
      await exportToPDF(data);
      toast({ title: "✅ Arquivo pronto!", description: "Download do PDF iniciado" });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível gerar o PDF" });
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    toast({ title: "⏳ Gerando planilha...", description: "Aguarde um momento" });
    
    try {
      await exportToExcel(data);
      toast({ title: "✅ Arquivo pronto!", description: "Download da planilha iniciado" });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível gerar a planilha" });
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: data.razao_social,
      text: `CNPJ: ${formatCNPJ(data.cnpj)} - ${data.razao_social}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${data.razao_social}\nCNPJ: ${formatCNPJ(data.cnpj)}`);
        toast({ title: "✅ Copiado!", description: "Dados copiados para a área de transferência" });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível compartilhar" });
    }
  };

  const handleSendToWebhook = async () => {
    setIsSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Autenticação necessária",
          description: "Faça login para enviar dados ao webhook",
        });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Sessão inválida",
          description: "Faça login novamente",
        });
        return;
      }

      const response = await supabase.functions.invoke('webhook-enviar', {
        body: data,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw response.error;
      }

      toast({
        title: "✅ Webhook enviado",
        description: "Os dados foram enviados com sucesso",
      });
    } catch (error) {
      console.error('Error sending webhook:', error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar webhook",
        description: error instanceof Error ? error.message : "Não foi possível enviar os dados",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl shadow-strong animate-fade-in border-0 overflow-hidden">
      {/* Header */}
      <CardHeader className="bg-gradient-primary p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={getSituacaoColor(data.situacao_cadastral)} className="text-xs">
                {data.situacao_cadastral || 'Não informado'}
              </Badge>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-primary-foreground mb-1 break-words">
              {data.razao_social}
            </h2>
            {data.nome_fantasia && (
              <p className="text-sm md:text-base text-primary-foreground/80">
                {data.nome_fantasia}
              </p>
            )}
          </div>
          <div className="p-3 bg-primary-foreground/10 rounded-xl hidden sm:flex">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 md:p-8 space-y-6">
        {/* CNPJ e Informações básicas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Hash className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">CNPJ</span>
            </div>
            <p className="text-lg font-bold font-mono text-foreground">{formatCNPJ(data.cnpj)}</p>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium uppercase">Início das Atividades</span>
            </div>
            <p className="text-lg font-bold text-foreground">{formatDate(data.data_inicio_atividade)}</p>
          </div>
        </div>

        <Separator />

        {/* CNAE Principal */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Atividade Principal (CNAE)</h3>
          </div>
          <div className="p-4 bg-secondary-100 dark:bg-secondary/10 rounded-xl border border-secondary/20">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="font-mono">
                {data.cnae_fiscal}
              </Badge>
            </div>
            <p className="text-sm text-foreground font-medium">{data.cnae_fiscal_descricao}</p>
          </div>
        </div>

        {/* CNAEs Secundários */}
        {data.cnaes_secundarios && data.cnaes_secundarios.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground text-sm">
              Atividades Secundárias ({data.cnaes_secundarios.length})
            </h3>
            <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
              {data.cnaes_secundarios.map((cnae, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg flex items-start gap-2">
                  <Badge variant="outline" className="font-mono text-xs shrink-0">
                    {cnae.codigo}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{cnae.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Capital Social e Sócios */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Capital Social e Quadro Societário</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs font-medium uppercase">Capital Social</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                {data.capital_social ? formatCurrency(data.capital_social) : 'Não informado'}
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="h-4 w-4" />
                <span className="text-xs font-medium uppercase">Quantidade de Sócios</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                {data.qsa ? data.qsa.length : 0} {data.qsa && data.qsa.length === 1 ? 'sócio' : 'sócios'}
              </p>
            </div>
          </div>
          
          {/* Lista de Sócios */}
          {data.qsa && data.qsa.length > 0 && (
            <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
              {data.qsa.map((socio, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{socio.nome_socio}</p>
                    <p className="text-xs text-muted-foreground">{socio.qualificacao_socio}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Regime Tributário */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Informações Tributárias</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Natureza Jurídica</p>
              <p className="text-sm font-medium text-foreground">{data.natureza_juridica}</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Regime</p>
              <div className="flex items-center gap-2">
                {data.opcao_pelo_simples && (
                  <Badge variant="outline" className="text-xs bg-success-100 text-success-600 border-success/30">
                    <CheckCircle className="h-3 w-3 mr-1" /> Simples Nacional
                  </Badge>
                )}
                {data.opcao_pelo_mei && (
                  <Badge variant="outline" className="text-xs bg-info-100 text-info-600 border-info/30">
                    <CheckCircle className="h-3 w-3 mr-1" /> MEI
                  </Badge>
                )}
                {!data.opcao_pelo_simples && !data.opcao_pelo_mei && (
                  <span className="text-sm text-muted-foreground">Lucro Presumido/Real</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Sindicato */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Sindicato</h3>
          </div>
          <SindicatoInfo 
            cnae={data.cnae_fiscal} 
            uf={data.uf} 
            municipio={data.municipio} 
          />
        </div>

        <Separator />

        {/* Endereço e Contato */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">
                {data.logradouro}, {data.numero}
                {data.complemento && ` - ${data.complemento}`}
              </p>
              <p className="text-sm text-muted-foreground">
                {data.bairro} - {data.municipio}/{data.uf}
              </p>
              <p className="text-sm text-muted-foreground">CEP: {data.cep}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {data.ddd_telefone_1 && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">{data.ddd_telefone_1}</span>
              </div>
            )}
            {data.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground break-all">{data.email}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Footer com ações */}
      <CardFooter className="bg-muted/30 border-t p-4 md:p-6">
        <div className="w-full space-y-3">
          {/* Linha principal de ações */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button 
              variant="default"
              size="sm"
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              className="gap-2 h-11"
            >
              {isExportingPDF ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileDown className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Exportar</span> PDF
            </Button>
            
            <Button 
              variant="default"
              size="sm"
              onClick={handleExportExcel}
              disabled={isExportingExcel}
              className="gap-2 h-11"
            >
              {isExportingExcel ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Gerar</span> Planilha
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-2 h-11"
            >
              <Share2 className="h-4 w-4" />
              Compartilhar
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
              onClick={handleSendToWebhook}
              disabled={isSending}
              className="gap-2 h-11"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Webhook
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
