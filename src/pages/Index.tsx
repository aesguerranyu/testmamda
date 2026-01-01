import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardCheck, BarChart3, Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="relative container mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Promise Accountability
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight leading-tight">
              Mamdani Tracker
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl">
              Tracking mayoral promises and measuring progress against commitments. 
              A transparent system for civic accountability.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/rat-control/cms/admin"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                CMS Login
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-card border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <ClipboardCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Promise Tracking</h3>
              <p className="text-muted-foreground">
                Monitor every mayoral commitment with detailed status updates and categorization.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-card border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Progress Indicators</h3>
              <p className="text-muted-foreground">
                Measure concrete progress with quantifiable indicators linked to promises.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-card border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Editorial Control</h3>
              <p className="text-muted-foreground">
                Draft and publish workflow ensures accuracy before public visibility.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            Mamdani Tracker CMS · Civic Accountability Platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
