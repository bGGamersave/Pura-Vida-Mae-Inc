import React from 'react';
import { motion } from 'motion/react';
import { Shield, AlertTriangle, CheckCircle, Heart, Eye, Lock, ClipboardCheck, Mail, Smartphone } from 'lucide-react';

const SafetyCard = ({ icon: Icon, title, points }: { icon: any, title: string, points: string[] }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500">
    <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-white mb-6">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-6 tracking-tight">{title}</h3>
    <ul className="space-y-4">
      {points.map((point, index) => (
        <li key={index} className="flex gap-4 items-start group">
          <div className="mt-1 w-5 h-5 rounded-full bg-zinc-50 flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
            <CheckCircle size={14} />
          </div>
          <span className="text-zinc-700 text-sm leading-relaxed">{point}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const Safety = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 py-20"
    >
      <div className="text-center mb-24">
        <span className="inline-block px-4 py-1.5 bg-zinc-100 rounded-full text-xs font-bold tracking-widest uppercase mb-6">Security First</span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 text-zinc-900 pb-2">
          Safety is a priority at Pura Vida Mae.
        </h1>
        <div className="max-w-3xl mx-auto space-y-6 text-lg text-zinc-500 leading-relaxed text-left md:text-center">
          <p>
            Every vehicle is inspected to ensure it is fully functional, properly maintained, and safe to operate before each rental. We take a hands-on approach to make sure vehicles meet our standards.
          </p>
          <p>
            For added protection, photos and/or video of the vehicle’s condition may be required before and after each rental. This helps document condition and protects both the renter and the business.
          </p>
          <p>
            We verify that all renters meet basic eligibility requirements, including holding a valid driver’s license.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        <SafetyCard 
          icon={Shield}
          title="All vehicles must:"
          points={[
            "Be properly maintained",
            "Be safe and road-ready",
            "Reckless driving, illegal activity, or misuse of a vehicle is not tolerated.",
            "Any accidents, damage, or unsafe behavior must be reported immediately."
          ]}
        />
        <SafetyCard 
          icon={Lock}
          title="All renters must:"
          points={[
            "Have a valid driver’s license",
            "Follow all traffic laws",
            "Operate vehicles responsibly",
            "Not allow unauthorized drivers"
          ]}
        />
      </div>

      <div className="bg-zinc-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
              <AlertTriangle className="text-white" size={24} />
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-6">Incident Response</h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed font-light">
              In the rare event of an accident or issue, we're prepared. Our response protocols are designed to be immediate, clear, and supportive.
            </p>
            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <h4 className="font-bold mb-4">Emergency Support</h4>
                <div className="space-y-3 text-sm text-zinc-400">
                  <p className="flex items-center gap-2 text-white/90">
                    <Mail size={14} className="text-zinc-500" />
                    puravidamaeinc@outlook.com
                  </p>
                  <p className="flex items-center gap-2 text-white/90">
                    <Smartphone size={14} className="text-zinc-500" />
                    (xxx) xxx-xxxx
                  </p>
                  <p className="pt-2 text-xs italic border-t border-white/10">Reach out directly if you need help before, during, or after your rental.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
             <div className="aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-full flex items-center justify-center">
                <div className="text-center p-12">
                   <div className="text-6xl font-black mb-4">24/7</div>
                   <div className="text-zinc-400 uppercase tracking-widest text-sm font-bold">Support Availability</div>
                </div>
             </div>
             {/* Decorative element */}
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 blur-3xl rounded-full"></div>
             <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 blur-3xl rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="mt-24 text-center">
        <h3 className="text-2xl font-bold mb-6">Questions about safety?</h3>
        <p className="text-zinc-500 mb-8 italic">We're here to explain our processes and how we keep our fleet protected.</p>
        <button className="px-10 py-4 bg-zinc-900 text-white rounded-full font-bold hover:scale-105 transition-transform">
          Contact Trust Team
        </button>
      </div>
    </motion.div>
  );
};
