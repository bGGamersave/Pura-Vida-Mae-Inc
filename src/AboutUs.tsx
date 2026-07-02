import React from 'react';
import { motion } from 'motion/react';
import { Shield, Users, Heart, Zap, Globe, Star } from 'lucide-react';

export const AboutUs = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 py-20"
    >
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
          About Pura Vida Mae
        </h1>
        <p className="text-zinc-600 text-xl max-w-3xl mx-auto leading-relaxed">
          Pura Vida Mae is a car rental business built around trust, simplicity, and real people. We offer a small, carefully selected fleet of vehicles with a focus on quality and experience. No corporate feel. No unnecessary complexity. Just a better way to rent cars.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-900">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-bold">Unwavering Trust</h3>
          <p className="text-zinc-500 leading-relaxed">
            We don't hide behind fine print or surprise fees. Our flat rates include everything, so you can drive with confidence knowing exactly what you've paid for.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-900">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold">People First</h3>
          <p className="text-zinc-500 leading-relaxed">
            We are real people caring for real cars. When you lease from us, you're not just a number on a spreadsheet—you're a guest in our community.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-900">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-bold">Precision Performance</h3>
          <p className="text-zinc-500 leading-relaxed">
            From our cutting-edge electric fleet to our meticulously maintained classics, every vehicle is a reflection of our commitment to excellence.
          </p>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
            Our goal is simple: Make car rentals feel human again.
          </h2>
          <div className="space-y-6 text-zinc-400 text-lg">
            <p>
              We believe people deserve a straightforward experience when they spend their money. Clear expectations, fair pricing, and no runaround. 
            </p>
            <p>
              We keep things simple on purpose. Instead of stacking extra fees or unnecessary add-ons, we use a straightforward security deposit system. It’s not anyone’s favorite part, but it helps keep things fair, protects both sides, and avoids the need for inflated pricing.
            </p>
            <p>
              Pricing is presented clearly and in front of you, so you know exactly what you’re paying. No surprises, no confusion.
            </p>
            <p>
              Pura Vida Mae is built from the ground up with a hands-on approach. Every rental is handled with care to make sure the experience is smooth, reliable, and personal.
            </p>
            <p>
              As we grow, that mindset stays the same. Keep it simple. Keep it honest. Keep it Pura Vida.
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <div className="grid grid-cols-4 gap-4 h-full">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white/20 rounded-full h-full transform translate-y-12"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-32 text-center">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Our Values</h3>
        <div className="flex flex-wrap justify-center gap-12">
          <div className="flex items-center gap-3">
            <Heart size={20} className="text-zinc-900" />
            <span className="font-bold">Transparency</span>
          </div>
          <div className="flex items-center gap-3">
            <Star size={20} className="text-zinc-900" />
            <span className="font-bold">Excellence</span>
          </div>
          <div className="flex items-center gap-3">
            <Globe size={20} className="text-zinc-900" />
            <span className="font-bold">Sustainability</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
