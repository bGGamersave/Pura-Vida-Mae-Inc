import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, MapPin, Calendar, CreditCard, Save, Loader2, FileText, Download, MessageSquare } from 'lucide-react';
import { db, doc, getDoc, updateDoc, collection, query, where, getDocs } from './firebase';

interface UserProfileProps {
  user: any;
}

export function UserProfile({ user }: UserProfileProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: user?.email || '',
    address: '',
    identification: ''
  });
  const [savedChats, setSavedChats] = useState<any[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData(prev => ({
            ...prev,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            dateOfBirth: data.dateOfBirth || '',
            address: data.address || '',
            identification: data.identification || ''
          }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchChats = async () => {
      if (!user?.uid) return;
      try {
        const q = query(collection(db, 'chats'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const chatsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        chatsData.sort((a: any, b: any) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
        
        setSavedChats(chatsData);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoadingChats(false);
      }
    };

    fetchProfile();
    fetchChats();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        dateOfBirth: profileData.dateOfBirth,
        address: profileData.address,
        identification: profileData.identification,
        // Update displayName if they set first/last name
        displayName: `${profileData.firstName} ${profileData.lastName}`.trim() || user.displayName
      });
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadChat = (chat: any) => {
    const chatText = chat.messages.map((m: any) => `${m.role === 'user' ? 'You' : 'Pura Vida Mae'}: ${m.text}`).join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PuraVidaMae_Chat_${new Date(chat.createdAt?.toDate?.() || Date.now()).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden"
      >
        <div className="p-8 border-b border-zinc-100 bg-zinc-50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-zinc-200 rounded-full flex items-center justify-center text-zinc-500 overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">Personal Information</h1>
              <p className="text-zinc-500">Update your details for faster booking and PDF generation.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {message.text && (
            <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-shadow"
                  placeholder="John"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-shadow"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-zinc-500 mt-1">Email is tied to your account and cannot be changed here.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profileData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-shadow"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Physical Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-4 w-5 h-5 text-zinc-400" />
              <textarea
                name="address"
                value={profileData.address}
                onChange={handleChange}
                rows={3}
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-shadow resize-none"
                placeholder="123 Main St, City, State, ZIP"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Identification (Driver's License / Passport)</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                name="identification"
                value={profileData.identification}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-shadow"
                placeholder="ID Number"
              />
            </div>
            <p className="text-xs text-zinc-500 mt-1">This information is required for the rental agreement and PDF generation.</p>
          </div>

          <div className="pt-6 border-t border-zinc-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-zinc-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden"
      >
        <div className="p-8 border-b border-zinc-100 bg-zinc-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-200 rounded-full flex items-center justify-center text-zinc-500">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Saved Conversations</h2>
              <p className="text-sm text-zinc-500">Download your past chats with the Pura Vida Mae assistant.</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {loadingChats ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
            </div>
          ) : savedChats.length > 0 ? (
            <div className="space-y-4">
              {savedChats.map((chat) => (
                <div key={chat.id} className="flex items-center justify-between p-4 border border-zinc-200 rounded-xl hover:border-zinc-300 transition-colors">
                  <div>
                    <h3 className="font-medium text-zinc-900">{chat.title || 'Chat Conversation'}</h3>
                    <p className="text-sm text-zinc-500">
                      {chat.createdAt?.toDate?.().toLocaleDateString() || new Date().toLocaleDateString()} • {chat.messages?.length || 0} messages
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadChat(chat)}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-zinc-500">No saved conversations yet.</p>
              <p className="text-sm text-zinc-400 mt-1">Chat with our assistant and click the save icon to keep a record here.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
