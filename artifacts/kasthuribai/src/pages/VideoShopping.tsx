import { useState, useEffect } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CartToast } from "@/components/CartToast";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { 
  Video, 
  Phone, 
  PhoneOff, 
  Users, 
  Clock, 
  Star, 
  ShoppingBag, 
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  MessageCircle,
  Heart,
  Share2
} from "lucide-react";

interface Worker {
  id: number;
  name: string;
  role: string;
  rating: number;
  experience: string;
  specialties: string[];
  available: boolean;
  image: string;
}

const workers: Worker[] = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Senior Fashion Consultant",
    rating: 4.9,
    experience: "8 years",
    specialties: ["Women's Wear", "Festival Collection", "Bridal"],
    available: true,
    image: "👩‍💼"
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "Men's Fashion Expert",
    rating: 4.8,
    experience: "6 years",
    specialties: ["Men's Wear", "Formal", "Casual"],
    available: true,
    image: "👨‍💼"
  },
  {
    id: 3,
    name: "Anita Patel",
    role: "Kids Collection Specialist",
    rating: 4.9,
    experience: "5 years",
    specialties: ["Kids Wear", "Party Wear", "School Uniforms"],
    available: false,
    image: "👩‍🦰"
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Style Advisor",
    rating: 4.7,
    experience: "4 years",
    specialties: ["Trendy Outfits", "Accessories", "Color Matching"],
    available: true,
    image: "👨‍🦱"
  }
];

const features = [
  {
    icon: Video,
    title: "Live Video Shopping",
    description: "Connect face-to-face with our fashion experts through high-quality video calls"
  },
  {
    icon: ShoppingBag,
    title: "Real-time Product Showcase",
    description: "See products in detail as our staff shows them to you live"
  },
  {
    icon: MessageCircle,
    title: "Instant Assistance",
    description: "Get personalized recommendations and styling tips in real-time"
  },
  {
    icon: Heart,
    title: "Personalized Experience",
    description: "Enjoy a shopping experience tailored to your preferences and style"
  }
];

const steps = [
  {
    step: 1,
    title: "Choose an Expert",
    description: "Browse our available fashion consultants and select one that matches your needs"
  },
  {
    step: 2,
    title: "Start Video Call",
    description: "Click the call button to connect instantly with your chosen expert"
  },
  {
    step: 3,
    title: "Browse & Select",
    description: "Explore products together and get real-time feedback and recommendations"
  },
  {
    step: 4,
    title: "Complete Purchase",
    description: "Add items to your cart and checkout seamlessly during or after the call"
  }
];

