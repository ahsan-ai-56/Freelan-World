import { useEffect } from "react";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy | FreelanceGuru AI";
  }, []);

  const sections = [
    {
      title: "1. Introduction",
      content: "FreelanceGuru AI is committed to protecting your privacy. This policy explains how we handle data when you use our AI tools designed for Pakistani freelancers."
    },
    {
      title: "2. Data We Collect",
      content: "We collect minimal usage data and form inputs to provide our services. Form inputs (like skills, names, and project details) are processed in real-time and are not stored permanently on our servers. We also collect basic browser information for analytics."
    },
    {
      title: "3. API Usage",
      content: "Client Hunter: Uses the Foursquare API for location-based business search. Data processed is subject to Foursquare's privacy policy.\n\nProposal Writer: Prompts are sent directly to Google Gemini AI servers to generate content and are subject to Google's privacy policy."
    },
    {
      title: "4. Cookies & Local Storage",
      content: "We use local storage strictly for functional purposes, such as saving your dark/light mode preference and storing your saved leads locally on your device."
    },
    {
      title: "5. How We Use Your Data",
      content: "Your data is used solely to provide AI-powered services to you, return accurate search results, generate relevant proposals, and improve the overall app experience."
    },
    {
      title: "6. User Rights",
      content: "Because we store data locally on your device, you have full control over it. You can clear your saved data at any time by clearing your browser's local storage."
    },
    {
      title: "7. Third-Party Services",
      content: "Our app relies on third-party services, primarily Foursquare and Google Gemini AI, to function. We do not sell or share your data with any other third parties."
    },
    {
      title: "8. Contact",
      content: "If you have any questions about this Privacy Policy, please contact us at ahsanchilll56@gmail.com."
    },
    {
      title: "9. Changes to This Policy",
      content: "We may update this policy occasionally to reflect changes in our services or legal requirements. Please review it periodically."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-4 py-16 max-w-4xl"
    >
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Privacy Policy</h1>
        <p className="text-xl text-muted-foreground">Last Updated: June 2026</p>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <div 
            key={index}
            className="glass-card p-6 md:p-8 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 gradient-bg" />
            <h2 className="text-xl font-bold mb-4 text-white">{section.title}</h2>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}