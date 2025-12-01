import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, Webhook, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ApiKeysManager } from "@/components/ApiKeysManager";

const Settings = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    loadConfig();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
    } else {
      setUser(user);
    }
  };

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('webhook_config')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setWebhookUrl(data.webhook_url || "");
        setApiKey(data.api_key || "");
        setIsActive(data.is_active ?? true);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const { data: existingConfig } = await supabase
        .from('webhook_config')
        .select('id')
        .single();

      const configData = {
        user_id: user.id,
        webhook_url: webhookUrl,
        api_key: apiKey || null,
        is_active: isActive,
      };

      let error;
      if (existingConfig) {
        ({ error } = await supabase
          .from('webhook_config')
          .update(configData)
          .eq('id', existingConfig.id));
      } else {
        ({ error } = await supabase
          .from('webhook_config')
          .insert(configData));
      }

      if (error) throw error;

      toast({
        title: "Configurações salvas",
        description: "Suas configurações de webhook foram atualizadas com sucesso",
      });
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Não foi possível salvar as configurações",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const endpointUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/webhook-receber`;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <SettingsIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Configurações
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gerencie suas integrações e API keys
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/')}>
              Voltar para Consulta
            </Button>
            <Button variant="outline" onClick={() => navigate('/webhook-logs')}>
              Ver Histórico de Webhooks
            </Button>
          </div>

          <ApiKeysManager />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Integração n8n Webhook
              </CardTitle>
              <CardDescription>
                Configure o webhook do n8n para receber dados das consultas de CNPJ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="endpoint">Endpoint para receber webhooks</Label>
                <Input
                  id="endpoint"
                  value={endpointUrl}
                  readOnly
                  className="font-mono text-sm bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Use este endpoint para enviar dados. Requer autenticação Bearer token.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endpoint-send">Endpoint para enviar webhooks</Label>
                <Input
                  id="endpoint-send"
                  value={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/webhook-enviar`}
                  readOnly
                  className="font-mono text-sm bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Use este endpoint para enviar dados ao webhook n8n configurado. Requer autenticação Bearer token.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-url">URL do Webhook n8n</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://seu-n8n.com/webhook/seu-webhook-id"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  URL do webhook do n8n que receberá os dados
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">API Key (opcional)</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Sua API key do n8n (se necessário)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Apenas necessário se seu webhook n8n requer autenticação
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="active">Webhook Ativo</Label>
                  <p className="text-xs text-muted-foreground">
                    Ative ou desative o envio de dados para o webhook
                  </p>
                </div>
                <Switch
                  id="active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>

              <Button onClick={handleSave} disabled={isLoading} className="w-full">
                {isLoading ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
