import React from "react";
import Link from "next/link";
import { ArrowLeft, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[85vh] bg-warm-ivory flex items-center justify-center font-sans px-6 text-center">
      {/* Background visual shapes */}
      <div className="absolute top-[20%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-pastel-peach/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-pastel-blue/10 blur-[80px] pointer-events-none" />

      <div className="max-w-md flex flex-col items-center gap-6 relative z-10">
        <div className="w-16 h-16 rounded-full bg-pastel-peach flex items-center justify-center text-soft-gold shadow-inner mb-2 animate-bounce">
          <Gift className="w-7 h-7" />
        </div>
        
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] tracking-widest uppercase font-bold text-soft-gold">
            404 Error
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-deep-slate tracking-wide">
            Creation Not Found
          </h2>
          <p className="text-sm text-charcoal/80 leading-relaxed max-w-sm mx-auto">
            The page or handcrafted creation you are looking for has either been archived or moved. Let's return you to the boutique.
          </p>
        </div>

        <Link href="/shop" passHref>
          <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Boutique Shop
          </Button>
        </Link>
      </div>
    </div>
  );
}
