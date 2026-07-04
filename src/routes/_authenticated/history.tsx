import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { fetchHistory } from "@/lib/agents.functions";
import { AGENTS } from "@/lib/agent-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const fn = useServerFn(fetchHistory);
  const { data, isLoading, error } = useQuery({
    queryKey: ["history"],
    queryFn: () => fn(),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">History</h1>
      <p className="text-sm text-muted-foreground">Your last 10 queries.</p>

      {isLoading && <p className="text-sm">Loading...</p>}
      {error && <p className="text-sm text-destructive">Failed to load history.</p>}

      <div className="space-y-3">
        {data?.history.map((h) => {
          const cfg = AGENTS[h.agent_type];
          const inputs = h.input_json as Record<string, string>;
          return (
            <Card key={h.id}>
              <CardHeader>
                <CardTitle className="text-base flex justify-between items-center">
                  <span>{cfg?.title ?? h.agent_type}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {new Date(h.created_at).toLocaleString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Inputs</p>
                  <ul className="text-sm list-disc pl-4">
                    {Object.entries(inputs).map(([k, v]) => (
                      <li key={k}><span className="font-medium">{k.replace(/_/g, " ")}:</span> {v}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Result</p>
                  <p className="text-sm whitespace-pre-wrap">{h.output_text}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {data && data.history.length === 0 && (
          <p className="text-sm text-muted-foreground">No queries yet.</p>
        )}
      </div>
    </div>
  );
}
