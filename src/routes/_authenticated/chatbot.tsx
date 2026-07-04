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

const SMART_PROMPTS = [
  "How to treat leaf spot in tomatoes?",
  "What crops grow best in black soil during winter?",
  "Calculate NPK ratio for potato growth stage.",
  "Create a low-cost drip irrigation layout.",
];

function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I am your AI Smart Farming Assistant. Ask me anything about crop optimization, fertilizers, pest control, weather-adaptive sowing, or IoT controls.",
      timestamp: new Date(),
    },
  ]);
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
          inputs: { query: trimmed }
        }
      });
      
      const botMsg: Message = {
        sender: "bot",
        text: res.output,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch response. Using offline assistant...");
      
      // Fallback response if API fails
      setTimeout(() => {
        const botMsg: Message = {
          sender: "bot",
          text: "I am having trouble connecting to my central brain. Please check your internet connection or verify your API keys. \n\n*Quick tip: For crop recommendations, you can also use our specialized Crop Recommendation agent in the dashboard!*",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 1000);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex-shrink-0">
        <h1 className="text-xl font-bold flex items-center gap-2 text-foreground">
          <MessageSquareCode className="h-5 w-5 text-green-700 animate-pulse" />
          AI Smart Farming Assistant Chatbot
        </h1>
        <p className="text-[11px] text-muted-foreground">
          Get real-time agronomy diagnostics, crop schedules, and advice powered by Groq llama-3.3-70b.
        </p>
      </div>

      {/* Main Chat Container */}
      <Card className="flex-1 rounded-2xl border-green-100/50 shadow-sm bg-white overflow-hidden flex flex-col min-h-0">
        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 min-h-0 bg-slate-50/30">
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
                Thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input & Quick Reply Area */}
        <div className="border-t border-green-50/60 p-3 bg-white flex-shrink-0">
          {/* Smart Suggestion Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-2.5 scrollbar-thin">
            {SMART_PROMPTS.map((prompt, idx) => (
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
              placeholder="Ask AgriVerse anything..."
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
