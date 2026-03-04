import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Menu as MenuIcon, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ChevronRight, 
  Star, 
  MapPin, 
  Phone, 
  Instagram, 
  MessageCircle,
  Clock,
  Cake,
  Utensils,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRODUCTS, type Product, type CartItem } from './types';
import { cn } from './lib/utils';

const BUSINESS_INFO = {
  name: 'RR Bakers',
  location: 'Alur Road, Guntakal',
  phone: '8977177006',
  whatsapp: '918977177006',
  tagline: 'Finest Bakery in Guntakal'
};

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('rr_bakers_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Cakes' | 'Cupcakes' | 'Desserts' | 'Beverages'>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    localStorage.setItem('rr_bakers_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((window.scrollY / totalHeight) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;
    
    let message = `*Order from RR Bakers Website*\n\n`;
    cart.forEach(item => {
      message += `• ${item.name} x ${item.quantity} - ₹${item.price * item.quantity}\n`;
    });
    message += `\n*Total: ₹${cartTotal}*\n\nPlease confirm my order.`;
    
    const url = `https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6b0f1a', '#d4af37', '#fff5e6']
    });
  };

  const handleCustomCakeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    let message = `*Custom Cake Request*\n\n`;
    message += `*Name:* ${data.name}\n`;
    message += `*Phone:* ${data.phone}\n`;
    message += `*Flavor:* ${data.flavor}\n`;
    message += `*Weight:* ${data.weight}\n`;
    message += `*Message on Cake:* ${data.cakeMessage}\n`;
    message += `*Delivery Date:* ${data.deliveryDate}\n`;
    message += `*Instructions:* ${data.instructions}\n`;
    
    const url = `https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6b0f1a', '#d4af37', '#fff5e6']
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-cream flex flex-col items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Cake className="w-16 h-16 text-burgundy mx-auto mb-4 animate-bounce" />
          <h1 className="text-3xl font-serif text-burgundy">RR Bakers</h1>
          <p className="text-gold italic">Crafting sweetness...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-gold selection:text-burgundy">
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gold z-[60] transition-all duration-300" 
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cake className="text-burgundy w-8 h-8" />
            <span className="text-2xl font-serif font-bold tracking-tight text-burgundy">RR Bakers</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
            <a href="#home" className="hover:text-gold transition-colors">Home</a>
            <a href="#menu" className="hover:text-gold transition-colors">Menu</a>
            <a href="#custom" className="hover:text-gold transition-colors">Custom Cakes</a>
            <a href="#about" className="hover:text-gold transition-colors">About</a>
            <a href="#contact" className="hover:text-gold transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-burgundy/5 rounded-full transition-colors"
            >
              <ShoppingBag className="w-6 h-6 text-burgundy" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-burgundy text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-cream">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="md:hidden p-2">
              <MenuIcon className="w-6 h-6 text-burgundy" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1920" 
            alt="Bakery Hero" 
            className="w-full h-full object-cover blur-[2px] scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-4 block text-shadow-lg">
              {BUSINESS_INFO.tagline}
            </span>
            <h1 className="text-5xl md:text-8xl text-white font-serif mb-6 leading-tight text-shadow-xl">
              Finest Bakery in <br /> <span className="text-gold italic">Guntakal</span>
            </h1>
            <p className="text-white text-lg md:text-xl mb-10 font-medium max-w-2xl mx-auto text-shadow-lg">
              Freshly Baked Cakes, Custom Designs & Delicious Desserts crafted with love and premium ingredients.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="#menu" 
                className="w-full sm:w-auto px-10 py-4 bg-gold text-burgundy font-bold rounded-full hover:bg-white transition-all transform hover:scale-105"
              >
                Order Now
              </a>
              <a 
                href="#custom" 
                className="w-full sm:w-auto px-10 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-burgundy transition-all"
              >
                Custom Cakes
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {[
            { icon: Utensils, title: 'Fresh Ingredients', desc: 'Sourced daily for the best taste' },
            { icon: Cake, title: 'Custom Theme Cakes', desc: 'Your imagination, our creation' },
            { icon: Clock, title: 'Same Day Orders', desc: 'Available for selected items' },
            { icon: ShieldCheck, title: 'Hygienic Prep', desc: 'Safety and quality guaranteed' }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gold transition-colors">
                <feature.icon className="w-8 h-8 text-burgundy" />
              </div>
              <h3 className="text-xl font-serif mb-2">{feature.title}</h3>
              <p className="text-burgundy/60 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-serif mb-4">Our Delightful Menu</h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-8" />
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {['All', 'Cakes', 'Cupcakes', 'Desserts', 'Beverages'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as any)}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-medium transition-all",
                    activeCategory === cat 
                      ? "bg-burgundy text-white shadow-lg" 
                      : "bg-white text-burgundy hover:bg-gold/20"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {PRODUCTS.filter(p => activeCategory === 'All' || p.category === activeCategory).map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-burgundy/5"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-burgundy">
                      ₹{product.price}
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] uppercase tracking-widest text-gold font-bold mb-1 block">
                      {product.category}
                    </span>
                    <h3 className="text-lg font-serif mb-4 line-clamp-1">{product.name}</h3>
                    
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center bg-cream rounded-full px-2 py-1">
                        <button 
                          onClick={() => {}} // Placeholder for local qty state if needed
                          className="p-1 hover:text-gold"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">1</span>
                        <button className="p-1 hover:text-gold">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-burgundy text-white py-2 rounded-full text-sm font-bold hover:bg-gold hover:text-burgundy transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Custom Cake Order Section */}
      <section id="custom" className="py-24 px-4 md:px-8 bg-burgundy text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-4 block">Personalized Sweetness</span>
            <h2 className="text-4xl md:text-6xl font-serif mb-6">Dream it. <br /> We'll Bake it.</h2>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              From birthdays to weddings, our master bakers specialize in creating custom theme cakes that are as beautiful as they are delicious. Share your vision with us!
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                  <Star className="text-gold w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold">Premium Flavors</h4>
                  <p className="text-sm text-white/60">Over 20+ exotic flavors to choose from</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                  <Instagram className="text-gold w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold">Follow Our Work</h4>
                  <p className="text-sm text-white/60">Check out our latest designs on Instagram</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 text-burgundy shadow-2xl">
            <form onSubmit={handleCustomCakeSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest">Your Name</label>
                  <input name="name" required type="text" className="w-full px-4 py-3 rounded-xl bg-cream/50 border-none focus:ring-2 focus:ring-gold outline-none" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest">Phone Number</label>
                  <input name="phone" required type="tel" className="w-full px-4 py-3 rounded-xl bg-cream/50 border-none focus:ring-2 focus:ring-gold outline-none" placeholder="+91 00000 00000" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest">Flavor</label>
                  <select name="flavor" className="w-full px-4 py-3 rounded-xl bg-cream/50 border-none focus:ring-2 focus:ring-gold outline-none appearance-none">
                    <option>Chocolate Truffle</option>
                    <option>Red Velvet</option>
                    <option>Butterscotch</option>
                    <option>Pineapple</option>
                    <option>Black Forest</option>
                    <option>Custom Flavor</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest">Weight</label>
                  <select name="weight" className="w-full px-4 py-3 rounded-xl bg-cream/50 border-none focus:ring-2 focus:ring-gold outline-none appearance-none">
                    <option>1 kg</option>
                    <option>2 kg</option>
                    <option>3 kg</option>
                    <option>5 kg+</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest">Message on Cake</label>
                <input name="cakeMessage" type="text" className="w-full px-4 py-3 rounded-xl bg-cream/50 border-none focus:ring-2 focus:ring-gold outline-none" placeholder="Happy Birthday!" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest">Delivery Date</label>
                <input name="deliveryDate" required type="date" className="w-full px-4 py-3 rounded-xl bg-cream/50 border-none focus:ring-2 focus:ring-gold outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest">Special Instructions</label>
                <textarea name="instructions" rows={3} className="w-full px-4 py-3 rounded-xl bg-cream/50 border-none focus:ring-2 focus:ring-gold outline-none resize-none" placeholder="Any specific design or theme details..."></textarea>
              </div>

              <button type="submit" className="w-full bg-burgundy text-white py-4 rounded-xl font-bold hover:bg-gold hover:text-burgundy transition-all shadow-lg">
                Request Quote on WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 md:px-8 bg-cream/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif mb-4">What Our Customers Say</h2>
            <div className="w-24 h-1 bg-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Priya Sharma', text: 'The chocolate truffle cake was absolutely divine! Best bakery in Guntakal by far.', stars: 5 },
              { name: 'Rahul V.', text: 'Ordered a custom theme cake for my sons birthday. It looked exactly like the picture and tasted even better!', stars: 5 },
              { name: 'Anitha K.', text: 'Fresh, hygienic, and very professional service. Their cupcakes are a must-try!', stars: 5 }
            ].map((review, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-burgundy/5"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.stars)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-burgundy/80 italic mb-6 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center font-bold text-burgundy">
                    {review.name[0]}
                  </div>
                  <span className="font-bold text-sm">{review.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800" 
                alt="Bakery Story" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-gold p-8 rounded-3xl shadow-xl hidden md:block">
              <span className="text-4xl font-serif text-burgundy block mb-1">10+</span>
              <span className="text-xs uppercase tracking-widest font-bold text-burgundy/60">Years of Excellence</span>
            </div>
          </div>
          
          <div>
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold mb-4 block">Our Story</span>
            <h2 className="text-4xl md:text-6xl font-serif mb-8">Baked with Love in <br /> Guntakal</h2>
            <div className="space-y-6 text-burgundy/80 leading-relaxed">
              <p>
                RR Bakers started with a simple mission: to bring premium quality, freshly baked delights to the heart of Guntakal. What began as a small passion project has grown into the city's favorite destination for celebrations.
              </p>
              <p>
                Every cake we bake is a masterpiece, crafted with the finest ingredients and an unwavering commitment to quality. We believe that every celebration deserves a centerpiece that is as special as the moment itself.
              </p>
              <p>
                From our signature chocolate cakes to our artisanal cupcakes, we pour our heart into every creation, ensuring that RR Bakers remains synonymous with sweetness and joy in Guntakal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-4xl font-serif mb-8">Get in Touch</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <MapPin className="text-gold w-6 h-6 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Our Location</h4>
                    <p className="text-burgundy/60 text-sm">{BUSINESS_INFO.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="text-gold w-6 h-6 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">Call Us</h4>
                    <p className="text-burgundy/60 text-sm">{BUSINESS_INFO.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MessageCircle className="text-gold w-6 h-6 mt-1" />
                  <div>
                    <h4 className="font-bold mb-1">WhatsApp</h4>
                    <p className="text-burgundy/60 text-sm">Available for orders & queries</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 mt-12">
                <a href="#" className="w-12 h-12 rounded-full bg-cream flex items-center justify-center hover:bg-gold transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href={`tel:${BUSINESS_INFO.phone}`} className="w-12 h-12 rounded-full bg-cream flex items-center justify-center hover:bg-gold transition-colors">
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-2 h-[400px] rounded-3xl overflow-hidden shadow-inner border border-burgundy/5">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3856.541487661584!2d77.3683!3d15.1667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDEwJzAwLjEiTiA3N8KwMjInMDUuOSJF!5e0!3m2!1sen!2sin!4v1625567890123!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-burgundy text-white py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Cake className="text-gold w-8 h-8" />
              <span className="text-2xl font-serif font-bold tracking-tight">RR Bakers</span>
            </div>
            <p className="text-white/60 max-w-sm leading-relaxed">
              Crafting premium cakes and desserts in Guntakal. We bring sweetness to your celebrations with our artisanal creations.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-gold">Quick Links</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><a href="#home" className="hover:text-gold transition-colors">Home</a></li>
              <li><a href="#menu" className="hover:text-gold transition-colors">Menu</a></li>
              <li><a href="#custom" className="hover:text-gold transition-colors">Custom Cakes</a></li>
              <li><a href="#about" className="hover:text-gold transition-colors">About Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-gold">Contact</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li>{BUSINESS_INFO.location}</li>
              <li>{BUSINESS_INFO.phone}</li>
              <li>Open: 9 AM - 10 PM</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40 uppercase tracking-widest">
          <p>© 2024 RR Bakers. All Rights Reserved.</p>
          <p>Designed for Excellence</p>
        </div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-cream z-[80] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-burgundy/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-burgundy w-6 h-6" />
                  <h2 className="text-xl font-serif">Your Cart</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-burgundy/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-burgundy" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <ShoppingBag className="w-16 h-16 text-burgundy/10 mb-4" />
                    <p className="text-burgundy/40 font-medium">Your cart is empty</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 text-gold font-bold uppercase tracking-widest text-xs hover:underline"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <h4 className="font-serif text-sm">{item.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-burgundy/20 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-burgundy/60 mb-3">₹{item.price} per unit</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-white rounded-full px-2 py-1 border border-burgundy/5">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 hover:text-gold"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 hover:text-gold"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-bold text-sm">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-white border-t border-burgundy/10 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-burgundy/60">Subtotal</span>
                    <span className="font-medium">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-serif">
                    <span>Total</span>
                    <span className="text-burgundy font-bold">₹{cartTotal}</span>
                  </div>
                  <button 
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-burgundy text-white py-4 rounded-2xl font-bold hover:bg-gold hover:text-burgundy transition-all flex items-center justify-center gap-3 shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Place Order on WhatsApp
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${BUSINESS_INFO.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform animate-float"
      >
        <MessageCircle className="w-8 h-8" />
      </a>

      {/* Sticky Mobile View Cart */}
      {cartCount > 0 && !isCartOpen && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 md:hidden z-50"
        >
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-burgundy text-white py-4 rounded-2xl font-bold shadow-2xl flex items-center justify-between px-6"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5" />
              <span>View Cart ({cartCount})</span>
            </div>
            <span>₹{cartTotal}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
