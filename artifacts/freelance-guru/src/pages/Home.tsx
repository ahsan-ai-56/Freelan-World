import { motion } from "framer-motion";
import { Link } from "wouter";
import { Search, Sparkles, MapPin, Briefcase, Zap, Star } from "lucide-react";
import { useEffect, useState } from "react";

function AnimatedCounter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export default function Home() {
  useEffect(() => {
    document.title = "FreelanceGuru AI - Pakistan's #1 Freelancer Toolkit";
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col min-h-screen"
    >
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden animated-gradient">
        {/* Floating Orbs */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[100px]"
        />

        <div className="z-10 max-w-4xl mx-auto space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight"
          >
            Pakistan's <span className="gradient-text">Most Powerful</span> Freelancer Toolkit
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
          >
            Find clients, write winning proposals, and grow your freelance career with AI
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/client-hunter"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-white gradient-bg glow-primary hover:scale-105 active:scale-95 transition-all"
            >
              Hunt Clients
            </Link>
            <Link
              href="/proposal-writer"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-white border-2 border-white/10 hover:border-primary hover:bg-primary/10 transition-all hover:scale-105 active:scale-95"
            >
              Write Proposal
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Animated Stats Bar */}
      <section className="bg-card border-y border-card-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-around gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-card-border text-center">
            <div className="flex-1 pt-4 md:pt-0">
              <h3 className="text-4xl font-bold gradient-text mb-2">
                <AnimatedCounter end={50000} />+
              </h3>
              <p className="text-muted-foreground font-medium">Pakistani Freelancers</p>
            </div>
            <div className="flex-1 pt-4 md:pt-0">
              <h3 className="text-4xl font-bold gradient-text mb-2">
                <AnimatedCounter end={100} />+
              </h3>
              <p className="text-muted-foreground font-medium">Cities Covered</p>
            </div>
            <div className="flex-1 pt-4 md:pt-0">
              <h3 className="text-4xl font-bold gradient-text mb-2">10x</h3>
              <p className="text-muted-foreground font-medium">Faster with AI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="glass-card p-8 rounded-2xl flex flex-col items-start gap-6 group cursor-pointer"
            >
              <div className="p-4 rounded-xl gradient-bg text-white shadow-lg">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Client Hunter</h3>
                <p className="text-muted-foreground mb-6">Find clients in your city using real business data</p>
                <Link href="/client-hunter" className="text-primary font-semibold hover:text-white transition-colors flex items-center gap-2">
                  Try Now <span className="text-xl">→</span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="glass-card p-8 rounded-2xl flex flex-col items-start gap-6 group cursor-pointer"
            >
              <div className="p-4 rounded-xl gradient-bg text-white shadow-lg">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">Proposal Writer</h3>
                <p className="text-muted-foreground mb-6">Write winning proposals powered by Gemini AI</p>
                <Link href="/proposal-writer" className="text-accent font-semibold hover:text-white transition-colors flex items-center gap-2">
                  Try Now <span className="text-xl">→</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-[#0d0d14]">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary to-accent z-0" />
            
            {[
              { icon: MapPin, title: "Choose Your City", desc: "Select any major city in Pakistan" },
              { icon: Briefcase, title: "Enter Your Skills", desc: "Tell us what you are good at" },
              { icon: Zap, title: "Get AI Results", desc: "Let our AI do the heavy lifting" }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center text-white shadow-xl mb-6 glow-primary">
                  <step.icon className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Loved by Pakistani Freelancers</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Ali Hassan", role: "Graphic Designer", city: "Lahore", quote: "I found 3 new clients in Lahore in one day!" },
              { name: "Fatima Khan", role: "Web Developer", city: "Karachi", quote: "The AI proposals are incredible, my response rate went from 20% to 80%!" },
              { name: "Usman Malik", role: "Content Writer", city: "Islamabad", quote: "This tool changed my freelance career forever!" }
            ].map((t, i) => (
              <motion.div key={i} whileHover={{ y: -4 }} className="glass-card p-6 rounded-xl flex flex-col gap-4">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-lg flex-1 italic text-muted-foreground">"{t.quote}"</p>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold">{t.name}</h4>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-white/5 text-muted-foreground">{t.city}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-card border-t border-card-border relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] gradient-bg" />
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-lg font-bold gradient-text">FreelanceGuru AI</span>
              </Link>
              <p className="text-muted-foreground text-sm max-w-xs">
                The ultimate productivity toolkit designed exclusively for Pakistani freelancers.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Tools</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/client-hunter" className="hover:text-primary transition-colors">Client Hunter</Link></li>
                <li><Link href="/proposal-writer" className="hover:text-primary transition-colors">Proposal Writer</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-card-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2026 FreelanceGuru AI. All rights reserved.</p>
            <p className="text-sm font-medium flex items-center gap-1">
              Made with <span className="text-red-500">❤️</span> for Pakistani Freelancers 🇵🇰
            </p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}