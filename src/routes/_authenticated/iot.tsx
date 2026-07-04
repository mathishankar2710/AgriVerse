import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Power, 
  Droplet, 
  Gauge, 
  Zap, 
  Calendar, 
  Plus, 
  Trash2, 
  Clock, 
  ListOrdered 
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/iot")({
  component: IotPage,
});

interface Timer {
  id: string;
  time: string;
  duration: number;
  active: boolean;
}

function IotPage() {
  const [motorOn, setMotorOn] = useState<boolean>(false);
  const [motorTransition, setMotorTransition] = useState<boolean>(false);
  
  // Custom smart schedule timers
  const [timers, setTimers] = useState<Timer[]>([
    { id: "1", time: "06:00", duration: 15, active: true },
    { id: "2", time: "18:30", duration: 10, active: true },
  ]);

  const [newTime, setNewTime] = useState<string>("08:00");
  const [newDuration, setNewDuration] = useState<number>(10);

  const toggleMotor = () => {
    setMotorTransition(true);
    setTimeout(() => {
      setMotorOn(!motorOn);
      setMotorTransition(false);
      toast.success(`Motor pump turned ${!motorOn ? "ON" : "OFF"}`);
    }, 1000);
  };

  const addTimer = () => {
    if (!newTime) return toast.error("Please enter a valid time");
    if (newDuration <= 0) return toast.error("Duration must be greater than 0");

    const newTimer: Timer = {
      id: Math.random().toString(),
      time: newTime,
      duration: newDuration,
      active: true,
    };

    setTimers((prev) => [...prev, newTimer].sort((a, b) => a.time.localeCompare(b.time)));
    toast.success("Irrigation schedule added");
  };

  const deleteTimer = (id: string) => {
    setTimers((prev) => prev.filter(t => t.id !== id));
    toast.success("Irrigation schedule deleted");
  };

  const toggleTimerActive = (id: string) => {
    setTimers((prev) => prev.map(t => t.id === id ? { ...t, active: !t.active } : t));
  };

  // SVG Gauge Dial Helper
  const renderGauge = (value: number, max: number, label: string, colorClass: string, icon: React.ReactNode, unit: string) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / max) * circumference;

    return (
      <Card className="rounded-2xl border-green-50 shadow-sm bg-white p-4 flex flex-col items-center text-center justify-between h-full">
        <div className="relative h-24 w-24 flex items-center justify-center">
          <svg className="h-full w-full transform -rotate-90">
            <circle cx="48" cy="48" r={radius} className="stroke-slate-100 fill-transparent" strokeWidth="6" />
            <circle 
              cx="48" 
              cy="48" 
              r={radius} 
              className={`fill-transparent transition-all duration-500 ease-out ${colorClass}`} 
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            {icon}
            <span className="text-sm font-extrabold mt-0.5">{value}{unit}</span>
          </div>
        </div>
        <div className="mt-2">
          <span className="text-[10px] text-muted-foreground uppercase font-bold">{label}</span>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
          <Power className="h-6 w-6 text-green-700 animate-pulse" />
          IoT Motor Control Panel
        </h1>
        <p className="text-xs text-muted-foreground">
          Toggle smart irrigation pumps, manage watering schedules, and monitor soil moisture telemetry.
        </p>
      </div>

      {/* Main Controls Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Large Controller Switch */}
        <Card className="rounded-2xl border-green-100/50 bg-white shadow-sm flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-green-600" />
          
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">Irrigation Switch</CardTitle>
            <CardDescription className="text-xs">Pump power control unit</CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center justify-center py-6 space-y-6">
            <button
              onClick={toggleMotor}
              disabled={motorTransition}
              className={`h-28 w-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 relative ${
                motorOn 
                  ? "bg-gradient-to-tr from-green-600 to-emerald-500 border-green-400 shadow-xl shadow-green-500/20 text-white animate-pulse" 
                  : "bg-gradient-to-tr from-slate-100 to-white border-slate-200 text-slate-400 hover:border-slate-300 shadow-inner"
              }`}
            >
              {motorOn && (
                <div className="absolute inset-0 bg-green-400 rounded-full scale-105 opacity-10 animate-ping" />
              )}
              <Power className={`h-10 w-10 ${motorTransition ? "animate-spin" : ""}`} />
              <span className="text-[10px] font-extrabold uppercase tracking-widest mt-1.5">
                {motorTransition ? "..." : motorOn ? "ON" : "OFF"}
              </span>
            </button>

            <div className="text-center space-y-1">
              <p className="text-xs font-semibold text-foreground">
                Status: {motorTransition ? "Connecting..." : motorOn ? "Pump running" : "Pump stopped"}
              </p>
              <p className="text-[10px] text-muted-foreground">Connected to NodeMCU 12 (Irrigation-Block A)</p>
            </div>
          </CardContent>
        </Card>

        {/* Gauge Dials */}
        <div className="md:col-span-2 grid gap-4 grid-cols-2 sm:grid-cols-4">
          {renderGauge(
            motorOn ? 14.5 : 0, 
            25, 
            "Water Flow", 
            "stroke-teal-600", 
            <Droplet className="h-4 w-4 text-teal-600" />, 
            " L/m"
          )}
          
          {renderGauge(
            38, 
            100, 
            "Soil Moisture", 
            "stroke-blue-600", 
            <Droplet className="h-4 w-4 text-blue-600" />, 
            "%"
          )}
          
          {renderGauge(
            motorOn ? 218 : 220, 
            250, 
            "Line Voltage", 
            "stroke-amber-500", 
            <Zap className="h-4 w-4 text-amber-500" />, 
            "V"
          )}

          {renderGauge(
            72, 
            100, 
            "Well Level", 
            "stroke-sky-500", 
            <Gauge className="h-4 w-4 text-sky-500" />, 
            "%"
          )}
        </div>
      </div>

      {/* Timer & Log Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Scheduler */}
        <Card className="rounded-2xl border-green-100/50 bg-white shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-1.5">
              <Calendar className="h-5 w-5 text-green-700" />
              Automated Watering Schedule
            </CardTitle>
            <CardDescription className="text-xs">Configure daily automatic watering timers</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Create Timer Form */}
            <div className="grid grid-cols-3 gap-3 items-end bg-green-50/20 border border-green-100/30 p-3 rounded-xl">
              <div className="space-y-1">
                <Label htmlFor="time" className="text-[10px] font-semibold text-muted-foreground uppercase">Start Time</Label>
                <Input 
                  id="time" 
                  type="time" 
                  value={newTime} 
                  onChange={(e) => setNewTime(e.target.value)} 
                  className="rounded-lg border-green-100 text-xs h-9 bg-white"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="duration" className="text-[10px] font-semibold text-muted-foreground uppercase">Duration (mins)</Label>
                <Input 
                  id="duration" 
                  type="number" 
                  value={newDuration} 
                  onChange={(e) => setNewDuration(parseInt(e.target.value) || 0)} 
                  className="rounded-lg border-green-100 text-xs h-9 bg-white"
                />
              </div>
              <Button 
                onClick={addTimer}
                className="bg-green-700 hover:bg-green-800 text-white rounded-lg h-9 text-xs flex items-center justify-center gap-1 font-semibold"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>

            {/* List Timers */}
            <div className="space-y-2.5">
              {timers.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-green-100 hover:bg-green-50/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100/60 p-2 rounded-xl text-green-700">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{t.time}</p>
                      <p className="text-[10px] text-muted-foreground">Watering duration: {t.duration} mins</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={t.active} 
                      onChange={() => toggleTimerActive(t.id)}
                      className="h-4 w-4 rounded border-green-300 text-green-700 focus:ring-green-600"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteTimer(t.id)} 
                      className="text-red-500 hover:bg-red-50 hover:text-red-700 h-8 w-8 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {timers.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-6">No irrigation schedules set.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Logs */}
        <Card className="rounded-2xl border-green-100/50 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-1.5">
              <ListOrdered className="h-5 w-5 text-green-700" />
              Automated Watering History
            </CardTitle>
            <CardDescription className="text-xs">Recent automated waterings logged by sensors</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2.5 border-b border-slate-50">
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground">Completed schedule (Morning Run)</span>
                  <p className="text-[10px] text-muted-foreground">Watered Block-A for 15 mins</p>
                </div>
                <div className="text-right">
                  <span className="text-green-700 font-bold">180 L Used</span>
                  <p className="text-[9px] text-muted-foreground">Today, 06:15 AM</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-2.5 border-b border-slate-50">
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground">Completed schedule (Evening Run)</span>
                  <p className="text-[10px] text-muted-foreground">Watered Block-A for 10 mins</p>
                </div>
                <div className="text-right">
                  <span className="text-green-700 font-bold">120 L Used</span>
                  <p className="text-[9px] text-muted-foreground">Yesterday, 06:40 PM</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-2.5 border-b border-slate-50">
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground">Rain Sensor Override</span>
                  <p className="text-[10px] text-muted-foreground">Schedule bypassed due to 4.2mm rain</p>
                </div>
                <div className="text-right">
                  <span className="text-amber-600 font-bold">Bypassed</span>
                  <p className="text-[9px] text-muted-foreground">Yesterday, 06:00 AM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
