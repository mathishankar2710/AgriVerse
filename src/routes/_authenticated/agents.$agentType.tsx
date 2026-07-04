import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AGENTS } from "@/lib/agent-config";
import { AgentForm } from "@/components/AgentForm";

export const Route = createFileRoute("/_authenticated/agents/$agentType")({
  component: AgentPage,
  notFoundComponent: () => (
    <div>
      <p>Unknown agent.</p>
      <Link to="/dashboard" className="text-green-700 underline">Back to dashboard</Link>
    </div>
  ),
  loader: ({ params }) => {
    const config = AGENTS[params.agentType];
    if (!config) throw notFound();
    return { config };
  },
});

function AgentPage() {
  const { config } = Route.useLoaderData();
  return (
    <div className="space-y-6">
      <Link to="/dashboard" className="text-sm text-muted-foreground hover:underline">
        ← Dashboard
      </Link>
      <div
        className="relative overflow-hidden rounded-xl bg-cover bg-center h-40 sm:h-52 shadow-sm"
        style={{ backgroundImage: `url(${config.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-green-950/85 via-green-900/40 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-5 text-white">
          <h1 className="text-2xl font-semibold">{config.title}</h1>
          <p className="text-sm text-green-50/90 max-w-2xl">{config.description}</p>
        </div>
      </div>
      <AgentForm config={config} />
    </div>
  );
}
