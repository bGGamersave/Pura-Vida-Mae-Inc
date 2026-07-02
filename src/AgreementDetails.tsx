import React from 'react';
import { ChevronLeft, Printer, Shield, FileText } from 'lucide-react';

export const AgreementDetails = ({ booking, onBack }: any) => {
  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center h-[60vh] flex flex-col justify-center">
        <h2 className="text-2xl font-bold">Agreement Not Found</h2>
        <button onClick={onBack} className="text-zinc-500 hover:text-zinc-900 mt-4">Go Back</button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 min-h-screen bg-zinc-50">
      <div className="flex justify-between items-center mb-8 print:hidden">
        <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors">
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-800 transition-colors"
        >
          <Printer size={16} />
          Print / Save PDF
        </button>
      </div>

      <div className="bg-white p-8 md:p-12 shadow-sm border border-zinc-200 rounded-3xl print:border-none print:shadow-none print:p-0">
        <div className="border-b-2 border-zinc-900 pb-6 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">PURA VIDA MAE</h1>
            <p className="text-zinc-500 font-medium">Standard Lease & Rental Agreement</p>
          </div>
          <div className="text-right text-sm text-zinc-500">
            <p><strong>Agreement ID:</strong> {booking.id.toUpperCase()}</p>
            <p><strong>Date:</strong> {booking.createdAt?.toDate ? booking.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-10 bg-zinc-50 p-6 rounded-2xl border border-zinc-100 print:bg-transparent print:border-none print:p-0">
          <div>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Guest Information</h3>
            <p className="font-bold text-zinc-900">{booking.signature || 'Electronic Signature on File'}</p>
            <p className="text-zinc-600 text-sm">UID: {booking.userId}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Vehicle Details</h3>
            <p className="flex items-center gap-2 font-bold text-zinc-900">
              {booking.car.make} {booking.car.model} ({booking.car.year})
            </p>
            <p className="text-zinc-600 text-sm">Duration: {booking.days} days</p>
            <p className="text-zinc-600 text-sm">Total Paid/Due: ${booking.fees?.total || booking.totalFees || 0}</p>
          </div>
        </div>

        <div className="space-y-8 text-zinc-800 text-sm leading-relaxed">
          <section>
            <h3 className="text-lg font-bold text-zinc-900 mb-2 flex items-center gap-2">
              1. VEHICLE USE
            </h3>
            <p>The vehicle shall be used solely for personal transport. Off-roading, racing, or commercial use is strictly prohibited unless explicitly authorized in writing. Renter acknowledges returning the vehicle in the same condition as received.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-zinc-900 mb-2 flex items-center gap-2">
              2. INSURANCE & LIABILITY
            </h3>
            <p>Guest is responsible for the vehicle during the rental period. The selected insurance plan provides coverage as detailed in the policy documents. Guest is responsible for any deductible amounts and out-of-pocket damages not covered by the policy.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-zinc-900 mb-2 flex items-center gap-2">
              3. CLEANING & MAINTENANCE
            </h3>
            <p>Vehicle must be returned in the same condition as received. Cleaning and detailing fees are applied to ensure professional sanitization between rentals. A minimum $150 cleaning fee will apply for severe messes (smoking, pet hair, deep stains).</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-zinc-900 mb-2 flex items-center gap-2">
              4. CANCELLATION POLICY
            </h3>
            <p>Customers have a 24-hour grace period for free cancellations starting from the time of booking. If canceled after 24 hours, Pura Vida Mae will retain 10% of the payment and refund the remaining 90%.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-zinc-900 mb-2 flex items-center gap-2">
              5. ELECTRIC VEHICLE & FUEL POLICY
            </h3>
            <p>For Tesla/EV vehicles: Keep battery between 10% and 90% unless necessary for long trips. Renter is 100% liable for any idle/congestion fees at Tesla Superchargers. Supercharging pass-through costs plus a $5 administration fee per rental apply. Vehicle must be returned with the same fuel/charge level as at the start of the trip.</p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200 grid grid-cols-2 gap-8">
          <div>
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Agreed and Signed by Base Renter</p>
            <p className="text-xl font-signature text-zinc-900 italic font-medium">{booking.signature || 'Electronic Signature Confirmed'}</p>
            <div className="w-full h-px border-b border-zinc-900 border-dashed mt-2 mb-1"></div>
            <p className="text-xs text-zinc-500">Date: {booking.createdAt?.toDate ? booking.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Pura Vida Mae Inc. Partner/Host</p>
            <p className="text-xl font-signature text-zinc-900 italic font-medium">Pura Vida Mae Rep.</p>
            <div className="w-full h-px border-b border-zinc-900 border-dashed mt-2 mb-1"></div>
            <p className="text-xs text-zinc-500">Date: {booking.createdAt?.toDate ? booking.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="mt-12 flex justify-center text-zinc-300">
          <Shield size={32} />
        </div>
      </div>
    </div>
  );
};
