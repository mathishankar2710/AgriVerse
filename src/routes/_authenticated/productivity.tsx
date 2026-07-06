import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Sprout, ShoppingBag, RefreshCw, Scale } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/productivity")({
  component: ProductivityPage,
});

const translations: Record<string, Record<string, any>> = {
  english: {
    title: "Productivity Calculators",
    subtitle: "Access specialized utility tools to estimate expected yield sizes, calculate fertilizer ratios, and convert agricultural units.",
    tab_yield: "Yield Estimator",
    tab_npk: "NPK Fertilizer",
    tab_conv: "Unit Converter",
    area_sz: "Area Size",
    area_ut: "Area Unit",
    crop_lbl: "Crop Type",
    seed_lbl: "Seed Variety",
    rain_lbl: "Season Rainfall",
    btn_yield: "Estimate Yield Output",
    est_tonnage: "Estimated Tonnage",
    est_desc: "This estimation is based on regional crop averages. Maintain optimal soil moisture and NPK application to target this estimate.",
    wait_params: "Waiting for Parameters",
    wait_params_desc: "Fill out your land size, seed type, and rainfall stats to calculate estimated yield outputs.",
    soil_n: "Soil Nitrogen (N)",
    soil_p: "Soil Phosphorus (P)",
    soil_k: "Soil Potassium (K)",
    btn_npk: "Calculate Fertilizer Needs",
    reco_title: "Recommended Application (Per Acre)",
    bag_note: "*(1 Bag = 50kg standard fertilizer bag)",
    wait_tests: "Waiting for Soil Tests",
    wait_tests_desc: "Input your soil Nitrogen, Phosphorus, and Potassium levels to compute standard fertilizer bag requirements.",
    val_conv: "Value to Convert",
    conv_type: "Conversion Type",
    btn_conv: "Convert Units",
    conv_out: "Converted Output",
    toast_yield: "Yield projection calculated",
    toast_npk: "Fertilizer recommendations calculated",
    acres: "Acres",
    hectares: "Hectares",
    wheat: "Wheat",
    rice: "Rice (Paddy)",
    cotton: "Cotton",
    potato: "Potato",
    standard: "Standard / Desi",
    hybrid: "High-Yielding Hybrid (HYV)",
    rain_low: "Low / Drought conditions",
    rain_avg: "Normal / Average Rain",
    rain_high: "High / Surplus Rain",
    n_low: "Low (Deficient)",
    n_med: "Medium (Adequate)",
    n_high: "High (Rich)",
    conv_ah: "Acres to Hectares",
    conv_ha: "Hectares to Acres",
    conv_qk: "Quintals to Kilograms",
    conv_kq: "Kilograms to Quintals",
    quintals: "Quintals"
  },
  tamil: {
    title: "உற்பத்தித்திறன் கணக்கீடுகள்",
    subtitle: "விளைச்சல் அளவு கணிப்பு, உர விகிதம் மற்றும் அலகு மாற்றிகளுக்கான சிறப்பு விவசாயக் கருவிகள்.",
    tab_yield: "மகசூல் கணிப்பான்",
    tab_npk: "உரக் கணக்கீடு (NPK)",
    tab_conv: "அலகு மாற்றி",
    area_sz: "நிலத்தின் அளவு",
    area_ut: "நிலத்தின் அலகு",
    crop_lbl: "பயிர் வகை",
    seed_lbl: "விதை வகை",
    rain_lbl: "பருவமழை அளவு",
    btn_yield: "மகசூலை மதிப்பிடு",
    est_tonnage: "மதிப்பிடப்பட்ட மகசூல்",
    est_desc: "இந்த கணிப்பு சராசரி வட்டார விளைச்சலின் அடிப்படையிலானது. இந்த இலக்கை எட்ட தகுந்த ஈரப்பதம் மற்றும் உர அளவுகளைப் பராமரிக்கவும்.",
    wait_params: "அளவீடுகளுக்காக காத்திருக்கிறது",
    wait_params_desc: "மதிப்பிடப்பட்ட மகசூலைக் கணக்கிட நிலத்தின் அளவு, விதை வகை மற்றும் மழை அளவுகளை உள்ளிடவும்.",
    soil_n: "மண்ணின் நைட்ரஜன் (N)",
    soil_p: "மண்ணின் பாஸ்பரஸ் (P)",
    soil_k: "மண்ணின் பொட்டாசியம் (K)",
    btn_npk: "தேவைப்படும் உரத்தைக் கணக்கிடு",
    reco_title: "பரிந்துரைக்கப்படும் உர அளவு (ஏக்கருக்கு)",
    bag_note: "*(1 மூட்டை = 50 கிலோ தரநிலையான உர மூட்டை)",
    wait_tests: "மண் பரிசோதனைக்காக காத்திருக்கிறது",
    wait_tests_desc: "தேவைப்படும் உர மூட்டைகளைக் கணக்கிட நைட்ரஜன், பாஸ்பரஸ் மற்றும் பொட்டாசியம் அளவுகளை உள்ளிடவும்.",
    val_conv: "மாற்ற வேண்டிய அளவு",
    conv_type: "மாற்றத்தின் வகை",
    btn_conv: "அலகுகளை மாற்று",
    conv_out: "மாற்றப்பட்ட அளவு",
    toast_yield: "மகசூல் கணிப்பு கணக்கிடப்பட்டது",
    toast_npk: "உரப் பரிந்துரை கணக்கிடப்பட்டது",
    acres: "ஏக்கர் (Acres)",
    hectares: "ஹெக்டேர் (Hectares)",
    wheat: "கோதுமை",
    rice: "நெல் / அரிசி",
    cotton: "பருத்தி",
    potato: "உருளைக்கிழங்கு",
    standard: "சாதாரண விதை வகை",
    hybrid: "அதிக மகசூல் தரும் கலப்பின விதை (HYV)",
    rain_low: "குறைந்த / வறட்சி நிலை",
    rain_avg: "சராசரி மழைப்பொழிவு",
    rain_high: "அதிக / உபரி மழைப்பொழிவு",
    n_low: "குறைவு (குறைபாடு)",
    n_med: "நடுத்தரம் (போதுமானது)",
    n_high: "அதிகம் (வளமானது)",
    conv_ah: "ஏக்கரிலிருந்து ஹெக்டேருக்கு",
    conv_ha: "ஹெக்டேரிலிருந்து ஏக்கர்டுக்கு",
    conv_qk: "குவிண்டாலிலிருந்து கிலோகிராமுக்கு",
    conv_kq: "கிலோகிராமுவிலிருந்து குவிண்டாலுக்கு",
    quintals: "குவிண்டால் (Quintals)"
  }
};

