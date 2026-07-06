import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBag, Truck, HardHat, Warehouse, Store, Plus, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/marketplace")({
  component: MarketplacePage,
});

interface PartnerRecord {
  id: string;
  type: "logistics" | "storage";
  name: string;
  rate: string;
  region: string;
  contact: string;
}

const translations: Record<string, Record<string, any>> = {
  english: {
    title: "Marketplace & Logistics Hub",
    subtitle: "Rent farm equipment, purchase organic inputs, and book crop transport and cold storage.",
    tab_store: "E-Marketplace",
    tab_rental: "Equipment Rental",
    tab_book: "Logistics & Booking",
    buy_btn: "Buy Now",
    book_btn: "Book Rental",
    new_book: "New Booking",
    new_book_desc: "Schedule transport or cold storage.",
    book_type: "Booking Type",
    dest: "Destination Center",
    partner: "Select Partner",
    vehicle: "Vehicle Class",
    weight: "Total Crop Weight (Tonnes)",
    duration: "Rental Duration (Days)",
    submit_btn: "Submit Booking Request",
    act_book: "Your Active Bookings",
    act_book_desc: "Monitor verification and approval of logistics requests.",
    transport: "Transit Logistics (Transport)",
    warehouse: "Warehouse & Cold Storage",
    toast_buy: "added to cart!",
    toast_rent: "Rental requested! Host notified at",
    toast_success: "Booking request submitted! Pending coordinator verification.",
    toast_time_err: "Please enter a valid time",
    toast_dur_err: "Duration must be greater than 0",
    toast_details_err: "Please enter booking details"
  },
  tamil: {
    title: "விவசாய சந்தை & போக்குவரத்து மையம்",
    subtitle: "விவசாயக் கருவிகளை வாடகைக்கு எடுக்கவும், இயற்கை உரங்கள் வாங்கவும், லாரிகள் மற்றும் கிடங்குகளை முன்பதிவு செய்யவும்.",
    tab_store: "மின்னணு சந்தை",
    tab_rental: "இயந்திரங்கள் வாடகை",
    tab_book: "போக்குவரத்து & சேமிப்பு",
    buy_btn: "வாங்கவும்",
    book_btn: "வாடகைக்கு எடு",
    new_book: "புதிய முன்பதிவு",
    new_book_desc: "போக்குவரத்து அல்லது குளிர்சாதன கிடங்கு முன்பதிவு.",
    book_type: "முன்பதிவு வகை",
    dest: "மண்டி / சேருமிடம்",
    partner: "விவசாயக் கூட்டாளர்",
    vehicle: "வாகன வகை",
    weight: "மொத்த மகசூல் எடை (டன்)",
    duration: "கிடங்கு காலம் (நாட்கள்)",
    submit_btn: "முன்பதிவு செய்ய சமர்ப்பிக்கவும்",
    act_book: "உங்களது தற்போதைய முன்பதிவுகள்",
    act_book_desc: "முன்பதிவு கோரிக்கைகளின் தற்போதைய சரிபார்ப்பு நிலை.",
    transport: "விளைச்சல் போக்குவரத்து (Transit)",
    warehouse: "கிடங்கு & குளிர்சாதன கிடங்கு",
    toast_buy: "கூடையில் சேர்க்கப்பட்டது!",
    toast_rent: "வாடகை கோரிக்கை அனுப்பப்பட்டது! தொடர்பு கொள்ள வேண்டிய எண்: ",
    toast_success: "முன்பதிவு கோரிக்கை சமர்ப்பிக்கப்பட்டது! சரிபார்ப்பில் உள்ளது.",
    toast_time_err: "சரியான நேரத்தை உள்ளிடவும்",
    toast_dur_err: "கால அளவு 0-ஐ விட அதிகமாக இருக்க வேண்டும்",
    toast_details_err: "முன்பதிவு விவரங்களை உள்ளிடவும்"
  }
};

