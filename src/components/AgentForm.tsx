import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { callAgent } from "@/lib/agents.functions";
import type { AgentConfig } from "@/lib/agent-config";

export function AgentForm({ config }: { config: AgentConfig }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const call = useServerFn(callAgent);

  const setField = (name: string, v: string) =>
    setValues((prev) => ({ ...prev, [name]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (const f of config.fields) {
      if (f.required && !values[f.name]?.trim()) {
        toast.error(`${f.label} is required`);
        return;
      }
    }
    setLoading(true);
    setResult("");
    try {
      const res = await call({
        data: { agentType: config.slug, inputs: values },
      });
      setResult(res.output);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {config.fields.map((f) => (
              <div key={f.name} className="space-y-2">
                <Label htmlFor={f.name}>{f.label}</Label>
                {f.type === "text" && (
                  <Input
                    id={f.name}
                    value={values[f.name] ?? ""}
                    placeholder={f.placeholder}
                    onChange={(e) => setField(f.name, e.target.value)}
                  />
                )}
                {f.type === "textarea" && (
                  <Textarea
                    id={f.name}
                    value={values[f.name] ?? ""}
                    placeholder={f.placeholder}
                    rows={5}
                    onChange={(e) => setField(f.name, e.target.value)}
                  />
                )}
                {f.type === "select" && (
                  <Select
                    value={values[f.name] ?? ""}
                    onValueChange={(v) => setField(f.name, v)}
                  >
                    <SelectTrigger id={f.name}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {f.options?.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Thinking..." : "Get Result"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Result</CardTitle>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {result}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Fill in the form and click "Get Result".
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
