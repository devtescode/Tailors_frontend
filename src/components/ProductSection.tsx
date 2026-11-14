import { useState, type SyntheticEvent } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { AlertCircle, ChevronLeft, ChevronRight, Eye, Loader2, RefreshCw } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import SectionHeading from "@/components/brand/SectionHeading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { errorMessage } from "@/lib/api/client";
import { getProductImage } from "@/lib/images";
import { useProducts } from "@/lib/queries/products.queries";
import {
  buildEnquiryMessage,
  formatNaira,
  productOrderLink,
  whatsappLink,
} from "@/lib/site";
import type { CatalogItem } from "@/lib/types";
import { cn } from "@/lib/utils";

type CategoryFilter = "All" | "Men" | "Women";

const CATEGORIES: readonly CategoryFilter[] = ["All", "Men", "Women"];
const PAGE_SIZE = 6;

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

/** Keep category matching resilient to casing and plural forms from the API. */
function normalizeCategory(value?: string): "Men" | "Women" | null {
  const category = value?.trim().toLowerCase().replace(/[^a-z]/g, "");
  if (!category) return null;
  if (
    category.startsWith("women") ||
    category.startsWith("female") ||
    category.startsWith("lad")
  ) {
    return "Women";
  }
  if (
    category.startsWith("men") ||
    category.startsWith("male") ||
    category.startsWith("gent")
  ) {
    return "Men";
  }
  return null;
}

function handleImageError(
  event: SyntheticEvent<HTMLImageElement>,
  productId: string,
): void {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === "true") return;
  image.dataset.fallbackApplied = "true";
  image.src = getProductImage(productId);
}

function describeProduct(product: CatalogItem): string {
  const description = product.description?.trim();
  if (description) return description;

  const category = normalizeCategory(product.category);
  return `A made-to-measure ${
    category ? category.toLowerCase() : "bespoke"
  } piece, cut and finished by hand in our Osogbo atelier.`;
}

