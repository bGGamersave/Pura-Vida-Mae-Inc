import React from 'react';
import { motion } from 'motion/react';
import { Search, ChevronRight, HelpCircle, Shield, CreditCard, Key, MessageCircle, Info, Mail, Smartphone } from 'lucide-react';

const FAQItem = ({ question, answer, id }: { question: string, answer: string, id?: string, key?: React.Key }) => (
  <div id={id} className={`border-b border-zinc-100 py-6 last:border-0 ${id ? 'scroll-mt-56' : ''}`}>
    <h3 className="text-lg font-bold text-zinc-900 mb-2">{question}</h3>
    <p className="text-zinc-500 leading-relaxed">{answer}</p>
  </div>
);

const HelpCategory = ({ icon: Icon, title, description, buttonText = "Browse articles", onClick }: { icon: any, title: string, description: string, buttonText?: string, onClick?: () => void }) => (
  <div className="p-8 bg-white rounded-[2rem] border border-zinc-100 hover:shadow-xl transition-all duration-500 group">
    <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-900 mb-6 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-zinc-500 text-sm leading-relaxed mb-4">{description}</p>
    <button 
      onClick={onClick}
      className={`text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all ${onClick ? 'cursor-pointer hover:text-zinc-600' : ''}`}
    >
      {buttonText} <ChevronRight size={16} />
    </button>
  </div>
);

export const HelpCenter = () => {
  const scrollToFaqs = () => {
    document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDeposit = () => {
    document.getElementById('faq-deposit')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToRequirements = () => {
    document.getElementById('faq-requirements')?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    {
      question: "How do I book a vehicle?",
      answer: "Choose your vehicle, select your dates, and confirm your booking. You’ll receive confirmation with next steps."
    },
    {
      question: "What is included in the rental?",
      answer: "Your rental includes the vehicle for the selected time period and basic coverage (varies by rental). Charging is included on select EVs and at select charging stations. Check vehicle details for specifics. Support is available if anything comes up."
    },
    {
      id: "faq-deposit",
      question: "Is there a security deposit?",
      answer: "Yes. A $500-$1000 deposit may apply. It is only charged if there is damage, misuse, or an at-fault incident."
    },
    {
      question: "How does pricing work?",
      answer: "We use flat rate pricing with no hidden fees. Taxes are handled on our end, so you know exactly what you’re paying."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Cancellation policies may vary. Review the terms before booking or contact support if you need help."
    },
    {
      id: "faq-requirements",
      question: "What do I need before my rental?",
      answer: "You must have a valid driver’s license. You may also be required to take photos or video of the vehicle before your trip."
    },
    {
      question: "Can someone else drive the car?",
      answer: "No. Only the approved renter is allowed to drive the vehicle."
    },
    {
      question: "What should I do during the rental?",
      answer: "Drive responsibly, follow all traffic laws, and report any issues immediately."
    },
    {
      question: "What happens after I return the car?",
      answer: "Return the vehicle on time and in similar condition. Final photos may be required."
    },
    {
      question: "What if there is an accident or damage?",
      answer: "Ensure safety is paramount then proceed to report it immediately. Follow the provided instructions and submit any required documentation."
    },
    {
      question: "How do I contact support?",
      answer: "puravidamaeinc@outlook.com | (xxx) xxx-xxxx | Reach out directly if you need help before, during, or after your rental."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 py-20"
    >
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
          How can we <span className="text-zinc-400">help?</span>
        </h1>
        <div className="max-w-2xl mx-auto relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search for articles, guides..." 
            className="w-full bg-white border border-zinc-100 rounded-full py-5 pl-16 pr-8 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
        <HelpCategory 
          icon={Key} 
          title="Rentals" 
          description="Everything you need to know about booking and managing your drive."
          buttonText="Jump to section"
          onClick={scrollToFaqs}
        />
        <HelpCategory 
          icon={CreditCard} 
          title="Payments" 
          description="Understanding deposits, flat rates, and tax handling."
          buttonText="Jump to section"
          onClick={scrollToDeposit}
        />
        <HelpCategory 
          icon={Info} 
          title="Policies" 
          description="The simple rules that keep our community fair and honest."
          buttonText="Jump to section"
          onClick={scrollToRequirements}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        <div className="lg:col-span-2 scroll-mt-56" id="faq-section">
          <h2 className="text-3xl font-bold mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index} 
                id={faq.id}
                question={faq.question} 
                answer={faq.answer} 
              />
            ))}
          </div>
        </div>
        <div>
          <div className="bg-zinc-900 rounded-[2.5rem] p-10 text-white sticky top-28">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
              <MessageCircle size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
            <div className="space-y-4 text-zinc-400 mb-8 leading-relaxed text-sm">
              <p>Reach out directly if you need help before, during, or after your rental.</p>
              <div className="pt-4 space-y-2 border-t border-white/10">
                <p className="flex items-center gap-2 text-white font-medium">
                  <Mail size={14} className="text-zinc-400" />
                  puravidamaeinc@outlook.com
                </p>
                <p className="flex items-center gap-2 text-white font-medium">
                  <Smartphone size={14} className="text-zinc-400" />
                  (xxx) xxx-xxxx
                </p>
              </div>
            </div>
            <a 
              href="mailto:puravidamaeinc@outlook.com"
              className="block w-full bg-white text-zinc-900 py-4 rounded-full font-bold hover:bg-zinc-100 transition-colors text-center"
            >
              Email Support
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
