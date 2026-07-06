import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Leaf, 
  Cpu, 
  MessageSquareCode, 
  ScanEye, 
  LineChart, 
  Calculator, 
  CloudSun, 
  MapPin, 
  Droplet, 
  Thermometer, 
  Wind, 
  Power,
  Bell,
  BarChart3,
  TrendingUp,
  Coins,
  Sprout,
  ShoppingBag
} from "lucide-react";
import heroFarm from "@/assets/hero-farm.jpg";
import { fetchWeatherForecast, reverseGeocode, WeatherData } from "@/lib/weather-services";
import { toast } from "sonner";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

const dashboardTranslations: Record<string, Record<string, string>> = {
  english: {
    grow_smarter: "Grow Smarter with AgriVerse",
    hero_desc: "Harness real-time climate telemetry, IoT control, and LLM-powered visual diagnostics to maximize your yields and profits.",
    live_climate: "Live Climate Status",
    gps: "GPS Sync",
    map_picker: "Map Picker",
    iot_title: "IoT Irrigation Control",
    iot_desc: "Remote smart automation & telemetry node",
    pump_status: "Irrigation Pump Status",
    pump_on: "PUMP RUNNING",
    pump_off: "PUMP STANDBY",
    turn_on: "Start Irrigation Flow",
    turn_off: "Stop Irrigation Flow",
    broadcast_title: "Emergency Warning Alerts",
    broadcast_desc: "Urgent broadcasts from ecosystem coordinators",
    analytics_title: "Farm Revenue & Expenditure",
    analytics_desc: "Yield valuation vs operational input costs",
    suite_title: "AgriVerse Suite Portal",
    suite_desc: "Select a module below to optimize your farm operations"
  },
  tamil: {
    grow_smarter: "அக்ரிவர்ஸ் மூலம் புத்திசாலித்தனமாக வளருங்கள்",
    hero_desc: "நேரடி காலநிலை நிலை, IoT கட்டுப்பாடு மற்றும் பயிர் மேலாண்மை பகுப்பாய்வுகளை அக்ரிவர்ஸ் மூலம் எளிதாக அணுகுங்கள்.",
    live_climate: "நேரடி காலநிலை நிலை",
    gps: "ஜிபிஎஸ்",
    map_picker: "வரைபடம்",
    iot_title: "IoT நீர் பாசன பம்ப்",
    iot_desc: "தொலைநிலை தானியங்கி நீர்ப்பாசனக் கட்டுப்பாடு",
    pump_status: "பாசன பம்ப் நிலை",
    pump_on: "பம்ப் இயங்குகிறது (RUNNING)",
    pump_off: "பம்ப் காத்திருப்பில் உள்ளது (STANDBY)",
    turn_on: "பாசனத்தை துவக்கு",
    turn_off: "பாசனத்தை நிறுத்து",
    broadcast_title: "அவசர அறிவிப்புகள் & எச்சரிக்கைகள்",
    broadcast_desc: "ஒருங்கிணைப்பாளர்களிடமிருந்து அவசர அறிவிப்புகள்",
    analytics_title: "விவசாய வருவாய் & செலவினம்",
    analytics_desc: "வருவாய் மதிப்பு மற்றும் உள்ளீட்டு செலவுகள் பகுப்பாய்வு",
    suite_title: "அக்ரிவர்ஸ் சேவைகள்",
    suite_desc: "விவசாய செயல்பாடுகளை மேம்படுத்த கீழே உள்ள பிரிவை தேர்ந்தெடுக்கவும்"
  }
};

const translateMonth = (month: string, lang: string) => {
  if (lang !== "tamil") return month;
  const map: Record<string, string> = {
    Jan: "ஜனவரி",
    Feb: "பிப்ரவரி",
    Mar: "மார்ச்",
    Apr: "ஏப்ரல்",
    May: "மே",
    Jun: "ஜூன்"
  };
  return map[month] || month;
};

