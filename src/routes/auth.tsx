import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Leaf, Mail, ShieldCheck, ArrowLeft } from "lucide-react";
import heroFarm from "@/assets/hero-farm.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — AgriVerse" },
      { name: "description", content: "Sign in or create an AgriVerse account." },
    ],
  }),
  component: AuthPage,
});function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const sha256 = async (message: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const signIn = async () => {
    if (!email || !password) return toast.error("Please enter email and password");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    navigate({ to: "/dashboard" });
  };

  const signUp = async () => {
    if (!username.trim()) return toast.error("Please enter your Farmer Name");
    if (!email || !password) return toast.error("Please enter email and password");
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");

    setLoading(true);
    
    // Create authentic user in Supabase auth system
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { username },
      },
    });

    if (error) {
      setLoading(false);
      return toast.error(error.message);
    }

    if (data?.user) {
      try {
        const hashedPassword = await sha256(password);
        const { error: profileError } = await (supabase as any)
          .from("profiles")
          .insert({
            id: data.user.id,
            username,
            email,
            password_hashed: hashedPassword,
          });

        if (profileError) {
          console.error("Profiles insertion failed:", profileError.message);
        }

        // Initialize local profile settings with the entered Farmer Name
        localStorage.setItem("farmer_profile", JSON.stringify({
          fullName: username,
          district: "Coimbatore",
          state: "Tamil Nadu",
          phone: "",
          landSize: "4.5",
          soilType: "black",
          waterSource: "well",
          primaryCrop: "turmeric",
          farmingMethod: "organic"
        }));
      } catch (err) {
        console.error("Failed hashing or profile synchronization:", err);
      }
    }

    setLoading(false);
    setIsRegistered(true);
    toast.success("Verification link sent!");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url(${heroFarm})` }}
    >
      {/* Background overlay with green tint */}
      <div className="absolute inset-0 bg-green-950/40 backdrop-blur-[2px]" aria-hidden="true" />
      
      {/* Organic floating glow blur elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500 rounded-full blur-[100px] opacity-25 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-600 rounded-full blur-[120px] opacity-20 animate-pulse delay-75" />

      <Card className="w-full max-w-md relative shadow-2xl border-white/10 bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-600 via-emerald-500 to-green-800" />
        
        <CardHeader className="text-center pb-2 pt-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-transparent mb-2.5 overflow-hidden">
            <img src="/logo.png" alt="AgriVerse" className="h-12 w-12 object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            <Link to="/" className="bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent hover:opacity-90">
              AgriVerse
            </Link>
          </CardTitle>
          <p className="text-xs font-medium text-muted-foreground/80 mt-1">Complete Digital Agriculture Ecosystem</p>
        </CardHeader>
        
        <CardContent className="px-6 pb-8 pt-4">
          {!isRegistered ? (
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid grid-cols-2 w-full bg-green-50/50 p-1 rounded-xl mb-6">
                <TabsTrigger 
                  value="signin" 
                  className="rounded-lg text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-green-800 data-[state=active]:shadow-sm transition-all"
                >
                  Sign in
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="rounded-lg text-sm py-2 data-[state=active]:bg-white data-[state=active]:text-green-800 data-[state=active]:shadow-sm transition-all"
                >
                  Sign up
                </TabsTrigger>
              </TabsList>

              {/* SIGN IN VIEW */}
              <TabsContent value="signin" className="mt-2 space-y-4">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email-signin" className="text-xs font-semibold text-muted-foreground">Email Address</Label>
                    <Input 
                      id="email-signin" 
                      type="email" 
                      placeholder="name@example.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl border-green-100 focus-visible:ring-green-600 py-5"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password-signin" className="text-xs font-semibold text-muted-foreground">Password</Label>
                    <Input 
                      id="password-signin" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-xl border-green-100 focus-visible:ring-green-600 py-5"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={signIn} 
                  disabled={loading} 
                  className="w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white rounded-xl py-5 shadow-lg shadow-green-700/10 font-medium mt-2"
                >
                  {loading ? "Signing in..." : "Sign in to Dashboard"}
                </Button>
              </TabsContent>
              
              {/* SIGN UP VIEW */}
              <TabsContent value="signup" className="mt-2 space-y-4">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="username-signup" className="text-xs font-semibold text-muted-foreground">Farmer Name</Label>
                    <Input 
                      id="username-signup" 
                      type="text" 
                      placeholder="e.g. John Doe / வேலுச்சாமி" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      className="rounded-xl border-green-100 focus-visible:ring-green-600 py-5"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email-signup" className="text-xs font-semibold text-muted-foreground">Email Address</Label>
                    <Input 
                      id="email-signup" 
                      type="email" 
                      placeholder="name@example.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl border-green-100 focus-visible:ring-green-600 py-5"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password-signup" className="text-xs font-semibold text-muted-foreground">Password</Label>
                    <Input 
                      id="password-signup" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-xl border-green-100 focus-visible:ring-green-600 py-5"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-password-signup" className="text-xs font-semibold text-muted-foreground">Re-enter Password</Label>
                    <Input 
                      id="confirm-password-signup" 
                      type="password" 
                      placeholder="••••••••" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="rounded-xl border-green-100 focus-visible:ring-green-600 py-5"
                    />
                  </div>
                </div>

                <Button 
                  onClick={signUp} 
                  disabled={loading} 
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl py-5 shadow-lg shadow-green-700/10 font-medium mt-2"
                >
                  {loading ? "Creating Account..." : "Register Account"}
                </Button>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-4 space-y-6 animate-fade-in">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20 animate-pulse scale-125" />
                  <div className="relative bg-green-50 border border-green-100 p-4 rounded-full text-green-700 animate-bounce">
                    <Mail className="h-10 w-10 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-green-800">Check Your Inbox</h2>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  We've sent a verification link to <span className="font-semibold text-green-700 break-all">{email}</span>. Click the link inside the mail to verify.
                </p>
              </div>

              <div className="bg-green-50/60 border border-green-100/60 rounded-2xl p-4 text-xs text-green-800 text-left max-w-sm mx-auto space-y-2.5">
                <div className="flex items-center gap-1.5 font-semibold text-green-900">
                  <ShieldCheck className="h-4 w-4 text-green-700" />
                  <span>Activation Instructions:</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-muted-foreground/90">
                  <li>Check your <strong>Spam</strong> or Promotion tab if it doesn't arrive.</li>
                  <li>Clicking the link will automatically authenticate you.</li>
                  <li>Keep this page open to click back below once verified.</li>
                </ul>
              </div>

              <div className="pt-2">
                <Button 
                  variant="ghost" 
                  className="w-full flex items-center justify-center gap-2 hover:bg-green-50 rounded-xl text-green-700 py-5"
                  onClick={() => setIsRegistered(false)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Log In
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

