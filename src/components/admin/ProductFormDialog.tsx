import { useEffect, useRef, useState, type FormEvent } from "react";
import { AlertCircle, ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { errorMessage } from "@/lib/api/client";
import { resolveImageUrl } from "@/lib/images";
import type { CatalogItem } from "@/lib/types";

type Category = "" | "Men" | "Women";

interface RowState {
  key: string;
  name: string;
  price: string;
  category: Category;
  description: string;
  file: File | null;
  preview: string | null;
}

interface ProductFormBodyProps {
  mode: "create" | "edit";
  product?: CatalogItem | null;
  submitting: boolean;
  onSubmit: (forms: FormData[]) => Promise<void>;
  onCancel: () => void;
}

export interface ProductFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  product?: CatalogItem | null;
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (forms: FormData[]) => Promise<void>;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const createKey = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `row-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const makeRow = (product?: CatalogItem | null): RowState => ({
  key: createKey(),
  name: product?.name ?? "",
  price: product ? String(product.price) : "",
  category:
    product?.category === "Men" || product?.category === "Women"
      ? product.category
      : "",
  description: product?.description ?? "",
  file: null,
  preview: product ? resolveImageUrl(product.imageURL) : null,
});

const isRowValid = (row: RowState) => {
  const price = Number(row.price);
  return row.name.trim().length > 0 && Number.isFinite(price) && price > 0;
};

const isRowTouched = (row: RowState) =>
  Boolean(
    row.name.trim() ||
      row.price.trim() ||
      row.description.trim() ||
      row.category ||
      row.file,
  );

function ProductFormBody({
  mode,
  product,
  submitting,
  onSubmit,
  onCancel,
}: ProductFormBodyProps) {
  const [rows, setRows] = useState<RowState[]>(() => [
    makeRow(mode === "edit" ? product : null),
  ]);
  const [formError, setFormError] = useState<string | null>(null);
  const createdUrls = useRef<Set<string>>(new Set());

  // Release every object URL this form created when it closes.
  useEffect(() => {
    const urls = createdUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  const releasePreview = (url: string | null) => {
    if (!url || !url.startsWith("blob:")) return;
    URL.revokeObjectURL(url);
    createdUrls.current.delete(url);
  };

  const updateRow = (key: string, patch: Partial<RowState>) => {
    setFormError(null);
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  };

  const handleFile = (key: string, file?: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Choose an image file such as a JPG, PNG or WebP.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setFormError("Choose an image smaller than 5MB.");
      return;
    }

    const preview = URL.createObjectURL(file);
    createdUrls.current.add(preview);

    setFormError(null);
    setRows((current) =>
      current.map((row) => {
        if (row.key !== key) return row;
        releasePreview(row.preview);
        return { ...row, file, preview };
      }),
    );
  };

  const addRow = () => {
    setFormError(null);
    setRows((current) => [...current, makeRow()]);
  };

  const removeRow = (key: string) => {
    setFormError(null);
    setRows((current) => {
      if (current.length <= 1) return current;
      const target = current.find((row) => row.key === key);
      releasePreview(target?.preview ?? null);
      return current.filter((row) => row.key !== key);
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const relevantRows = mode === "edit" ? rows.slice(0, 1) : rows;
    const hasInvalidRow = relevantRows.some(
      (row) => isRowTouched(row) && !isRowValid(row),
    );
    const validRows = relevantRows.filter(isRowValid);

    if (hasInvalidRow) {
      setFormError("Each piece needs a name and a price greater than 0.");
      return;
    }

    if (validRows.length === 0) {
      setFormError("Add at least one piece with a name and a price greater than 0.");
      return;
    }

    setFormError(null);

    const forms = validRows.map((row) => {
      const form = new FormData();
      form.append("name", row.name.trim());
      form.append("price", String(Number(row.price)));
      form.append("description", row.description.trim());
      form.append("category", row.category);
      if (row.file) form.append("image", row.file);
      return form;
    });

    try {
      await onSubmit(forms);
    } catch (error) {
      setFormError(errorMessage(error));
    }
  };

  const readyCount = rows.filter(isRowValid).length || 1;

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={submitting}>
      <DialogHeader className="sticky top-0 z-10 border-b border-border/80 bg-white px-5 py-5 pr-14 text-left sm:px-7">
        <p className="eyebrow">
          <span aria-hidden="true" className="h-px w-7 bg-champagne" />
          {mode === "edit" ? "Update a piece" : "Grow the collection"}
        </p>
        <DialogTitle className="mt-3 font-display text-2xl leading-tight text-ink sm:text-[1.8rem]">
          {mode === "edit" ? "Edit this piece" : "Add to the collection"}
        </DialogTitle>
        <DialogDescription className="mt-1.5 max-w-xl text-[0.84rem] leading-relaxed text-muted-foreground">
          {mode === "edit"
            ? "Refine the details below. Leave the image untouched to keep the current photograph."
            : "Add one piece or several at once. Each piece appears on the storefront as soon as it is saved."}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5 px-5 py-6 sm:px-7">
        {rows.map((row, index) => (
          <fieldset
            key={row.key}
            className="relative border border-border/80 bg-cream/50 px-4 pb-5 pt-6 sm:px-5"
          >
            <legend className="sr-only">
              Product {index + 1} details
            </legend>

            <div className="absolute left-4 top-0 -translate-y-1/2 bg-burgundy px-2.5 py-1 font-body text-[0.56rem] font-semibold uppercase tracking-[0.2em] text-cream">
              Piece {String(index + 1).padStart(2, "0")}
            </div>

            {mode === "create" && rows.length > 1 && (
              <button
                type="button"
                onClick={() => removeRow(row.key)}
                aria-label={`Remove product ${index + 1}`}
                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-destructive/5 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
              </button>
            )}

            <div className="mt-2 space-y-4">
              <div>
                <label
                  htmlFor={`name-${row.key}`}
                  className="mb-1.5 block font-body text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-ink"
                >
                  Product name
                </label>
                <input
                  id={`name-${row.key}`}
                  value={row.name}
                  onChange={(event) => updateRow(row.key, { name: event.target.value })}
                  placeholder="e.g. The Adire occasion gown"
                  autoComplete="off"
                  className="admin-field"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`price-${row.key}`}
                    className="mb-1.5 block font-body text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-ink"
                  >
                    Price (₦)
                  </label>
                  <input
                    id={`price-${row.key}`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={row.price}
                    onChange={(event) => updateRow(row.key, { price: event.target.value })}
                    placeholder="45000"
                    className="admin-field"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`category-${row.key}`}
                    className="mb-1.5 block font-body text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-ink"
                  >
                    Category
                  </label>
                  <select
                    id={`category-${row.key}`}
                    value={row.category}
                    onChange={(event) =>
                      updateRow(row.key, { category: event.target.value as Category })
                    }
                    className="admin-field"
                  >
                    <option value="">Uncategorised</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor={`description-${row.key}`}
                  className="mb-1.5 block font-body text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-ink"
                >
                  Description
                </label>
                <textarea
                  id={`description-${row.key}`}
                  value={row.description}
                  onChange={(event) =>
                    updateRow(row.key, { description: event.target.value })
                  }
                  placeholder="Fabric, silhouette and the occasion this piece was made for…"
                  rows={3}
                  className="admin-field resize-y"
                />
              </div>

              <div>
                <span className="mb-1.5 block font-body text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-ink">
                  Product image
                </span>

                {row.preview ? (
                  <div className="flex items-center gap-3 border border-border bg-white p-3">
                    <img
                      src={row.preview}
                      alt={`Preview of product ${index + 1}`}
                      className="h-20 w-16 shrink-0 border border-border/70 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        {row.file ? row.file.name : "Current photograph"}
                      </p>
                      <p className="mt-0.5 text-[0.72rem] text-muted-foreground">
                        {row.file ? "New image ready to upload" : "Upload a new file to replace it"}
                      </p>
                      <label
                        htmlFor={`image-${row.key}`}
                        className="mt-2 inline-flex cursor-pointer items-center gap-2 border border-burgundy/25 px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-burgundy transition-colors hover:border-burgundy hover:bg-burgundy-soft"
                      >
                        <ImagePlus aria-hidden="true" className="h-3.5 w-3.5" />
                        Change image
                      </label>
                      <input
                        id={`image-${row.key}`}
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => {
                          handleFile(row.key, event.target.files?.[0]);
                          event.target.value = "";
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor={`image-${row.key}`}
                    className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-border bg-white px-4 py-7 text-center transition-colors hover:border-burgundy/50 hover:bg-burgundy-soft/40"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-champagne/70 bg-burgundy-soft text-burgundy"
                    >
                      <ImagePlus className="h-5 w-5" />
                    </span>
                    <span className="mt-3 text-sm font-medium text-ink">
                      Choose a photograph
                    </span>
                    <span className="mt-1 text-[0.72rem] text-muted-foreground">
                      JPG, PNG or WebP · up to 5MB
                    </span>
                    <input
                      id={`image-${row.key}`}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => {
                        handleFile(row.key, event.target.files?.[0]);
                        event.target.value = "";
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </fieldset>
        ))}

        {mode === "create" && (
          <button
            type="button"
            onClick={addRow}
            className="flex w-full items-center justify-center gap-2 border border-dashed border-border bg-transparent px-4 py-3.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-burgundy/40 hover:bg-burgundy-soft/50 hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Add another piece
          </button>
        )}

        {formError && (
          <p
            role="alert"
            className="flex items-start gap-2 border border-destructive/25 bg-destructive/5 px-3.5 py-3 text-[0.8rem] leading-relaxed text-destructive"
          >
            <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            {formError}
          </p>
        )}
      </div>

      <div className="sticky bottom-0 z-10 flex flex-col-reverse gap-3 border-t border-border/80 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-7">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="btn-outline w-full sm:w-auto"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full sm:w-auto"
        >
          {submitting ? (
            <>
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              Saving
            </>
          ) : mode === "edit" ? (
            "Save changes"
          ) : (
            `Add ${readyCount} ${readyCount === 1 ? "piece" : "pieces"}`
          )}
        </button>
      </div>
    </form>
  );
}

/** Shared create/edit dialog for the admin collection. */
export default function ProductFormDialog({
  open,
  mode,
  product,
  submitting = false,
  onOpenChange,
  onSubmit,
}: ProductFormDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!submitting) onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto border-border bg-white p-0 [&>button:last-child]:right-3 [&>button:last-child]:top-3 [&>button:last-child]:z-30 [&>button:last-child]:grid [&>button:last-child]:h-9 [&>button:last-child]:w-9 [&>button:last-child]:place-items-center [&>button:last-child]:rounded-full [&>button:last-child]:bg-white [&>button:last-child]:text-ink [&>button:last-child]:opacity-100 [&>button:last-child]:shadow-sm sm:rounded-none">
        <ProductFormBody
          key={`${mode}-${product?.id ?? "new"}`}
          mode={mode}
          product={product}
          submitting={submitting}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
