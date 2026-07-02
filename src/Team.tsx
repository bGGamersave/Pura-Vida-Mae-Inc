import React from 'react';
import { motion } from 'motion/react';
import { Mail, Linkedin, Twitter } from 'lucide-react';

const TeamMember = ({ name, role, bio }: { name: string, role: string, bio: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group bg-white rounded-[2rem] overflow-hidden border border-zinc-100 hover:shadow-xl transition-all duration-500 max-w-2xl mx-auto"
  >
    <div className="p-8 md:p-12">
      <h3 className="text-3xl font-bold text-zinc-900 mb-6">{name}</h3>
      <div className="space-y-6 text-zinc-500 leading-relaxed text-lg">
        {bio.split('\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </div>
  </motion.div>
);

export const Team = () => {
  const bioText = `This isn’t a big corporation. Just a simple “pure life dude” and his family.
Pura Vida Mae is built from the ground up with a hands-on approach. Every part of the experience is shaped with care, from how rentals work to how customers are treated.
We focus on trust, quality, and keeping things straightforward. No layers, no runaround. Just real people behind the business.
As we grow, the goal stays the same. Keep it personal. Keep it honest. Keep it Pura Vida.`;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 py-20"
    >
      <div className="text-center mb-24">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
          Meet the <span className="text-zinc-400">Team.</span>
        </h1>
        <p className="text-zinc-600 text-xl max-w-3xl mx-auto leading-relaxed">
          Pura Vida Mae is built and operated with a hands-on approach focused on quality, trust, and user experience.
        </p>
      </div>

      <div className="mb-32">
        <TeamMember 
          name="Bairon Vilchez"
          role=""
          bio={bioText}
        />
      </div>
    </motion.div>
  );
};
