import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

type ContentType = "promise" | "first100day";

interface RatifyRedirectProps {
  type: ContentType;
}

const RatifyRedirect = ({ type }: RatifyRedirectProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { user, isCmsUser, isLoading } = useAuth();
  const [resolving, setResolving] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    // Not logged in or not CMS user → send to login with return URL
    if (!user || !isCmsUser) {
      const returnUrl = encodeURIComponent(location.pathname);
      navigate(`/rat-control/cms/admin?returnTo=${returnUrl}`, { replace: true });
      return;
    }

    // Resolve slug to ID and redirect to CMS edit page
    const resolve = async () => {
      try {
        if (type === "promise") {
          const slug = params.slug;
          const { data, error } = await supabase
            .from("promises")
            .select("id")
            .eq("url_slugs", slug || "")
            .maybeSingle();

          if (error || !data) {
            navigate("/rat-control/cms/promises", { replace: true });
            return;
          }
          navigate(`/rat-control/cms/promises/${data.id}`, { replace: true });
        } else if (type === "first100day") {
          const { year, month, day } = params;
          const dateIso = `${year}-${month}-${day}`;
          const { data, error } = await supabase
            .from("first100_days")
            .select("id")
            .eq("date_iso", dateIso)
            .maybeSingle();

          if (error || !data) {
            navigate("/rat-control/cms/first100days", { replace: true });
            return;
          }
          navigate(`/rat-control/cms/first100days/${data.id}`, { replace: true });
        }
      } catch {
        navigate("/rat-control/cms/dashboard", { replace: true });
      } finally {
        setResolving(false);
      }
    };

    resolve();
  }, [isLoading, user, isCmsUser, type, params, navigate, location.pathname]);

  if (isLoading || resolving) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return null;
};

export default RatifyRedirect;
