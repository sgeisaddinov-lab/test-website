"use client";

import { useState } from "react";
import Plan from "@/components/ui/agent-plan";

// ── Icons ─────────────────────────────────────────────────────────────────────
function IconGPT({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 41 41" fill="none">
      <path
        d="M37.532 16.87a9.963 9.963 0 00-.856-8.184 10.078 10.078 0 00-10.855-4.835 9.964 9.964 0 00-7.505-3.35 10.079 10.079 0 00-9.612 6.977 9.967 9.967 0 00-6.664 4.834 10.08 10.08 0 001.24 11.817 9.965 9.965 0 00.856 8.185 10.079 10.079 0 0010.855 4.835 9.965 9.965 0 007.504 3.35 10.078 10.078 0 009.617-6.981 9.967 9.967 0 006.663-4.834 10.079 10.079 0 00-1.243-11.814zM22.498 37.886a7.474 7.474 0 01-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 00.655-1.134V19.054l3.366 1.944a.12.12 0 01.066.092v9.299a7.505 7.505 0 01-7.49 7.496zM6.392 31.006a7.471 7.471 0 01-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 001.308 0l9.724-5.614v3.888a.12.12 0 01-.048.103l-8.051 4.649a7.504 7.504 0 01-10.24-2.744zM4.297 13.62A7.469 7.469 0 018.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 00.654 1.132l9.723 5.614-3.366 1.944a.12.12 0 01-.114.012L7.044 23.56a7.504 7.504 0 01-2.747-9.94zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 01.114-.012l8.048 4.648a7.498 7.498 0 01-1.158 13.528v-9.476a1.293 1.293 0 00-.647-1.13zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 00-1.308 0l-9.723 5.614v-3.888a.12.12 0 01.048-.103l8.05-4.645a7.497 7.497 0 0111.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 01-.065-.092v-9.299a7.497 7.497 0 0112.293-5.756 6.94 6.94 0 00-.236.134l-7.965 4.6a1.294 1.294 0 00-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.5v4.999l-4.331 2.5-4.331-2.5V18z"
        fill="currentColor"
      />
    </svg>
  );
}

// ── Sidebar nav item ──────────────────────────────────────────────────────────
function NavItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li>
      <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/8 hover:text-white">
        <span className="w-4 flex-shrink-0">{icon}</span>
        {label}
      </button>
    </li>
  );
}

// ── Chat history item ─────────────────────────────────────────────────────────
function ChatItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <li>
      <button
        className={`w-full truncate rounded-lg px-3 py-1.5 text-left text-[13.5px] transition-colors ${
          active
            ? "bg-white/10 text-white"
            : "text-white/60 hover:bg-white/8 hover:text-white/90"
        }`}
      >
        {label}
      </button>
    </li>
  );
}

