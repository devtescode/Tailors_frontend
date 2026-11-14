import { useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Gem,
  Loader2,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
  Wallet,
} from "lucide-react";

import AdminLayout from "@/components/admin/AdminLayout";
import ProductFormDialog from "@/components/admin/ProductFormDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { errorMessage } from "@/lib/api/client";
import { getFallbackImage, getProductImage } from "@/lib/images";
import {
  useAddProducts,
  useDeleteProduct,
  useEditProduct,
  useProducts,
} from "@/lib/queries/products.queries";
import { formatNaira } from "@/lib/site";
import type { CatalogItem } from "@/lib/types";
import { cn } from "@/lib/utils";

type CategoryFilter = "All" | "Men" | "Women";

const PAGE_SIZE = 8;

const CATEGORY_FILTERS: readonly CategoryFilter[] = ["All", "Men", "Women"];

function ProductThumb({
  product,
  className,
}: {
  product: CatalogItem;
  className?: string;
}) {
  return (
    <img
      src={getProductImage(product.id, product.imageURL)}
      alt={product.name}
      loading="lazy"
      decoding="async"
      className={className}
      onError={(event) => {
        const image = event.currentTarget;
        if (image.dataset.fallback === "true") return;
        image.dataset.fallback = "true";
        image.src = getFallbackImage(product.id);
      }}
    />
  );
}

function CategoryBadge({ category }: { category?: string }) {
  const label = category?.trim() || "Uncategorised";

  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-1 font-body text-[0.56rem] font-semibold uppercase tracking-[0.14em]",
        category === "Men" && "border-burgundy/20 bg-burgundy-soft text-burgundy",
        category === "Women" && "border-gold/30 bg-champagne/20 text-gold-ink",
        category !== "Men" &&
          category !== "Women" &&
          "border-border bg-muted text-muted-foreground",
      )}
    >
      {label}
    </span>
  );
}

