import { useState, useRef, useEffect } from 'react';
import { importPromisesCSV, importIndicatorsCSV, getImportReports, resolvePromiseReferences } from '@/lib/cms-store';
import { importFirst100DaysCSV } from '@/lib/first100days-store';
import { ImportReport } from '@/types/cms';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  FileText, 
  ClipboardCheck, 
  BarChart3, 
  Calendar,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Import = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [lastReport, setLastReport] = useState<ImportReport | null>(null);
  const [importHistory, setImportHistory] = useState<ImportReport[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importType, setImportType] = useState<'promises' | 'indicators' | 'first100days'>('promises');

  const loadHistory = async () => {
    const reports = await getImportReports();
    setImportHistory(reports);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    setIsImporting(true);

    try {
      const content = await file.text();
      
      let report: ImportReport;
      if (importType === 'promises') {
        report = await importPromisesCSV(content);
      } else if (importType === 'indicators') {
        report = await importIndicatorsCSV(content);
      } else {
        report = await importFirst100DaysCSV(content);
      }

      setLastReport(report);
      loadHistory();

      if (report.errors.length === 0) {
        toast.success(`Import complete: ${report.recordsCreated} created, ${report.recordsUpdated} updated`);
      } else {
        toast.warning(`Import complete with ${report.errors.length} errors`);
      }
    } catch (err) {
      toast.error('Failed to import file');
      console.error(err);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleResolveReferences = async () => {
    const resolved = await resolvePromiseReferences();
    if (resolved > 0) {
      toast.success(`Resolved ${resolved} indicator reference${resolved !== 1 ? 's' : ''}`);
    } else {
      toast.info('No references to resolve');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Import CSV</h1>
        <p className="text-muted-foreground mt-1">
          Import promises or indicators from CSV files
        </p>
      </div>

      {/* Import type selection */}
      <div className="cms-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Select Import Type</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setImportType('promises')}
            className={cn(
              "flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left",
              importType === 'promises'
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className={cn(
              "p-3 rounded-lg",
              importType === 'promises' ? "bg-primary/10" : "bg-muted"
            )}>
              <ClipboardCheck className={cn(
                "w-6 h-6",
                importType === 'promises' ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <p className="font-medium text-foreground">Promises</p>
              <p className="text-sm text-muted-foreground">Import mayoral promises</p>
            </div>
          </button>

          <button
            onClick={() => setImportType('indicators')}
            className={cn(
              "flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left",
              importType === 'indicators'
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className={cn(
              "p-3 rounded-lg",
              importType === 'indicators' ? "bg-primary/10" : "bg-muted"
            )}>
              <BarChart3 className={cn(
                "w-6 h-6",
                importType === 'indicators' ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <p className="font-medium text-foreground">Indicators</p>
              <p className="text-sm text-muted-foreground">Import progress indicators</p>
            </div>
          </button>

          <button
            onClick={() => setImportType('first100days')}
            className={cn(
              "flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left",
              importType === 'first100days'
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className={cn(
              "p-3 rounded-lg",
              importType === 'first100days' ? "bg-primary/10" : "bg-muted"
            )}>
              <Calendar className={cn(
                "w-6 h-6",
                importType === 'first100days' ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <p className="font-medium text-foreground">First 100 Days</p>
              <p className="text-sm text-muted-foreground">Import day entries</p>
            </div>
          </button>
        </div>

        {/* Upload area */}
        <div 
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isImporting ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
            id="csv-upload"
            disabled={isImporting}
          />
          <label 
            htmlFor="csv-upload"
            className="cursor-pointer block"
          >
            <div className="flex flex-col items-center gap-3">
              {isImporting ? (
                <RefreshCw className="w-10 h-10 text-primary animate-spin" />
              ) : (
                <Upload className="w-10 h-10 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium text-foreground">
                  {isImporting ? 'Importing...' : 'Click to upload CSV'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {importType === 'first100days' 
                    ? 'Headers must match First 100 Days CSV schema'
                    : 'Headers must match CSV schema exactly'}
                </p>
              </div>
            </div>
          </label>
        </div>

        {/* Expected headers */}
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Expected CSV headers for {importType}:
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            {importType === 'promises'
              ? 'Category, Headline, Owner agency, Date Promised, Status, Requires state action or cooperation, Targets, Short description, Description, SEO tags, Updates, Source Text, Source URL, Last updated, URL Slugs'
              : importType === 'indicators'
              ? 'Category, Promise, Headline, Description Paragraph, Target, Current, Current Description, Source'
              : 'Day, Date Display, Date ISO, Type, Title, Description, Quote, Quote Attribution, Image URL, Image Caption, Full Text URL, Full Text Label, Embed URL, Sources'}
          </p>
          {importType === 'first100days' && (
            <p className="text-xs text-muted-foreground mt-2">
              <strong>Note:</strong> Multiple rows with the same Day number will create multiple activities for that day. Sources format: "Title1|URL1;Title2|URL2"
            </p>
          )}
        </div>
      </div>

      {/* Last import report */}
      {lastReport && (
        <div className="cms-card p-6">
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-primary" />
            Import Report
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-semibold text-foreground">{lastReport.rowsProcessed}</p>
              <p className="text-xs text-muted-foreground">Rows Processed</p>
            </div>
            <div className="text-center p-3 bg-status-published/10 rounded-lg">
              <p className="text-2xl font-semibold text-status-published">{lastReport.recordsCreated}</p>
              <p className="text-xs text-muted-foreground">Created</p>
            </div>
            <div className="text-center p-3 bg-status-in-progress/10 rounded-lg">
              <p className="text-2xl font-semibold text-status-in-progress">{lastReport.recordsUpdated}</p>
              <p className="text-xs text-muted-foreground">Updated</p>
            </div>
            <div className="text-center p-3 bg-destructive/10 rounded-lg">
              <p className="text-2xl font-semibold text-destructive">{lastReport.errors.length}</p>
              <p className="text-xs text-muted-foreground">Errors</p>
            </div>
          </div>

          {lastReport.errors.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-destructive">Errors:</p>
              <div className="max-h-40 overflow-y-auto scrollbar-thin space-y-1">
                {lastReport.errors.map((error, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm p-2 bg-destructive/5 rounded">
                    <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <span>
                      <span className="font-medium">Row {error.row}:</span> {error.reason}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Utility actions */}
      <div className="cms-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Utilities</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleResolveReferences} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Resolve Promise References
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Re-checks indicator promise references after importing new promises
        </p>
      </div>

      {/* Import history */}
      {importHistory.length > 0 && (
        <div className="cms-card p-6">
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-primary" />
            Import History
          </h2>
          <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
            {importHistory.slice(0, 10).map((report) => (
              <div 
                key={report.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {report.type === 'promises' ? (
                    <ClipboardCheck className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground capitalize">
                      {report.type}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(report.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-status-published">+{report.recordsCreated}</span>
                  <span className="text-status-in-progress">↻{report.recordsUpdated}</span>
                  {report.errors.length > 0 && (
                    <span className="text-destructive flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {report.errors.length}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Import;
