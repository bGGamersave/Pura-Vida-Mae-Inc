import React from 'react';
import { motion } from 'motion/react';
import { Eye, Shield, Lock, FileText, Globe, Bell, Mail, Smartphone } from 'lucide-react';

const PrivacySection = ({ icon: Icon, title, content }: { icon: any, title: string, content: string | React.ReactNode }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
    <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-4 tracking-tight">{title}</h3>
    <div className="text-zinc-600 text-sm leading-relaxed space-y-4">
      {typeof content === 'string' ? <p>{content}</p> : content}
    </div>
  </div>
);

export const PrivacyPolicy = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 py-20"
    >
      <div className="text-center mb-24">
        <span className="inline-block px-4 py-1.5 bg-zinc-100 rounded-full text-xs font-bold tracking-widest uppercase mb-6 text-zinc-600">Privacy & Transparency</span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 text-zinc-900 pb-2">
          Your Privacy Matters.
        </h1>
        <p className="text-xl text-zinc-500 max-w-3xl mx-auto leading-relaxed italic">
          Pura Vida Mae respects your privacy. This policy explains what information we collect and how we use it.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        <PrivacySection 
          icon={Eye}
          title="Information We Collect"
          content={
            <>
              <p>We may collect:</p>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                  <span>Name and contact information (email, phone)</span>
                </li>
                <li className="flex gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                  <span>Driver’s license and identification (for verification)</span>
                </li>
                <li className="flex gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                  <span>Payment and booking details</span>
                </li>
                <li className="flex gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                  <span>Device and usage data (such as IP address and browser type)</span>
                </li>
              </ul>
            </>
          }
        />
        <PrivacySection 
          icon={FileText}
          title="How We Use Your Information"
          content={
            <>
              <p>We use your information to:</p>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                  <span>Process bookings and payments</span>
                </li>
                <li className="flex gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                  <span>Verify identity and eligibility</span>
                </li>
                <li className="flex gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                  <span>Communicate with you about your rental</span>
                </li>
                <li className="flex gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                  <span>Improve our services and website</span>
                </li>
                <li className="flex gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                  <span>Maintain safety and prevent fraud</span>
                </li>
              </ul>
            </>
          }
        />
        <PrivacySection 
          icon={Shield}
          title="Security & Cookies"
          content={
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-zinc-900 mb-1 text-xs uppercase tracking-wider text-zinc-400">Data Security</h4>
                <p>We take reasonable steps to protect your information. However, no system is completely secure.</p>
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 mb-1 text-xs uppercase tracking-wider text-zinc-400">Cookies and Tracking</h4>
                <p>We may use basic cookies or similar technologies to improve website performance and user experience.</p>
              </div>
            </div>
          }
        />
        <PrivacySection 
          icon={Globe}
          title="Payments and Identity Verification"
          content={
            <div className="space-y-4">
              <p>We use third-party providers such as Stripe to process payments and assist with identity verification.</p>
              <p>When making a payment or completing verification, your information may be collected and processed directly by Stripe. This may include:</p>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                  <span>Payment details</span>
                </li>
                <li className="flex gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                  <span>Identity information</span>
                </li>
                <li className="flex gap-2">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
                  <span>Verification documents (if required)</span>
                </li>
              </ul>
              <p>Stripe handles this data in accordance with its own privacy and security policies. We do not store full payment information on our systems.</p>
              <p>For more information, please review Stripe’s Privacy Policy.</p>
            </div>
          }
        />
        <PrivacySection 
          icon={Bell}
          title="Communications"
          content="We may contact you regarding active rentals, safety alerts, or policy changes. You can opt-out of marketing communications at any time."
        />
        <PrivacySection 
          icon={Lock}
          title="Your Rights & Responsibilities"
          content={
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-zinc-900 mb-1">Your Rights</h4>
                <p>You may request access, updates, or deletion of your personal information by contacting us.</p>
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 mb-1">Your Responsibilities</h4>
                <p>You are responsible for providing accurate and up-to-date information when using our services.</p>
              </div>
            </div>
          }
        />
      </div>

      <div className="bg-zinc-900 rounded-[3rem] p-12 md:p-20 text-white text-center">
        <h2 className="text-4xl font-black tracking-tight mb-8">Contact</h2>
        <p className="text-zinc-400 text-lg mb-12 max-w-2xl mx-auto italic font-light">
          If you have questions about our Privacy Policy, contact us:
        </p>
        <div className="flex justify-center">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm flex items-center gap-4">
            <Mail className="text-zinc-500" size={24} />
            <span className="text-lg font-medium">puravidamaeinc@outlook.com</span>
          </div>
        </div>
      </div>
      
      <div className="mt-20 text-center text-zinc-400 text-sm">
      </div>
    </motion.div>
  );
};
