import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import Stripe from "stripe";
import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import firebaseConfig from "./firebase-applet-config.json" with { type: "json" };

dotenv.config();

// Initialize Firebase Admin
if (getApps().length === 0) {
  initializeApp({
    projectId: firebaseConfig.projectId,
  });
}
const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(getApp(), firebaseConfig.firestoreDatabaseId)
  : getFirestore(getApp());

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());

// Stripe webhook needs raw body
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret!);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'identity.verification_session.verified':
      const session = event.data.object as Stripe.Identity.VerificationSession;
      const userId = session.metadata?.user_id;
      if (userId) {
        console.log(`Updating identity verification for user: ${userId}`);
        try {
          await db.collection('users').doc(userId).update({
            isIdentityVerified: true,
            updatedAt: FieldValue.serverTimestamp()
          });
        } catch (error) {
          console.error(`Error updating user ${userId}:`, error);
        }
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

app.use(express.json());

// Initialize Stripe lazily
let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    stripeClient = new Stripe(key, { apiVersion: '2025-02-24.acacia' as any });
  }
  return stripeClient;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/create-verification-session", async (req, res) => {
  try {
    const stripe = getStripe();
    const { userId, returnUrl } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      metadata: {
        user_id: userId,
      },
      return_url: returnUrl,
    });

    res.json({ url: verificationSession.url });
  } catch (error: any) {
    console.error("Stripe Identity Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const stripe = getStripe();
    const { carId, days, totalAmount, successUrl, cancelUrl } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'klarna', 'affirm'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Car Rental - ${days} Days`,
              description: `Booking for car ID: ${carId}`,
            },
            unit_amount: Math.round(totalAmount * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
