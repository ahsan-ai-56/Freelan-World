import { motion } from "framer-motion";
import { SiWhatsapp } from "react-icons/si";

export default function FloatingWhatsApp() {
  return (
    <motion.a
      href="https://wa.me/923269496197"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      title="Chat on WhatsApp"
    >
      <SiWhatsapp className="w-8 h-8 group-hover:animate-pulse" />
      <span className="absolute -top-10 bg-black/80 backdrop-blur text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
        Chat on WhatsApp
      </span>
    </motion.a>
  );
}