'use client'
import { motion } from "framer-motion";

export default function LutmusDetailsPage() {
    return <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}>
        Hello!
    </motion.h1>
}