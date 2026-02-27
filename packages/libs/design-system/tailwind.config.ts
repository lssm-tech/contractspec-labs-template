import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx}',
    '../*/src/**/*.{ts,tsx}',
    '../*/ui/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        /* Semantic tokens — wired to CSS variables from globals.css.
         * globals.css defines raw hex values (e.g. --background: #fafaf8),
         * so we must NOT wrap them in hsl(). */
        border: 'var(--border, #e8e6e1)',
        input: 'var(--input, #deddd9)',
        ring: 'var(--ring, #2c5f2d)',
        background: 'var(--background, #fafaf8)',
        foreground: 'var(--foreground, #1a1917)',
        primary: {
          DEFAULT: 'var(--primary, #2c5f2d)',
          foreground: 'var(--primary-foreground, #ffffff)',
        },
        secondary: {
          DEFAULT: 'var(--secondary, #6b4fa0)',
          foreground: 'var(--secondary-foreground, #ffffff)',
        },
        destructive: {
          DEFAULT: 'var(--destructive, #dc2626)',
          foreground: 'var(--destructive-foreground, #ffffff)',
        },
        muted: {
          DEFAULT: 'var(--muted, #f6f5f3)',
          foreground: 'var(--muted-foreground, #9c978e)',
        },
        accent: {
          DEFAULT: 'var(--accent, #6b4fa0)',
          foreground: 'var(--accent-foreground, #ffffff)',
        },
        popover: {
          DEFAULT: 'var(--popover, #ffffff)',
          foreground: 'var(--popover-foreground, #1a1917)',
        },
        card: {
          DEFAULT: 'var(--card, #ffffff)',
          foreground: 'var(--card-foreground, #1a1917)',
        },
        success: {
          DEFAULT: 'var(--success, #eef4ee)',
          foreground: 'var(--success-foreground, #2c5f2d)',
        },
        warning: {
          DEFAULT: 'var(--warning, #fdf6e3)',
          foreground: 'var(--warning-foreground, #b5860b)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar, #f6f5f3)',
          foreground: 'var(--sidebar-foreground, #1a1917)',
          primary: 'var(--sidebar-primary, #2c5f2d)',
          'primary-foreground': 'var(--sidebar-primary-foreground, #ffffff)',
          accent: 'var(--sidebar-accent, #eef4ee)',
          'accent-foreground': 'var(--sidebar-accent-foreground, #1a1917)',
          border: 'var(--sidebar-border, #e8e6e1)',
          ring: 'var(--sidebar-ring, #2c5f2d)',
        },
        chart: {
          1: 'var(--chart-1, #2c5f2d)',
          2: 'var(--chart-2, #6b4fa0)',
          3: 'var(--chart-3, #2b6641)',
          4: 'var(--chart-4, #b5860b)',
          5: 'var(--chart-5, #5b5952)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('tailwindcss-animate')],
};

export default config;
