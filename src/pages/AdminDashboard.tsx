import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, LogOut, X, Menu, ChevronDown } from "lucide-react";
 import Swal from "sweetalert2";


export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // const [form, setForm] = useState({
  //   name: "",
  //   price: "",
  //   description: "",
  //   imageURL: "",
  //   category: "",
  // });
  const [form, setForm] = useState<{
  name: string;
  price: string;
  description: string;
  category: string;
  imageURL: File | string | null;
}>({
  name: "",
  price: "",
  description: "",
  category: "",
  imageURL: null,
});

  const navigate = useNavigate();
  const { toast } = useToast();

  const token = sessionStorage.getItem("token");

  // ✅ FETCH PRODUCTS (FIXED SAFE ARRAY)
  useEffect(() => {
    if (!token) {
      navigate("/admin");
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:4000/products/getallproducts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      description: "",
      imageURL: "",
      category: "",
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  // ✅ FIXED SUBMIT (CLOUDINARY READY BACKEND COMPATIBLE)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("price", Number(form.price).toString());
      formData.append("description", form.description);
      formData.append("category", form.category);

      // ONLY append file if real file exists
      if (form.imageURL instanceof File) {
        formData.append("image", form.imageURL);
      }

      const url = editingProduct
        ? `http://localhost:4000/products/editproducts/${editingProduct._id}`
        : `http://localhost:4000/products/addproducts`;

      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: editingProduct
            ? "Product updated successfully"
            : "Product added successfully",
        });

        const refreshed = await fetch(
          "http://localhost:4000/products/getallproducts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newData = await refreshed.json();
        setProducts(Array.isArray(newData) ? newData : []);

        resetForm();
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("SUBMIT ERROR:", err);

      toast({
        title: "Network Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // ✅ FIXED EDIT (_id FIX)
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      imageURL: product.imageURL,
      category: product.category || "",
    });
    setShowForm(true);
  };

  // ✅ FIXED DELETE (_id FIX)
 

const handleDelete = async (id: string) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (!result.isConfirmed) return;

  const res = await fetch(
    `http://localhost:4000/products/deleteproducts/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (res.ok) {
    setProducts((prev) => prev.filter((p: any) => p._id !== id));

    await Swal.fire({
      title: "Deleted!",
      text: "Your product has been deleted.",
      icon: "success",
    });

    toast({ title: "Product deleted" });
  } else {
    Swal.fire({
      title: "Error",
      text: "Failed to delete product",
      icon: "error",
    });
  }
};

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background">


      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Tailor<span className="text-gold">Craft</span> Dashboard
            </h1>
          </div>

          {/* Desktop Menu - Hidden on small screens */}
          <div className="hidden md:flex items-center gap-3">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              View Site
            </a>

            <a
              href="/admin/change-password"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              🔒 Change Password
            </a>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button - Visible only on small screens */}
          <div className="md:hidden relative" ref={menuRef}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
            >
              <Menu size={18} />
              Menu
              <ChevronDown 
                size={16} 
                className={`transition-transform duration-200 ${mobileMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Mobile Dropdown */}
            {mobileMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-card rounded-xl shadow-2xl border border-border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="py-2">
                  <a
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Site
                  </a>
                  
                  <a
                    href="/admin/change-password"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors"
                  >
                    <span className="text-base">🔒</span>
                    Change Password
                  </a>

                  <div className="border-t border-border my-1"></div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Products ({products.length})
          </h2>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-6">
            <div className="bg-card rounded-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">

              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold text-foreground">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h3>

                <button
                  onClick={resetForm}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* NAME */}
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Product name"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-gold outline-none"
                />

                {/* PRICE */}
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="Price"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-gold outline-none"
                />

                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-gold outline-none"
                >
                  <option value="">Select Category</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                </select>

                {/* DESCRIPTION */}
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Description"
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-gold outline-none resize-none"
                />

                {/* FILE UPLOAD */}
                {editingProduct?.imageURL ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Current Image</p>

                    <div className="flex items-center gap-4">
                      <img
                        src={editingProduct.imageURL}
                        alt="product"
                        className="w-20 h-20 rounded-lg object-cover border border-border"
                      />

                      <p className="text-xs text-muted-foreground">
                        You can replace this image below
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground mb-2">
                    ➕ Add product image
                  </div>
                )}

                {/* YOUR INPUT (UNCHANGED) */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      imageURL: e.target.files?.[0] as any,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-foreground file:text-background hover:file:opacity-90"
                />
                {/* SUBMIT BUTTON */}
                {/* <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </button> */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : editingProduct ? (
                    "Update Product"
                  ) : (
                    "Add Product"
                  )}
                </button>

              </form>
            </div>
          </div>
        )}
        <div className="bg-card rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">

            {/* Loading State */}
            {productsLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gold/20 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-muted-foreground font-medium">Loading products...</p>
              </div>
            )}

            {/* Empty State */}
            {!productsLoading && products.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Products Yet</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  You haven't added any products to your inventory yet. Click the button below to add your first product.
                </p>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Plus size={18} />
                  Add Your First Product
                </button>
              </div>
            )}

            {/* Products Table */}
            {!productsLoading && products.length > 0 && (
              <table className="w-full">

              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Image</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Price</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product: any) => (
                  <tr
                    key={product._id}
                    className="border-b border-border last:border-0 hover:bg-secondary/50 transition"
                  >

                    {/* IMAGE */}
                    <td className="px-6 py-4">
                      <img
                        src={product.imageURL}
                        alt={product.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    </td>

                    {/* NAME */}
                    <td className="px-6 py-4 font-medium text-foreground">
                      {product.name}
                    </td>

                    {/* CATEGORY */}
                    {/* <td className="px-6 py-4 text-muted-foreground text-sm">
                        {product.category || "—"}
                      </td> */}
                    <td className="px-6 py-4 text-muted-foreground text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${product.category === "Men"
                          ? "bg-blue-100 text-blue-700"
                          : product.category === "Women"
                            ? "bg-pink-100 text-pink-700"
                            : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {product.category || "—"}
                      </span>
                    </td>
                    {/* PRICE */}
                    <td className="px-6 py-4 font-semibold text-gold">
                      ₦{product.price.toLocaleString()}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">

                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 rounded-lg hover:bg-red-100 text-muted-foreground hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}