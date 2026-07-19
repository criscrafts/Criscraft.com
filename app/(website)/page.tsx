import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Star, ShieldCheck, Camera, Heart } from "lucide-react";
import { getProducts, getCategories, getFAQs, getTestimonials, getHeroData } from "@/lib/sanity";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Button } from "@/components/ui/button";

export const revalidate = 3600; // Revalidate page cache every hour

export default async function HomePage() {
  // Fetch data concurrently on the server
  const [products, categories, faqs, testimonials, heroData] = await Promise.all([
    getProducts(),
    getCategories(),
    getFAQs(),
    getTestimonials(),
    getHeroData(),
  ]);

  // Display only bestsellers/featured on home
  const featuredProducts = products.some((p) => p.featured)
    ? products.filter((p) => p.featured)
    : products.slice(0, 3);

  const instagramPosts = [
    {
      id: "ig-1",
      image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80",
      title: "Hand-curled satin rose bouquet assembly",
    },
    {
      id: "ig-2",
      image: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&w=600&q=80",
      title: "Gold champagne ribbon bouquet in snow wrap",
    },
    {
      id: "ig-3",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
      title: "Single rose crochet stem detailing",
    },
    {
      id: "ig-4",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
      title: "Surprise luxury hamper box packaging",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Immersive Hero Banner */}
      <Hero heroData={heroData} products={products} />

      {/* 2. Brand Value Proposition Ribbon */}
      <section className="bg-soft-cream py-8 border-y border-soft-gold/15">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-soft-gold/20 font-sans">
          <div className="flex flex-col items-center justify-center gap-2 py-4 md:py-0">
            <Sparkles className="w-5 h-5 text-soft-gold" />
            <h4 className="text-sm font-semibold text-deep-slate uppercase tracking-wider">100% Hand-Finished</h4>
            <p className="text-xs text-dark-gray/80 max-w-[200px]">Shaped, stitched, and detailed by hands that care.</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 py-4 md:py-0">
            <Star className="w-5 h-5 text-soft-gold" />
            <h4 className="text-sm font-semibold text-deep-slate uppercase tracking-wider">Emotional Customization</h4>
            <p className="text-xs text-dark-gray/80 max-w-[200px]">Tailor rose counts, wrapping paper, and custom notes.</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 py-4 md:py-0">
            <ShieldCheck className="w-5 h-5 text-soft-gold" />
            <h4 className="text-sm font-semibold text-deep-slate uppercase tracking-wider">Guaranteed Quality</h4>
            <p className="text-xs text-dark-gray/80 max-w-[200px]">Premium threads and presentation boxes that endure.</p>
          </div>
        </div>
      </section>

      {/* 3. Browse by Category Grid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-warm-ivory bg-artisan-grid border-b border-soft-gold/10" id="categories">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] tracking-widest uppercase font-bold text-soft-gold">
                Artisan Catalog
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-deep-slate leading-tight">
                Browse our curated <br />
                artisan categories
              </h2>
            </div>
            <Link href="/shop" className="text-sm uppercase tracking-widest font-bold text-soft-gold hover:text-deep-slate flex items-center gap-1.5 transition-colors duration-300">
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <Link key={cat._id} href={`/shop?category=${cat.slug}`}>
                <div className="group relative rounded-[28px] overflow-hidden aspect-[4/3] shadow-luxury-sm hover:shadow-luxury border border-soft-gold/10 hover:-translate-y-1 transition-all duration-500">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-w-768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-soft-cream" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-slate/75 via-deep-slate/15 to-transparent transition-opacity duration-500 group-hover:from-deep-slate/85" />
                  
                  <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-1.5 text-warm-ivory font-sans text-left">
                    <h3 className="font-serif text-xl sm:text-2xl font-normal tracking-wide">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-warm-ivory/80 leading-normal line-clamp-2 max-w-xs font-light">
                      {cat.description || "Individually handcrafted items designed for meaningful gifting."}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Editorial Brand Story & Process */}
      <section className="py-12 sm:py-16 lg:py-20 bg-soft-cream/60 border-b border-soft-gold/10 relative overflow-hidden" id="our-story">
        <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-pastel-peach/10 blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 grid grid-cols-12 gap-4 relative">
            <div className="col-span-8 relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-luxury border border-soft-gold/15">
              <Image
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
                alt="Crocheting with cotton yarn detail"
                fill
                className="object-cover"
                sizes="(max-w-768px) 100vw, 33vw"
              />
            </div>
            <div className="col-span-4 relative aspect-[1/1] rounded-[24px] overflow-hidden shadow-luxury border border-soft-gold/15 mt-[40%]">
              <Image
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
                alt="CrisCrafts gift box detailing"
                fill
                className="object-cover"
                sizes="(max-w-768px) 50vw, 15vw"
              />
            </div>
            <div className="absolute -bottom-4 right-12 glassmorphism px-4 py-2.5 rounded-xl border border-soft-gold/15 shadow-luxury z-10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-soft-gold animate-ping" />
              <span className="text-[9px] uppercase tracking-wider font-bold text-deep-slate font-sans">
                Authentic Craftsmanship
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-start gap-6 font-sans text-left">
            <span className="text-[10px] tracking-widest uppercase font-bold text-soft-gold">
              The CrisCrafts Process
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-deep-slate leading-tight">
              Heart-led, hand-finished, <br />
              and uniquely yours
            </h2>
            <div className="w-12 h-[1px] bg-soft-gold mt-1" />
            
            <p className="text-sm sm:text-base leading-relaxed text-charcoal/80">
              At CrisCrafts, we believe that gifts shouldn't just be objects; they should be physical manifestations of your stories, affection, and milestones. Every item we design is crafted loop by loop and ribbon by ribbon by hand, ensuring that no two pieces are identical.
            </p>
            <p className="text-sm leading-relaxed text-charcoal/70">
              From our vibrant, everlasting Ribbon Bouquets to the whimsical loops of our crochet plushies, we use only high-grade organic yarns, premium structured wrapping paper, and custom accents. We inject emotional warmth and luxury presentation into every single delivery box.
            </p>
            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <Link href="/shop" passHref>
                <Button variant="primary">Shop the Studio</Button>
              </Link>
              <Link href="/#faq" passHref>
                <Button variant="ghost">How it Works</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Artisan Showcase (Top 3 Bestsellers) */}
      <section className="py-12 sm:py-16 lg:py-20 bg-warm-ivory bg-artisan-grid border-b border-soft-gold/10" id="featured-products">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-xl mx-auto mb-16 flex flex-col gap-4">
            <span className="text-[10px] tracking-widest uppercase font-bold text-soft-gold">
              Signature Collection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-deep-slate">
              Bestsellers of the boutique
            </h2>
            <p className="text-xs text-dark-gray/80 max-w-[320px] mx-auto leading-relaxed">
              Explore our most loved handcrafted creations, customized to order and shipped with care.
            </p>
            <div className="w-12 h-[1px] bg-soft-gold mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/shop" passHref>
              <Button variant="outline" size="lg">
                View Entire Catalogue
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <Testimonials testimonials={testimonials} />

      {/* 7. Instagram & Studio Social Proof Showcase */}
      <section className="py-12 sm:py-16 lg:py-20 bg-soft-cream/40 border-b border-soft-gold/10 font-sans">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div className="flex flex-col items-center gap-3 mb-12">
            <div className="inline-flex items-center gap-2 text-soft-gold">
              <Camera className="w-5 h-5" />
              <span className="text-[10px] tracking-widest uppercase font-bold">@criscrafts_official</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-deep-slate">
              Follow our studio journey
            </h2>
            <p className="text-xs text-dark-gray/70 max-w-md">
              Behind the scenes snippets of bouquet wrapping, yarn selection, and custom order packaging.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {instagramPosts.map((post) => (
              <div
                key={post.id}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-soft-gold/15 shadow-luxury-sm group cursor-pointer"
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-w-768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-deep-slate/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-warm-ivory gap-2">
                  <Heart className="w-5 h-5 fill-current text-rose-300" />
                  <span className="text-xs font-medium">View Craft</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Support & FAQs */}
      <FAQ faqs={faqs} />
    </div>
  );
}
