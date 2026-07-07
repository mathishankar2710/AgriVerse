import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, BarChart3, Users, Clock, Radio, Check, X, LogOut, Lock, Plus, Trash2, Building } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  component: StandaloneAdminPortal,
});

interface UserRecord {
  id: string;
  email: string;
  name: string;
  district: string;
  crop: string;
  status: string;
}

interface PartnerRecord {
  id: string;
  type: "logistics" | "storage";
  name: string;
  rate: string;
  region: string;
  contact: string;
}

function StandaloneAdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // DB queried Users list state
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Partners state
  const [partners, setPartners] = useState<PartnerRecord[]>([]);
  const [partnerType, setPartnerType] = useState<"logistics" | "storage">("logistics");
  const [partnerName, setPartnerName] = useState("");
  const [partnerRate, setPartnerRate] = useState("");
  const [partnerRegion, setPartnerRegion] = useState("");
  const [partnerContact, setPartnerContact] = useState("");

  // Admin broadcast state
  const [broadcastMessage, setBroadcastMessage] = useState("");

  // Pending bookings approvals queue
  const [pendingBookings, setPendingBookings] = useState([
    { id: 1, type: "Logistics", farmer: "Velusamy K.", detail: "Tata Ace booking to Salem Mandi", date: "Today" },
    { id: 2, type: "Cold Storage", farmer: "Mani Murugan", detail: "Erode Cold Storage Slot #A12", date: "Tomorrow" },
  ]);

  useEffect(() => {
    const session = sessionStorage.getItem("admin_session");
    if (session === "active") {
      setIsAuthenticated(true);
      fetchUsersFromDB();
    }
    loadPartners();
  }, [isAuthenticated]);

  const loadPartners = () => {
    const saved = localStorage.getItem("admin_partners");
    if (saved) {
      setPartners(JSON.parse(saved));
    } else {
      // Default fallback partners
      const defaults: PartnerRecord[] = [
        { id: "p1", type: "logistics", name: "Coimbatore Agri Express", rate: "₹45 / km", region: "Coimbatore", contact: "+91 94441 12233" },
        { id: "p2", type: "storage", name: "Salem Cold Storage Facility", rate: "₹150 / Tonne / Day", region: "Salem", contact: "+91 94442 33445" }
      ];
      localStorage.setItem("admin_partners", JSON.stringify(defaults));
      setPartners(defaults);
    }
  };

  const fetchUsersFromDB = async () => {
    setLoadingUsers(true);
    try {
      const { data: dbProfiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, email");

      if (profileError) throw profileError;

      // Load local farmer settings to enrich user records with details
      const localProfileSaved = localStorage.getItem("farmer_profile");
      const localProfile = localProfileSaved ? JSON.parse(localProfileSaved) : null;

      const parsedUsers: UserRecord[] = (dbProfiles || []).map((u) => {
        const isCurrentUser = localProfile && (u.username === localProfile.fullName || u.email === localProfile.email);
        return {
          id: u.id,
          email: u.email || "no-email@Agri Agent.com",
          name: u.username || "Farmer Resident",
          district: isCurrentUser && localProfile?.district ? localProfile.district : "Coimbatore",
          crop: isCurrentUser && localProfile?.primaryCrop ? localProfile.primaryCrop : "Turmeric",
          status: "Active",
        };
      });

      setUsers(parsedUsers);
    } catch (e) {
      console.error("DB Query error fetching profiles:", e);
      setUsers([]);
      toast.error("Failed to load registered users from database");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (username === "admin" && password === "admin@12345") {
        sessionStorage.setItem("admin_session", "active");
        setIsAuthenticated(true);
        toast.success("Welcome back to Agri Agent Admin Console!");
      } else {
        toast.error("Invalid administrator credentials");
      }
      setLoading(false);
    }, 600);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_session");
    setIsAuthenticated(false);
    toast.info("Logged out from Admin Console");
  };

  const handleApprove = (id: number) => {
    setPendingBookings((prev) => prev.filter((b) => b.id !== id));
    toast.success("Booking request approved!");
  };

  const handleReject = (id: number) => {
    setPendingBookings((prev) => prev.filter((b) => b.id !== id));
    toast.error("Booking request rejected!");
  };

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim() || !partnerRate.trim() || !partnerRegion.trim()) {
      return toast.error("Please fill in all partner details");
    }

    const newPartner: PartnerRecord = {
      id: "p_" + Date.now(),
      type: partnerType,
      name: partnerName,
      rate: partnerRate,
      region: partnerRegion,
      contact: partnerContact || "N/A"
    };

    const updated = [...partners, newPartner];
    setPartners(updated);
    localStorage.setItem("admin_partners", JSON.stringify(updated));

    // Clear form inputs
    setPartnerName("");
    setPartnerRate("");
    setPartnerRegion("");
    setPartnerContact("");

    toast.success(`New ${partnerType} partner added successfully!`);
  };

  const handleRemovePartner = (id: string) => {
    const updated = partners.filter((p) => p.id !== id);
    setPartners(updated);
    localStorage.setItem("admin_partners", JSON.stringify(updated));
    toast.info("Partner removed from catalog");
  };

  const handleBroadcast = () => {
    if (!broadcastMessage.trim()) return toast.error("Write a message to broadcast!");

    const activeBroadcasts = JSON.parse(localStorage.getItem("admin_broadcasts") || "[]");
    activeBroadcasts.push({
      id: Date.now(),
      message: broadcastMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    localStorage.setItem("admin_broadcasts", JSON.stringify(activeBroadcasts));

    setBroadcastMessage("");
    toast.success("Emergency notification broadcasted successfully!");
  };

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-green-500 rounded-full blur-[120px] opacity-10 animate-pulse" />

        <Card className="w-full max-w-md bg-slate-800/80 border-slate-700/60 backdrop-blur-md text-white rounded-2xl shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-green-600" />
          <CardHeader className="text-center pb-2 pt-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-950/40 text-green-400 border border-green-500/20 mb-3">
              <img src="/logo.png" alt="Agri Agent Logo" className="h-8 w-8 object-contain" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Agri Agent Portal</CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-1">
              Admin & Coordinator Console Gate
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-8 pt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300">Admin Username</Label>
                <Input
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-xl border-slate-700 bg-slate-900/50 text-white focus-visible:ring-emerald-500 py-5"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300">Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border-slate-700 bg-slate-900/50 text-white focus-visible:ring-emerald-500 py-5"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl py-5 shadow-lg shadow-emerald-500/10 font-semibold"
              >
                {loading ? "Authenticating..." : "Unlock Admin Controls"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render Admin Dashboard Console
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Agri Agent Logo" className="h-8 w-8 object-contain" />
            <div>
              <h1 className="text-2xl font-extrabold flex items-center gap-2 tracking-tight text-white">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                Agri Agent Admin Console
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Secure administration node — logistics scheduling, crop audits, and advisory dispatch systems.
              </p>
            </div>
          </div>

          <div>
            <Button onClick={handleLogout} className="rounded-xl bg-red-600 hover:bg-red-700 text-white h-9 px-4 text-xs font-semibold">
              <LogOut className="h-4 w-4 mr-1.5" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-5 sm:grid-cols-3">
          <Card className="rounded-2xl border-slate-800/60 bg-slate-900/60 text-white p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/10">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Farmers</span>
              <span className="text-lg font-extrabold">{users.length}</span>
            </div>
          </Card>

          <Card className="rounded-2xl border-slate-800/60 bg-slate-900/60 text-white p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-950 text-blue-400 border border-blue-500/10">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Registered Partners</span>
              <span className="text-lg font-extrabold">{partners.length}</span>
            </div>
          </Card>

          <Card className="rounded-2xl border-slate-800/60 bg-slate-900/60 text-white p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-950 text-amber-400 border border-amber-500/10">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Pending Bookings</span>
              <span className="text-lg font-extrabold">{pendingBookings.length} Requests</span>
            </div>
          </Card>
        </div>

        {/* User list Section (Queried via Database) */}
        <Card className="rounded-2xl border-slate-800/60 bg-slate-900/60 text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                <Users className="h-5 w-5 text-emerald-400" />
                Registered Farmers & Users (DB Query)
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Fetched uniquely from Supabase AI query telemetry logs.
              </CardDescription>
            </div>
            <Button onClick={fetchUsersFromDB} size="sm" variant="outline" className="border-slate-700 text-xs text-slate-300">
              Refresh DB Query
            </Button>
          </CardHeader>
          <CardContent className="pb-6">
            {loadingUsers ? (
              <div className="h-20 flex items-center justify-center text-xs text-slate-400">
                Executing SQL public database scans...
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-300 font-bold">
                      <th className="p-3.5">Farmer Name</th>
                      <th className="p-3.5">Email Link</th>
                      <th className="p-3.5">Region/District</th>
                      <th className="p-3.5">Primary Crop</th>
                      <th className="p-3.5 text-right">Database ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 bg-slate-900/10">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/20 text-slate-300">
                        <td className="p-3.5 font-bold text-white">{u.name}</td>
                        <td className="p-3.5 text-slate-400">{u.email}</td>
                        <td className="p-3.5">{u.district}</td>
                        <td className="p-3.5 text-emerald-400">{u.crop}</td>
                        <td className="p-3.5 text-right font-mono text-[10px] text-slate-500">{u.id.slice(0, 12)}...</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Partners Management Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Add Partner Form */}
          <Card className="rounded-2xl border-slate-800/60 bg-slate-900/60 text-white">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                <Plus className="h-5 w-5 text-emerald-400" />
                Register New Service Partner
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Onboard new logistics transit carriers or warehouse/cold-storage slots.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <form onSubmit={handleAddPartner} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">Partner Type</Label>
                    <Select
                      value={partnerType}
                      onValueChange={(val: "logistics" | "storage") => setPartnerType(val)}
                    >
                      <SelectTrigger className="rounded-xl border-slate-800 bg-slate-900/50">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800 text-white">
                        <SelectItem value="logistics">Logistics (Transit Carrier)</SelectItem>
                        <SelectItem value="storage">Storage (Warehouse/Cold Space)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">Partner Name</Label>
                    <Input
                      placeholder="e.g. Komban Lorry Transports"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      className="rounded-xl border-slate-800 bg-slate-900/50 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">Pricing / Rates</Label>
                    <Input
                      placeholder="e.g. ₹50 / km"
                      value={partnerRate}
                      onChange={(e) => setPartnerRate(e.target.value)}
                      className="rounded-xl border-slate-800 bg-slate-900/50 text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-300">Covered Region</Label>
                    <Input
                      placeholder="e.g. Coimbatore, TN"
                      value={partnerRegion}
                      onChange={(e) => setPartnerRegion(e.target.value)}
                      className="rounded-xl border-slate-800 bg-slate-900/50 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-300">Contact Number</Label>
                  <Input
                    placeholder="e.g. +91 94444 88888"
                    value={partnerContact}
                    onChange={(e) => setPartnerContact(e.target.value)}
                    className="rounded-xl border-slate-800 bg-slate-900/50 text-white"
                  />
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                  Add Partner Node
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Current Partners List */}
          <Card className="rounded-2xl border-slate-800/60 bg-slate-900/60 text-white">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                <Building className="h-5 w-5 text-emerald-400" />
                Active Partners Registry
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Manage live logistics and storage operators in the ecosystem.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pb-6 max-h-72 overflow-y-auto">
              {partners.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 border border-slate-800/80 rounded-xl bg-slate-950/40">
                  <div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                      p.type === "logistics" ? "bg-blue-950 text-blue-400 border border-blue-500/10" : "bg-purple-950 text-purple-400 border border-purple-500/10"
                    }`}>
                      {p.type}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-1.5">{p.name}</h4>
                    <p className="text-[10px] text-slate-400">{p.region} • {p.rate}</p>
                  </div>
                  <Button onClick={() => handleRemovePartner(p.id)} size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:bg-red-950/40 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Bookings & Emergency Broadcasts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Approvals Queue */}
          <Card className="rounded-2xl border-slate-800/60 bg-slate-900/60 text-white">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                <Clock className="h-5 w-5 text-emerald-400" />
                Transit & Storage approvals
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">Pending farmer booking approvals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 pb-6">
              {pendingBookings.length > 0 ? (
                pendingBookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-3 border border-slate-800/80 rounded-xl bg-slate-950/40">
                    <div>
                      <span className="text-[9px] bg-emerald-950 border border-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded-full uppercase">
                        {b.type}
                      </span>
                      <h4 className="text-xs font-bold text-white mt-1.5">{b.farmer}</h4>
                      <p className="text-[11px] text-slate-400">{b.detail}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <Button onClick={() => handleApprove(b.id)} size="icon" className="h-8 w-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleReject(b.id)} size="icon" variant="outline" className="h-8 w-8 rounded-lg border-red-500/30 text-red-400 hover:bg-red-950/40">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-center space-y-2 bg-slate-950/20 rounded-2xl border border-dashed border-slate-800">
                  <Check className="h-8 w-8 text-slate-600" />
                  <span className="text-xs font-medium text-slate-500">All bookings processed. Queue is empty!</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Broadcast System */}
          <Card className="rounded-2xl border-slate-800/60 bg-slate-900/60 text-white">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                <Radio className="h-5 w-5 text-emerald-400" />
                Emergency Advisory System
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">Broadcast urgent notices or climate alerts directly to farmer dashboards.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-6">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-300">Notification Message</Label>
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="e.g. Heavy rain advisory issued for Coimbatore zone for the next 48 hours. Secure stored crop harvest."
                  className="w-full h-24 rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-xs text-white focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <Button onClick={handleBroadcast} className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl py-5 shadow-lg shadow-emerald-500/10 font-semibold">
                Broadcast Push Advisory
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
