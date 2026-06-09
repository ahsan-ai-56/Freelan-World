import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { MapPin, Mail, Send } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Contact | FreelanceGuru AI";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message sent! We'll respond within 24 hours.");
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("ahsanchilll56@gmail.com");
    toast.success("Copied to clipboard!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-4 py-12 max-w-5xl min-h-[80vh] flex flex-col justify-center"
    >
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Get in Touch</h1>
        <p className="text-xl text-muted-foreground">We'd love to hear from you</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Contact Form */}
        <div className="glass-card p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                required
                type="text"
                className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                required
                type="email"
                className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                required
                rows={5}
                className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl font-bold text-white gradient-bg hover:glow-primary transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" /> Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <a 
            href="https://wa.me/923269496197" 
            target="_blank" 
            rel="noopener noreferrer"
            className="glass-card p-6 rounded-2xl flex items-center gap-6 group hover:border-[#25D366]/50 transition-colors cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
              <SiWhatsapp className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-[#25D366] transition-colors">Chat with us</h3>
              <p className="text-muted-foreground">+92 326 9496197</p>
            </div>
          </a>

          <div 
            onClick={copyEmail}
            className="glass-card p-6 rounded-2xl flex items-center gap-6 group hover:border-primary/50 transition-colors cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Mail className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">Email Us</h3>
              <p className="text-muted-foreground">ahsanchilll56@gmail.com</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <MapPin className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Location</h3>
              <p className="text-muted-foreground">Pakistan</p>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20 text-center text-primary font-medium">
            We aim to respond to all inquiries within 24 hours.
          </div>
        </div>
      </div>
    </motion.div>
  );
}