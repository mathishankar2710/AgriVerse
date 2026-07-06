import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { LineChart as ChartIcon, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/price-prediction")({
  component: PricePredictionPage,
});

// High-fidelity price data localized to Tamil Nadu crops
const CROP_PRICE_DATA: Record<string, Array<{ month: string; historical?: number; predicted?: number }>> = {
  turmeric: [
    { month: "Jan", historical: 11500 },
    { month: "Feb", historical: 12000 },
    { month: "Mar", historical: 12500 },
    { month: "Apr", historical: 12300 },
    { month: "May", historical: 13000 },
    { month: "Jun", historical: 13800 },
    { month: "Jul", historical: 14000, predicted: 14000 },
    { month: "Aug", predicted: 14500 },
    { month: "Sep", predicted: 15200 },
    { month: "Oct", predicted: 16000 },
  ],
  coconut: [
    { month: "Jan", historical: 4200 },
    { month: "Feb", historical: 4300 },
    { month: "Mar", historical: 4250 },
    { month: "Apr", historical: 4400 },
    { month: "May", historical: 4500 },
    { month: "Jun", historical: 4650 },
    { month: "Jul", historical: 4700, predicted: 4700 },
    { month: "Aug", predicted: 4800 },
    { month: "Sep", predicted: 4900 },
    { month: "Oct", predicted: 4850 },
  ],
  cotton: [
    { month: "Jan", historical: 7100 },
    { month: "Feb", historical: 7200 },
    { month: "Mar", historical: 7150 },
    { month: "Apr", historical: 7300 },
    { month: "May", historical: 7400 },
    { month: "Jun", historical: 7600 },
    { month: "Jul", historical: 7700, predicted: 7700 },
    { month: "Aug", predicted: 7850 },
    { month: "Sep", predicted: 8000 },
    { month: "Oct", predicted: 8150 },
  ],
  rice: [
    { month: "Jan", historical: 2400 },
    { month: "Feb", historical: 2450 },
    { month: "Mar", historical: 2500 },
    { month: "Apr", historical: 2480 },
    { month: "May", historical: 2550 },
    { month: "Jun", historical: 2600 },
    { month: "Jul", historical: 2620, predicted: 2620 },
    { month: "Aug", predicted: 2680 },
    { month: "Sep", predicted: 2750 },
    { month: "Oct", predicted: 2800 },
  ],
  tapioca: [
    { month: "Jan", historical: 1600 },
    { month: "Feb", historical: 1650 },
    { month: "Mar", historical: 1700 },
    { month: "Apr", historical: 1680 },
    { month: "May", historical: 1750 },
    { month: "Jun", historical: 1800 },
    { month: "Jul", historical: 1820, predicted: 1820 },
    { month: "Aug", predicted: 1880 },
    { month: "Sep", predicted: 1950 },
    { month: "Oct", predicted: 2000 },
  ],
  sugarcane: [
    { month: "Jan", historical: 310 },
    { month: "Feb", historical: 315 },
    { month: "Mar", historical: 320 },
    { month: "Apr", historical: 318 },
    { month: "May", historical: 325 },
    { month: "Jun", historical: 330 },
    { month: "Jul", historical: 335, predicted: 335 },
    { month: "Aug", predicted: 340 },
    { month: "Sep", predicted: 348 },
    { month: "Oct", predicted: 355 },
  ],
  banana: [
    { month: "Jan", historical: 2200 },
    { month: "Feb", historical: 2300 },
    { month: "Mar", historical: 2400 },
    { month: "Apr", historical: 2350 },
    { month: "May", historical: 2450 },
    { month: "Jun", historical: 2550 },
    { month: "Jul", historical: 2600, predicted: 2600 },
    { month: "Aug", predicted: 2700 },
    { month: "Sep", predicted: 2800 },
    { month: "Oct", predicted: 2755 },
  ],
  mango: [
    { month: "Jan", historical: 3500 },
    { month: "Feb", historical: 4000 },
    { month: "Mar", historical: 4500 },
    { month: "Apr", historical: 4200 },
    { month: "May", historical: 5000 },
    { month: "Jun", historical: 6500 },
    { month: "Jul", historical: 7000, predicted: 7000 },
    { month: "Aug", predicted: 7200 },
    { month: "Sep", predicted: 6000 },
    { month: "Oct", predicted: 5000 },
  ],
  groundnut: [
    { month: "Jan", historical: 6500 },
    { month: "Feb", historical: 6700 },
    { month: "Mar", historical: 6800 },
    { month: "Apr", historical: 6750 },
    { month: "May", historical: 6900 },
    { month: "Jun", historical: 7100 },
    { month: "Jul", historical: 7200, predicted: 7200 },
    { month: "Aug", predicted: 7350 },
    { month: "Sep", predicted: 7500 },
    { month: "Oct", predicted: 7650 },
  ],
  maize: [
    { month: "Jan", historical: 1900 },
    { month: "Feb", historical: 1950 },
    { month: "Mar", historical: 2000 },
    { month: "Apr", historical: 1980 },
    { month: "May", historical: 2050 },
    { month: "Jun", historical: 2100 },
    { month: "Jul", historical: 2120, predicted: 2120 },
    { month: "Aug", predicted: 2180 },
    { month: "Sep", predicted: 2250 },
    { month: "Oct", predicted: 2300 },
  ],
  chilli: [
    { month: "Jan", historical: 18000 },
    { month: "Feb", historical: 18500 },
    { month: "Mar", historical: 19000 },
    { month: "Apr", historical: 18800 },
    { month: "May", historical: 19500 },
    { month: "Jun", historical: 20000 },
    { month: "Jul", historical: 20200, predicted: 20200 },
    { month: "Aug", predicted: 20800 },
    { month: "Sep", predicted: 21500 },
    { month: "Oct", predicted: 22000 },
  ],
};

