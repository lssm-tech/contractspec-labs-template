import * as React from 'react';
import { Button } from '../button';
import { cn, getUiLocale } from '../utils';

export interface PricingTier {
  name: string;
  price: string;
  tagline?: string;
  features: string[];
  cta?: { label: string; href?: string; onClick?: () => void };
  highlighted?: boolean;
}

export function PricingTable({
  tiers,
  className,
}: {
  tiers: PricingTier[];
  className?: string;
}) {
  const locale = getUiLocale();

  return (
    <section className={cn('mx-auto max-w-6xl py-12', className)}>
      <div
        className={cn(
          'grid grid-cols-1 gap-6',
          tiers.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'
        )}
      >
        {tiers.map((t, idx) => (
          <div
            key={idx}
            className={cn(
              'flex flex-col rounded-lg border p-6',
              t.highlighted && 'border-primary shadow-lg'
            )}
          >
            <div className="text-muted-foreground mb-2 text-base font-medium">
              {t.name}
            </div>
            <div className="text-3xl font-semibold">{t.price}</div>
            {t.tagline && (
              <div className="text-muted-foreground mt-1 text-base">
                {t.tagline}
              </div>
            )}
            <ul className="mt-4 space-y-2 text-base">
              {t.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="bg-primary mt-1 h-1.5 w-1.5 rounded-full" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {t.cta && (
              <div className="mt-6">
                {t.cta.href ? (
                  <Button asChild className="w-full">
                    {}
                    <a href={t.cta.href}>{t.cta.label}</a>
                  </Button>
                ) : (
                  <Button className="w-full" onClick={t.cta.onClick}>
                    {t.cta.label}
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-muted-foreground mt-6 text-center text-base">
        {locale === 'fr'
          ? 'Commencez gratuitement puis passez a une offre superieure selon vos besoins. Essai de 7 jours sur les offres payantes.'
          : locale === 'es'
            ? 'Empieza gratis y mejora cuando necesites mas. Prueba de 7 dias en los planes de pago.'
            : 'Start free, upgrade when you need more. 7-day trial on paid plans.'}
      </p>
    </section>
  );
}
