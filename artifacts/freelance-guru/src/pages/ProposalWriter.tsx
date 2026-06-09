import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Copy, Download, RefreshCw, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function ProposalWriter() {
  const [, setLocation] = useLocation();

  // Pre-fill from OutreachAI URL params
  const params = new URLSearchParams(window.location.search);
  const preCompany = params.get("company") || "";
  const preCompanyEmail = params.get("companyEmail") || "";
  const preSkills = params.get("skills") || "";
  const preName = params.get("freelancerName") || "";

  const [formData, setFormData] = useState({
    name: preName,
    skills: preSkills,
    projectType: preCompany ? `project for ${preCompany}` : "",
    experienceLevel: "Intermediate",
    platform: preCompany ? "Direct Client" : "Upwork",
    tone: "Professional",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [proposal, setProposal] = useState("");
  const isOutreachMode = !!preCompany;

  useEffect(() => {
    document.title = isOutreachMode
      ? `Proposal for ${preCompany} | FreelanceGuru AI`
      : "AI Proposal Writer | FreelanceGuru AI";
  }, [isOutreachMode, preCompany]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const buildPrompt = () => {
    if (isOutreachMode) {
      return `Write a professional cold outreach proposal email from a freelancer to a potential client company.

Freelancer Name: ${formData.name || preName}
Freelancer Skills: ${formData.skills || preSkills}
Target Company: ${preCompany}
Tone: ${formData.tone}
Experience Level: ${formData.experienceLevel}

Write a complete, persuasive cold outreach email with:
- Professional subject line suggestion
- Compelling opening that references ${preCompany} specifically
- Brief intro about the freelancer and their skills
- Specific value proposition for ${preCompany}
- Relevant examples or skills that match their needs
- Clear call to action (schedule a call, reply to discuss, etc.)
- Professional sign-off

Keep it concise (under 300 words), ${formData.tone.toLowerCase()} in tone, and highly personalized to ${preCompany}.`;
    }

    return `Write a winning freelance proposal for a ${formData.projectType} project.
My name is ${formData.name}. My skills: ${formData.skills}. Experience: ${formData.experienceLevel}.
Platform: ${formData.platform}. Tone: ${formData.tone}.
Write a complete, professional proposal with:
- Attention-grabbing opening
- Brief introduction about myself
- Why I'm the perfect fit for this project
- My relevant skills and experience
- Proposed approach/methodology
- Timeline estimate
- Pricing discussion (keep flexible)
- Strong call to action
Make it ${formData.tone.toLowerCase()} in tone. Format it nicely with clear sections.`;
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name || (!isOutreachMode && !formData.projectType)) {
      toast.error("Please fill in your name and project type.");
      return;
    }

    setIsLoading(true);
    setProposal("");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: buildPrompt() }] }],
          }),
        }
      );

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setProposal(text);
      toast.success("Proposal generated successfully!");
    } catch {
      toast.error("Failed to generate proposal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(proposal);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Proposal${preCompany ? ` for ${preCompany}` : ""} - ${formData.name}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 40px; max-width: 800px; margin: 0 auto; }
              pre { white-space: pre-wrap; font-family: inherit; }
            </style>
          </head>
          <body><pre>${proposal}</pre></body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(
      isOutreachMode
        ? `Freelance Services Inquiry — ${formData.name}`
        : `Project Proposal — ${formData.projectType}`
    );
    const body = encodeURIComponent(proposal);
    const to = preCompanyEmail || "";
    window.open(`mailto:${to}?subject=${subject}&body=${body}`, "_blank");
  };

  const wordCount = proposal.trim().split(/\s+/).filter((w) => w.length > 0).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-4 py-12 max-w-5xl"
    >
      {/* OutreachAI banner */}
      {isOutreachMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => setLocation("/outreach-ai")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to OutreachAI
          </button>
          <div className="glass-card p-4 rounded-xl border-l-4 border-primary flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">
                Writing proposal for{" "}
                <span className="gradient-text">{preCompany}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                AI will craft a personalized outreach email for this company
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          {isOutreachMode ? "Craft Your Outreach Email" : "Write Winning Proposals with AI"}
        </h1>
        <p className="text-xl text-muted-foreground">Powered by Google Gemini AI</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className={`transition-all duration-500 ${proposal ? "lg:col-span-1" : "lg:col-span-2 max-w-2xl mx-auto w-full"}`}>
          <div className="glass-card p-6 md:p-8 rounded-2xl">
            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium mb-1">Your Name</label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium mb-1">Experience Level</label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none appearance-none"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Your Skills</label>
                <input
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. React, Node.js, UI/UX"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {!isOutreachMode && (
                <div>
                  <label className="block text-sm font-medium mb-1">Project Type</label>
                  <input
                    required
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. E-commerce Website"
                    className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              )}

              {isOutreachMode && (
                <div>
                  <label className="block text-sm font-medium mb-1">Target Company</label>
                  <input
                    value={preCompany}
                    readOnly
                    className="w-full bg-input/50 border border-border/50 rounded-lg px-4 py-2 text-muted-foreground cursor-not-allowed"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {!isOutreachMode && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Platform</label>
                    <select
                      name="platform"
                      value={formData.platform}
                      onChange={handleChange}
                      className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none appearance-none"
                    >
                      <option>Fiverr</option>
                      <option>Upwork</option>
                      <option>Direct Client</option>
                    </select>
                  </div>
                )}
                <div className={isOutreachMode ? "col-span-2" : ""}>
                  <label className="block text-sm font-medium mb-1">Tone</label>
                  <select
                    name="tone"
                    value={formData.tone}
                    onChange={handleChange}
                    className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none appearance-none"
                  >
                    <option>Professional</option>
                    <option>Friendly</option>
                    <option>Confident</option>
                    <option>Creative</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-3.5 rounded-xl font-bold text-white gradient-bg hover:glow-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {isOutreachMode ? `Generate Email for ${preCompany}` : "Generate Proposal"}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Loading animation */}
        {isLoading && !proposal && (
          <div className="lg:col-span-1 glass-card rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 rounded-full gradient-bg mb-6 flex items-center justify-center glow-primary"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-xl font-bold animate-pulse">
              {isOutreachMode ? `Crafting email for ${preCompany}...` : "AI is crafting your proposal..."}
            </h3>
            <div className="flex gap-2 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                  className="w-3 h-3 rounded-full bg-primary"
                />
              ))}
            </div>
          </div>
        )}

        {/* Output */}
        {proposal && !isLoading && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 glass-card rounded-2xl flex flex-col overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 right-0 h-1 gradient-bg" />

            <div className="p-4 border-b border-border flex items-center justify-between bg-black/20 flex-wrap gap-2">
              <span className="text-sm text-muted-foreground font-medium">{wordCount} words</span>
              <div className="flex gap-1">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors text-xs font-medium"
                  title="Copy"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
                <button
                  onClick={handleSendEmail}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary transition-colors text-xs font-medium"
                  title="Send via Email"
                >
                  <Mail className="w-3.5 h-3.5" /> Send Email
                </button>
                <button
                  onClick={handleDownload}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setProposal("")}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                  title="Regenerate"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[600px] text-sm md:text-base leading-relaxed whitespace-pre-wrap font-serif">
              {proposal}
            </div>

            {/* Bottom send button */}
            <div className="p-4 border-t border-border bg-black/10">
              <button
                onClick={handleSendEmail}
                className="w-full py-2.5 rounded-xl font-bold gradient-bg text-white flex items-center justify-center gap-2 text-sm hover:glow-primary transition-all"
              >
                <Mail className="w-4 h-4" />
                {preCompanyEmail
                  ? `Send to ${preCompanyEmail}`
                  : "Send via Email"}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
