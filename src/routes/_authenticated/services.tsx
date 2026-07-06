import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins, ShieldCheck, HeartHandshake, PhoneCall, MessageCircle, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/services")({
  component: ServicesPage,
});

const translations: Record<string, Record<string, any>> = {
  english: {
    title: "Services & Finance Portal",
    subtitle: "Apply for crop insurance, browse government subsidies, schedule expert advice, and share forum queries.",
    tab_subsidy: "Subsidies & Loans",
    tab_expert: "Expert Consult",
    tab_forum: "Community Forum",
    scheme_title: "Government Schemes & Subsidies",
    btn_apply: "Apply Now",
    kcc_title: "Kisan Credit Card (KCC) Loans",
    kcc_desc: "Access low-interest crop production loans from partner banks.",
    kcc_rate: "Interest Rate",
    kcc_rate_val: "4% per Annum (Subsidized)",
    btn_kcc: "Apply for Loan Assistance",
    ins_title: "PM Fasal Bima Yojana (Crop Insurance)",
    ins_desc: "Insure your farms against droughts, floods, or pest attacks.",
    ins_premium: "Premium Share",
    ins_premium_val: "Only 1.5% - 2.0% for Farmers",
    btn_ins: "Estimate Policy Cover",
    book_advisory: "Book Advisory Slot",
    book_advisory_desc: "Connect with agricultural experts.",
    select_expert: "Select Expert",
    choose_time: "Choose Timing",
    btn_call: "Schedule Tele-Call",
    sched_calls: "Scheduled Expert Calls",
    sched_calls_desc: "Your upcoming audio/video consultations.",
    ask_comm: "Ask the Community",
    ask_comm_desc: "Post questions to regional farmers.",
    post_lbl: "Post content",
    post_placeholder: "Type crop issues or farming questions...",
    btn_post: "Publish Post",
    feed_title: "Regional Farmers Feed",
    feed_desc: "Conversations from agricultural zones in Tamil Nadu.",
    active_now: "Active now",
    toast_scheme: "Redirecting to official government portal...",
    toast_loan: "Loan assistance application submitted! An officer will call you.",
    toast_ins: "Insurance portal loading...",
    toast_consult: "Consultation appointment confirmed!",
    toast_post_err: "Write something to post!",
    toast_post_success: "Query posted in Community Forum!",
    toast_like: "Post Liked!"
  },
  tamil: {
    title: "சேவைகள் & நிதியுதவி மையம்",
    subtitle: "பயிர் காப்பீட்டிற்கு விண்ணப்பிக்கவும், அரசு மானியங்களைப் பார்க்கவும், நிபுணர்களின் ஆலோசனையைப் பெறவும்.",
    tab_subsidy: "மானியம் & கடன்கள்",
    tab_expert: "நிபுணர் ஆலோசனை",
    tab_forum: "விவசாயிகள் மன்றம்",
    scheme_title: "அரசு திட்டங்கள் & மானியங்கள்",
    btn_apply: "விண்ணப்பிக்கவும்",
    kcc_title: "கிசான் கிரெடிட் கார்டு (KCC) கடன்கள்",
    kcc_desc: "கூட்டு வங்கிகளிடமிருந்து குறைந்த வட்டி விகிதத்தில் சாகுபடி கடன்களைப் பெறுக.",
    kcc_rate: "வட்டி விகிதம்",
    kcc_rate_val: "ஆண்டுக்கு 4% (மானிய வட்டி)",
    btn_kcc: "கடன் உதவிக்கு விண்ணப்பிக்கவும்",
    ins_title: "பயிர் காப்பீட்டுத் திட்டம் (PMFBY)",
    ins_desc: "வறட்சி, வெள்ளம் அல்லது பூச்சித் தாக்குதல்களிலிருந்து உங்களது பயிர்களைப் பாதுகாக்கவும்.",
    ins_premium: "காப்பீட்டு கட்டணப் பங்கு",
    ins_premium_val: "விவசாயிகளுக்கு 1.5% - 2.0% மட்டுமே",
    btn_ins: "காப்பீட்டுத் தொகையை மதிப்பிடவும்",
    book_advisory: "ஆலோசனை முன்பதிவு",
    book_advisory_desc: "விவசாய நிபுணர்களைத் தொடர்பு கொள்ளுங்கள்.",
    select_expert: "நிபுணரைத் தேர்ந்தெடுக்கவும்",
    choose_time: "நேரத்தைத் தேர்ந்தெடுக்கவும்",
    btn_call: "தொலைபேசி ஆலோசனையை முன்பதிவு செய்",
    sched_calls: "முன்பதிவு செய்யப்பட்ட அழைப்புகள்",
    sched_calls_desc: "உங்களது வரவிருக்கும் தொலைபேசி/காணொளி ஆலோசனைகள்.",
    ask_comm: "விவசாயிகளிடம் கேளுங்கள்",
    ask_comm_desc: "உள்ளூர் விவசாயிகளுடன் கேள்விகளைப் பகிர்ந்து கொள்ளுங்கள்.",
    post_lbl: "கேள்வி விவரம்",
    post_placeholder: "பயிர் நோய்கள் அல்லது விவசாய சந்தேகங்களை எழுதவும்...",
    btn_post: "கேள்வியைப் பதிவிடு",
    feed_title: "வட்டார விவசாயிகளின் பதிவுகள்",
    feed_desc: "தமிழ்நாடு விவசாய மண்டலங்களிலிருந்து வரும் உரையாடல்கள்.",
    active_now: "தற்போது செயல்பாட்டில் உள்ளார்",
    toast_scheme: "அரசு இணையதள பக்கத்திற்கு அழைத்துச் செல்லப்படுகிறது...",
    toast_loan: "கடன் உதவிக்கான விண்ணப்பம் சமர்ப்பிக்கப்பட்டது! அதிகாரி உங்களைத் தொடர்பு கொள்வார்.",
    toast_ins: "காப்பீட்டுத் தளம் ஏற்றப்படுகிறது...",
    toast_consult: "ஆலோசனை முன்பதிவு உறுதி செய்யப்பட்டது!",
    toast_post_err: "பதிவிட எதையாவது எழுதவும்!",
    toast_post_success: "விவசாயிகள் மன்றத்தில் கேள்வி பதிவிடப்பட்டது!",
    toast_like: "விரும்பப்பட்டது!"
  }
};

