import { createFileRoute, Outlet, redirect, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Leaf, 
  LayoutDashboard, 
  MessageSquareCode, 
  ScanEye, 
  LineChart, 
  Cpu, 
  Calculator, 
  History, 
  LogOut 
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

function AuthedLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "AI Chatbot", to: "/chatbot", icon: MessageSquareCode },
    { label: "Disease Scan", to: "/disease", icon: ScanEye },
    { label: "Price Predictor", to: "/price-prediction", icon: LineChart },
    { label: "IoT Control", to: "/iot", icon: Cpu },
    { label: "Productivity", to: "/productivity", icon: Calculator },
    { label: "History", to: "/history", icon: History },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#fafcf9] text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-green-100/60 sticky top-0 h-screen p-5 z-20">
        <div className="flex items-center gap-2 px-2 py-4 mb-6">
          <div className="bg-transparent text-green-700">
            <img src="/logo.png" alt="AgriVerse Logo" className="h-7 w-7 object-contain" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
            AgriVerse
          </span>
        </div>
        
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
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

        <div className="border-t border-green-50 pt-4 mt-auto">
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:text-destructive hover:bg-destructive/5"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-green-100/60 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="AgriVerse Logo" className="h-5 w-5 object-contain" />
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
            AgriVerse
          </span>
        </div>
        <Button variant="ghost" size="icon" className="text-destructive" onClick={logout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-6 px-4 py-6 md:px-8 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-green-100/60 flex justify-around py-2 px-1 z-30 shadow-lg">
        {navItems.map((item) => {
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
              <span className="text-[10px] tracking-tight">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

