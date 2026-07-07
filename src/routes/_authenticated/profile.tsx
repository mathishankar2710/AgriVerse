import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Save, MapPin, Sprout, Droplets, ShieldCheck, Scale } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

const translations: Record<string, Record<string, any>> = {
  english: {
    title: "Farmer Profile Settings",
    subtitle: "Manage your agricultural details, regional locations, and primary crop configurations.",
    farmer_name: "Farmer Resident",
    lbl_land: "Land Size",
    lbl_soil: "Soil Type",
    lbl_water: "Water Source",
    lbl_method: "Method",
    status_verified: "Verified Profile Status",
    status_desc: "PM-KISAN status: Connected",
    card_details: "Profile Details",
    card_details_desc: "Fill out your details to personalize Agri Agent recommendations.",
    name_lbl: "Full Name",
    name_placeholder: "Enter full name",
    phone_lbl: "Phone Number",
    phone_placeholder: "e.g. +91 98765 43210",
    district_lbl: "District",
    district_placeholder: "e.g. Coimbatore",
    state_lbl: "State",
    state_placeholder: "e.g. Tamil Nadu",
    op_config: "Farm Operations configurations",
    land_lbl: "Land Size (Acres)",
    soil_lbl: "Primary Soil Type",
    soil_select: "Select soil type",
    water_lbl: "Water Source",
    water_select: "Select water source",
    crop_lbl: "Primary Cultivated Crop",
    crop_select: "Select primary crop",
    method_lbl: "Farming Method",
    method_select: "Select farming method",
    btn_save: "Save Profile Settings",
    btn_saving: "Saving Changes...",
    toast_success: "Farmer Profile updated successfully!",
    toast_err: "Failed to save profile settings",
    black_soil: "Black Cotton Soil (Karisal)",
    red_soil: "Red Clay Soil (Semman)",
    alluvial_soil: "Alluvial Soil (Vandal)",
    sandy_soil: "Sandy Loam Soil (Manal)",
    laterite_soil: "Laterite Soil (Sengar)",
    well: "Open Well (Kinaru)",
    borewell: "Borewell (Nalkinaru)",
    canal: "Canal Irrigation (Vaikaal)",
    rainfed: "Rainfed Only (Maanaavari)",
    organic: "100% Organic (Iyarkai Vazhi)",
    conventional: "Conventional Chemical (Naveena)",
    hybrid: "Integrated / Hybrid (Kalanthu)",
    acres_suffix: "Acres",
    acres_abbr: "Ac"
  },
  tamil: {
    title: "விவசாயி சுயவிவர அமைப்புகள்",
    subtitle: "விவசாய விவரங்கள், இருப்பிடங்கள் மற்றும் பயிர் அமைப்புகளை நிர்வகிக்கவும்.",
    farmer_name: "விவசாயி குடியResident",
    lbl_land: "நில அளவு",
    lbl_soil: "மண் வகை",
    lbl_water: "நீர் ஆதாரம்",
    lbl_method: "முறை",
    status_verified: "சரிபார்க்கப்பட்ட சுயவிவரம்",
    status_desc: "PM-KISAN நிலை: இணைக்கப்பட்டுள்ளது",
    card_details: "சுயவிவர விவரங்கள்",
    card_details_desc: "அகிரிவெர்ஸ் பரிந்துரைகளைத் தனிப்பயனாக்க உங்களது விவரங்களை உள்ளிடவும்.",
    name_lbl: "முழு பெயர்",
    name_placeholder: "முழு பெயரை உள்ளிடவும்",
    phone_lbl: "தொலைபேசி எண்",
    phone_placeholder: "எ.கா. +91 98765 43210",
    district_lbl: "மாவட்டம்",
    district_placeholder: "எ.கா. கோயம்புத்தூர்",
    state_lbl: "மாநிலம்",
    state_placeholder: "எ.கா. தமிழ்நாடு",
    op_config: "விவசாயப் பணி அமைப்புகள்",
    land_lbl: "நிலத்தின் அளவு (ஏக்கர்)",
    soil_lbl: "முதன்மை மண் வகை",
    soil_select: "மண் வகையைத் தேர்ந்தெடுக்கவும்",
    water_lbl: "நீர் ஆதாரம்",
    water_select: "நீர் ஆதாரத்தைத் தேர்ந்தெடுக்கவும்",
    crop_lbl: "முதன்மை பயிர்",
    crop_select: "பயிரைத் தேர்ந்தெடுக்கவும்",
    method_lbl: "விவசாய முறை",
    method_select: "விவசாய முறையைத் தேர்ந்தெடுக்கவும்",
    btn_save: "சுயவிவரத்தைச் சேமிக்கவும்",
    btn_saving: "சேமிக்கப்படுகிறது...",
    toast_success: "சுயவிவர விவரங்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
    toast_err: "சுயவிவரத்தைச் சேமிப்பதில் தோல்வி",
    black_soil: "கரிசல் மண் (Black Cotton)",
    red_soil: "செம்மண் (Red Clay)",
    alluvial_soil: "வண்டல் மண் (Alluvial)",
    sandy_soil: "மணல் மண் (Sandy Loam)",
    laterite_soil: "செங்குன்றான மண் (Laterite)",
    well: "கிணறு (Open Well)",
    borewell: "ஆழ்துளைக் கிணறு (Borewell)",
    canal: "வாய்க்கால் பாசனம் (Canal)",
    rainfed: "மானாவாரி (Rainfed Only)",
    organic: "100% இயற்கை விவசாயம் (Organic)",
    conventional: "இரசாயன விவசாயம் (Chemical)",
    hybrid: "கலப்பு விவசாயம் (Integrated)",
    acres_suffix: "ஏக்கர்",
    acres_abbr: "ஏக்"
  }
};

