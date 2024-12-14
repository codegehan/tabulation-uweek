'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface fileCardProps {
  file_name: number | string
  isClickable?: boolean
}

export default function FileCard({ file_name, isClickable = false }: fileCardProps) {
  const [isPressed, setIsPressed] = useState(false)

  const cardVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  }

  const cardContent = (
    <motion.div
      className={`bg-white shadow-md overflow-hidden border ${isClickable ? 'cursor-pointer' : ''}`}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      transition={{ duration: 0.3 }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      style={{
        boxShadow: isPressed ? '0 0 0 2px #3b82f6' : 'none'
      }}
    >
      <div className="relative h-48">
        <Image
          className='p-3'
          src="/jrmsu-logo.jpg"
          alt={` ${file_name}`}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <div className="p-4 border-t-2">
        <h2 className="text-xl text-blue-800 font-semibold text-center italic">{file_name}</h2>
      </div>
    </motion.div>
  )

  if (isClickable) {
    localStorage.removeItem('filename');
    localStorage.setItem('filename', String(file_name))
    return (
      <Link href={`/pages/summary`}>
        {cardContent}
      </Link>
    )
  }

  return cardContent
}