function Dashboard() {
  // Language configuration state
  const [lang, setLang] = useState("english");

  // Weather state
  const [lat, setLat] = useState<number>(11.0168); // Coimbatore, Tamil Nadu default
  const [lon, setLon] = useState<number>(76.9558);
  const [locationName, setLocationName] = useState<string>("Coimbatore, Tamil Nadu");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);

  // IoT Motor state
  const [motorOn, setMotorOn] = useState<boolean>(false);
  const [motorTransition, setMotorTransition] = useState<boolean>(false);

  // Notifications & Analytics state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState([
    { month: "Jan", yieldValue: 12000, expenses: 5000 },
    { month: "Feb", yieldValue: 15000, expenses: 6000 },
    { month: "Mar", yieldValue: 18000, expenses: 7200 },
    { month: "Apr", yieldValue: 24000, expenses: 8000 },
    { month: "May", yieldValue: 22000, expenses: 8500 },
    { month: "Jun", yieldValue: 31000, expenses: 9000 },
  ]);

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

  // Load broadcasts from local storage
  useEffect(() => {
    const saved = localStorage.getItem("admin_broadcasts");
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const clearNotification = (id: number) => {
    const filtered = notifications.filter((n) => n.id !== id);
    setNotifications(filtered);
    localStorage.setItem("admin_broadcasts", JSON.stringify(filtered));
    toast.info(lang === "tamil" ? "அறிவிப்பு நீக்கப்பட்டது" : "Alert dismissed");
  };

  // Load initial weather, default to asking for current location (GPS)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude);
          setLon(longitude);
          loadWeather(latitude, longitude);
          toast.success(lang === "tamil" ? "இருப்பிடம் ஜிபிஎஸ் மூலம் கண்டறியப்பட்டது" : "Location determined automatically via GPS");
        },
        (error) => {
          console.warn("Auto-geolocation failed, using default location:", error);
          loadWeather(11.0168, 76.9558); // Fallback to Coimbatore default
        }
      );
    } else {
      loadWeather(11.0168, 76.9558); // Fallback to Coimbatore default
    }
  }, [lang]);

  const loadWeather = async (latitude: number, longitude: number) => {
    setLoadingWeather(true);
    try {
      const data = await fetchWeatherForecast(latitude, longitude);
      setWeather(data);
      let name = await reverseGeocode(latitude, longitude);
      if (lang === "tamil" && name.includes("Coimbatore")) {
        name = "கோயம்புத்தூர், தமிழ்நாடு";
      }
      setLocationName(name);
    } catch (e) {
      console.error(e);
      toast.error(lang === "tamil" ? "வானிலை தரவுகளைப் பெற முடியவில்லை" : "Failed to load weather forecast");
    } finally {
      setLoadingWeather(false);
    }
  };

  const useGPS = () => {
    if (!navigator.geolocation) {
      return toast.error(lang === "tamil" ? "ஜிபிஎஸ் வசதி ஆதரிக்கப்படவில்லை" : "Geolocation is not supported by your browser");
    }
    setLoadingWeather(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLon(longitude);
        loadWeather(latitude, longitude);
        toast.success(lang === "tamil" ? "இருப்பிடம் புதுப்பிக்கப்பட்டது" : "Location updated via GPS");
      },
      (error) => {
        console.error(error);
        setLoadingWeather(false);
        toast.error(lang === "tamil" ? "ஜிபிஎஸ் ஒருங்கிணைப்பை பெற முடியவில்லை" : "Unable to retrieve GPS coordinates");
      }
    );
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert click coordinates to simulated India lat/lon range
    const simulatedLat = 37 - (y / rect.height) * (37 - 8);
    const simulatedLon = 68 + (x / rect.width) * (97 - 68);
    
    setLat(simulatedLat);
    setLon(simulatedLon);
    loadWeather(simulatedLat, simulatedLon);
    setShowMap(false);
    toast.success(lang === "tamil" ? "வரைபடத்தில் இருப்பிடம் தேர்ந்தெடுக்கப்பட்டது" : "Location selected on Map");
  };

  const toggleMotor = () => {
    setMotorTransition(true);
    setTimeout(() => {
      setMotorOn(!motorOn);
      setMotorTransition(false);
      toast.success(lang === "tamil" 
        ? `மோட்டார் ${!motorOn ? "இயக்கப்பட்டது" : "நிறுத்தப்பட்டது"} வெற்றிகரமாக` 
        : `Motor turned ${!motorOn ? "ON" : "OFF"} successfully`
      );
    }, 800);
  };

  const translateWeatherDesc = (desc: string) => {
    if (lang !== "tamil") return desc;
    const lower = desc.toLowerCase();
    if (lower.includes("clear")) return "தெளிவான வானிலை";
    if (lower.includes("cloudy") || lower.includes("clouds")) return "மேகமூட்டம்";
    if (lower.includes("overcast")) return "முழு மேகமூட்டம்";
    if (lower.includes("drizzle")) return "சாரல் மழை";
    if (lower.includes("rain")) return "மழை பொழிவு";
    if (lower.includes("snow")) return "பனிப்பொழிவு";
    if (lower.includes("thunderstorm")) return "இடியுடன் கூடிய மழை";
    if (lower.includes("fog") || lower.includes("mist")) return "பனிமூட்டம்";
    return "மிதமான வானிலை";
  };

  const dt = dashboardTranslations[lang] || dashboardTranslations.english;

  const services = [
    {
      title: lang === "tamil" ? "பயிர் மேலாண்மை" : "Crop Management",
      description: lang === "tamil" ? "ஸ்மார்ட் பயிர் பரிந்துரைகள், விளைச்சல் கணிப்புகள் மற்றும் சாகுபடி அட்டவணை." : "Get smart crop suggestions, calculate yield forecasts, and plan sowing milestones.",
      to: "/crop-management",
      icon: Leaf,
      color: "bg-green-600",
      textColor: "text-green-600",
    },
    {
      title: lang === "tamil" ? "AI அரட்டை" : "AI Smart Chatbot",
      description: lang === "tamil" ? "விவசாய சந்தேகங்களுக்கு உடனடி பதில்களைப் பெற எங்களது AI நிபுணரிடம் பேசுங்கள்." : "Direct chat with our agricultural expert for quick answers and suggestions.",
      to: "/chatbot",
      icon: MessageSquareCode,
      color: "bg-blue-600",
      textColor: "text-blue-600",
    },
    {
      title: lang === "tamil" ? "நோய் கண்டறிதல்" : "Crop Disease Scan",
      description: lang === "tamil" ? "பயிர் இலைகளின் புகைப்படங்களைப் பதிவேற்றி நோய்களைக் கண்டறிந்து சிகிச்சையளிக்கவும்." : "Upload leaf photos for diagnostic identification and curative treatments.",
      to: "/disease",
      icon: ScanEye,
      color: "bg-emerald-600",
      textColor: "text-emerald-600",
    },
    {
      title: lang === "tamil" ? "மண் & உரம்" : "Soil & Fertilizer",
      description: lang === "tamil" ? "மண்ணின் NPK தன்மையை பகுப்பாய்வு செய்து உரங்களின் தேவையை கணக்கிடுக." : "Analyze NPK element status and generate slow-release fertilizer schedules.",
      to: "/soil-fertilizer",
      icon: Sprout,
      color: "bg-amber-600",
      textColor: "text-amber-600",
    },
    {
      title: lang === "tamil" ? "IoT நீர் பாசனம்" : "IoT Irrigation Control",
      description: lang === "tamil" ? "பாசன மோட்டாரை இயக்குக, தானியங்கி நேரத்தை தேர்வு செய்க." : "Toggle irrigation pumps, set automated timer cycles, and observe water stats.",
      to: "/iot",
      icon: Cpu,
      color: "bg-teal-600",
      textColor: "text-teal-600",
    },
    {
      title: lang === "tamil" ? "சந்தை & கடத்துகை" : "Market & Logistics",
      description: lang === "tamil" ? "விவசாய உபகரணங்கள் வாடகை, விளைச்சல் வாகனங்கள் மற்றும் குளிர்சாதன கிடங்கு முன்பதிவு." : "Rent heavy machinery, book crop transit carriers, and rent cold storage slots.",
      to: "/marketplace",
      icon: ShoppingBag,
      color: "bg-purple-600",
      textColor: "text-purple-600",
    },
    {
      title: lang === "tamil" ? "நிதி & சேவைகள்" : "Services & Finance",
      description: lang === "tamil" ? "குறைந்த வட்டி பயிர் கடன்கள், மானியங்கள் மற்றும் பயிர் காப்பீட்டு திட்டங்கள்." : "Apply for low-interest crop loans, PM subsidies, and talk to farming experts.",
      to: "/services",
      icon: Coins,
      color: "bg-orange-600",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 text-left">
      {/* Broadcast Notifications Alert */}
      {notifications.length > 0 && (
        <div className="space-y-2.5">
          {notifications.map((n) => (
            <div key={n.id} className="bg-amber-55 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-fade-in">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-amber-600 flex-shrink-0 animate-bounce" />
                <div className="text-left">
                  <span className="text-[10px] text-amber-800 font-bold block uppercase tracking-wider">
                    {lang === "tamil" ? "அவசிய அறிவிப்பு" : "Urgent Broadcast"} • {n.timestamp}
                  </span>
                  <p className="text-xs font-semibold text-amber-955 mt-0.5">{n.message}</p>
                </div>
              </div>
              <Button onClick={() => clearNotification(n.id)} variant="ghost" size="sm" className="text-amber-800 hover:bg-amber-100/50 rounded-xl h-8 text-xs font-bold px-3">
                {lang === "tamil" ? "நீக்கு" : "Dismiss"}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Hero Banner */}
      <div
        className="relative overflow-hidden rounded-2xl bg-cover bg-center shadow-lg"
        style={{ backgroundImage: `url(${heroFarm})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/80 via-green-900/50 to-transparent" />
        <div className="relative px-6 py-12 sm:px-10 sm:py-16 text-white max-w-2xl text-left">
          <span className="bg-green-700/80 text-green-100 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {lang === "tamil" ? "இணைக்கப்பட்டது & உகந்தது" : "Connected & Optimized"}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3">
            {dt.grow_smarter}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-green-50/90 leading-relaxed">
            {dt.hero_desc}
          </p>
        </div>
      </div>

      {/* Stats Widgets Panel */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Live Weather Forecast Widget */}
        <Card className="rounded-2xl border-green-100/50 shadow-sm overflow-hidden bg-white">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <CloudSun className="h-5 w-5 text-green-600" />
                {dt.live_climate}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 mt-0.5 text-xs">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                {locationName}
              </CardDescription>
            </div>
            
            <div className="flex gap-1.5">
              <Button onClick={useGPS} size="sm" variant="outline" className="text-xs h-8 rounded-lg border-green-100 text-green-700 hover:bg-green-55">
                {dt.gps}
              </Button>
              <Button onClick={() => setShowMap(!showMap)} size="sm" variant="outline" className="text-xs h-8 rounded-lg border-green-100 text-green-700 hover:bg-green-55">
                {dt.map_picker}
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="relative">
            {/* Map Popup */}
            {showMap && (
              <div className="absolute inset-x-4 top-0 bottom-4 bg-white/95 backdrop-blur-sm border border-green-100 rounded-xl p-3 z-10 flex flex-col space-y-2 animate-fade-in shadow-inner">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-green-800">
                    {lang === "tamil" ? "காலநிலை பார்க்க வரைபடத்தில் கிளிக் செய்யவும்:" : "Click anywhere on the map to set location:"}
                  </span>
                  <Button onClick={() => setShowMap(false)} variant="ghost" size="sm" className="h-6 px-2 text-muted-foreground">
                    {lang === "tamil" ? "மூடு" : "Close"}
                  </Button>
                </div>
                <div 
                  onClick={handleMapClick}
                  className="flex-1 bg-gradient-to-tr from-green-50 via-emerald-100 to-sky-100 rounded-lg relative cursor-crosshair overflow-hidden border border-green-200/50"
                >
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="absolute top-1/4 left-1/3 w-6 h-6 rounded-full bg-green-600/10 border border-green-600 animate-ping" />
                  <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-green-600" />
                  <span className="absolute bottom-2 right-2 text-[10px] text-muted-foreground bg-white/80 px-1 rounded">Interactive Map Simulator</span>
                </div>
              </div>
            )}

            {loadingWeather ? (
              <div className="h-32 flex flex-col items-center justify-center space-y-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-700" />
                <span className="text-xs text-muted-foreground">{lang === "tamil" ? "வானிலை தகவல் பெறப்படுகிறது..." : "Fetching live weather telemetry..."}</span>
              </div>
            ) : weather ? (
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="flex items-center gap-3">
                  <div className="p-3.5 rounded-2xl bg-green-50 text-green-700">
                    <Thermometer className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      {lang === "tamil" ? "வெப்பநிலை" : "Temperature"}
                    </span>
                    <span className="text-xl font-extrabold text-foreground">{weather.temp}°C</span>
                    <span className="text-[10px] text-muted-foreground block capitalize">{translateWeatherDesc(weather.description)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600">
                    <Droplet className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      {lang === "tamil" ? "ஈரப்பதம்" : "Humidity"}
                    </span>
                    <span className="text-xl font-extrabold text-foreground">{weather.humidity}%</span>
                    <span className="text-[10px] text-muted-foreground block">
                      {lang === "tamil" ? "மழை அளவு: " : "Rainfall: "} {weather.rain}mm
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-xs text-muted-foreground">
                {lang === "tamil" ? "வானிலை தரவுகள் இல்லை. ஜிபிஎஸ் முடக்கப்பட்டுள்ளது." : "No weather data synced. GPS offline."}
              </div>
            )}
          </CardContent>
        </Card>

        {/* IoT Pump Controller Widget */}
        <Card className="rounded-2xl border-green-100/50 shadow-sm bg-white p-5 flex flex-col justify-between">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Cpu className="h-5 w-5 text-green-600" />
              {dt.iot_title}
            </CardTitle>
            <CardDescription className="text-xs">{dt.iot_desc}</CardDescription>
          </CardHeader>
          
          <CardContent className="p-0 flex-1 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">{dt.pump_status}</span>
              <span className={`text-sm font-extrabold flex items-center gap-1.5 ${motorOn ? "text-green-700" : "text-slate-400"}`}>
                <span className={`h-2.5 w-2.5 rounded-full ${motorOn ? "bg-green-600 animate-pulse" : "bg-slate-350"}`} />
                {motorOn ? dt.pump_on : dt.pump_off}
              </span>
            </div>

            <Button
              onClick={toggleMotor}
              disabled={motorTransition}
              className={`rounded-xl px-5 py-5 text-xs font-semibold shadow-md flex items-center gap-2 transition-all ${
                motorOn 
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-red-700/5" 
                  : "bg-green-700 hover:bg-green-800 text-white shadow-green-700/5"
              }`}
            >
              <Power className={`h-4 w-4 ${motorTransition ? "animate-spin" : ""}`} />
              {motorOn ? dt.turn_off : dt.turn_on}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recharts Monthly Analytics Graph */}
      <Card className="rounded-2xl border-green-100/50 shadow-sm bg-white p-5">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
            <BarChart3 className="h-5 w-5 text-green-600" />
            {dt.analytics_title}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">{dt.analytics_desc}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData.map(d => ({ ...d, month: translateMonth(d.month, lang) }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Bar dataKey="yieldValue" name={lang === "tamil" ? "விளைச்சல் மதிப்பு (₹)" : "Yield Value (₹)"} fill="#166534" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name={lang === "tamil" ? "செலவுகள் (₹)" : "Expenses (₹)"} fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Main Suite Portal Grid */}
      <div className="space-y-4">
        <div className="text-left">
          <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-700" />
            {dt.suite_title}
          </h2>
          <p className="text-xs text-muted-foreground">
            {dt.suite_desc}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {services.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Link 
                key={idx} 
                to={s.to}
                className="group p-5 bg-white border border-green-50/60 rounded-2xl hover:border-green-600/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left"
              >
                <div>
                  <div className={`p-3 rounded-xl ${s.color} bg-opacity-10 ${s.textColor} w-fit group-hover:scale-105 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mt-4 group-hover:text-green-800 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-green-700 mt-4 opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                  {lang === "tamil" ? "துவக்குக" : "Launch"} →
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