export default function ProductSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [previewProduct, setPreviewProduct] = useState<CatalogItem | null>(null);

  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useProducts();

  const reduceMotion = useReducedMotion();

  const counts: Record<CategoryFilter, number> = {
    All: products.length,
    Men: 0,
    Women: 0,
  };

  for (const product of products) {
    const category = normalizeCategory(product.category);
    if (category) counts[category] += 1;
  }

  const visibleProducts =
    activeCategory === "All"
      ? products
      : products.filter(
          (product) => normalizeCategory(product.category) === activeCategory,
        );
  const pageCount = Math.ceil(visibleProducts.length / PAGE_SIZE);
  const activePage = Math.min(currentPage, Math.max(1, pageCount));
  const paginatedProducts = visibleProducts.slice(
    (activePage - 1) * PAGE_SIZE,
    activePage * PAGE_SIZE,
  );

  const enquiryLink = whatsappLink(
    buildEnquiryMessage(
      activeCategory === "All" ? undefined : `${activeCategory}'s collection`,
    ),
  );

  return (
    <section
      id="collection"
      aria-labelledby="collection-heading"
      className="relative overflow-hidden border-t border-border/60 bg-cream py-20 sm:py-24 lg:py-32"
    >
      <div aria-hidden="true" className="gold-line absolute inset-x-0 top-0 h-px" />

      <div className="container mx-auto">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: EASE }}
          className="grid gap-9 lg:grid-cols-12 lg:items-end lg:gap-8"
        >
          <div className="lg:col-span-7">
            <SectionHeading
              id="collection-heading"
              eyebrow="The collection"
              title={
                <>
                  Pieces made to be{" "}
                  <em className="italic text-burgundy">remembered.</em>
                </>
              }
              description="A considered edit of bespoke and ready-to-wear pieces, cut and finished by hand in our Osogbo atelier. Find the one, then order it directly on WhatsApp."
            />
          </div>

          <div className="border-t border-border/70 pt-6 lg:col-span-4 lg:col-start-9 lg:border-l lg:border-t-0 lg:border-champagne/50 lg:pb-1 lg:pl-8">
            <p className="font-display text-[1.3rem] leading-snug text-ink sm:text-[1.45rem]">
              Every piece begins with a{" "}
              <em className="italic text-burgundy">conversation.</em>
            </p>
            <p className="mt-4 max-w-sm text-[0.92rem] leading-relaxed text-muted-foreground">
              Share the occasion, your measurements or a reference. We will guide
              you through fabric, fit and finish — all on WhatsApp.
            </p>
          </div>
        </motion.div>

        {!isError && (
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-6 sm:mt-12">
            <div
              role="group"
              aria-label="Filter the collection by category"
              className="flex flex-wrap items-center gap-2"
            >
              {CATEGORIES.map((category) => {
                const isActive = activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setActiveCategory(category);
                      setCurrentPage(1);
                    }}
                    aria-pressed={isActive}
                    className={cn(
                      "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 font-body text-[0.62rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 sm:px-5",
                      isActive
                        ? "border-burgundy bg-burgundy text-cream"
                        : "border-border bg-white text-ink-soft hover:border-burgundy/40 hover:text-burgundy",
                    )}
                  >
                    {category}
                    {!isLoading && (
                      <span
                        className={cn(
                          "font-body text-[0.58rem] font-medium tracking-[0.08em]",
                          isActive ? "text-cream/70" : "text-muted-foreground",
                        )}
                      >
                        {counts[category]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="font-body text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              {isLoading
                ? "Preparing today’s edit"
                : "Made to order · Osogbo, Osun State"}
            </p>
          </div>
        )}

        {isLoading ? (
          <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7"
          >
            <span className="sr-only">Loading the collection</span>
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                aria-hidden="true"
                className="overflow-hidden rounded-sm border border-border/70 bg-white"
              >
                <div className="aspect-[4/5] animate-pulse bg-cream-dark" />
                <div className="flex flex-col gap-3 p-5 sm:p-6">
                  <div className="h-3 w-16 animate-pulse rounded-full bg-cream-dark" />
                  <div className="h-4 w-3/4 animate-pulse rounded-full bg-cream-dark" />
                  <div className="h-3 w-full animate-pulse rounded-full bg-cream-dark" />
                  <div className="h-3 w-5/6 animate-pulse rounded-full bg-cream-dark" />
                  <div className="mt-3 h-11 w-full animate-pulse rounded-full bg-cream-dark" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div
            role="alert"
            className="mx-auto mt-10 max-w-lg rounded-sm border border-border/80 bg-white px-6 py-12 text-center sm:mt-12 sm:px-10"
          >
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-burgundy-soft text-burgundy">
              <AlertCircle aria-hidden="true" className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-display text-[1.7rem] leading-tight text-ink">
              We couldn&rsquo;t load the collection
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {errorMessage(error)}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              aria-busy={isFetching}
              className="btn-primary mt-7 w-full sm:w-auto"
            >
              {isFetching ? (
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw aria-hidden="true" className="h-4 w-4" />
              )}
              {isFetching ? "Trying again" : "Try again"}
            </button>
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="mx-auto mt-10 max-w-2xl rounded-sm border border-border/70 bg-white px-6 py-14 text-center sm:mt-12 sm:px-10">
            <span className="eyebrow justify-center text-gold-ink">
              <span aria-hidden="true" className="h-px w-8 bg-champagne" />
              In the atelier
            </span>
            <h3 className="mt-5 font-display text-[1.85rem] leading-tight text-ink sm:text-[2.1rem]">
              {activeCategory === "All"
                ? "The collection is being prepared"
                : `The ${activeCategory.toLowerCase()}'s collection is being prepared`}
            </h3>
            <p className="mx-auto mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
              {activeCategory === "All"
                ? "New pieces are being finished by hand in our Osogbo atelier. Message us and we will let you know as soon as they are ready."
                : `Our ${activeCategory.toLowerCase()}'s pieces are currently being finished. Send us a message and we will share new arrivals with you first.`}
            </p>
            <a
              href={enquiryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-7"
            >
              <FaWhatsapp aria-hidden="true" className="h-4 w-4 shrink-0" />
              Enquire on WhatsApp
            </a>
            <p className="mt-5 font-body text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
              Nationwide delivery from Osogbo, Osun State
            </p>
          </div>
        ) : (
          <motion.ul
            key={`${activeCategory}-${activePage}`}
            variants={gridVariants}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            className="mt-8 grid list-none grid-cols-1 gap-6 p-0 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7"
          >
            {paginatedProducts.map((product) => {
              const categoryLabel = product.category?.trim();
              const description = describeProduct(product);

              return (
                <motion.li
                  key={product._id}
                  variants={cardVariants}
                  className="h-full"
                >
                  <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-border/80 bg-white transition-[border-color,box-shadow] duration-500 ease-out hover:border-champagne hover:shadow-soft focus-within:border-champagne focus-within:shadow-soft">
                    <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
                      <img
                        src={getProductImage(product._id, product.imageURL)}
                        alt={`${product.name}${
                          categoryLabel
                            ? ` — ${categoryLabel.toLowerCase()} piece`
                            : ""
                        } by Style by Zahra`}
                        width={640}
                        height={800}
                        loading="lazy"
                        decoding="async"
                        onError={(event) => handleImageError(event, product._id)}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] group-focus-within:scale-[1.04]"
                      />

                      {categoryLabel && (
                        <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-sm bg-cream/90 px-2.5 py-1 font-body text-[0.55rem] font-semibold uppercase tracking-[0.22em] text-burgundy backdrop-blur-[2px]">
                          {categoryLabel}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => setPreviewProduct(product)}
                        aria-label={`Preview ${product.name}`}
                        className="absolute inset-0 z-10 flex items-end justify-center bg-ink/0 p-4 transition-colors duration-500 hover:bg-ink/10 focus-visible:bg-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
                      >
                        <span className="inline-flex items-center gap-2 rounded-full bg-cream/95 px-3.5 py-2 font-body text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-burgundy shadow-sm transition-all duration-300 sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100">
                          <Eye aria-hidden="true" className="h-3.5 w-3.5" />
                          View piece
                        </span>
                      </button>
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <h3 className="break-words font-display text-[1.2rem] leading-[1.25] text-ink">
                        {product.name}
                      </h3>

                      <p className="mt-3 line-clamp-2 text-[0.9rem] leading-relaxed text-muted-foreground">
                        {description}
                      </p>

                      <div className="mt-auto pt-5">
                        <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-4">
                          <span className="font-display text-[1.15rem] leading-none text-burgundy">
                            {formatNaira(product.price)}
                          </span>
                          <span className="hidden font-body text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:inline">
                            Made to order
                          </span>
                        </div>

                        <a
                          href={productOrderLink(product)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Order ${product.name} on WhatsApp`}
                          className="btn-outline mt-4 w-full"
                        >
                          <FaWhatsapp
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0"
                          />
                          Order on WhatsApp
                        </a>
                      </div>
                    </div>
                  </article>
                </motion.li>
              );
            })}
          </motion.ul>
        )}

        {!isLoading && !isError && pageCount > 1 && (
          <nav aria-label="Collection pages" className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setCurrentPage(Math.max(1, activePage - 1))}
              disabled={activePage === 1}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-white px-4 font-body text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:border-burgundy/40 hover:text-burgundy disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
              Previous
            </button>
            <span aria-live="polite" className="font-body text-xs text-muted-foreground">
              Page {activePage} of {pageCount}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage(Math.min(pageCount, activePage + 1))}
              disabled={activePage === pageCount}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-white px-4 font-body text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:border-burgundy/40 hover:text-burgundy disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </nav>
        )}
      </div>

      <Dialog
        open={previewProduct !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewProduct(null);
        }}
      >
        <DialogContent className="max-h-[92vh] w-[calc(100vw-2rem)] max-w-3xl gap-0 overflow-y-auto rounded-sm border-border/80 bg-white p-0 [&>button:last-child]:right-3 [&>button:last-child]:top-3 [&>button:last-child]:z-20 [&>button:last-child]:grid [&>button:last-child]:h-9 [&>button:last-child]:w-9 [&>button:last-child]:place-items-center [&>button:last-child]:rounded-full [&>button:last-child]:bg-cream/95 [&>button:last-child]:text-ink [&>button:last-child]:opacity-100 [&>button:last-child]:shadow-sm">
          {previewProduct && (
            <div className="grid md:grid-cols-[1.05fr_0.95fr]">
              <div className="flex items-center justify-center bg-cream-dark/70 p-3 sm:p-5">
                <img
                  src={getProductImage(
                    previewProduct._id,
                    previewProduct.imageURL,
                  )}
                  alt={`${previewProduct.name}${
                    previewProduct.category
                      ? ` — ${previewProduct.category.toLowerCase()} piece`
                      : ""
                  } by Style by Zahra`}
                  decoding="async"
                  onError={(event) =>
                    handleImageError(event, previewProduct._id)
                  }
                  className="max-h-[65vh] w-full rounded-sm object-contain"
                />
              </div>

              <div className="flex flex-col border-t border-border/70 p-6 sm:p-8 md:border-l md:border-t-0">
                <span className="eyebrow text-gold-ink">
                  {previewProduct.category?.trim() || "Bespoke"}
                </span>

                <DialogTitle className="mt-4 break-words font-display text-[1.7rem] leading-[1.15] text-ink sm:text-[2rem]">
                  {previewProduct.name}
                </DialogTitle>

                <p className="mt-3 font-display text-[1.35rem] text-burgundy">
                  {formatNaira(previewProduct.price)}
                </p>

                <DialogDescription className="mt-5 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {describeProduct(previewProduct)}
                </DialogDescription>

                <div className="mt-8 border-t border-border/70 pt-6 md:mt-auto">
                  <a
                    href={productOrderLink(previewProduct)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full"
                    aria-label={`Order ${previewProduct.name} on WhatsApp`}
                  >
                    <FaWhatsapp
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0"
                    />
                    Order on WhatsApp
                  </a>
                  <p className="mt-4 text-center font-body text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Made to measure · Nationwide delivery
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