const translations: Record<string, Record<string, any>> = {
  english: {
    title: "Crop Price Prediction System",
    subtitle: "Model future wholesale prices based on historic trends and expected market supply conditions.",
    market_settings: "Market Settings",
    market_desc: "Select variables to forecast",
    select_crop: "Select Crop",
    supply_shift: "Expected Supply Shift (%)",
    change_yield: "Change in yield",
    btn_recalc: "Re-calculate Forecast",
    card_current: "Current Mandi Rate",
    card_current_desc: "Latest reported wholesale price.",
    card_pred: "Predicted Rate (3m)",
    card_pred_desc: "Forecasted rate incorporating trends.",
    card_trend: "3-Month Price Trend",
    card_trend_desc: "Aggregated rate direction change.",
    card_window: "Optimal Sale Window",
    card_window_desc: "Best forecasted sell month for max profit.",
    chart_title: "Pricing Trend Chart",
    chart_desc: "Continuous pricing from historical to predicted intervals",
    legend_hist: "Historical Rate (₹)",
    legend_pred: "Predicted Forecast (₹)",
    disclaimer_title: "Market Prediction Disclaimer",
    disclaimer_desc: "Market pricing models are generated using historical seasonality cycles and user supply factors. Actual spot rates at your local mandi can fluctuate based on sudden weather changes, government export policies, and fuel prices.",
    unit: "quintal",
    toast_success: "Price model adjusted with custom supply shift"
  },
  tamil: {
    title: "பயிர் விலை கணிப்பு முறை",
    subtitle: "வரலாற்றுப் போக்குகள் மற்றும் சந்தை விநியோக நிலைகளின் அடிப்படையில் எதிர்கால விலைகளைக் கணக்கிடுங்கள்.",
    market_settings: "சந்தை அமைப்புகள்",
    market_desc: "விலையைக் கணிக்கப் பயிரைத் தேர்ந்தெடுக்கவும்",
    select_crop: "பயிரைத் தேர்ந்தெடு",
    supply_shift: "எதிர்பார்க்கப்படும் விநியோக மாற்றம் (%)",
    change_yield: "விளைச்சலில் ஏற்படும் மாற்றம்",
    btn_recalc: "மீண்டும் கணக்கிடு",
    card_current: "தற்போதைய சந்தை விலை",
    card_current_desc: "சந்தையில் தற்போதைய அதிகாரப்பூர்வ விலை.",
    card_pred: "கணிக்கப்பட்ட விலை (3 மாதம்)",
    card_pred_desc: "போக்குவரத்து மற்றும் தேவையை அடிப்படையாகக் கொண்ட கணிப்பு.",
    card_trend: "3-மாத விலை போக்கு",
    card_trend_desc: "விலை மாற்றத்தின் ஒட்டுமொத்த திசை.",
    card_window: "விற்பனைக்கு உகந்த காலம்",
    card_window_desc: "அதிக லாபம் பெற உகந்த விற்பனை மாதம்.",
    chart_title: "விலை போக்கு வரைபடம்",
    chart_desc: "வரலாற்று விலை மற்றும் கணிக்கப்பட்ட விலையின் தொடர்ச்சியான ஒப்பீடு",
    legend_hist: "வரலாற்று விலை (₹)",
    legend_pred: "கணிக்கப்பட்ட விலை (₹)",
    disclaimer_title: "விலை கணிப்பு நிபந்தனைகள்",
    disclaimer_desc: "விலை கணிப்புகள் வரலாற்று தரவுகள் மற்றும் கால சுழற்சியை அடிப்படையாகக் கொண்டவை. சந்தையின் உண்மையான விலையானது வானிலை மாற்றங்கள், அரசின் ஏற்றுமதி கொள்கைகள் மற்றும் எரிபொருள் விலையின் அடிப்படையில் மாறுபடலாம்.",
    unit: "குவிண்டால்",
    toast_success: "விலை கணிப்பு மாதிரி மாற்றி அமைக்கப்பட்டுள்ளது!"
  }
};

