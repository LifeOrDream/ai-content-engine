import { GenerationDashboard } from "@/components/GenerationDashboard/GenerationDashboard";
import { listBlueprints, listRuns } from "@/lib/contentEngine";
import { activeJobsByBlueprint, listJobs } from "@/lib/jobStore";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const activeJobs = activeJobsByBlueprint();
  return (
    <GenerationDashboard
      initialBlueprints={listBlueprints()}
      initialRuns={listRuns(activeJobs)}
      initialJobs={listJobs()}
    />
  );
}
