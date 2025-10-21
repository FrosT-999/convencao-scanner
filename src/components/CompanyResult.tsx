import { Building2, MapPin, Phone, Mail, Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CompanyData {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  cnae_fiscal_descricao: string;
  natureza_juridica: string;
  data_inicio_atividade: string;
  situacao_cadastral: string;
  uf: string;
  municipio: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  cep: string;
  ddd_telefone_1: string;
  email: string;
}

interface CompanyResultProps {
  data: CompanyData;
}

export const CompanyResult = ({ data }: CompanyResultProps) => {
  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  };

  const formatDate = (date: string) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const getSituacaoColor = (situacao: string | number | null | undefined) => {
    if (!situacao) return 'secondary';
    const situacaoStr = String(situacao).toLowerCase();
    if (situacaoStr.includes('ativa') || situacaoStr === '2') return 'default';
    if (situacaoStr.includes('suspensa')) return 'secondary';
    return 'destructive';
  };

  return (
    <Card className="w-full max-w-2xl shadow-strong animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl mb-2">{data.razao_social}</CardTitle>
            {data.nome_fantasia && (
              <p className="text-sm opacity-90">
                Nome Fantasia: {data.nome_fantasia}
              </p>
            )}
          </div>
          <Building2 className="h-8 w-8 opacity-80" />
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">CNPJ</p>
            <p className="font-semibold">{formatCNPJ(data.cnpj)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Situação Cadastral</p>
            <Badge variant={getSituacaoColor(data.situacao_cadastral)}>
              {data.situacao_cadastral || 'Não informado'}
            </Badge>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <FileText className="h-4 w-4" />
            <p className="text-sm">Atividade Principal</p>
          </div>
          <p className="text-sm font-medium">{data.cnae_fiscal_descricao}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Natureza Jurídica</p>
          <p className="text-sm font-medium">{data.natureza_juridica}</p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Início das Atividades:</span>
          <span className="font-medium">{formatDate(data.data_inicio_atividade)}</span>
        </div>

        <div className="border-t pt-4 space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium">
                {data.logradouro}, {data.numero}
                {data.complemento && ` - ${data.complemento}`}
              </p>
              <p className="text-muted-foreground">
                {data.bairro} - {data.municipio}/{data.uf}
              </p>
              <p className="text-muted-foreground">CEP: {data.cep}</p>
            </div>
          </div>

          {data.ddd_telefone_1 && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{data.ddd_telefone_1}</span>
            </div>
          )}

          {data.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium break-all">{data.email}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