function ProfilePage() {
  const { user } = Route.useRouteContext();

  const [profile, setProfile] = useState({
    fullName: "",
    district: "Coimbatore",
    state: "Tamil Nadu",
    phone: "",
    landSize: "4.5",
    soilType: "black",
    waterSource: "well",
    primaryCrop: "turmeric",
    farmingMethod: "organic",
  });

  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("english");

  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang") || "english";
    setLang(savedLang);
    const handleLangChange = () => {
      setLang(localStorage.getItem("app_lang") || "english");
    };
    window.addEventListener("languageChanged", handleLangChange);
    return () => window.removeEventListener("languageChanged", handleLangChange);
  }, []);

  const pt = translations[lang] || translations.english;

  useEffect(() => {
    const loadProfile = async () => {
      // 1. Try reading local storage first
      const saved = localStorage.getItem("farmer_profile");
      let localData: any = null;
      if (saved) {
        try {
          localData = JSON.parse(saved);
        } catch (e) {
          console.error("Error reading profile", e);
        }
      }

      // 2. Query Supabase profiles table for the actual username (Farmer Name)
      try {
        const { data: dbProfile, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        if (!error && dbProfile) {
          const dbUsername = dbProfile.username || "";
          setProfile((prev) => ({
            ...prev,
            ...localData,
            fullName: localData?.fullName && localData.fullName !== "John Doe"
              ? localData.fullName
              : dbUsername || pt.farmer_name,
          }));
          return;
        }
      } catch (err) {
        console.error("Database profile load error:", err);
      }

      // 3. Fallback to local storage or defaults if query is empty or fails
      if (localData) {
        setProfile((prev) => ({ ...prev, ...localData }));
      } else {
        setProfile((prev) => ({ ...prev, fullName: pt.farmer_name }));
      }
    };

    loadProfile();
  }, [user.id, lang]); // reload or update fallback name when lang changes

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username: profile.fullName })
        .eq("id", user.id);

      if (error) throw error;

      localStorage.setItem("farmer_profile", JSON.stringify(profile));
      toast.success(pt.toast_success);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || pt.toast_err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const getSoilName = (soil: string) => {
    const map: Record<string, string> = {
      black: pt.black_soil,
      red: pt.red_soil,
      alluvial: pt.alluvial_soil,
      sandy: pt.sandy_soil,
      laterite: pt.laterite_soil,
    };
    return map[soil] || soil;
  };

  const getWaterSourceName = (water: string) => {
    const map: Record<string, string> = {
      well: pt.well,
      borewell: pt.borewell,
      canal: pt.canal,
      rainfed: pt.rainfed,
    };
    return map[water] || water;
  };

  const getFarmingMethodName = (method: string) => {
    const map: Record<string, string> = {
      organic: pt.organic,
      conventional: pt.conventional,
      hybrid: pt.hybrid,
    };
    return map[method] || method;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
          <User className="h-6 w-6 text-green-700" />
          {pt.title}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {pt.subtitle}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Summary Card */}
        <Card className="rounded-2xl border-green-100/50 shadow-sm bg-white md:col-span-1 overflow-hidden h-fit">
          <div className="h-24 bg-gradient-to-tr from-green-800 to-green-600 relative flex items-end justify-center pb-4">
            <div className="absolute -bottom-8 h-20 w-20 rounded-2xl bg-white border border-green-100 shadow-md flex items-center justify-center text-green-700">
              <User className="h-10 w-10" />
            </div>
          </div>
          <CardContent className="pt-12 text-center pb-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-foreground">{profile.fullName || (lang === "tamil" ? "விவசாயி பெயர்" : "Farmer Name")}</h2>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-green-600" />
                {lang === "tamil" && profile.district.toLowerCase() === "coimbatore" ? "கோயம்புத்தூர்" : profile.district}, {lang === "tamil" && profile.state.toLowerCase() === "tamil nadu" ? "தமிழ்நாடு" : profile.state}
              </p>
            </div>

            <div className="border-t border-green-50 pt-4 grid grid-cols-2 gap-2 text-left">
              <div className="p-2 bg-slate-50/50 rounded-xl">
                <span className="text-[10px] text-muted-foreground block font-medium">{pt.lbl_land}</span>
                <span className="text-xs font-bold text-foreground">{profile.landSize} {pt.acres_suffix}</span>
              </div>
              <div className="p-2 bg-slate-50/50 rounded-xl">
                <span className="text-[10px] text-muted-foreground block font-medium">{pt.lbl_soil}</span>
                <span className="text-xs font-bold text-foreground truncate block max-w-full">{getSoilName(profile.soilType)}</span>
              </div>
              <div className="p-2 bg-slate-50/50 rounded-xl">
                <span className="text-[10px] text-muted-foreground block font-medium">{pt.lbl_water}</span>
                <span className="text-xs font-bold text-foreground truncate block max-w-full">{getWaterSourceName(profile.waterSource)}</span>
              </div>
              <div className="p-2 bg-slate-50/50 rounded-xl">
                <span className="text-[10px] text-muted-foreground block font-medium">{pt.lbl_method}</span>
                <span className="text-xs font-bold text-foreground truncate block max-w-full">{getFarmingMethodName(profile.farmingMethod)}</span>
              </div>
            </div>
            
            <div className="bg-green-50/50 rounded-xl p-3 border border-green-100/50 flex items-center gap-2 text-left">
              <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-green-800 block">{pt.status_verified}</span>
                <span className="text-[9px] text-green-600">{pt.status_desc}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Side: Form Card */}
        <Card className="rounded-2xl border-green-100/50 shadow-sm bg-white md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold">{pt.card_details}</CardTitle>
            <CardDescription className="text-xs">{pt.card_details_desc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-6 text-left">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">{pt.name_lbl}</Label>
                <Input
                  value={profile.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder={pt.name_placeholder}
                  className="rounded-xl border-green-100 focus-visible:ring-green-600"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">{pt.phone_lbl}</Label>
                <Input
                  value={profile.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder={pt.phone_placeholder}
                  className="rounded-xl border-green-100 focus-visible:ring-green-600"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">{pt.district_lbl}</Label>
                <Input
                  value={profile.district}
                  onChange={(e) => handleInputChange("district", e.target.value)}
                  placeholder={pt.district_placeholder}
                  className="rounded-xl border-green-100 focus-visible:ring-green-600"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">{pt.state_lbl}</Label>
                <Input
                  value={profile.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder={pt.state_placeholder}
                  className="rounded-xl border-green-100 focus-visible:ring-green-600"
                />
              </div>
            </div>

            <div className="border-t border-green-50 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-foreground">{pt.op_config}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{pt.land_lbl}</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={profile.landSize}
                      onChange={(e) => handleInputChange("landSize", e.target.value)}
                      placeholder="e.g. 5"
                      className="rounded-xl border-green-100 focus-visible:ring-green-600 pr-10"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-semibold">{pt.acres_abbr}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{pt.soil_lbl}</Label>
                  <Select value={profile.soilType} onValueChange={(val) => handleInputChange("soilType", val)}>
                    <SelectTrigger className="rounded-xl border-green-100">
                      <SelectValue placeholder={pt.soil_select} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="black">{pt.black_soil}</SelectItem>
                      <SelectItem value="red">{pt.red_soil}</SelectItem>
                      <SelectItem value="alluvial">{pt.alluvial_soil}</SelectItem>
                      <SelectItem value="sandy">{pt.sandy_soil}</SelectItem>
                      <SelectItem value="laterite">{pt.laterite_soil}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{pt.water_lbl}</Label>
                  <Select value={profile.waterSource} onValueChange={(val) => handleInputChange("waterSource", val)}>
                    <SelectTrigger className="rounded-xl border-green-100">
                      <SelectValue placeholder={pt.water_select} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="well">{pt.well}</SelectItem>
                      <SelectItem value="borewell">{pt.borewell}</SelectItem>
                      <SelectItem value="canal">{pt.canal}</SelectItem>
                      <SelectItem value="rainfed">{pt.rainfed}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{pt.crop_lbl}</Label>
                  <Select value={profile.primaryCrop} onValueChange={(val) => handleInputChange("primaryCrop", val)}>
                    <SelectTrigger className="rounded-xl border-green-100">
                      <SelectValue placeholder={pt.crop_select} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rice">{lang === "tamil" ? "நெல் / அரிசி" : "Paddy / Rice (Nel)"}</SelectItem>
                      <SelectItem value="turmeric">{lang === "tamil" ? "மஞ்சள்" : "Turmeric (Manjal)"}</SelectItem>
                      <SelectItem value="coconut">{lang === "tamil" ? "தென்னை" : "Coconut (Thengai)"}</SelectItem>
                      <SelectItem value="sugarcane">{lang === "tamil" ? "கரும்பு" : "Sugarcane (Karumbu)"}</SelectItem>
                      <SelectItem value="banana">{lang === "tamil" ? "வாழை" : "Banana (Vazhai)"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{pt.method_lbl}</Label>
                  <Select value={profile.farmingMethod} onValueChange={(val) => handleInputChange("farmingMethod", val)}>
                    <SelectTrigger className="rounded-xl border-green-100">
                      <SelectValue placeholder={pt.method_select} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="organic">{pt.organic}</SelectItem>
                      <SelectItem value="conventional">{pt.conventional}</SelectItem>
                      <SelectItem value="hybrid">{pt.hybrid}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="border-t border-green-50 pt-4 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-green-700 hover:bg-green-800 text-white rounded-xl flex items-center gap-1.5 shadow-md shadow-green-700/10 px-6 py-5 font-semibold"
              >
                <Save className="h-4 w-4" />
                {loading ? pt.btn_saving : pt.btn_save}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
