import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Cores Primárias - Midnight Abyss Family
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          100: "hsl(var(--primary-100))",
          200: "hsl(var(--primary-200))",
          300: "hsl(var(--primary-300))",
          400: "hsl(var(--primary-400))",
          500: "hsl(var(--primary-500))",
          600: "hsl(var(--primary-600))",
          700: "hsl(var(--primary-700))",
          800: "hsl(var(--primary-800))",
          900: "hsl(var(--primary-900))",
          hover: "hsl(var(--primary-hover))",
          focus: "hsl(var(--primary-focus))",
          active: "hsl(var(--primary-active))",
          disabled: "hsl(var(--primary-disabled))",
        },
        
        // Cores Secundárias - Violet Pulse Family
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          100: "hsl(var(--secondary-100))",
          200: "hsl(var(--secondary-200))",
          300: "hsl(var(--secondary-300))",
          400: "hsl(var(--secondary-400))",
          500: "hsl(var(--secondary-500))",
          600: "hsl(var(--secondary-600))",
          700: "hsl(var(--secondary-700))",
          800: "hsl(var(--secondary-800))",
          900: "hsl(var(--secondary-900))",
          hover: "hsl(var(--secondary-hover))",
          focus: "hsl(var(--secondary-focus))",
          active: "hsl(var(--secondary-active))",
          disabled: "hsl(var(--secondary-disabled))",
        },
        
        // Cores Neutras - Cloud Mist Family
        neutral: {
          50: "hsl(var(--neutral-50))",
          100: "hsl(var(--neutral-100))",
          200: "hsl(var(--neutral-200))",
          300: "hsl(var(--neutral-300))",
          400: "hsl(var(--neutral-400))",
          500: "hsl(var(--neutral-500))",
          600: "hsl(var(--neutral-600))",
          700: "hsl(var(--neutral-700))",
          800: "hsl(var(--neutral-800))",
          900: "hsl(var(--neutral-900))",
        },
        
        // Cores de Ação (CTA) - Aurora Glow Family
        cta: {
          DEFAULT: "hsl(var(--cta))",
          foreground: "hsl(var(--cta-foreground))",
          100: "hsl(var(--cta-100))",
          200: "hsl(var(--cta-200))",
          300: "hsl(var(--cta-300))",
          400: "hsl(var(--cta-400))",
          500: "hsl(var(--cta-500))",
          600: "hsl(var(--cta-600))",
          700: "hsl(var(--cta-700))",
          800: "hsl(var(--cta-800))",
          900: "hsl(var(--cta-900))",
          hover: "hsl(var(--cta-hover))",
          focus: "hsl(var(--cta-focus))",
          active: "hsl(var(--cta-active))",
          disabled: "hsl(var(--cta-disabled))",
        },
        
        // Cores de Feedback
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          100: "hsl(var(--success-100))",
          200: "hsl(var(--success-200))",
          300: "hsl(var(--success-300))",
          400: "hsl(var(--success-400))",
          500: "hsl(var(--success-500))",
          600: "hsl(var(--success-600))",
          700: "hsl(var(--success-700))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          100: "hsl(var(--warning-100))",
          200: "hsl(var(--warning-200))",
          300: "hsl(var(--warning-300))",
          400: "hsl(var(--warning-400))",
          500: "hsl(var(--warning-500))",
          600: "hsl(var(--warning-600))",
          700: "hsl(var(--warning-700))",
        },
        error: {
          100: "hsl(var(--error-100))",
          200: "hsl(var(--error-200))",
          300: "hsl(var(--error-300))",
          400: "hsl(var(--error-400))",
          500: "hsl(var(--error-500))",
          600: "hsl(var(--error-600))",
          700: "hsl(var(--error-700))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
          100: "hsl(var(--info-100))",
          200: "hsl(var(--info-200))",
          300: "hsl(var(--info-300))",
          400: "hsl(var(--info-400))",
          500: "hsl(var(--info-500))",
          600: "hsl(var(--info-600))",
          700: "hsl(var(--info-700))",
        },
        
        // Cores existentes do Shadcn
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      backgroundImage: {
        // Brand Gradients
        'gradient-brand': 'var(--gradient-brand-horizontal)',
        'gradient-brand-diagonal': 'var(--gradient-brand-diagonal)',
        'gradient-brand-reverse': 'var(--gradient-brand-reverse)',
        
        // Primary Gradients
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-primary-soft': 'var(--gradient-primary-soft)',
        'gradient-primary-vertical': 'var(--gradient-primary-vertical)',
        
        // Secondary Gradients
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-secondary-soft': 'var(--gradient-secondary-soft)',
        
        // Radial Gradients
        'gradient-radial-mist': 'var(--gradient-radial-mist)',
        'gradient-radial-glow': 'var(--gradient-radial-glow)',
        'gradient-radial-cosmic': 'var(--gradient-radial-cosmic)',
        
        // Soft Light Gradients
        'gradient-subtle': 'var(--gradient-subtle)',
        'gradient-soft-violet': 'var(--gradient-soft-violet)',
        'gradient-glass': 'var(--gradient-glass)',
        
        // CTA Gradients
        'gradient-cta': 'var(--gradient-cta)',
        'gradient-cta-hover': 'var(--gradient-cta-hover)',
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'medium': 'var(--shadow-medium)',
        'strong': 'var(--shadow-strong)',
        'glow': 'var(--shadow-glow)',
        'cta': 'var(--shadow-cta)',
        'card': 'var(--shadow-card)',
      },
      transitionProperty: {
        'smooth': 'var(--transition-smooth)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px -5px hsl(239 84% 67% / 0.3)" },
          "50%": { boxShadow: "0 0 30px -5px hsl(239 84% 67% / 0.5)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
