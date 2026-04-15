'use client'

import * as React from 'react'

import { motion } from 'motion/react'

export function SidebarToggled(props: React.ComponentProps<typeof motion.svg>) {
  return (
    <motion.svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5 14L5 6C5 5.44772 5.44772 5 6 5L8 5C8.55228 5 9 5.44772 9 6L9 14C9 14.5523 8.55228 15 8 15L6 15C5.44772 15 5 14.5523 5 14Z"
        fill="currentColor"
        style={{ clipPath: 'polygon(0 0, 60% 0, 60% 100%, 0 100%)' }}
      />

      <rect
        x="2"
        y="2"
        width="16"
        height="16"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </motion.svg>
  )
}