function MarketplacePage() {
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

  const mt = translations[lang] || translations.english;

  // Tab 1: Marketplace items
  const [marketItems, setMarketItems] = useState<any[]>([]);

  // Tab 2: Equipment Rental items
  const [rentalItems, setRentalItems] = useState<any[]>([]);

  // Tab 3: Bookings Form States
  const [bookingInputs, setBookingInputs] = useState({
    type: "transport",
    destination: "Erode Wholesale Mandi",
    weight: "2.5",
    vehicle: "tata_ace",
    storageDays: "30",
  });

  const [activeBookings, setActiveBookings] = useState<any[]>([]);

  // Sync localized values and active bookings
  useEffect(() => {
    if (lang === "tamil") {
      setMarketItems([
        { id: 1, name: "தரமான நெல் விதை (CO-51)", price: "₹850 / 10 கிலோ", category: "seeds", seller: "தமிழ்நாடு விதை நிறுவனம்" },
        { id: 2, name: "கரிம பஞ்சகவ்யா இயற்கை உரம்", price: "₹250 / 5 லிட்டர்", category: "organic", seller: "ஈரோடு ஆர்கானிக்ஸ்" },
        { id: 3, name: "வேப்பம் புண்ணாக்கு உரம்", price: "₹450 / 25 கிலோ", category: "organic", seller: "ஆர்கானிக் ஃபெர்டிலைசர்ஸ்" },
        { id: 4, name: "அசோஸ்பைரில்லம் உயிர் உரம்", price: "₹180 / 1 கிலோ", category: "organic", seller: "TNAU விற்பனை நிலையம்" },
      ]);

      setRentalItems([
        { id: 1, name: "மகிந்திரா 50HP டிராக்டர் (Rotavator உடன்)", rate: "₹900 / மணிநேரம்", owner: "ரமேஷ் கே.", contact: "+91 99887 76655" },
        { id: 2, name: "பூச்சிக்கொல்லி தெளிக்கும் விவசாய ட்ரோன்", rate: "₹1,200 / ஏக்கர்", owner: "ஸ்கைஃபார்ம் ட்ரோன்ஸ்", contact: "+91 88776 65544" },
        { id: 3, name: "நெல் அறுவடை இயந்திரம் (Paddy Harvester)", rate: "₹2,500 / மணிநேரம்", owner: "செந்தில் மண்டி", contact: "+91 77665 54433" },
      ]);

      setActiveBookings([
        { id: 1, type: "போக்குவரத்து முன்பதிவு", detail: "டாடா ஏஸ் மினி லாரி - ஈரோடு மண்டிக்கு (1.2 டன்)", status: "Approved" },
        { id: 2, type: "குளிர்சாதன கிடங்கு", detail: "சேலம் குளிர்சாதன கிடங்கு #B4 - மாம்பழங்கள் (2 டன்)", status: "Pending" },
      ]);
    } else {
      setMarketItems([
        { id: 1, name: "Premium Paddy Seed Kit (CO-51)", price: "₹850 / 10 kg", category: "seeds", seller: "TN Seeds Co." },
        { id: 2, name: "Organic Panchagavya Fertilizer", price: "₹250 / 5 Litre", category: "organic", seller: "Erode Organics" },
        { id: 3, name: "Neem Cake Manure Powder", price: "₹450 / 25 kg", category: "organic", seller: "Organic Fertilisers" },
        { id: 4, name: "Azospirillum Bio-fertiliser", price: "₹180 / 1 kg", category: "organic", seller: "TNAU Depot" },
      ]);

      setRentalItems([
        { id: 1, name: "Mahindra 50HP Tractor with Rotavator", rate: "₹900 / Hour", owner: "Ramesh K.", contact: "+91 99887 76655" },
        { id: 2, name: "Agricultural Fertilizer Spraying Drone", rate: "₹1,200 / Acre", owner: "SkyFarm Drones", contact: "+91 88776 65544" },
        { id: 3, name: "Paddy Harvester Combine", rate: "₹2,500 / Hour", owner: "Senthil Mandi", contact: "+91 77665 54433" },
      ]);

      setActiveBookings([
        { id: 1, type: "Logistics Booking", detail: "Tata Ace booking to Erode Mandi (1.2 Tonnes)", status: "Approved" },
        { id: 2, type: "Cold Storage Slot", detail: "Salem Cold Storage Slot #B4 for Mangoes (2 Tons)", status: "Pending" },
      ]);
    }
  }, [lang]);

  // Dynamic admin-registered partners state
  const [partners, setPartners] = useState<PartnerRecord[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("admin_partners");
    if (saved) {
      const parsed: PartnerRecord[] = JSON.parse(saved);
      setPartners(parsed);
      
      const targetType = bookingInputs.type === "transport" ? "logistics" : "storage";
      const matched = parsed.filter((p) => p.type === targetType);
      if (matched.length > 0) {
        setSelectedPartnerId(matched[0].id);
      } else {
        setSelectedPartnerId("");
      }
    }
  }, [bookingInputs.type]);

  const handleBooking = () => {
    let detail = "";
    const activePartner = partners.find((p) => p.id === selectedPartnerId);
    const partnerStr = activePartner ? `${activePartner.name} (Rate: ${activePartner.rate})` : (lang === "tamil" ? "சாதாரண ஆப்பரேட்டர்" : "Standard Operator");

    if (bookingInputs.type === "transport") {
      const vName = bookingInputs.vehicle === "tata_ace" 
        ? (lang === "tamil" ? "டாடா ஏஸ் மினி லாரி" : "Tata Ace Mini Truck") 
        : (lang === "tamil" ? "ஐஷர் 14 அடி லாரி" : "Eicher 14ft Lorry");
      detail = `${vName} via ${partnerStr} to ${bookingInputs.destination} (${bookingInputs.weight} ${lang === "tamil" ? "டன்" : "Tonnes"})`;
    } else {
      detail = `${lang === "tamil" ? "கிடங்கு முன்பதிவு:" : "Dry Warehouse space booked with"} ${partnerStr} ${lang === "tamil" ? "கால அளவு:" : "for"} ${bookingInputs.storageDays} ${lang === "tamil" ? "நாட்கள், இடம்:" : "Days at"} ${bookingInputs.destination}`;
    }

    const newBooking = {
      id: Date.now(),
      type: bookingInputs.type === "transport" 
        ? (lang === "tamil" ? "போக்குவரத்து முன்பதிவு" : "Logistics Booking") 
        : (lang === "tamil" ? "குளிர்சாதன கிடங்கு" : "Warehouse Slot"),
      detail,
      status: "Pending",
    };

    setActiveBookings((p) => [newBooking, ...p]);
    toast.success(mt.toast_success);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
          <ShoppingBag className="h-6 w-6 text-green-700" />
          {mt.title}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {mt.subtitle}
        </p>
      </div>

      <Tabs defaultValue="shop" className="w-full">
        <TabsList className="flex flex-wrap h-auto w-fit max-w-full bg-green-100/40 border border-green-200/30 p-1.5 gap-1.5 sm:gap-2 rounded-2xl mb-6">
          <TabsTrigger 
            value="shop" 
            className="rounded-xl text-xs sm:text-sm px-4 py-2.5 font-bold transition-all duration-200 text-slate-600 hover:text-green-800 hover:bg-white/40 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-transparent"
          >
            {mt.tab_store}
          </TabsTrigger>
          <TabsTrigger 
            value="rental" 
            className="rounded-xl text-xs sm:text-sm px-4 py-2.5 font-bold transition-all duration-200 text-slate-600 hover:text-green-800 hover:bg-white/40 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-transparent"
          >
            {mt.tab_rental}
          </TabsTrigger>
          <TabsTrigger 
            value="logistics" 
            className="rounded-xl text-xs sm:text-sm px-4 py-2.5 font-bold transition-all duration-200 text-slate-600 hover:text-green-800 hover:bg-white/40 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-transparent"
          >
            {mt.tab_book}
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: SHOP */}
        <TabsContent value="shop" className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {marketItems.map((item) => (
              <Card key={item.id} className="rounded-2xl border border-green-50 bg-white hover:border-green-600 transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center text-left">
                    <span className="text-[10px] bg-green-50 border border-green-100 text-green-800 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                      {lang === "tamil" 
                        ? (item.category === "seeds" ? "விதை" : "இயற்கை உரம்") 
                        : item.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{lang === "tamil" ? "விற்பனையாளர்:" : "Seller:"} {item.seller}</span>
                  </div>
                  <CardTitle className="text-sm font-bold text-foreground mt-1.5 text-left">{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4 pt-1 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-green-700">{item.price}</span>
                  <Button 
                    onClick={() => toast.success(`${item.name} ${mt.toast_buy}`)}
                    size="sm" 
                    className="bg-green-700 hover:bg-green-800 text-white rounded-lg text-xs"
                  >
                    {mt.buy_btn}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 2: EQUIPMENT RENTAL */}
        <TabsContent value="rental" className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {rentalItems.map((item) => (
              <Card key={item.id} className="rounded-2xl border border-slate-100 bg-white hover:border-green-600 transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center text-left">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <HardHat className="h-3.5 w-3.5 text-orange-500" />
                      {lang === "tamil" ? "உரிமையாளர்:" : "Host:"} {item.owner}
                    </span>
                  </div>
                  <CardTitle className="text-sm font-bold text-foreground mt-1.5 text-left">{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4 pt-1 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-green-700">{item.rate}</span>
                  <Button 
                    onClick={() => toast.success(`${mt.toast_rent} ${item.contact}`)}
                    size="sm" 
                    className="bg-green-700 hover:bg-green-800 text-white rounded-lg text-xs"
                  >
                    {mt.book_btn}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 3: LOGISTICS & STORAGE */}
        <TabsContent value="logistics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Booking Form */}
            <Card className="rounded-2xl border-green-100/50 shadow-sm bg-white md:col-span-1">
              <CardHeader>
                <CardTitle className="text-base font-bold">{mt.new_book}</CardTitle>
                <CardDescription className="text-xs">{mt.new_book_desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{mt.book_type}</Label>
                  <Select
                    value={bookingInputs.type}
                    onValueChange={(val) => setBookingInputs((p) => ({ ...p, type: val }))}
                  >
                    <SelectTrigger className="rounded-xl border-green-100">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transport">{mt.transport}</SelectItem>
                      <SelectItem value="warehouse">{mt.warehouse}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{mt.dest}</Label>
                  <Select
                    value={bookingInputs.destination}
                    onValueChange={(val) => setBookingInputs((p) => ({ ...p, destination: val }))}
                  >
                    <SelectTrigger className="rounded-xl border-green-100">
                      <SelectValue placeholder="Destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Erode Wholesale Mandi">{lang === "tamil" ? "ஈரோடு மண்டி" : "Erode Wholesale Mandi"}</SelectItem>
                      <SelectItem value="Coimbatore Central Yard">{lang === "tamil" ? "கோவை மத்திய கிடங்கு" : "Coimbatore Central Yard"}</SelectItem>
                      <SelectItem value="Salem Cold Storage Ltd">{lang === "tamil" ? "சேலம் குளிர்சாதன கிடங்கு" : "Salem Cold Storage Ltd"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dynamic Admin-registered Partners select block */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{mt.partner}</Label>
                  <Select
                    value={selectedPartnerId}
                    onValueChange={(val) => setSelectedPartnerId(val)}
                  >
                    <SelectTrigger className="rounded-xl border-green-100">
                      <SelectValue placeholder="Available Partners" />
                    </SelectTrigger>
                    <SelectContent>
                      {partners
                        .filter((p) => p.type === (bookingInputs.type === "transport" ? "logistics" : "storage"))
                        .map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} ({p.rate})
                          </SelectItem>
                        ))}
                      {partners.filter((p) => p.type === (bookingInputs.type === "transport" ? "logistics" : "storage")).length === 0 && (
                        <SelectItem value="none" disabled>
                          {lang === "tamil" ? "கூட்டாளர்கள் யாரும் பதிவு செய்யப்படவில்லை" : "No active partners registered"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {bookingInputs.type === "transport" ? (
                  <>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">{mt.vehicle}</Label>
                      <Select
                        value={bookingInputs.vehicle}
                        onValueChange={(val) => setBookingInputs((p) => ({ ...p, vehicle: val }))}
                      >
                        <SelectTrigger className="rounded-xl border-green-100">
                          <SelectValue placeholder="Vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tata_ace">{lang === "tamil" ? "டாடா ஏஸ் (அதிகபட்சம் 1.5 டன்)" : "Tata Ace Mini Truck (Max 1.5 Tons)"}</SelectItem>
                          <SelectItem value="eicher">{lang === "tamil" ? "ஐஷர் லாரி (அதிகபட்சம் 5 டன்)" : "Eicher 14ft Truck (Max 5 Tons)"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground">{mt.weight}</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={bookingInputs.weight}
                        onChange={(e) => setBookingInputs((p) => ({ ...p, weight: e.target.value }))}
                        className="rounded-xl border-green-100 focus-visible:ring-green-600"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">{mt.duration}</Label>
                    <Input
                      type="number"
                      value={bookingInputs.storageDays}
                      onChange={(e) => setBookingInputs((p) => ({ ...p, storageDays: e.target.value }))}
                      className="rounded-xl border-green-100 focus-visible:ring-green-600"
                    />
                  </div>
                )}

                <Button
                  onClick={handleBooking}
                  className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-5 shadow-lg shadow-green-700/10 font-semibold"
                >
                  {mt.submit_btn}
                </Button>
              </CardContent>
            </Card>

            {/* Bookings Status Lists */}
            <Card className="rounded-2xl border-green-100/50 shadow-sm bg-white md:col-span-2">
              <CardHeader className="text-left">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Truck className="h-5 w-5 text-green-700" />
                  {mt.act_book}
                </CardTitle>
                <CardDescription className="text-xs">{mt.act_book_desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3.5 pb-6 text-left">
                {activeBookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl bg-slate-50/30">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-green-700 font-bold block uppercase tracking-wider">{b.type}</span>
                      <p className="text-xs font-semibold text-foreground">{b.detail}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      b.status === "Approved"
                        ? "bg-green-100 border border-green-200 text-green-800"
                        : "bg-amber-100 border border-amber-200 text-amber-800"
                    }`}>
                      {b.status === "Approved" && <CheckCircle className="h-3 w-3" />}
                      {b.status === "Approved" ? (lang === "tamil" ? "அங்கீகரிக்கப்பட்டது" : "Approved") : (lang === "tamil" ? "காத்திருக்கிறது" : "Pending")}
                    </span>
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
