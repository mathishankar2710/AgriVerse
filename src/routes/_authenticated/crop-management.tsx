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
import { Leaf, Sparkles, RefreshCw, Calendar, ClipboardList, CheckSquare, Plus, DollarSign, Calculator } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/crop-management")({
  component: CropManagementPage,
});

const translations: Record<string, Record<string, any>> = {
  english: {
    title: "Crop Management Suite",
    subtitle: "Plan crop calendars, execute yield forecast algorithms, and consult crop recommendations.",
    tab_reco: "Crop Recommendation",
    tab_yield: "Yield Predictor",
    tab_cal: "Crop Calendar",
    param_title: "Land Parameters",
    param_desc: "Provide details of soil and climate parameters.",
    soil_lbl: "Select Soil Type",
    season_lbl: "Sowing Season",
    region_lbl: "Agricultural Region",
    btn_reco: "Generate Crop Report",
    btn_reco_loading: "Consulting AI Agronomist...",
    ai_crops_title: "AI Suggested Crops",
    ai_crops_desc: "Climate-optimized high-yielding recommendations.",
    ai_loading: "Running recommendation neural nets...",
    ai_empty: "Provide land parameters and tap the recommendation button.",
    harvest_title: "Harvest Details",
    harvest_desc: "Estimate harvest yield output parameters.",
    crop_lbl: "Select Crop Type",
    area_lbl: "Cultivated Area (Acres)",
    water_lbl: "Irrigation Mode",
    organic_lbl: "Organic Soil Conditioners Used?",
    btn_yield: "Calculate Expected Yield",
    btn_yield_loading: "Running Calculations...",
    yield_card_title: "Yield Forecast Summary",
    yield_card_desc: "Simulated output values based on agricultural datasets.",
    est_yield: "Estimated Total Yield",
    est_income: "Expected Gross Value",
    tips_title: "Recommended Measures to Attain this Yield:",
    yield_empty: "Fill in acreage and irrigation parameters on the left to run prediction.",
    add_task_title: "Add Custom Milestone",
    add_task_desc: "Incorporate a custom schedule to your calendar.",
    task_name_lbl: "Milestone Name",
    task_date_lbl: "Target Date / Days",
    btn_add_task: "Add Task",
    cal_card_title: "Interactive Crop Calendar Tasks",
    cal_card_desc: "Check off farming milestones as you complete them."
  },
  tamil: {
    title: "பயிர் மேலாண்மைத் தொகுப்பு",
    subtitle: "பயிர் காலெண்டர்களை திட்டமிடுங்கள், மகசூல் கணிப்பு மற்றும் பயிர் ஆலோசனைகளைப் பெறுங்கள்.",
    tab_reco: "பயிர் பரிந்துரை",
    tab_yield: "மகசூல் கணிப்பான்",
    tab_cal: "பயிர் காலெண்டர்",
    param_title: "நிலத்தின் விவரங்கள்",
    param_desc: "மண் மற்றும் காலநிலை விவரங்களை வழங்கவும்.",
    soil_lbl: "மண் வகையைத் தேர்ந்தெடு",
    season_lbl: "விதைப்பு பருவம்",
    region_lbl: "விவசாய மண்டலம்",
    btn_reco: "பயிர் அறிக்கை உருவாக்கு",
    btn_reco_loading: "AI விவசாய நிபுணர் ஆலோசிக்கிறார்...",
    ai_crops_title: "AI பரிந்துரைக்கும் பயிர்கள்",
    ai_crops_desc: "வானிலைக்கு உகந்த அதிக மகசூல் தரும் பரிந்துரைகள்.",
    ai_loading: "பயிர் பரிந்துரை மாதிரிகள் இயக்கப்படுகின்றன...",
    ai_empty: "நிலத்தின் அளவுருக்களை வழங்கி பரிந்துரை பொத்தானை அழுத்தவும்.",
    harvest_title: "அறுவடை விவரங்கள்",
    harvest_desc: "அறுவடை மகசூல் அளவுகளை மதிப்பிடுங்கள்.",
    crop_lbl: "பயிர் வகையைத் தேர்ந்தெடு",
    area_lbl: "சாகுபடி பரப்பு (ஏக்கர்)",
    water_lbl: "நீர் பாசன முறை",
    organic_lbl: "கரிம உரங்கள் பயன்படுத்தப்பட்டதா?",
    btn_yield: "எதிர்பார்க்கும் மகசூலைக் கணக்கிடு",
    btn_yield_loading: "மகசூல் கணக்கிடப்படுகிறது...",
    yield_card_title: "மகசூல் கணிப்பு சுருக்கம்",
    yield_card_desc: "விவசாய தரவுகளின் அடிப்படையிலான மகசூல் மதிப்புகள்.",
    est_yield: "மதிப்பிடப்பட்ட மொத்த மகசூல்",
    est_income: "எதிர்பார்க்கப்படும் மொத்த மதிப்பு",
    tips_title: "இந்த மகசூலை அடைய பரிந்துரைக்கப்படும் வழிமுறைகள்:",
    yield_empty: "மகசூலைக் கணக்கிட இடதுபுறம் ஏக்கர் மற்றும் நீர்ப்பாசன விவரங்களை உள்ளிடவும்.",
    add_task_title: "புதிய மைல்கல் சேர்க்க",
    add_task_desc: "பயிர் காலெண்டரில் புதிய விவசாயப் பணியை இணைக்கவும்.",
    task_name_lbl: "பணியின் பெயர்",
    task_date_lbl: "இலக்கு நாட்கள் / தேதி",
    btn_add_task: "பணியைச் சேர்",
    cal_card_title: "செயல்பாட்டு பயிர் காலெண்டர்",
    cal_card_desc: "முடித்த விவசாயப் பணிகளை சரிபார்த்து குறித்துக் கொள்ளவும்."
  }
};

