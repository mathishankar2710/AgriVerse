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
  Power 
} from "lucide-react";
import heroFarm from "@/assets/hero-farm.jpg";
import { fetchWeatherForecast, reverseGeocode, WeatherData } from "@/lib/weather-services";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
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

  // Load initial weather, default to asking for current location (GPS)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude);
          setLon(longitude);
          loadWeather(latitude, longitude);
          toast.success("Location determined automatically via GPS");
        },
        (error) => {
          console.warn("Auto-geolocation failed, using default location:", error);
          loadWeather(11.0168, 76.9558); // Fallback to Coimbatore default
        }
      );
    } else {
      loadWeather(11.0168, 76.9558); // Fallback to Coimbatore default
    }
  }, []);

  const loadWeather = async (latitude: number, longitude: number) => {
    setLoadingWeather(true);
    try {
      const data = await fetchWeatherForecast(latitude, longitude);
      setWeather(data);
      const name = await reverseGeocode(latitude, longitude);
      setLocationName(name);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load weather forecast");
    } finally {
      setLoadingWeather(false);
    }
  };

  const useGPS = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation is not supported by your browser");
    }
    setLoadingWeather(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLon(longitude);
        loadWeather(latitude, longitude);
        toast.success("Location updated via GPS");
      },
      (error) => {
        console.error(error);
        setLoadingWeather(false);
        toast.error("Unable to retrieve GPS coordinates");
      }
    );
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert click coordinates to simulated India lat/lon range
    // India bounds roughly: Lat 8 to 37, Lon 68 to 97
    const simulatedLat = 37 - (y / rect.height) * (37 - 8);
    const simulatedLon = 68 + (x / rect.width) * (97 - 68);
    
    setLat(simulatedLat);
    setLon(simulatedLon);
    loadWeather(simulatedLat, simulatedLon);
    setShowMap(false);
    toast.success("Location selected on Map");
  };

  const toggleMotor = () => {
    setMotorTransition(true);
    setTimeout(() => {
      setMotorOn(!motorOn);
      setMotorTransition(false);
      toast.success(`Motor turned ${!motorOn ? "ON" : "OFF"} successfully`);
    }, 800);
  };

  const services = [
    {
      title: "Crop Recommendation",
      description: "Get smart crop suggestions optimized for local soil and seasonal climate.",
      to: "/agents/crop",
      icon: Leaf,
      color: "bg-green-500",
      textColor: "text-green-500",
    },
    {
      title: "AI Smart Chatbot",
      description: "Direct chat with our agricultural expert for quick answers and suggestions.",
      to: "/chatbot",
      icon: MessageSquareCode,
      color: "bg-blue-500",
      textColor: "text-blue-500",
    },
    {
      title: "Crop Disease Scan",
      description: "Upload leaf photos for diagnostic identification and curative treatments.",
      to: "/disease",
      icon: ScanEye,
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
    },
    {
      title: "Price Predictor",
      description: "Foresee crop price fluctuations and choose the most profitable harvest window.",
      to: "/price-prediction",
      icon: LineChart,
      color: "bg-amber-500",
      textColor: "text-amber-500",
    },
    {
      title: "IoT Motor Control",
      description: "Toggle irrigation pumps, set automated timer cycles, and observe water stats.",
      to: "/iot",
      icon: Cpu,
      color: "bg-teal-500",
      textColor: "text-teal-500",
    },
    {
      title: "Productivity Tools",
      description: "Calculate expected crop yield, NPK requirements, and perform unit conversions.",
      to: "/productivity",
      icon: Calculator,
      color: "bg-purple-500",
      textColor: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero Banner with Glassmorphism */}
      <div
        className="relative overflow-hidden rounded-2xl bg-cover bg-center shadow-lg"
        style={{ backgroundImage: `url(${heroFarm})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/80 via-green-900/50 to-transparent" />
        <div className="relative px-6 py-12 sm:px-10 sm:py-16 text-white max-w-2xl">
          <span className="bg-green-700/80 text-green-100 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Connected & Optimized
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3">
            Grow Smarter with AgriVerse
          </h1>
          <p className="mt-2 text-sm sm:text-base text-green-50/90 leading-relaxed">
            Harness real-time climate telemetry, IoT control, and LLM-powered visual diagnostics to maximize your yields and profits.
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
                Live Climate Status
              </CardTitle>
              <CardDescription className="flex items-center gap-1 mt-0.5 text-xs">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                {locationName}
              </CardDescription>
            </div>
            
            <div className="flex gap-1.5">
              <Button onClick={useGPS} size="sm" variant="outline" className="text-xs h-8 rounded-lg border-green-100 text-green-700 hover:bg-green-50">
                GPS
              </Button>
              <Button onClick={() => setShowMap(!showMap)} size="sm" variant="outline" className="text-xs h-8 rounded-lg border-green-100 text-green-700 hover:bg-green-50">
                Map Picker
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="relative">
            {/* Map Popup */}
            {showMap && (
              <div className="absolute inset-x-4 top-0 bottom-4 bg-white/95 backdrop-blur-sm border border-green-100 rounded-xl p-3 z-10 flex flex-col space-y-2 animate-fade-in shadow-inner">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-green-800">Click anywhere on the map to set location:</span>
                  <Button onClick={() => setShowMap(false)} variant="ghost" size="sm" className="h-6 px-2 text-muted-foreground">Close</Button>
                </div>
                {/* Styled Grid simulating a Map */}
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
                <span className="text-xs text-muted-foreground">Fetching live weather telemetry...</span>
              </div>
            ) : weather ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-extrabold tracking-tight text-foreground">{weather.temp}°C</span>
                    <div>
                      <p className="text-sm font-semibold capitalize text-foreground">{weather.description}</p>
                      <p className="text-[10px] text-muted-foreground">Feels like {weather.feelsLike}°C</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-green-50 border border-green-100 text-green-800 font-medium px-2 py-0.5 rounded-full">
                      Climate-aware Ready
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-green-50/50 pt-3 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Droplet className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-[11px] font-medium">Humidity</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">{weather.humidity}%</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Wind className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-[11px] font-medium">Wind</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">{weather.windSpeed} km/h</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Thermometer className="h-3.5 w-3.5 text-red-500" />
                      <span className="text-[11px] font-medium">Precip.</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">{weather.rain} mm</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No weather loaded</p>
            )}
          </CardContent>
        </Card>

        {/* IoT Smart Motor Controller Widget */}
        <Card className="rounded-2xl border-green-100/50 shadow-sm overflow-hidden bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Cpu className="h-5 w-5 text-teal-600" />
              Pump Motor Control
            </CardTitle>
            <CardDescription className="text-xs">
              Live irrigation flow rate & IoT status
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${motorOn ? "bg-green-500 animate-ping" : "bg-slate-300"}`} />
                <span className="text-sm font-bold capitalize">
                  {motorTransition ? "Connecting..." : motorOn ? "Irrigation Motor Running" : "Motor Standby"}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block font-medium">Flow Rate</span>
                  <span className="text-base font-extrabold text-foreground">{motorOn ? "14.5 L/min" : "0 L/min"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase block font-medium">Soil Moisture</span>
                  <span className="text-base font-extrabold text-foreground">38% (Dry)</span>
                </div>
              </div>
            </div>

            <Button
              onClick={toggleMotor}
              disabled={motorTransition}
              className={`h-16 w-16 rounded-2xl flex flex-col items-center justify-center shadow-lg border transition-all duration-300 ${
                motorOn 
                  ? "bg-red-500 hover:bg-red-600 border-red-400 shadow-red-500/10 text-white" 
                  : "bg-green-700 hover:bg-green-800 border-green-600 shadow-green-700/10 text-white"
              }`}
            >
              <Power className={`h-6 w-6 ${motorTransition ? "animate-spin" : ""}`} />
              <span className="text-[9px] uppercase tracking-wider font-bold mt-1">
                {motorTransition ? "..." : motorOn ? "Stop" : "Start"}
              </span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Services Nav Section */}
      <div className="space-y-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Agricultural Suite</h2>
          <p className="text-xs text-muted-foreground">Select a tool or system below to execute tasks.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.to} to={s.to} className="block group">
                <Card className="overflow-hidden hover:border-green-600 hover:shadow-lg transition-all duration-300 h-full flex flex-col rounded-2xl bg-white border border-green-50/80">
                  <CardHeader className="pb-3 flex flex-row items-center gap-3.5">
                    <div className={`${s.color} p-3 rounded-2xl text-white shadow-md shadow-green-900/5 group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base font-bold text-foreground group-hover:text-green-700 transition-colors">
                      {s.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-5 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                    <span className={`text-[11px] font-bold ${s.textColor} mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform`}>
                      Launch System →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
