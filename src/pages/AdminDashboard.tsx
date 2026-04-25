import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, LogOut, X, Menu, ChevronDown, Upload, Image, Check, PlusCircle } from "lucide-react";
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
  const [productsToAdd, setProductsToAdd] = useState<{
    id: string;
    name: string;
    price: string;
    description: string;
    category: string;
    imageURL: File | string | null;
    imagePreview: string | null;
  }[]>([{
    id: crypto.randomUUID(),
    name: "",
    price: "",
    description: "",
    category: "",
    imageURL: null,
    imagePreview: null,
  }]);

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
        const res = await fetch("https://tailors-backend.onrender.com/products/getallproducts", {
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
    setProductsToAdd([{
      id: crypto.randomUUID(),
      name: "",
      price: "",
      description: "",
      category: "",
      imageURL: null,
      imagePreview: null,
    }]);
    setEditingProduct(null);
    setShowForm(false);
  };

  // Add another product form
  const addAnotherProduct = () => {
    setProductsToAdd([...productsToAdd, {
      id: crypto.randomUUID(),
      name: "",
      price: "",
      description: "",
      category: "",
      imageURL: null,
      imagePreview: null,
    }]);
  };

  // Remove a product form
  const removeProductForm = (id: string) => {
    if (productsToAdd.length > 1) {
      setProductsToAdd(productsToAdd.filter(p => p.id !== id));
    }
  };

  // Update a specific product form
  const updateProductForm = (id: string, field: string, value: any) => {
    setProductsToAdd(productsToAdd.map(p => {
      if (p.id === id) {
        const updated = { ...p, [field]: value };
        if (field === 'imageURL' && value instanceof File) {
          updated.imagePreview = URL.createObjectURL(value);
        }
        return updated;
      }
      return p;
    }));
  };

  // ✅ SUBMIT MULTIPLE PRODUCTS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out products that have at least a name
      const validProducts = productsToAdd.filter(p => p.name.trim() !== "");

      for (const product of validProducts) {
        const formData = new FormData();

        formData.append("name", product.name);
        formData.append("price", Number(product.price).toString());
        formData.append("description", product.description);
        formData.append("category", product.category);

        // ONLY append file if real file exists
        if (product.imageURL instanceof File) {
          formData.append("image", product.imageURL);
        }

        const url = editingProduct
          ? `https://tailors-backend.onrender.com/products/editproducts/${editingProduct._id}`
          : `https://tailors-backend.onrender.com/products/addproducts`;

        const method = editingProduct ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          toast({
            title: "Error",
            description: data.message || "Failed to add product",
            variant: "destructive",
          });
          return;
        }
      }

      toast({
        title: editingProduct ? "Product updated successfully" : `${validProducts.length} product(s) added successfully`,
      });

      const refreshed = await fetch(
        "https://tailors-backend.onrender.com/products/getallproducts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newData = await refreshed.json();
      setProducts(Array.isArray(newData) ? newData : []);

      resetForm();
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

  // ✅ EDIT PRODUCT
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setProductsToAdd([{
      id: crypto.randomUUID(),
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      imageURL: product.imageURL,
      category: product.category || "",
      imagePreview: product.imageURL as string,
    }]);
    setShowForm(true);
  };

  // ✅ DELETE PRODUCT
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
      `https://tailors-backend.onrender.com/products/deleteproducts/${id}`,
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
          <div className="fixed inset-0 bg-foreground/90 z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-xl p-0 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

              <div className="sticky top-0 z-20 bg-card border-b border-border px-4 py-4 flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-foreground">
                  {editingProduct ? "Edit Product" : "Add Products"}
                </h3>

                <button
                  onClick={resetForm}
                  className="text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
                {/* Multiple Product Forms */}
                {productsToAdd.map((product, index) => (
                  <div key={product.id} className="relative bg-secondary/30 rounded-xl p-5 border border-border">
                    {/* Product Number Badge */}
                    <div className="absolute -top-3 left-4 bg-foreground text-background px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Check size={12} />
                      Product {index + 1}
                    </div>

                    {/* Remove Button (only if more than 1 product) */}
                    {productsToAdd.length > 1 && !editingProduct && (
                      <button
                        type="button"
                        onClick={() => removeProductForm(product.id)}
                        className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}

                    <div className="grid gap-4 mt-2">
                      {/* NAME */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Product Name</label>
                        <input
                          value={product.name}
                          onChange={(e) => updateProductForm(product.id, 'name', e.target.value)}
                          placeholder="Enter product name"
                          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* PRICE */}
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Price (₦)</label>
                          <input
                            type="number"
                            value={product.price}
                            onChange={(e) => updateProductForm(product.id, 'price', e.target.value)}
                            placeholder="0.00"
                            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition text-sm"
                          />
                        </div>

                        {/* CATEGORY */}
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</label>
                          <select
                            value={product.category}
                            onChange={(e) => updateProductForm(product.id, 'category', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition text-sm"
                          >
                            <option value="">Select</option>
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                          </select>
                        </div>
                      </div>

                      {/* DESCRIPTION */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description</label>
                        <textarea
                          value={product.description}
                          onChange={(e) => updateProductForm(product.id, 'description', e.target.value)}
                          placeholder="Product description..."
                          rows={6}
                          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition text-sm resize-none"
                        />
                      </div>

                      {/* FILE UPLOAD - NEW STYLING */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Product Image</label>

                        {/* Show preview if image selected */}
                        {(product.imagePreview || (editingProduct && typeof product.imageURL === 'string')) ? (
                          <div className="relative">
                            <div className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg border border-border">
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-background flex-shrink-0">
                                <img
                                  src={product.imagePreview || product.imageURL}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {product.imageURL instanceof File ? product.imageURL.name : 'Current image'}
                                </p>
                                <p className="text-xs text-muted-foreground">Click to change</p>
                              </div>
                              <label className="cursor-pointer p-2 rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity">
                                <Upload size={16} />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => updateProductForm(product.id, 'imageURL', e.target.files?.[0])}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        ) : (
                          /* Upload Area */
                          <label className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-border hover:border-gold hover:bg-secondary/20 transition-all cursor-pointer group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <div className="w-10 h-10 rounded-full bg-secondary group-hover:bg-gold/20 flex items-center justify-center mb-2 transition-colors">
                                <Image className="w-5 h-5 text-muted-foreground group-hover:text-gold transition-colors" />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                <span className="font-semibold text-gold">Click to upload</span> or drag
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => updateProductForm(product.id, 'imageURL', e.target.files?.[0])}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Another Product Button */}
                {!editingProduct && (
                  <button
                    type="button"
                    onClick={addAnotherProduct}
                    className="w-full py-3 rounded-xl border-2 border-dashed border-border hover:border-gold hover:bg-secondary/20 transition-all flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <PlusCircle size={18} />
                    Add Another Product
                  </button>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-all disabled:opacity-60 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding Products...</span>
                    </div>
                  ) : editingProduct ? (
                    "Update Product"
                  ) : (
                    `Add ${productsToAdd.filter(p => p.name.trim()).length || 1} Product(s)`
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