const translateMonth = (month: string, lang: string) => {
  if (lang !== "tamil") return month;
  const map: Record<string, string> = {
    Jan: "ஜனவரி", Feb: "பிப்ரவரி", Mar: "மார்ச்", Apr: "ஏப்ரல்", May: "மே", Jun: "ஜூன்",
    Jul: "ஜூலை", Aug: "ஆகஸ்ட்", Sep: "செப்டம்பர்", Oct: "அக்டோபர்", Nov: "நவம்பர்", Dec: "டிசம்பர்",
    January: "ஜனவரி", February: "பிப்ரவரி", March: "மார்ச்", April: "ஏப்ரல்",
    June: "ஜூன்", July: "ஜூலை", August: "ஆகஸ்ட்", September: "செப்டம்பர்", October: "அக்டோபர்"
  };
  return map[month] || month;
};

function PricePredictionPage() {
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

  const pt = translations[lang] || translations.english;

  const [crop, setCrop] = useState<string>("turmeric");
  const [market, setMarket] = useState<string>("erode");
  const [supplyShift, setSupplyShift] = useState<number>(0);
  const [calculating, setCalculating] = useState<boolean>(false);
  const [customForecast, setCustomForecast] = useState<Array<{ month: string; historical?: number; predicted?: number }> | null>(null);

  const rawData = CROP_PRICE_DATA[crop] || [];
  const currentData = customForecast || rawData;

  const calculateCustomPrediction = () => {
    setCalculating(true);
    setTimeout(() => {
      // Modify future predictions based on user shifting parameters
      const modified = rawData.map((d) => {
        if (d.predicted !== undefined) {
          const factor = 1 - (supplyShift / 100) * 0.15; // Shifting supply decreases price
          const basePrice = d.predicted;
          return {
            ...d,
            predicted: Math.round(basePrice * factor),
          };
        }
        return d;
      });
      setCustomForecast(modified);
      setCalculating(false);
      toast.success(pt.toast_success);
    }, 600);
  };

  const getStats = () => {
    const historicals = rawData.filter(d => d.historical !== undefined).map(d => d.historical as number);
    const predictions = rawData.filter(d => d.predicted !== undefined).map(d => d.predicted as number);
    
    const lastHistorical = historicals[historicals.length - 1] || 0;
    const finalPredicted = predictions[predictions.length - 1] || 0;
    
    const diff = finalPredicted - lastHistorical;
    const pct = ((diff / lastHistorical) * 100).toFixed(1);
    
    let direction = diff >= 0 ? "Rising" : "Falling";
    if (lang === "tamil") {
      direction = diff >= 0 ? "உயர்கிறது" : "குறைகிறது";
    }

    const maxPredictionIndex = predictions.indexOf(Math.max(...predictions));
    const months = rawData.filter(d => d.predicted !== undefined).map(d => d.month);
    const bestMonth = months[maxPredictionIndex] || "September";

    return {
      currentPrice: `₹${lastHistorical}/${pt.unit}`,
      predictedPrice: `₹${finalPredicted}/${pt.unit}`,
      trend: `${diff >= 0 ? "+" : ""}${pct}% (${direction})`,
      bestWindow: translateMonth(bestMonth, lang),
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
          <ChartIcon className="h-6 w-6 text-green-700" />
          {pt.title}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {pt.subtitle}
        </p>
      </div>

      {/* Inputs Panel */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 rounded-2xl border-green-100/50 bg-white shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">{pt.market_settings}</CardTitle>
            <CardDescription className="text-xs">{pt.market_desc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">{pt.select_crop}</Label>
              <Select value={crop} onValueChange={(val) => { setCrop(val); setCustomForecast(null); }}>
                <SelectTrigger className="rounded-xl border-green-100 focus:ring-green-600">
                  <SelectValue placeholder="Crop Type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-green-100 max-h-56 overflow-y-auto">
                  <SelectItem value="turmeric">{lang === "tamil" ? "மஞ்சள் (Turmeric)" : "Turmeric (Manjal)"}</SelectItem>
                  <SelectItem value="coconut">{lang === "tamil" ? "தேங்காய் (Coconut)" : "Coconut (Thengai)"}</SelectItem>
                  <SelectItem value="cotton">{lang === "tamil" ? "பருத்தி (Cotton)" : "Cotton (Paruthi)"}</SelectItem>
                  <SelectItem value="rice">{lang === "tamil" ? "நெல் / அரிசி (Rice)" : "Rice/Paddy (Nel)"}</SelectItem>
                  <SelectItem value="tapioca">{lang === "tamil" ? "மரவள்ளிக்கிழங்கு (Tapioca)" : "Tapioca (Maravalli)"}</SelectItem>
                  <SelectItem value="sugarcane">{lang === "tamil" ? "கரும்பு (Sugarcane)" : "Sugarcane (Karumbu)"}</SelectItem>
                  <SelectItem value="banana">{lang === "tamil" ? "வாழை (Banana)" : "Banana (Vazhai)"}</SelectItem>
                  <SelectItem value="mango">{lang === "tamil" ? "மாம்பழம் (Mango)" : "Mango (Maambazham)"}</SelectItem>
                  <SelectItem value="groundnut">{lang === "tamil" ? "நிலக்கடலை (Groundnut)" : "Groundnut (Kadalai)"}</SelectItem>
                  <SelectItem value="maize">{lang === "tamil" ? "சோளம் (Maize)" : "Maize (Cholam)"}</SelectItem>
                  <SelectItem value="chilli">{lang === "tamil" ? "மிளகாய் (Chilli)" : "Chilli (Milagai)"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">{pt.supply_shift}</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="e.g. +10, -5"
                  value={supplyShift}
                  onChange={(e) => setSupplyShift(parseInt(e.target.value) || 0)}
                  className="rounded-xl border-green-100 focus-visible:ring-green-600"
                />
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{pt.change_yield}</span>
              </div>
            </div>

            <Button
              onClick={calculateCustomPrediction}
              disabled={calculating}
              className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl shadow-lg shadow-green-700/10 py-5 font-semibold text-xs gap-1.5 mt-2"
            >
              {calculating ? (lang === "tamil" ? "கணக்கிடப்படுகிறது..." : "Calculating...") : pt.btn_recalc}
            </Button>
          </CardContent>
        </Card>

        {/* Forecast Stats Dashboard Cards */}
        <div className="md:col-span-2 grid gap-4 grid-cols-2">
          <Card className="rounded-2xl border-green-50 shadow-sm bg-white p-4 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">{pt.card_current}</span>
              <p className="text-xl font-extrabold text-foreground">{stats.currentPrice}</p>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">{pt.card_current_desc}</p>
          </Card>

          <Card className="rounded-2xl border-green-50 shadow-sm bg-white p-4 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">{pt.card_pred}</span>
              <p className="text-xl font-extrabold text-foreground">{stats.predictedPrice}</p>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">{pt.card_pred_desc}</p>
          </Card>

          <Card className="rounded-2xl border-green-50 shadow-sm bg-white p-4 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-green-700" />
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">{pt.card_trend}</span>
              </div>
              <p className="text-base font-extrabold text-green-800">{stats.trend}</p>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">{pt.card_trend_desc}</p>
          </Card>

          <Card className="rounded-2xl border-green-50 shadow-sm bg-white p-4 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-amber-600" />
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">{pt.card_window}</span>
              </div>
              <p className="text-base font-extrabold text-amber-800">{stats.bestWindow}</p>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">{pt.card_window_desc}</p>
          </Card>
        </div>
      </div>

      {/* Chart Panel */}
      <Card className="rounded-2xl border-green-100/50 bg-white shadow-sm overflow-hidden p-5">
        <CardHeader className="p-0 pb-5">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            {pt.chart_title}
          </CardTitle>
          <CardDescription className="text-xs">{pt.chart_desc}</CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData.map(d => ({ ...d, month: translateMonth(d.month, lang) }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f5ef" />
                <XAxis dataKey="month" stroke="#889885" fontSize={11} tickLine={false} />
                <YAxis stroke="#889885" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "rgba(255,255,255,0.95)", border: "1px solid #dcfce7", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}
                  labelStyle={{ fontWeight: "bold", color: "#166534" }}
                />
                <Legend iconType="circle" />
                <Line 
                  type="monotone" 
                  dataKey="historical" 
                  name={pt.legend_hist} 
                  stroke="#166534" 
                  strokeWidth={2.5} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  name={pt.legend_pred} 
                  stroke="#f59e0b" 
                  strokeWidth={2} 
                  strokeDasharray="4 4" 
                  dot={{ r: 3 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Advisory Alert */}
      <div className="flex gap-3 bg-blue-50/50 border border-blue-100/50 p-4 rounded-2xl items-start">
        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-blue-900">{pt.disclaimer_title}</p>
          <p className="text-[10px] text-blue-800/80 leading-relaxed">
            {pt.disclaimer_desc}
          </p>
        </div>
      </div>
    </div>
  );
}
