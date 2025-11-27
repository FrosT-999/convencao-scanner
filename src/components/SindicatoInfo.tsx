import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Phone, Mail, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SindicatoData {
  nome: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  cnae_atendido: number;
}

interface SindicatoInfoProps {
  cnae: number;
  uf: string;
  municipio: string;
  isLoading?: boolean;
}

export const SindicatoInfo = ({ cnae, uf, municipio, isLoading }: SindicatoInfoProps) => {
  // TODO: Conectar com API real de sindicatos
  // Exemplo de chamada futura:
  // const { data: sindicato, isLoading } = useQuery({
  //   queryKey: ['sindicato', cnae, uf, municipio],
  //   queryFn: () => fetchSindicato(cnae, uf, municipio)
  // });

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informações do Sindicato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Carregando informações do sindicato...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Informações do Sindicato
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Estrutura preparada para integração com API de sindicatos.
            <br />
            <span className="text-xs text-muted-foreground">
              Parâmetros: CNAE {cnae}, {municipio}/{uf}
            </span>
          </AlertDescription>
        </Alert>

        <div className="space-y-3 pt-2">
          <div className="text-sm text-muted-foreground">
            Para conectar uma API, implemente a função <code className="bg-muted px-1 py-0.5 rounded">fetchSindicato</code> que recebe:
          </div>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-2">
            <li>CNAE: {cnae}</li>
            <li>UF: {uf}</li>
            <li>Município: {municipio}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
