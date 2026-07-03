import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please add it via Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. API: Generate Workout Plan using Gemini 3.5 Flash
app.post("/api/workout/generate", async (req, res) => {
  try {
    const { age, weight, height, goal, level, duration, gender, preference, equipment } = req.body;

    const ai = getAi();

    const prompt = `Lütfen şu özelliklere sahip bir sporcu için kişiselleştirilmiş 5 günlük detaylı bir antrenman programı oluştur:
- Yaş: ${age || "Belirtilmedi"}
- Kilo: ${weight || "Belirtilmedi"} kg
- Boy: ${height || "Belirtilmedi"} cm
- Cinsiyet: ${gender || "Belirtilmedi"}
- Hedef: ${goal || "Genel Sağlık ve Kondisyon"}
- Fitness Seviyesi: ${level || "Başlangıç"}
- Günlük Spor Süresi: ${duration || "45"} dakika
- Antrenman Ortamı / Ekipman İmkânı: ${equipment || "Evde (Sadece Vücut Ağırlığı)"}
- Ek Tercihler/Sınırlamalar: ${preference || "Yok"}

Lütfen programı Türkçe dilinde, motive edici, profesyonel bir üslupla ve kesinlikle verilen JSON şemasına tamamen uygun şekilde oluştur. Antrenman ortamındaki ekipman sınırlamalarına kesinlikle sadık kal (örneğin sadece Vücut Ağırlığı seçildiyse dambıl veya ağırlık makineleri içermesin).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Sen profesyonel bir fitness antrenörü ve spor fizyoterapistisin. Kullanıcılara bilimsel temelli, güvenli ve etkili egzersiz programları hazırlarsın. Egzersiz isimlerinin Türkçe karşılıklarını ve varsa yaygın İngilizce isimlerini parantez içinde yaz (örn: Şınav (Push-up)). Her hareket için set, tekrar, hedef kas grubu ve tahmini yakılan kalori değerlerini mantıklı şekilde doldur.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            programName: { 
              type: Type.STRING,
              description: "Programa verilecek motive edici ve özgün başlık"
            },
            summary: { 
              type: Type.STRING,
              description: "Kullanıcının hedeflerine ve seviyesine göre bu programın neden uygun olduğunu açıklayan kısa özet"
            },
            days: {
              type: Type.ARRAY,
              description: "Antrenman programının her günü için egzersiz listesi (toplam 5 gün)",
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER, description: "Gün sırası (1'den 5'e kadar)" },
                  dayName: { type: Type.STRING, description: "Günün başlığı, örn: '1. Gün: Göğüs ve Ön Kol' veya '3. Gün: Kardiyo ve Karın'" },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING, description: "Egzersiz adı" },
                        sets: { type: Type.INTEGER, description: "Set sayısı (örn: 3)" },
                        reps: { type: Type.STRING, description: "Tekrar sayısı veya süresi (örn: '12' veya '30 saniye')" },
                        notes: { type: Type.STRING, description: "Hareket formu, nefes alışı veya dinlenme süresi hakkında kısa ipucu" },
                        targetMuscle: { type: Type.STRING, description: "Hedeflenen ana kas grubu" },
                        estimatedCaloriesBurned: { type: Type.INTEGER, description: "Bu hareketten yakılacak tahmini kalori" }
                      },
                      required: ["name", "sets", "reps", "notes", "targetMuscle", "estimatedCaloriesBurned"]
                    }
                  }
                },
                required: ["dayNumber", "dayName", "exercises"]
              }
            },
            nutritionTips: {
              type: Type.ARRAY,
              description: "Bu programa ve hedefe özel 3-4 adet beslenme ve hidrasyon tavsiyesi",
              items: { type: Type.STRING }
            }
          },
          required: ["programName", "summary", "days", "nutritionTips"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Yapay zekadan boş yanıt döndü.");
    }

    const workoutPlan = JSON.parse(jsonText.trim());
    res.json({ success: true, workoutPlan });
  } catch (error: any) {
    console.error("Yapay zeka antrenman oluşturma hatası:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Antrenman programı oluşturulurken bir hata oluştu." 
    });
  }
});

// 2. Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// 3. Vite middleware for development or serving build in production
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Vite development server mode enabled");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Production server mode enabled");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start server:", err);
});
