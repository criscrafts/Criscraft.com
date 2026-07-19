"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const FloatingWhatsAppButton: React.FC<{ whatsappNumber?: string }> = ({ whatsappNumber }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    const numberToUse = whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+9779800000000";
    const message = encodeURIComponent("Hello CrisCrafts, I am browsing your boutique and would love to ask about custom gifts! ✨");
    window.open(`https://wa.me/${numberToUse.replace(/[+]/g, "")}?text=${message}`, "_blank");
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans">
      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center bg-[#25D366] text-white h-14 rounded-full shadow-luxury-lg hover:bg-[#20ba5a] transition-colors duration-300 relative focus:outline-none pl-4 pr-4"
        style={{ minWidth: "56px" }}
        animate={{
          width: isHovered ? "180px" : "56px",
          transition: { duration: 0.3, ease: "easeOut" }
        }}
      >
        <div className="flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap">
          {/* Official WhatsApp Logo SVG */}
          <svg className="w-6 h-6 fill-current flex-shrink-0" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.989 3.3 1.503 4.94 1.505 5.548 0 10.064-4.512 10.068-10.066.002-2.69-1.047-5.216-2.951-7.121C16.84 1.566 14.32.518 11.635.518c-5.547 0-10.065 4.512-10.068 10.068-.001 1.838.544 3.633 1.576 5.228l-1.033 3.77 3.864-1.013zm13.167-7.797c-.288-.144-1.702-.84-1.965-.936-.264-.096-.456-.144-.648.144-.192.288-.744.936-.912 1.128-.168.192-.336.216-.624.072-1.359-.68-2.336-1.213-3.084-2.502-.196-.34.196-.316.562-1.048.06-.12.03-.228-.015-.318-.045-.09-.413-1.02-.576-1.392-.162-.38-.342-.312-.472-.318-.12-.006-.258-.006-.396-.006-.138 0-.36.054-.546.258-.186.204-.708.696-.708 1.7s.732 1.968.834 2.106c.102.138 1.44 2.202 3.492 3.084.488.21 1.15.282 1.542.222.426-.066 1.704-.696 1.944-1.368.24-.672.24-1.248.168-1.368-.072-.12-.264-.192-.552-.336z" />
          </svg>

          {/* Label expands on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-xs uppercase tracking-wider font-bold whitespace-nowrap text-white"
              >
                Chat with us
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </div>
  );
};
