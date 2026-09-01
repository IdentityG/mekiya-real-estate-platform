"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface Props {
  user: { name: string; email: string; role: string };
  counts: { pendingVisits: number; newLeads: number };
}

export function AdminMobileNav({ user, counts }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("mekiya:open-mobile-nav", onOpen);
    return () => window.removeEventListener("mekiya:open-mobile-nav", onOpen);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-72 lg:hidden"
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-3 z-10 w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
            <AdminSidebar user={user} counts={counts} onNavigate={() => setOpen(false)} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
