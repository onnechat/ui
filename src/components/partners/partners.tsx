import { cn } from '@/lib/cn';

import { Marquee, MarqueeContent, MarqueeItem } from '@/components/ui/marquee';

export interface Partner {
  name: string;
  logo: string;
  handle?: string;
}

export interface PartnersProps {
  className?: string;
  partners: Partner[];
  brandName?: string;
}

export const Partners = ({
  className,
  partners,
  brandName = 'Our Brand',
}: PartnersProps) => {
  const mask =
    'linear-gradient(to right, transparent, black 35%, black 65%, transparent)';

  return (
    <Marquee className="min-h-[68px] sm:min-h-[72px]">
      <MarqueeContent
        className={cn('group animate-fade-in', className)}
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        {partners.map((partner, index) => {
          const url = partner.handle ? `@${partner.handle}` : undefined;
          const title = `${partner.name} recomenda a ${brandName}`;

          return (
            <MarqueeItem
              key={`${partner.name}-${index}`}
              {...(url && { href: url })}
              title={partner.name}
              aria-label={title}
              className={cn(
                'flex h-[68px] sm:h-[72px] flex-col items-center justify-center gap-2 shrink-0 px-4 sm:px-8 md:px-12',
                'group-has-[div:hover]:opacity-25 group-has-[div:hover]:grayscale hover:opacity-100! hover:grayscale-0! transition-all duration-200',
                url && 'cursor-pointer hover:scale-105',
              )}
            >
              <div className="w-20 h-10 sm:w-24 sm:h-12 flex items-center justify-center">
                <img
                  width={120}
                  height={80}
                  src={partner.logo}
                  alt={partner.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain pointer-events-none select-none transition-all duration-300 grayscale-100 brightness-0 dark:invert"
                />
              </div>

              <div className="sr-only">{title}</div>
            </MarqueeItem>
          );
        })}
      </MarqueeContent>
    </Marquee>
  );
};
