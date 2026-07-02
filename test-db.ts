import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function test() {
  try {
    console.log("Testing cars...");
    const snap = await getDocs(collection(db, 'cars'));
    console.log("Cars success:", snap.size);
  } catch (e: any) {
    console.error("Cars error:", e.message);
  }

  try {
    console.log("Testing bookings...");
    const snap = await getDocs(collection(db, 'bookings'));
    console.log("Bookings success:", snap.size);
  } catch (e: any) {
    console.error("Bookings error:", e.message);
  }
}

test();
