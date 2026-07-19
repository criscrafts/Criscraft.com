"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("CrisCrafts Application Error Boundary caught an exception:", error);
  }, [error]);

  return (
    <div className="min-h-[85vh] bg-warm-ivory flex items-center justify-center font-sans px-6 text-center">
      {/* Soft background ambient shapes */}
      <div className="absolute top-[20%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-pastel-peach/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-pastel-blue/10 blur-[80px] pointer-events-none" />

      <div className="max-w-md flex flex-col items-center gap-6 relative z-10 p-8 rounded-3xl border border-soft-gold/20 bg-soft-cream/30 shadow-luxury-sm">
        <div className="w-16 h-16 rounded-full bg-pastel-peach/80 flex items-center justify-center text-soft-gold shadow-inner mb-1">
          <AlertCircle className="w-7 h-7 text-soft-gold" />
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] tracking-widest uppercase font-bold text-soft-gold">
            Temporary Display Error
          </span>
          <h2 className="font-serif text-3xl font-normal text-deep-slate tracking-wide">
            Something went wrong
          </h2>
          <p className="text-xs text-dark-gray/70 leading-relaxed max-w-sm mx-auto">
            We encountered a temporary rendering issue loading this page. Our boutique engine has logged the event. Please try refreshing.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
          <Button
            variant="primary"
            onClick={() => reset()}
            className="flex-1 py-3"
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Try Again
          </Button>

          <Link href="/shop" passHref className="flex-1">
            <Button variant="outline" className="w-full py-3" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Return to Shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
