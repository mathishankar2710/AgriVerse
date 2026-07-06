import { useState, useEffect } from "react";
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

const translations: Record<string, Record<string, string>> = {
  english: {
    inputs: "Inputs",
    result: "Result",
    select: "Select...",
    thinking: "Thinking...",
    btn_get: "Get Result",
    req_suffix: "is required",
    placeholder_text: "Fill in the form and click \"Get Result\"."
  },
  tamil: {
    inputs: "உள்ளீடுகள்",
    result: "முடிவு",
    select: "தேர்ந்தெடு...",
    thinking: "பகுப்பாய்வு செய்யப்படுகிறது...",
    btn_get: "பதில் பெறுக",
    req_suffix: "தேவை",
    placeholder_text: "படிவத்தை நிரப்பி \"பதில் பெறுக\" என்பதை அழுத்தவும்."
  }
};

const translateFieldLabel = (label: string, lang: string) => {
  if (lang !== "tamil") return label;
  const map: Record<string, string> = {
    "Soil Type": "மண் வகை",
    "Region / State": "மண்டலம் / மாநிலம்",
    "Current Season": "தற்போதைய பருவம்",
    "Location / Village": "இருப்பிடம் / கிராமம்",
    "Current Crop (Optional)": "தற்போதைய பயிர் (விருப்பத்தேர்வு)",
    "Crop Type": "பயிர் வகை",
    "Growth Stage": "வளர்ச்சி நிலை",
    "Symptoms / Description": "அறிகுறிகள் / விளக்கம்",
    "Water Source": "நீர் ஆதாரம்",
    "Irrigation Method": "பாசன முறை",
  };
  return map[label] || label;
};

const translateFieldPlaceholder = (placeholder: string, lang: string) => {
  if (lang !== "tamil") return placeholder;
  const map: Record<string, string> = {
    "e.g. Clay, Sandy, Black soil": "எ.கா. கரிசல், செம்மண், வண்டல்",
    "e.g. Tamil Nadu, Erode": "எ.கா. தமிழ்நாடு, ஈரோடு",
    "e.g. Rabi, Kharif, Summer": "எ.கா. காரிஃப், ரபி, கோடை",
    "e.g. Salem, Coimbatore": "எ.கா. சேலம், கோயம்புத்தூர்",
    "e.g. Turmeric, Paddy": "எ.கா. மஞ்சள், நெல்",
    "e.g. Turmeric, Banana": "எ.கா. மஞ்சள், வாழை",
    "e.g. Vegetative, Flowering, Sowing": "எ.கா. வளர்ச்சி நிலை, பூக்கும் பருவம்",
    "Describe spots, yellowing, pests...": "இலைகளில் புள்ளிகள், நிறமாற்றம், பூச்சிகளை விவரிக்கவும்...",
    "e.g. Well, Borewell, Canal": "எ.கா. கிணறு, ஆழ்துளைக் கிணறு, வாய்க்கால்",
    "e.g. Drip, Sprinkler, Flood": "எ.கா. சொட்டுநீர், தெளிப்புநீர், வாய்க்கால் பாசனம்",
  };
  return map[placeholder] || placeholder;
};

const translateOptionValue = (val: string, lang: string) => {
  if (lang !== "tamil") return val;
  const map: Record<string, string> = {
    "Clay": "களிமண்",
    "Sandy": "மணல் மண்",
    "Black soil": "கரிசல் மண்",
    "Red soil": "செம்மண்",
    "Alluvial": "வண்டல் மண்",
    "Rabi": "ரபி பருவம்",
    "Kharif": "காரிஃப் பருவம்",
    "Summer": "கோடை காலம்",
    "Vegetative": "வளர்ச்சி நிலை",
    "Flowering": "பூக்கும் பருவம்",
    "Sowing": "விதைப்பு நிலை",
    "Yielding": "விளைச்சல் பருவம்",
    "Drip": "சொட்டுநீர் பாசனம்",
    "Sprinkler": "தெளிப்பு நீர்",
    "Flood": "வாய்க்கால் பாசனம்",
    "Well": "கிணறு",
    "Borewell": "ஆழ்துளைக் கிணறு",
    "Canal": "வாய்க்கால்",
  };
  return map[val] || val;
};

export function AgentForm({ config }: { config: AgentConfig }) {
  const [lang, setLang] = useState("english");

  useEffect(() => {
    const saved = localStorage.getItem("app_lang") || "english";
    setLang(saved);

    const handleLangChange = () => {
      setLang(localStorage.getItem("app_lang") || "english");
    };
    window.addEventListener("languageChanged", handleLangChange);
    return () => window.removeEventListener("languageChanged", handleLangChange);
  }, []);

  const ft = translations[lang] || translations.english;

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
        toast.error(lang === "tamil" ? `${translateFieldLabel(f.label, lang)} ${ft.req_suffix}` : `${f.label} is required`);
        return;
      }
    }
    setLoading(true);
    setResult("");
    try {
      const res = await call({
        data: { agentType: config.slug, inputs: values, language: lang },
      });
      setResult(res.output);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : (lang === "tamil" ? "ஏதோ தவறு நடந்துவிட்டது" : "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 text-left">
      <Card className="rounded-2xl border-slate-100 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">{ft.inputs}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {config.fields.map((f) => (
              <div key={f.name} className="space-y-2">
                <Label htmlFor={f.name} className="text-xs font-semibold text-muted-foreground">{translateFieldLabel(f.label, lang)}</Label>
                {f.type === "text" && (
                  <Input
                    id={f.name}
                    value={values[f.name] ?? ""}
                    placeholder={translateFieldPlaceholder(f.placeholder || "", lang)}
                    onChange={(e) => setField(f.name, e.target.value)}
                    className="rounded-xl border-green-100 focus-visible:ring-green-600"
                  />
                )}
                {f.type === "textarea" && (
                  <Textarea
                    id={f.name}
                    value={values[f.name] ?? ""}
                    placeholder={translateFieldPlaceholder(f.placeholder || "", lang)}
                    rows={5}
                    onChange={(e) => setField(f.name, e.target.value)}
                    className="rounded-xl border-green-100 focus-visible:ring-green-600 resize-none text-xs"
                  />
                )}
                {f.type === "select" && (
                  <Select
                    value={values[f.name] ?? ""}
                    onValueChange={(v) => setField(f.name, v)}
                  >
                    <SelectTrigger id={f.name} className="rounded-xl border-green-100">
                      <SelectValue placeholder={ft.select} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {f.options?.map((o) => (
                        <SelectItem key={o} value={o}>
                          {translateOptionValue(o, lang)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
            <Button type="submit" disabled={loading} className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-5 shadow-lg shadow-green-700/10 font-semibold text-xs mt-2">
              {loading ? ft.thinking : ft.btn_get}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-slate-100 bg-white shadow-sm flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-base font-bold">{ft.result}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center">
          {result ? (
            <div className="whitespace-pre-wrap text-xs font-semibold leading-relaxed text-slate-800 bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 max-w-none text-left">
              {result}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-10 font-medium">
              {ft.placeholder_text}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
