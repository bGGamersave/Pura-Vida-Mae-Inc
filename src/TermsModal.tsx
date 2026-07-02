import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
          <h2 className="text-xl font-bold text-zinc-900">Terms of Service</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 prose prose-zinc max-w-none">
          <p className="text-sm text-zinc-500 mb-8">
            To ensure <strong>Pura Vida Mae Inc.</strong> is fully protected while providing a seamless "Tesla-first" experience, I have drafted the specific fee clauses and a comprehensive, copyable Terms of Service (ToS).
          </p>

          <h3 className="text-lg font-bold text-zinc-900 mt-8 mb-4">1. Specific Fee & Deposit Definitions</h3>

          <h4 className="font-bold text-zinc-900 mt-6 mb-2">Supercharging & Idle Fee Pass-Through</h4>
          <ul className="list-disc pl-5 space-y-2 text-zinc-600 mb-6">
            <li><strong>The Logic:</strong> All Supercharging costs incurred during the rental period are the responsibility of the Renter. These are billed directly to the Pura Vida Mae business account.</li>
            <li><strong>The Terms:</strong> Supercharging costs will be billed to the Renter at the actual rate charged by Tesla, plus a <strong>$5.00 Administrative Processing Fee</strong> per rental period to cover the overhead of account reconciliation.</li>
            <li><strong>Idle/Congestion Fees:</strong> If a Renter incurs an "Idle Fee" (staying at a charger after it's full) or a "Congestion Fee" (charging during peak times at busy stations), the Renter is liable for <strong>100% of the cost</strong> as reported by the Tesla app. This is a non-refundable penalty to ensure vehicle availability for other users.</li>
          </ul>

          <h4 className="font-bold text-zinc-900 mt-6 mb-2">Security Deposit Release Terms</h4>
          <ul className="list-disc pl-5 space-y-2 text-zinc-600 mb-8">
            <li><strong>The Logic:</strong> A flat $500 deposit is required for all rentals. This acts as the insurance deductible for major accidents and covers minor damages/fees.</li>
            <li><strong>The Timeline:</strong>
              <ul className="list-circle pl-5 mt-2 space-y-2">
                <li><strong>Post-Trip Inspection:</strong> Performed within 24 hours of vehicle return.</li>
                <li><strong>Release:</strong> If no damages, Supercharging overages, or cleaning violations are found, the $500 hold/charge will be initiated for release within <strong>3 to 5 business days</strong>. (Note: Banking institutions may take additional time to reflect the credit on the Renter's statement).</li>
              </ul>
            </li>
          </ul>

          <hr className="my-8 border-zinc-200" />

          <h3 className="text-lg font-bold text-zinc-900 mt-8 mb-4">2. Copyable Terms of Service (Customized for Pura Vida Mae Inc.)</h3>

          <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 mt-6">
            <h1 className="text-2xl font-black text-zinc-900 mb-2">TERMS OF SERVICE: PURA VIDA MAE INC.</h1>
            <p className="text-sm font-bold text-zinc-500 mb-6">Last Updated: March 30, 2026</p>

            <p className="text-zinc-600 mb-6">
              Welcome to Pura Vida Mae. These Terms of Service (“Terms”) constitute a legally binding agreement between you (“Renter”) and <strong>Pura Vida Mae Inc.</strong> (“Company,” “we,” or “us”). By booking a vehicle through our platform, you agree to comply with and be bound by these Terms.
            </p>

            <h3 className="text-md font-bold text-zinc-900 mt-6 mb-2">1. DIRECT RENTAL RELATIONSHIP</h3>
            <p className="text-zinc-600 mb-6">
              Pura Vida Mae Inc. is a direct vehicle rental provider, not a peer-to-peer marketplace. You are entering into a rental agreement directly with the owner of the vehicle fleet. All vehicles are owned and maintained by Pura Vida Mae Inc. or its affiliates.
            </p>

            <h3 className="text-md font-bold text-zinc-900 mt-6 mb-2">2. ELIGIBILITY & DOCUMENTATION</h3>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600 mb-6">
              <li><strong>Age:</strong> Renters must be at least 21 years of age.</li>
              <li><strong>Identification:</strong> A valid, government-issued driver’s license must be provided and verified via our identity integration before the rental begins.</li>
              <li><strong>Insurance:</strong> You agree that Pura Vida Mae Inc. maintains a master fleet insurance policy. Your $500 security deposit serves as your maximum out-of-pocket deductible for any covered insurance claim.</li>
            </ul>

            <h3 className="text-md font-bold text-zinc-900 mt-6 mb-2">3. FEES & PAYMENTS</h3>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600 mb-6">
              <li><strong>Security Deposit:</strong> A flat <strong>$500.00 security deposit</strong> is required for all bookings. This deposit will be used to satisfy any unpaid Supercharging fees, idle fees, excessive cleaning requirements, or insurance deductibles.</li>
              <li><strong>Supercharging:</strong> Renters are responsible for all Supercharging costs. Total costs will be billed post-trip at the standard Tesla rate plus a $5.00 administrative fee.</li>
              <li><strong>Idle & Congestion Fees:</strong> Renters are 100% liable for any idle fees ($0.50 - $1.00/min) or congestion fees incurred at Tesla Supercharger stations.</li>
              <li><strong>Cleaning:</strong> We do not charge an upfront cleaning fee. However, if the vehicle is returned in a condition requiring professional detailing (e.g., smoking, pet hair, deep stains), a minimum <strong>$150.00 cleaning fee</strong> will be deducted from the security deposit.</li>
            </ul>

            <h3 className="text-md font-bold text-zinc-900 mt-6 mb-2">4. CANCELLATION POLICY</h3>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600 mb-6">
              <li><strong>24-Hour Grace Period:</strong> Full 100% refund for cancellations made within 24 hours of the initial booking.</li>
              <li><strong>Standard Cancellation:</strong> For cancellations made after the 24-hour grace period, Pura Vida Mae Inc. will retain <strong>10% of the total rental cost</strong> as a processing and vehicle holding fee; the remaining 90% will be refunded.</li>
              <li><strong>No-Show:</strong> If the Renter does not arrive within 2 hours of the scheduled pickup time without prior notice, the reservation will be cancelled without refund.</li>
            </ul>

            <h3 className="text-md font-bold text-zinc-900 mt-6 mb-2">5. TESLA TECHNOLOGY & USAGE</h3>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600 mb-6">
              <li><strong>Driver Responsibility:</strong> While our vehicles may be equipped with Autopilot or Full Self-Driving (FSD) capabilities, the Renter remains <strong>100% responsible</strong> for the operation of the vehicle at all times. Hands must remain on the wheel, and the driver must remain attentive.</li>
              <li><strong>Software & Connectivity:</strong> Renters are prohibited from purchasing software upgrades, premium connectivity, or in-car entertainment subscriptions via the vehicle’s touchscreen. Any unauthorized purchases will be billed to the Renter plus a $50 penalty.</li>
              <li><strong>Battery Care:</strong> To maintain battery health, Renters are requested not to discharge the battery below 10% or charge it above 90% unless necessary for a long-distance trip.</li>
            </ul>

            <h3 className="text-md font-bold text-zinc-900 mt-6 mb-2">6. DEPOSIT RELEASE & DISPUTES</h3>
            <ul className="list-disc pl-5 space-y-2 text-zinc-600 mb-6">
              <li><strong>Inspection:</strong> A post-trip digital inspection (including photos) will be conducted within 24 hours of return.</li>
              <li><strong>Refund Timeline:</strong> Security deposits are released within <strong>3 to 5 business days</strong> post-inspection, provided no additional fees or damages are outstanding.</li>
              <li><strong>Governing Law:</strong> These Terms are governed by the laws of the State of California. Any disputes shall be resolved in the courts of San Diego County or Riverside County, California.</li>
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
