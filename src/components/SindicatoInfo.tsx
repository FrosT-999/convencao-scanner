import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Phone, Mail, Globe, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface SindicatoData {
  id: string;
  nome: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  website?: string;
  cnae_principal: number;
  uf: string;
}

interface SindicatoInfoProps {
  cnae: number;
  uf: string;
  municipio: string;
}

export const SindicatoInfo = ({ cnae, uf, municipio }: SindicatoInfoProps) => {
  const [sindicato, setSindicato] = useState<SindicatoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSindicato = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // First try to find by exact CNAE and UF with municipality match
        let { data, error: fetchError } = await supabase
          .from("sindicatos")
          .select("*")
          .eq("cnae_principal", cnae)
          .eq("uf", uf)
          .or(`municipios.cs.{"${municipio}"},municipios.eq.{}`)
          .limit(1)
          .maybeSingle();

        // If not found by primary CNAE, search in secondary CNAEs
        if (!data && !fetchError) {
          const { data: secondaryData, error: secondaryError } = await supabase
            .from("sindicatos")
            .select("*")
            .eq("uf", uf)
            .contains("cnaes_secundarios", [cnae])
            .or(`municipios.cs.{"${municipio}"},municipios.eq.{}`)
            .limit(1)
            .maybeSingle();

          if (secondaryError) throw secondaryError;
          data = secondaryData;
        }

        if (fetchError) throw fetchError;

        setSindicato(data);
      } catch (err) {
        console.error("Error fetching sindicato:", err);
        setError("Erro ao buscar informações do sindicato");
      } finally {
        setIsLoading(false);
      }
    };

    if (cnae && uf) {
      fetchSindicato();
    }
  }, [cnae, uf, municipio]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informações do Sindicato
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Buscando sindicato...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informações do Sindicato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!sindicato) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informações do Sindicato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Sindicato não encontrado para o CNAE {cnae} em {municipio}/{uf}.
              <br />
              <span className="text-xs text-muted-foreground">
                A base de dados está sendo expandida continuamente.
              </span>
            </AlertDescription>
          </Alert>
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
        <div>
          <h3 className="font-semibold text-lg">{sindicato.nome}</h3>
          <p className="text-xs text-muted-foreground">CNAE {sindicato.cnae_principal}</p>
        </div>

        <div className="space-y-3">
          {sindicato.endereco && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>{sindicato.endereco}</span>
            </div>
          )}

          {sindicato.telefone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <a 
                href={`tel:${sindicato.telefone.replace(/\D/g, '')}`}
                className="hover:underline text-primary"
              >
                {sindicato.telefone}
              </a>
            </div>
          )}

          {sindicato.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <a 
                href={`mailto:${sindicato.email}`}
                className="hover:underline text-primary"
              >
                {sindicato.email}
              </a>
            </div>
          )}

          {sindicato.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <a 
                href={sindicato.website.startsWith('http') ? sindicato.website : `https://${sindicato.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-primary"
              >
                {sindicato.website}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
