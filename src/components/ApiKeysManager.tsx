import { useState, useEffect } from "react";
import { Plus, Trash2, Copy, Edit2, Check, X, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ApiKey {
  id: string;
  name: string;
  description: string | null;
  api_key: string;
  key_prefix: string | null;
  key_hash: string | null;
  is_active: boolean;
  created_at: string;
}

// Hash function using Web Crypto API (SHA-256)
async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const ApiKeysManager = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    api_key: "",
    is_active: true,
  });

  const { toast } = useToast();

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error loading API keys:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar",
        description: "Não foi possível carregar as chaves de API",
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.api_key) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Nome e chave de API são obrigatórios",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Generate hash and prefix for secure storage
      const keyHash = await hashApiKey(formData.api_key);
      const keyPrefix = formData.api_key.substring(0, 8) + "...";

      if (editingKey) {
        // For editing, update metadata only (not the key itself unless changed)
        const updateData: Record<string, unknown> = {
          name: formData.name,
          description: formData.description || null,
          is_active: formData.is_active,
        };

        // Only update key if it was changed
        if (formData.api_key !== editingKey.api_key) {
          updateData.api_key = formData.api_key;
          updateData.key_hash = keyHash;
          updateData.key_prefix = keyPrefix;
        }

        const { error } = await supabase
          .from('api_keys')
          .update(updateData)
          .eq('id', editingKey.id);

        if (error) throw error;
        
        toast({
          title: "Chave atualizada",
          description: "A chave de API foi atualizada com sucesso",
        });
        setNewlyCreatedKey(null);
      } else {
        // For new keys, store with hash and prefix
        const { error } = await supabase
          .from('api_keys')
          .insert({
            user_id: user.id,
            name: formData.name,
            description: formData.description || null,
            api_key: formData.api_key,
            key_hash: keyHash,
            key_prefix: keyPrefix,
            is_active: formData.is_active,
          });

        if (error) throw error;
        
        // Show the key one time only
        setNewlyCreatedKey(formData.api_key);
        
        toast({
          title: "Chave adicionada",
          description: "Copie sua chave agora - ela não será exibida novamente!",
          variant: "default",
        });
      }

      setIsDialogOpen(false);
      setEditingKey(null);
      setFormData({ name: "", description: "", api_key: "", is_active: true });
      loadApiKeys();
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Não foi possível salvar a chave",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta chave de API?")) return;

    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Chave excluída",
        description: "A chave de API foi excluída com sucesso",
      });
      
      loadApiKeys();
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir a chave",
      });
    }
  };

  const handleEdit = (key: ApiKey) => {
    setEditingKey(key);
    setFormData({
      name: key.name,
      description: key.description || "",
      api_key: key.api_key, // Will be masked in UI
      is_active: key.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleToggleActive = async (key: ApiKey) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: !key.is_active })
        .eq('id', key.id);

      if (error) throw error;
      loadApiKeys();
    } catch (error) {
      console.error('Error toggling API key:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o status",
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "Chave copiada para a área de transferência",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível copiar a chave",
      });
    }
  };

  const getDisplayKey = (key: ApiKey): string => {
    // Use key_prefix if available (secure storage), otherwise mask the old key
    if (key.key_prefix) {
      return key.key_prefix;
    }
    // Fallback for legacy keys without prefix
    if (key.api_key.length <= 8) return "••••••••";
    return key.api_key.substring(0, 4) + "••••••••" + key.api_key.substring(key.api_key.length - 4);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Chaves de API</CardTitle>
            <CardDescription>
              Gerencie suas chaves de API para integrações externas
            </CardDescription>
          </div>
          <Button
            onClick={() => {
              setEditingKey(null);
              setFormData({ name: "", description: "", api_key: "", is_active: true });
              setNewlyCreatedKey(null);
              setIsDialogOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar Chave
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Show newly created key alert */}
        {newlyCreatedKey && (
          <Alert className="mb-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <strong>Copie sua chave agora!</strong> Ela não será exibida novamente.
                <code className="ml-2 px-2 py-1 bg-muted rounded text-sm font-mono">
                  {newlyCreatedKey}
                </code>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(newlyCreatedKey)}
                className="ml-2"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copiar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {apiKeys.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma chave de API cadastrada</p>
            <p className="text-sm mt-2">Clique em "Adicionar Chave" para começar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="p-4 border rounded-lg space-y-2 bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{key.name}</h3>
                      <Switch
                        checked={key.is_active}
                        onCheckedChange={() => handleToggleActive(key)}
                        className="scale-75"
                      />
                    </div>
                    {key.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {key.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                        {getDisplayKey(key)}
                      </code>
                      <span className="text-xs text-muted-foreground">
                        (chave armazenada de forma segura)
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(key)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(key.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingKey ? "Editar Chave de API" : "Adicionar Chave de API"}
            </DialogTitle>
            <DialogDescription>
              {editingKey 
                ? "Atualize as informações da chave de API" 
                : "A chave será exibida apenas uma vez após a criação"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="Ex: OpenAI, Google Maps, etc."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descrição opcional da chave"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api_key">
                Chave de API *
                {editingKey && (
                  <span className="text-xs text-muted-foreground ml-2">
                    (deixe o valor atual para manter a chave existente)
                  </span>
                )}
              </Label>
              <Input
                id="api_key"
                type="password"
                placeholder={editingKey ? "Digite uma nova chave para substituir" : "Cole sua chave de API aqui"}
                value={formData.api_key}
                onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Chave ativa</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setEditingKey(null);
                setFormData({ name: "", description: "", api_key: "", is_active: true });
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              <Check className="h-4 w-4 mr-2" />
              {isLoading ? "Salvando..." : editingKey ? "Atualizar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
