"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { LayoutGrid, Code2, BookOpen, BrainCircuit, Calendar, Layers } from "lucide-react";

const TABS = [
  { id: "today", label: "Today", icon: LayoutGrid },
  { id: "cpp", label: "C++", icon: Code2 },
  { id: "leetcode", label: "LeetCode", icon: Layers },
  { id: "books", label: "Books", icon: BookOpen },
  { id: "quiz", label: "Quiz", icon: BrainCircuit },
  { id: "timeline", label: "Timeline", icon: Calendar },
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [activeTab, setActiveTab] = useState("today");
  
  // Progress state (placeholder for now)
  const [progress, setProgress] = useState(12); // e.g. 12%

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full text-[#555]">LOADING...</div>;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <form onSubmit={handleLogin} className="flex flex-col gap-4 border border-[#333] p-8 bg-[#111]">
          <h1 className="text-xl font-bold tracking-widest uppercase text-white mb-4">Stereoheart // Auth</h1>
          <input 
            type="email" 
            placeholder="EMAIL" 
            className="bg-[#0a0a0a] border border-[#333] text-white px-4 py-2 focus:outline-none focus:border-[#555] placeholder-[#555]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="PASSWORD" 
            className="bg-[#0a0a0a] border border-[#333] text-white px-4 py-2 focus:outline-none focus:border-[#555] placeholder-[#555]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="bg-[#222] border border-[#333] hover:bg-[#333] text-white px-4 py-2 transition-colors uppercase tracking-widest text-sm mt-4">
            Access Terminal
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 2px Gradient Progress Bar */}
      <div className="h-[2px] w-full bg-[#111] shrink-0">
        <div 
          className="h-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6]" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <header className="border-b border-[#222] p-4 flex justify-between items-center bg-[#0a0a0a] shrink-0">
        <h1 className="text-white font-bold tracking-widest uppercase flex items-center gap-2">
          <span className="text-[#3b82f6]">▶</span> Stereoheart
        </h1>
        <button 
          onClick={() => supabase.auth.signOut()}
          className="text-[#555] hover:text-white transition-colors text-sm uppercase tracking-widest"
        >
          Disconnect
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Tabs */}
        <aside className="w-64 border-r border-[#222] bg-[#0a0a0a] p-4 flex flex-col gap-2 overflow-y-auto shrink-0">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-sm tracking-wide transition-colors text-left border ${
                  isActive 
                    ? "bg-[#111] border-[#333] text-white" 
                    : "border-transparent text-[#555] hover:bg-[#111] hover:text-[#aaa]"
                }`}
              >
                <Icon size={16} className={isActive ? "text-[#8b5cf6]" : "text-[#555]"} />
                {tab.label.toUpperCase()}
              </button>
            )
          })}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto bg-[#0a0a0a]">
          <div className="max-w-5xl mx-auto">
            {activeTab === "today" && <TodayTab />}
            {activeTab === "cpp" && <div className="text-[#555]">C++ CURRICULUM MODULE...</div>}
            {activeTab === "leetcode" && <div className="text-[#555]">LEETCODE MODULE...</div>}
            {activeTab === "books" && <div className="text-[#555]">BOOKS MODULE...</div>}
            {activeTab === "quiz" && <QuizTerminal />}
            {activeTab === "timeline" && <div className="text-[#555]">TIMELINE LOGS...</div>}
          </div>
        </main>
      </div>
    </div>
  );
}

function TodayTab() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl text-white uppercase tracking-widest">Today's Directive</h2>
      <div className="grid grid-cols-4 gap-4">
        <LaneCard title="Building" status="ACTIVE" color="text-[#3b82f6]" />
        <LaneCard title="LeetCode" status="CLEAN" color="text-green-500" />
        <LaneCard title="C++" status="PENDING" color="text-amber-500" />
        <LaneCard title="Spaced Rep" status="DUE" color="text-[#8b5cf6]" />
      </div>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="border border-[#222] bg-[#111] p-6 space-y-4">
          <h3 className="text-[#aaa] uppercase tracking-widest text-sm mb-4">C++ Week 1: Memory Model</h3>
          <textarea 
            className="w-full bg-[#0a0a0a] border border-[#333] p-4 text-white focus:outline-none focus:border-[#555] h-32 resize-none placeholder-[#333]"
            placeholder="Enter 3-sentence summary to complete week..."
          />
          <button className="bg-[#222] border border-[#333] hover:bg-[#333] text-[#aaa] hover:text-white px-4 py-2 transition-colors uppercase tracking-widest text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed">
            Commit & Schedule Reviews
          </button>
        </div>
        
        <div className="border border-[#222] bg-[#111] p-6 space-y-4">
          <h3 className="text-[#aaa] uppercase tracking-widest text-sm mb-4">Due Reviews (2)</h3>
          <div className="space-y-2">
             <div className="flex items-center justify-between border border-[#333] bg-[#0a0a0a] p-3">
               <span className="text-[#aaa] text-sm">Strict Aliasing</span>
               <div className="flex gap-2">
                 <button className="text-xs border border-[#333] px-2 py-1 text-[#3b82f6] hover:bg-[#222]">QUIZ</button>
                 <button className="text-xs border border-[#333] px-2 py-1 text-green-500 hover:bg-[#222]">CLEAN</button>
                 <button className="text-xs border border-[#333] px-2 py-1 text-red-500 hover:bg-[#222]">RESET</button>
               </div>
             </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <div className="border border-[#222] bg-[#111] px-4 py-2 inline-flex items-center gap-3">
          <span className="text-[#555] text-xs uppercase tracking-widest">Streak</span>
          <span className="text-white text-xl">12</span>
        </div>
      </div>
    </div>
  );
}

function LaneCard({ title, status, color }: { title: string, status: string, color: string }) {
  return (
    <div className="border border-[#222] bg-[#111] p-4 flex flex-col gap-2">
      <span className="text-[#555] text-xs uppercase tracking-widest">{title}</span>
      <span className={`text-sm tracking-wider ${color}`}>{status}</span>
    </div>
  );
}

function QuizTerminal() {
  const [messages, setMessages] = useState<{ role: "system" | "user" | "assistant", content: string }[]>([]);
  const [input, setInput] = useState("");
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [quizState, setQuizState] = useState<"topic" | "answering" | "feedback">("topic");
  
  const generateQuiz = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, detail: "Standard difficulty" }),
      });
      const data = await res.json();
      if (data.question) {
        setMessages([{ role: "assistant", content: data.question }]);
        setQuizState("answering");
      } else {
        alert(data.error || "Failed to generate question");
      }
    } catch (e) {
      alert("Error generating quiz");
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!input.trim() || isLoading) return;
    const answer = input;
    setInput("");
    
    // Add user answer to messages
    const newMessages = [...messages, { role: "user" as const, content: answer }];
    setMessages(newMessages);
    setIsLoading(true);
    
    // The question is the last assistant message
    const question = newMessages.findLast(m => m.role === "assistant")?.content || "";
    
    try {
      const res = await fetch("/api/quiz/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
      });
      const data = await res.json();
      if (data.feedback) {
        setMessages([...newMessages, { role: "assistant", content: data.feedback }]);
        setQuizState("feedback");
      } else {
        alert(data.error || "Failed to evaluate answer");
      }
    } catch (e) {
      alert("Error evaluating answer");
    } finally {
      setIsLoading(false);
    }
  };

  const nextQuestion = () => {
    setMessages([]);
    setTopic("");
    setQuizState("topic");
  };

  return (
    <div className="flex flex-col h-[600px] border border-[#222] bg-[#111]">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {quizState === "topic" && messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <h2 className="text-[#aaa] uppercase tracking-widest text-sm">Enter a Topic to Begin</h2>
            <input 
              className="bg-[#0a0a0a] border border-[#333] p-3 text-white focus:outline-none focus:border-[#555] w-full max-w-md placeholder-[#333]"
              placeholder="e.g. Memory Model, Pointers, Concurrency..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generateQuiz()}
            />
            <button 
              onClick={generateQuiz}
              disabled={isLoading || !topic.trim()}
              className="bg-[#222] border border-[#333] hover:bg-[#333] text-[#aaa] hover:text-white px-6 py-2 transition-colors uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Generating..." : "Generate Quiz"}
            </button>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] border p-4 ${msg.role === "user" ? "border-[#3b82f6] bg-[#0a0a0a]" : "border-[#333] bg-[#1a1a1a]"}`}>
                <div className="text-xs uppercase tracking-widest mb-2 text-[#555]">
                  {msg.role === "user" ? "You" : "Claude"}
                </div>
                <div className="text-[#ddd] whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {msg.content}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && quizState !== "topic" && (
          <div className="flex justify-start">
            <div className="max-w-[80%] border border-[#333] bg-[#1a1a1a] p-4 text-[#555] font-mono text-sm uppercase">
              Thinking...
            </div>
          </div>
        )}
      </div>
      
      {quizState !== "topic" && (
        <div className="border-t border-[#222] p-4 bg-[#0a0a0a]">
          {quizState === "answering" ? (
            <div className="flex gap-2">
              <textarea 
                className="flex-1 bg-[#111] border border-[#333] p-3 text-white focus:outline-none focus:border-[#555] h-20 resize-none placeholder-[#333] font-mono text-sm"
                placeholder="Type your answer here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submitAnswer();
                  }
                }}
              />
              <button 
                onClick={submitAnswer}
                disabled={isLoading || !input.trim()}
                className="bg-[#222] border border-[#333] hover:bg-[#333] text-[#aaa] hover:text-white px-4 py-2 transition-colors uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-[#aaa] text-sm uppercase tracking-widest">Feedback received</span>
              <button 
                onClick={nextQuestion}
                className="bg-[#222] border border-[#333] hover:bg-[#333] text-white px-6 py-2 transition-colors uppercase tracking-widest text-sm"
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
