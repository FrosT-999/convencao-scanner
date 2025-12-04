import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ColorPalette = () => {
  const primaryColors = [
    { name: "Mist", var: "bg-mist", hex: "#F8F8F9" },
    { name: "Deep Ocean", var: "bg-deep-ocean", hex: "#111439" },
    { name: "Twilight", var: "bg-twilight", hex: "#1a1d4a" },
    { name: "Lavender Haze", var: "bg-lavender-haze", hex: "#E8E8ED" },
  ];

  const secondaryColors = [
    { name: "Soft Violet", var: "bg-soft-violet", hex: "#9b87f5" },
    { name: "Electric Indigo", var: "bg-electric-indigo", hex: "#6366f1" },
    { name: "Royal Purple", var: "bg-royal-purple", hex: "#7c3aed" },
    { name: "Cosmic Blue", var: "bg-cosmic-blue", hex: "#3b82f6" },
  ];

  const neutralColors = [
    { name: "Cloud", var: "bg-cloud", hex: "#FAFAFA" },
    { name: "Silver Mist", var: "bg-silver-mist", hex: "#E5E5E5" },
    { name: "Slate Gray", var: "bg-slate-gray", hex: "#6B7280" },
    { name: "Charcoal", var: "bg-charcoal", hex: "#374151" },
    { name: "Midnight", var: "bg-midnight", hex: "#1F2937" },
  ];

  const supportColors = [
    { name: "Ice Blue", var: "bg-ice-blue", hex: "#E0F2FE" },
    { name: "Soft Lilac", var: "bg-soft-lilac", hex: "#F3E8FF" },
    { name: "Warm Cream", var: "bg-warm-cream", hex: "#FEF3C7" },
    { name: "Mint Fresh", var: "bg-mint-fresh", hex: "#D1FAE5" },
  ];

  const feedbackColors = [
    { name: "Success", var: "bg-success", hex: "#10B981" },
    { name: "Warning", var: "bg-warning", hex: "#F59E0B" },
    { name: "Error", var: "bg-error", hex: "#EF4444" },
    { name: "Info", var: "bg-info", hex: "#3B82F6" },
  ];

  const gradients = [
    { name: "Brand Diagonal", class: "bg-gradient-brand-diagonal" },
    { name: "Brand Horizontal", class: "bg-gradient-brand-horizontal" },
    { name: "Soft Light", class: "bg-gradient-soft-light" },
    { name: "Radial Glow", class: "bg-gradient-radial-glow" },
    { name: "Ocean Depth", class: "bg-gradient-ocean-depth" },
  ];

  const ColorSection = ({ title, colors }: { title: string; colors: { name: string; var: string; hex: string }[] }) => (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {colors.map((color) => (
            <div key={color.name} className="space-y-2">
              <div
                className={`h-20 rounded-lg ${color.var} border border-border/30 shadow-sm`}
              />
              <div className="text-sm">
                <p className="font-medium text-foreground">{color.name}</p>
                <p className="text-muted-foreground text-xs">{color.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Paleta de Cores</h1>
            <p className="text-muted-foreground">Sistema de design visual completo</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Primary Colors */}
          <ColorSection title="Cores Primárias" colors={primaryColors} />

          {/* Secondary Colors */}
          <ColorSection title="Cores Secundárias" colors={secondaryColors} />

          {/* Neutral Colors */}
          <ColorSection title="Cores Neutras" colors={neutralColors} />

          {/* Support Colors */}
          <ColorSection title="Cores de Apoio" colors={supportColors} />

          {/* Feedback Colors */}
          <ColorSection title="Cores de Feedback" colors={feedbackColors} />

          {/* Gradients */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Gradientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gradients.map((gradient) => (
                  <div key={gradient.name} className="space-y-2">
                    <div
                      className={`h-24 rounded-lg ${gradient.class} border border-border/30 shadow-sm`}
                    />
                    <p className="text-sm font-medium text-foreground">{gradient.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* UI Combinations */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Combinações de UI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Buttons */}
              <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Botões</h3>
                <div className="flex flex-wrap gap-3">
                  <Button>Primário</Button>
                  <Button variant="secondary">Secundário</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destrutivo</Button>
                </div>
              </div>

              {/* Cards Preview */}
              <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-card border border-border shadow-sm">
                    <p className="font-medium text-card-foreground">Card Padrão</p>
                    <p className="text-sm text-muted-foreground">Texto secundário</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted border border-border">
                    <p className="font-medium text-foreground">Card Muted</p>
                    <p className="text-sm text-muted-foreground">Texto secundário</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-brand-diagonal text-white">
                    <p className="font-medium">Card Gradiente</p>
                    <p className="text-sm opacity-80">Texto secundário</p>
                  </div>
                </div>
              </div>

              {/* Text Hierarchy */}
              <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Hierarquia de Texto</h3>
                <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-foreground">Título Principal</p>
                  <p className="text-lg font-semibold text-foreground">Subtítulo</p>
                  <p className="text-base text-foreground">Texto normal do corpo</p>
                  <p className="text-sm text-muted-foreground">Texto secundário/auxiliar</p>
                  <p className="text-xs text-muted-foreground/70">Texto pequeno/caption</p>
                </div>
              </div>

              {/* Alerts */}
              <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Alertas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-success/10 border border-success/30 text-success">
                    ✓ Operação realizada com sucesso
                  </div>
                  <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 text-warning">
                    ⚠ Atenção: verifique os dados
                  </div>
                  <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error">
                    ✕ Erro ao processar requisição
                  </div>
                  <div className="p-3 rounded-lg bg-info/10 border border-info/30 text-info">
                    ℹ Informação importante
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Variations */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Variações de Cores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2 text-muted-foreground">Deep Ocean (Variações)</p>
                  <div className="flex gap-2">
                    <div className="flex-1 h-12 rounded bg-deep-ocean-light-30" title="+30%" />
                    <div className="flex-1 h-12 rounded bg-deep-ocean-light-20" title="+20%" />
                    <div className="flex-1 h-12 rounded bg-deep-ocean-light-10" title="+10%" />
                    <div className="flex-1 h-12 rounded bg-deep-ocean" title="Base" />
                    <div className="flex-1 h-12 rounded bg-deep-ocean-dark-10" title="-10%" />
                    <div className="flex-1 h-12 rounded bg-deep-ocean-dark-20" title="-20%" />
                    <div className="flex-1 h-12 rounded bg-deep-ocean-dark-30" title="-30%" />
                  </div>
                  <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="flex-1 text-center">+30%</span>
                    <span className="flex-1 text-center">+20%</span>
                    <span className="flex-1 text-center">+10%</span>
                    <span className="flex-1 text-center">Base</span>
                    <span className="flex-1 text-center">-10%</span>
                    <span className="flex-1 text-center">-20%</span>
                    <span className="flex-1 text-center">-30%</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2 text-muted-foreground">Soft Violet (Variações)</p>
                  <div className="flex gap-2">
                    <div className="flex-1 h-12 rounded bg-soft-violet-light-30" title="+30%" />
                    <div className="flex-1 h-12 rounded bg-soft-violet-light-20" title="+20%" />
                    <div className="flex-1 h-12 rounded bg-soft-violet-light-10" title="+10%" />
                    <div className="flex-1 h-12 rounded bg-soft-violet" title="Base" />
                    <div className="flex-1 h-12 rounded bg-soft-violet-dark-10" title="-10%" />
                    <div className="flex-1 h-12 rounded bg-soft-violet-dark-20" title="-20%" />
                    <div className="flex-1 h-12 rounded bg-soft-violet-dark-30" title="-30%" />
                  </div>
                  <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="flex-1 text-center">+30%</span>
                    <span className="flex-1 text-center">+20%</span>
                    <span className="flex-1 text-center">+10%</span>
                    <span className="flex-1 text-center">Base</span>
                    <span className="flex-1 text-center">-10%</span>
                    <span className="flex-1 text-center">-20%</span>
                    <span className="flex-1 text-center">-30%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;
