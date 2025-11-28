import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { History, ArrowLeft, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface WebhookLog {
  id: string;
  direction: 'sent' | 'received';
  endpoint: string;
  payload: any;
  response: any;
  status_code: number | null;
  success: boolean;
  error_message: string | null;
  created_at: string;
}

const WebhookLogs = () => {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setLogs((data as WebhookLog[]) || []);
    } catch (error) {
      console.error('Error loading logs:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar logs",
        description: error instanceof Error ? error.message : "Não foi possível carregar os logs",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <History className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Histórico de Webhooks
              </h1>
              <p className="text-sm text-muted-foreground">
                Visualize todos os webhooks enviados e recebidos
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/settings')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Configurações
            </Button>
            <Button variant="outline" onClick={loadLogs} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Logs de Webhooks</CardTitle>
              <CardDescription>
                {logs.length} registro{logs.length !== 1 ? 's' : ''} encontrado{logs.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {log.direction === 'sent' ? (
                          <ArrowUpRight className="h-5 w-5 text-blue-500" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-green-500" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {log.direction === 'sent' ? 'Enviado' : 'Recebido'}
                            </span>
                            <Badge variant={log.success ? "default" : "destructive"}>
                              {log.success ? 'Sucesso' : 'Erro'}
                            </Badge>
                            {log.status_code && (
                              <Badge variant="outline">{log.status_code}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {format(new Date(log.created_at), "dd/MM/yyyy 'às' HH:mm:ss")}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground truncate max-w-md">
                        {log.endpoint}
                      </p>
                    </div>

                    {selectedLog?.id === log.id && (
                      <div className="mt-4 space-y-4 border-t pt-4">
                        {log.error_message && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 text-destructive">Erro:</h4>
                            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                              {log.error_message}
                            </pre>
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Payload:</h4>
                          <pre className="bg-muted p-3 rounded text-xs overflow-x-auto max-h-64 overflow-y-auto">
                            {JSON.stringify(log.payload, null, 2)}
                          </pre>
                        </div>
                        {log.response && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Resposta:</h4>
                            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto max-h-64 overflow-y-auto">
                              {typeof log.response === 'string' 
                                ? log.response 
                                : JSON.stringify(log.response, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {logs.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Nenhum webhook registrado ainda
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default WebhookLogs;
