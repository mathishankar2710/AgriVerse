import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { callAgent } from "@/lib/agents.functions";
import { Sprout, TestTube, ArrowRight, Activity, ShieldCheck, Sparkles, RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/soil-fertilizer")({
  component: SoilFertilizerPage,
});

const pageTranslations: Record<string, Record<string, any>> = {
  english: {
    title: "Soil & Fertilizer Advisor",
    subtitle: "Perform soil health diagnostic reports and request personalized fertilizer schedules.",
    tab_analysis: "Soil Health Analysis",
    tab_reco: "Fertilizer Recommendations",
    inputs_title: "Soil Inputs",
    inputs_desc: "Enter laboratory soil test values.",
    carbon_label: "Organic Carbon %",
    btn_analyze: "Analyze Soil Health",
    btn_analyzing: "Running...",
    report_title: "Health Report Card",
    report_desc: "Diagnostic summary based on soil chemical parameters.",
    score_lbl: "Soil Quality Index",
    score_sub: "Parameters are compared against standard healthy loamy cropland.",
    deficiency_title: "Deficiency & Corrective Actions:",
    empty_status: "Fill in NPK values on the left and run analysis to get report.",
    crop_details: "Crop Details",
    crop_desc: "Select your current cultivation parameters.",
    crop_label: "Select Crop Type",
    soil_label: "Select Soil Type",
    stage_label: "Growth Stage",
    btn_ai: "Get AI Recommendation",
    btn_ai_loading: "Consulting AI...",
    ai_card_title: "AI Customized Fertilizer Schedule",
    ai_card_desc: "Personalized fertilizer ratios and regional organic additions.",
    ai_loading: "Running NPK calculation model via Google Gemini...",
    ai_empty: "Select crop & stage parameters and launch the AI system.",
    standard_lbl: "Tamil Nadu Cropping Standards",
    standard_sub: "Customized incorporating organic manures (Panchagavya, Neem Cake) for agricultural sustainable growth.",
    nitrogen: "Nitrogen (N) ppm",
    phosphorus: "Phosphorus (P) ppm",
    potassium: "Potassium (K) ppm",
    ph: "pH Level"
  },
  tamil: {
    title: "மண் & உர ஆலோசனையாளர்",
    subtitle: "மண்ணின் ஆரோக்கியப் பரிசோதனை மற்றும் தனிப்பயனாக்கப்பட்ட உர அட்டவணையைப் பெறுங்கள்.",
    tab_analysis: "மண் ஆரோக்கிய பகுப்பாய்வு",
    tab_reco: "உர பரிந்துரைகள்",
    inputs_title: "மண் பரிசோதனை அளவுகள்",
    inputs_desc: "ஆய்வக மண் பரிசோதனை மதிப்புகளை உள்ளிடவும்.",
    carbon_label: "கரிம கார்பன் %",
    btn_analyze: "மண் ஆரோக்கியத்தை ஆராய்க",
    btn_analyzing: "பகுப்பாய்வு செய்யப்படுகிறது...",
    report_title: "ஆரோக்கிய அறிக்கை அட்டை",
    report_desc: "மண்ணின் வேதியியல் அளவுகளின் அடிப்படையிலான சுருக்கம்.",
    score_lbl: "மண் தரக் குறியீடு",
    score_sub: "அளவுகள் நிலையான வளமான விளைநிலங்களுடன் ஒப்பிடப்படுகின்றன.",
    deficiency_title: "பற்றாக்குறை மற்றும் திருத்த நடவடிக்கைகள்:",
    empty_status: "மண் பரிசோதனை அளவுகளை இடதுபுறம் உள்ளிட்டு பகுப்பாய்வு செய்யவும்.",
    crop_details: "பயிர் விவரங்கள்",
    crop_desc: "தற்போதைய பயிர் சாகுபடி அளவுகளைத் தேர்ந்தெடுக்கவும்.",
    crop_label: "பயிர் வகையைத் தேர்ந்தெடு",
    soil_label: "மண் வகையைத் தேர்ந்தெடு",
    stage_label: "வளர்ச்சி நிலை",
    btn_ai: "AI பரிந்துரை பெறுக",
    btn_ai_loading: "AI ஆலோசனை பெறப்படுகிறது...",
    ai_card_title: "AI உர பரிந்துரை அட்டவணை",
    ai_card_desc: "தனிப்பயனாக்கப்பட்ட உர விகிதங்கள் மற்றும் கரிம உரம் சேர்க்கைகள்.",
    ai_loading: "கூகுள் ஜெமினி மூலம் உர அட்டவணை கணக்கிடப்படுகிறது...",
    ai_empty: "பயிர் மற்றும் வளர்ச்சி நிலைகளைத் தேர்ந்தெடுத்து AI-ஐத் தொடங்கவும்.",
    standard_lbl: "தமிழ்நாடு பயிர் தரநிலைகள்",
    standard_sub: "நிலையான விவசாய வளர்ச்சிக்கு பஞ்சகவ்யா, வேப்பம் புண்ணாக்கு போன்ற கரிம உரங்கள் இணைக்கப்பட்டுள்ளன.",
    nitrogen: "நைட்ரஜன் (N) ppm",
    phosphorus: "பாஸ்பரஸ் (P) ppm",
    potassium: "பொட்டாசியம் (K) ppm",
    ph: "pH அளவு"
  }
};

