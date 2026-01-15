import { useState, useEffect } from "react";
import { Key, Copy, RefreshCw, AlertTriangle, Trash2, Edit2, Plus, Check, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PlatformKey {
  id: string;
  name: string;
  description: string | null;
  key_prefix: string | null;
  is_active: boolean;
  created_at: string;
}

export const PlatformApiKeysManager = () => {
  const [keys, setKeys] = useState<PlatformKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<string | null>(null);
  const [newlyGeneratedKeyName, setNewlyGeneratedKeyName] = useState<string>("");
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<PlatformKey | null>(null);
  
  // Form states
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyDescription, setNewKeyDescription] = useState("");
  const [editKeyName, setEditKeyName] = useState("");
  const [editKeyDescription, setEditKeyDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Query keys that start with 'platform_' prefix in name to distinguish from other API keys
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, name, description, key_prefix, is_active, created_at')
        .eq('user_id', user.id)
        .like('name', 'platform_%')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setKeys(data || []);
    } catch (error) {
      console.error('Error loading platform keys:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar chaves",
        description: "Não foi possível carregar as chaves de API da plataforma",
      });
    } finally {
      setIsLoading(false);
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

  const hashKey = async (key: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        variant: "destructive",
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para a chave",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const newKey = generateKey();
      const keyHash = await hashKey(newKey);
      const keyPrefix = newKey.substring(0, 8);

      const { error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          name: `platform_${newKeyName.trim()}`,
          description: newKeyDescription.trim() || null,
          api_key: keyPrefix + '***',
          key_hash: keyHash,
          key_prefix: keyPrefix,
          is_active: true,
        });

      if (error) throw error;

      setNewlyGeneratedKey(newKey);
      setNewlyGeneratedKeyName(newKeyName.trim());
      setIsCreateDialogOpen(false);
      setNewKeyName("");
      setNewKeyDescription("");
      await loadKeys();

      toast({
        title: "Chave criada",
        description: "Copie sua chave agora - ela não será exibida novamente!",
      });
    } catch (error) {
      console.error('Error creating key:', error);
      toast({
        variant: "destructive",
        title: "Erro ao criar chave",
        description: error instanceof Error ? error.message : "Não foi possível criar a chave",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditKey = async () => {
    if (!selectedKey || !editKeyName.trim()) {
      toast({
        variant: "destructive",
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para a chave",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({
          name: `platform_${editKeyName.trim()}`,
          description: editKeyDescription.trim() || null,
        })
        .eq('id', selectedKey.id);

      if (error) throw error;

      setIsEditDialogOpen(false);
      setSelectedKey(null);
      await loadKeys();

      toast({
        title: "Chave atualizada",
        description: "O nome e descrição da chave foram atualizados",
      });
    } catch (error) {
      console.error('Error updating key:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar chave",
        description: error instanceof Error ? error.message : "Não foi possível atualizar a chave",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteKey = async () => {
    if (!selectedKey) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', selectedKey.id);

      if (error) throw error;

      setIsDeleteDialogOpen(false);
      setSelectedKey(null);
      await loadKeys();

      toast({
        title: "Chave excluída",
        description: "A chave de API foi excluída permanentemente",
      });
    } catch (error) {
      console.error('Error deleting key:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir chave",
        description: error instanceof Error ? error.message : "Não foi possível excluir a chave",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (key: PlatformKey) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: !key.is_active })
        .eq('id', key.id);

      if (error) throw error;

      await loadKeys();
      toast({
        title: key.is_active ? "Chave desativada" : "Chave ativada",
        description: key.is_active 
          ? "A chave não poderá mais ser usada para autenticação" 
          : "A chave agora pode ser usada para autenticação",
      });
    } catch (error) {
      console.error('Error toggling key status:', error);
      toast({
        variant: "destructive",
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status da chave",
      });
    }
  };

  const handleRegenerateKey = async (key: PlatformKey) => {
    setIsSubmitting(true);
    try {
      const newKey = generateKey();
      const keyHash = await hashKey(newKey);
      const keyPrefix = newKey.substring(0, 8);

      const { error } = await supabase
        .from('api_keys')
        .update({
          api_key: keyPrefix + '***',
          key_hash: keyHash,
          key_prefix: keyPrefix,
        })
        .eq('id', key.id);

      if (error) throw error;

      setNewlyGeneratedKey(newKey);
      setNewlyGeneratedKeyName(key.name.replace('platform_', ''));
      await loadKeys();

      toast({
        title: "Chave regenerada",
        description: "Copie sua nova chave agora - ela não será exibida novamente!",
      });
    } catch (error) {
      console.error('Error regenerating key:', error);
      toast({
        variant: "destructive",
        title: "Erro ao regenerar chave",
        description: error instanceof Error ? error.message : "Não foi possível regenerar a chave",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyKey = () => {
    if (newlyGeneratedKey) {
      navigator.clipboard.writeText(newlyGeneratedKey);
      toast({
        title: "Copiado!",
        description: "Chave copiada para a área de transferência",
      });
    }
  };

  const openEditDialog = (key: PlatformKey) => {
    setSelectedKey(key);
    setEditKeyName(key.name.replace('platform_', ''));
    setEditKeyDescription(key.description || '');
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (key: PlatformKey) => {
    setSelectedKey(key);
    setIsDeleteDialogOpen(true);
  };

  const getDisplayName = (name: string) => {
    return name.replace('platform_', '');
  };

  const getDisplayPrefix = (prefix: string | null) => {
    if (prefix) {
      return prefix + "••••••••••••••••••••••••";
    }
    return "pk_••••••••••••••••••••••••••••";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            <CardTitle>Chaves de API da Plataforma</CardTitle>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Chave
          </Button>
        </div>
        <CardDescription>
          Gerencie suas chaves de API para autenticar requisições aos endpoints da plataforma
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Show newly generated key - ONE TIME ONLY */}
        {newlyGeneratedKey && (
          <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">
                  Copie sua chave "{newlyGeneratedKeyName}" agora!
                </p>
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
                    onClick={handleCopyKey}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setNewlyGeneratedKey(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Carregando chaves...
          </div>
        ) : keys.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Nenhuma chave de API criada ainda
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Key className="h-4 w-4" />
              Criar Primeira Chave
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Chave</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{getDisplayName(key.name)}</p>
                        {key.description && (
                          <p className="text-xs text-muted-foreground">{key.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {getDisplayPrefix(key.key_prefix)}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={key.is_active}
                          onCheckedChange={() => handleToggleActive(key)}
                        />
                        <span className={`text-xs ${key.is_active ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {key.is_active ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRegenerateKey(key)}
                          title="Regenerar chave"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(key)}
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(key)}
                          title="Excluir"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-sm font-medium mb-2">Como usar:</p>
          <code className="block text-xs bg-muted p-3 rounded-lg font-mono">
            Authorization: Bearer {newlyGeneratedKey || "SUA_CHAVE_AQUI"}
          </code>
        </div>
      </CardContent>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Chave de API</DialogTitle>
            <DialogDescription>
              Crie uma nova chave de API para autenticar suas requisições
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="key-name">Nome da Chave *</Label>
              <Input
                id="key-name"
                placeholder="Ex: Produção, Testes, n8n"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="key-description">Descrição (opcional)</Label>
              <Input
                id="key-description"
                placeholder="Ex: Chave usada para integração com n8n"
                value={newKeyDescription}
                onChange={(e) => setNewKeyDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateKey} disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar Chave"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Chave de API</DialogTitle>
            <DialogDescription>
              Altere o nome e a descrição da chave
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-key-name">Nome da Chave *</Label>
              <Input
                id="edit-key-name"
                placeholder="Ex: Produção, Testes, n8n"
                value={editKeyName}
                onChange={(e) => setEditKeyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-key-description">Descrição (opcional)</Label>
              <Input
                id="edit-key-description"
                placeholder="Ex: Chave usada para integração com n8n"
                value={editKeyDescription}
                onChange={(e) => setEditKeyDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditKey} disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Chave de API</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a chave "{selectedKey && getDisplayName(selectedKey.name)}"? 
              Esta ação não pode ser desfeita e todas as integrações que usam esta chave deixarão de funcionar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteKey}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "Excluindo..." : "Excluir Chave"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
