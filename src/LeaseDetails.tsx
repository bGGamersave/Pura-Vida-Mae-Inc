import React from 'react';
import { CreditCard, FileText, ChevronLeft, MapPin, Calendar, Clock, Download, Check, Shield } from 'lucide-react';

export const LeaseDetails = ({ booking, onBack, onPayment, onPrint }: any) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 min-h-[60vh]">
      <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-8 transition-colors">
        <ChevronLeft size={20} />
        <span>Back to Dashboard</span>
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-zinc-900">
              {booking.car.make} {booking.car.model}
            </h1>
            <span className="px-3 py-1 bg-zinc-100 text-zinc-800 text-xs font-bold uppercase tracking-wider rounded-full">
              {booking.status}
            </span>
          </div>
          <p className="text-zinc-500 flex items-center gap-2">
            <MapPin size={16} />
            {booking.car.location}
          </p>
        </div>
        <div className="bg-zinc-900 text-white px-6 py-4 rounded-2xl">
          <p className="text-sm text-zinc-400 mb-1">Total Lease Value</p>
          <p className="text-3xl font-bold">${booking.fees?.total || booking.totalFees || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <img 
            src={booking.car.images?.[0] || booking.car.image} 
            alt="Car" 
            className="w-full h-64 object-cover rounded-3xl"
            referrerPolicy="no-referrer"
          />

          <div className="bg-white border border-zinc-200 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-zinc-900 mb-6">Lease Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-zinc-500 mb-1 flex items-center gap-2"><Calendar size={16}/> Duration</p>
                <p className="font-medium text-zinc-900">{booking.days} days</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500 mb-1 flex items-center gap-2"><Shield size={16}/> Protection Plan</p>
                <p className="font-medium text-zinc-900">Standard Coverage</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500 mb-1">Created At</p>
                <p className="font-medium text-zinc-900">
                  {booking.createdAt?.toDate ? booking.createdAt.toDate().toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-500 mb-1">Vehicle Status</p>
                <p className="font-medium text-zinc-900">
                  {booking.isCheckedIn ? "Checked In (In Possession)" : "Awaiting Check-in"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-50 p-2 rounded-full text-blue-600">
                <CreditCard size={20} />
              </div>
              <h3 className="font-bold text-lg text-zinc-900">Payments</h3>
            </div>
            
            <div className="border border-zinc-100 rounded-xl p-4 mb-4 bg-zinc-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-600 text-sm">Next Payment</span>
                <span className="font-bold text-zinc-900">${booking.balanceDue || booking.fees?.total || booking.totalFees || 0}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">Due Date</span>
                <span className="text-zinc-900 font-medium">Upon return</span>
              </div>
            </div>

            <button 
              onClick={() => onPayment(booking)}
              className="w-full bg-zinc-900 text-white py-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors"
            >
              Make a Payment
            </button>
          </div>

          <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-50 p-2 rounded-full text-green-600">
                <FileText size={20} />
              </div>
              <h3 className="font-bold text-lg text-zinc-900">Documents</h3>
            </div>
            
            <button 
              onClick={() => onPrint(booking)}
              className="w-full flex items-center justify-between p-4 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                <div className="text-left">
                  <p className="text-sm font-bold text-zinc-900">Lease Agreement</p>
                  <p className="text-xs text-zinc-500">Signed Official Copy</p>
                </div>
              </div>
              <Download size={18} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
