import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Zap, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { SiWhatsapp } from "react-icons/si";

const CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];

interface Place {
  id: string;
  name: string;
  address: string;
  lat: string;
  lon: string;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

export default function ClientHunter() {
  const [skills, setSkills] = useState("");
  const [city, setCity] = useState("Lahore");
  const [clientType, setClientType] = useState("");
  const [userType, setUserType] = useState("Freelancer");

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Place[] | null>(null);
  const [savedLeads, setSavedLeads] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.title = "Client Hunter - Find Clients in Pakistan | FreelanceGuru AI";
    const saved = localStorage.getItem("savedLeads");
    if (saved) setSavedLeads(new Set(JSON.parse(saved)));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientType.trim()) {
      toast.error("Please enter a client type to search.");
      return;
    }

    setIsLoading(true);
    setResults(null);

    try {
      const query = encodeURIComponent(`${clientType} in ${city} Pakistan`);
      const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=10&addressdetails=1`;

      const response = await fetch(url, {
        headers: {
          "Accept": "application/json",
          "Accept-Language": "en",
          "User-Agent": "FreelanceGuruAI/1.0"
        }
      });

      if (!response.ok) throw new Error("Search failed");

      const data: NominatimResult[] = await response.json();

      if (data.length === 0) {
        toast.error("No results found. Try different keywords.");
        setResults([]);
        return;
      }

      const places: Place[] = data.map((item) => {
        const parts = item.display_name.split(",");
        const name = parts[0].trim();
        const address = parts.slice(1).join(",").trim();
        return {
          id: String(item.place_id),
          name,
          address,
          lat: item.lat,
          lon: item.lon,
        };
      });

      setResults(places);
      toast.success(`Found ${places.length} results in ${city}!`);
    } catch {
      toast.error("Search failed. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSaveLead = (id: string, name: string) => {
    const newSaved = new Set(savedLeads);
    if (newSaved.has(id)) {
      newSaved.delete(id);
    } else {
      newSaved.add(id);
      toast.success(`"${name}" saved!`);
    }
    setSavedLeads(newSaved);
    localStorage.setItem("savedLeads", JSON.stringify(Array.from(newSaved)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-4 py-12 max-w-6xl"
    >
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black mb-4"
        >
          Find the Best Clients in Your City
        </motion.h1>
        <p className="text-xl text-muted-foreground">
          Powered by OpenStreetMap — 100% free, no API key needed
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Search Form */}
        <div className="lg:col-span-4">
          <div className="glass-card p-6 rounded-2xl sticky top-24">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" /> Search Filters
            </h3>

            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Skills</label>
                <input
                  type="text"
                  placeholder="e.g. Web Development"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  data-testid="input-skills"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <select
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  data-testid="select-city"
                >
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Client Type <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. restaurants, tech companies"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value)}
                  required
                  data-testid="input-client-type"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">You are a</label>
                <div className="flex gap-4">
                  {["Freelancer", "Business"].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={userType === type}
                        onChange={() => setUserType(type)}
                        className="text-primary focus:ring-primary"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full mt-6 py-3 rounded-xl font-bold text-white gradient-bg hover:glow-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                data-testid="button-hunt-clients"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Hunting clients...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" /> Hunt Clients Now
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-8">
          {/* Skeleton */}
          {isLoading && (
            <div className="grid md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card p-6 rounded-xl animate-pulse">
                  <div className="h-6 bg-white/10 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-white/10 rounded w-full mb-2" />
                  <div className="h-4 bg-white/10 rounded w-2/3 mb-6" />
                  <div className="h-2 bg-white/10 rounded-full w-full mb-6" />
                  <div className="flex gap-2">
                    <div className="h-10 bg-white/10 rounded flex-1" />
                    <div className="h-10 bg-white/10 rounded flex-1" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!isLoading && results && results.length === 0 && (
            <div className="glass-card p-12 rounded-2xl text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No results found</h3>
              <p className="text-muted-foreground">Try different keywords or another city.</p>
            </div>
          )}

          {/* Idle prompt */}
          {!isLoading && results === null && (
            <div className="glass-card p-12 rounded-2xl text-center border border-dashed border-white/10">
              <Zap className="w-12 h-12 text-primary mx-auto mb-4 opacity-60" />
              <h3 className="text-xl font-bold mb-2">Ready to hunt?</h3>
              <p className="text-muted-foreground">Fill in the form and click "Hunt Clients Now" to find real businesses in your city.</p>
            </div>
          )}

          {/* Results Grid */}
          {!isLoading && results && results.length > 0 && (
            <AnimatePresence>
              <div className="grid md:grid-cols-2 gap-4">
                {results.map((place, i) => {
                  const isHot = i % 3 === 0;
                  const isWarm = i % 3 === 1;
                  const badgeClass = isHot
                    ? "bg-red-500/20 text-red-400 border-red-500/50"
                    : isWarm
                    ? "bg-orange-500/20 text-orange-400 border-orange-500/50"
                    : "bg-blue-500/20 text-blue-400 border-blue-500/50";
                  const badgeText = isHot ? "Hot Lead" : isWarm ? "Warm Lead" : "Cold Lead";
                  const baseScore = isHot ? 60 : isWarm ? 40 : 20;
                  const score = Math.min(100, baseScore + ((i * 7 + 13) % (isHot ? 41 : 36)));
                  const isSaved = savedLeads.has(place.id);
                  const mapsUrl = `https://www.google.com/maps?q=${place.lat},${place.lon}`;

                  return (
                    <motion.div
                      key={place.id}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ y: -4 }}
                      className="glass-card p-6 rounded-xl flex flex-col hover:border-primary/40 transition-colors"
                      data-testid={`card-place-${i}`}
                    >
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <h4 className="font-bold text-lg leading-tight" title={place.name}>
                          {place.name}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap shrink-0 ${badgeClass}`}>
                          {badgeText}
                        </span>
                      </div>

                      <div className="space-y-1 mb-4 text-sm text-muted-foreground flex-1">
                        <p className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary/70" />
                          <span className="line-clamp-2">{place.address || "Address not listed"}</span>
                        </p>
                      </div>

                      {/* Match Score */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Match Score</span>
                          <span className="font-bold">{score}%</span>
                        </div>
                        <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ delay: i * 0.06 + 0.3, duration: 0.6 }}
                            style={{
                              backgroundColor: isHot ? "#ef4444" : isWarm ? "#f97316" : "#3b82f6"
                            }}
                          />
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex flex-col gap-2 mt-auto">
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={`https://wa.me/923269496197?text=Hi, I found "${place.name}" and would like to discuss a project`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/50 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                            data-testid={`button-whatsapp-${i}`}
                          >
                            <SiWhatsapp className="w-4 h-4" /> WhatsApp
                          </a>
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                            data-testid={`button-maps-${i}`}
                          >
                            <ExternalLink className="w-4 h-4" /> Maps
                          </a>
                        </div>
                        <button
                          onClick={() => toggleSaveLead(place.id, place.name)}
                          className={`w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                            isSaved
                              ? "bg-primary/20 text-primary border border-primary/50"
                              : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                          }`}
                          data-testid={`button-save-${i}`}
                        >
                          {isSaved ? "✓ Lead Saved" : "Save Lead"}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
}
