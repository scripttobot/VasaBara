import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  writeBatch,
  doc,
} from "firebase/firestore";

function getServerFirestore() {
  const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId:
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
  };

  const app =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  return getFirestore(app);
}

async function cleanupOldMessages(): Promise<{ deletedCount: number }> {
  const db = getServerFirestore();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const cutoffISO = sevenDaysAgo.toISOString();

  const chatsSnapshot = await getDocs(collection(db, "chats"));
  let totalDeleted = 0;

  for (const chatDoc of chatsSnapshot.docs) {
    const messagesRef = collection(db, "chats", chatDoc.id, "messages");
    const oldMessagesQuery = query(
      messagesRef,
      where("timestamp", "<", cutoffISO),
    );
    const oldMessages = await getDocs(oldMessagesQuery);

    if (oldMessages.empty) continue;

    const docs = oldMessages.docs;
    for (let i = 0; i < docs.length; i += 500) {
      const batch = writeBatch(db);
      const chunk = docs.slice(i, i + 500);
      for (const msgDoc of chunk) {
        batch.delete(doc(db, "chats", chatDoc.id, "messages", msgDoc.id));
      }
      await batch.commit();
      totalDeleted += chunk.length;
    }
  }

  return { deletedCount: totalDeleted };
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/cleanup-old-messages", async (_req, res) => {
    try {
      const result = await cleanupOldMessages();
      console.log(
        `[Cleanup] Deleted ${result.deletedCount} messages older than 7 days`,
      );
      res.json({
        success: true,
        deletedCount: result.deletedCount,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[Cleanup] Error cleaning up old messages:", error);
      res.status(500).json({
        success: false,
        error: "Failed to cleanup old messages",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