function ServicesPage() {
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

  const st = translations[lang] || translations.english;

  // Tab 1: Schemes & Finance catalog
  const [schemes, setSchemes] = useState<any[]>([]);

  // Tab 2: Expert Consult state
  const [consultInputs, setConsultInputs] = useState({ expert: "dr_ananth", slot: "10am_12pm" });
  const [activeConsults, setActiveConsults] = useState<any[]>([]);

  // Tab 3: Community posts
  const [forumPosts, setForumPosts] = useState<any[]>([]);
  const [newPostText, setNewPostText] = useState("");

  // Sync localized schemes, consults, and forum feeds
  useEffect(() => {
    if (lang === "tamil") {
      setSchemes([
        { id: 1, title: "பிரதம மந்திரி கிசான் சம்மான் நிதி (PM-KISAN)", desc: "விவசாயிகளுக்கு ஆண்டுக்கு ₹6,000 நிதியுதவி வழங்கும் மத்திய அரசு திட்டம்.", type: "மத்திய அரசு" },
        { id: 2, title: "தமிழ்நாடு இயற்கை விவசாய மானியம்", desc: "இயற்கை விவசாயத்திற்கு மாற ஏக்கருக்கு ₹10,000 வரை நிதியுதவி வழங்கும் திட்டம்.", type: "மாநில அரசு" },
        { id: 3, title: "சூரியசக்தி மோட்டார் பம்ப் மானியம்", desc: "சூரியசக்தி மோட்டார்களுக்கு 70% வரை அரசு வழங்கும் மானியத் திட்டம்.", type: "மாநில அரசு" },
      ]);

      setActiveConsults([
        { id: 1, name: "டாக்டர் ஆனந்த் (பயிர் நோயியல் வல்லுநர்)", slot: "நாளை, காலை 10:00 - மதியம் 12:00", status: "உறுதி செய்யப்பட்டது" }
      ]);

      setForumPosts([
        { id: 1, author: "முத்து எஸ்.", body: "மஞ்சள் பயிருக்கு நடுவே வளரும் களைகளைக் கட்டுப்படுத்த எந்த களைக்கொல்லி சிறந்தது?", likes: 4, comments: 2 },
        { id: 2, author: "கணேஷ் ஆர்.", body: "கோயம்புத்தூர் மற்றும் சுற்றுவட்டாரத்தில் ஈரப்பதம் அதிகமாக உள்ளது. தக்காளி பயிரில் இலை கருகல் நோய் வரலாம், முன்கூட்டியே பஞ்சகவ்யா தெளிக்கவும்.", likes: 8, comments: 3 }
      ]);
    } else {
      setSchemes([
        { id: 1, title: "PM-KISAN Samman Nidhi", desc: "Annual income support of ₹6,000 for landholder farmers.", type: "Central" },
        { id: 2, title: "TN Organic Agriculture Grant", desc: "Subsidy support of ₹10,000 per hectare for converting to organic manure methodologies.", type: "State" },
        { id: 3, title: "Solar Water Pump Subsidy", desc: "Up to 70% state subsidy for solar powered tube wells and surface pumps.", type: "State" },
      ]);

      setActiveConsults([
        { id: 1, name: "Dr. Ananth (Pathologist)", slot: "Tomorrow, 10:00 AM - 12:00 PM", status: "Confirmed" }
      ]);

      setForumPosts([
        { id: 1, author: "Muthu S.", body: "Which herbicide works best to clear weeds in Turmeric (மஞ்சள்) fields without affecting the main tuber?", likes: 4, comments: 2 },
        { id: 2, author: "Ganesh R.", body: "High humidity around Coimbatore. Check your tomato leaves for early blight. Best to spray Panchagavya early.", likes: 8, comments: 3 }
      ]);
    }
  }, [lang]);

  const handleConsultRequest = () => {
    const expertName = consultInputs.expert === "dr_ananth" 
      ? (lang === "tamil" ? "டாக்டர் ஆனந்த் (பயிர் நோயியல் வல்லுநர்)" : "Dr. Ananth (Pathologist)") 
      : (lang === "tamil" ? "பேராசிரியர் சீனிவாசன் (மண் பரிசோதனை வல்லுநர்)" : "Prof. Srinivasan (Soil Scientist)");
    const slotLabel = consultInputs.slot === "10am_12pm" ? "10:00 AM - 12:00 PM" : "02:00 PM - 04:00 PM";
    
    const newConsult = {
      id: Date.now(),
      name: expertName,
      slot: lang === "tamil" ? `தேதி: திட்டமிடப்பட்டது, ${slotLabel}` : `Date: Scheduled, ${slotLabel}`,
      status: lang === "tamil" ? "உறுதி செய்யப்பட்டது" : "Confirmed",
    };

    setActiveConsults((p) => [newConsult, ...p]);
    toast.success(st.toast_consult);
  };

  const handlePostForum = () => {
    if (!newPostText.trim()) return toast.error(st.toast_post_err);
    const newPost = {
      id: Date.now(),
      author: lang === "tamil" ? "நீங்கள் (விவசாயி)" : "You (Farmer)",
      body: newPostText,
      likes: 0,
      comments: 0,
    };
    setForumPosts((p) => [newPost, ...p]);
    setNewPostText("");
    toast.success(st.toast_post_success);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
          <Coins className="h-6 w-6 text-green-700" />
          {st.title}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {st.subtitle}
        </p>
      </div>

      <Tabs defaultValue="finance" className="w-full">
        <TabsList className="flex flex-wrap h-auto w-fit max-w-full bg-green-100/40 border border-green-200/30 p-1.5 gap-1.5 sm:gap-2 rounded-2xl mb-6">
          <TabsTrigger 
            value="finance" 
            className="rounded-xl text-xs sm:text-sm px-4 py-2.5 font-bold transition-all duration-200 text-slate-600 hover:text-green-800 hover:bg-white/40 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-transparent"
          >
            {st.tab_subsidy}
          </TabsTrigger>
          <TabsTrigger 
            value="expert" 
            className="rounded-xl text-xs sm:text-sm px-4 py-2.5 font-bold transition-all duration-200 text-slate-600 hover:text-green-800 hover:bg-white/40 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-transparent"
          >
            {st.tab_expert}
          </TabsTrigger>
          <TabsTrigger 
            value="forum" 
            className="rounded-xl text-xs sm:text-sm px-4 py-2.5 font-bold transition-all duration-200 text-slate-600 hover:text-green-800 hover:bg-white/40 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-transparent"
          >
            {st.tab_forum}
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: FINANCE & SCHEMES */}
        <TabsContent value="finance" className="space-y-6 animate-fade-in">
          {/* Subsidies Grid */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-700" />
              {st.scheme_title}
            </h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {schemes.map((s) => (
                <Card key={s.id} className="rounded-2xl border border-green-50 bg-white flex flex-col justify-between">
                  <CardHeader className="pb-2">
                    <span className="text-[9px] bg-green-50 border border-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full w-fit">
                      {s.type} {lang === "tamil" ? "திட்டம்" : "Scheme"}
                    </span>
                    <CardTitle className="text-sm font-bold text-foreground mt-2">{s.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4 pt-1 space-y-3">
                    <p className="text-[11px] text-muted-foreground leading-normal">{s.desc}</p>
                    <Button 
                      onClick={() => toast.success(st.toast_scheme)}
                      size="sm" 
                      variant="outline" 
                      className="w-full text-xs rounded-lg border-green-100 text-green-700 hover:bg-green-50/50"
                    >
                      {st.btn_apply}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Kisan Loans & Insurance */}
          <div className="grid gap-6 md:grid-cols-2 pt-2">
            <Card className="rounded-2xl border border-slate-100 bg-white">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Coins className="h-5 w-5 text-green-700" />
                  {st.kcc_title}
                </CardTitle>
                <CardDescription className="text-xs">{st.kcc_desc}</CardDescription>
              </CardHeader>
              <CardContent className="pb-6 space-y-4">
                <div className="p-3 bg-slate-50/60 rounded-xl space-y-1">
                  <span className="text-[10px] text-muted-foreground block font-medium">{st.kcc_rate}</span>
                  <span className="text-base font-extrabold text-green-700">{st.kcc_rate_val}</span>
                </div>
                <Button 
                  onClick={() => toast.success(st.toast_loan)}
                  className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-5 shadow-lg shadow-green-700/10 font-semibold"
                >
                  {st.btn_kcc}
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-slate-100 bg-white">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <HeartHandshake className="h-5 w-5 text-green-700" />
                  {st.ins_title}
                </CardTitle>
                <CardDescription className="text-xs">{st.ins_desc}</CardDescription>
              </CardHeader>
              <CardContent className="pb-6 space-y-4">
                <div className="p-3 bg-slate-50/60 rounded-xl space-y-1">
                  <span className="text-[10px] text-muted-foreground block font-medium">{st.ins_premium}</span>
                  <span className="text-base font-extrabold text-green-700">{st.ins_premium_val}</span>
                </div>
                <Button 
                  onClick={() => toast.success(st.toast_ins)}
                  className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-5 shadow-lg shadow-green-700/10 font-semibold"
                >
                  {st.btn_ins}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: EXPERT CONSULT */}
        <TabsContent value="expert" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Appointment Form */}
            <Card className="rounded-2xl border border-green-50 bg-white md:col-span-1">
              <CardHeader>
                <CardTitle className="text-base font-bold">{st.book_advisory}</CardTitle>
                <CardDescription className="text-xs">{st.book_advisory_desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{st.select_expert}</Label>
                  <Select
                    value={consultInputs.expert}
                    onValueChange={(val) => setConsultInputs((p) => ({ ...p, expert: val }))}
                  >
                    <SelectTrigger className="rounded-xl border-green-100">
                      <SelectValue placeholder="Expert" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr_ananth">{lang === "tamil" ? "டாக்டர் ஆனந்த் (நோயியல் வல்லுநர்)" : "Dr. Ananth (Pathologist)"}</SelectItem>
                      <SelectItem value="prof_vasu">{lang === "tamil" ? "பேராசிரியர் சீனிவாசன் (மண் வல்லுநர்)" : "Prof. Srinivasan (Soil Scientist)"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{st.choose_time}</Label>
                  <Select
                    value={consultInputs.slot}
                    onValueChange={(val) => setConsultInputs((p) => ({ ...p, slot: val }))}
                  >
                    <SelectTrigger className="rounded-xl border-green-100">
                      <SelectValue placeholder="Slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10am_12pm">{lang === "tamil" ? "காலை 10:00 - மதியம் 12:00" : "10:00 AM - 12:00 PM"}</SelectItem>
                      <SelectItem value="2pm_4pm">{lang === "tamil" ? "மதியம் 02:00 - மாலை 04:00" : "02:00 PM - 04:00 PM"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleConsultRequest}
                  className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-5 shadow-lg shadow-green-700/10 font-semibold"
                >
                  {st.btn_call}
                </Button>
              </CardContent>
            </Card>

            {/* Confirmed Bookings list */}
            <Card className="rounded-2xl border border-slate-100 bg-white md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <PhoneCall className="h-5 w-5 text-green-700" />
                  {st.sched_calls}
                </CardTitle>
                <CardDescription className="text-xs">{st.sched_calls_desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3.5 pb-6">
                {activeConsults.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl bg-slate-50/30">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-foreground">{c.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{c.slot}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 border border-green-200 text-green-800 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {lang === "tamil" ? "உறுதியானது" : c.status}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: COMMUNITY FORUM */}
        <TabsContent value="forum" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* New Post Form */}
            <Card className="rounded-2xl border border-slate-100 bg-white md:col-span-1 h-fit">
              <CardHeader>
                <CardTitle className="text-base font-bold">{st.ask_comm}</CardTitle>
                <CardDescription className="text-xs">{st.ask_comm_desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{st.post_lbl}</Label>
                  <textarea
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder={st.post_placeholder}
                    className="w-full h-32 rounded-xl border border-green-100 focus:ring-green-600 focus:border-green-600 p-3 text-xs focus:outline-none"
                  />
                </div>
                <Button
                  onClick={handlePostForum}
                  className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-5 shadow-lg shadow-green-700/10 font-semibold flex items-center justify-center gap-1"
                >
                  <Send className="h-4 w-4" />
                  {st.btn_post}
                </Button>
              </CardContent>
            </Card>

            {/* Forums feed */}
            <Card className="rounded-2xl border border-slate-100 bg-white md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-700" />
                  {st.feed_title}
                </CardTitle>
                <CardDescription className="text-xs">{st.feed_desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                {forumPosts.map((post) => (
                  <div key={post.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/20 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-green-800">{post.author}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold">{st.active_now}</span>
                    </div>
                    <p className="text-xs text-foreground font-medium leading-relaxed">{post.body}</p>
                    <div className="flex gap-4 pt-1.5 text-[10px] text-muted-foreground font-bold">
                      <button 
                        onClick={() => toast.success(st.toast_like)}
                        className="hover:text-green-700"
                      >
                        👍 {post.likes} {lang === "tamil" ? "விருப்பங்கள்" : "Likes"}
                      </button>
                      <span>💬 {post.comments} {lang === "tamil" ? "கருத்துகள்" : "Comments"}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
