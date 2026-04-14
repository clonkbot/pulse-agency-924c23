import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

// Type definitions
interface Service {
  _id: Id<"services">;
  category: string;
  title: string;
  description: string;
  features: string[];
  price?: string;
  isActive: boolean;
  order: number;
}

interface Testimonial {
  _id: Id<"testimonials">;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  content: string;
  rating: number;
  isVisible: boolean;
  createdAt: number;
}

interface Stat {
  _id: Id<"stats">;
  label: string;
  value: string;
  order: number;
}

// Auth Modal Component
function AuthModal({ onClose }: { onClose: () => void }) {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
      onClose();
    } catch {
      setError(flow === "signIn" ? "Invalid credentials" : "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0a0a0a] border border-[#222] p-6 md:p-8 w-full max-w-md animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#666] hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="font-display text-2xl md:text-3xl mb-2">
          {flow === "signIn" ? "Welcome back" : "Join PULSE"}
        </h2>
        <p className="text-[#888] text-sm mb-6">
          {flow === "signIn" ? "Sign in to your account" : "Create your account"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="flow" type="hidden" value={flow} />

          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full bg-transparent border border-[#333] px-4 py-3 text-white placeholder-[#666] focus:border-[#BFFF00] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              minLength={6}
              className="w-full bg-transparent border border-[#333] px-4 py-3 text-white placeholder-[#666] focus:border-[#BFFF00] focus:outline-none transition-colors"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#BFFF00] text-black font-medium py-3 hover:bg-[#d4ff4d] transition-colors disabled:opacity-50"
          >
            {loading ? "..." : flow === "signIn" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
            className="text-[#888] text-sm hover:text-white transition-colors"
          >
            {flow === "signIn" ? "Need an account? Sign up" : "Have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Contact Form Component
function ContactForm({ onSuccess }: { onSuccess: () => void }) {
  const submitInquiry = useMutation(api.inquiries.submit);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    await submitInquiry({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string || undefined,
      serviceType: formData.get("serviceType") as string,
      message: formData.get("message") as string,
    });

    setLoading(false);
    setSubmitted(true);
    onSuccess();
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-[#BFFF00] mx-auto mb-6 flex items-center justify-center">
          <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-2xl mb-2">Message Sent</h3>
        <p className="text-[#888]">We'll be in touch within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          type="text"
          placeholder="Name *"
          required
          className="w-full bg-transparent border border-[#333] px-4 py-3 text-white placeholder-[#666] focus:border-[#BFFF00] focus:outline-none transition-colors"
        />
        <input
          name="email"
          type="email"
          placeholder="Email *"
          required
          className="w-full bg-transparent border border-[#333] px-4 py-3 text-white placeholder-[#666] focus:border-[#BFFF00] focus:outline-none transition-colors"
        />
      </div>
      <input
        name="company"
        type="text"
        placeholder="Company"
        className="w-full bg-transparent border border-[#333] px-4 py-3 text-white placeholder-[#666] focus:border-[#BFFF00] focus:outline-none transition-colors"
      />
      <select
        name="serviceType"
        required
        className="w-full bg-transparent border border-[#333] px-4 py-3 text-white focus:border-[#BFFF00] focus:outline-none transition-colors appearance-none cursor-pointer"
        defaultValue=""
      >
        <option value="" disabled className="bg-[#0a0a0a]">Select a service *</option>
        <option value="marketing" className="bg-[#0a0a0a]">Marketing Services</option>
        <option value="development" className="bg-[#0a0a0a]">Development Services</option>
        <option value="seo" className="bg-[#0a0a0a]">SEO Services</option>
        <option value="multiple" className="bg-[#0a0a0a]">Multiple Services</option>
      </select>
      <textarea
        name="message"
        placeholder="Tell us about your project *"
        required
        rows={4}
        className="w-full bg-transparent border border-[#333] px-4 py-3 text-white placeholder-[#666] focus:border-[#BFFF00] focus:outline-none transition-colors resize-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#BFFF00] text-black font-medium py-4 hover:bg-[#d4ff4d] transition-colors disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

// Service Card Component
function ServiceCard({
  title,
  description,
  features,
  price,
  index
}: {
  title: string;
  description: string;
  features: string[];
  price?: string;
  index: number;
}) {
  return (
    <div
      className="group border border-[#222] p-6 md:p-8 hover:border-[#BFFF00] transition-all duration-500 animate-fade-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <h3 className="font-display text-xl md:text-2xl mb-3 group-hover:text-[#BFFF00] transition-colors">
        {title}
      </h3>
      <p className="text-[#888] text-sm md:text-base mb-6 leading-relaxed">
        {description}
      </p>
      <ul className="space-y-2 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <span className="w-1 h-1 bg-[#BFFF00]" />
            <span className="text-[#ccc]">{feature}</span>
          </li>
        ))}
      </ul>
      {price && (
        <div className="pt-4 border-t border-[#222]">
          <span className="text-[#BFFF00] font-medium">{price}</span>
        </div>
      )}
    </div>
  );
}

// Testimonial Card
function TestimonialCard({
  clientName,
  clientRole,
  clientCompany,
  content,
  index
}: {
  clientName: string;
  clientRole: string;
  clientCompany: string;
  content: string;
  index: number;
}) {
  return (
    <div
      className="border border-[#222] p-6 md:p-8 animate-fade-up"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <p className="text-lg md:text-xl mb-6 leading-relaxed">"{content}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#BFFF00] flex items-center justify-center text-black font-display text-lg">
          {clientName.charAt(0)}
        </div>
        <div>
          <div className="font-medium">{clientName}</div>
          <div className="text-[#888] text-sm">{clientRole}, {clientCompany}</div>
        </div>
      </div>
    </div>
  );
}

// Main App
export default function App() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { signOut } = useAuthActions();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("marketing");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Queries
  const services = useQuery(api.services.list);
  const testimonials = useQuery(api.testimonials.list);
  const stats = useQuery(api.stats.list);

  // Seed mutations
  const seedServices = useMutation(api.services.seed);
  const seedTestimonials = useMutation(api.testimonials.seed);
  const seedStats = useMutation(api.stats.seed);

  // Seed data on first load
  useEffect(() => {
    seedServices();
    seedTestimonials();
    seedStats();
  }, [seedServices, seedTestimonials, seedStats]);

  const marketingServices = services?.filter((s: Service) => s.category === "marketing") || [];
  const developmentServices = services?.filter((s: Service) => s.category === "development") || [];
  const seoServices = services?.filter((s: Service) => s.category === "seo") || [];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-body">
      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="font-display text-xl md:text-2xl tracking-tight">
              PULSE<span className="text-[#BFFF00]">.</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection("services")} className="text-sm text-[#888] hover:text-white transition-colors">
                Services
              </button>
              <button onClick={() => scrollToSection("work")} className="text-sm text-[#888] hover:text-white transition-colors">
                Work
              </button>
              <button onClick={() => scrollToSection("contact")} className="text-sm text-[#888] hover:text-white transition-colors">
                Contact
              </button>
              {authLoading ? (
                <div className="w-20 h-10 bg-[#1a1a1a] animate-pulse" />
              ) : isAuthenticated ? (
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 border border-[#333] text-sm hover:border-[#BFFF00] hover:text-[#BFFF00] transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-[#BFFF00] text-black text-sm font-medium hover:bg-[#d4ff4d] transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#1a1a1a] bg-[#0a0a0a]">
            <div className="px-4 py-4 space-y-4">
              <button onClick={() => scrollToSection("services")} className="block w-full text-left py-2 text-[#888] hover:text-white">
                Services
              </button>
              <button onClick={() => scrollToSection("work")} className="block w-full text-left py-2 text-[#888] hover:text-white">
                Work
              </button>
              <button onClick={() => scrollToSection("contact")} className="block w-full text-left py-2 text-[#888] hover:text-white">
                Contact
              </button>
              {isAuthenticated ? (
                <button onClick={() => signOut()} className="block w-full text-left py-2 text-[#BFFF00]">
                  Sign Out
                </button>
              ) : (
                <button onClick={() => { setShowAuthModal(true); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-[#BFFF00]">
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center pt-20 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="mb-8 animate-fade-up">
            <span className="inline-block px-3 py-1 border border-[#333] text-xs tracking-wider text-[#888]">
              DIGITAL AGENCY
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.9] tracking-tight mb-8 animate-fade-up animation-delay-100">
            WE BUILD<br />
            <span className="text-[#BFFF00]">BRANDS</span> THAT<br />
            BREAK THROUGH
          </h1>

          <p className="max-w-xl text-[#888] text-base md:text-lg mb-12 animate-fade-up animation-delay-200">
            Marketing that moves culture. Development that scales. SEO that dominates.
            PULSE is your unfair advantage in the digital arena.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animation-delay-300">
            <button
              onClick={() => scrollToSection("contact")}
              className="px-8 py-4 bg-[#BFFF00] text-black font-medium hover:bg-[#d4ff4d] transition-colors"
            >
              Start a Project
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="px-8 py-4 border border-[#333] hover:border-[#BFFF00] hover:text-[#BFFF00] transition-colors"
            >
              View Services
            </button>
          </div>
        </div>

        {/* Marquee */}
        <div className="border-y border-[#1a1a1a] overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap py-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 mx-8">
                {["MEME MARKETING", "INFLUENCER CAMPAIGNS", "GIF CREATION", "WEB DEVELOPMENT", "AUTOMATION", "SEO", "DEBUGGING", "OPTIMIZATION"].map((text, j) => (
                  <span key={j} className="font-display text-xl md:text-2xl text-[#333] flex items-center gap-8">
                    {text}
                    <span className="w-2 h-2 bg-[#BFFF00]" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {(stats || []).map((stat: Stat, i: number) => (
              <div key={stat._id} className="text-center md:text-left animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="font-display text-3xl sm:text-4xl md:text-5xl text-[#BFFF00] mb-2">{stat.value}</div>
                <div className="text-[#888] text-xs md:text-sm tracking-wider uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
            <div>
              <span className="text-[#BFFF00] text-xs tracking-wider mb-4 block">SERVICES</span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl">What We Do</h2>
            </div>

            {/* Service Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {[
                { id: "marketing", label: "Marketing" },
                { id: "development", label: "Development" },
                { id: "seo", label: "SEO" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`px-4 md:px-6 py-2 md:py-3 text-sm whitespace-nowrap transition-colors ${
                    activeSection === tab.id
                      ? "bg-[#BFFF00] text-black"
                      : "border border-[#333] hover:border-[#BFFF00]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {activeSection === "marketing" && marketingServices.map((service: Service, i: number) => (
              <ServiceCard key={service._id} {...service} index={i} />
            ))}
            {activeSection === "development" && developmentServices.map((service: Service, i: number) => (
              <ServiceCard key={service._id} {...service} index={i} />
            ))}
            {activeSection === "seo" && seoServices.map((service: Service, i: number) => (
              <ServiceCard key={service._id} {...service} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Work Section */}
      <section id="work" className="bg-[#050505] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="mb-12 md:mb-16">
            <span className="text-[#BFFF00] text-xs tracking-wider mb-4 block">TESTIMONIALS</span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl">Client Success</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {(testimonials || []).map((testimonial: Testimonial, i: number) => (
              <TestimonialCard key={testimonial._id} {...testimonial} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <span className="text-[#BFFF00] text-xs tracking-wider mb-4 block">GET IN TOUCH</span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">
                Let's Build<br />Something<br />
                <span className="text-[#BFFF00]">Remarkable</span>
              </h2>
              <p className="text-[#888] text-base md:text-lg mb-8 max-w-md">
                Ready to accelerate your growth? Tell us about your project and we'll get back to you within 24 hours.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-[#333] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#BFFF00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-[#888]">hello@pulseagency.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-[#333] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#BFFF00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-[#888]">San Francisco, CA</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0f0f0f] p-6 md:p-8 border border-[#1a1a1a]">
              <ContactForm onSuccess={() => {}} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="font-display text-xl">
              PULSE<span className="text-[#BFFF00]">.</span>
            </div>

            <div className="flex items-center gap-6">
              <a href="#" className="text-[#888] hover:text-white transition-colors text-sm">Twitter</a>
              <a href="#" className="text-[#888] hover:text-white transition-colors text-sm">LinkedIn</a>
              <a href="#" className="text-[#888] hover:text-white transition-colors text-sm">Instagram</a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#1a1a1a] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#555] text-xs">
              &copy; {new Date().getFullYear()} PULSE Agency. All rights reserved.
            </p>
            <p className="text-[#444] text-xs">
              Requested by @web-user · Built by @clonkbot
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
