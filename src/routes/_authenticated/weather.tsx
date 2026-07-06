import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchWeatherForecast, reverseGeocode, WeatherData } from "@/lib/weather-services";
import { CloudSun, Droplet, Thermometer, Wind, Calendar, History, TrendingUp, AlertTriangle, MapPin, Navigation } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/weather")({
  component: WeatherHubPage,
});

const translations: Record<string, Record<string, any>> = {
  english: {
    title: "Weather & Climate Hub",
    subtitle: "Review live parameters, historical charts, and upcoming 7-day soil sowing forecasts.",
    gps_btn: "GPS Sync",
    loading: "Syncing weather satellites...",
    tab_current: "Current Weather",
    tab_past: "Past Trends (30d)",
    tab_future: "7-Day Forecast",
    live_telemetry: "Live Telemetry",
    feels_like: "Feels like",
    humidity: "Humidity",
    wind: "Wind Speed",
    adv_title: "Climate Sowing Advisory",
    adv_desc_prefix: "Current humidity level is",
    adv_desc_mid: "and temperature is",
    adv_desc_suffix: "These conditions are highly favorable for soil microbial activity. If you are cultivating Turmeric or Banana, proceed with second-stage fertilizer application. Avoid insecticide spray if wind speeds exceed 15 km/h.",
    evap_title: "Ideal Evapotranspiration Rate",
    evap_desc: "Soil moisture evaporation index: **Normal (3.2 mm/day)**",
    past_temp_title: "Temperature Trend (Last 30 Days)",
    past_rain_title: "Precipitation Volume (Last 30 Days)",
    forecast_week_title: "Upcoming Week Weather Sowing Forecast",
    forecast_week_desc_prefix: "Cumulative rain expected this week is",
    forecast_week_desc_suffix: "Low probability of extreme storms, making it the perfect sowing window for regional rainfed seeds.",
    toast_err_gps: "Browser does not support geolocation tracking",
    toast_success_gps: "Synchronized local coordinate weather",
    toast_err_gps_access: "GPS access blocked. Reverting to default regional stats.",
    toast_err_weather: "Failed to sync weather forecast telemetry"
  },
  tamil: {
    title: "வானிலை & காலநிலை மையம்",
    subtitle: "தற்போதைய வானிலை, கடந்த கால போக்குகள் மற்றும் 7 நாட்களுக்கான நடவு கணிப்புகளை அறியுங்கள்.",
    gps_btn: "ஜி.பி.எஸ் இணை",
    loading: "வானிலை செயற்கைக்கோள் தரவுகள் பெறப்படுகின்றன...",
    tab_current: "தற்போதைய வானிலை",
    tab_past: "கடந்த கால போக்கு (30 நாட்கள்)",
    tab_future: "7-நாள் கணிப்பு",
    live_telemetry: "நேரடி அளவீடுகள்",
    feels_like: "உணரப்படும் வெப்பம்",
    humidity: "ஈரப்பதம்",
    wind: "காற்றின் வேகம்",
    adv_title: "பயிர் நடவு ஆலோசனை",
    adv_desc_prefix: "தற்போதைய ஈரப்பதம்",
    adv_desc_mid: "மற்றும் வெப்பநிலை",
    adv_desc_suffix: "இந்த நிலைகள் மண்ணின் நுண்ணுயிர் செயல்பாட்டிற்கு மிகவும் உகந்தது. நீங்கள் மஞ்சள் அல்லது வாழை சாகுபடி செய்தால், இரண்டாம் கட்ட உரமிடலாம். காற்றின் வேகம் மணிக்கு 15 கி.மீ-க்கு மேல் இருந்தால் பூச்சிக்கொல்லி தெளிப்பதைத் தவிர்க்கவும்.",
    evap_title: "நீராவிப்போக்கு குறியீடு",
    evap_desc: "மண் ஈரப்பதம் ஆவியாகும் குறியீடு: **சாதாரண அளவு (3.2 மிமீ/நாள்)**",
    past_temp_title: "வெப்பநிலை போக்கு (கடந்த 30 நாட்கள்)",
    past_rain_title: "மழைப்பொழிவு அளவு (கடந்த 30 நாட்கள்)",
    forecast_week_title: "அடுத்த வார வானிலை நடவு கணிப்பு",
    forecast_week_desc_prefix: "இந்த வாரத்தின் மொத்த மழைப்பொழிவு எதிர்பார்ப்பு",
    forecast_week_desc_suffix: "கடுமையான புயல் ஆபத்து குறைவு, எனவே மானாவாரி விதைகள் விதைக்க இது மிகச் சிறந்த தருணம்.",
    toast_err_gps: "ஜி.பி.எஸ் டிராக்கிங்கை உங்களது உலாவி ஆதரிக்கவில்லை",
    toast_success_gps: "இருப்பிட வானிலை வெற்றிகரமாக இணைக்கப்பட்டது",
    toast_err_gps_access: "ஜி.பி.எஸ் அனுமதி மறுக்கப்பட்டது. இயல்புநிலை கோயம்புத்தூர் வானிலை காட்டப்படுகிறது.",
    toast_err_weather: "வானிலை தரவுகளைப் பெறுவதில் தோல்வி"
  }
};