function SoilFertilizerPage() {
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

  const st = pageTranslations[lang] || pageTranslations.english;
  const agentCallFn = useServerFn(callAgent);

  // Tab 1: Soil Analysis State
  const [npk, setNpk] = useState({ n: "45", p: "22", k: "180", ph: "6.8", carbon: "0.55" });
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Tab 2: Fertilizer Recommendation State
  const [recommendationInputs, setRecommendationInputs] = useState({
    crop: "rice",
    soil: "alluvial",
    stage: "vegetative",
  });
  const [aiResult, setAiResult] = useState<string>("");
  const [fetchingAi, setFetchingAi] = useState(false);

  // Run soil health calculation locally
  const runSoilAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const nVal = parseFloat(npk.n);
      const pVal = parseFloat(npk.p);
      const kVal = parseFloat(npk.k);
      const phVal = parseFloat(npk.ph);
      const cVal = parseFloat(npk.carbon);

      // Simple mock diagnostic logic
      const diagnostics: string[] = [];
      let score = 85;

      if (nVal < 50) {
        diagnostics.push(lang === "tamil" ? "நைட்ரஜன் பற்றாக்குறை உள்ளது. பயிர் வளர்ச்சி குன்றியதாக இருக்கக்கூடும்." : "Critical Nitrogen deficiency detected. Sowing leaf crops might experience stunted growth.");
        score -= 15;
      }
      if (pVal < 25) {
        diagnostics.push(lang === "tamil" ? "பாஸ்பரஸ் சத்து குறைவாக உள்ளது. வேர் வளர்ச்சி மற்றும் ஆரம்ப கால வளர்ச்சி பாதிக்கப்படலாம்." : "Low Phosphorus level. Root development and early crop establishment may be limited.");
        score -= 10;
      }
      if (kVal < 150) {
        diagnostics.push(lang === "tamil" ? "பொட்டாசியம் சத்து குறைவாக உள்ளது. பயிரின் நோய் எதிர்ப்பு திறன் குறையக்கூடும்." : "Potassium is below optimal. Crop resistance to pest stress might decrease.");
        score -= 10;
      }
      if (phVal < 6.0) {
        diagnostics.push(lang === "tamil" ? "மண் அமிலத்தன்மை கொண்டது. அமிலத்தன்மையை நடுநிலையாக்க சுண்ணாம்பு அல்லது உரம் சேர்க்கவும்." : "Acidic soil pH detected. Recommend liming or organic amendment to neutralize acidity.");
        score -= 15;
      } else if (phVal > 7.5) {
        diagnostics.push(lang === "tamil" ? "மண் காரத்தன்மை கொண்டது. இரும்பு மற்றும் துத்தநாக சத்துக்கள் பயிர்களுக்கு கிடைப்பது குறையலாம்." : "Alkaline soil pH detected. Iron and zinc availability might be locked.");
        score -= 10;
      }
      if (cVal < 0.5) {
        diagnostics.push(lang === "tamil" ? "கரிம கார்பன் அளவு மிகக் குறைவாக உள்ளது. மட்கிய உரங்கள் அல்லது மண்புழு உரம் சேர்க்கவும்." : "Very low Organic Carbon. Soil biological activity is poor; add organic compost, green manure or farmyard manure.");
        score -= 15;
      }

      setAnalysisResult({
        score: Math.max(score, 30),
        status: score > 80 
          ? (lang === "tamil" ? "வளமானது (Optimal)" : "Optimal") 
          : score > 60 
            ? (lang === "tamil" ? "மிதமான பற்றாக்குறை" : "Moderate Deficiencies") 
            : (lang === "tamil" ? "கடுமையான பற்றாக்குறை" : "Critical Deficiencies"),
        diagnostics: diagnostics.length > 0 ? diagnostics : [lang === "tamil" ? "அனைத்து சத்துக்களும் உகந்த அளவில் உள்ளன. மண் ஆரோக்கியமாக உள்ளது." : "All elements fall within optimal agricultural parameters. Soil biological activity is robust."],
        details: {
          nStatus: nVal < 50 ? (lang === "tamil" ? "குறைவு" : "Low") : nVal > 150 ? (lang === "tamil" ? "அதிகம்" : "High") : (lang === "tamil" ? "சரியானது" : "Optimal"),
          pStatus: pVal < 25 ? (lang === "tamil" ? "குறைவு" : "Low") : pVal > 80 ? (lang === "tamil" ? "அதிகம்" : "High") : (lang === "tamil" ? "சரியானது" : "Optimal"),
          kStatus: kVal < 150 ? (lang === "tamil" ? "குறைவு" : "Low") : kVal > 300 ? (lang === "tamil" ? "அதிகம்" : "High") : (lang === "tamil" ? "சரியானது" : "Optimal"),
          phStatus: phVal < 6.0 ? (lang === "tamil" ? "அமிலம்" : "Acidic") : phVal > 7.5 ? (lang === "tamil" ? "காரம்" : "Alkaline") : (lang === "tamil" ? "சரியானது" : "Optimal Neutral"),
        }
      });
      setAnalyzing(false);
      toast.success(lang === "tamil" ? "மண் ஆரோக்கிய அறிக்கை தயாராக உள்ளது!" : "Soil health analysis generated successfully!");
    }, 800);
  };

  // Get AI recommendations from Gemini
  const fetchFertilizerRecommendation = async () => {
    setFetchingAi(true);
    setAiResult("");
    try {
      const res = await agentCallFn({
        data: {
          agentType: "fertilizer",
          inputs: {
            crop_type: recommendationInputs.crop,
            soil_type: recommendationInputs.soil,
            growth_stage: recommendationInputs.stage,
          },
          language: lang
        }
      });
      setAiResult(res.output);
      toast.success(lang === "tamil" ? "AI பரிந்துரை பெறப்பட்டது!" : "AI Recommendation retrieved!");
    } catch (e) {
      console.error(e);
      toast.error(lang === "tamil" ? "AI இணையம் வேலை செய்யவில்லை. ஆஃப்லைன் பரிந்துரை ஏற்றப்படுகிறது..." : "Failed to connect to AI brain. Loading local recommendation fallback...");
      
      // Fallback local recommendations
      setTimeout(() => {
        if (lang === "tamil") {
          setAiResult(`### உர அட்டவணை (ஆஃப்லைன் பயன்முறை)
- **முதன்மைப் பரிந்துரை:** ஏக்கருக்கு 50 கிலோ அளவில் **NPK 17:17:17** உரக்கலவையைப் பயன்படுத்தவும்.
- **கரிம கூட்டுப்பொருள்:** இலைகளின் வளர்ச்சி மற்றும் மண் நுண்ணுயிரிகளைப் பெருக்க **பஞ்சகவ்யா** (3% இலை தெளிப்பு, 100 லிட்டர் நீரில் 3 லிட்டர்) பயன்படுத்தவும்.
- **மேல் உரம்:** நைட்டிரஜன் மெதுவாக வெளியாகி பயிரைக் காக்க, விதைத்த 3 வாரங்களுக்குப் பிறகு ஏக்கருக்கு 25 கிலோ **யூரியா** உடன் வேப்பம் புண்ணாக்கு கலந்து பயன்படுத்தவும்.
- **மண் மேம்பாடு:** நிலம் தயாரிக்கும் போது ஏக்கருக்கு 2 டன் மண்புழு உரம் இட்டு ஈரப்பதத்தை அதிகரிக்கவும்.`);
        } else {
          setAiResult(`### Fertilizer Schedule (Offline Mode)
- **Primary Recommendation:** Apply **NPK 17:17:17** complex fertilizer at the rate of 50 kg/acre.
- **Organic Additives:** Incorporate **Panchagavya** (3% foliar spray, 3 litres in 100 litres water) to boost leaf size and micro-flora.
- **Top Dressing:** Apply **Urea** (25 kg/acre) mixed with neem cake powder 3 weeks after sowing to release Nitrogen slowly and protect from soil pathogens.
- **Soil Conditioning:** Incorporate vermicompost (2 tonnes/acre) during land preparation to improve water-holding capacity.`);
        }
      }, 1000);
    } finally {
      setFetchingAi(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
          <TestTube className="h-6 w-6 text-green-700" />
          {st.title}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {st.subtitle}
        </p>
      </div>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="flex flex-wrap h-auto w-fit max-w-full bg-green-100/40 border border-green-200/30 p-1.5 gap-1.5 sm:gap-2 rounded-2xl mb-6">
          <TabsTrigger 
            value="analysis" 
            className="rounded-xl text-xs sm:text-sm px-4 py-2.5 font-bold transition-all duration-200 text-slate-600 hover:text-green-800 hover:bg-white/40 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-transparent"
          >
            {st.tab_analysis}
          </TabsTrigger>
          <TabsTrigger 
            value="recommendation" 
            className="rounded-xl text-xs sm:text-sm px-4 py-2.5 font-bold transition-all duration-200 text-slate-600 hover:text-green-800 hover:bg-white/40 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-transparent"
          >
            {st.tab_reco}
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: SOIL ANALYSIS */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Input Parameters */}
            <Card className="rounded-2xl border-green-100/50 shadow-sm bg-white md:col-span-1">
              <CardHeader>
                <CardTitle className="text-base font-bold">{st.inputs_title}</CardTitle>
                <CardDescription className="text-xs">{st.inputs_desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{st.nitrogen}</Label>
                  <Input
                    type="number"
                    value={npk.n}
                    onChange={(e) => setNpk((p) => ({ ...p, n: e.target.value }))}
                    className="rounded-xl border-green-100 focus-visible:ring-green-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{st.phosphorus}</Label>
                  <Input
                    type="number"
                    value={npk.p}
                    onChange={(e) => setNpk((p) => ({ ...p, p: e.target.value }))}
                    className="rounded-xl border-green-100 focus-visible:ring-green-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{st.potassium}</Label>
                  <Input
                    type="number"
                    value={npk.k}
                    onChange={(e) => setNpk((p) => ({ ...p, k: e.target.value }))}
                    className="rounded-xl border-green-100 focus-visible:ring-green-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{st.ph}</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={npk.ph}
                    onChange={(e) => setNpk((p) => ({ ...p, ph: e.target.value }))}
                    className="rounded-xl border-green-100 focus-visible:ring-green-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{st.carbon_label}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={npk.carbon}
                    onChange={(e) => setNpk((p) => ({ ...p, carbon: e.target.value }))}
                    className="rounded-xl border-green-100 focus-visible:ring-green-600"
                  />
                </div>
                <Button
                  onClick={runSoilAnalysis}
                  disabled={analyzing}
                  className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-5 shadow-lg shadow-green-700/10 font-semibold"
                >
                  {analyzing ? st.btn_analyzing : st.btn_analyze}
                </Button>
              </CardContent>
            </Card>

            {/* Results Display */}
            <Card className="rounded-2xl border-green-100/50 shadow-sm bg-white md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-700" />
                  {st.report_title}
                </CardTitle>
                <CardDescription className="text-xs">{st.report_desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pb-6">
                {analysisResult ? (
                  <div className="space-y-6 animate-fade-in">
                    {/* Score section */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                      <div className="relative h-20 w-20 flex items-center justify-center rounded-full bg-white shadow-inner border border-green-100 flex-shrink-0">
                        <span className="text-xl font-extrabold text-green-800">{analysisResult.score}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{st.score_lbl}</span>
                        <h3 className="text-base font-extrabold text-foreground">{analysisResult.status}</h3>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{st.score_sub}</p>
                      </div>
                    </div>

                    {/* Progress details */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1 text-left">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">{lang === "tamil" ? "நைட்ரஜன் நிலை" : "Nitrogen Status"}</span>
                          <span className={analysisResult.details.nStatus.includes("Optimal") || analysisResult.details.nStatus.includes("சரியானது") ? "text-green-700" : "text-amber-605 font-bold"}>
                            {analysisResult.details.nStatus} ({npk.n} ppm)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-600" style={{ width: `${Math.min(parseFloat(npk.n) / 2, 100)}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1 text-left">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">{lang === "tamil" ? "பாஸ்பரஸ் நிலை" : "Phosphorus Status"}</span>
                          <span className={analysisResult.details.pStatus.includes("Optimal") || analysisResult.details.pStatus.includes("சரியானது") ? "text-green-700" : "text-amber-605 font-bold"}>
                            {analysisResult.details.pStatus} ({npk.p} ppm)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-600" style={{ width: `${Math.min(parseFloat(npk.p) * 1.5, 100)}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1 text-left">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">{lang === "tamil" ? "பொட்டாசியம் நிலை" : "Potassium Status"}</span>
                          <span className={analysisResult.details.kStatus.includes("Optimal") || analysisResult.details.kStatus.includes("சரியானது") ? "text-green-700" : "text-amber-605 font-bold"}>
                            {analysisResult.details.kStatus} ({npk.k} ppm)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-600" style={{ width: `${Math.min(parseFloat(npk.k) / 4, 100)}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1 text-left">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">{lang === "tamil" ? "pH அளவு நிலை" : "pH Level Status"}</span>
                          <span className={analysisResult.details.phStatus.includes("Optimal") || analysisResult.details.phStatus.includes("சரியானது") ? "text-green-700" : "text-amber-605 font-bold"}>
                            {analysisResult.details.phStatus} ({npk.ph})
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-600" style={{ width: `${(parseFloat(npk.ph) / 14) * 100}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Diagnostics Bullet Points */}
                    <div className="space-y-2 border-t border-slate-50 pt-4 text-left">
                      <h4 className="text-xs font-bold text-foreground">{st.deficiency_title}</h4>
                      <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed pl-1">
                        {analysisResult.diagnostics.map((diag: string, i: number) => (
                          <li key={i} className="flex gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                            {diag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-center space-y-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
                    <Activity className="h-8 w-8 text-slate-350" />
                    <span className="text-xs font-medium text-slate-400">{st.empty_status}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: FERTILIZER RECOMMENDATIONS */}
        <TabsContent value="recommendation" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Recommendation Selectors */}
            <Card className="rounded-2xl border-green-100/50 shadow-sm bg-white md:col-span-1">
              <CardHeader>
                <CardTitle className="text-base font-bold">{st.crop_details}</CardTitle>
                <CardDescription className="text-xs">{st.crop_desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{st.crop_label}</Label>
                  <Select
                    value={recommendationInputs.crop}
                    onValueChange={(val) => setRecommendationInputs((p) => ({ ...p, crop: val }))}
                  >
                    <SelectTrigger className="rounded-xl border-green-100">
                      <SelectValue placeholder="Select Crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rice">{lang === "tamil" ? "நெல் / அரிசி (Nel)" : "Paddy / Rice (Nel)"}</SelectItem>
                      <SelectItem value="turmeric">{lang === "tamil" ? "மஞ்சள் (Manjal)" : "Turmeric (Manjal)"}</SelectItem>
                      <SelectItem value="coconut">{lang === "tamil" ? "தென்னை (Thengai)" : "Coconut (Thengai)"}</SelectItem>
                      <SelectItem value="sugarcane">{lang === "tamil" ? "கரும்பு (Karumbu)" : "Sugarcane (Karumbu)"}</SelectItem>
                      <SelectItem value="banana">{lang === "tamil" ? "வாழை (Vazhai)" : "Banana (Vazhai)"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{st.soil_label}</Label>
                  <Select
                    value={recommendationInputs.soil}
                    onValueChange={(val) => setRecommendationInputs((p) => ({ ...p, soil: val }))}
                  >
                    <SelectTrigger className="rounded-xl border-green-100">
                      <SelectValue placeholder="Select Soil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="black">{lang === "tamil" ? "கரிசல் மண் (Black Soil)" : "Black Soil (Karisal)"}</SelectItem>
                      <SelectItem value="red">{lang === "tamil" ? "செம்மண் (Red Soil)" : "Red Soil (Semman)"}</SelectItem>
                      <SelectItem value="alluvial">{lang === "tamil" ? "வண்டல் மண் (Alluvial)" : "Alluvial Soil (Vandal)"}</SelectItem>
                      <SelectItem value="sandy">{lang === "tamil" ? "மணல் பாங்கான மண் (Sandy)" : "Sandy Loam (Manal)"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{st.stage_label}</Label>
                  <Select
                    value={recommendationInputs.stage}
                    onValueChange={(val) => setRecommendationInputs((p) => ({ ...p, stage: val }))}
                  >
                    <SelectTrigger className="rounded-xl border-green-100">
                      <SelectValue placeholder="Select Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sowing">{lang === "tamil" ? "நிலம் தயாரிப்பு & விதைப்பு" : "Land Prep & Sowing"}</SelectItem>
                      <SelectItem value="vegetative">{lang === "tamil" ? "பயிர் வளர்ச்சி நிலை" : "Vegetative Growth"}</SelectItem>
                      <SelectItem value="flowering">{lang === "tamil" ? "பூக்கும் பருவம்" : "Flowering Stage"}</SelectItem>
                      <SelectItem value="yielding">{lang === "tamil" ? "விளைச்சல் பருவம்" : "Yielding / Grain Filling"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={fetchFertilizerRecommendation}
                  disabled={fetchingAi}
                  className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-5 shadow-lg shadow-green-700/10 font-semibold flex items-center justify-center gap-1.5"
                >
                  {fetchingAi ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      {st.btn_ai_loading}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      {st.btn_ai}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* AI Recommendation Output */}
            <Card className="rounded-2xl border-green-100/50 shadow-sm bg-white md:col-span-2 overflow-hidden">
              <CardHeader className="bg-gradient-to-tr from-green-50/40 to-white pb-3 border-b border-green-50/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-green-700" />
                  {st.ai_card_title}
                </CardTitle>
                <CardDescription className="text-xs">{st.ai_card_desc}</CardDescription>
              </CardHeader>
              <CardContent className="pt-5 pb-6">
                {fetchingAi ? (
                  <div className="h-64 flex flex-col items-center justify-center space-y-3">
                    <RefreshCw className="h-8 w-8 animate-spin text-green-600" />
                    <span className="text-xs text-muted-foreground">{st.ai_loading}</span>
                  </div>
                ) : aiResult ? (
                  <div className="space-y-4 text-xs leading-relaxed text-foreground animate-fade-in max-w-none text-left">
                    <div className="bg-green-50/40 border border-green-100/40 rounded-xl p-3 flex gap-2 mb-3">
                      <ShieldCheck className="h-5 w-5 text-green-700 flex-shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold text-green-900 block">{st.standard_lbl}</span>
                        <span className="text-[9px] text-green-700">{st.standard_sub}</span>
                      </div>
                    </div>
                    
                    <div className="whitespace-pre-wrap prose prose-sm max-w-none font-medium">
                      {aiResult.split("\n").map((line, i) => {
                        if (line.startsWith("- ") || line.startsWith("* ")) {
                          return <li key={i} className="ml-3 list-disc my-0.5">{line.substring(2)}</li>;
                        }
                        if (line.match(/^\d+\.\s/)) {
                          return <li key={i} className="ml-3 list-decimal my-0.5">{line.replace(/^\d+\.\s/, "")}</li>;
                        }
                        if (line.startsWith("### ")) {
                          return <h4 key={i} className="font-bold text-sm text-green-800 mt-3 mb-1.5">{line.substring(4)}</h4>;
                        }
                        if (line.startsWith("## ")) {
                          return <h3 key={i} className="font-bold text-base text-green-800 mt-4 mb-2">{line.substring(3)}</h3>;
                        }
                        if (line.includes("**")) {
                          const parts = line.split("**");
                          return (
                            <p key={i} className="mb-1">
                              {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-extrabold">{p}</strong> : p)}
                            </p>
                          );
                        }
                        return <p key={i} className="mb-1">{line}</p>;
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-center space-y-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
                    <Sprout className="h-8 w-8 text-slate-300" />
                    <span className="text-xs font-medium text-slate-400">{st.ai_empty}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
