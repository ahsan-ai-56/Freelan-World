import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Zap, ExternalLink, Search, Sparkles, Mail } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { geminiGenerate } from "@/lib/gemini";

interface Company {
  id: string;
  name: string;
  website: string;
  email: string;
  city: string;
  country: string;
  reason: string;
  score: number;
  badge: "Hot" | "Warm" | "Cold";
}

const badgeStyles: Record<string, string> = {
  Hot: "bg-red-500/20 text-red-400 border-red-500/50",
  Warm: "bg-orange-500/20 text-orange-400 border-orange-500/50",
  Cold: "bg-blue-500/20 text-blue-400 border-blue-500/50",
};
const scoreColor: Record<string, string> = {
  Hot: "#ef4444",
  Warm: "#f97316",
  Cold: "#3b82f6",
};

// Animated floating orb
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
      animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function OutreachAI() {
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({ skills: "", city: "", name: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Company[] | null>(null);

  useEffect(() => {
    document.title = "OutreachAI - Find Global Clients | FreelanceGuru AI";
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.skills || !form.city || !form.name || !form.email) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setResults(null);

    const prompt = `You are a global business lead generator for a freelancer.

Freelancer Name: ${form.name}
Skills: ${form.skills}
Target City: ${form.city}

Generate exactly 9 real-world companies in ${form.city} that would benefit from hiring a freelancer with "${form.skills}" skills.

Return ONLY a valid JSON array with exactly 9 objects. No markdown, no explanation, just the raw JSON array.

Each object must have these exact fields:
{
  "name": "Real company name that exists or is plausible in ${form.city}",
  "website": "realistic website URL like company.com or company.co.uk",
  "email": "info@companyname.com or contact@companyname.com format",
  "city": "${form.city.split(",")[0].trim()}",
  "country": "country name",
  "reason": "One specific sentence why they need ${form.skills}",
  "score": number between 50-98,
  "badge": "Hot" or "Warm" or "Cold"
}

Rules:
- 3 must be "Hot" (score 80-98), 3 "Warm" (score 60-79), 3 "Cold" (score 50-65)
- Company names must sound like real businesses in that city/country
- Websites must be realistic (use local TLDs where appropriate)
- Emails: info@, contact@, hello@, or hi@ + domain
- Reason must specifically mention how "${form.skills}" helps them
- Mix of company types: startups, agencies, established businesses`;

    try {
      const raw = await geminiGenerate(prompt, 0.9);
      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("No JSON array found in response");

      const parsed: Omit<Company, "id">[] = JSON.parse(jsonMatch[0]);
      const companies: Company[] = parsed.map((c, i) => ({
        ...c,
        id: `co-${i}-${Date.now()}`,
      }));

      setResults(companies);
      toast.success(`Found ${companies.length} companies in ${form.city}!`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[OutreachAI] Error:", msg, err);
      toast.error(`Failed to find companies: ${msg}`);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const goToProposal = (company: Company) => {
    const params = new URLSearchParams({
      company: company.name,
      companyEmail: company.email,
      companyWebsite: company.website,
      skills: form.skills,
      freelancerName: form.name,
      freelancerEmail: form.email,
    });
    setLocation(`/proposal-writer?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen"
    >
      {/* Hero */}
      <div className="relative overflow-hidden py-20 px-4">
        <Orb className="w-96 h-96 bg-primary top-0 -left-32" />
        <Orb className="w-72 h-72 bg-accent top-10 right-0" />

        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-20 h-20 rounded-3xl gradient-bg flex items-center justify-center mx-auto mb-6 glow-primary"
          >
            <Globe className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-4xl md:text-6xl font-black mb-4"
          >
            <span className="gradient-text">OutreachAI</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-xl mx-auto"
          >
            Find companies worldwide that need your skills — then send AI-crafted proposals in one click.
          </motion.p>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 max-w-2xl pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-8 rounded-2xl mb-10"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" /> Find Your Next Client
          </h2>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Ahmed Khan"
                  required
                  className="w-full bg-input border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all"
                  data-testid="input-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Your Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="you@email.com"
                  required
                  className="w-full bg-input border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all"
                  data-testid="input-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Your Skills</label>
              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                type="text"
                placeholder="e.g. React Development, UI/UX Design, SEO"
                required
                className="w-full bg-input border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all"
                data-testid="input-skills"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Target City / Country</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                type="text"
                placeholder="e.g. London UK, Dubai UAE, New York USA, Toronto Canada"
                required
                className="w-full bg-input border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all"
                data-testid="input-city"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-xl font-bold text-white gradient-bg hover:glow-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              data-testid="button-find-companies"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  AI is searching globally...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" /> Find Companies & Generate Proposals
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Skeleton */}
        {isLoading && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              Gemini is finding companies in {form.city}...
            </p>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card p-6 rounded-xl animate-pulse">
                <div className="flex justify-between mb-3">
                  <div className="h-5 bg-white/10 rounded w-1/2" />
                  <div className="h-5 bg-white/10 rounded w-16" />
                </div>
                <div className="h-3 bg-white/10 rounded w-3/4 mb-2" />
                <div className="h-3 bg-white/10 rounded w-full mb-4" />
                <div className="h-1.5 bg-white/10 rounded-full mb-4" />
                <div className="h-10 bg-white/10 rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && results && results.length === 0 && (
          <div className="glass-card p-12 rounded-2xl text-center">
            <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No results found</h3>
            <p className="text-muted-foreground">Try a different city or skill set.</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && results && results.length > 0 && (
          <AnimatePresence>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground font-medium">
                {results.length} companies found in{" "}
                <span className="text-white font-semibold">{form.city}</span>
              </p>
              {results.map((company, i) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -3 }}
                  className="glass-card p-6 rounded-xl hover:border-primary/40 transition-colors"
                  data-testid={`card-company-${i}`}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg leading-snug truncate">{company.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <a
                          href={`https://${company.website.replace(/^https?:\/\//, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary/80 hover:text-primary flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {company.website.replace(/^https?:\/\//, "")}
                        </a>
                        <a
                          href={`mailto:${company.email}`}
                          className="text-xs text-muted-foreground hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <Mail className="w-3 h-3" />
                          {company.email}
                        </a>
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full border whitespace-nowrap font-semibold ${badgeStyles[company.badge]}`}>
                      {company.badge} Lead
                    </span>
                  </div>

                  {/* Location */}
                  <p className="text-xs text-muted-foreground mb-2">
                    📍 {company.city}, {company.country}
                  </p>

                  {/* Reason */}
                  <p className="text-sm text-muted-foreground italic mb-4">
                    "{company.reason}"
                  </p>

                  {/* Score bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Match Score</span>
                      <span className="font-bold">{company.score}%</span>
                    </div>
                    <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${company.score}%` }}
                        transition={{ delay: i * 0.07 + 0.3, duration: 0.8, ease: "easeOut" }}
                        style={{ backgroundColor: scoreColor[company.badge] }}
                      />
                    </div>
                  </div>

                  {/* Write Proposal button */}
                  <motion.button
                    onClick={() => goToProposal(company)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-2.5 rounded-lg font-bold text-white gradient-bg hover:glow-primary transition-all flex items-center justify-center gap-2 text-sm"
                    data-testid={`button-proposal-${i}`}
                  >
                    <Sparkles className="w-4 h-4" />
                    Write Proposal for {company.name}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
