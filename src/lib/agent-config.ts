import cropImg from "@/assets/agent-crop.jpg";
import weatherImg from "@/assets/agent-weather.jpg";
import fertilizerImg from "@/assets/agent-fertilizer.jpg";
import pestImg from "@/assets/agent-pest.jpg";
import irrigationImg from "@/assets/agent-irrigation.jpg";

export type AgentField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select";
  options?: string[];
  required?: boolean;
  placeholder?: string;
};

export type AgentConfig = {
  slug: string;
  title: string;
  description: string;
  image: string;
  fields: AgentField[];
};

export const AGENTS: Record<string, AgentConfig> = {
  crop: {
    slug: "crop",
    title: "Crop Recommendation Agent",
    description: "Suggests suitable crops based on your soil, region, and season.",
    image: cropImg,
    fields: [
      { name: "soil_type", label: "Soil type", type: "text", required: true, placeholder: "e.g. loamy, clay, sandy" },
      { name: "region", label: "Region / location", type: "text", required: true, placeholder: "e.g. Punjab, India" },
      { name: "season", label: "Season", type: "select", required: true, options: ["Spring", "Summer", "Monsoon", "Autumn", "Winter"] },
      { name: "temperature", label: "Current temperature (optional)", type: "text", placeholder: "e.g. 30°C (auto-filled if location selected)" },
      { name: "humidity", label: "Relative humidity (optional)", type: "text", placeholder: "e.g. 70%" },
      { name: "rainfall", label: "Recent rainfall / moisture (optional)", type: "text", placeholder: "e.g. Moderate" },
    ],
  },
  weather: {
    slug: "weather",
    title: "Weather Advisory Agent",
    description: "Gives weather-based farming advice for your location.",
    image: weatherImg,
    fields: [
      { name: "location", label: "Location", type: "text", required: true, placeholder: "City, State/Country" },
      { name: "current_crop", label: "Current crop (optional)", type: "text", placeholder: "e.g. wheat" },
    ],
  },
  fertilizer: {
    slug: "fertilizer",
    title: "Fertilizer Recommendation Agent",
    description: "Recommends fertilizer for your crop, soil, and growth stage.",
    image: fertilizerImg,
    fields: [
      { name: "crop_type", label: "Crop type", type: "text", required: true },
      { name: "soil_type", label: "Soil type", type: "text", required: true },
      { name: "growth_stage", label: "Growth stage", type: "select", required: true, options: ["Seedling", "Vegetative", "Flowering", "Fruiting", "Maturity"] },
    ],
  },
  pest: {
    slug: "pest",
    title: "Pest Detection Agent",
    description: "Describe symptoms of your crop/leaf to identify pests or diseases and get treatment suggestions.",
    image: pestImg,
    fields: [
      { name: "crop_type", label: "Crop type", type: "text", required: true, placeholder: "e.g. tomato" },
      { name: "symptoms", label: "Observed symptoms", type: "textarea", required: true, placeholder: "e.g. yellow spots on leaves, wilting, holes in fruit..." },
    ],
  },
  irrigation: {
    slug: "irrigation",
    title: "Irrigation Scheduling Agent",
    description: "Recommends a watering schedule for your crop and conditions.",
    image: irrigationImg,
    fields: [
      { name: "crop_type", label: "Crop type", type: "text", required: true },
      { name: "soil_type", label: "Soil type", type: "text", required: true },
      { name: "region", label: "Region", type: "text", required: true },
      { name: "season", label: "Season", type: "select", required: true, options: ["Spring", "Summer", "Monsoon", "Autumn", "Winter"] },
    ],
  },
};

export const AGENT_LIST = Object.values(AGENTS);