// ── Feedback banner ───────────────────────────────────────────────────────────
function FeedbackBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3 flex-wrap">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600">
          <IconGPT size={16} />
        </div>
        <span className="text-[13.5px] text-white">Did ChatGPT help you accomplish what you wanted?</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onDismiss} className="rounded-full border border-green-500/30 px-3 py-1 text-[13px] text-green-400 transition-colors hover:bg-green-500/10">Yes</button>
        <button onClick={onDismiss} className="rounded-full border border-white/15 px-3 py-1 text-[13px] text-white/60 transition-colors hover:border-white/25 hover:text-white">Somewhat</button>
        <button onClick={onDismiss} className="rounded-full border border-red-500/30 px-3 py-1 text-[13px] text-red-400 transition-colors hover:bg-red-500/10">No</button>
        <button onClick={onDismiss} className="ml-1 flex items-center rounded p-1 text-white/40 transition-colors hover:bg-white/8 hover:text-white">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [showFeedback, setShowFeedback] = useState(true);
  const [showPlan, setShowPlan] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);

  function sendMessage() {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "I'm processing your request and updating the agent plan accordingly." },
      ]);
    }, 800);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#212121] text-white">
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="flex w-[260px] flex-shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[#171717]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-3 py-3">
          <div className="flex items-center gap-2 px-1 text-white/80">
            <IconGPT size={26} />
          </div>
          <div className="flex gap-1">
            <button className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/8 hover:text-white">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            </button>
            <button className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/8 hover:text-white">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-2">
          <ul className="space-y-0.5">
            <NavItem label="New chat" icon={<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>} />
            <NavItem label="Search chats" icon={<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>} />
            <NavItem label="Insights" icon={<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3h18M3 9h18M3 15h12M3 21h8" /></svg>} />
            <NavItem label="Apps" icon={<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>} />
            <NavItem label="Deep research" icon={<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>} />
            <NavItem label="Codex" icon={<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>} />
            <NavItem label="GPTs" icon={<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>} />
            <NavItem label="Projects" icon={<svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" /></svg>} />
          </ul>
        </nav>

        {/* Agent Plan toggle */}
        <div className="px-2 pt-2">
          <button
            onClick={() => setShowPlan((v) => !v)}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-violet-400 transition-colors hover:bg-white/8"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" /></svg>
            {showPlan ? "Hide" : "Show"} Agent Plan
          </button>
        </div>

        {/* Chat history */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 pt-3">
          <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/30">Today</p>
          <ul className="space-y-0.5">
            <ChatItem label="Stairbridge AI Pricing Info" active />
            <ChatItem label="Platform Demonstration Time" />
            <ChatItem label="Tools a deprecated dep" />
            <ChatItem label="Finding idle MCP Link" />
            <ChatItem label="Bing script chess rebalance" />
            <ChatItem label="What is life" />
            <ChatItem label="Greek Mythology Tale" />
            <ChatItem label="Beta a type a axis" />
            <ChatItem label="Minimize Mythology" />
            <ChatItem label="Greek Mythology Overview" />
          </ul>
          <p className="mb-1 mt-4 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/30">Yesterday</p>
          <ul className="space-y-0.5">
            <ChatItem label="Зіграємося і слухаємо" />
            <ChatItem label="Pronoun Definition" />
            <ChatItem label="Are You Created!" />
            <ChatItem label="Text extraction request" />
            <ChatItem label="Python vs Terminal" />
            <ChatItem label="Work Hours Strategy" />
            <ChatItem label="Claude Code Free Tip" />
          </ul>
        </div>

        {/* User profile */}
        <div className="border-t border-white/10 p-2">
          <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-white/8">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-xs font-bold">S</div>
            <div className="text-left">
              <div className="text-[13.5px] text-white">seymur.gayaddin</div>
              <div className="text-[11px] text-white/40">Plus</div>
            </div>
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-[52px] flex-shrink-0 items-center justify-between px-4">
          <button className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/8">
            ChatGPT
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-[13px] text-white/60 transition-colors hover:border-white/25 hover:text-white">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
            Share
          </button>
        </header>

        {/* Content area — chat + plan side by side */}
        <div className="flex flex-1 gap-0 overflow-hidden">
          {/* Chat column */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="mx-auto max-w-[720px] space-y-6">
                {/* Original conversation */}
                <div className="flex justify-end">
                  <div className="max-w-[72%] rounded-2xl bg-[#303030] px-4 py-3 text-[15px] leading-relaxed">
                    i just been thinking if i wanna get on the hustle do i really wanna learn this whole ai shit or just find an existing product and sell it!
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#212121]">
                    <IconGPT size={16} />
                  </div>
                  <div className="flex-1 text-[15px] leading-relaxed text-white">
                    <p className="mb-3">Short answer: <strong>don't pick one</strong> — do both, but in the right order.</p>
                    <p className="mb-3">If you try to "learn all of AI" first — you'll waste months and make <strong>$0M</strong>.<br />If you just sell random AI tools blindly — you'll sound like every other clown and get ignored.</p>
                    <p className="mb-4">So the real move is this:</p>

                    <div className="mb-3 flex items-center gap-2 text-[17px] font-bold">
                      <span>🔥</span> Phase 1 — Sell FIRST (but not blindly)
                    </div>
                    <p className="mb-2">You don't need deep AI knowledge to start making money.</p>
                    <p className="mb-1 font-semibold">What you do need:</p>
                    <ul className="mb-3 ml-5 list-disc space-y-1">
                      <li>Understand <strong>one concrete problem</strong></li>
                      <li>Have <strong>one simple solution</strong></li>
                      <li>Be able to <strong>explain it clearly</strong></li>
                    </ul>

                    <p className="mb-1 font-semibold">Example (Switzerland, local businesses):</p>
                    <ul className="mb-3 ml-5 list-disc space-y-1">
                      <li>Garage → misses calls → loses clients</li>
                      <li>Solution → AI call assistant → WhatsApp auto-reply</li>
                      <li>You don't build it — you <strong>use existing tools</strong></li>
                    </ul>

                    <blockquote className="my-3 rounded border-l-[3px] border-white/20 bg-white/5 px-4 py-2.5 text-sm italic text-white/70">
                      "I help garages stop losing clients after hours and convert missed calls into bookings automatically."
                    </blockquote>

                    <div className="mt-5 mb-3 flex items-center gap-2 text-[17px] font-bold">
                      <span>🧠</span> Phase 2 — Learn ONLY what you need
                    </div>
                    <p className="mb-2">Now when you try to sell, you'll hit walls:</p>
                    <ul className="mb-3 ml-5 list-disc space-y-1">
                      <li>"Can you connect this to my system?"</li>
                      <li>"Can it speak French?"</li>
                      <li>"Can it send invoices?"</li>
                    </ul>
                    <p className="text-white/80"><em>That's</em> when you learn.</p>
                  </div>
                </div>

                {/* Dynamic messages */}
                {messages.map((msg, i) =>
                  msg.role === "user" ? (
                    <div key={i} className="flex justify-end">
                      <div className="max-w-[72%] rounded-2xl bg-[#303030] px-4 py-3 text-[15px] leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="flex gap-3">
                      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#212121]">
                        <IconGPT size={16} />
                      </div>
                      <div className="flex-1 text-[15px] leading-relaxed">{msg.text}</div>
                    </div>
                  )
                )}

                {/* Feedback */}
                {showFeedback && <FeedbackBanner onDismiss={() => setShowFeedback(false)} />}
              </div>
            </div>

            {/* Composer */}
            <div className="px-4 pb-5 pt-2">
              <div className="mx-auto max-w-[720px]">
                <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#2f2f2f] focus-within:border-white/25">
                  <div className="flex items-end px-3 py-2.5">
                    <textarea
                      className="flex-1 resize-none bg-transparent py-1 text-[15px] leading-relaxed text-white placeholder-white/35 outline-none"
                      placeholder="Message ChatGPT"
                      rows={1}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between px-2 pb-2.5">
                    <div className="flex gap-1">
                      <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] text-white/40 transition-colors hover:bg-white/8 hover:text-white/60">
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" /></svg>
                      </button>
                      <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] text-white/40 transition-colors hover:bg-white/8 hover:text-white/60">
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                        Search
                      </button>
                      <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] text-white/40 transition-colors hover:bg-white/8 hover:text-white/60">
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
                        Reason
                      </button>
                    </div>
                    <button
                      disabled={!input.trim()}
                      onClick={sendMessage}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-opacity disabled:opacity-30"
                    >
                      <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-center text-[11.5px] text-white/30">
                  ChatGPT can make mistakes. Consider checking important info.{" "}
                  <span className="underline underline-offset-2 cursor-pointer">See Cookie Preferences.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Agent Plan panel */}
          {showPlan && (
            <div className="w-[380px] flex-shrink-0 overflow-hidden border-l border-white/10">
              <div className="flex h-[52px] items-center gap-2 border-b border-white/10 px-4">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-violet-400"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" /></svg>
                <span className="text-[13px] font-semibold text-white/70">Agent Plan</span>
              </div>
              <div className="h-[calc(100%-52px)] overflow-auto">
                <Plan />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
