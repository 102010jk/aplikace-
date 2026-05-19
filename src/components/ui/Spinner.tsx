import { motion } from 'framer-motion'

export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <motion.div
      style={{ width: size, height: size }}
      className="rounded-full border-2 border-border border-t-accent"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  )
}