function CropManagementPage() {
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

  const ct = translations[lang] || translations.english;
  const agentCallFn = useServerFn(callAgent);

  // Tab 1: Crop Recommendation State
  const [cropInputs, setCropInputs] = useState({ soil: "black", season: "kharif", region: "West Region" });
  const [recommendedCrops, setRecommendedCrops] = useState<string>("");
  const [fetchingCrops, setFetchingCrops] = useState(false);

  // Tab 2: Yield Prediction State
  const [yieldInputs, setYieldInputs] = useState({ crop: "rice", acres: "3", water: "drip", organic: "yes" });
  const [yieldResult, setYieldResult] = useState<any>(null);
  const [predicting, setPredicting] = useState(false);

  // Tab 3: Crop Calendar State
  const [calendarTasks, setCalendarTasks] = useState<any[]>([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");

  // Sync calendar tasks reactively on language change
  useEffect(() => {
    setCalendarTasks([
      { id: 1, name: lang === "tamil" ? "நிலம் உழுதல் மற்றும் அடி உரம் இடுதல் (பஞ்சகவ்யா தெளிப்பு)" : "Land Tilling & Basal Manuring (Panchagavya application)", date: lang === "tamil" ? "நாள் 1 - 5" : "Day 1 - 5", completed: true },
      { id: 2, name: lang === "tamil" ? "விதை விதைத்தல் அல்லது நாற்று நடுதல்" : "Sowing Seeds / Transplanting Nursery seedlings", date: lang === "tamil" ? "நாள் 6 - 8" : "Day 6 - 8", completed: true },
      { id: 3, name: lang === "tamil" ? "முதல் கட்ட களை எடுத்தல் & மண் அணைத்தல்" : "First Stage Weeding & Soil aeration", date: lang === "tamil" ? "நாள் 25 - 30" : "Day 25 - 30", completed: false },
      { id: 4, name: lang === "tamil" ? "இரண்டாம் கட்ட உரமிடுதல் (வேப்பம் புண்ணாக்கு இடுதல்)" : "Secondary Nitrogen Application (Neem Cake top-up)", date: lang === "tamil" ? "நாள் 45 - 50" : "Day 45 - 50", completed: false },
      { id: 5, name: lang === "tamil" ? "பயிர் நோய் கண்டறிதல் & பூஞ்சைக் கொல்லி தெளித்தல்" : "Crop Pathology pest scan & preventative biological spray", date: lang === "tamil" ? "நாள் 70 - 75" : "Day 70 - 75", completed: false },
      { id: 6, name: lang === "tamil" ? "விளைச்சல் அறுவடை செய்தல்" : "Harvesting & Threshing schedule setup", date: lang === "tamil" ? "நாள் 110 - 120" : "Day 110 - 120", completed: false },
    ]);
  }, [lang]);

  // AI Crop Recommendation
  const fetchCropRecommendations = async () => {
    setFetchingCrops(true);
    setRecommendedCrops("");
    try {
      const res = await agentCallFn({
        data: {
          agentType: "crop",
          inputs: {
            soil_type: cropInputs.soil,
            sowing_season: cropInputs.season,
            geographic_region: cropInputs.region,
          },
          language: lang
        }
      });
      setRecommendedCrops(res.output);
      toast.success(lang === "tamil" ? "பயிர் பரிந்துரை வெற்றிகரமாக பெறப்பட்டது!" : "AI Crop recommendations fetched successfully!");
    } catch (e) {
      console.error(e);
      toast.error(lang === "tamil" ? "AI இணைக்கப்படவில்லை. ஆஃப்லைன் பரிந்துரை ஏற்றப்படுகிறது..." : "Failed to connect to AI server. Loading local recommendations fallback...");
      setTimeout(() => {
        if (lang === "tamil") {
          setRecommendedCrops(`### பரிந்துரைக்கப்படும் பயிர்கள் (ஆஃப்லைன்)
1. **மஞ்சள் (Turmeric) — சிறந்த தேர்வு**
   - **காரணம்:** ஈரோடு/கோவை பிராந்திய கரிசல் மண் மஞ்சள் சாகுபடிக்கு உகந்தது.
   - **மகசூல் எதிர்பார்ப்பு:** 9 மாத கால சாகுபடியில் அதிக லாபம் தரும்.
2. **நிலக்கடலை (Groundnut) — நடுத்தர விதைப்பு**
   - **காரணம்:** மண்ணில் நைட்ரஜன் சத்தை நிலைநிறுத்தும், குளிர் காலத்தில் குறைந்த நீர் தேவைப்படும்.
3. **நெல் / அரிசி (Paddy) — நீர் வசதி இருந்தால்**
   - **காரணம்:** கால்வாய் பாசன வசதி கொண்ட தாழ்வான நிலங்களுக்கு ஏற்ற நிலையான பயிர்.`);
        } else {
          setRecommendedCrops(`### Recommended Crops (Offline Fallback)
1. **Turmeric (மஞ்சள்) — Highly Recommended**
   - **Reason:** Black/alluvial soil in Erode region is perfect for turmeric.
   - **Yield Expectation:** High profitability with a 9-month window.
2. **Groundnut (நிலக்கடலை) — Moderate Sowing**
   - **Reason:** Great nitrogen fixer, requires less water during winter.
3. **Paddy / Rice (நெல்) — Water-Dependent**
   - **Reason:** Ideal for lowlands with canal access; highly stable crop yields.`);
        }
      }, 1000);
    } finally {
      setFetchingCrops(false);
    }
  };

  // Yield Prediction Logic
  const runYieldPrediction = () => {
    setPredicting(true);
    setTimeout(() => {
      const acres = parseFloat(yieldInputs.acres) || 1;
      let multiplier = 1.0;
      
      if (yieldInputs.water === "drip") multiplier += 0.2;
      if (yieldInputs.organic === "yes") multiplier += 0.15;
      
      let baseYield = 2.2; // tonnes per acre for rice
      let unit = lang === "tamil" ? "டன்" : "Tonnes";
      let cropLabel = lang === "tamil" ? "நெல் / அரிசி" : "Rice / Paddy";
      
      if (yieldInputs.crop === "turmeric") {
        baseYield = 3.5;
        cropLabel = lang === "tamil" ? "மஞ்சள்" : "Turmeric";
      } else if (yieldInputs.crop === "coconut") {
        baseYield = 6500;
        unit = lang === "tamil" ? "தேங்காய்" : "Nuts";
        cropLabel = lang === "tamil" ? "தென்னை" : "Coconut";
      } else if (yieldInputs.crop === "sugarcane") {
        baseYield = 38.0;
        cropLabel = lang === "tamil" ? "கரும்பு" : "Sugarcane";
      } else if (yieldInputs.crop === "banana") {
        baseYield = 14.0;
        cropLabel = lang === "tamil" ? "வாழை" : "Banana";
      }

      const estimatedYield = (acres * baseYield * multiplier).toFixed(1);
      const grossIncome = (parseFloat(estimatedYield) * (yieldInputs.crop === "coconut" ? 12 : 28000)).toLocaleString("en-IN");

      setYieldResult({
        crop: cropLabel,
        yield: estimatedYield,
        unit,
        income: grossIncome,
        tips: lang === "tamil" ? [
          "பயிர் வளர்ச்சி காலத்தில் நைட்ரஜன் உரங்களை பிரித்து இடுங்கள்.",
          "பூக்கும் பருவத்தில் மண்ணில் 60-70% ஈரப்பதத்தை சீராகப் பராமரிக்கவும்.",
          "அதிக வெப்பநிலையில் ஈரப்பதம் இழப்பைத் தடுக்க பயிர்க் கழிவு மூடாக்கு அமைக்கவும்."
        ] : [
          `Ensure split-dose nitrogen fertilization during the vegetative growth stage.`,
          `Keep soil moisture levels at 60-70% capacity during flowering.`,
          `Implement crop residue mulching to prevent moisture loss under high temperatures.`,
        ]
      });
      setPredicting(false);
      toast.success(lang === "tamil" ? "மகசூல் கணிப்பு வெற்றிகரமாக உருவாக்கப்பட்டது!" : "Yield calculations generated!");
    }, 800);
  };

  const toggleTask = (id: number) => {
    setCalendarTasks((tasks) =>
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTask = () => {
    if (!newTaskName.trim() || !newTaskDate.trim()) return toast.error(lang === "tamil" ? "பணி விவரங்களை உள்ளிடவும்" : "Please enter task details");
    const newTask = {
      id: Date.now(),
      name: newTaskName,
      date: newTaskDate,
      completed: false,
    };
    setCalendarTasks((prev) => [...prev, newTask]);
    setNewTaskName("");
    setNewTaskDate("");
    toast.success(lang === "tamil" ? "பயிர் காலெண்டரில் பணி இணைக்கப்பட்டது!" : "Task added to your Crop Calendar!");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
          <Leaf className="h-6 w-6 text-green-700" />
          {ct.title}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {ct.subtitle}
        </p>
      </div>

      <Tabs defaultValue="recommendation" className="w-full">
        <TabsList className="flex flex-wrap h-auto w-fit max-w-full bg-green-100/40 border border-green-200/30 p-1.5 gap-1.5 sm:gap-2 rounded-2xl mb-6">
          <TabsTrigger 
            value="recommendation" 
            className="rounded-xl text-xs sm:text-sm px-4 py-2.5 font-bold transition-all duration-200 text-slate-600 hover:text-green-800 hover:bg-white/40 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-transparent"
          >
            {ct.tab_reco}
          </TabsTrigger>
          <TabsTrigger 
            value="yield" 
            className="rounded-xl text-xs sm:text-sm px-4 py-2.5 font-bold transition-all duration-200 text-slate-600 hover:text-green-800 hover:bg-white/40 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-transparent"
          >
            {ct.tab_yield}
          </TabsTrigger>
          <TabsTrigger 
            value="calendar" 
            className="rounded-xl text-xs sm:text-sm px-4 py-2.5 font-bold transition-all duration-200 text-slate-600 hover:text-green-800 hover:bg-white/40 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-transparent"
          >
            {ct.tab_cal}
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: CROP RECOMMENDATION */}
        <TabsContent value="recommendation" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Input selectors */}
            <Card className="rounded-2xl border-green-100/50 shadow-sm bg-white md:col-span-1">
              <CardHeader>
                <CardTitle className="text-base font-bold">{ct.param_title}</CardTitle>
                <CardDescription className="text-xs">{ct.param_desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{ct.soil_lbl}</Label>
                  <Select value={cropInputs.soil} onValueChange={(val) => setCropInputs((p) => ({ ...p, soil: val }))}>
                    <SelectTrigger className="rounded-xl border-green-100">
                      <SelectValue placeholder="Select Soil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="black">{lang === "tamil" ? "கரிசல் மண் (Karisal)" : "Black Clay (Karisal)"}</SelectItem>
                      <SelectItem value="red">{lang === "tamil" ? "செம்மண் (Semman)" : "Red Clay (Semman)"}</SelectItem>
                      <SelectItem value="alluvial">{lang === "tamil" ? "வண்டல் மண் (Vandal)" : "Alluvial Loam (Vandal)"}</SelectItem>
                      <SelectItem value="sandy">{lang === "tamil" ? "மணல் மண் (Manal)" : "Sandy Loam (Manal)"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{ct.season_lbl}</Label>
                  <Select value={cropInputs.season} onValueChange={(val) => setCropInputs((p) => ({ ...p, season: val }))}>
                    <SelectTrigger className="rounded-xl border-green-100">
                      <SelectValue placeholder="Select Season" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kharif">{lang === "tamil" ? "காரிஃப் / தென்மேற்கு பருவமழை (ஜூன் - செப்)" : "Kharif / Southwest Monsoon (June - Sept)"}</SelectItem>
                      <SelectItem value="rabi">{lang === "tamil" ? "ரபி / வடகிழக்கு பருவமழை (அக்டோபர் - மார்ச்)" : "Rabi / Northeast Monsoon (Oct - March)"}</SelectItem>
                      <SelectItem value="zaid">{lang === "tamil" ? "ஜைத் / கோடை காலம் (மார்ச் - ஜூன்)" : "Zaid / Summer season (March - June)"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{ct.region_lbl}</Label>
                  <Select value={cropInputs.region} onValueChange={(val) => setCropInputs((p) => ({ ...p, region: val }))}>
                    <SelectTrigger className="rounded-xl border-green-100">
                      <SelectValue placeholder="Select Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="West Region">{lang === "tamil" ? "மேற்கு மண்டலம் (கோவை, ஈரோடு, சேலம்)" : "West Region (Coimbatore, Erode, Salem)"}</SelectItem>
                      <SelectItem value="Cauvery Delta">{lang === "tamil" ? "காவிரி டெல்டா (தஞ்சாவூர், திருச்சி)" : "Cauvery Delta (Thanjavur, Trichy)"}</SelectItem>
                      <SelectItem value="Southern Plains">{lang === "tamil" ? "தெற்கு சமவெளி (மதுரை, திருநெல்வேலி)" : "Southern Plains (Madurai, Tirunelveli)"}</SelectItem>
                      <SelectItem value="Coastal Regions">{lang === "tamil" ? "கடலோரப் பகுதிகள் (கடலூர், நாகை)" : "Coastal Regions (Cuddalore, Nagapattinam)"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={fetchCropRecommendations}
                  disabled={fetchingCrops}
                  className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-5 shadow-lg shadow-green-700/10 font-semibold flex items-center justify-center gap-1.5"
                >
                  {fetchingCrops ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      {ct.btn_reco_loading}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      {ct.btn_reco}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* AI Crop Recommendation Output */}
            <Card className="rounded-2xl border-green-100/50 shadow-sm bg-white md:col-span-2 overflow-hidden">
              <CardHeader className="bg-gradient-to-tr from-green-50/40 to-white pb-3 border-b border-green-50/50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-700" />
                  {ct.ai_crops_title}
                </CardTitle>
                <CardDescription className="text-xs">{ct.ai_crops_desc}</CardDescription>
              </CardHeader>
              <CardContent className="pt-5 pb-6">
                {fetchingCrops ? (
                  <div className="h-64 flex flex-col items-center justify-center space-y-3">
                    <RefreshCw className="h-8 w-8 animate-spin text-green-600" />
                    <span className="text-xs text-muted-foreground">{ct.ai_loading}</span>
                  </div>
                ) : recommendedCrops ? (
                  <div className="space-y-4 text-xs leading-relaxed text-foreground animate-fade-in max-w-none text-left font-medium">
                    <div className="whitespace-pre-wrap prose prose-sm max-w-none">
                      {recommendedCrops.split("\n").map((line, i) => {
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
                    <Leaf className="h-8 w-8 text-slate-300" />
                    <span className="text-xs font-medium text-slate-400">{ct.ai_empty}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: YIELD PREDICTOR */}
        <TabsContent value="yield" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Predictor inputs */}
            <Card className="rounded-2xl border-green-100/50 shadow-sm bg-white md:col-span-1">
              <CardHeader>
                <CardTitle className="text-base font-bold">{ct.harvest_title}</CardTitle>
                <CardDescription className="text-xs">{ct.harvest_desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{ct.crop_lbl}</Label>
                  <Select value={yieldInputs.crop} onValueChange={(val) => setYieldInputs((p) => ({ ...p, crop: val }))}>
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
                  <Label className="text-xs font-semibold text-muted-foreground">{ct.area_lbl}</Label>
                  <Input
                    type="number"
                    value={yieldInputs.acres}
                    onChange={(e) => setYieldInputs((p) => ({ ...p, acres: e.target.value }))}
                    className="rounded-xl border-green-100 focus-visible:ring-green-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{ct.water_lbl}</Label>
                  <Select value={yieldInputs.water} onValueChange={(val) => setYieldInputs((p) => ({ ...p, water: val }))}>
                    <SelectTrigger className="rounded-xl border-green-100">
                      <SelectValue placeholder="Select Irrigation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="drip">{lang === "tamil" ? "சொட்டுநீர் பாசனம் (Drip)" : "Drip Irrigation (Sottuneer)"}</SelectItem>
                      <SelectItem value="sprinkler">{lang === "tamil" ? "தெளிப்பு நீர் பாசனம் (Sprinkler)" : "Sprinkler (Thelipaneer)"}</SelectItem>
                      <SelectItem value="flood">{lang === "tamil" ? "வாய்க்கால் பாசனம் (Flood)" : "Flood Irrigation (Vaaikalpaaichal)"}</SelectItem>
                      <SelectItem value="rainfed">{lang === "tamil" ? "வானம் பார்த்த பூமி (Rainfed)" : "Rainfed (Maanaavari)"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{ct.organic_lbl}</Label>
                  <Select value={yieldInputs.organic} onValueChange={(val) => setYieldInputs((p) => ({ ...p, organic: val }))}>
                    <SelectTrigger className="rounded-xl border-green-100">
                      <SelectValue placeholder="Select Option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">{lang === "tamil" ? "ஆம் (மண்புழு, பஞ்சகவ்யா)" : "Yes (Panchagavya, Vermicompost)"}</SelectItem>
                      <SelectItem value="no">{lang === "tamil" ? "இல்லை (இரசாயன உரங்கள் மட்டும்)" : "No (Chemical fertilizers only)"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={runYieldPrediction}
                  disabled={predicting}
                  className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-5 shadow-lg shadow-green-700/10 font-semibold"
                >
                  {predicting ? ct.btn_yield_loading : ct.btn_yield}
                </Button>
              </CardContent>
            </Card>

            {/* Prediction Output */}
            <Card className="rounded-2xl border-green-100/50 shadow-sm bg-white md:col-span-2">
              <CardHeader className="text-left">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-green-700" />
                  {ct.yield_card_title}
                </CardTitle>
                <CardDescription className="text-xs">{ct.yield_card_desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pb-6">
                {yieldResult ? (
                  <div className="space-y-6 animate-fade-in text-left">
                    {/* Big numbers */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="p-4 bg-green-50/50 border border-green-100/50 rounded-2xl">
                        <span className="text-[10px] text-green-800 font-bold block uppercase tracking-wider">{ct.est_yield}</span>
                        <div className="text-2xl font-extrabold text-green-950 mt-1">
                          {yieldResult.yield} <span className="text-sm font-semibold">{yieldResult.unit}</span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl">
                        <span className="text-[10px] text-blue-800 font-bold block uppercase tracking-wider">{ct.est_income}</span>
                        <div className="text-2xl font-extrabold text-blue-950 mt-1 flex items-center">
                          <span className="text-sm font-bold mr-0.5">₹</span>
                          {yieldResult.income}
                        </div>
                      </div>
                    </div>

                    {/* Actionable items */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold text-foreground">{ct.tips_title}</h4>
                      <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed pl-1">
                        {yieldResult.tips.map((tip: string, idx: number) => (
                          <li key={idx} className="flex gap-2">
                            <ClipboardList className="h-4 w-4 text-green-600 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-center space-y-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
                    <Calculator className="h-8 w-8 text-slate-300" />
                    <span className="text-xs font-medium text-slate-400">{ct.yield_empty}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: CROP CALENDAR */}
        <TabsContent value="calendar" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Add Custom Task Form */}
            <Card className="rounded-2xl border-green-100/50 shadow-sm bg-white md:col-span-1">
              <CardHeader>
                <CardTitle className="text-base font-bold">{ct.add_task_title}</CardTitle>
                <CardDescription className="text-xs">{ct.add_task_desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{ct.task_name_lbl}</Label>
                  <Input
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder={lang === "tamil" ? "எ.கா. மண்புழு உரம் இடுதல்" : "e.g. Apply vermicompost top dressing"}
                    className="rounded-xl border-green-100 focus-visible:ring-green-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{ct.task_date_lbl}</Label>
                  <Input
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    placeholder={lang === "tamil" ? "எ.கா. நாள் 35 - 40" : "e.g. Day 35 - 40"}
                    className="rounded-xl border-green-100 focus-visible:ring-green-600"
                  />
                </div>
                <Button
                  onClick={addTask}
                  className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-5 shadow-lg shadow-green-700/10 font-semibold flex items-center justify-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  {ct.btn_add_task}
                </Button>
              </CardContent>
            </Card>

            {/* Sowing Checklist Calendar */}
            <Card className="rounded-2xl border-green-100/50 shadow-sm bg-white md:col-span-2">
              <CardHeader className="text-left">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-700" />
                  {ct.cal_card_title}
                </CardTitle>
                <CardDescription className="text-xs">{ct.cal_card_desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-6 text-left">
                <div className="space-y-2.5">
                  {calendarTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-all duration-200 ${
                        task.completed
                          ? "bg-green-50/30 border-green-100 text-muted-foreground line-through"
                          : "bg-white border-slate-100 hover:border-green-200 hover:bg-green-50/10 text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all ${
                            task.completed
                              ? "bg-green-700 border-green-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {task.completed && <CheckSquare className="h-4 w-4" />}
                        </div>
                        <span className="text-xs font-semibold leading-none">{task.name}</span>
                      </div>
                      <span className="text-[10px] font-bold bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full text-slate-500">
                        {task.date}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
