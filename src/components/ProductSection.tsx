import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Loader2, Eye } from "lucide-react";
import { Product } from "@/lib/types";
import { getWhatsAppLink } from "@/lib/store";
import { getProductImage } from "@/lib/images";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const categories = ["All", "Men", "Women"];

export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // http://localhost:4000
        const res = await fetch("https://tailors-backend.onrender.com/products/getallproducts");
        const data = await res.json();

        const formatted = Array.isArray(data)
          ? data.map((p: any) => ({
            ...p,
            id: p._id, // FIX: MongoDB compatibility
          }))
          : [];

        setProducts(formatted);
      } catch (err) {
        console.log("FETCH ERROR:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section id="products" className="py-20 bg-secondary relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl translate-y-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs uppercase tracking-[0.25em] mb-4 font-body font-medium">
            🔥 Our Collection
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground">
            Handcrafted <span className="italic text-gold">Designs</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Each piece is a masterwork of African artistry, tailored to perfection for your unique style.
          </p>
        </motion.div>

        {/* Category filter */}
        <div className="flex justify-center gap-3 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat
                  ? "bg-foreground text-background shadow-lg"
                  : "bg-card text-muted-foreground hover:bg-card/80 border border-border"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-gold" size={44} />
            <p className="text-muted-foreground text-sm">Loading collection...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-border/50 hover:border-gold/20"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src={getProductImage(product._id, product.imageURL)}
                    alt={product.name}
                    loading="lazy"
                    width={640}
                    height={800}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Overlay */}
                  <div
                    className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-500 flex items-center justify-center cursor-pointer"
                    onClick={() => setPreviewProduct(product)}
                  >
                    <Eye className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
                  </div>

                  {/* Category badge */}
                  {product.category && (
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs uppercase tracking-wider text-foreground font-medium">
                      {product.category}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-1.5">
                    {product.name}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-5 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl font-bold text-gold">
                      ₦{product.price.toLocaleString()}
                    </span>

                    <a
                      href={getWhatsAppLink(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-gold hover:text-accent-foreground transition-all duration-300 shadow-sm hover:shadow-md"
                    // bg-[#25D366]
                    >
                      <MessageCircle size={16} />
                      Order
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Preview Modal */}
        <Dialog open={!!previewProduct} onOpenChange={(open) => !open && setPreviewProduct(null)}>
          <DialogContent className="max-w-3xl p-2 bg-card border-border">
            <DialogTitle className="sr-only">
              {previewProduct?.name ?? "Product preview"}
            </DialogTitle>

            {previewProduct && (
              <div className="flex flex-col">
                <img
                  src={getProductImage(previewProduct._id, previewProduct.imageURL)}
                  alt={previewProduct.name}
                  className="w-full max-h-[75vh] object-contain rounded-lg"
                />

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {previewProduct.name}
                    </h3>
                    <span className="font-display text-lg font-bold text-gold">
                      ₦{previewProduct.price.toLocaleString()}
                    </span>
                  </div>

                  <a
                    href={getWhatsAppLink(previewProduct)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-gold hover:text-accent-foreground transition-all duration-300"
                  >
                    <MessageCircle size={16} />
                    Order Now
                  </a>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}