import { useState, useEffect } from "react";
import { Key, Copy, RefreshCw, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StoredKeyInfo {
  exists: boolean;
  keyPrefix: string | null;
  hasHash: boolean;
}

export const PlatformApiKey = () => {
  const [storedKeyInfo, setStoredKeyInfo] = useState<StoredKeyInfo | null>(null);
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPlatformKeyInfo();
  }, []);

  // Only load metadata about the key, NEVER the actual key
  const loadPlatformKeyInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('key_prefix, key_hash')
        .eq('name', '__PLATFORM_KEY__')
        .maybeSingle();

      if (error) throw error;
      
      setStoredKeyInfo({
        exists: !!data,
        keyPrefix: data?.key_prefix || null,
        hasHash: !!data?.key_hash,
      });
    } catch (error) {
      console.error('Error loading platform key info:', error);
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
    setNewlyGeneratedKey(null);
    
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

      // Show the key ONLY NOW, not from stored data
      setNewlyGeneratedKey(newKey);
      
      // Update stored info
      setStoredKeyInfo({
        exists: true,
        keyPrefix: keyPrefix,
        hasHash: true,
      });

      toast({
        title: "Chave gerada",
        description: "Copie sua chave agora - ela não será exibida novamente!",
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
    if (newlyGeneratedKey) {
      navigator.clipboard.writeText(newlyGeneratedKey);
      toast({
        title: "Copiado!",
        description: "Chave copiada para a área de transferência",
      });
    }
  };

  const getDisplayPrefix = () => {
    if (storedKeyInfo?.keyPrefix) {
      return storedKeyInfo.keyPrefix + "••••••••••••••••••••••••••••";
    }
    return "pk_••••••••••••••••••••••••••••••••";
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
        {/* Show newly generated key - ONE TIME ONLY */}
        {newlyGeneratedKey && (
          <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Copie sua chave agora!</p>
                <p className="text-xs text-muted-foreground">
                  Esta é a única vez que a chave será exibida. Ela não é armazenada de forma recuperável.
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    value={newlyGeneratedKey}
                    readOnly
                    className="font-mono text-sm bg-muted"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {storedKeyInfo?.exists ? (
          <div className="space-y-3">
            {!newlyGeneratedKey && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Você já possui uma chave de API configurada:
                </p>
                <Input
                  value={getDisplayPrefix()}
                  readOnly
                  className="font-mono text-sm bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Por segurança, a chave completa não pode ser visualizada. Se você perdeu sua chave, regenere uma nova.
                </p>
              </div>
            )}
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
            Authorization: Bearer {newlyGeneratedKey || "SUA_CHAVE_AQUI"}
          </code>
        </div>
      </CardContent>
    </Card>
  );
};