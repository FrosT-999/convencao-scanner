import { useState, useRef } from "react";
import { Upload, File, X, FileText, Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp'
];

const fileSchema = z.object({
  name: z.string(),
  size: z.number().max(MAX_FILE_SIZE, { message: "Arquivo muito grande. Tamanho máximo: 10MB" }),
  type: z.string().refine((type) => ACCEPTED_FILE_TYPES.includes(type), {
    message: "Tipo de arquivo não suportado. Use PDF, DOCX ou imagens (JPG, PNG, WEBP)"
  })
});

export const DocumentUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    try {
      fileSchema.parse({ name: file.name, size: file.size, type: file.type });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Arquivo inválido",
          description: error.errors[0].message,
        });
      }
      return false;
    }
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const validFiles: File[] = [];
    Array.from(newFiles).forEach((file) => {
      if (validateFile(file)) {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
      toast({
        title: "Arquivos adicionados",
        description: `${validFiles.length} arquivo(s) adicionado(s) com sucesso`,
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-5 w-5 text-destructive" />;
    if (type.includes('image')) return <Image className="h-5 w-5 text-accent" />;
    return <File className="h-5 w-5 text-primary" />;
  };

  return (
    <Card className="w-full max-w-2xl shadow-medium">
      <CardContent className="p-6">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border'
          }`}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-base font-medium mb-2">
            Arraste e solte documentos aqui
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            ou clique para selecionar arquivos
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.jpg,.jpeg,.png,.webp"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Selecionar Arquivos
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            PDF, DOCX, JPG, PNG, WEBP - Máximo 10MB por arquivo
          </p>
        </div>

        {files.length > 0 && (
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-medium mb-3">Arquivos anexados:</h3>
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(file.type)}
                  <div className="text-left">
                    <p className="text-sm font-medium truncate max-w-[300px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
