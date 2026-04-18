import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, LogOut, X } from "lucide-react";
 import Swal from "sweetalert2";


export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

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
      }
    };

    fetchProducts();
  }, [navigate]);

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

          <div className="flex items-center gap-3">
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

          </div>
        </div>

      </main>
    </div>
  );
}