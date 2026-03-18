"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Coffee, Music, Utensils, Send, Loader2, AlertTriangle, Clock, Users, MapPin, Zap, Navigation, Award, CheckCircle2, Star, Shield, ShieldCheck, MessageCircle } from "lucide-react";

// Reusable 1-5 Rating Segment from ReviewPage
const RatingSegment = ({ label, value, setter, icon: Icon }: any) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <label className="text-xs font-bold text-[#7C7C7C] uppercase tracking-widest flex items-center gap-2">
        <Icon className="w-3.5 h-3.5" /> {label}
      </label>
      <span className="text-[#CF5C36] font-mono text-xs font-bold">{value > 0 ? `${value}/5` : 'REQ'}</span>
    </div>
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((num) => (
        <motion.button
          key={num}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setter(num)}
          className={`flex-1 h-12 rounded-xl border font-mono text-sm transition-all duration-300 ${
            value >= num 
              ? "bg-[#CF5C36]/10 border-[#CF5C36] text-[#CF5C36] shadow-[0_0_15px_rgba(207,92,54,0.2)]" 
              : "bg-white/5 border-white/10 text-white/30 hover:border-white/20"
          }`}
        >
          {num}
        </motion.button>
      ))}
    </div>
  </div>
);

// Reusable Vertical Feature Card from image_0.png but for features
const FeatureCardVertical = ({ icon: Icon, color, title, subtitle, features, badge }: any) => (
    <div className={`group relative p-8 sm:p-10 rounded-[32px] bg-white/[0.01] backdrop-blur-3xl border border-white/[0.03] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(${color},0.15)] supports-[backdrop-filter]:bg-white/[0.01]`}>
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className={`absolute -right-6 -top-10 text-[140px] font-black select-none pointer-events-none transition-colors duration-500 leading-none tracking-tighter opacity-10 group-hover:opacity-10`} style={{ color: `rgb(${color})` }}>
            {badge}
        </div>
        <div className={`absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/[0.05] group-hover:ring-[rgb(${color})]/20 transition-all duration-500`} />
        <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgb(${color})]/40 to-transparent`} />
        <div className={`absolute inset-y-0 left-0 w-px bg-gradient-to-b from-[rgb(${color})]/10 to-transparent`} />
        <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} style={{ backgroundColor: `rgb(${color}, 0.2)`}} />
        <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-start justify-between mb-8">
                <div className={`flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-b border transition-all duration-500 group-hover:scale-110 shadow-[0_8px_16px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)]`} style={{
                    backgroundColor: `rgb(${color}, 0.08)`,
                    borderColor: `rgb(${color}, 0.08)`,
                    boxShadow: `0 8px 16px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1)`,
                    filter: `group-hover:drop-shadow(0 0 30px rgb(${color}, 0.2))`,
                    borderImage: `linear-gradient(to bottom, rgba(${color}, 0.08) 100%)` 
                }}>
                    <Icon className={`h-7 w-7 text-[rgb(${color})]/70 group-hover:text-[rgb(${color})] transition-colors duration-300 fill-[rgb(${color})]/10`} strokeWidth={1.5} />
                </div>
                <div className="flex-1 text-right">
                    <h3 className="mb-0.5 text-xs font-bold text-[#7C7C7C] uppercase tracking-widest">{subtitle}</h3>
                    <p className="text-xl font-bold text-white tracking-tight leading-none" style={{ textShadow: `0 0 10px rgba(${color}, 0.3)` }}>{title}</p>
                </div>
            </div>
            
            <ul className="space-y-4 mb-10 flex-1">
                {features.map((feature: any) => (
                    <li key={feature.text} className="flex items-center gap-3 text-base font-medium text-[#8a8a8a] group-hover:text-white/80 transition-colors duration-500">
                        <CheckCircle2 className={`h-5 w-5 ${feature.active ? `text-[rgb(${color})]` : 'text-[#7C7C7C]'}`} />
                        {feature.text}
                    </li>
                ))}
            </ul>
            
            <button className="w-full h-14 mt-auto bg-gradient-to-r from-[#CF5C36] to-[#E36940] text-white font-bold tracking-widest uppercase text-xs rounded-2xl shadow-[0_0_20px_rgba(207,92,54,0.4)] transition-all flex items-center justify-center">
                Learn More
            </button>
        </div>
    </div>
);

export default function FeaturesPage() {
  const [safety, setSafety] = useState<number>(3);
  const [punctuality, setPunctuality] = useState<number>(3);
  const [authenticity, setAuthenticity] = useState<number>(3);
  const [badge, setBadge] = useState<"trustworthy" | "entertainer" | "punctual" | "none">("none");

  return (
    <main className="min-h-screen bg-[#000000] text-[#EEE5E9] font-sans selection:bg-[#CF5C36]/30 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(207,92,54,0.03),_transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none" />
      
      {/* FIXED: Changed section to header so it matches the closing tag */}
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="space-y-12 sm:space-y-24">
          
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 p-8 sm:p-10 rounded-[32px] bg-white/[0.01] backdrop-blur-3xl border border-white/[0.03] relative overflow-hidden group hover:border-[#CF5C36]/20 transition-all duration-500">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#CF5C36]/10 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="space-y-6">
                <h2 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
                    Introducing our Geospatial Vibe Check <Navigation className="w-5 h-5 text-[#CF5C36]" />
                </h2>
                <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tighter drop-shadow-sm leading-tight">Instant meetups. Zero sketchiness.</p>
                <p className="text-base text-[#7C7C7C] font-light leading-relaxed">Meet up instantly. Your exact location stays masked until you're both within a 500-meter radius of the venue. Ghosting solved by physics.</p>
            </div>
            
            <div className="flex-1 overflow-hidden min-h-[300px] border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent rounded-[32px] group relative group-hover:border-[#CF5C36]/20 transition-all duration-500">
                <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                <div className="relative w-max h-max top-full left-1/2 -translate-x-1/2 p-2 px-4 bg-[#111111]/90 backdrop-blur-xl border border-white/10 rounded-2xl text-xs text-white opacity-100 shadow-xl flex items-center gap-2 -translate-y-[calc(100%+8px)] z-10 pointer-events-none">
                    <span className="font-bold text-[#CF5C36] tracking-tight">Vibe Area</span> 
                    <span className="text-white/30">•</span> 
                    <span className="text-white/80 font-medium">8:00 PM Today</span>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#CF5C36]/5 rounded-full border border-[#CF5C36]/10 flex items-center justify-center group-hover:bg-[#CF5C36]/10 transition-all duration-500">
                    <div className="absolute w-32 h-32 bg-[#CF5C36]/10 rounded-full border border-[#CF5C36]/20 animate-ping opacity-50" />
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=fallback&size=64" className="relative z-10 w-20 h-20 rounded-full border-2 border-[#CF5C36] shadow-[0_0_15px_rgba(207,92,54,0.5)] transition-transform duration-300 ring-2 ring-black" />
                </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-[1fr,auto] items-center gap-8 md:gap-12">
            <div className="space-y-4">
                <h3 className="mb-0.5 text-xs font-bold text-[#7C7C7C] uppercase tracking-widest">Testimonial</h3>
                <h4 className="text-4xl font-extrabold text-white tracking-tighter drop-shadow-sm leading-tight max-w-lg">How Our Users Enhance Their Social Life</h4>
                <div className="flex gap-2">
                    <Users className="w-4 h-4 text-[#CF5C36] shrink-0" />
                    <span className="font-bold text-[#EFC88B] tracking-tight">{152} Successful Meetups</span>
                </div>
            </div>
            
            <div className="flex gap-4">
                <div className="w-1.5 rounded-full bg-gradient-to-b from-[#CF5C36] to-[#E36940] relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(207,92,54,0.6)]" />
                </div>
                
                <div className="max-w-xl text-[#EEE5E9] p-8 sm:p-10 rounded-[32px] bg-white/[0.01] border border-white/[0.03] space-y-4 shadow-lg flex-1">
                    {/* FIXED: Replaced undefined activeChat with static mockup text for the landing page */}
                    <p className="text-base text-[#EEE5E9] font-light italic leading-relaxed relative z-10">"Your friends have plans. We have plans too. Let's make it a thing. Drop a vibe, meet your crowd, live in the moment."</p>
                    <div className="flex items-center gap-4">
                        <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Emma" className="w-14 h-14 rounded-full object-cover border-2 border-[#111] shadow-lg bg-[#0A0A0A]" />
                        <div>
                            <h3 className="text-base font-semibold text-white tracking-tight">Emma, 24</h3>
                            <p className="text-xs text-[#7C7C7C] font-semibold uppercase tracking-widest">Verified Host</p>
                        </div>
                    </div>
                </div>
            </div>
          </section>
          
          <section className="space-y-12">
            <div className="text-center space-y-4">
              <h3 className="mb-0.5 text-xs font-bold text-[#7C7C7C] uppercase tracking-widest">Features</h3>
              <h4 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tighter drop-shadow-sm leading-tight max-w-4xl mx-auto">Instant connections, no sketchiness. How it works.</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full max-w-7xl mx-auto">
              <FeatureCardVertical 
                icon={MapPin} 
                color="239,200,139" 
                subtitle="The Spots" 
                title="Strictly Hotspots" 
                badge="01"
                features={[
                    { text: "Unlimited Vibe Radar", active: true },
                    { text: "Curated hot spots", active: true },
                    { text: "No residential addresses", active: true },
                    { text: "Public hotspots only", active: true },
                    { text: "Location reveal within radius", active: true },
                ]}
              />

              <FeatureCardVertical 
                icon={Zap} 
                color="239,200,139" 
                subtitle="The Chat" 
                title="Temporary Burner" 
                badge="02"
                features={[
                    { text: "Unlimited Vibe Browsing", active: true },
                    { text: "Make a plan, then meet up", active: true },
                    { text: "Self-destructing history", active: true },
                    { text: "Live HH:MM:SS countdowns", active: true },
                    { text: "Chat history vanishes", active: true },
                ]}
              />

              <FeatureCardVertical 
                icon={Navigation} 
                color="207,92,54" 
                subtitle="The Privacy" 
                title="Address Shield" 
                badge="03"
                features={[
                    { text: "Full Venue Masking", active: true },
                    { text: "500m proximity reveal", active: true },
                    { text: "No Home Addresses ever", active: true },
                    { text: "Masked address logic", active: true },
                    { text: "Meet in public coordinates", active: true },
                ]}
              />
            </div>
          </section>
          
          <section className="space-y-12">
            <div className="text-center">
              <h3 className="mb-0.5 text-xs font-bold text-[#7C7C7C] uppercase tracking-widest mb-10">Vibe Engine</h3>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 text-center md:text-left">
                <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mt-auto text-left">
                        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                        <h4 className="text-sm font-semibold text-red-400 mb-1">Built on Trust & Discretion</h4>
                        <p className="text-xs text-red-400/90 leading-relaxed">Do not share your phone number, social handles, or exact address. Exact venue name remains hidden until accepted. Vouch for safe vibes with badges.</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-4 flex-1">
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
                        Seal the Ledger <ShieldCheck className="w-4 h-4 text-green-400" />
                    </h2>
                    <p className="text-[#7C7C7C] text-sm">Every vibe ends with analysis. Rate temporally. Award badges.</p>
                </div>
                <div className="flex justify-center md:justify-end flex-1">
                    <button className="h-14 bg-gradient-to-r from-[#CF5C36] to-[#E36940] text-white hover:from-[#E36940] hover:to-[#CF5C36] shadow-[0_4px_15px_rgba(207,92,54,0.3)] text-xs font-semibold transition-all duration-300 rounded-2xl px-8 flex items-center justify-center gap-2 active:scale-95">
                        <Zap className="w-4 h-4" /> Vibe Analysis
                    </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full max-w-7xl mx-auto p-8 sm:p-10 rounded-[32px] bg-white/[0.01] backdrop-blur-3xl border border-white/[0.03]">
                <RatingSegment label="Safety & Respect" value={safety} setter={setSafety} icon={Shield} />
                <RatingSegment label="Punctuality" value={punctuality} setter={setPunctuality} icon={Clock} />
                <RatingSegment label="Authentic Vibe" value={authenticity} setter={setAuthenticity} icon={Zap} />
            </div>

            <div className="pt-6 border-t border-white/5 bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/5 p-8 rounded-[32px] shadow-2xl space-y-4">
                <label className="text-xs font-bold text-[#7C7C7C] uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Award className="w-3.5 h-3.5" /> Award a Badge
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "trustworthy", label: "Trustworthy", icon: Shield },
                    { id: "entertainer", label: "Entertainer", icon: Star },
                    { id: "punctual", label: "Punctual", icon: Clock },
                    { id: "none", label: "None", icon: Zap }
                  ].map((b) => (
                    <motion.button
                      key={b.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setBadge(b.id as any)}
                      className={`h-12 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                        badge === b.id 
                          ? "bg-white/10 border-white/30 text-white" 
                          : "bg-transparent border-white/5 text-[#7C7C7C] hover:bg-white/5"
                      }`}
                    >
                      <b.icon className="w-3.5 h-3.5" /> {b.label}
                    </motion.button>
                  ))}
                </div>
            </div>
          </section>

          <section className="text-center space-y-10 py-16">
            <h4 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tighter drop-shadow-sm leading-tight max-w-4xl mx-auto">Master Your Real-World Vibe</h4>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
              Drop a vibe. Meet your people. The city is waiting—start living.
            </p>
            <button className="inline-flex items-center gap-2 px-10 h-14 rounded-full border border-white/20 text-xs font-bold uppercase tracking-wider text-white shadow-2xl shadow-[#CF5C36]/30 bg-gradient-to-r from-[#CF5C36] via-[#E36940] to-[#EFC88B] hover:scale-105 active:scale-95 transition-all">
                Request Access
            </button>
          </section>

          <footer className="mt-auto pt-16 border-t border-white/5 bg-[#0A0A0A]/80 p-8 rounded-[32px] shadow-lg flex-shrink-0">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 px-2">
              <div className="flex flex-col items-center sm:items-start gap-1">
                <span className="font-bold text-lg text-white tracking-tight">NOXU</span>
                <p className="text-[10px] text-[#7C7C7C] font-semibold uppercase tracking-widest">© 2026. All rights reserved.</p>
              </div>
              
              <div className="flex items-center gap-4 sm:gap-8 text-[11px] text-[#7C7C7C] font-semibold uppercase tracking-widest flex-wrap justify-center">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Safety</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
              </div>
              
              <div className="flex items-center gap-4 text-[#7C7C7C]">
                <a href="#" className="hover:text-white transition-colors"><Zap className="w-4 h-4" /></a>
                <a href="#" className="hover:text-white transition-colors"><Navigation className="w-4 h-4" /></a>
                <a href="#" className="hover:text-white transition-colors"><MessageCircle className="w-4 h-4" /></a>
              </div>
            </div>
          </footer>

        </motion.div>
      </div>
    </main>
  );
}