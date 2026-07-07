import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { callAgent } from "@/lib/agents.functions";
import { MessageSquareCode, Send, RefreshCw, Sparkles, User, Bot, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/chatbot")({
  component: ChatbotPage,
});

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

const botTranslations: Record<string, Record<string, any>> = {
  english: {
    title: "AI Smart Farming Assistant",
    description: "Your localized agronomist bot for diagnosing diseases, NPK schedules, and crop rotation advices.",
    bot_intro: "Hello! I am your AI Smart Farming Assistant. Ask me anything about crop optimization, fertilizers, pest control, weather-adaptive sowing, or IoT controls.",
    input_placeholder: "Ask Agri Agent anything...",
    quick_suggestions: [
      "How to treat leaf spot in tomatoes?",
      "What crops grow best in black soil during winter?",
      "Calculate NPK ratio for potato growth stage.",
      "Create a low-cost drip irrigation layout.",
    ],
    thinking: "Thinking..."
  },
  tamil: {
    title: "AI விவசாய உதவியாளர்",
    description: "மண் பரிசோதனை, உரம் கணக்கீடு, பயிர் நோய்கள் மற்றும் பிற விவசாய சந்தேகங்களுக்கு தீர்வு காணுங்கள்.",
    bot_intro: "வணக்கம்! நான் உங்கள் அக்ரி ஏஜென்ட் AI உதவியாளர். உர அளவு, பயிர் பாதுகாப்பு, வானிலை மாற்றங்கள் அல்லது மோட்டார் பம்ப் கட்டுப்பாடு பற்றி என்னிடம் கேளுங்கள்.",
    input_placeholder: "விவசாய கேள்விகளை இங்கே கேட்கவும்...",
    quick_suggestions: [
      "தக்காளி இலையில் கரும்புள்ளி நோய் தீர்வு என்ன?",
      "குளிர்காலத்தில் கரிசல் மண்ணுக்கு ஏற்ற பயிர்கள் யாவை?",
      "உருளைக்கிழங்கிற்கான NPK உரம் கணக்கிடுக.",
      "குறைந்த செலவில் சொட்டு நீர் பாசனம் அமைப்பது எப்படி?",
    ],
    thinking: "சிந்திக்கிறது..."
  }
};

function ChatbotPage() {
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

  const bt = botTranslations[lang] || botTranslations.english;

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: bt.bot_intro,
      timestamp: new Date(),
    },
  ]);

  // Sync intro message if language updates while chat is clean
  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === "bot") {
      setMessages([
        {
          sender: "bot",
          text: bt.bot_intro,
          timestamp: new Date(),
        }
      ]);
    }
  }, [lang]);

  const [input, setInput] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const agentCallFn = useServerFn(callAgent);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    // Add user message
    const userMsg: Message = { sender: "user", text: trimmed, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      // Execute Groq call via server function
      const res = await agentCallFn({
        data: {
          agentType: "chatbot",
          inputs: { query: trimmed },
          language: lang
        }
      });
      
      const botMsg: Message = {
        sender: "bot",
        text: res?.output || "I'm sorry, I encountered an issue compiling the response.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
      toast.error("Failed to communicate with Agri Agent agronomist agent");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left h-[calc(100vh-140px)] flex flex-col">
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
          <MessageSquareCode className="h-6 w-6 text-green-700" />
          {bt.title}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {bt.description}
        </p>
      </div>

      <Card className="rounded-2xl border-green-100/50 shadow-sm bg-white flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scrollbar-thin">
          {messages.map((m, idx) => {
            const isUser = m.sender === "user";
            return (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                  isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                } animate-fade-in`}
              >
                {/* Avatar Icon */}
                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                    isUser ? "bg-green-700 text-white" : "bg-white border border-green-100 text-green-700"
                  }`}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-3 text-xs leading-relaxed ${
                    isUser
                      ? "bg-green-700 text-white shadow-md shadow-green-700/5 rounded-tr-none"
                      : "bg-white border border-green-50 text-foreground shadow-sm rounded-tl-none"
                  }`}
                >
                  <div className="whitespace-pre-wrap prose prose-sm max-w-none text-left">
                    {/* Parse simple markdown tags like lists and bold */}
                    {m.text.split("\n").map((line, lineIdx) => {
                      if (line.startsWith("- ") || line.startsWith("* ")) {
                        return <li key={lineIdx} className="ml-3 list-disc">{line.substring(2)}</li>;
                      }
                      if (line.match(/^\d+\.\s/)) {
                        return <li key={lineIdx} className="ml-3 list-decimal">{line.replace(/^\d+\.\s/, "")}</li>;
                      }
                      // Handle bold
                      if (line.includes("**")) {
                        const parts = line.split("**");
                        return (
                          <p key={lineIdx} className="mb-1">
                            {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-extrabold">{p}</strong> : p)}
                          </p>
                        );
                      }
                      return <p key={lineIdx} className="mb-1">{line}</p>;
                    })}
                  </div>
                  <span
                    className={`block text-[9px] text-right mt-1.5 ${
                      isUser ? "text-green-200/80" : "text-muted-foreground/60"
                    }`}
                  >
                    {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            );
          })}

          {sending && (
            <div className="flex gap-3 mr-auto max-w-[75%] items-center animate-pulse">
              <div className="h-8 w-8 rounded-xl bg-white border border-green-100 text-green-700 flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-white border border-green-50 rounded-2xl rounded-tl-none p-3 text-xs text-muted-foreground flex items-center gap-1.5 shadow-sm">
                <RefreshCw className="h-3 w-3 animate-spin text-green-600" />
                {bt.thinking}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input & Quick Reply Area */}
        <div className="border-t border-green-50/60 p-3 bg-white flex-shrink-0">
          {/* Smart Suggestion Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-2.5 scrollbar-thin">
            {bt.quick_suggestions.map((prompt: string, idx: number) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={sending}
                className="text-[10px] bg-green-50/50 hover:bg-green-50 border border-green-100/50 hover:border-green-200/50 text-green-800 px-3 py-1.5 rounded-full flex items-center gap-1 flex-shrink-0 transition-colors cursor-pointer"
              >
                <Sparkles className="h-3 w-3 text-green-600 flex-shrink-0" />
                {prompt}
              </button>
            ))}
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex gap-2 items-center"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={bt.input_placeholder}
              disabled={sending}
              className="flex-1 rounded-xl border-green-100 focus-visible:ring-green-600 py-5 text-xs shadow-inner"
            />
            <Button
              type="submit"
              disabled={sending || !input.trim()}
              className="h-10 w-10 rounded-xl bg-green-700 hover:bg-green-800 text-white flex items-center justify-center p-0 shadow-lg shadow-green-700/10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
