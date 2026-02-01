import { useState, useEffect, useMemo } from "react";
import { SEO } from "@/components/SEO";
import { getPublishedAppointments, Appointment } from "@/lib/appointments-store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
export default function AppointmentTracker() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function loadAppointments() {
      try {
        const data = await getPublishedAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Failed to load appointments:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadAppointments();
  }, []);

  // Group appointments by section
  const groupedAppointments = useMemo(() => {
    const groups: Record<string, Appointment[]> = {};
    appointments.forEach(apt => {
      const section = apt.section || "Other";
      if (!groups[section]) {
        groups[section] = [];
      }
      groups[section].push(apt);
    });
    return groups;
  }, [appointments]);
  const sections = Object.keys(groupedAppointments);
  return <>
      <SEO title="Mamdani Administration Tracker | NYC Mayor Appointments" description="Track key appointments made by Mayor Zohran Mamdani as they are announced. See who's been appointed to cabinet positions, agency heads, and key administration roles." keywords="Zohran Mamdani appointments, NYC mayor cabinet, mayoral appointments, NYC administration, deputy mayors, city hall appointments" canonical="https://mamdanitracker.nyc/zohran-mamdani-appointment-tracker" ogType="article" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 py-5">
        {/* Hero Section */}
        <div className="mb-6">
          <div className="border-t-4 border-[#0C2788] pt-4 mb-3">
            <h1 className="font-bold text-black tracking-tight" style={{
            fontSize: "40px"
          }}>Appointment Tracker</h1>
          </div>
          <p className="text-base max-w-3xl" style={{
          color: "#374151"
        }}>
            Tracking key appointments as Mayor Zohran Mamdani builds his administration. This page documents who has been appointed to lead city agencies, serve as deputy mayors, and fill other critical positions.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && <div className="text-center py-12">
            <p className="text-gray-500">Loading appointments...</p>
          </div>}

        {/* Empty State */}
        {!isLoading && appointments.length === 0 && <div className="text-center py-12 bg-white border-2 border-gray-300">
            <p className="text-lg text-gray-600 mb-0">No appointments recorded yet.</p>
          </div>}

        {/* Appointments by Section */}
        {!isLoading && sections.length > 0 && <div className="space-y-8">
            {sections.map(section => <div key={section}>
                {/* Section Header */}
                <div className="border-b-2 border-[#0C2788] pb-2 mb-4">
                  <h2 className="font-bold text-black" style={{
              fontSize: "24px"
            }}>
                    {section}
                  </h2>
                </div>

                {/* Appointments Table */}
                <div className="border-2 border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100 border-b-2 border-gray-200">
                        <TableHead className="font-bold text-black uppercase tracking-wide" style={{
                    fontSize: "12px",
                    letterSpacing: "0.05em"
                  }}>
                          Role / Position
                        </TableHead>
                        <TableHead className="font-bold text-black uppercase tracking-wide" style={{
                    fontSize: "12px",
                    letterSpacing: "0.05em"
                  }}>
                          Appointee
                        </TableHead>
                        <TableHead className="font-bold text-black uppercase tracking-wide hidden sm:table-cell" style={{
                    fontSize: "12px",
                    letterSpacing: "0.05em"
                  }}>
                          Former / Current Role
                        </TableHead>
                        <TableHead className="font-bold text-black uppercase tracking-wide hidden md:table-cell" style={{
                    fontSize: "12px",
                    letterSpacing: "0.05em"
                  }}>
                          Key Focus
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupedAppointments[section].map(apt => <TableRow key={apt.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <TableCell className="font-medium text-black py-4">
                            {apt.role}
                          </TableCell>
                          <TableCell className="text-black py-4">
                            {apt.url ? (
                              <a 
                                href={apt.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[#1E3A8A] hover:underline font-medium"
                              >
                                {apt.appointee_name}
                              </a>
                            ) : (
                              apt.appointee_name
                            )}
                          </TableCell>
                          <TableCell className="text-gray-600 py-4 hidden sm:table-cell" style={{
                    fontSize: "14px"
                  }}>
                            {apt.former_role || "—"}
                          </TableCell>
                          <TableCell className="text-gray-600 py-4 hidden md:table-cell" style={{
                    fontSize: "14px"
                  }}>
                            {apt.key_focus || "—"}
                          </TableCell>
                        </TableRow>)}
                    </TableBody>
                  </Table>
                </div>
              </div>)}
          </div>}
      </div>
    </>;
}