import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { fetchHistory } from "@/lib/agents.functions";
import { AGENTS } from "@/lib/agent-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/_authenticated/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const [lang, setLang] = useState("english");

  // Load language settings dynamically
  useEffect(() => {
    const saved = localStorage.getItem("app_lang") || "english";
    setLang(saved);

    const handleLangChange = () => {
      setLang(localStorage.getItem("app_lang") || "english");
    };
    window.addEventListener("languageChanged", handleLangChange);
    return () => window.removeEventListener("languageChanged", handleLangChange);
  }, []);

  const fn = useServerFn(fetchHistory);
  const { data, isLoading, error } = useQuery({
    queryKey: ["history"],
    queryFn: () => fn(),
  });

  const getAgentTitle = (agentType: string) => {
    if (lang !== "tamil") {
      return AGENTS[agentType]?.title ?? agentType;
    }
    const map: Record<string, string> = {
      chatbot: "AI விவசாய உதவியாளர்",
      crop: "பயிர் ஆலோசனையாளர்",
      fertilizer: "உர ஆலோசனையாளர்",
      pest: "பூச்சி/நோய் ஆலோசகர்",
      irrigation: "நீர்ப்பாசன ஆலோசனையாளர்",
      weather: "வானிலை ஆலோசகர்",
    };
    if (agentType.startsWith("disease_scan:")) {
      const cropName = agentType.split(":")[1];
      const cropMap: Record<string, string> = {
        tomato: "தக்காளி",
        wheat: "கோதுமை",
        rice: "நெல்",
        cotton: "பருத்தி",
        sugarcane: "கரும்பு",
        coconut: "தென்னை",
        banana: "வாழை",
      };
      return `பயிர் நோய் கண்டறிதல் (${cropMap[cropName] || cropName})`;
    }
    return map[agentType] || agentType;
  };

  const translateInputKey = (key: string) => {
    if (lang !== "tamil") return key.replace(/_/g, " ");
    const map: Record<string, string> = {
      query: "கேள்வி",
      crop_type: "பயிர் வகை",
      soil_type: "மண் வகை",
      growth_stage: "வளர்ச்சி நிலை",
      sowing_season: "விதைப்பு பருவம்",
      geographic_region: "விவசாய மண்டலம்",
      crop: "பயிர்",
      hasImage: "புகைப்படம் உள்ளது",
      hasDescription: "விளக்கம் உள்ளது",
      language: "மொழி",
    };
    return map[key] || key.replace(/_/g, " ");
  };

  const translateInputValue = (val: any) => {
    const valStr = String(val);
    if (lang !== "tamil") return valStr;
    const map: Record<string, string> = {
      true: "ஆம்",
      false: "இல்லை",
      yes: "ஆம்",
      no: "இல்லை",
      alluvial: "வண்டல் மண்",
      black: "கரிசல் மண்",
      red: "செம்மண்",
      sandy: "மணல் மண்",
      vegetative: "வளர்ச்சி நிலை",
      sowing: "விதைப்பு நிலை",
      flowering: "பூக்கும் பருவம்",
      yielding: "விளைச்சல் பருவம்",
      kharif: "காரிஃப் பருவம்",
      rabi: "ரபி பருவம்",
      zaid: "ஜைத் பருவம்",
      tamil: "தமிழ்",
      english: "ஆங்கிலம்",
    };
    return map[valStr] || valStr;
  };

  return (
    <div className="space-y-4 text-left">
      <h1 className="text-2xl font-semibold">
        {lang === "tamil" ? "ஆலோசனை வரலாறு" : "History"}
      </h1>
      <p className="text-sm text-muted-foreground">
        {lang === "tamil" ? "உங்களது கடைசி 10 AI பதிவுகள்." : "Your last 10 queries."}
      </p>

      {isLoading && <p className="text-sm">{lang === "tamil" ? "ஏற்றப்படுகிறது..." : "Loading..."}</p>}
      {error && <p className="text-sm text-destructive">{lang === "tamil" ? "வரலாற்றுப் பதிவுகளை ஏற்றுவதில் தோல்வி." : "Failed to load history."}</p>}

      <div className="space-y-3">
        {data?.history.map((h) => {
          const inputs = h.input_json as Record<string, any>;
          return (
            <Card key={h.id} className="rounded-2xl border-slate-100 bg-white">
              <CardHeader>
                <CardTitle className="text-base flex justify-between items-center text-left">
                  <span className="font-extrabold text-green-900">{getAgentTitle(h.agent_type)}</span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {new Date(h.created_at).toLocaleString(lang === "tamil" ? "ta-IN" : "en-US")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-left">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">
                    {lang === "tamil" ? "உள்ளீடுகள்" : "Inputs"}
                  </p>
                  <ul className="text-xs list-disc pl-4 font-semibold text-slate-700">
                    {Object.entries(inputs).map(([k, v]) => (
                      <li key={k}>
                        <span className="font-medium text-muted-foreground">{translateInputKey(k)}:</span> {translateInputValue(v)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">
                    {lang === "tamil" ? "ஆலோசனை முடிவு" : "Result"}
                  </p>
                  <p className="text-xs whitespace-pre-wrap font-medium leading-relaxed text-slate-800 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">{h.output_text}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {data && data.history.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {lang === "tamil" ? "பதிவுகள் எதுவும் இல்லை." : "No queries yet."}
          </p>
        )}
      </div>
    </div>
  );
}
