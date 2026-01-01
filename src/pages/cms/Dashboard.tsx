import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '@/lib/cms-store';
import { 
  ClipboardCheck, 
  BarChart3, 
  FileText, 
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);

  if (!stats) return null;

  const statCards = [
    {
      label: 'Total Promises',
      value: stats.totalPromises,
      icon: ClipboardCheck,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      link: '/rat-control/cms/promises',
    },
    {
      label: 'Published',
      value: stats.publishedPromises,
      icon: CheckCircle2,
      color: 'text-status-published',
      bgColor: 'bg-status-published/10',
      link: '/rat-control/cms/promises?filter=published',
    },
    {
      label: 'Drafts',
      value: stats.draftPromises,
      icon: FileText,
      color: 'text-status-draft',
      bgColor: 'bg-status-draft/10',
      link: '/rat-control/cms/promises?filter=draft',
    },
    {
      label: 'Indicators',
      value: stats.totalIndicators,
      icon: BarChart3,
      color: 'text-accent-foreground',
      bgColor: 'bg-accent',
      link: '/rat-control/cms/indicators',
    },
  ];

  const statusColors: Record<string, string> = {
    'Not started': 'bg-status-not-started',
    'In progress': 'bg-status-in-progress',
    'Completed': 'bg-status-completed',
    'Stalled': 'bg-status-stalled',
    'Broken': 'bg-status-broken',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of promises and indicators</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="cms-card p-5 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-semibold text-foreground mt-1">{stat.value}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status breakdown */}
        <div className="cms-card p-5">
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            Promise Status Breakdown
          </h2>
          {Object.keys(stats.statusCounts).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${statusColors[status] || 'bg-muted'}`} />
                  <span className="text-sm text-foreground flex-1">{status}</span>
                  <span className="text-sm font-medium text-muted-foreground">{count}</span>
                  <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${statusColors[status] || 'bg-muted-foreground'}`}
                      style={{ width: `${(count / stats.totalPromises) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No promises yet. Import data to get started.</p>
          )}
        </div>

        {/* Categories */}
        <div className="cms-card p-5">
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-primary" />
            Categories
          </h2>
          {Object.keys(stats.categoryCounts).length > 0 ? (
            <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin">
              {Object.entries(stats.categoryCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                    <span className="text-sm text-foreground">{category || 'Uncategorized'}</span>
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No categories yet.</p>
          )}
        </div>
      </div>

      {/* Warnings */}
      {stats.unresolvedReferences > 0 && (
        <div className="cms-card p-4 border-status-stalled/50 bg-status-stalled/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-status-stalled flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Unresolved References</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {stats.unresolvedReferences} indicator{stats.unresolvedReferences !== 1 ? 's' : ''} reference 
                promises that don't exist. Review the indicators list to resolve.
              </p>
              <Link 
                to="/rat-control/cms/indicators?filter=unresolved"
                className="text-sm text-primary hover:underline mt-2 inline-block"
              >
                View unresolved →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="cms-card p-5">
        <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/rat-control/cms/promises/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <ClipboardCheck className="w-4 h-4" />
            New Promise
          </Link>
          <Link
            to="/rat-control/cms/indicators/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            New Indicator
          </Link>
          <Link
            to="/rat-control/cms/import"
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Import CSV
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
