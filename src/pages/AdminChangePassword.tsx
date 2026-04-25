import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAdminLoggedIn, changeAdminPassword } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Lock, ArrowLeft, Eye, EyeOff, Shield } from "lucide-react";

export default function AdminChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

 useEffect(() => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    navigate("/admin");
  }
}, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (newPassword.length < 6) {
    toast({ title: "New password must be at least 6 characters", variant: "destructive" });
    return;
  }

  if (newPassword !== confirmPassword) {
    toast({ title: "New passwords do not match", variant: "destructive" });
    return;
  }

  setLoading(true);

  try {
    const token = sessionStorage.getItem("token");

    const res = await fetch("http://localhost:4000/admin/changepassword", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast({ title: "Password changed successfully! 🔒" });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast({
        title: "Error",
        description: data.message,
        variant: "destructive",
      });
    }
  } catch (err) {
    console.log(err);
    toast({
      title: "Network error",
      description: "Something went wrong",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
              <Shield className="text-gold" size={24} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Change Password</h1>
              <p className="text-muted-foreground text-sm">Update your admin credentials</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-gold outline-none text-sm"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-gold outline-none text-sm"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {newPassword.length > 0 && newPassword.length < 6 && (
                <p className="text-destructive text-xs mt-1">Must be at least 6 characters</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-gold outline-none text-sm"
                  placeholder="Confirm new password"
                />
              </div>
              {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                <p className="text-destructive text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
            >
              {loading ? "Updating..." : "🔒 Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