function ProductivityPage() {
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

  const t = translations[lang] || translations.english;

  // 1. Yield Estimator state
  const [area, setArea] = useState<number>(5);
  const [areaUnit, setAreaUnit] = useState<string>("acres");
  const [cropType, setCropType] = useState<string>("wheat");
  const [seedVariety, setSeedVariety] = useState<string>("hybrid");
  const [rainfall, setRainfall] = useState<string>("average");
  const [yieldResult, setYieldResult] = useState<number | null>(null);

  // 2. NPK Calculator state
  const [nLevel, setNLevel] = useState<string>("medium");
  const [pLevel, setPLevel] = useState<string>("low");
  const [kLevel, setKLevel] = useState<string>("medium");
  const [npkResult, setNpkResult] = useState<{ urea: number; dap: number; mop: number } | null>(null);

  // 3. Unit Converter state
  const [convVal, setConvVal] = useState<number>(1);
  const [convType, setConvType] = useState<string>("acre_hectare");
  const [convResult, setConvResult] = useState<number | null>(null);

  const calculateYield = () => {
    let baseYield = 15; // Quintals per acre base for wheat
    if (cropType === "rice") baseYield = 22;
    if (cropType === "potato") baseYield = 80;
    if (cropType === "cotton") baseYield = 8;

    let multiplier = 1.0;
    if (seedVariety === "hybrid") multiplier *= 1.25;
    if (rainfall === "high") multiplier *= 1.1;
    if (rainfall === "low") multiplier *= 0.7;

    const areaInAcres = areaUnit === "hectares" ? area * 2.471 : area;
    const finalYield = areaInAcres * baseYield * multiplier;

    setYieldResult(Math.round(finalYield * 10) / 10);
    toast.success(t.toast_yield);
  };

  const calculateNPK = () => {
    // Recommend fertilizer bags (50kg each) per acre based on soil NPK levels
    let urea = 2.5; // Urea bags
    let dap = 1.5;  // DAP bags
    let mop = 1.0;  // MOP bags

    if (nLevel === "low") urea += 1.0;
    if (nLevel === "high") urea -= 1.0;

    if (pLevel === "low") dap += 0.8;
    if (pLevel === "high") dap -= 0.8;

    if (kLevel === "low") mop += 0.5;
    if (kLevel === "high") mop -= 0.5;

    setNpkResult({
      urea: Math.max(0, Math.round(urea * 10) / 10),
      dap: Math.max(0, Math.round(dap * 10) / 10),
      mop: Math.max(0, Math.round(mop * 10) / 10),
    });
    toast.success(t.toast_npk);
  };

  const handleConvert = () => {
    let result = 0;
    if (convType === "acre_hectare") result = convVal * 0.4046;
    else if (convType === "hectare_acre") result = convVal * 2.471;
    else if (convType === "quintal_kg") result = convVal * 100;
    else if (convType === "kg_quintal") result = convVal * 0.01;
    
    setConvResult(Math.round(result * 1000) / 1000);
  };

  const getLocalizedUnitName = (type: string) => {
    if (lang !== "tamil") {
      return type.split("_")[1] === "hectare" ? "hectares" : type.split("_")[1] === "acre" ? "acres" : type.split("_")[1] === "kg" ? "kilograms" : "quintals";
    }
    const suffix = type.split("_")[1];
    if (suffix === "hectare") return "ஹெக்டேர்";
    if (suffix === "acre") return "ஏக்கர்";
    if (suffix === "kg") return "கிலோகிராம்";
    return "குவிண்டால்";
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
          <Calculator className="h-6 w-6 text-green-700" />
          {t.title}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t.subtitle}
        </p>
      </div>

      <Tabs defaultValue="yield" className="w-full">
        <TabsList className="flex flex-wrap h-auto w-fit max-w-full bg-green-100/40 border border-green-200/30 p-1.5 gap-1.5 sm:gap-2 rounded-2xl mb-6">
          <TabsTrigger 
            value="yield" 
            className="rounded-xl text-xs sm:text-sm px-4 py-2.5 font-bold transition-all duration-200 text-slate-600 hover:text-green-800 hover:bg-white/40 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-transparent"
          >
            {t.tab_yield}
          </TabsTrigger>
          <TabsTrigger 
            value="npk" 
            className="rounded-xl text-xs sm:text-sm px-4 py-2.5 font-bold transition-all duration-200 text-slate-600 hover:text-green-800 hover:bg-white/40 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-transparent"
          >
            {t.tab_npk}
          </TabsTrigger>
          <TabsTrigger 
            value="converter" 
            className="rounded-xl text-xs sm:text-sm px-4 py-2.5 font-bold transition-all duration-200 text-slate-600 hover:text-green-800 hover:bg-white/40 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-transparent"
          >
            {t.tab_conv}
          </TabsTrigger>
        </TabsList>

        {/* 1. Yield Estimator Content */}
        <TabsContent value="yield" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl border-green-100/50 bg-white shadow-sm p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{t.area_sz}</Label>
                  <Input 
                    type="number" 
                    value={area} 
                    onChange={(e) => setArea(parseFloat(e.target.value) || 0)} 
                    className="rounded-xl border-green-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{t.area_ut}</Label>
                  <Select value={areaUnit} onValueChange={setAreaUnit}>
                    <SelectTrigger className="rounded-xl border-green-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="acres">{t.acres}</SelectItem>
                      <SelectItem value="hectares">{t.hectares}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">{t.crop_lbl}</Label>
                <Select value={cropType} onValueChange={setCropType}>
                  <SelectTrigger className="rounded-xl border-green-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="wheat">{t.wheat}</SelectItem>
                    <SelectItem value="rice">{t.rice}</SelectItem>
                    <SelectItem value="cotton">{t.cotton}</SelectItem>
                    <SelectItem value="potato">{t.potato}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">{t.seed_lbl}</Label>
                <Select value={seedVariety} onValueChange={setSeedVariety}>
                  <SelectTrigger className="rounded-xl border-green-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="standard">{t.standard}</SelectItem>
                    <SelectItem value="hybrid">{t.hybrid}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">{t.rain_lbl}</Label>
                <Select value={rainfall} onValueChange={setRainfall}>
                  <SelectTrigger className="rounded-xl border-green-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="low">{t.rain_low}</SelectItem>
                    <SelectItem value="average">{t.rain_avg}</SelectItem>
                    <SelectItem value="high">{t.rain_high}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={calculateYield}
                className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-5 shadow-lg shadow-green-700/10 font-semibold text-xs mt-2"
              >
                {t.btn_yield}
              </Button>
            </Card>

            <Card className="rounded-2xl border-green-100/50 bg-white shadow-sm p-5 flex flex-col items-center justify-center text-center">
              {yieldResult !== null ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-green-50 p-4 rounded-full text-green-700 inline-block">
                    <Sprout className="h-10 w-10 text-green-600 animate-bounce" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">{t.est_tonnage}</span>
                    <p className="text-3xl font-extrabold text-green-800">{yieldResult} {t.quintals}</p>
                    <p className="text-[10px] text-muted-foreground">({Math.round((yieldResult * 100) * 10) / 100} கிலோ மொத்த மகசூல்)</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
                    {t.est_desc}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-slate-50 p-4 rounded-full text-slate-400 inline-block">
                    <Sprout className="h-8 w-8 text-slate-400" />
                  </div>
                  <div className="max-w-xs">
                    <p className="text-xs font-semibold text-foreground">{t.wait_params}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{t.wait_params_desc}</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* 2. NPK Calculator Content */}
        <TabsContent value="npk" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl border-green-100/50 bg-white shadow-sm p-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">{t.soil_n}</Label>
                <Select value={nLevel} onValueChange={setNLevel}>
                  <SelectTrigger className="rounded-xl border-green-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="low">{t.n_low}</SelectItem>
                    <SelectItem value="medium">{t.n_med}</SelectItem>
                    <SelectItem value="high">{t.n_high}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">{t.soil_p}</Label>
                <Select value={pLevel} onValueChange={setPLevel}>
                  <SelectTrigger className="rounded-xl border-green-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="low">{t.n_low}</SelectItem>
                    <SelectItem value="medium">{t.n_med}</SelectItem>
                    <SelectItem value="high">{t.n_high}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">{t.soil_k}</Label>
                <Select value={kLevel} onValueChange={setKLevel}>
                  <SelectTrigger className="rounded-xl border-green-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="low">{t.n_low}</SelectItem>
                    <SelectItem value="medium">{t.n_med}</SelectItem>
                    <SelectItem value="high">{t.n_high}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={calculateNPK}
                className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-5 shadow-lg shadow-green-700/10 font-semibold text-xs mt-2"
              >
                {t.btn_npk}
              </Button>
            </Card>

            <Card className="rounded-2xl border-green-100/50 bg-white shadow-sm p-5 flex flex-col justify-center text-left">
              {npkResult ? (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-bold text-green-950 text-center">{t.reco_title}</h3>
                  
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center p-3 border border-slate-100 rounded-xl">
                      <div>
                        <span className="text-xs font-bold text-foreground">{lang === "tamil" ? "யூரியா (நைட்ரஜன் சத்து)" : "Urea (Nitrogen Source)"}</span>
                        <p className="text-[10px] text-muted-foreground">{lang === "tamil" ? "யூரியா 46% நைட்ரஜன் கொண்டது" : "Urea 46% Nitrogen"}</p>
                      </div>
                      <span className="text-sm font-extrabold text-green-700">{npkResult.urea} {lang === "tamil" ? "மூட்டைகள்" : "Bags"}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 border border-slate-100 rounded-xl">
                      <div>
                        <span className="text-xs font-bold text-foreground">{lang === "tamil" ? "டி.ஏ.பி (பாஸ்பரஸ் & நைட்ரஜன்)" : "DAP (Phosphorus & Nitrogen)"}</span>
                        <p className="text-[10px] text-muted-foreground">Diammonium Phosphate</p>
                      </div>
                      <span className="text-sm font-extrabold text-green-700">{npkResult.dap} {lang === "tamil" ? "மூட்டைகள்" : "Bags"}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 border border-slate-100 rounded-xl">
                      <div>
                        <span className="text-xs font-bold text-foreground">{lang === "tamil" ? "எம்.ஓ.பி (பொட்டாஷ் சத்து)" : "MOP (Potash Source)"}</span>
                        <p className="text-[10px] text-muted-foreground">Muriate of Potash</p>
                      </div>
                      <span className="text-sm font-extrabold text-green-700">{npkResult.mop} {lang === "tamil" ? "மூட்டைகள்" : "Bags"}</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-muted-foreground text-center">{t.bag_note}</p>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="bg-slate-50 p-4 rounded-full text-slate-400 inline-block">
                    <ShoppingBag className="h-8 w-8 text-slate-400" />
                  </div>
                  <div className="max-w-xs mx-auto">
                    <p className="text-xs font-semibold text-foreground">{t.wait_tests}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{t.wait_tests_desc}</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* 3. Unit Converter Content */}
        <TabsContent value="converter" className="space-y-4">
          <Card className="rounded-2xl border-green-100/50 bg-white shadow-sm p-5 max-w-md mx-auto space-y-4 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">{t.val_conv}</Label>
                <Input 
                  type="number" 
                  value={convVal} 
                  onChange={(e) => { setConvVal(parseFloat(e.target.value) || 0); setConvResult(null); }} 
                  className="rounded-xl border-green-100"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">{t.conv_type}</Label>
                <Select value={convType} onValueChange={(val) => { setConvType(val); setConvResult(null); }}>
                  <SelectTrigger className="rounded-xl border-green-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="acre_hectare">{t.conv_ah}</SelectItem>
                    <SelectItem value="hectare_acre">{t.conv_ha}</SelectItem>
                    <SelectItem value="quintal_kg">{t.conv_qk}</SelectItem>
                    <SelectItem value="kg_quintal">{t.conv_kq}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleConvert}
              className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-5 shadow-lg shadow-green-700/10 font-semibold text-xs"
            >
              {t.btn_conv}
            </Button>

            {convResult !== null && (
              <div className="bg-green-50/50 border border-green-100/40 p-4 rounded-xl text-center space-y-1 animate-fade-in">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">{t.conv_out}</span>
                <p className="text-xl font-extrabold text-green-800 flex items-center justify-center gap-1.5">
                  <Scale className="h-5 w-5 text-green-700" />
                  {convResult} {getLocalizedUnitName(convType)}
                </p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
