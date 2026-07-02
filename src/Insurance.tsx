import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, FileText, AlertCircle, CheckCircle, Info, Umbrella, HardHat, ShieldAlert, Mail, Smartphone, HelpCircle } from 'lucide-react';

const InsuranceSection = ({ icon: Icon, title, points, description }: { icon: any, title: string, points?: string[], description?: string }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group">
    <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-4 tracking-tight">{title}</h3>
    {description && <p className="text-zinc-500 mb-6 italic leading-relaxed">{description}</p>}
    <ul className="space-y-4">
      {points?.map((point, index) => (
        <li key={index} className="flex gap-4 items-start">
          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
          <span className="text-zinc-700 text-sm leading-relaxed">{point}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const Insurance = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 py-20"
    >
      <div className="text-center mb-24">
        <span className="inline-block px-4 py-1.5 bg-zinc-100 rounded-full text-xs font-bold tracking-widest uppercase mb-6 text-zinc-600">Policy Overview</span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 text-zinc-900 pb-2">
          Insurance Coverage Details.
        </h1>
        <div className="text-xl text-zinc-500 max-w-3xl mx-auto leading-relaxed space-y-4">
          <p>
            Pura Vida Mae uses Roamly to provide insurance coverage for all vehicles during active rentals.
          </p>
          <p>
            Each vehicle is covered under a Roamly episodic rental policy, which applies specifically during the confirmed rental period.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <InsuranceSection 
          icon={Umbrella}
          title="How Coverage Works"
          points={[
            "Coverage is active only during your scheduled rental",
            "The policy is designed for direct rentals outside of third-party platforms",
            "Protection is tied to the approved renter and agreed rental terms"
          ]}
        />
        <InsuranceSection 
          icon={ShieldCheck}
          title="What’s Covered"
          description="Coverage may include:"
          points={[
            "Liability protection",
            "Physical damage protection (depending on the situation)",
            "Coverage details and limits may vary by vehicle and rental."
          ]}
        />
      </div>

      <div className="flex justify-center mb-8">
        <div className="max-w-2xl w-full">
          <InsuranceSection 
            icon={HardHat}
            title="Renter Responsibility"
            description="Renters are expected to:"
            points={[
              "Operate the vehicle safely and legally",
              "Follow all rental terms",
              "Report any accidents or damage immediately"
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        <InsuranceSection 
          icon={FileText}
          title="Security Deposit"
          description="A $500-$1000 security deposit may apply. This is only used if needed for:"
          points={[
            "Damage",
            "Misuse",
            "At-fault incidents",
            "If no issues occur, nothing is charged."
          ]}
        />
        <InsuranceSection 
          icon={ShieldAlert}
          title="Important Limitations"
          points={[
            "Coverage applies only during the rental period",
            "Unauthorized drivers are not covered",
            "Reckless or illegal use may void coverage"
          ]}
        />
      </div>

      <div className="bg-zinc-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden mb-12">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
              <HelpCircle className="text-white" size={24} />
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-6">Questions?</h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed font-light italic">
              If you have questions about coverage before booking, contact us:
            </p>
            <div className="space-y-6">
              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                <div className="space-y-4">
                  <p className="flex items-center gap-3 text-lg font-medium text-white">
                    <Mail size={18} className="text-zinc-500" />
                    puravidamaeinc@outlook.com
                  </p>
                  <p className="flex items-center gap-3 text-lg font-medium text-white">
                    <Smartphone size={18} className="text-zinc-500" />
                    (xxx) xxx-xxxx
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="aspect-square bg-white/5 rounded-full flex items-center justify-center border border-white/5 relative">
               <ShieldCheck size={120} className="text-white/10" />
               <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-full font-black animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-12 pb-12">
        <div className="bg-zinc-50 p-8 rounded-[2rem] border border-zinc-200 shadow-sm inline-block max-w-lg relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
            <AlertCircle size={24} className="text-zinc-900 fill-zinc-900/5" strokeWidth={3} />
          </div>
          <div className="mt-4">
            <h4 className="font-bold text-zinc-900 mb-4 text-center">You may be held responsible for damage or loss if it results from:</h4>
            <ul className="space-y-3">
              {["At-fault incidents", "Misuse or negligence", "Violations of the rental agreement"].map((item, i) => (
                <li key={i} className="flex gap-3 items-center text-sm text-zinc-600">
                  <AlertCircle size={14} className="text-zinc-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
