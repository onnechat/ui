import { cn } from '@/lib/cn'

export function DashedLayout({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-in fade-in duration-500 absolute w-full h-full inset-0 -z-10 pointer-events-none select-none',
        className,
      )}
    >
      <div className="absolute w-full h-full inset-0 px-4 py-0 pointer-events-none">
        <div className="flex justify-between items-center h-full max-w-container mx-auto">
          {[
            'opacity-25 md:opacity-100 bg-foreground/5 w-px h-full',
            'border-r border-foreground/5 border-dashed h-full',
            'hidden md:block border-r border-foreground/5 border-dashed h-full',
            'border-r border-foreground/5 border-dashed h-full',
            'opacity-25 md:opacity-100 bg-foreground/5 w-px h-full',
          ].map((className, index) => (
            <div key={`dashed-line-${index}`} className={className} />
          ))}
        </div>
      </div>
    </div>
  )
}
