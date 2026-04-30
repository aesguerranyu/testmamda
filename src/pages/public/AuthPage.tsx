import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";

const BOROUGHS = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island", "Outside NYC"];

const signupSchema = z.object({
  display_name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  borough: z.string().min(1, "Please select a borough"),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(1, "Password is required").max(72),
});

export default function AuthPage() {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirect") || "/promises";
  const initialMode = params.get("mode") === "login" ? "login" : "signup";

  const [mode, setMode] = useState<"signup" | "login">(initialMode);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    display_name: "",
    borough: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true });
  }, [user, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    if (mode === "signup") {
      const parsed = signupSchema.safeParse(form);
      if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        parsed.error.issues.forEach((i) => {
          fieldErrors[i.path[0] as string] = i.message;
        });
        setErrors(fieldErrors);
        setSubmitting(false);
        return;
      }
      const { error } = await signUp(parsed.data.email, parsed.data.password, {
        display_name: parsed.data.display_name,
        borough: parsed.data.borough,
      });
      if (error) {
        toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome!", description: "Your account is ready." });
      }
    } else {
      const parsed = loginSchema.safeParse({ email: form.email, password: form.password });
      if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        parsed.error.issues.forEach((i) => {
          fieldErrors[i.path[0] as string] = i.message;
        });
        setErrors(fieldErrors);
        setSubmitting(false);
        return;
      }
      const { error } = await signIn(parsed.data.email, parsed.data.password);
      if (error) {
        toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <SEO
        title={mode === "signup" ? "Sign up | Mamdani Tracker" : "Sign in | Mamdani Tracker"}
        description="Create a reader account to mark priorities and signal your views on Mayor Mamdani's promises."
      />
      <div className="max-w-md mx-auto bg-white border-2 border-gray-200 p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-[#0C2788] mb-2">
          {mode === "signup" ? "Create reader account" : "Sign in"}
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          {mode === "signup"
            ? "Required to mark priorities and add signals. Free, takes 30 seconds."
            : "Sign in to continue adding signals."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-1">
                  Display name
                </label>
                <input
                  type="text"
                  value={form.display_name}
                  onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 focus:border-[#0C2788] outline-none"
                  maxLength={60}
                />
                {errors.display_name && <p className="text-xs text-[#EE352E] mt-1">{errors.display_name}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-1">
                  Borough
                </label>
                <select
                  value={form.borough}
                  onChange={(e) => setForm({ ...form, borough: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 focus:border-[#0C2788] outline-none bg-white"
                >
                  <option value="">Select a borough</option>
                  {BOROUGHS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                {errors.borough && <p className="text-xs text-[#EE352E] mt-1">{errors.borough}</p>}
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 focus:border-[#0C2788] outline-none"
              maxLength={255}
              autoComplete="email"
            />
            {errors.email && <p className="text-xs text-[#EE352E] mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 focus:border-[#0C2788] outline-none"
              maxLength={72}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
            {errors.password && <p className="text-xs text-[#EE352E] mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#0C2788] text-white font-bold uppercase tracking-wide hover:bg-[#1436B3] transition-colors disabled:opacity-60"
          >
            {submitting ? "Working..." : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t-2 border-gray-100 text-center text-sm text-gray-600">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-[#0C2788] font-bold hover:underline"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              New here?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-[#0C2788] font-bold hover:underline"
              >
                Create an account
              </button>
            </>
          )}
        </div>

        <div className="mt-4 text-center">
          <Link to="/promises" className="text-xs text-gray-500 hover:text-[#0C2788] uppercase tracking-wide font-bold">
            ← Back to promises
          </Link>
        </div>
      </div>
    </div>
  );
}
