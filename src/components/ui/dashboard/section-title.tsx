'use client'

import { motion } from 'motion/react'

import { cn } from '@/lib/cn'

import { useIsMobile } from '@/hooks/use-mobile'

const animation = {
  initial: { opacity: 0, y: -16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, delay: 0.5 },
}

export const SectionTitle = ({
  title,
  description,
}: {
  title: string | string[]
  description?: string
}) => {
  const isMobile = useIsMobile()
  const parts = Array.isArray(title) ? title.filter(Boolean) : null

  return (
    <div className="space-y-1">
      <h1 className="font-title text-lg">
        {parts
          ? parts.map((part, i) => {
              const isLast = i === parts.length - 1
              const notCurrentClass =
                'text-muted-foreground animate-fade-in [--duration:0.5s]'

              if (isMobile && !isLast) {
                return null
              }

              return (
                <span key={i}>
                  {i > 0 && !isMobile && (
                    <span className={cn(notCurrentClass, 'mx-2')}>/</span>
                  )}

                  <span className={isLast ? 'chroma-title' : notCurrentClass}>
                    {part}
                  </span>
                </span>
              )
            })
          : title}
      </h1>

      {description && (
        <motion.p {...animation} className="text-muted-foreground">
          {description}
        </motion.p>
      )}
    </div>
  )
}