export default function VideoShopping() {
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const startCall = (worker: Worker) => {
    setSelectedWorker(worker);
    setIsCallActive(true);
  };

  const endCall = () => {
    setIsCallActive(false);
    setSelectedWorker(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground font-body">Loading Video Shopping...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-gold/5 to-primary/10 py-12 sm:py-16 md:py-20 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-4 bg-gold/20 text-gold-foreground hover:bg-gold/30 border-gold/30">
                <Sparkles className="w-3 h-3 mr-1" />
                New Feature
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 sm:mb-6">
                Video Shopping
                <span className="block text-gold mt-2">Experience</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-body mb-8 sm:mb-10 max-w-2xl mx-auto">
                Connect with our fashion experts through live video calls. Get personalized styling advice, 
                see products up close, and shop from the comfort of your home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => document.getElementById('experts')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Video className="w-5 h-5 mr-2" />
                  Start Video Shopping
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 font-semibold px-8 py-6 text-base sm:text-lg rounded-full transition-all duration-300"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn How It Works
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Why Video Shopping?
              </h2>
              <p className="text-muted-foreground font-body max-w-2xl mx-auto">
                Experience the future of shopping with our innovative video shopping feature
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-gold/30 bg-gradient-to-br from-white to-secondary/30">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors duration-300">
                      <feature.icon className="w-6 h-6 text-primary group-hover:text-gold transition-colors duration-300" />
                    </div>
                    <CardTitle className="text-lg font-display font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="font-body text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-12 sm:py-16 bg-gradient-to-b from-secondary/30 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground font-body max-w-2xl mx-auto">
                Get started with video shopping in just 4 simple steps
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gold/50 to-transparent z-0"></div>
                  )}
                  <Card className="relative z-10 text-center hover:shadow-lg transition-all duration-300 bg-white">
                    <CardHeader className="pb-3">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-2xl font-bold text-white">{step.step}</span>
                      </div>
                      <CardTitle className="text-lg font-display font-semibold">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="font-body text-sm leading-relaxed">
                        {step.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Call Interface (when active) */}
        {isCallActive && selectedWorker && (
          <section className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
              {/* Video Header */}
              <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center text-2xl">
                    {selectedWorker.image}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{selectedWorker.name}</h3>
                    <p className="text-gray-400 text-sm">{selectedWorker.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Live
                  </Badge>
                  <span className="text-gray-400 text-sm">00:00</span>
                </div>
              </div>

              {/* Video Area */}
              <div className="relative aspect-video bg-gray-800">
                {/* Main Video (Expert) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-gold/30 flex items-center justify-center text-6xl mb-4 mx-auto">
                      {selectedWorker.image}
                    </div>
                    <p className="text-white text-lg font-semibold">{selectedWorker.name}</p>
                    <p className="text-gray-400">Connecting...</p>
                  </div>
                </div>

                {/* Self View (Small) */}
                <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-xl overflow-hidden shadow-lg border-2 border-gray-600">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center mx-auto mb-2">
                        <Video className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-400 text-sm">Your Camera</p>
                    </div>
                  </div>
                </div>

                {/* Product Showcase Area */}
                <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-xs">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Currently Viewing
                  </h4>
                  <div className="bg-white/20 rounded-lg p-3">
                    <p className="text-white text-sm">Silk Saree Collection</p>
                    <p className="text-gray-300 text-xs">Premium Quality</p>
                  </div>
                </div>
              </div>

              {/* Video Controls */}
              <div className="bg-gray-800 px-6 py-4">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className={`rounded-full w-14 h-14 p-0 ${isMuted ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'}`}
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className={`rounded-full w-14 h-14 p-0 ${!isVideoOn ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'}`}
                    onClick={() => setIsVideoOn(!isVideoOn)}
                  >
                    {isVideoOn ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full w-14 h-14 p-0 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  >
                    <Maximize className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full w-14 h-14 p-0 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full w-14 h-14 p-0 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  >
                    <Share2 className="w-6 h-6" />
                  </Button>
                  <Button
                    size="lg"
                    className="rounded-full px-8 bg-red-500 hover:bg-red-600 text-white"
                    onClick={endCall}
                  >
                    <PhoneOff className="w-5 h-5 mr-2" />
                    End Call
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Available Experts Section */}
        <section id="experts" className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Our Fashion Experts
              </h2>
              <p className="text-muted-foreground font-body max-w-2xl mx-auto">
                Connect with our experienced fashion consultants for personalized shopping assistance
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {workers.map((worker) => (
                <Card 
                  key={worker.id} 
                  className={`group hover:shadow-xl transition-all duration-300 overflow-hidden ${!worker.available ? 'opacity-60' : ''}`}
                >
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-gold/20 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center text-5xl shadow-lg">
                        {worker.image}
                      </div>
                    </div>
                    {worker.available ? (
                      <Badge className="absolute top-3 right-3 bg-green-500/90 text-white border-0">
                        <span className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse"></span>
                        Available
                      </Badge>
                    ) : (
                      <Badge className="absolute top-3 right-3 bg-gray-500/90 text-white border-0">
                        <Clock className="w-3 h-3 mr-1.5" />
                        Busy
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-display font-semibold">{worker.name}</CardTitle>
                    <CardDescription className="font-body text-sm">{worker.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-gold">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">{worker.rating}</span>
                      </div>
                      <span className="text-muted-foreground">{worker.experience} exp.</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {worker.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs font-body">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      className={`w-full rounded-full font-semibold transition-all duration-300 ${
                        worker.available 
                          ? 'bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!worker.available}
                      onClick={() => worker.available && startCall(worker)}
                    >
                      {worker.available ? (
                        <>
                          <Phone className="w-4 h-4 mr-2" />
                          Start Video Call
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 mr-2" />
                          Currently Busy
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-primary to-gold">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Ready to Experience Video Shopping?
            </h2>
            <p className="text-white/90 font-body text-lg mb-8 max-w-2xl mx-auto">
              Connect with our fashion experts now and discover the perfect outfits for any occasion. 
              Get personalized styling advice from the comfort of your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => document.getElementById('experts')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Video className="w-5 h-5 mr-2" />
                Start Shopping Now
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-full transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 sm:py-16 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 border-primary/30">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Benefits
                </Badge>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                  Shop Smarter with Video Shopping
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">See Products in Detail</h4>
                      <p className="text-muted-foreground text-sm">Get a close-up view of fabrics, colors, and craftsmanship before buying</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Expert Styling Advice</h4>
                      <p className="text-muted-foreground text-sm">Get personalized recommendations based on your preferences and occasion</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Save Time</h4>
                      <p className="text-muted-foreground text-sm">Shop from home without the hassle of visiting multiple stores</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Instant Answers</h4>
                      <p className="text-muted-foreground text-sm">Get all your questions answered in real-time by our fashion experts</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-gold/20 rounded-3xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <Video className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-foreground mb-2">Start Your Journey</h3>
                    <p className="text-muted-foreground">Connect with experts today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer />
      <CartToast />
      <FloatingWhatsApp />
    </div>
  );
}
