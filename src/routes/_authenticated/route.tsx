import { createFileRoute, Outlet, redirect, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Leaf, 
  LayoutDashboard, 
  MessageSquareCode, 
  ScanEye, 
  LineChart, 
  Cpu, 
  Calculator, 
  History, 
  LogOut,
  Sprout,
  ShoppingBag,
  Coins,
  User,
  Settings,
  CloudSun,
  X,
  Languages,
  Bell
} from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthedLayout,
});

const sidebarTranslations: Record<string, Record<string, string>> = {
  english: {
    dashboard: "Dashboard",
    chatbot: "AI Chatbot",
    disease: "Disease Scan",
    soil: "Soil & Fertilizer",
    crop: "Crop Management",
    iot: "IoT Irrigation",
    weather: "Weather Climate",
    market: "Market & Price",
    services: "Services & Finance",
    profile: "Farmer Profile",
    history: "History",
    logout: "Log out",
    settings: "Settings",
    farmer_profile: "Farmer Profile Options",
    sys_settings: "System Settings",
    cancel: "Cancel",
    save: "Save Configurations",
    lang_label: "Primary Language",
    notif_label: "Weather & Broadcast Notifications",
    settings_desc: "Configure language preference and broadcast alerts notification settings."
  },
  tamil: {
    dashboard: "முகப்புப்பலகை",
    chatbot: "AI அரட்டை",
    disease: "நோய் கண்டறிதல்",
    soil: "மண் மற்றும் உரம்",
    crop: "பயிர் மேலாண்மை",
    iot: "IoT நீர்ப்பாசனம்",
    weather: "வானிலை அறிக்கை",
    market: "சந்தை மற்றும் விலை",
    services: "சேவைகள் & நிதி",
    profile: "விவசாயி சுயவிவரம்",
    history: "வரலாறு",
    logout: "வெளியேறு",
    settings: "அமைப்புகள்",
    farmer_profile: "விவசாயி சுயவிவர அமைப்புகள்",
    sys_settings: "அமைப்பு அமைப்புகள்",
    cancel: "ரத்து செய்",
    save: "அமைப்புகளைச் சேமி",
    lang_label: "முதன்மை மொழி",
    notif_label: "வானிலை மற்றும் அறிவிப்புகள்",
    settings_desc: "மொழி மற்றும் வானிலை அறிவிப்பு அமைப்புகளைத் தேர்வுசெய்யவும்."
  }
};

function AuthedLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = Route.useRouteContext();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Settings States
  const [language, setLanguage] = useState("english");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang") || "english";
    setLanguage(savedLang);
    const savedNotifs = localStorage.getItem("app_notifs");
    if (savedNotifs) setNotificationsEnabled(savedNotifs === "true");

    const handleLangChange = () => {
      setLanguage(localStorage.getItem("app_lang") || "english");
    };
    window.addEventListener("languageChanged", handleLangChange);
    return () => window.removeEventListener("languageChanged", handleLangChange);
  }, []);

  const saveSettings = () => {
    localStorage.setItem("app_lang", language);
    localStorage.setItem("app_notifs", notificationsEnabled.toString());
    window.dispatchEvent(new Event("languageChanged"));
    setShowSettingsModal(false);
    toast.success(language === "tamil" ? "அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன!" : "Settings saved successfully!");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const t = sidebarTranslations[language] || sidebarTranslations.english;

  const navItems = [
    { label: t.dashboard, to: "/dashboard", icon: LayoutDashboard },
    { label: t.chatbot, to: "/chatbot", icon: MessageSquareCode },
    { label: t.disease, to: "/disease", icon: ScanEye },
    { label: t.soil, to: "/soil-fertilizer", icon: Sprout },
    { label: t.crop, to: "/crop-management", icon: Leaf },
    { label: t.iot, to: "/iot", icon: Cpu },
    { label: t.weather, to: "/weather", icon: CloudSun },
    { label: t.market, to: "/marketplace", icon: ShoppingBag },
    { label: t.services, to: "/services", icon: Coins },
    { label: t.profile, to: "/profile", icon: User },
    { label: t.history, to: "/history", icon: History },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Curated list for mobile bottom tab bar
  const mobileNavItems = [
    { label: t.dashboard, to: "/dashboard", icon: LayoutDashboard },
    { label: t.chatbot, to: "/chatbot", icon: MessageSquareCode },
    { label: t.disease, to: "/disease", icon: ScanEye },
    { label: t.market, to: "/marketplace", icon: ShoppingBag },
    { label: t.profile, to: "/profile", icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#fafcf9] text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-green-100/60 sticky top-0 h-screen p-5 z-20 overflow-y-auto">
        <div className="flex items-center gap-2 px-2 py-4 mb-6 flex-shrink-0">
          <div className="bg-transparent text-green-700">
            <img src="/logo.png" alt="AgriVerse Logo" className="h-7 w-7 object-contain" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
            AgriVerse
          </span>
        </div>
        
        <nav className="flex-1 space-y-1 pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active 
                    ? "bg-green-700 text-white shadow-md shadow-green-700/20 scale-[1.02]" 
                    : "text-muted-foreground hover:text-green-700 hover:bg-green-50/60"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-white" : "group-hover:text-green-700"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header with Profile Icon Dropdown */}
        <header className="flex items-center justify-between md:justify-end px-4 py-3 md:px-8 md:py-4 bg-white md:bg-transparent border-b border-green-100/60 md:border-none sticky top-0 z-20">
          {/* Logo on Mobile (Left) */}
          <div className="flex items-center gap-2 md:hidden">
            <img src="/logo.png" alt="AgriVerse Logo" className="h-5 w-5 object-contain" />
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
              AgriVerse
            </span>
          </div>

          {/* Profile Dropdown Menu in Top Right */}
          <div className="relative">
            <Button
              variant="ghost"
              className="h-10 w-10 rounded-full bg-green-55 border border-green-100 text-green-800 flex items-center justify-center p-0 overflow-hidden hover:bg-green-100/80"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <User className="h-5 w-5" />
            </Button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-green-100/60 shadow-xl py-2 z-50 animate-fade-in text-left">
                <div className="px-4 py-2.5 border-b border-slate-50">
                  <p className="text-xs font-semibold text-slate-500">
                    {language === "tamil" ? "அக்ரிவர்ஸ் விவசாயி" : "AgriVerse Farmer"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <div className="p-1">
                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-green-50 hover:text-green-850 transition-all"
                  >
                    <User className="h-4 w-4 text-green-700" />
                    {t.farmer_profile}
                  </Link>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowSettingsModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-green-50 hover:text-green-850 transition-all text-left"
                  >
                    <Settings className="h-4 w-4 text-green-700" />
                    {t.settings}
                  </button>
                </div>
                <div className="border-t border-slate-55 p-1 mt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-all text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    {t.logout}
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-6 px-4 py-4 md:px-8 max-w-6xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-green-100/60 flex justify-around py-2 px-1 z-30 shadow-lg">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 ${
                active 
                  ? "text-green-700 font-semibold" 
                  : "text-muted-foreground hover:text-green-700"
              }`}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* System Settings Modal overlay */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-scale-up text-left">
            <button 
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-1">
              <Settings className="h-5 w-5 text-green-700" />
              AgriVerse {t.settings}
            </h3>
            <p className="text-xs text-muted-foreground mb-6">{t.settings_desc}</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Languages className="h-4 w-4 text-slate-500" />
                  {t.lang_label}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLanguage("english")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                      language === "english" 
                        ? "bg-green-50 border-green-600 text-green-800" 
                        : "border-slate-205 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage("tamil")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold ${
                      language === "tamil" 
                        ? "bg-green-50 border-green-600 text-green-800" 
                        : "border-slate-205 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    தமிழ் (Tamil)
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Bell className="h-4 w-4 text-slate-550" />
                  {t.notif_label}
                </span>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors focus:outline-none ${
                    notificationsEnabled ? "bg-green-600" : "bg-slate-300"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    notificationsEnabled ? "translate-x-4" : "translate-x-0"
                  }`} />
                </button>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-2.5">
              <Button 
                variant="outline" 
                onClick={() => setShowSettingsModal(false)}
                className="rounded-xl text-xs h-10 border-slate-200"
              >
                {t.cancel}
              </Button>
              <Button 
                onClick={saveSettings}
                className="rounded-xl text-xs h-10 bg-green-700 hover:bg-green-800 text-white"
              >
                {t.save}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