function WeatherHubPage() {
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

  const wt = translations[lang] || translations.english;

  // Location state
  const [lat, setLat] = useState<number>(11.0168); // Coimbatore, TN default
  const [lon, setLon] = useState<number>(76.9558);
  const [locationName, setLocationName] = useState<string>("Coimbatore, Tamil Nadu");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  // Past 30-days weather simulation data
  const [pastWeather] = useState([
    { day: lang === "tamil" ? "30 நாட்களுக்கு முன்" : "Day -30", temp: 31, rain: 0 },
    { day: lang === "tamil" ? "25 நாட்களுக்கு முன்" : "Day -25", temp: 32, rain: 2 },
    { day: lang === "tamil" ? "20 நாட்களுக்கு முன்" : "Day -20", temp: 29, rain: 15 },
    { day: lang === "tamil" ? "15 நாட்களுக்கு முன்" : "Day -15", temp: 30, rain: 8 },
    { day: lang === "tamil" ? "10 நாட்களுக்கு முன்" : "Day -10", temp: 33, rain: 0 },
    { day: lang === "tamil" ? "5 நாட்களுக்கு முன்" : "Day -5", temp: 34, rain: 0 },
    { day: lang === "tamil" ? "இன்று" : "Today", temp: 32, rain: 1 },
  ]);

  useEffect(() => {
    loadWeatherData(lat, lon);
  }, []);

  const loadWeatherData = async (latitude: number, longitude: number) => {
    setLoading(true);
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
      toast.error(wt.toast_err_weather);
    } finally {
      setLoading(false);
    }
  };

  const handleGPS = () => {
    if (!navigator.geolocation) {
      return toast.error(wt.toast_err_gps);
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLon(longitude);
        loadWeatherData(latitude, longitude);
        toast.success(wt.toast_success_gps);
      },
      (err) => {
        console.error(err);
        setLoading(false);
        toast.error(wt.toast_err_gps_access);
      }
    );
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-green-50/60 pb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
            <CloudSun className="h-6 w-6 text-green-700" />
            {wt.title}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {wt.subtitle}
          </p>
        </div>
        
        <div className="flex items-center gap-2 mt-3 sm:mt-0">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <MapPin className="h-4 w-4 text-green-600" />
            {locationName}
          </span>
          <Button onClick={handleGPS} size="sm" variant="outline" className="text-xs rounded-lg border-green-100 text-green-700 hover:bg-green-50">
            <Navigation className="h-3.5 w-3.5 mr-1" />
            {wt.gps_btn}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="h-8 w-8 animate-spin text-green-700" />
          <span className="text-xs text-muted-foreground">{wt.loading}</span>
        </div>
      ) : (
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="flex flex-wrap h-auto w-fit max-w-full bg-green-100/40 border border-green-200/30 p-1.5 gap-1.5 sm:gap-2 rounded-2xl mb-6">
            <TabsTrigger 
              value="current" 
              className="rounded-xl text-xs sm:text-sm px-4 py-2.5 font-bold transition-all duration-200 text-slate-600 hover:text-green-800 hover:bg-white/40 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-transparent"
            >
              {wt.tab_current}
            </TabsTrigger>
            <TabsTrigger 
              value="past" 
              className="rounded-xl text-xs sm:text-sm px-4 py-2.5 font-bold transition-all duration-200 text-slate-600 hover:text-green-800 hover:bg-white/40 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-transparent"
            >
              {wt.tab_past}
            </TabsTrigger>
            <TabsTrigger 
              value="future" 
              className="rounded-xl text-xs sm:text-sm px-4 py-2.5 font-bold transition-all duration-200 text-slate-600 hover:text-green-800 hover:bg-white/40 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-transparent"
            >
              {wt.tab_future}
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: CURRENT WEATHER */}
          <TabsContent value="current" className="space-y-6 animate-fade-in">
            {weather && (
              <div className="grid gap-6 md:grid-cols-3">
                {/* Core telemetry */}
                <Card className="rounded-2xl border-green-100/50 shadow-sm bg-white md:col-span-1 p-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="bg-green-50 border border-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {wt.live_telemetry}
                    </span>
                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-5xl font-extrabold text-foreground">{weather.temp}°C</span>
                      <div>
                        <p className="text-sm font-bold text-foreground capitalize">{translateWeatherDesc(weather.description)}</p>
                        <p className="text-[10px] text-muted-foreground">{wt.feels_like} {weather.feelsLike}°C</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-50 pt-4 mt-6 grid grid-cols-2 gap-2 text-left">
                    <div className="p-2 bg-slate-50 rounded-xl flex items-center gap-2">
                      <Droplet className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <div>
                        <span className="text-[9px] text-muted-foreground block font-medium">{wt.humidity}</span>
                        <span className="text-xs font-bold text-foreground">{weather.humidity}%</span>
                      </div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl flex items-center gap-2">
                      <Wind className="h-5 w-5 text-slate-500 flex-shrink-0" />
                      <div>
                        <span className="text-[9px] text-muted-foreground block font-medium">{wt.wind}</span>
                        <span className="text-xs font-bold text-foreground">{weather.windSpeed} km/h</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Crop Advisory */}
                <Card className="rounded-2xl border-green-100/50 shadow-sm bg-white md:col-span-2 p-5 flex flex-col justify-between">
                  <div className="space-y-3 text-left">
                    <h3 className="text-sm font-bold text-green-800 flex items-center gap-1.5">
                      <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
                      {wt.adv_title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {wt.adv_desc_prefix} **{weather.humidity}%** {wt.adv_desc_mid} **{weather.temp}°C**. 
                      {wt.adv_desc_suffix}
                    </p>
                  </div>
                  
                  <div className="bg-green-50/50 border border-green-100/50 p-3.5 rounded-xl mt-4 flex gap-2">
                    <Thermometer className="h-5 w-5 text-green-700 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-green-950 block">{wt.evap_title}</span>
                      <span className="text-[9px] text-green-700">{wt.evap_desc}</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* TAB 2: PAST WEATHER */}
          <TabsContent value="past" className="space-y-6 animate-fade-in">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Temperature Chart */}
              <Card className="rounded-2xl border-slate-100 bg-white p-5">
                <CardHeader className="p-0 pb-4 text-left">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-slate-800">
                    <History className="h-4 w-4 text-green-700" />
                    {wt.past_temp_title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-60 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={pastWeather} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#166534" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#166534" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="day" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip />
                        <Area type="monotone" dataKey="temp" name={lang === "tamil" ? "வெப்பநிலை (°C)" : "Avg Temp (°C)"} stroke="#166534" strokeWidth={2} fillOpacity={1} fill="url(#tempGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Rain Chart */}
              <Card className="rounded-2xl border-slate-100 bg-white p-5">
                <CardHeader className="p-0 pb-4 text-left">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-slate-800">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    {wt.past_rain_title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-60 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={pastWeather} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="day" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip />
                        <Line type="monotone" dataKey="rain" name={lang === "tamil" ? "மழை அளவு (mm)" : "Rainfall (mm)"} stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 3: FUTURE FORECAST */}
          <TabsContent value="future" className="space-y-6 animate-fade-in">
            {weather && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-4 md:grid-cols-7">
                  {weather.daily.map((day, idx) => (
                    <Card key={idx} className="rounded-xl border border-slate-50 bg-white p-3.5 text-center flex flex-col justify-between hover:border-green-600 transition-colors">
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground font-bold block uppercase tracking-wider">
                          {lang === "tamil" 
                            ? (new Date(day.date).getDay() === 0 ? "ஞாயிறு" : new Date(day.date).getDay() === 1 ? "திங்கள்" : new Date(day.date).getDay() === 2 ? "செவ்வாய்" : new Date(day.date).getDay() === 3 ? "புதன்" : new Date(day.date).getDay() === 4 ? "வியாழன்" : new Date(day.date).getDay() === 5 ? "வெள்ளி" : "சனி")
                            : new Date(day.date).toLocaleDateString([], { weekday: "short" })
                          }
                        </span>
                        <span className="text-[9px] text-slate-400 block">
                          {new Date(day.date).toLocaleDateString([], { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      
                      <div className="py-3 flex flex-col items-center justify-center">
                        <span className="text-base font-extrabold text-foreground">{day.tempMax}°</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{day.tempMin}°</span>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold block bg-blue-50 border border-blue-100/50 text-blue-700 px-1.5 py-0.5 rounded-full w-fit mx-auto">
                          💧 {day.rainSum} mm
                        </span>
                        <span className="text-[9px] font-semibold text-slate-500 block truncate max-w-full">
                          {translateWeatherDesc(day.description)}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>

                <Card className="rounded-2xl border-green-100/50 bg-white p-4 flex gap-3">
                  <Calendar className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
                  <div className="text-left space-y-1">
                    <h4 className="text-xs font-bold text-green-950">{wt.forecast_week_title}</h4>
                    <p className="text-[11px] text-green-800/80 leading-relaxed">
                      {wt.forecast_week_desc_prefix} **{weather.daily.reduce((sum, d) => sum + d.rainSum, 0).toFixed(1)} mm**. 
                      {wt.forecast_week_desc_suffix}
                    </p>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

interface RefreshCwProps extends React.SVGProps<SVGSVGElement> {}

function RefreshCw(props: RefreshCwProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
