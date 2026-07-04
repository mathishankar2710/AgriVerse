import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Sprout, ShoppingBag, RefreshCw, Scale } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/productivity")({
  component: ProductivityPage,
});

function ProductivityPage() {
  // 1. Yield Estimator state
  const [area, setArea] = useState<number>(5);
  const [areaUnit, setAreaUnit] = useState<string>("acres");
  const [cropType, setCropType] = useState<string>("wheat");
  const [seedVariety, setSeedVariety] = useState<string>("hybrid");
  const [rainfall, setRainfall] = useState<string>("average");
  const [yieldResult, setYieldResult] = useState<number | null>(null);

  // 2. NPK Calculator state
  const [nLevel, setNLevel] = useState<string>("medium");
  const [pLevel, setPLevel] = useState<string>("low");
  const [kLevel, setKLevel] = useState<string>("medium");
  const [npkResult, setNpkResult] = useState<{ urea: number; dap: number; mop: number } | null>(null);

  // 3. Unit Converter state
  const [convVal, setConvVal] = useState<number>(1);
  const [convType, setConvType] = useState<string>("acre_hectare");
  const [convResult, setConvResult] = useState<number | null>(null);

  const calculateYield = () => {
    let baseYield = 15; // Quintals per acre base for wheat
    if (cropType === "rice") baseYield = 22;
    if (cropType === "potato") baseYield = 80;
    if (cropType === "cotton") baseYield = 8;

    let multiplier = 1.0;
    if (seedVariety === "hybrid") multiplier *= 1.25;
    if (rainfall === "high") multiplier *= 1.1;
    if (rainfall === "low") multiplier *= 0.7;

    const areaInAcres = areaUnit === "hectares" ? area * 2.471 : area;
    const finalYield = areaInAcres * baseYield * multiplier;

    setYieldResult(Math.round(finalYield * 10) / 10);
    toast.success("Yield projection calculated");
  };

  const calculateNPK = () => {
    // Recommend fertilizer bags (50kg each) per acre based on soil NPK levels
    let urea = 2.5; // Urea bags
    let dap = 1.5;  // DAP bags
    let mop = 1.0;  // MOP bags

    if (nLevel === "low") urea += 1.0;
    if (nLevel === "high") urea -= 1.0;

    if (pLevel === "low") dap += 0.8;
    if (pLevel === "high") dap -= 0.8;

    if (kLevel === "low") mop += 0.5;
    if (kLevel === "high") mop -= 0.5;

    setNpkResult({
      urea: Math.max(0, Math.round(urea * 10) / 10),
      dap: Math.max(0, Math.round(dap * 10) / 10),
      mop: Math.max(0, Math.round(mop * 10) / 10),
    });
    toast.success("Fertilizer recommendations calculated");
  };

  const handleConvert = () => {
    let result = 0;
    if (convType === "acre_hectare") result = convVal * 0.4046;
    else if (convType === "hectare_acre") result = convVal * 2.471;
    else if (convType === "quintal_kg") result = convVal * 100;
    else if (convType === "kg_quintal") result = convVal * 0.01;
    
    setConvResult(Math.round(result * 1000) / 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
          <Calculator className="h-6 w-6 text-green-700 animate-pulse" />
          Productivity Calculators
        </h1>
        <p className="text-xs text-muted-foreground">
          Access specialized utility tools to estimate expected yield sizes, calculate fertilizer ratios, and convert agricultural units.
        </p>
      </div>

      <Tabs defaultValue="yield" className="w-full">
        <TabsList className="grid grid-cols-3 w-full bg-green-50/50 p-1 rounded-xl mb-6">
          <TabsTrigger value="yield" className="rounded-lg text-xs py-2 data-[state=active]:bg-white data-[state=active]:text-green-800 transition-all font-semibold">
            Yield Estimator
          </TabsTrigger>
          <TabsTrigger value="npk" className="rounded-lg text-xs py-2 data-[state=active]:bg-white data-[state=active]:text-green-800 transition-all font-semibold">
            NPK Fertilizer
          </TabsTrigger>
          <TabsTrigger value="converter" className="rounded-lg text-xs py-2 data-[state=active]:bg-white data-[state=active]:text-green-800 transition-all font-semibold">
            Unit Converter
          </TabsTrigger>
        </TabsList>

        {/* 1. Yield Estimator Content */}
        <TabsContent value="yield" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl border-green-100/50 bg-white shadow-sm p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Area Size</Label>
                  <Input 
                    type="number" 
                    value={area} 
                    onChange={(e) => setArea(parseFloat(e.target.value) || 0)} 
                    className="rounded-xl border-green-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Area Unit</Label>
                  <Select value={areaUnit} onValueChange={setAreaUnit}>
                    <SelectTrigger className="rounded-xl border-green-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="acres">Acres</SelectItem>
                      <SelectItem value="hectares">Hectares</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Crop Type</Label>
                <Select value={cropType} onValueChange={setCropType}>
                  <SelectTrigger className="rounded-xl border-green-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="rice">Rice (Paddy)</SelectItem>
                    <SelectItem value="cotton">Cotton</SelectItem>
                    <SelectItem value="potato">Potato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Seed Variety</Label>
                <Select value={seedVariety} onValueChange={setSeedVariety}>
                  <SelectTrigger className="rounded-xl border-green-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="standard">Standard / Desi</SelectItem>
                    <SelectItem value="hybrid">High-Yielding Hybrid (HYV)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Season Rainfall</Label>
                <Select value={rainfall} onValueChange={setRainfall}>
                  <SelectTrigger className="rounded-xl border-green-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="low">Low / Drought conditions</SelectItem>
                    <SelectItem value="average">Normal / Average Rain</SelectItem>
                    <SelectItem value="high">High / Surplus Rain</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={calculateYield}
                className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-5 shadow-lg shadow-green-700/10 font-semibold text-xs mt-2"
              >
                Estimate Yield Output
              </Button>
            </Card>

            <Card className="rounded-2xl border-green-100/50 bg-white shadow-sm p-5 flex flex-col items-center justify-center text-center">
              {yieldResult !== null ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-green-50 p-4 rounded-full text-green-700 inline-block">
                    <Sprout className="h-10 w-10 text-green-600 animate-bounce" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Estimated Tonnage</span>
                    <p className="text-3xl font-extrabold text-green-800">{yieldResult} Quintals</p>
                    <p className="text-[10px] text-muted-foreground">({Math.round((yieldResult * 100) * 10) / 100} kg total harvest)</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground max-w-xs leading-relaxed">
                    This estimation is based on regional crop averages. Maintain optimal soil moisture and NPK application to target this estimate.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-slate-50 p-4 rounded-full text-slate-400 inline-block">
                    <Sprout className="h-8 w-8 text-slate-400" />
                  </div>
                  <div className="max-w-xs">
                    <p className="text-xs font-semibold text-foreground">Waiting for Parameters</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Fill out your land size, seed type, and rainfall stats to calculate estimated yield outputs.</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* 2. NPK Calculator Content */}
        <TabsContent value="npk" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl border-green-100/50 bg-white shadow-sm p-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Soil Nitrogen (N)</Label>
                <Select value={nLevel} onValueChange={setNLevel}>
                  <SelectTrigger className="rounded-xl border-green-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="low">Low (Deficient)</SelectItem>
                    <SelectItem value="medium">Medium (Adequate)</SelectItem>
                    <SelectItem value="high">High (Rich)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Soil Phosphorus (P)</Label>
                <Select value={pLevel} onValueChange={setPLevel}>
                  <SelectTrigger className="rounded-xl border-green-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="low">Low (Deficient)</SelectItem>
                    <SelectItem value="medium">Medium (Adequate)</SelectItem>
                    <SelectItem value="high">High (Rich)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Soil Potassium (K)</Label>
                <Select value={kLevel} onValueChange={setKLevel}>
                  <SelectTrigger className="rounded-xl border-green-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="low">Low (Deficient)</SelectItem>
                    <SelectItem value="medium">Medium (Adequate)</SelectItem>
                    <SelectItem value="high">High (Rich)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={calculateNPK}
                className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-5 shadow-lg shadow-green-700/10 font-semibold text-xs mt-2"
              >
                Calculate Fertilizer Needs
              </Button>
            </Card>

            <Card className="rounded-2xl border-green-100/50 bg-white shadow-sm p-5 flex flex-col justify-center">
              {npkResult ? (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-bold text-green-950 text-center">Recommended Application (Per Acre)</h3>
                  
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center p-3 border border-slate-100 rounded-xl">
                      <div>
                        <span className="text-xs font-bold text-foreground">Urea (Nitrogen Source)</span>
                        <p className="text-[10px] text-muted-foreground">Urea 46% Nitrogen</p>
                      </div>
                      <span className="text-sm font-extrabold text-green-700">{npkResult.urea} Bags</span>
                    </div>

                    <div className="flex justify-between items-center p-3 border border-slate-100 rounded-xl">
                      <div>
                        <span className="text-xs font-bold text-foreground">DAP (Phosphorus & Nitrogen)</span>
                        <p className="text-[10px] text-muted-foreground">Diammonium Phosphate</p>
                      </div>
                      <span className="text-sm font-extrabold text-green-700">{npkResult.dap} Bags</span>
                    </div>

                    <div className="flex justify-between items-center p-3 border border-slate-100 rounded-xl">
                      <div>
                        <span className="text-xs font-bold text-foreground">MOP (Potash Source)</span>
                        <p className="text-[10px] text-muted-foreground">Muriate of Potash</p>
                      </div>
                      <span className="text-sm font-extrabold text-green-700">{npkResult.mop} Bags</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-muted-foreground text-center">*(1 Bag = 50kg standard fertilizer bag)</p>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="bg-slate-50 p-4 rounded-full text-slate-400 inline-block">
                    <ShoppingBag className="h-8 w-8 text-slate-400" />
                  </div>
                  <div className="max-w-xs mx-auto">
                    <p className="text-xs font-semibold text-foreground">Waiting for Soil Tests</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Input your soil Nitrogen, Phosphorus, and Potassium levels to compute standard fertilizer bag requirements.</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* 3. Unit Converter Content */}
        <TabsContent value="converter" className="space-y-4">
          <Card className="rounded-2xl border-green-100/50 bg-white shadow-sm p-5 max-w-md mx-auto space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Value to Convert</Label>
                <Input 
                  type="number" 
                  value={convVal} 
                  onChange={(e) => { setConvVal(parseFloat(e.target.value) || 0); setConvResult(null); }} 
                  className="rounded-xl border-green-100"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Conversion Type</Label>
                <Select value={convType} onValueChange={(val) => { setConvType(val); setConvResult(null); }}>
                  <SelectTrigger className="rounded-xl border-green-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="acre_hectare">Acres to Hectares</SelectItem>
                    <SelectItem value="hectare_acre">Hectares to Acres</SelectItem>
                    <SelectItem value="quintal_kg">Quintals to Kilograms</SelectItem>
                    <SelectItem value="kg_quintal">Kilograms to Quintals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleConvert}
              className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-5 shadow-lg shadow-green-700/10 font-semibold text-xs"
            >
              Convert Units
            </Button>

            {convResult !== null && (
              <div className="bg-green-50/50 border border-green-100/40 p-4 rounded-xl text-center space-y-1 animate-fade-in">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Converted Output</span>
                <p className="text-xl font-extrabold text-green-800 flex items-center justify-center gap-1.5">
                  <Scale className="h-5 w-5 text-green-700" />
                  {convResult} {convType.split("_")[1]}
                </p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
