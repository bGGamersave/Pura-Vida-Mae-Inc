import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, FileText, Scale, Battery, Sparkles, Clock, AlertTriangle, HelpCircle } from 'lucide-react';

const TermsSection = ({ icon: Icon, title, content, iconClass = "bg-zinc-900 text-white" }: { icon: any, title: string, content: React.ReactNode, iconClass?: string }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group h-full">
    <div className={`w-12 h-12 ${iconClass} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-4 tracking-tight">{title}</h3>
    <div className="text-zinc-500 text-sm leading-relaxed space-y-4">
      {content}
    </div>
  </div>
);

export const TermsOfService = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 py-20"
    >
      <div className="text-center mb-24">
        <span className="inline-block px-4 py-1.5 bg-zinc-100 rounded-full text-xs font-bold tracking-widest uppercase mb-6 text-zinc-600">Legal Agreement</span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-zinc-900 pb-2">
          Terms of Service.
        </h1>
        <p className="text-sm font-bold text-zinc-400 uppercase tracking-[0.2em] mb-10">Last Updated: March 30, 2026</p>
        <p className="text-xl text-zinc-500 max-w-3xl mx-auto leading-relaxed italic">
          "Welcome to Pura Vida Mae. These Terms of Service ('Terms') constitute a legally binding agreement between you ('Renter') and Pura Vida Mae Inc. By booking a vehicle through our platform, you agree to comply with and be bound by these Terms."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <TermsSection 
          icon={Scale}
          title="Direct Relationship"
          content={
            <p>
              Pura Vida Mae Inc. is a direct vehicle rental provider, not a peer-to-peer marketplace. You are entering into a rental agreement directly with the owner of the vehicle fleet. All vehicles are owned and maintained by Pura Vida Mae Inc. or its affiliates.
            </p>
          }
        />
        <TermsSection 
          icon={ShieldCheck}
          title="Eligibility & ID"
          content={
            <ul className="space-y-3">
              <li className="flex gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                <span><strong>Age:</strong> Renters must be at least 21 years of age.</span>
              </li>
              <li className="flex gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                <span><strong>Identification:</strong> A valid, government-issued driver's license must be provided and verified via our identity integration before the rental begins.</span>
              </li>
              <li className="flex gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                <span><strong>Insurance:</strong> Pura Vida Mae Inc. maintains a master fleet insurance policy. Your security deposit serves as your maximum out-of-pocket deductible for any covered claim.</span>
              </li>
            </ul>
          }
        />
        <TermsSection 
          icon={Battery}
          title="Charging & Idle Fees"
          content={
            <ul className="space-y-3">
              <li className="flex gap-2 text-zinc-400 italic mb-2">
                <span>All Supercharging costs incurred during the rental period are the responsibility of the Renter.</span>
              </li>
              <li className="flex gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                <span><strong>The Terms:</strong> Actual Tesla rate + $5.00 Administrative Processing Fee per rental period.</span>
              </li>
              <li className="flex gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                <span><strong>Idle/Congestion:</strong> 100% liability for fees incurred if the vehicle stays at a charger after it's full or during peak times.</span>
              </li>
            </ul>
          }
        />
        <TermsSection 
          icon={Clock}
          title="Cancellation Policy"
          content={
            <ul className="space-y-3">
              <li className="flex gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                <span><strong>24-Hour Grace:</strong> Full 100% refund for cancellations made within 24 hours of the initial booking.</span>
              </li>
              <li className="flex gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                <span><strong>Standard:</strong> After 24 hours, Pura Vida Mae Inc. retains 10% of the total rental cost as a processing fee.</span>
              </li>
              <li className="flex gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                <span><strong>No-Show:</strong> Cancellation without refund if the Renter does not arrive within 2 hours of scheduled pickup.</span>
              </li>
            </ul>
          }
        />
        <TermsSection 
          icon={ShieldCheck}
          title="Deposit & Release"
          content={
            <ul className="space-y-3">
              <li className="flex gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                <span><strong>Amount:</strong> $500 or $1000 depending on the vehicle. This covers minor damages, fuel/fees, and insurance deductibles.</span>
              </li>
              <li className="flex gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                <span><strong>Inspection:</strong> Post-trip digital inspection (including photos) conducted within 24 hours of return.</span>
              </li>
              <li className="flex gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                <span><strong>Release:</strong> Initiated within 3-5 business days if no damages, supercharging overages, or cleaning violations are found.</span>
              </li>
            </ul>
          }
        />
        <TermsSection 
          icon={Battery}
          title="Vehicle Usage"
          content={
            <ul className="space-y-3">
              <li className="flex gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                <span><strong>Tesla Tech:</strong> Renter remains 100% responsible even when using Autopilot or FSD.</span>
              </li>
              <li className="flex gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                <span><strong>Software:</strong> No purchasing upgrades via the touchscreen. Unauthorized purchases billed + $50 penalty.</span>
              </li>
              <li className="flex gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                <span><strong>Battery Care:</strong> Keep battery between 10% and 90% to maintain health.</span>
              </li>
            </ul>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 max-w-5xl mx-auto">
        <TermsSection 
          icon={Sparkles}
          title="Cleaning & Care"
          content={
            <div className="space-y-3">
              <p>We do not charge an upfront cleaning fee.</p>
              <p className="text-zinc-600 font-medium">However, a minimum $150.00 cleaning fee applies for professional detailing required due to:</p>
              <ul className="pl-4 space-y-1">
                <li>• Smoking inside vehicle</li>
                <li>• Pet hair</li>
                <li>• Deep stains</li>
              </ul>
            </div>
          }
        />
        <TermsSection 
          icon={Scale}
          title="Governing Law"
          content={
            <p>
              These Terms are governed by the laws of the State of California. Any disputes shall be resolved in the courts of San Diego County or Riverside County, California.
            </p>
          }
        />
      </div>

      {/* Moved Disclaimers Section */}
      <div className="flex justify-center mb-24">
        <div className="w-full max-w-4xl">
          <TermsSection 
            icon={AlertTriangle}
            title="Disclaimers"
            iconClass="bg-yellow-400 text-zinc-900 shadow-yellow-200 shadow-lg"
            content={
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                  <span><strong>Charging Credit:</strong> Supercharging included for Tesla and Electrify America for select models. All other charges are the customer's responsibility.</span>
                </li>
                <li className="flex gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                  <span><strong>Fault Liability:</strong> The full deposit is only taken for a deductible if the customer is found at fault of an accident.</span>
                </li>
              </ul>
            }
          />
        </div>
      </div>

      <div className="mt-24 text-center">
        <h3 className="text-2xl font-bold mb-6">Need clarification?</h3>
        <p className="text-zinc-500 mb-8 italic">Our team is committed to full transparency throughout your rental experience.</p>
        <button 
          onClick={() => {
            const mail = 'puravidamaeinc@outlook.com';
            window.location.href = `mailto:${mail}?subject=Inquiry regarding Terms of Service`;
          }}
          className="px-10 py-4 bg-zinc-900 text-white rounded-full font-bold hover:scale-105 transition-transform"
        >
          Contact Support
        </button>
      </div>

      <div className="mt-20 pt-10 border-t border-zinc-100 flex justify-center text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-bold">
        <span>© 2026 Pura Vida Mae Inc. All Rights Reserved.</span>
      </div>
    </motion.div>
  );
};
