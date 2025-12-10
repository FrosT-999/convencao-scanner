import { useState, useEffect } from "react";
import { Key, Copy, RefreshCw, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const PlatformApiKey = () => {
  const [platformKey, setPlatformKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPlatformKey();
  }, []);

  const loadPlatformKey = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('api_key')
        .eq('name', '__PLATFORM_KEY__')
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setPlatformKey(data.api_key);
      }
    } catch (error) {
      console.error('Error loading platform key:', error);
    }
  };

  const generateKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'pk_';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const handleGenerateKey = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const newKey = generateKey();

      // Check if platform key exists
      const { data: existing } = await supabase
        .from('api_keys')
        .select('id')
        .eq('name', '__PLATFORM_KEY__')
        .eq('user_id', user.id)
        .maybeSingle();

      // Hash the key for secure storage
      const encoder = new TextEncoder();
      const data = encoder.encode(newKey);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const keyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      const keyPrefix = newKey.substring(0, 8);

      if (existing) {
        const { error } = await supabase
          .from('api_keys')
          .update({ 
            api_key: keyPrefix + '***', // Only store masked version
            key_hash: keyHash,
            key_prefix: keyPrefix,
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('api_keys')
          .insert({
            user_id: user.id,
            name: '__PLATFORM_KEY__',
            description: 'Chave de API nativa da plataforma',
            api_key: keyPrefix + '***', // Only store masked version
            key_hash: keyHash,
            key_prefix: keyPrefix,
            is_active: true,
          });

        if (error) throw error;
      }

      setPlatformKey(newKey);
      setIsVisible(true);

      toast({
        title: "Chave gerada",
        description: "Sua nova chave de API da plataforma foi gerada com sucesso",
      });
    } catch (error) {
      console.error('Error generating key:', error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar chave",
        description: error instanceof Error ? error.message : "Não foi possível gerar a chave",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (platformKey) {
      navigator.clipboard.writeText(platformKey);
      toast({
        title: "Copiado!",
        description: "Chave copiada para a área de transferência",
      });
    }
  };

  const maskKey = (key: string) => {
    return key.substring(0, 6) + "••••••••••••••••••••" + key.substring(key.length - 4);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Chave de API da Plataforma
        </CardTitle>
        <CardDescription>
          Use esta chave para autenticar requisições aos endpoints da plataforma
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {platformKey ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                value={isVisible ? platformKey : maskKey(platformKey)}
                readOnly
                className="font-mono text-sm bg-muted"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={handleGenerateKey}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Regenerar Chave
            </Button>
            <p className="text-xs text-muted-foreground">
              ⚠️ Regenerar a chave invalidará a chave anterior imediatamente
            </p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Nenhuma chave de API gerada ainda
            </p>
            <Button onClick={handleGenerateKey} disabled={isLoading} className="gap-2">
              <Key className="h-4 w-4" />
              {isLoading ? "Gerando..." : "Gerar Chave de API"}
            </Button>
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-sm font-medium mb-2">Como usar:</p>
          <code className="block text-xs bg-muted p-3 rounded-lg font-mono">
            Authorization: Bearer {platformKey ? (isVisible ? platformKey : "pk_***") : "SUA_CHAVE_AQUI"}
          </code>
        </div>
      </CardContent>
    </Card>
  );
};
