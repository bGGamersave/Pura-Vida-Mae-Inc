/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Calendar, 
  Shield, 
  Info, 
  X, 
  Check, 
  ChevronRight,
  ChevronLeft,
  Car as CarIcon,
  Sparkles,
  Droplets,
  CreditCard,
  FileText,
  Camera,
  Upload,
  UserCheck,
  Smartphone,
  LogOut,
  Cpu,
  Bluetooth,
  Armchair,
  Sun,
  Battery,
  Zap,
  MessageSquare,
  Send,
  Printer,
  Save,
  Plus,
  User as UserIcon,
  Trash2,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { loadStripe } from '@stripe/stripe-js';
import { GoogleGenAI } from '@google/genai';
import { LeaseDetails } from './LeaseDetails';
import { AgreementDetails } from './AgreementDetails';

const Chatbot = ({ cars, user }: { cars: Car[], user: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Hi! I am the Pura Vida Mae assistant. How can I help you find the perfect vehicle today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const inventoryContext = cars.map(c => 
        `- ${c.make} ${c.model} (${c.year}): ${c.category}, $${c.pricePerDay}/day, Security Deposit: $${c.depositAmount || 500}. Features: ${c.features.join(', ')}. Location: ${c.location}`
      ).join('\n');

      const systemInstruction = `You are the expert AI assistant for Pura Vida Mae Inc., a luxury "Tesla-First" direct vehicle rental platform.
      
CORE IDENTITY:
- We are a direct rental provider, NOT a peer-to-peer marketplace. We own and manage the fleet.
- We offer a premium, seamless experience.

FEES & POLICIES:
- Security Deposit: Refundable deposit (typically $500, but varies by vehicle). Whitelisted users are exempt.
- Supercharging: Pass-through costs + $5 admin fee per rental.
- Idle/Congestion Fees: Renter is 100% liable for any idle/congestion fees at Tesla Superchargers.
- Cleaning Fee: No upfront fee, but a minimum $150 fee applies for severe messes (smoking, pet hair, deep stains).
- Cancellation: 100% refund within 24 hours of booking. 90% refund thereafter.
- Autopilot/FSD: Renter is 100% responsible for the vehicle at all times.
- Battery Care: Keep battery between 10% and 90% unless necessary for long trips.

APP FEATURES:
- Users can sign in via Google or Email to manage their profile (Name, DOB, Address, ID).
- Dashboard allows renters to view bookings, Check-In, Return, or Cancel.
- Admins have a Fleet Management tab to add/edit cars.
- PDF Generation for rental agreements is coming soon.

CURRENT INVENTORY:
${inventoryContext}

INSTRUCTIONS:
- Answer user questions accurately based on the above policies and inventory.
- Help users find a car based on their needs (e.g., range, seating capacity, price).
- Be concise, friendly, professional, and only recommend cars from the inventory provided.
- Do not make up policies or vehicles not listed here.`;

      const key = (import.meta as any).env.VITE_GEMINI_API_KEY || "";
      if (!key) {
        throw new Error("VITE_GEMINI_API_KEY is not defined in the environment. Please add it to your Settings > Secrets with the VITE_ prefix (VITE_GEMINI_API_KEY).");
      }

      const ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const conversationHistory = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n');
      const prompt = `${conversationHistory}\nUser: ${userMsg}\nAssistant:`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction
        }
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || 'Sorry, I could not process that.' }]);
    } catch (error: any) {
      console.error("Chatbot error:", error);
      const errorMessage = error.message || "";
      let friendlyText = 'Sorry, I am having trouble connecting right now. Please try again later.';
      
      if (errorMessage.includes("VITE_GEMINI_API_KEY")) {
        friendlyText = "I'm sorry, the chatbot assistant is currently unavailable. Please make sure that your **VITE_GEMINI_API_KEY** is configured in the **Settings > Secrets** panel of your AI Studio workspace.";
      } else if (errorMessage.includes("API key not valid")) {
        friendlyText = "I'm sorry, the chatbot assistant is currently unavailable because the configured VITE_GEMINI_API_KEY is invalid. Please check and update your API key in the **Settings > Secrets** panel of your AI Studio workspace.";
      } else if (errorMessage.includes("denied access") || errorMessage.includes("PERMISSION_DENIED")) {
        friendlyText = "I'm sorry, the chatbot assistant is currently unavailable because access was denied (403 PERMISSION_DENIED). Please ensure that your API key is correct and active in the **Settings > Secrets** panel of your AI Studio workspace.";
      } else if (errorMessage) {
        friendlyText = `I'm sorry, I encountered an error: ${errorMessage}. Please verify your API key is correct in **Settings > Secrets**.`;
      }
      
      setMessages(prev => [...prev, { role: 'model', text: friendlyText }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChat = async () => {
    if (!user) {
      alert("Please log in to save your conversation.");
      return;
    }
    if (messages.length <= 1) return;

    setIsSaving(true);
    try {
      await addDoc(collection(db, 'chats'), {
        userId: user.uid,
        messages: messages,
        createdAt: serverTimestamp(),
        title: `Chat on ${new Date().toLocaleDateString()}`
      });
      alert("Conversation saved to your profile!");
      setMessages([{ role: 'model', text: 'Hi! I am the Pura Vida Mae assistant. How can I help you find the perfect vehicle today?' }]);
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving chat:", error);
      alert("Failed to save conversation.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-zinc-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-zinc-800 transition-transform hover:scale-105 z-50"
      >
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden z-50 flex flex-col h-[500px] max-h-[80vh]"
          >
            <div className="bg-zinc-900 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <Sparkles size={16} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Pura Vida Assistant</h3>
                  <p className="text-[10px] text-zinc-400">AI-Powered Support</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {user && messages.length > 1 && (
                  <button 
                    onClick={handleSaveChat} 
                    disabled={isSaving}
                    className="text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                    title="Save Conversation"
                  >
                    <Save size={18} />
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-zinc-900 text-white rounded-tr-sm' 
                      : 'bg-white border border-zinc-200 text-zinc-700 rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-zinc-200 p-4 rounded-2xl rounded-tl-sm shadow-sm flex gap-1">
                    <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-zinc-100">
              <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-full p-1 pl-4">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about our vehicles..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm outline-none"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 bg-zinc-900 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors shrink-0"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
import { MOCK_CARS } from './constants';
import { Car, CarCategory, BookingDetails } from './types';
import { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged, collection, getDocs, getDoc, addDoc, onSnapshot, query, where, or, serverTimestamp, doc, updateDoc, setDoc, deleteDoc } from './firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return new Error(JSON.stringify(errInfo));
};
import { TermsModal } from './TermsModal';
import { AuthModal } from './AuthModal';
import { UserProfile } from './UserProfile';

import { AboutUs } from './AboutUs';
import { Team } from './Team';
import { HelpCenter } from './HelpCenter';
import { Safety } from './Safety';
import { Insurance } from './Insurance';
import { PrivacyPolicy } from './PrivacyPolicy';
import { TermsOfService } from './TermsOfService';

const stripePromise = loadStripe((import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const processImage = (file: File, targetWidth = 640, targetHeight = 360): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const TARGET_WIDTH = targetWidth;
        const TARGET_HEIGHT = targetHeight; // 16:9 aspect ratio
        canvas.width = TARGET_WIDTH;
        canvas.height = TARGET_HEIGHT;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No canvas context');

        const imgRatio = img.width / img.height;
        const targetRatio = TARGET_WIDTH / TARGET_HEIGHT;
        let drawWidth = img.width;
        let drawHeight = img.height;
        let offsetX = 0;
        let offsetY = 0;

        if (imgRatio > targetRatio) {
          drawWidth = img.height * targetRatio;
          offsetX = (img.width - drawWidth) / 2;
        } else {
          drawHeight = img.width / targetRatio;
          offsetY = (img.height - drawHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
        resolve(canvas.toDataURL('image/jpeg', 0.5)); // 50% quality JPEG to stay under 1MB Firestore limit
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

// --- Components ---

const Navbar = ({ view, setView, user, onLogin, onLogout, deferredPrompt, onInstall }: { view: string, setView: (v: 'browse' | 'dashboard' | 'profile' | 'about' | 'team' | 'help' | 'safety' | 'insurance' | 'privacy' | 'terms') => void, user: any, onLogin: () => void, onLogout: () => void, deferredPrompt: any, onInstall: () => void }) => (
  <nav className="sticky top-0 z-50 bg-[#EAD5A6]/80 backdrop-blur-md border-b border-zinc-900/10 px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-36 h-36 rounded-xl overflow-hidden flex items-center justify-center text-zinc-900">
        <img 
          src="/logo.png" 
          alt="Pura Vida Mae Logo" 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to icon if image fails to load
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.innerHTML = '<span style="font-size: 48px;">🦥</span>';
          }}
        />
      </div>
      <span className="text-xl font-bold tracking-tight text-zinc-900">PURA VIDA MAE</span>
    </div>
    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-800">
      <button onClick={() => setView('browse')} className={`hover:text-zinc-900 transition-colors ${view === 'browse' ? 'text-zinc-900 font-bold' : ''}`}>Home</button>
      <button onClick={() => setView('browse')} className={`hover:text-zinc-900 transition-colors ${view === 'browse' ? 'text-zinc-900 font-bold' : ''}`}>Leases</button>
      {user && (
        <button onClick={() => setView('dashboard')} className={`hover:text-zinc-900 transition-colors ${view === 'dashboard' ? 'text-zinc-900 font-bold' : ''}`}>Dashboard</button>
      )}
      <button 
        onClick={onInstall}
        className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-full hover:bg-zinc-800 transition-all shadow-sm group"
      >
        <Smartphone size={16} className="group-hover:scale-110 transition-transform" />
        <span>Install App</span>
      </button>
    </div>
    <div className="flex items-center gap-4">
      {user ? (
        <div className="flex items-center gap-4">
          <button 
            onClick={onInstall}
            className="md:hidden flex items-center justify-center w-10 h-10 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-all shadow-sm"
            title="Install App"
          >
            <Smartphone size={18} />
          </button>
          <button onClick={() => setView('dashboard')} className="md:hidden text-sm font-medium text-zinc-800 hover:text-zinc-900">Dashboard</button>
          <button onClick={() => setView('profile')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            {user.photoURL && <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />}
            <span className="text-sm font-medium text-zinc-900 hidden sm:block">{user.displayName || user.email}</span>
          </button>
          <button onClick={onLogout} className="text-zinc-700 hover:text-zinc-900 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      ) : (
        <>
          <button 
            onClick={onInstall}
            className="md:hidden flex items-center justify-center w-10 h-10 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-all shadow-sm"
            title="Install App"
          >
            <Smartphone size={18} />
          </button>
          <button onClick={onLogin} className="text-sm font-medium text-zinc-800 hover:text-zinc-900">Log in</button>
          <button onClick={onLogin} className="bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors">
            Sign up
          </button>
        </>
      )}
    </div>
  </nav>
);

const CustomCalendar = ({ 
  bookedDates = [], 
  startDate, 
  endDate, 
  onSelectDates 
}: { 
  bookedDates?: string[], 
  startDate: string, 
  endDate: string, 
  onSelectDates: (start: string, end: string) => void 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectingMode, setSelectingMode] = useState<'start' | 'end'>('start');
  const [tempStart, setTempStart] = useState<string>(startDate);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleDateClick = (dateStr: string) => {
    if (bookedDates.includes(dateStr)) return;
    
    if (selectingMode === 'start') {
      setTempStart(dateStr);
      onSelectDates(dateStr, dateStr);
      setSelectingMode('end');
    } else {
      const start = new Date(tempStart);
      const end = new Date(dateStr);
      
      // Prevent selecting if there are booked dates in between
      let hasBookedInRange = false;
      const minDate = start <= end ? start : end;
      const maxDate = start <= end ? end : start;
      
      for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
        const dStr = d.toISOString().split('T')[0];
        if (bookedDates.includes(dStr)) {
          hasBookedInRange = true;
          break;
        }
      }
      
      if (hasBookedInRange) {
        alert("Selection includes booked dates. Please try again.");
        setSelectingMode('start');
        return;
      }

      if (start <= end) {
        onSelectDates(tempStart, dateStr);
      } else {
        onSelectDates(dateStr, tempStart);
      }
      setSelectingMode('start');
    }
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-10"></div>);
  }

  const today = new Date();
  today.setHours(0,0,0,0);

  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    // Add timezone offset to fix local date casting
    const dateStr = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0')
    ].join('-');
    
    const isBooked = bookedDates.includes(dateStr);
    const isPast = d < today;
    const isDisabled = isBooked || isPast;
    
    const isStart = dateStr === startDate;
    const isEnd = dateStr === endDate;
    const isSelected = !isDisabled && startDate && endDate && dateStr >= startDate && dateStr <= endDate;

    days.push(
      <button
        key={dateStr}
        disabled={isDisabled}
        onClick={() => handleDateClick(dateStr)}
        className={`h-10 w-full flex items-center justify-center text-sm rounded-md transition-all
          ${isDisabled ? 'text-zinc-300 cursor-not-allowed line-through' : 'hover:bg-zinc-100'}
          ${isSelected && !isStart && !isEnd ? 'bg-zinc-100 text-zinc-900' : ''}
          ${(isStart || isEnd) ? 'bg-zinc-900 text-white font-bold shadow-md' : 'text-zinc-700'}
        `}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-1 hover:bg-zinc-100 rounded-full"><ChevronLeft size={20}/></button>
        <span className="font-bold text-zinc-900">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={nextMonth} className="p-1 hover:bg-zinc-100 rounded-full"><ChevronRight size={20}/></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-[10px] font-bold text-zinc-400 uppercase">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
      <div className="mt-4 flex justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-zinc-900 rounded-sm"></div> Selected</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 text-zinc-300 font-bold flex items-center justify-center line-through">24</div> Unavailable</div>
      </div>
    </div>
  );
};

const CarCard = React.forwardRef<HTMLDivElement, { car: Car, onSelect: (car: Car) => void }>(({ car, onSelect }, ref) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = car.images && car.images.length > 0 ? car.images : [car.image];

  return (
    <motion.div 
      ref={ref}
      layoutId={`car-${car.id}`}
      onClick={() => onSelect(car)}
      className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-zinc-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={images[currentImageIndex]} 
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {images.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev + 1) % images.length); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight size={16} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/50 hover:bg-white/80'}`}
                />
              ))}
            </div>
          </>
        )}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-zinc-900">
          {car.category}
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-zinc-900">{car.make} {car.model} {car.year}</h3>
            <div className="flex items-center gap-1 text-zinc-500 text-sm">
              <MapPin size={14} />
              <span>{car.location}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-zinc-900">${car.pricePerDay}</div>
            <div className="text-xs text-zinc-400">per day</div>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-zinc-50">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-zinc-900">{car.rating}</span>
            <span className="text-xs text-zinc-400">({car.trips} trips)</span>
          </div>
          <div className="text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded-md">
            Host: {car.hostName}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const RentalAgreement = ({ onAllAgreed }: { onAllAgreed: (agreed: boolean) => void }) => {
  const [agreements, setAgreements] = useState({
    term1: false,
    term2: false,
    term3: false,
    term4: false,
    term5: false,
  });

  useEffect(() => {
    const allAgreed = Object.values(agreements).every(Boolean);
    onAllAgreed(allAgreed);
  }, [agreements, onAllAgreed]);

  const toggleAgreement = (term: keyof typeof agreements) => {
    setAgreements(prev => ({ ...prev, [term]: !prev[term] }));
  };

  return (
    <div className="bg-zinc-50 rounded-2xl p-6 text-xs text-zinc-600 space-y-6 max-h-80 overflow-y-auto border border-zinc-200">
      <h4 className="font-bold text-zinc-900 uppercase tracking-widest text-[10px]">Standard Rental Agreement</h4>
      <p>
        This Rental Agreement ("Agreement") is entered into between the Host and the Guest. By booking this vehicle, you agree to the following terms:
      </p>
      
      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="mt-0.5">
            <input 
              type="checkbox" 
              checked={agreements.term1}
              onChange={() => toggleAgreement('term1')}
              className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
            />
          </div>
          <section>
            <h5 className="font-bold text-zinc-800 mb-1 group-hover:text-zinc-900 transition-colors">1. VEHICLE USE</h5>
            <p className="text-zinc-500">The vehicle shall be used solely for personal transport. Off-roading, racing, or commercial use is strictly prohibited unless explicitly authorized.</p>
          </section>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="mt-0.5">
            <input 
              type="checkbox" 
              checked={agreements.term2}
              onChange={() => toggleAgreement('term2')}
              className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
            />
          </div>
          <section>
            <h5 className="font-bold text-zinc-800 mb-1 group-hover:text-zinc-900 transition-colors">2. INSURANCE & LIABILITY</h5>
            <p className="text-zinc-500">Guest is responsible for the vehicle during the rental period. The selected insurance plan provides coverage as detailed in the policy documents. Guest is responsible for any deductible amounts.</p>
          </section>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="mt-0.5">
            <input 
              type="checkbox" 
              checked={agreements.term3}
              onChange={() => toggleAgreement('term3')}
              className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
            />
          </div>
          <section>
            <h5 className="font-bold text-zinc-800 mb-1 group-hover:text-zinc-900 transition-colors">3. CLEANING & MAINTENANCE</h5>
            <p className="text-zinc-500">Vehicle must be returned in the same condition as received. Cleaning and detailing fees are applied to ensure professional sanitization between rentals.</p>
          </section>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="mt-0.5">
            <input 
              type="checkbox" 
              checked={agreements.term4}
              onChange={() => toggleAgreement('term4')}
              className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
            />
          </div>
          <section>
            <h5 className="font-bold text-zinc-800 mb-1 group-hover:text-zinc-900 transition-colors">4. CANCELLATION POLICY</h5>
            <p className="text-zinc-500">Customers have a 24-hour grace period for free cancellations. If canceled after 24 hours, the business will retain 10% of the payment and refund the remaining 90%.</p>
          </section>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="mt-0.5">
            <input 
              type="checkbox" 
              checked={agreements.term5}
              onChange={() => toggleAgreement('term5')}
              className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
            />
          </div>
          <section>
            <h5 className="font-bold text-zinc-800 mb-1 group-hover:text-zinc-900 transition-colors">5. FUEL POLICY</h5>
            <p className="text-zinc-500">Vehicle must be returned with the same fuel/charge level as at the start of the trip. Refueling fees plus a convenience charge will apply otherwise.</p>
          </section>
        </label>
      </div>
    </div>
  );
};

const BookingModal = ({ car, onClose, onBook, user, onLogin, initialStartDate, initialEndDate }: { car: Car, onClose: () => void, onBook: (booking: any) => Promise<string | null | void>, user: any, onLogin: () => void, initialStartDate?: string, initialEndDate?: string }) => {
  const [startDate, setStartDate] = useState(initialStartDate || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(initialEndDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const days = useMemo(() => {
    const start = new Date(`${startDate}T12:00:00`);
    const end = new Date(`${endDate}T12:00:00`);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [startDate, endDate]);

  const [agreed, setAgreed] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [signature, setSignature] = useState('');
  const [step, setStep] = useState<'checkout' | 'identity' | 'payment' | 'processing' | 'success'>('checkout');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [idUploaded, setIdUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'klarna' | 'affirm'>('card');
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email) return;
    const checkWhitelist = async () => {
      const q = query(collection(db, 'whitelist'), where('email', '==', user.email.toLowerCase()));
      const snapshot = await getDocs(q);
      setIsWhitelisted(!snapshot.empty);
    };
    checkWhitelist();
  }, [user]);

  const images = car.images && car.images.length > 0 ? car.images : [car.image];

  const fees = useMemo(() => {
    let base = car.pricePerDay * days;
    let discount = 0;
    
    if (days >= 30) {
      discount = Math.round(base * 0.20); // 20% monthly discount
    } else if (days >= 7) {
      discount = Math.round(base * 0.10); // 10% weekly discount
    }
    
    const discountedBase = base - discount;
    const service = Math.round(discountedBase * 0.12);
    const securityDeposit = isWhitelisted ? 0 : (car.depositAmount ?? 500);
    
    return {
      base,
      discount,
      service,
      securityDeposit,
      total: discountedBase + service + securityDeposit
    };
  }, [car.pricePerDay, days, car.depositAmount, isWhitelisted]);

  const handleCheckout = () => {
    if (!user) {
      onLogin();
      return;
    }
    
    if (!user.isIdentityVerified) {
      setStep('identity');
      return;
    }
    
    setStep('payment');
  };

  const handleStartVerification = async () => {
    try {
      const response = await fetch('/api/create-verification-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          returnUrl: window.location.href,
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to start verification: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("An error occurred while starting verification.");
    }
  };

  const handleDevVerify = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        isIdentityVerified: true
      });
      alert("Identity manually verified (Dev Mode)!");
      setStep('payment');
    } catch (error) {
      console.error("Dev verification error:", error);
      alert("An error occurred during dev verification.");
    }
  };

  const handleSimulatedPayment = async () => {
    setStep('processing');
    
    try {
      // Simulate network delay for payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create the active booking
      const newBookingId = await onBook({ car, days, fees, signature });
      if (newBookingId) {
        setCreatedBookingId(newBookingId);
      }
      
      setStep('success');
    } catch (err) {
      console.error("Checkout error:", err);
      setStep('payment');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-zinc-900/60 backdrop-blur-sm"
    >
      <motion.div 
        layoutId={`car-${car.id}`}
        className="bg-white w-full max-w-5xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Left: Car Info & Image */}
        <div className="md:w-1/2 bg-zinc-50 p-8 overflow-y-auto">
          <button 
            onClick={onClose}
            className="mb-8 w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="relative w-full aspect-video rounded-3xl mb-4 shadow-lg overflow-hidden group">
            <img 
              src={images[currentImageIndex]} 
              alt={`${car.make} ${car.model} - Image ${currentImageIndex + 1}`} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            
            {images.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev + 1) % images.length); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 snap-x scrollbar-hide">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                  className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 snap-start transition-all ${idx === currentImageIndex ? 'ring-2 ring-zinc-900 ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900">{car.make} {car.model}</h2>
              <p className="text-zinc-500 mt-2 leading-relaxed">{car.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {car.features.map((feature, i) => {
                let Icon = Check;
                const f = feature.toLowerCase();
                if (f.includes('autopilot') || f.includes('self-driving')) Icon = Cpu;
                else if (f.includes('navigation') || f.includes('gps')) Icon = MapPin;
                else if (f.includes('bluetooth') || f.includes('audio') || f.includes('sound')) Icon = Bluetooth;
                else if (f.includes('camera') || f.includes('sensor')) Icon = Camera;
                else if (f.includes('seat') || f.includes('leather')) Icon = Armchair;
                else if (f.includes('sunroof') || f.includes('roof')) Icon = Sun;
                else if (f.includes('battery') || f.includes('range')) Icon = Battery;
                else if (f.includes('sport') || f.includes('performance')) Icon = Zap;

                return (
                  <div key={i} className="flex items-center gap-3 text-sm text-zinc-700 bg-white p-3 rounded-xl border border-zinc-100 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-900">
                      <Icon size={16} />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 border-t border-zinc-200">
              <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <FileText size={18} />
                Rental Agreement
              </h4>
              <RentalAgreement onAllAgreed={setHasScrolledToBottom} />
            </div>
          </div>
        </div>

        {/* Right: Booking Details & Fees */}
        <div className="md:w-1/2 p-8 overflow-y-auto bg-white relative">
          <AnimatePresence mode="wait">
            {step === 'checkout' && (
              <motion.div 
                key="checkout"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-2xl font-bold text-zinc-900 mb-8">Checkout</h3>
                
                <div className="space-y-8">
                  {/* Trip Duration */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Trip Dates</label>
                    <div className="flex flex-col gap-4">
                      <CustomCalendar 
                        bookedDates={car.bookedDates || []}
                        startDate={startDate}
                        endDate={endDate}
                        onSelectDates={(newStart, newEnd) => {
                          setStartDate(newStart);
                          setEndDate(newEnd);
                        }}
                      />
                      <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Selected Dates</span>
                          <span className="text-sm font-medium text-zinc-900">
                            {startDate ? new Date(startDate + 'T12:00:00').toLocaleDateString() : 'Pick a start date'} - {endDate ? new Date(endDate + 'T12:00:00').toLocaleDateString() : 'Pick an end date'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">Total Duration</span>
                          <span className="text-sm font-bold text-zinc-900">{days} {days === 1 ? 'day' : 'days'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-4 pt-6 border-t border-zinc-100">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Price Breakdown</label>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Daily Rate (${car.pricePerDay} x {days} days)</span>
                        <span className="font-medium text-zinc-900">${fees.base}</span>
                      </div>
                      {fees.discount > 0 && (
                        <div className="flex justify-between text-sm text-emerald-600">
                          <span className="flex items-center gap-1.5">
                            <Sparkles size={14} /> {days >= 30 ? 'Monthly' : 'Weekly'} Discount
                          </span>
                          <span className="font-medium">-${fees.discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-zinc-500">
                          <Shield size={14} /> Security Deposit (Refundable)
                          {isWhitelisted && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ml-1">Exempt</span>}
                        </span>
                        <span className="font-medium text-zinc-900">${fees.securityDeposit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-zinc-500">
                          <Info size={14} /> Service Fee
                        </span>
                        <span className="font-medium text-zinc-900">${fees.service}</span>
                      </div>
                      <div className="pt-4 flex justify-between items-center">
                        <span className="text-lg font-bold text-zinc-900">Total</span>
                        <span className="text-2xl font-black text-zinc-900">${fees.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Agreement Checkbox */}
                  <div className="space-y-4">
                    <label className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                      hasScrolledToBottom ? 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100' : 'bg-zinc-50 border-zinc-200 opacity-50 cursor-not-allowed'
                    }`}>
                      <div className={`relative w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                        agreed ? 'bg-zinc-900 border-zinc-900' : 'border-zinc-300'
                      }`}>
                        <input 
                          type="checkbox" 
                          className="absolute opacity-0 w-full h-full cursor-pointer"
                          checked={agreed} 
                          disabled={!hasScrolledToBottom}
                          onChange={(e) => setAgreed(e.target.checked)} 
                        />
                        {agreed && <Check size={14} className="text-white" />}
                      </div>
                      <span className="text-xs text-zinc-500 leading-relaxed">
                        I have read and agree to the <span className="text-zinc-900 font-bold underline">Rental Agreement</span> and Pura Vida Mae's terms of service.
                      </span>
                    </label>

                    {/* E-Signature */}
                    <div className={`space-y-2 transition-all ${agreed ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Electronic Signature</label>
                      <input 
                        type="text" 
                        placeholder="Type your full name to sign" 
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 font-serif italic"
                      />
                      <p className="text-[10px] text-zinc-400">By signing, you agree to receive a PDF copy of this agreement via email.</p>
                    </div>
                  </div>

                  {/* Book Button */}
                  <button 
                    disabled={!agreed || signature.trim().length < 3}
                    onClick={handleCheckout}
                    className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                      agreed && signature.trim().length >= 3
                        ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-xl active:scale-[0.98]' 
                        : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                    }`}
                  >
                    <Shield size={20} />
                    {user ? 'Sign & Book Now' : 'Log in to Book'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'identity' && (
              <motion.div 
                key="identity"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full text-center py-12"
              >
                <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-900">
                  <UserCheck size={40} />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-4">Driver Verification Required</h3>
                <p className="text-zinc-500 mb-8 max-w-sm mx-auto">
                  For security, we need to verify your government ID before you can finalize your first booking.
                </p>
                <div className="space-y-4 mt-auto">
                  <button 
                    onClick={handleStartVerification}
                    className="w-full bg-zinc-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all shadow-xl"
                  >
                    Verify My Driver's License
                  </button>
                  <button 
                    onClick={handleDevVerify}
                    className="w-full bg-amber-50 text-amber-700 py-3 rounded-2xl font-bold text-sm hover:bg-amber-100 transition-all border border-amber-200"
                  >
                    Skip Verification (Dev Only)
                  </button>
                  <button 
                    onClick={() => setStep('checkout')}
                    className="w-full py-4 rounded-2xl font-bold text-zinc-500 hover:bg-zinc-100 transition-all"
                  >
                    Go Back
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div 
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                <h3 className="text-2xl font-bold text-zinc-900 mb-2">Payment Details</h3>
                <p className="text-zinc-500 mb-8">Select your preferred payment method.</p>
                
                <div className="space-y-4 flex-1">
                  <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-300'}`}>
                    <div className="flex items-center gap-3">
                      <CreditCard className={paymentMethod === 'card' ? 'text-zinc-900' : 'text-zinc-400'} />
                      <span className="font-bold text-zinc-900">Credit Card</span>
                    </div>
                    <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 accent-zinc-900" />
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'klarna' ? 'border-pink-500 bg-pink-50' : 'border-zinc-200 hover:border-zinc-300'}`}>
                    <div className="flex items-center gap-3">
                      <div className="font-black text-pink-500 tracking-tight">Klarna.</div>
                      <span className="text-xs text-zinc-500">Pay in 4 interest-free payments</span>
                    </div>
                    <input type="radio" name="payment" checked={paymentMethod === 'klarna'} onChange={() => setPaymentMethod('klarna')} className="w-5 h-5 accent-pink-500" />
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'affirm' ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300'}`}>
                    <div className="flex items-center gap-3">
                      <div className="font-black text-blue-500 tracking-tight">affirm</div>
                      <span className="text-xs text-zinc-500">Pay over time</span>
                    </div>
                    <input type="radio" name="payment" checked={paymentMethod === 'affirm'} onChange={() => setPaymentMethod('affirm')} className="w-5 h-5 accent-blue-500" />
                  </label>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Due Today</span>
                    <span>${paymentMethod === 'klarna' ? (fees.total / 4).toFixed(2) : fees.total}</span>
                  </div>
                  <button 
                    onClick={handleSimulatedPayment}
                    className="w-full py-5 rounded-2xl font-bold text-lg bg-zinc-900 text-white hover:bg-zinc-800 shadow-xl transition-all"
                  >
                    Pay & Confirm Booking
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-4 border-zinc-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                  <CreditCard className="absolute inset-0 m-auto text-blue-500" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-2">Processing Payment</h3>
                <p className="text-zinc-500 max-w-xs mx-auto">
                  Securely processing your {paymentMethod} payment...
                </p>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-8">
                  <UserCheck size={48} />
                </div>
                <h3 className="text-3xl font-bold text-zinc-900 mb-4">Verification Complete!</h3>
                <p className="text-zinc-500 max-w-sm mx-auto mb-8 leading-relaxed">
                  Your identity has been verified and your booking for the {car.make} {car.model} is confirmed.
                </p>
                
                <div className="w-full bg-zinc-50 rounded-2xl p-6 mb-8 text-left border border-zinc-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-zinc-500">Total Paid</span>
                    <span className="font-bold text-xl">${fees.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Security Deposit Hold</span>
                    <span className="font-bold text-zinc-900">$500.00</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  {createdBookingId && (
                    <button 
                      onClick={() => {
                        window.location.hash = `agreement/${createdBookingId}`;
                        onClose();
                      }}
                      className="w-full py-5 rounded-2xl font-bold text-lg bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                    >
                      <FileText size={20} />
                      View Agreement
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      window.location.hash = 'dashboard';
                      onClose();
                    }}
                    className="w-full py-5 rounded-2xl font-bold text-lg bg-zinc-900 text-white hover:bg-zinc-800 shadow-xl transition-all"
                  >
                    View Dashboard
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CheckInModal = ({ booking, onClose, onComplete }: { booking: any, onClose: () => void, onComplete: (photos: any) => void }) => {
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  const steps = [
    { id: 'exterior', title: 'Exterior Photo', desc: 'Take a clear photo of the car\'s exterior.' },
    { id: 'interior', title: 'Interior Photo', desc: 'Take a photo of the front seats and dashboard.' },
    { id: 'fuel', title: 'Fuel Level', desc: 'Take a photo of the fuel gauge.' },
    { id: 'odometer', title: 'Odometer', desc: 'Take a photo of the current mileage.' },
  ];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const base64 = await processImage(file);
      setPhotos(prev => ({ ...prev, [steps[step].id]: base64 }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(photos);
    }
  };

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Check-in: Step {step + 1} of {steps.length}</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full"><X size={20} /></button>
        </div>
        
        <div className="mb-6">
          <h4 className="font-bold text-lg mb-2">{currentStep.title}</h4>
          <p className="text-zinc-500 text-sm">{currentStep.desc}</p>
        </div>

        <div className="mb-8">
          {photos[currentStep.id] ? (
            <div className="relative rounded-xl overflow-hidden aspect-video bg-zinc-100">
              <img src={photos[currentStep.id]} className="w-full h-full object-cover" />
              <button 
                onClick={() => setPhotos(prev => { const n = {...prev}; delete n[currentStep.id]; return n; })}
                className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className={`w-full aspect-video rounded-xl border-2 border-dashed border-zinc-300 flex flex-col items-center justify-center text-zinc-500 hover:bg-zinc-50 cursor-pointer transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <Camera size={32} className="mb-2" />
              <span className="font-medium">{uploading ? 'Processing...' : 'Take Photo'}</span>
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          )}
        </div>

        <button 
          onClick={handleNext}
          disabled={!photos[currentStep.id]}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            photos[currentStep.id] 
              ? 'bg-zinc-900 text-white hover:bg-zinc-800' 
              : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
          }`}
        >
          {step === steps.length - 1 ? 'Complete Check-in' : 'Next Step'}
        </button>
      </div>
    </div>
  );
};

const ReturnModal = ({ booking, onClose, onComplete }: { booking: any, onClose: () => void, onComplete: (photos: string[]) => void }) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;
    if (photos.length + files.length > 10) {
      alert('You can only upload up to 10 photos.');
      return;
    }

    setUploading(true);
    try {
      const processed = await Promise.all(files.map(f => processImage(f)));
      setPhotos(prev => [...prev, ...processed]);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Return Vehicle</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full"><X size={20} /></button>
        </div>
        
        <p className="text-zinc-500 mb-6">
          Optional: Upload up to 10 photos of the vehicle's condition upon return.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {photos.map((photo, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100">
              <img src={photo} className="w-full h-full object-cover" />
              <button 
                onClick={() => setPhotos(prev => prev.filter((_, i) => i !== idx))}
                className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {photos.length < 10 && (
            <label className={`aspect-square rounded-xl border-2 border-dashed border-zinc-300 flex flex-col items-center justify-center text-zinc-500 hover:bg-zinc-50 cursor-pointer transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <Camera size={24} className="mb-1" />
              <span className="text-xs font-medium">{uploading ? '...' : 'Add Photo'}</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          )}
        </div>

        <button 
          onClick={() => onComplete(photos)}
          className="w-full py-4 rounded-xl font-bold text-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-all"
        >
          Complete Return
        </button>
      </div>
    </div>
  );
};

const AVAILABLE_FEATURES = [
  'Bluetooth',
  'Backup Camera',
  'Navigation',
  'Leather Seats',
  'Sunroof/Moonroof',
  'Heated Seats',
  'Apple CarPlay',
  'Android Auto',
  'Blind Spot Monitoring',
  'Keyless Entry',
  'Push Button Start',
  'Third Row Seating',
  'All-Wheel Drive',
  'Premium Audio',
  'Adaptive Cruise Control'
];

// --- Dashboard Component ---
const Dashboard = ({ 
  user,
  bookings, 
  onCheckIn,
  onReturn,
  onCancel,
  cars,
  onAddCar,
  onEditCar,
  onLogin
}: { 
  user: any,
  bookings: any[], 
  onCheckIn: (id: string, photos: any) => void,
  onReturn: (id: string, photos: string[]) => void,
  onCancel: (booking: any) => void,
  cars: Car[],
  onAddCar: (car: Partial<Car>) => void,
  onEditCar: (id: string, car: Partial<Car>) => void,
  onLogin: () => void
}) => {
  const [activeTab, setActiveTab] = useState<'rentals' | 'listings' | 'whitelist'>('rentals');
  const [editingCar, setEditingCar] = useState<Partial<Car> | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [checkingInBooking, setCheckingInBooking] = useState<any>(null);
  const [returningBooking, setReturningBooking] = useState<any>(null);
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [newWhitelistEmail, setNewWhitelistEmail] = useState('');

  const MASTER_HOSTS = ['baironjavierv@gmail.com', 'brandoneglenn@gmail.com', 'brandon@gamersave.llc'];
  const isMasterHost = user?.email && MASTER_HOSTS.includes(user.email);

  useEffect(() => {
    if (!isMasterHost) return;
    const unsubscribe = onSnapshot(collection(db, 'whitelist'), (snapshot) => {
      const emails = snapshot.docs.map(doc => doc.data().email);
      setWhitelist(emails);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'whitelist');
    });
    return () => unsubscribe();
  }, [isMasterHost]);

  const handleAddWhitelist = async () => {
    const email = newWhitelistEmail.trim().toLowerCase();
    if (!email) return;
    
    if (whitelist.includes(email)) {
      alert("This email is already on the whitelist.");
      return;
    }

    try {
      await addDoc(collection(db, 'whitelist'), {
        email: email,
        addedBy: user.uid,
        createdAt: serverTimestamp()
      });
      setNewWhitelistEmail('');
      alert("User added to whitelist successfully!");
    } catch (err) {
      const error = handleFirestoreError(err, OperationType.CREATE, 'whitelist');
      alert("Failed to add user to whitelist. You may not have permission.");
    }
  };

  const handleRemoveWhitelist = async (email: string) => {
    if (!confirm(`Are you sure you want to remove ${email} from the whitelist?`)) return;
    
    try {
      const q = query(collection(db, 'whitelist'), where('email', '==', email));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, 'whitelist', d.id)));
      await Promise.all(deletePromises);
      alert("User removed from whitelist.");
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'whitelist');
      alert("Failed to remove user from whitelist.");
    }
  };

  const myCars = cars.filter(c => c.hostId === user?.uid);
  const myCarBookings = bookings.filter(b => b.hostId === user?.uid);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingCar) return;
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;
    
    const currentImages = editingCar.images || [];
    if (currentImages.length + files.length > 10) {
      alert('You can only upload up to 10 images.');
      return;
    }

    setUploadingImages(true);
    try {
      const processedImages = await Promise.all(files.map(f => processImage(f)));
      setEditingCar({
        ...editingCar,
        images: [...currentImages, ...processedImages],
        image: currentImages.length === 0 ? processedImages[0] : (editingCar.image || processedImages[0])
      });
    } catch (err) {
      console.error("Error processing images", err);
      alert("Failed to process images.");
    } finally {
      setUploadingImages(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6 text-zinc-400">
          <UserIcon size={40} />
        </div>
        <h2 className="text-3xl font-bold text-zinc-900 mb-4">Sign in to view your Dashboard</h2>
        <p className="text-zinc-500 mb-8 max-w-md">
          Manage your rentals, view your booking history, and access your host tools by signing into your account.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={onLogin} 
            className="bg-zinc-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-colors"
          >
            Log in
          </button>
          <button 
            onClick={onLogin} 
            className="bg-zinc-100 text-zinc-900 px-8 py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-colors"
          >
            Sign up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-[60vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        {isMasterHost && (
          <div className="flex bg-zinc-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('rentals')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'rentals' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              My Rentals
            </button>
            <button 
              onClick={() => setActiveTab('listings')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'listings' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              Host Listings
            </button>
            <button 
              onClick={() => setActiveTab('whitelist')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'whitelist' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              Whitelist
            </button>
          </div>
        )}
      </div>

      {activeTab === 'rentals' || !isMasterHost ? (
        <>
          {bookings.filter(b => b.userId === user?.uid).length === 0 ? (
            <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-zinc-100">
              <CarIcon size={48} className="mx-auto text-zinc-300 mb-4" />
              <h3 className="text-xl font-bold text-zinc-900">No active rentals</h3>
              <p className="text-zinc-500 mt-2">You don't have any cars booked right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {bookings.filter(b => b.userId === user?.uid).map(b => (
                <div key={b.id} className="border border-zinc-200 rounded-3xl p-6 flex flex-col sm:flex-row gap-6 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
                  window.location.hash = `lease/${b.id}`;
                }}>
                  <img src={b.car.images?.[0] || b.car.image} className="w-full sm:w-48 h-32 object-cover rounded-2xl" referrerPolicy="no-referrer" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-zinc-900">{b.car.make} {b.car.model}</h3>
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-zinc-100 rounded-md text-zinc-600">{b.status}</span>
                      </div>
                      <p className="text-zinc-500 text-sm mt-1">{b.days} days • Total: ${b.fees?.total || b.totalFees || 0}</p>
                    </div>
                    <div className="flex justify-end mt-4 sm:mt-0">
                      <button 
                        className="text-zinc-600 font-bold hover:text-zinc-900 flex items-center gap-2 transition-colors"
                      >
                        Manage Lease <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* New Sections for Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Upcoming Payments / Make a Payment */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900">Upcoming Payments</h3>
                  <p className="text-sm text-zinc-500 mt-1">Manage your lease or recurring purchase payments.</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-full">
                  <CreditCard className="text-blue-600" size={24} />
                </div>
              </div>
              
              <div className="space-y-4">
                {bookings.filter(b => b.userId === user?.uid && b.status === 'active' && b.balanceDue > 0).length === 0 ? (
                  <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 flex flex-col gap-4 text-center">
                    <span className="text-zinc-900 font-bold">No upcoming payments</span>
                    <p className="text-xs text-zinc-500">You currently have no active leases requiring payment.</p>
                  </div>
                ) : (
                  bookings.filter(b => b.userId === user?.uid && b.status === 'active' && b.balanceDue > 0).map(b => (
                    <div key={b.id} className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 flex flex-col gap-4 cursor-pointer hover:border-zinc-300 transition-colors" onClick={() => {
                        window.location.hash = `lease/${b.id}`;
                    }}>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-600 font-medium">{b.car.make} {b.car.model}</span>
                        <span className="text-zinc-900 font-bold">${b.balanceDue}</span>
                      </div>
                      <div className="w-full h-px bg-zinc-200"></div>
                      <button className="w-full bg-zinc-900 text-white py-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors">
                        Make Payment
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Previous Receipts / Documents */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900">Documents & Receipts</h3>
                  <p className="text-sm text-zinc-500 mt-1">Access your previous rental and lease agreements.</p>
                </div>
                <div className="bg-green-50 p-3 rounded-full">
                  <FileText className="text-green-600" size={24} />
                </div>
              </div>
              
              <div className="space-y-3">
                {bookings.filter(b => b.userId === user?.uid && b.status === 'completed').length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-zinc-500 text-sm">No recent documents available.</p>
                  </div>
                ) : (
                  bookings.filter(b => b.userId === user?.uid && b.status === 'completed').slice(0,3).map(b => (
                    <div key={b.id} className="flex items-center justify-between p-4 hover:bg-zinc-50 rounded-2xl transition-colors border border-transparent hover:border-zinc-100 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="bg-zinc-100 p-2 rounded-lg text-zinc-600">
                          <Check size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 text-sm">Receipt - {b.car.make} {b.car.model}</p>
                          <p className="text-xs text-zinc-500">${b.fees.total} • {b.days} days</p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.hash = `agreement/${b.id}`;
                        }}
                        className="text-zinc-400 hover:text-zinc-900"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {checkingInBooking && (
            <CheckInModal 
              booking={checkingInBooking} 
              onClose={() => setCheckingInBooking(null)} 
              onComplete={(photos) => {
                onCheckIn(checkingInBooking.id, photos);
                setCheckingInBooking(null);
              }} 
            />
          )}

          {returningBooking && (
            <ReturnModal 
              booking={returningBooking} 
              onClose={() => setReturningBooking(null)} 
              onComplete={(photos) => {
                onReturn(returningBooking.id, photos);
                setReturningBooking(null);
              }} 
            />
          )}
        </>
      ) : activeTab === 'listings' ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Your Fleet</h3>
            <button 
              onClick={() => setEditingCar({
                make: '', model: '', year: new Date().getFullYear(), category: CarCategory.ECONOMY, pricePerDay: 50, image: '', images: [], description: '', location: '', features: []
              })}
              className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2"
            >
              <Upload size={16} /> Add Vehicle
            </button>
          </div>

          {editingCar && (
            <div className="mb-8 bg-zinc-50 p-6 rounded-3xl border border-zinc-200">
              <h4 className="font-bold mb-4">{editingCar.id ? 'Edit Vehicle' : 'Add New Vehicle'}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="Make (e.g. Tesla)" className="p-3 rounded-xl border border-zinc-200" value={editingCar.make || ''} onChange={e => setEditingCar({...editingCar, make: e.target.value})} />
                <input type="text" placeholder="Model (e.g. Model 3)" className="p-3 rounded-xl border border-zinc-200" value={editingCar.model || ''} onChange={e => setEditingCar({...editingCar, model: e.target.value})} />
                <input type="number" placeholder="Year" className="p-3 rounded-xl border border-zinc-200" value={editingCar.year || ''} onChange={e => setEditingCar({...editingCar, year: parseInt(e.target.value)})} />
                <input type="text" placeholder="Color (e.g. Midnight Silver)" className="p-3 rounded-xl border border-zinc-200" value={editingCar.color || ''} onChange={e => setEditingCar({...editingCar, color: e.target.value})} />
                <input type="number" placeholder="Price per day ($)" className="p-3 rounded-xl border border-zinc-200" value={editingCar.pricePerDay || ''} onChange={e => setEditingCar({...editingCar, pricePerDay: parseInt(e.target.value)})} />
                <input type="number" placeholder="Security Deposit ($)" className="p-3 rounded-xl border border-zinc-200" value={editingCar.depositAmount || ''} onChange={e => setEditingCar({...editingCar, depositAmount: parseInt(e.target.value)})} />
                <input type="text" placeholder="Location (City, State)" className="p-3 rounded-xl border border-zinc-200" value={editingCar.location || ''} onChange={e => setEditingCar({...editingCar, location: e.target.value})} />
                <div className="flex flex-col">
                  <select className="p-3 rounded-xl border border-zinc-200 h-full" value={editingCar.category || CarCategory.ECONOMY} onChange={e => setEditingCar({...editingCar, category: e.target.value as CarCategory})}>
                    <option value="" disabled>Select Vehicle Type</option>
                    {Object.values(CarCategory).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-700 mb-2">Vehicle Images (Up to 10) - Recommended: Landscape (16:9)</label>
                <div className="flex flex-wrap gap-4 mb-2">
                  {(editingCar.images || []).map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-zinc-200">
                      <img src={img} className="w-full h-full object-cover" />
                      <button onClick={() => {
                        const newImages = (editingCar.images || []).filter((_, i) => i !== idx);
                        setEditingCar({...editingCar, images: newImages, image: newImages[0] || ''});
                      }} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {(editingCar.images || []).length < 10 && (
                    <label className={`w-24 h-24 rounded-xl border-2 border-dashed border-zinc-300 flex flex-col items-center justify-center text-zinc-500 hover:bg-zinc-100 cursor-pointer transition-colors ${uploadingImages ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <Camera size={24} className="mb-1" />
                      <span className="text-xs text-center px-1">{uploadingImages ? 'Processing...' : 'Add Photo'}</span>
                      <input type="file" multiple accept="image/jpeg, image/png" className="hidden" onChange={handleImageUpload} disabled={uploadingImages} />
                    </label>
                  )}
                </div>
              </div>
              <textarea placeholder="Description" className="w-full p-3 rounded-xl border border-zinc-200 mb-4" value={editingCar.description || ''} onChange={e => setEditingCar({...editingCar, description: e.target.value})} />
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-700 mb-2">Features</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AVAILABLE_FEATURES.map(feature => (
                    <label key={feature} className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer hover:text-zinc-900 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={(editingCar.features || []).includes(feature)}
                        onChange={(e) => {
                          const currentFeatures = editingCar.features || [];
                          if (e.target.checked) {
                            setEditingCar({...editingCar, features: [...currentFeatures, feature]});
                          } else {
                            setEditingCar({...editingCar, features: currentFeatures.filter(f => f !== feature)});
                          }
                        }}
                        className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 w-4 h-4"
                      />
                      {feature}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    if (editingCar.id) {
                      onEditCar(editingCar.id, editingCar);
                    } else {
                      onAddCar(editingCar);
                    }
                    setEditingCar(null);
                  }}
                  disabled={uploadingImages || !editingCar.make || !editingCar.model || !(editingCar.images?.length)}
                  className="bg-zinc-900 text-white px-6 py-2 rounded-xl font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingCar.id ? 'Update Vehicle' : 'Save Vehicle'}
                </button>
                <button onClick={() => setEditingCar(null)} className="px-6 py-2 rounded-xl font-medium text-zinc-600 hover:bg-zinc-200">Cancel</button>
              </div>
            </div>
          )}

          {myCars.length === 0 ? (
            <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-zinc-100">
              <CarIcon size={48} className="mx-auto text-zinc-300 mb-4" />
              <h3 className="text-xl font-bold text-zinc-900">No vehicles listed</h3>
              <p className="text-zinc-500 mt-2">Start earning by listing your car today.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCars.map(car => (
                <div key={car.id} className="border border-zinc-200 rounded-3xl overflow-hidden bg-white shadow-sm">
                  <img src={car.images?.[0] || car.image} className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
                  <div className="p-5">
                    <h4 className="font-bold text-lg">{car.make} {car.model}</h4>
                    <p className="text-zinc-500 text-sm mb-4">${car.pricePerDay}/day • {car.location}</p>
                    <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Recent Bookings</p>
                      {myCarBookings.filter(b => b.carId === car.id).length > 0 ? (
                        <ul className="space-y-2">
                          {myCarBookings.filter(b => b.carId === car.id).map(b => (
                            <li key={b.id} className="text-sm flex justify-between">
                              <span>{b.days} days</span>
                              <span className="font-medium text-green-600">${b.fees.total}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-zinc-400">No bookings yet.</p>
                      )}
                    </div>
                    <button
                      onClick={() => setEditingCar(car)}
                      className="mt-4 w-full bg-zinc-100 text-zinc-800 px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-200 transition-colors"
                    >
                      Edit Vehicle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-zinc-100 bg-zinc-50">
            <h3 className="text-xl font-bold">Deposit Whitelist</h3>
            <p className="text-sm text-zinc-500 mt-1">Users on this list do not need to pay a security deposit.</p>
          </div>
          <div className="p-8">
            <div className="flex gap-4 mb-8">
              <input 
                type="email" 
                placeholder="User Email" 
                className="flex-1 p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 outline-none"
                value={newWhitelistEmail}
                onChange={e => setNewWhitelistEmail(e.target.value)}
              />
              <button 
                onClick={handleAddWhitelist}
                className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Add User
              </button>
            </div>

            <div className="space-y-3">
              {whitelist.length === 0 ? (
                <div className="text-center py-10 text-zinc-400 italic">
                  No users whitelisted yet.
                </div>
              ) : (
                whitelist.map(email => (
                  <div key={email} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-zinc-400 border border-zinc-200">
                        <UserIcon size={16} />
                      </div>
                      <span className="font-medium text-zinc-900">{email}</span>
                    </div>
                    <button 
                      onClick={() => handleRemoveWhitelist(email)}
                      className="text-red-500 hover:text-red-700 p-2 transition-colors"
                      title="Remove from whitelist"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InstallModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Install App</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full"><X size={20} /></button>
        </div>
        <div className="space-y-4 text-zinc-600">
          <p>To install Pura Vida Mae on your mobile device:</p>
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
            <h4 className="font-bold text-zinc-900 mb-2 flex items-center gap-2"><Smartphone size={18}/> iOS (Safari)</h4>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Tap the <strong>Share</strong> button at the bottom of the screen.</li>
              <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
              <li>Tap <strong>Add</strong> in the top right corner.</li>
            </ol>
          </div>
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
            <h4 className="font-bold text-zinc-900 mb-2 flex items-center gap-2"><Smartphone size={18}/> Android (Chrome)</h4>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Tap the <strong>Menu</strong> icon (three dots) in the top right.</li>
              <li>Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
              <li>Follow the on-screen instructions.</li>
            </ol>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-full mt-6 py-4 rounded-xl font-bold text-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-all"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [cars, setCars] = useState<Car[]>(MOCK_CARS);
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CarCategory | 'All'>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const view = currentHash ? currentHash.slice(1).split('/')[0] : 'browse';
  const resourceId = currentHash.includes('/') ? currentHash.slice(1).split('/')[1] : null;

  const setView = (path: string) => {
    window.location.hash = path;
    window.scrollTo(0, 0);
  };

  // PWA Install Listener
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
    } else {
      setIsInstallModalOpen(true);
    }
  };

  // Auth Listener
  useEffect(() => {
    let unsubscribeUser: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Create user document if it doesn't exist
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            role: 'user',
            isIdentityVerified: false,
            createdAt: serverTimestamp()
          });
        }

        // Listen for user document changes to get isIdentityVerified
        unsubscribeUser = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUser({ ...currentUser, ...docSnap.data() });
          } else {
            setUser(currentUser);
          }
          setIsAuthReady(true);
        });
      } else {
        setUser(null);
        setIsAuthReady(true);
        if (unsubscribeUser) unsubscribeUser();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) unsubscribeUser();
    };
  }, []);

  // Fetch Cars
  useEffect(() => {
    if (!isAuthReady) return;
    
    const unsubscribe = onSnapshot(collection(db, 'cars'), (snapshot) => {
      if (!snapshot.empty) {
        const fetchedCars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Car));
        setCars(fetchedCars);
      } else {
        setCars(MOCK_CARS);
      }
    }, (error) => {
      console.error("Error fetching cars:", error);
    });
    return () => unsubscribe();
  }, [isAuthReady]);

  // Fetch Bookings
  useEffect(() => {
    if (!user || !isAuthReady) {
      setBookings([]);
      return;
    }
    
    // Fetch bookings where user is either the renter or the host
    const q = query(
      collection(db, 'bookings'),
      or(
        where('userId', '==', user.uid),
        where('hostId', '==', user.uid)
      )
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedBookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setBookings(fetchedBookings);
    }, (error) => {
      console.error("Error fetching bookings:", error);
    });
    return () => unsubscribe();
  }, [user, isAuthReady]);

  // Handle Stripe Success Redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const bookingId = urlParams.get('booking_id');

    if (sessionId && bookingId && user) {
      // Mark booking as active
      updateDoc(doc(db, 'bookings', bookingId), {
        status: 'active'
      }).then(() => {
        setView('dashboard');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }).catch(err => console.error("Error updating booking status:", err));
    }
  }, [user]);

  const handleLogin = async () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setView('browse');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleBook = async (bookingData: any) => {
    if (!user) return;
    try {
      const docRef = await addDoc(collection(db, 'bookings'), {
        userId: user.uid,
        hostId: bookingData.car.hostId || 'system',
        carId: bookingData.car.id,
        car: bookingData.car,
        days: bookingData.days,
        fees: bookingData.fees,
        totalFees: bookingData.fees.total,
        signature: bookingData.signature || '',
        status: 'active',
        createdAt: serverTimestamp()
      });
      // We don't need to force setView('dashboard') here because the modal closing logic handles it.
      return docRef.id;
    } catch (error) {
      console.error("Error saving booking:", error);
      return null;
    }
  };

  const handleCheckIn = async (id: string, photos: any) => {
    try {
      await updateDoc(doc(db, 'bookings', id), {
        isCheckedIn: true,
        checkInPhotos: photos
      });
    } catch (error) {
      console.error("Error checking in:", error);
    }
  };

  const handleReturn = async (id: string, photos: string[]) => {
    try {
      await updateDoc(doc(db, 'bookings', id), {
        status: 'completed',
        returnPhotos: photos
      });
      alert(`Return complete! Rental agreement and photos have been emailed to ${user?.email}.`);
    } catch (error) {
      console.error("Error returning vehicle:", error);
    }
  };

  const handleCancel = async (booking: any) => {
    try {
      const createdAt = booking.createdAt?.toDate ? booking.createdAt.toDate() : (booking.createdAt ? new Date(booking.createdAt) : new Date());
      const hoursSinceBooking = (new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      
      let refundAmount = booking.totalFees;
      let penalty = 0;
      
      if (hoursSinceBooking > 24) {
        penalty = booking.totalFees * 0.10;
        refundAmount = booking.totalFees * 0.90;
        alert(`Cancellation after 24 hours. A 10% fee ($${penalty.toFixed(2)}) applies. You will be refunded $${refundAmount.toFixed(2)}.`);
      } else {
        alert(`Free cancellation within 24 hours. You will be fully refunded $${refundAmount.toFixed(2)}.`);
      }

      await updateDoc(doc(db, 'bookings', booking.id), {
        status: 'cancelled',
        refundAmount,
        penalty
      });
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handleAddCar = async (newCar: Partial<Car>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'cars'), {
        ...newCar,
        hostId: user.uid,
        hostName: user.displayName || 'Host',
        rating: 5.0,
        trips: 0,
        features: newCar.features || ['Bluetooth', 'Backup Camera'],
        depositAmount: newCar.depositAmount || 500,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error adding car:", error);
    }
  };

  const handleEditCar = async (id: string, updatedCar: Partial<Car>) => {
    if (!user) return;
    try {
      const { id: _id, ...carData } = updatedCar;
      await updateDoc(doc(db, 'cars', id), carData);
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchesSearch = car.make.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           car.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || car.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [cars, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-[#EAD5A6] font-sans text-zinc-900">
      <Navbar 
        view={view} 
        setView={setView} 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
        deferredPrompt={deferredPrompt}
        onInstall={handleInstallApp}
      />

      {view === 'browse' ? (
        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="mb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6"
          >
            Drive Easy. Live Pura Vida
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Want real transparency? We trust you. You can trust us. Flat rates. No fees. Just real business. Even the taxes? Handled by us. The way it should be
          </motion.p>
        </div>

        {/* Search & Filters */}
        <div className="mb-12 space-y-8">
          
          {/* Date Range Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-full p-4 shadow-xl border border-zinc-100 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6 flex-1 min-w-[250px] pl-4">
              <div className="text-zinc-400">
                <Calendar size={32} strokeWidth={1.5} />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-sm font-bold text-zinc-900 tracking-wider uppercase mb-1">
                  WHEN
                </label>
                <div className="flex items-center gap-4 text-zinc-500">
                  <div className="relative flex items-center">
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-transparent border-none outline-none text-zinc-500 cursor-pointer focus:ring-0 p-0 text-base"
                    />
                  </div>
                  <span className="text-zinc-300">-</span>
                  <div className="relative flex items-center">
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-transparent border-none outline-none text-zinc-500 cursor-pointer focus:ring-0 p-0 text-base"
                    />
                  </div>
                </div>
              </div>
            </div>
            <button className="bg-zinc-900 text-white rounded-full px-8 py-4 text-lg font-bold flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0">
              <Search size={20} />
              Search
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {['All', ...Object.values(CarCategory)].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat 
                    ? 'bg-zinc-900 text-white shadow-lg' 
                    : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCars.map((car) => (
              <CarCard 
                key={car.id} 
                car={car} 
                onSelect={setSelectedCar} 
              />
            ))}
          </AnimatePresence>
        </div>

          {filteredCars.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-zinc-300" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">No cars found</h3>
              <p className="text-zinc-500 mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </main>
      ) : view === 'about' ? (
        <AboutUs />
      ) : view === 'team' ? (
        <Team />
      ) : view === 'help' ? (
        <HelpCenter />
      ) : view === 'safety' ? (
        <Safety />
      ) : view === 'insurance' ? (
        <Insurance />
      ) : view === 'privacy' ? (
        <PrivacyPolicy />
      ) : view === 'terms' ? (
        <TermsOfService />
      ) : view === 'dashboard' ? (
        <Dashboard 
          user={user}
          bookings={bookings} 
          onCheckIn={handleCheckIn}
          onReturn={handleReturn} 
          onCancel={handleCancel}
          cars={cars}
          onAddCar={handleAddCar}
          onEditCar={handleEditCar}
          onLogin={handleLogin}
        />
      ) : view === 'profile' && user ? (
        <main className="max-w-7xl mx-auto px-6 py-12">
          <UserProfile user={user} />
        </main>
      ) : view === 'lease' && resourceId ? (
        <LeaseDetails 
          booking={bookings.find(b => b.id === resourceId)} 
          onBack={() => setView('dashboard')}
          onPayment={(booking: any) => window.alert('Redirecting to Stripe Payments Module...')}
          onPrint={(booking: any) => { window.location.hash = `agreement/${booking.id}`; }}
        />
      ) : view === 'agreement' && resourceId ? (
        <AgreementDetails 
          booking={bookings.find(b => b.id === resourceId)} 
          onBack={() => window.history.back()}
        />
      ) : null}

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedCar && (
          <BookingModal 
            car={selectedCar} 
            onClose={() => setSelectedCar(null)} 
            onBook={handleBook}
            user={user}
            onLogin={handleLogin}
            initialStartDate={startDate}
            initialEndDate={endDate}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-zinc-50 border-t border-zinc-100 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center text-white">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<span style="font-size: 18px;">🦥</span>';
                  }}
                />
              </div>
              <span className="text-lg font-bold tracking-tight text-zinc-900">PURA VIDA MAE</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              A company built on full trust and transparency. Real cars. Real people. Drive the life you want. The pure life.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-zinc-400">Company</h4>
            <ul className="space-y-4 text-sm text-zinc-600">
              <li><button onClick={() => { setView('about'); window.scrollTo(0, 0); }} className="hover:text-zinc-900 cursor-pointer">About</button></li>
              <li><button onClick={() => { setView('team'); window.scrollTo(0, 0); }} className="hover:text-zinc-900 cursor-pointer">Team</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-zinc-400">Support</h4>
            <ul className="space-y-4 text-sm text-zinc-600">
              <li><button onClick={() => { setView('help'); window.scrollTo(0, 0); }} className="hover:text-zinc-900 cursor-pointer">Help Center</button></li>
              <li><button onClick={() => { setView('safety'); window.scrollTo(0, 0); }} className="hover:text-zinc-900 cursor-pointer">Safety</button></li>
              <li><button onClick={() => { setView('insurance'); window.scrollTo(0, 0); }} className="hover:text-zinc-900 cursor-pointer">Insurance</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-zinc-400">Legal</h4>
            <ul className="space-y-4 text-sm text-zinc-600">
              <li><button onClick={() => { setView('privacy'); window.scrollTo(0, 0); }} className="hover:text-zinc-900 cursor-pointer text-left">Privacy Policy</button></li>
              <li>
                <button 
                  onClick={() => { setView('terms'); window.scrollTo(0, 0); }}
                  className="hover:text-zinc-900 text-left cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li><a href="#" className="hover:text-zinc-900">Rental Agreement</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-20 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-zinc-400">© 2026 Pura Vida Mae Inc. All rights reserved.</p>
        </div>
      </footer>
      <Chatbot cars={cars} user={user} />
      <TermsModal 
        isOpen={isTermsModalOpen} 
        onClose={() => setIsTermsModalOpen(false)} 
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
}