function StatSkeleton() {
  return (
    <div className="animate-pulse border border-border/70 bg-white p-5">
      <div className="h-9 w-9 rounded-full bg-cream-dark" />
      <div className="mt-4 h-3 w-20 bg-cream-dark" />
      <div className="mt-2 h-7 w-28 bg-cream-dark" />
    </div>
  );
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const productsQuery = useProducts();
  const addMutation = useAddProducts();
  const editMutation = useEditProduct();
  const deleteMutation = useDeleteProduct();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CatalogItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CatalogItem | null>(null);

  const products = useMemo(() => productsQuery.data ?? [], [productsQuery.data]);

  const stats = useMemo(() => {
    const men = products.filter((product) => product.category === "Men").length;
    const women = products.filter((product) => product.category === "Women").length;
    const value = products.reduce((total, product) => total + product.price, 0);

    return [
      {
        label: "Total pieces",
        value: String(products.length),
        hint: "Live in the collection",
        icon: Package,
      },
      {
        label: "Menswear",
        value: String(men),
        hint: "Pieces for men",
        icon: Users,
      },
      {
        label: "Womenswear",
        value: String(women),
        hint: "Pieces for women",
        icon: Gem,
      },
      {
        label: "Catalogue value",
        value: formatNaira(value),
        hint: "Combined listed price",
        icon: Wallet,
      },
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleProducts = filteredProducts.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const pageNumbers = useMemo(() => {
    if (pageCount <= 5) {
      return Array.from({ length: pageCount }, (_, index) => index + 1);
    }

    const start = Math.max(1, Math.min(currentPage - 2, pageCount - 4));
    return Array.from({ length: 5 }, (_, index) => start + index);
  }, [currentPage, pageCount]);

  const openCreate = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEdit = (product: CatalogItem) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
  };

  const handleSubmit = async (forms: FormData[]) => {
    if (editingProduct) {
      await editMutation.mutateAsync({ id: editingProduct._id, form: forms[0] });
      toast({
        title: "Piece updated",
        description: `${editingProduct.name} is now up to date.`,
      });
    } else {
      const count = await addMutation.mutateAsync(forms);
      toast({
        title: `${count} ${count === 1 ? "piece" : "pieces"} added`,
        description: "The storefront collection has been refreshed.",
      });
    }

    setFormOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteMutation.mutateAsync(deleteTarget._id);
      toast({
        title: "Piece removed",
        description: `${deleteTarget.name} is no longer in the collection.`,
      });
      setDeleteTarget(null);
    } catch (error) {
      toast({
        title: "Could not delete piece",
        description: errorMessage(error),
        variant: "destructive",
      });
    }
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setPage(1);
  };

  const isBusy =
    productsQuery.isPending ||
    addMutation.isPending ||
    editMutation.isPending ||
    deleteMutation.isPending;

  return (
    <AdminLayout
      title="The collection"
      description="Manage the pieces, photography and pricing shown in the Style by Zahra boutique."
      eyebrow="Atelier dashboard"
      actions={
        <>
          <button
            type="button"
            onClick={() => void productsQuery.refetch()}
            disabled={productsQuery.isFetching}
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-border bg-white px-4 font-body text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:border-burgundy/40 hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-60"
          >
            <RefreshCw
              aria-hidden="true"
              className={cn("h-4 w-4", productsQuery.isFetching && "animate-spin")}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button type="button" onClick={openCreate} className="btn-primary">
            <Plus aria-hidden="true" className="h-4 w-4" />
            Add products
          </button>
        </>
      }
    >
      {/* Stats */}
      <section aria-label="Collection statistics">
        <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 xl:grid-cols-4">
          {productsQuery.isPending
            ? Array.from({ length: 4 }, (_, index) => (
                <li key={index}>
                  <StatSkeleton />
                </li>
              ))
            : stats.map((stat) => (
                <li key={stat.label}>
                  <article className="flex h-full flex-col border border-border/70 bg-white p-5">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-champagne/70 bg-burgundy-soft text-burgundy"
                    >
                      <stat.icon className="h-4 w-4" />
                    </span>
                    <p className="mt-4 font-body text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-1.5 font-display text-[1.55rem] leading-none text-ink">
                      {stat.value}
                    </p>
                    <p className="mt-1.5 text-[0.7rem] text-muted-foreground">{stat.hint}</p>
                  </article>
                </li>
              ))}
        </ul>
      </section>

      {/* Collection panel */}
      <section
        aria-label="Product collection"
        className="mt-6 border border-border/70 bg-white shadow-soft"
      >
        <div className="flex flex-col gap-3 border-b border-border/70 p-4 sm:p-5 lg:flex-row lg:items-center">
          <div className="relative w-full lg:max-w-sm">
            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search by name or description"
              className="admin-field pl-10"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:ml-auto">
            <div>
              <label htmlFor="category-filter" className="sr-only">
                Filter by category
              </label>
              <select
                id="category-filter"
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value as CategoryFilter);
                  setPage(1);
                }}
                className="admin-field min-w-[10rem]"
              >
                {CATEGORY_FILTERS.map((filter) => (
                  <option key={filter} value={filter}>
                    {filter === "All" ? "All categories" : filter}
                  </option>
                ))}
              </select>
            </div>

            <p
              aria-live="polite"
              className="shrink-0 font-body text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              {productsQuery.isPending
                ? "Loading"
                : `${filteredProducts.length} ${
                    filteredProducts.length === 1 ? "piece" : "pieces"
                  }`}
            </p>
          </div>
        </div>

        {productsQuery.isError ? (
          <div role="alert" className="px-6 py-16 text-center">
            <span
              aria-hidden="true"
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-destructive/20 bg-destructive/5 text-destructive"
            >
              <AlertCircle className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-display text-xl text-ink">
              We could not load the collection
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              {errorMessage(productsQuery.error)}
            </p>
            <button
              type="button"
              onClick={() => void productsQuery.refetch()}
              className="btn-outline mt-6"
            >
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
              Try again
            </button>
          </div>
        ) : productsQuery.isPending ? (
          <div className="space-y-3 p-4 sm:p-5" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="flex animate-pulse items-center gap-4 border border-border/60 p-3"
              >
                <div className="h-16 w-14 shrink-0 bg-cream-dark" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/3 bg-cream-dark" />
                  <div className="h-2.5 w-2/3 bg-cream-dark" />
                </div>
                <div className="hidden h-3 w-16 bg-cream-dark sm:block" />
              </div>
            ))}
            <span className="sr-only" role="status">
              Loading products…
            </span>
          </div>
        ) : products.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <span
              aria-hidden="true"
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-champagne/70 bg-burgundy-soft text-burgundy"
            >
              <Package className="h-7 w-7" />
            </span>
            <h2 className="mt-5 font-display text-2xl text-ink">
              The collection is waiting
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Add your first piece to begin building the Style by Zahra storefront.
              You can upload several products in one go.
            </p>
            <button type="button" onClick={openCreate} className="btn-primary mt-6">
              <Plus aria-hidden="true" className="h-4 w-4" />
              Add your first piece
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <span
              aria-hidden="true"
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border bg-cream text-muted-foreground"
            >
              <Search className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-display text-xl text-ink">No pieces match</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Try a different search term or category to find the piece you are looking
              for.
            </p>
            <button type="button" onClick={resetFilters} className="btn-outline mt-6">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] border-collapse">
                <caption className="sr-only">
                  Products in the Style by Zahra collection
                </caption>
                <thead>
                  <tr className="border-b border-border/70 bg-cream/60">
                    <th
                      scope="col"
                      className="px-5 py-3.5 text-left font-body text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                    >
                      Piece
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3.5 text-left font-body text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3.5 text-left font-body text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3.5 text-right font-body text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-border/60 transition-colors last:border-0 hover:bg-cream/50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3.5">
                          <ProductThumb
                            product={product}
                            className="h-16 w-14 shrink-0 border border-border/70 object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-display text-[1rem] leading-tight text-ink">
                              {product.name}
                            </p>
                            <p className="mt-1 line-clamp-1 max-w-xs text-[0.76rem] text-muted-foreground">
                              {product.description || "No description yet"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <CategoryBadge category={product.category} />
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-display text-[0.98rem] text-burgundy">
                        {formatNaira(product.price)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(product)}
                            aria-label={`Edit ${product.name}`}
                            className="inline-flex h-9 w-9 items-center justify-center border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-white hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                          >
                            <Pencil aria-hidden="true" className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(product)}
                            aria-label={`Delete ${product.name}`}
                            className="inline-flex h-9 w-9 items-center justify-center border border-transparent text-muted-foreground transition-colors hover:border-destructive/20 hover:bg-destructive/5 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                          >
                            <Trash2 aria-hidden="true" className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="list-none divide-y divide-border/60 p-0 md:hidden">
              {visibleProducts.map((product) => (
                <li key={product.id} className="p-4">
                  <div className="flex gap-3.5">
                    <ProductThumb
                      product={product}
                      className="h-24 w-20 shrink-0 border border-border/70 object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="min-w-0 font-display text-[1.05rem] leading-tight text-ink">
                          {product.name}
                        </h2>
                        <p className="shrink-0 font-display text-[0.92rem] text-burgundy">
                          {formatNaira(product.price)}
                        </p>
                      </div>

                      <div className="mt-2">
                        <CategoryBadge category={product.category} />
                      </div>

                      <p className="mt-2 line-clamp-2 text-[0.76rem] leading-relaxed text-muted-foreground">
                        {product.description || "No description yet"}
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(product)}
                          className="inline-flex min-h-9 items-center gap-1.5 border border-border bg-white px-3 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-burgundy/40 hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                        >
                          <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(product)}
                          className="inline-flex min-h-9 items-center gap-1.5 border border-border bg-white px-3 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                        >
                          <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-border/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-center font-body text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-left">
                Showing {startIndex + 1}–
                {Math.min(startIndex + PAGE_SIZE, filteredProducts.length)} of{" "}
                {filteredProducts.length}
              </p>

              <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="inline-flex h-9 w-9 items-center justify-center border border-border bg-white text-ink transition-colors hover:border-burgundy/40 hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                </button>

                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    aria-label={`Page ${pageNumber}`}
                    aria-current={pageNumber === currentPage ? "page" : undefined}
                    className={cn(
                      "inline-flex h-9 min-w-9 items-center justify-center border px-2 font-body text-[0.68rem] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                      pageNumber === currentPage
                        ? "border-burgundy bg-burgundy text-cream"
                        : "border-border bg-white text-ink hover:border-burgundy/40 hover:text-burgundy",
                    )}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setPage(Math.min(pageCount, currentPage + 1))}
                  disabled={currentPage === pageCount}
                  aria-label="Next page"
                  className="inline-flex h-9 w-9 items-center justify-center border border-border bg-white text-ink transition-colors hover:border-burgundy/40 hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </nav>
            </div>
          </>
        )}
      </section>

      <p className="mt-4 text-[0.66rem] leading-relaxed text-muted-foreground">
        {isBusy
          ? "Finishing your changes…"
          : "Products are ordered on WhatsApp. No card details are collected in this dashboard."}
      </p>

      <ProductFormDialog
        open={formOpen}
        mode={editingProduct ? "edit" : "create"}
        product={editingProduct}
        submitting={addMutation.isPending || editMutation.isPending}
        onOpenChange={handleFormOpenChange}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent className="border-border bg-white sm:rounded-none">
          <AlertDialogHeader>
            <span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-destructive/20 bg-destructive/5 text-destructive"
            >
              <Trash2 className="h-5 w-5" />
            </span>
            <AlertDialogTitle className="font-display text-2xl text-ink">
              Remove this piece?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
              {deleteTarget
                ? `“${deleteTarget.name}” will be removed from the storefront. This cannot be undone.`
                : "This piece will be removed from the storefront."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteMutation.isPending}
              className="border-border bg-white text-ink hover:bg-cream"
            >
              Keep piece
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={(event) => {
                event.preventDefault();
                void handleConfirmDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && (
                <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />
              )}
              Remove piece
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
