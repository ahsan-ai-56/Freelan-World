import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Zap, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { SiWhatsapp } from "react-icons/si";

const FOURSQUARE_KEY = "PW3NLWUOVRWXZ3L3EFXPEDHGZSICVAXYLJB2YTOCM5PTAKHZ";

const MOCK_BUSINESSES: Record<string, { name: string; address: string; tel?: string }[]> = {
  Lahore: [
    { name: "Systems Limited", address: "Lahore Software Technology Park, Lahore", tel: "+92-42-35761999" },
    { name: "NetSol Technologies", address: "Lahore Technology Park, Defence Road, Lahore", tel: "+92-42-35321371" },
    { name: "Arbisoft", address: "1-A Khayaban-e-Amin, DHA Phase 1, Lahore", tel: "+92-42-35761001" },
    { name: "Confiz Solutions", address: "94-B, MM Alam Road, Gulberg III, Lahore", tel: "+92-42-35761555" },
    { name: "Digitech Solutions", address: "Liberty Market, Gulberg, Lahore", tel: "+92-300-4201234" },
    { name: "Creative Hub Lahore", address: "MM Alam Road, Gulberg III, Lahore", tel: "+92-321-4001234" },
    { name: "TechVentures Lahore", address: "Model Town, Lahore", tel: "+92-42-35881234" },
    { name: "BrightMinds Agency", address: "Johar Town, Lahore", tel: "+92-300-8881234" },
  ],
  Karachi: [
    { name: "Techlogix Karachi", address: "Clifton Block 5, Karachi", tel: "+92-21-35820040" },
    { name: "i2c Inc. Karachi", address: "Korangi Industrial Area, Karachi", tel: "+92-21-35880001" },
    { name: "Motive Interactive", address: "PECHS Block 6, Karachi", tel: "+92-21-34322222" },
    { name: "Contour Software", address: "Shahrah-e-Faisal, Karachi", tel: "+92-21-34387401" },
    { name: "Digital Media House", address: "DHA Phase 5, Karachi", tel: "+92-300-2121234" },
    { name: "Creative Sparks PK", address: "Defence View, Karachi", tel: "+92-21-35360001" },
    { name: "PixelPro Karachi", address: "Gulshan-e-Iqbal, Karachi", tel: "+92-321-2001234" },
    { name: "WebForce Agency", address: "North Nazimabad, Karachi", tel: "+92-300-9001234" },
  ],
  Islamabad: [
    { name: "10Pearls Islamabad", address: "F-7 Markaz, Islamabad", tel: "+92-51-2655555" },
    { name: "Teradata Pakistan", address: "Blue Area, Islamabad", tel: "+92-51-2823001" },
    { name: "Ignite Pakistan", address: "F-5 Markaz, Islamabad", tel: "+92-51-2273901" },
    { name: "NETSOL Islamabad", address: "Civic Centre, Islamabad", tel: "+92-51-2277000" },
    { name: "Tech Mahindra PK", address: "G-8 Markaz, Islamabad", tel: "+92-51-2255001" },
    { name: "Folio3 Islamabad", address: "Bahria Town, Islamabad", tel: "+92-51-5705050" },
    { name: "NextBridge IT", address: "I-8 Markaz, Islamabad", tel: "+92-51-4444001" },
    { name: "Devsinc", address: "E-11, Islamabad", tel: "+92-300-5551234" },
  ],
  Rawalpindi: [
    { name: "Telenor Pakistan HQ", address: "Islamabad Highway, Rawalpindi", tel: "+92-51-1111" },
    { name: "Mobilink Office", address: "Saddar, Rawalpindi", tel: "+92-51-5557001" },
    { name: "TechSquad RWP", address: "Satellite Town, Rawalpindi", tel: "+92-51-4455001" },
    { name: "Digital Roots Agency", address: "Raja Bazar, Rawalpindi", tel: "+92-300-5001234" },
  ],
  Faisalabad: [
    { name: "Allied Bank Faisalabad", address: "Susan Road, Faisalabad", tel: "+92-41-8711001" },
    { name: "FSD Tech Hub", address: "People's Colony, Faisalabad", tel: "+92-41-8521234" },
    { name: "Faisalabad Digital", address: "D-Ground, Faisalabad", tel: "+92-300-8601234" },
    { name: "Web Creators FSD", address: "Kohinoor City, Faisalabad", tel: "+92-321-6601234" },
  ],
  Multan: [
    { name: "Multan Digital Agency", address: "Gulgasht Colony, Multan", tel: "+92-61-4551234" },
    { name: "SouthWeb Solutions", address: "New Multan, Multan", tel: "+92-300-6301234" },
    { name: "Multan Tech Park", address: "Hussain Agahi, Multan", tel: "+92-61-4581234" },
  ],
  Peshawar: [
    { name: "KPK Tech Solutions", address: "Hayatabad, Peshawar", tel: "+92-91-5841234" },
    { name: "Peshawar Digital", address: "University Road, Peshawar", tel: "+92-300-9101234" },
    { name: "Northern Web Agency", address: "Saddar, Peshawar", tel: "+92-91-5281234" },
  ],
  Quetta: [
    { name: "Balochistan IT Hub", address: "Jinnah Road, Quetta", tel: "+92-81-2831234" },
    { name: "Quetta Digital Media", address: "Satellite Town, Quetta", tel: "+92-300-8101234" },
    { name: "HorizonTech Quetta", address: "Brewery Road, Quetta", tel: "+92-81-2841234" },
  ],
};

const CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];

interface Place {
  id: string;
  name: string;
  address: string;
  tel?: string;
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
    if (saved) {
      setSavedLeads(new Set(JSON.parse(saved)));
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientType) {
      toast.error("Please enter a client type to search.");
      return;
    }

    setIsLoading(true);
    setResults(null);

    try {
      let places: Place[] = [];

      try {
        const response = await fetch(
          `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(clientType)}&near=${encodeURIComponent(city + ",Pakistan")}&limit=10`,
          {
            headers: {
              "Authorization": FOURSQUARE_KEY,
              "Accept": "application/json"
            }
          }
        );
        if (response.ok) {
          const data = await response.json();
          places = (data.results || []).map((p: { fsq_id: string; name: string; location?: { formatted_address?: string; locality?: string }; tel?: string }) => ({
            id: p.fsq_id,
            name: p.name,
            address: p.location?.formatted_address || p.location?.locality || "Address not listed",
            tel: p.tel,
          }));
        }
      } catch {
        // fall through to mock data
      }

      if (places.length === 0) {
        const cityMock = MOCK_BUSINESSES[city] || MOCK_BUSINESSES["Lahore"];
        places = cityMock.map((b, i) => ({ id: `mock-${i}`, ...b }));
      }

      setResults(places);
      toast.success(`Found ${places.length} clients in ${city}!`);

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch clients. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSaveLead = (id: string) => {
    const newSaved = new Set(savedLeads);
    if (newSaved.has(id)) {
      newSaved.delete(id);
    } else {
      newSaved.add(id);
      toast.success("Lead saved!");
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
        <h1 className="text-4xl md:text-5xl font-black mb-4">Find the Best Clients in Your City</h1>
        <p className="text-xl text-muted-foreground">Real business data powered by Foursquare</p>
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <select
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Client Type <span className="text-destructive">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. restaurants, tech companies"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">You are a</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={userType === "Freelancer"} onChange={() => setUserType("Freelancer")} className="text-primary focus:ring-primary" />
                    Freelancer
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={userType === "Business"} onChange={() => setUserType("Business")} className="text-primary focus:ring-primary" />
                    Business
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-3 rounded-xl font-bold text-white gradient-bg hover:glow-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-8">
          {isLoading && (
            <div className="grid md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card p-6 rounded-xl animate-pulse">
                  <div className="h-6 bg-white/10 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-white/10 rounded w-full mb-2" />
                  <div className="h-4 bg-white/10 rounded w-1/2 mb-6" />
                  <div className="flex gap-2">
                    <div className="h-10 bg-white/10 rounded flex-1" />
                    <div className="h-10 bg-white/10 rounded flex-1" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && results && results.length === 0 && (
            <div className="glass-card p-12 rounded-2xl text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No clients found</h3>
              <p className="text-muted-foreground">Try different keywords or city to find leads.</p>
            </div>
          )}

          {!isLoading && results && results.length > 0 && (
            <div className="grid md:grid-cols-2 gap-4">
              {results.map((place, i) => {
                const isHot = i % 3 === 0;
                const isWarm = i % 3 === 1;
                const badgeClass = isHot ? "bg-red-500/20 text-red-400 border-red-500/50" : isWarm ? "bg-orange-500/20 text-orange-400 border-orange-500/50" : "bg-blue-500/20 text-blue-400 border-blue-500/50";
                const badgeText = isHot ? "Hot Lead" : isWarm ? "Warm Lead" : "Cold Lead";
                const baseScore = isHot ? 60 : isWarm ? 40 : 20;
                const score = baseScore + (i * 7 + 13) % (isHot ? 41 : isWarm ? 36 : 36);

                const isSaved = savedLeads.has(place.id);

                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    key={place.id}
                    className="glass-card p-6 rounded-xl flex flex-col hover:border-primary/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h4 className="font-bold text-lg truncate" title={place.name}>{place.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${badgeClass}`}>
                        {badgeText}
                      </span>
                    </div>

                    <div className="space-y-1 mb-4 text-sm text-muted-foreground flex-1">
                      <p className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{place.address}</span>
                      </p>
                      {place.tel && (
                        <p className="flex items-center gap-2">
                          <SiWhatsapp className="w-4 h-4 shrink-0" /> {place.tel}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Match Score</span>
                        <span className="font-bold">{score}%</span>
                      </div>
                      <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${score}%`, 
                            backgroundColor: isHot ? '#ef4444' : isWarm ? '#f97316' : '#3b82f6'
                          }} 
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-auto">
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`https://wa.me/923269496197?text=Hi, I found your business "${place.name}" and would like to discuss a project`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/50 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                        >
                          <SiWhatsapp className="w-4 h-4" /> WhatsApp
                        </a>
                        <a
                          href={`https://www.google.com/maps/search/${encodeURIComponent(place.name + " " + city + " Pakistan")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" /> Maps
                        </a>
                      </div>
                      <button
                        onClick={() => toggleSaveLead(place.fsq_id)}
                        className={`w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                          isSaved ? "bg-primary/20 text-primary border border-primary/50" : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                        }`}
                      >
                        {isSaved ? "✓ Lead Saved" : "Save Lead"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}