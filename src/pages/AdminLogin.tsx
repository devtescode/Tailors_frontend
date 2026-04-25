import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(true);
  const [checking, setChecking] = useState(true);

  const navigate = useNavigate();
  const { toast } = useToast();

  // 🔹 CHECK IF ADMIN EXISTS
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("https://tailors-backend.onrender.com/admin/status");
        const data = await res.json();
        setAdminExists(data.adminExists);
      } catch (error) {
        console.log(error);
      } finally {
        setChecking(false);
      }
    };

    checkAdmin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!adminExists) {
        // 🔥 REGISTER ADMIN
        const res = await fetch("https://tailors-backend.onrender.com/admin/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          toast({
            title: "Success",
            description: "Admin created successfully. Please login now.",
          });

          setAdminExists(true);
          setEmail("");
          setPassword("");
        } else {
          toast({
            title: "Error",
            description: data.message || "Registration failed",
            variant: "destructive",
          });
        }
      } else {
        // 🔥 LOGIN ADMIN
        const res = await fetch("https://tailors-backend.onrender.com/admin/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        
        const data = await res.json();
        
        if (res.ok) {
          sessionStorage.setItem("token", data.token);

          toast({
            title: "Login Successful",
            description: "Welcome Admin",
          });
          navigate("/admin/dashboard");

        } else {
          toast({
            title: "Login Failed",
            description: data.message || "Invalid credentials",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Server error. Try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 LOADING STATE
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <Lock className="text-gold" size={28} />
          </div>

          <h1 className="font-display text-3xl font-bold text-foreground">
            {adminExists ? "Admin Login" : "Create Admin"}
          </h1>

          <p className="text-muted-foreground text-sm mt-2">
            {adminExists
              ? "Sign in to manage your products"
              : "Create first admin account"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-xl p-8 shadow-sm space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
              placeholder="admin@tailor.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : adminExists
              ? "Sign In"
              : "Create Admin"}
          </button>

          <p className="text-xs text-muted-foreground text-center">
            {adminExists
              ? "Login with your admin credentials"
              : "This will be your only admin account"}
          </p>
        </form>

        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
}