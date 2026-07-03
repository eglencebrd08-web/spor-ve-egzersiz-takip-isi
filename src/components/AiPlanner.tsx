import React, { useState } from "react";
import { WorkoutPlan, Exercise } from "../types";
import { 
  Sparkles, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Flame, 
  Target, 
  Dumbbell, 
  HelpCircle,
  Apple,
  CheckCircle2,
  MapPin,
  Heart,
  Calendar,
  Layers
} from "lucide-react";

interface AiPlannerProps {
  onStartExercise: (exercise: Exercise, workoutName: string) => void;
  savedPlan: WorkoutPlan | null;
  onSavePlan: (plan: WorkoutPlan) => void;
}

// Full, rich local preset database of regional exercises depending on muscle group and equipment
const REGIONAL_WORKOUTS: Record<string, Record<string, Exercise[]>> = {
  // 1. ÜST GÖĞÜS (UPPER CHEST)
  "Üst Göğüs": {
    "Evde (Vücut Ağırlığı)": [
      { name: "Decline Şınav (Ayaklar Sandalyede)", sets: 3, reps: "12-15", notes: "Ayaklar yüksekte, gövde eğimli şınav. Üst göğüs liflerini hedefler.", targetMuscle: "Üst Göğüs", estimatedCaloriesBurned: 45 },
      { name: "Pike-to-Cobra Şınavı", sets: 3, reps: "10", notes: "Pike pozisyonundan cobra esnemesine yumuşak geçiş. Omuz ve üst göğüs gücü.", targetMuscle: "Üst Göğüs & Omuz", estimatedCaloriesBurned: 50 },
      { name: "Duraklamalı Decline Şınav", sets: 3, reps: "10-12", notes: "Alt noktada 2 saniye bekleyerek patlayıcı güçle yukarı itin.", targetMuscle: "Üst Göğüs", estimatedCaloriesBurned: 48 },
      { name: "Elmas Decline Şınav", sets: 3, reps: "8-10", notes: "Elmas el pozisyonunda ayaklar yukarıda şınav. İç üst göğüs ve triceps.", targetMuscle: "Üst Göğüs & Triceps", estimatedCaloriesBurned: 46 },
      { name: "Yavaş İnişli Decline Şınav", sets: 3, reps: "10", notes: "4 saniyede inip 1 saniyede kalkış. Eksantrik kas yüklemesi sağlar.", targetMuscle: "Üst Göğüs", estimatedCaloriesBurned: 44 },
      { name: "Duvar Açılı Şınavı (Wall Slide Pushup)", sets: 3, reps: "15", notes: "Dizler bükük, eller yukarıda açıyla duvara karşı şınav. Yeni başlayanlar için ideal.", targetMuscle: "Üst Göğüs", estimatedCaloriesBurned: 35 },
      { name: "Tek Ayak Havada Decline Şınav", sets: 3, reps: "8-10", notes: "Denge ve kor kaslarını da aktif eden tek bacak havada decline şınav.", targetMuscle: "Üst Göğüs & Kor", estimatedCaloriesBurned: 52 },
      { name: "Sandalye Destekli Decline Şınav", sets: 3, reps: "12", notes: "Hareketi iki sandalye kullanarak derinlik katarak yapın.", targetMuscle: "Üst Göğüs", estimatedCaloriesBurned: 47 },
      { name: "Archer Decline Şınav", sets: 3, reps: "8 (Her Yön)", notes: "Ağırlığı bir kola kaydırarak yapılan ileri seviye şınav.", targetMuscle: "Üst Göğüs & Omuz", estimatedCaloriesBurned: 55 },
      { name: "Havlu Dirençli İzometrik Pres", sets: 3, reps: "20 Saniye", notes: "Havluyu göğüs önünde gergin tutarak yukarı doğru maksimum güçle itin.", targetMuscle: "Üst Göğüs Sıkıştırma", estimatedCaloriesBurned: 30 }
    ],
    "Dumbbell ile": [
      { name: "Incline Dumbbell Press (Eğik Sehpa İtiş)", sets: 4, reps: "10-12", notes: "30-45 derece eğimli sehpada dambılları yukarı presleyin.", targetMuscle: "Üst Göğüs", estimatedCaloriesBurned: 65 },
      { name: "Incline Dumbbell Flye (Eğik Sehpa Açış)", sets: 3, reps: "12-15", notes: "Kolları yana kavisli açarak üst göğsü maksimum esnetin.", targetMuscle: "Üst Göğüs", estimatedCaloriesBurned: 55 },
      { name: "Incline Dumbbell Sıkıştırma Press (Hex Press)", sets: 3, reps: "12", notes: "Dambılları birbirine bastırarak yukarı itin. İç üst göğsü uyarır.", targetMuscle: "Üst Göğüs (İç)", estimatedCaloriesBurned: 60 },
      { name: "Low-to-High Dumbbell Flye", sets: 3, reps: "12", notes: "Ayakta dambılları aşağıdan yukarıya çapraz şekilde birleştirin.", targetMuscle: "Üst Göğüs", estimatedCaloriesBurned: 58 },
      { name: "Reverse Grip Dumbbell Press (Ters Tutuş)", sets: 3, reps: "10", notes: "Avuçlar yüze bakacak şekilde dambılları presleyin. Üst göğüs liflerini çok iyi uyarır.", targetMuscle: "Üst Göğüs", estimatedCaloriesBurned: 62 },
      { name: "Incline Svend Press", sets: 3, reps: "15", notes: "İki dambıl plakasını göğüste sıkıştırarak ileri ve yukarı doğru uzatın.", targetMuscle: "İç Üst Göğüs", estimatedCaloriesBurned: 45 },
      { name: "Incline Twist Press", sets: 3, reps: "12", notes: "İterken dambılları döndürerek en üst noktada avuçları kendinize çevirin.", targetMuscle: "Üst Göğüs Detayı", estimatedCaloriesBurned: 63 },
      { name: "Incline Dumbbell Pullover", sets: 3, reps: "12", notes: "Hafif eğimli sehpada baş arkasından dambılı çekerek üst göğsü esnetin.", targetMuscle: "Üst Göğüs & Kanat", estimatedCaloriesBurned: 55 },
      { name: "Tek Kol Incline Dumbbell Press", sets: 3, reps: "10 (Her Kol)", notes: "Tek taraflı basarak dengeleyici kasları ve göğsü maksimum çalıştırın.", targetMuscle: "Üst Göğüs & Karın", estimatedCaloriesBurned: 58 },
      { name: "Incline Dumbbell Hammer Press", sets: 3, reps: "12", notes: "Nötr tutuşla dambılları yukarı itin. Omuz eklemini korur.", targetMuscle: "Üst Göğüs", estimatedCaloriesBurned: 60 }
    ],
    "Salonda (Full Ekipman)": [
      { name: "Incline Barbell Bench Press", sets: 4, reps: "8-10", notes: "Üst göğüs hacminin temel hareketidir. Barı köprücük kemiğinin altına kontrollü indirin.", targetMuscle: "Üst Göğüs Hacim", estimatedCaloriesBurned: 85 },
      { name: "Incline Chest Press Machine", sets: 3, reps: "12", notes: "Makine yardımıyla omuzları yormadan hedef üst göğse odaklanın.", targetMuscle: "Üst Göğüs", estimatedCaloriesBurned: 75 },
      { name: "Low Cable Crossover (Aşağıdan Yukarı)", sets: 3, reps: "15", notes: "Kabloları alttan yukarı ve öne doğru sıkarak birleştirin.", targetMuscle: "Üst Göğüs Çizgisi", estimatedCaloriesBurned: 65 },
      { name: "Smith Machine Incline Press", sets: 4, reps: "10", notes: "Sabit ray üzerinde güvenli ve ağır üst göğüs presi yapın.", targetMuscle: "Üst Göğüs", estimatedCaloriesBurned: 80 },
      { name: "Incline Hammer Strength Press", sets: 3, reps: "10-12", notes: "Açılı bağımsız kollarla üst göğse yoğun bir stimülasyon uygulayın.", targetMuscle: "Üst Göğüs", estimatedCaloriesBurned: 78 },
      { name: "Pec Deck Machine (Yüksek Koltuk)", sets: 3, reps: "12", notes: "Koltuk ayarı aşağıda iken açış yaparak üst göğsü sıkıştırın.", targetMuscle: "Üst Göğüs (İç/Dış)", estimatedCaloriesBurned: 60 },
      { name: "Landmine Chest Press", sets: 3, reps: "12", notes: "Açılı barı iki elle kavrayıp yukarı ve ileri doğru itin.", targetMuscle: "Üst Göğüs & Triceps", estimatedCaloriesBurned: 70 },
      { name: "Dual Cable Incline Flye", sets: 3, reps: "12", notes: "Eğik sehpada iki kablo yardımıyla sabit dirençte üst göğüs açış.", targetMuscle: "Üst Göğüs Lifleri", estimatedCaloriesBurned: 68 },
      { name: "Incline Barbell Close Grip Press", sets: 3, reps: "10", notes: "Dar tutuşla eğik sehpada barı itin. Üst göğüs ortası ve triceps hedeflenir.", targetMuscle: "Üst Göğüs & Arka Kol", estimatedCaloriesBurned: 72 },
      { name: "Kablo Tek Kol Üst Göğüs Sıkıştırma", sets: 3, reps: "12 (Her Kol)", notes: "Tek elle kabloyu çapraz yukarı çekerek tepe kasılmaya odaklanın.", targetMuscle: "Üst Göğüs İzole", estimatedCaloriesBurned: 50 }
    ]
  },
  // 2. ALT GÖĞÜS (LOWER CHEST)
  "Alt Göğüs": {
    "Evde (Vücut Ağırlığı)": [
      { name: "Incline Şınav (Eller Koltukta)", sets: 3, reps: "15-20", notes: "Elleri koltuk veya masaya koyarak şınav çekin. Alt göğüs çizgisine odaklanır.", targetMuscle: "Alt Göğüs", estimatedCaloriesBurned: 40 },
      { name: "Dizüstü Incline Şınav", sets: 3, reps: "15", notes: "Dizler yerde, eller sandalye üzerinde hafif açılı şınav.", targetMuscle: "Alt Göğüs", estimatedCaloriesBurned: 35 },
      { name: "Paralel Sandalye Dips", sets: 3, reps: "8-10", notes: "İki sağlam sandalye arasına geçerek kendinizi aşağı indirip kaldırın.", targetMuscle: "Alt Göğüs & Triceps", estimatedCaloriesBurned: 50 },
      { name: "Geniş Tutuş Incline Şınav", sets: 3, reps: "12-15", notes: "Elleri geniş yerleştirerek alt göğüs dış hattını şekillendirin.", targetMuscle: "Alt Göğüs (Dış)", estimatedCaloriesBurned: 42 },
      { name: "Yerde Havlu Kaydırma Kapama", sets: 3, reps: "10", notes: "Şınav pozisyonunda ellerin altına havlu koyup yana açıp ortada birleştirin.", targetMuscle: "Alt Göğüs Esnetme", estimatedCaloriesBurned: 45 },
      { name: "Tek Kol Destekli Incline Şınav", sets: 3, reps: "8 (Her Kol)", notes: "Ağırlığı bir kola vererek göğüs alt liflerini daha çok zorlayın.", targetMuscle: "Alt Göğüs", estimatedCaloriesBurned: 48 },
      { name: "Yavaş Bırakmalı Incline Şınav", sets: 3, reps: "12", notes: "Aşağıya 3 saniyede inip patlayıcı şekilde kendinizi geri itin.", targetMuscle: "Alt Göğüs Gücü", estimatedCaloriesBurned: 42 },
      { name: "Yengeç Dips (Bench Dips)", sets: 3, reps: "15", notes: "Eller arkada sandalyede, kalçayı indirip kaldırarak alt göğüs ve arka kol çalışın.", targetMuscle: "Alt Göğüs & Arka Kol", estimatedCaloriesBurned: 38 },
      { name: "Duraklamalı Incline Şınav", sets: 3, reps: "12", notes: "Yarı yolda 2 saniye bekleyerek statik dayanıklılığı arttırın.", targetMuscle: "Alt Göğüs", estimatedCaloriesBurned: 44 },
      { name: "Archer Incline Şınav", sets: 3, reps: "10", notes: "Eller yüksekte, bir kol düz kalacak şekilde yana kayarak şınav çekin.", targetMuscle: "Alt Göğüs", estimatedCaloriesBurned: 50 }
    ],
    "Dumbbell ile": [
      { name: "Decline Dumbbell Press (Aşağı Eğik)", sets: 4, reps: "12", notes: "Kalça yukarıda köprü kurarak veya eğik sehpada dambılları itin.", targetMuscle: "Alt Göğüs", estimatedCaloriesBurned: 65 },
      { name: "Decline Dumbbell Flye (Aşağı Eğik Açış)", sets: 3, reps: "12-15", notes: "Aşağı eğimli pozisyonda dambılları yana açarak alt göğsü esnetin.", targetMuscle: "Alt Göğüs", estimatedCaloriesBurned: 55 },
      { name: "High-to-Low Dumbbell Flye", sets: 3, reps: "12", notes: "Ayakta dururken dambılları omuz hizasından kalçaya doğru çapraz indirin.", targetMuscle: "Alt Göğüs Çizgisi", estimatedCaloriesBurned: 58 },
      { name: "Kalça Köprüsünde Dumbbell Press", sets: 4, reps: "12", notes: "Yerde kalça köprüsü kurarak decline basınç açısı elde edip dambıl presleyin.", targetMuscle: "Alt Göğüs & Kalça", estimatedCaloriesBurned: 70 },
      { name: "Dumbbell Decline Hex Press", sets: 3, reps: "12", notes: "Aşağı eğimde dambılları birbirine bastırarak yukarı itin.", targetMuscle: "Alt Göğüs (İç)", estimatedCaloriesBurned: 60 },
      { name: "Dumbbell Pullover (Decline)", sets: 3, reps: "12", notes: "Alt göğüs ve serratus kaslarını germek için dambılı geriye doğru uzatıp çekin.", targetMuscle: "Alt Göğüs & Kanat", estimatedCaloriesBurned: 55 },
      { name: "Tek Kol Decline Dumbbell Press", sets: 3, reps: "10 (Her Kol)", notes: "Tek dambılla köprü pozisyonunda pres yaparak kor kaslarını da devreye sokun.", targetMuscle: "Alt Göğüs & Karın", estimatedCaloriesBurned: 62 },
      { name: "Reverse Grip Decline Press", sets: 3, reps: "10", notes: "Ters tutuşla decline açıda dambıl presi yaparak alt göğsü izole edin.", targetMuscle: "Alt Göğüs Lifleri", estimatedCaloriesBurned: 64 },
      { name: "Decline Svend Press", sets: 3, reps: "15", notes: "Decline pozisyonda dambıl plakasını iki elinizle sıkıştırıp itin.", targetMuscle: "Alt Göğüs", estimatedCaloriesBurned: 45 },
      { name: "Decline Dumbbell Hammer Press", sets: 3, reps: "12", notes: "Nötr tutuşla dambılları decline açıda omuz dostu şekilde presleyin.", targetMuscle: "Alt Göğüs", estimatedCaloriesBurned: 60 }
    ],
    "Salonda (Full Ekipman)": [
      { name: "Asılı Paralel Bar Dips", sets: 4, reps: "10-12", notes: "Gövdeyi hafifçe öne bükerek kendinizi aşağı indirin. Harika alt göğüs inşa eder.", targetMuscle: "Alt Göğüs Sınırları", estimatedCaloriesBurned: 80 },
      { name: "Decline Barbell Bench Press", sets: 4, reps: "8-10", notes: "Büyük ağırlıklarla alt göğüs dolgunluğu için decline sehpada barı itin.", targetMuscle: "Alt Göğüs Hacim", estimatedCaloriesBurned: 90 },
      { name: "High Cable Crossover (Yukarıdan Aşağı)", sets: 3, reps: "15", notes: "Kabloları üstten alıp kalça önünde sıkıştırarak birleştirin.", targetMuscle: "Alt Göğüs Çizgisi", estimatedCaloriesBurned: 70 },
      { name: "Decline Chest Press Machine", sets: 3, reps: "12", notes: "Makine açısını aşağıya ayarlayarak alt göğse odaklı pres yapın.", targetMuscle: "Alt Göğüs", estimatedCaloriesBurned: 75 },
      { name: "Smith Machine Decline Press", sets: 4, reps: "10", notes: "Smith makinesinde alt göğüs çizgisine hizalayarak kontrollü presleyin.", targetMuscle: "Alt Göğüs", estimatedCaloriesBurned: 82 },
      { name: "Tek Kol Kablo Alt Göğüs Çekişi", sets: 3, reps: "12 (Her Kol)", notes: "Kabloyu yukardan aşağı tek kolla çekerek alt göğüs liflerini sıkın.", targetMuscle: "Alt Göğüs Detay", estimatedCaloriesBurned: 55 },
      { name: "Ağırlıklı Bar Dips", sets: 3, reps: "8", notes: "Kemer yardımıyla plaka ekleyerek dips yapın. İleri seviye alt göğüs gücü.", targetMuscle: "Alt Göğüs & Triceps", estimatedCaloriesBurned: 95 },
      { name: "Decline Hammer Strength Press", sets: 3, reps: "10", notes: "Alt göğüs için özel tasarlanmış plakalı makinede pres yapın.", targetMuscle: "Alt Göğüs", estimatedCaloriesBurned: 78 },
      { name: "Aşağı Açılı Cable Press", sets: 3, reps: "12", notes: "Kablo istasyonunda ayakta öne ve aşağıya doğru pres yapın.", targetMuscle: "Alt Göğüs", estimatedCaloriesBurned: 68 },
      { name: "Decline Dumbbell Flye (Kablo Destekli)", sets: 3, reps: "12", notes: "Kablo gerilimini alt açıda kullanarak alt göğüs açış egzersizi yapın.", targetMuscle: "Alt Göğüs", estimatedCaloriesBurned: 70 }
    ]
  },
  // 3. SIRT & KANAT (BACK & LATS)
  "Sırt & Kanat": {
    "Evde (Vücut Ağırlığı)": [
      { name: "Superman Egzersizi", sets: 3, reps: "15", notes: "Yüzüstü yatıp kol ve bacakları yukarı kaldırıp sırtı sıkın.", targetMuscle: "Alt Sırt & Bel", estimatedCaloriesBurned: 35 },
      { name: "Y-T-W Egzersizi (Yerde)", sets: 3, reps: "12", notes: "Kollarla yerde Y, T ve W harfleri oluşturarak kürek kemiklerini sıkıştırın.", targetMuscle: "Üst Sırt & Duruş", estimatedCaloriesBurned: 40 },
      { name: "Havlu ile Sırt Çekişi (Yüzüstü)", sets: 3, reps: "15", notes: "Havluyu gergin tutarak baş arkasına veya göğse doğru çekin.", targetMuscle: "Kanat Kasları", estimatedCaloriesBurned: 45 },
      { name: "Masa Altı Sırt Çekişi (Table Row)", sets: 3, reps: "8-10", notes: "Masanın altına girip kendinizi masanın kenarından yukarı çekin.", targetMuscle: "Tüm Sırt & Biceps", estimatedCaloriesBurned: 55 },
      { name: "Ters Plank (Sırt Aktivasyonu)", sets: 3, reps: "45 Saniye", notes: "Topuklar ve eller üzerinde ters duruşta sırtı sıkarak bekleyin.", targetMuscle: "Tüm Arka Zincir", estimatedCaloriesBurned: 38 },
      { name: "Dirseklerle Yere Bastırma (Elbow Drive)", sets: 3, reps: "15", notes: "Sırtüstü yatıp dirsekleri yere bastırarak gövdeyi hafifçe kaldırın.", targetMuscle: "Kanat Aktivasyonu", estimatedCaloriesBurned: 32 },
      { name: "Superman Hold (Statik)", sets: 3, reps: "30 Saniye", notes: "En üst noktada kalıp sırt, kalça ve beli kasılı şekilde tutun.", targetMuscle: "Alt Sırt Dayanıklılık", estimatedCaloriesBurned: 30 },
      { name: "Kapı Kasası Çekişi (Eğilerek)", sets: 3, reps: "12 (Her Kol)", notes: "Kapı kasasını tutup geriye yaslanın ve tek kolla sırt gücüyle çekin.", targetMuscle: "Kanat (Lat)", estimatedCaloriesBurned: 42 },
      { name: "Kobra Esnetmeli Sırt Sıkıştırma", sets: 3, reps: "12", notes: "Yüzüstü yatarken gövdeyi kaldırıp kolları geriye çekerek sırtı sıkıştırın.", targetMuscle: "Üst ve Orta Sırt", estimatedCaloriesBurned: 35 },
      { name: "Havlu ile İzometrik Ayakta Çekiş", sets: 3, reps: "20 Saniye", notes: "Havluyu ayağınızın altına alıp dik durarak yukarı son güçle çekip bekleyin.", targetMuscle: "İzometrik Sırt", estimatedCaloriesBurned: 28 }
    ],
    "Dumbbell ile": [
      { name: "Bent Over Dumbbell Row (Eğilerek Çekiş)", sets: 4, reps: "12", notes: "Öne eğilip dambılları karnınıza çekerek sırt kalınlığını arttırın.", targetMuscle: "Sırt Kalınlığı", estimatedCaloriesBurned: 70 },
      { name: "One-Arm Dumbbell Row (Tek Kol Çekiş)", sets: 3, reps: "10 (Her Kol)", notes: "Sehpa veya koltuğa yaslanıp tek dambılı yukarı çekin.", targetMuscle: "Geniş Kanat", estimatedCaloriesBurned: 65 },
      { name: "Dumbbell Romanian Deadlift (RDL)", sets: 3, reps: "12", notes: "Sırtı düz tutarak kalçayı geriye itin, dambılları aşağı kaydırın.", targetMuscle: "Alt Sırt & Arka Bacak", estimatedCaloriesBurned: 75 },
      { name: "Dumbbell Shrug (Omuz Silkme)", sets: 3, reps: "15", notes: "Dambıllarla sadece omuzları yukarı kaldırarak trapez kasını çalıştırın.", targetMuscle: "Trapez Kasları", estimatedCaloriesBurned: 50 },
      { name: "Dumbbell Renegade Row", sets: 3, reps: "8 (Her Kol)", notes: "Şınav pozisyonunda dururken sırayla dambılları yukarı çekin.", targetMuscle: "Kanat & Karın", estimatedCaloriesBurned: 72 },
      { name: "Dumbbell Chest Supported Row", sets: 3, reps: "12", notes: "Eğik sehpaya yüzüstü yatıp dambılları çekerek beli koruyun.", targetMuscle: "Orta Sırt", estimatedCaloriesBurned: 68 },
      { name: "Dumbbell Reverse Flye (Arka Omuz)", sets: 3, reps: "15", notes: "Öne eğilip dambılları yana açarak kürek kemiklerini birleştirin.", targetMuscle: "Arka Omuz & Üst Sırt", estimatedCaloriesBurned: 50 },
      { name: "Dumbbell Seal Row", sets: 3, reps: "12", notes: "Düz sehpaya yüzüstü uzanıp dambılları yerden yukarı çekerek sırtı sıkın.", targetMuscle: "Orta Sırt Detayı", estimatedCaloriesBurned: 65 },
      { name: "Dumbbell Pullover (Sırt Odaklı)", sets: 3, reps: "12", notes: "Dirsekleri hafif bükülü tutarak dambılı geriye uzatıp sırt gücüyle çekin.", targetMuscle: "Kanat (Latimus)", estimatedCaloriesBurned: 55 },
      { name: "Dumbbell Yates Row", sets: 3, reps: "12", notes: "45 derece eğilerek dambılları karnın alt kısmına çekin.", targetMuscle: "Alt Sırt & Kanat", estimatedCaloriesBurned: 68 }
    ],
    "Salonda (Full Ekipman)": [
      { name: "Lat Pulldown (Geniş Tutuş Çekiş)", sets: 4, reps: "10", notes: "Barı göğse kontrollü çekerek sırtı genişletin.", targetMuscle: "Geniş Kanat (Lats)", estimatedCaloriesBurned: 75 },
      { name: "Seated Cable Row (Kablo Çekiş)", sets: 3, reps: "12", notes: "Kürek kemiklerini arkada birleştirerek kabloyu karnınıza çekin.", targetMuscle: "Orta Sırt", estimatedCaloriesBurned: 70 },
      { name: "Barbell Deadlift (Klasik)", sets: 4, reps: "6-8", notes: "Tüm arka zinciri çalıştıran en güçlü egzersiz. Dik duruşla barı kaldırın.", targetMuscle: "Tüm Arka Zincir & Bel", estimatedCaloriesBurned: 110 },
      { name: "T-Bar Row", sets: 3, reps: "10", notes: "Açılı tutamaçla ağırlığı yukarı çekerek sırt kalınlığını artırın.", targetMuscle: "Orta ve Üst Sırt", estimatedCaloriesBurned: 85 },
      { name: "Barbell Row", sets: 4, reps: "8-10", notes: "Eğilerek barı karnınıza doğru çekin. En temel sırt egzersizlerindendir.", targetMuscle: "Tüm Sırt Hacmi", estimatedCaloriesBurned: 95 },
      { name: "Close Grip Lat Pulldown", sets: 3, reps: "12", notes: "Dar tutuş aparatıyla çekiş yaparak kanat kaslarının alt kısımlarını uyarın.", targetMuscle: "Alt Kanat Lifleri", estimatedCaloriesBurned: 72 },
      { name: "Single Arm Cable Row", sets: 3, reps: "12 (Her Yön)", notes: "Kabloda tek kolla çekerek sırt kaslarında dengeli gelişim sağlayın.", targetMuscle: "Sırt İzolasyonu", estimatedCaloriesBurned: 65 },
      { name: "Straight Arm Pulldown (Düz Kol)", sets: 3, reps: "15", notes: "Dirsekleri bükmeden kabloyu yukarıdan uyluklarınıza indirin.", targetMuscle: "Kanat İzolasyon", estimatedCaloriesBurned: 60 },
      { name: "Assisted Pull-Up (Destekli Barfiks)", sets: 3, reps: "10", notes: "Makine yardımıyla kendi vücut ağırlığınızı kontrollü olarak yukarı çekin.", targetMuscle: "Tüm Üst Sırt", estimatedCaloriesBurned: 70 },
      { name: "Back Extension (Bel Sehpası)", sets: 3, reps: "15", notes: "Sehpada gövdenizi aşağı indirip doğrularak belinizi güçlendirin.", targetMuscle: "Erector Spinae (Bel)", estimatedCaloriesBurned: 50 }
    ]
  },
  // 4. OMUZ (SHOULDERS)
  "Omuz": {
    "Evde (Vücut Ağırlığı)": [
      { name: "Pike Push-Up (Omuz Şınavı)", sets: 3, reps: "8-10", notes: "Gövdeyi V şeklinde katlayıp başı yere yaklaştırarak omuz gücüyle itin.", targetMuscle: "Ön & Yan Omuz", estimatedCaloriesBurned: 45 },
      { name: "Kol Daireleri (Arm Circles)", sets: 3, reps: "45 Saniye", notes: "Kolları yanlara açıp hızlı ve küçük daireler çizerek omuzu yakın.", targetMuscle: "Omuz Dayanıklılığı", estimatedCaloriesBurned: 30 },
      { name: "Prone Rear Delt Raise (Yerde Arka Omuz)", sets: 3, reps: "15", notes: "Yüzüstü yatıp kollarınızı yana doğru kaldırarak arka omuzu sıkın.", targetMuscle: "Arka Omuz", estimatedCaloriesBurned: 35 },
      { name: "Yengeç Yürüyüşü (Crab Walk)", sets: 3, reps: "30 Saniye", notes: "Yengeç duruşunda ileri geri yürüyerek omuz kuşağını güçlendirin.", targetMuscle: "Omuz & Kor", estimatedCaloriesBurned: 40 },
      { name: "Duvar Destekli Handstand Hold (Amut)", sets: 3, reps: "20 Saniye", notes: "Duvara karşı amuda kalkıp statik durarak omuzları maksimum zorlayın.", targetMuscle: "Omuz Gücü & Karın", estimatedCaloriesBurned: 50 },
      { name: "Yunus Pozisyonu (Dolphin Pose)", sets: 3, reps: "12", notes: "Plank pozisyonunda dirsekler üstünde kalçayı yukarı ve öne itin.", targetMuscle: "Omuz Mobilite", estimatedCaloriesBurned: 35 },
      { name: "Dirsek Üstü Omuz İtişi (Plank Press)", sets: 3, reps: "10", notes: "Plank pozisyonundan şınav pozisyonuna tek tek kollarla yükselin.", targetMuscle: "Omuz & Kor Gücü", estimatedCaloriesBurned: 45 },
      { name: "Havlu Dirençli Öne Pres", sets: 3, reps: "20 Saniye", notes: "Havluyu omuz hizasında tutup yukarı doğru izometrik kuvvetle itin.", targetMuscle: "İzometrik Omuz", estimatedCaloriesBurned: 25 },
      { name: "Ayakta Kollar Yanda Statik Bekleme", sets: 3, reps: "60 Saniye", notes: "Kolları yere paralel olarak yana açın ve hiç oynatmadan bekleyin.", targetMuscle: "Yan Omuz Dayanıklılık", estimatedCaloriesBurned: 28 },
      { name: "Pike Hold (Statik)", sets: 3, reps: "30 Saniye", notes: "Pike şınavın alt noktasında bekleyerek omuz kaslarını uyarın.", targetMuscle: "Omuz Gücü", estimatedCaloriesBurned: 35 }
    ],
    "Dumbbell ile": [
      { name: "Seated Dumbbell Shoulder Press", sets: 4, reps: "10", notes: "Oturarak dambılları yukarı presleyerek omuz kütlesini arttırın.", targetMuscle: "Ön & Yan Omuz", estimatedCaloriesBurned: 65 },
      { name: "Dumbbell Lateral Raise (Yana Açış)", sets: 3, reps: "15", notes: "Dirsekler hafif bükük, dambılları yana omuz hizasına kadar kaldırın.", targetMuscle: "Yan Omuz", estimatedCaloriesBurned: 50 },
      { name: "Bent Over Rear Delt Raise (Arka Omuz)", sets: 3, reps: "15", notes: "Öne eğilip dambılları yana açarak arka omuzu hedefleyin.", targetMuscle: "Arka Omuz", estimatedCaloriesBurned: 50 },
      { name: "Dumbbell Front Raise (Öne Açış)", sets: 3, reps: "12", notes: "Dambılları sırayla öne omuz hizasına kadar kontrollü kaldırın.", targetMuscle: "Ön Omuz", estimatedCaloriesBurned: 45 },
      { name: "Dumbbell Arnold Press", sets: 4, reps: "10", notes: "Döndürerek yapılan bu pres tüm omuz başlarını mükemmel çalıştırır.", targetMuscle: "Tüm Omuz Kasları", estimatedCaloriesBurned: 70 },
      { name: "Dumbbell Upright Row (Çeneye)", sets: 3, reps: "12", notes: "Dambılları vücuda yakın tutarak çeneye doğru çekin.", targetMuscle: "Yan Omuz & Trapez", estimatedCaloriesBurned: 55 },
      { name: "Standing Dumbbell Shoulder Press", sets: 3, reps: "10", notes: "Ayakta basarak kor kaslarını da omuz presine dahil edin.", targetMuscle: "Omuz Gücü & Kor", estimatedCaloriesBurned: 68 },
      { name: "Incline Bench Lateral Raise", sets: 3, reps: "12", notes: "Eğik sehpaya yan yatıp dambılı yana açarak yan omuzu izole edin.", targetMuscle: "Yan Omuz İzolasyon", estimatedCaloriesBurned: 48 },
      { name: "Dumbbell W-Press", sets: 3, reps: "12", notes: "Kolları W şeklinde tutup dışa açıyla pres yapın.", targetMuscle: "Ön & Yan Omuz", estimatedCaloriesBurned: 60 },
      { name: "Dumbbell Bus Driver (Direksiyon)", sets: 3, reps: "45 Saniye", notes: "Dambılı iki elle önde düz tutup direksiyon gibi sağa sola çevirin.", targetMuscle: "Omuz Statik & Kor", estimatedCaloriesBurned: 52 }
    ],
    "Salonda (Full Ekipman)": [
      { name: "Overhead Barbell Press (Askeri Pres)", sets: 4, reps: "8", notes: "Ayakta barı yukarı tamamen kilitleyin. Temel omuz gücü hareketidir.", targetMuscle: "Omuz Gücü & Kor", estimatedCaloriesBurned: 85 },
      { name: "Cable Lateral Raise (Kablo Yana)", sets: 3, reps: "15", notes: "Kablo makinesinde yana açış yaparak kas gerilimini sabit tutun.", targetMuscle: "Yan Omuz", estimatedCaloriesBurned: 55 },
      { name: "Face Pull (Halat ile)", sets: 3, reps: "15", notes: "Halatı yüzünüze çekip dirsekleri arkaya açarak arka omuzu sıkın.", targetMuscle: "Arka Omuz & Rotator", estimatedCaloriesBurned: 50 },
      { name: "Machine Shoulder Press", sets: 3, reps: "12", notes: "Omuz makinesinde kontrollü pres yaparak tükenişe gidin.", targetMuscle: "Tüm Omuz", estimatedCaloriesBurned: 70 },
      { name: "Behind the Neck Press (Enseye)", sets: 3, reps: "10", notes: "Barı dikkatli şekilde enseye indirip omuz gücüyle yukarı presleyin.", targetMuscle: "Omuz & Üst Sırt", estimatedCaloriesBurned: 75 },
      { name: "Cable Front Raise", sets: 3, reps: "12", notes: "Kablo yardımıyla ön omuzu sabit direnç altında çalıştırın.", targetMuscle: "Ön Omuz İzolasyon", estimatedCaloriesBurned: 52 },
      { name: "Reverse Pec Deck Flye (Arka Omuz)", sets: 3, reps: "15", notes: "Açış makinesine ters oturarak arka omuzları hedefleyin.", targetMuscle: "Arka Omuz", estimatedCaloriesBurned: 55 },
      { name: "Cable Rear Delt Row", sets: 3, reps: "12", notes: "Kabloları çapraz tutup dirsekleri yana açarak çekiş yapın.", targetMuscle: "Arka Omuz Detayı", estimatedCaloriesBurned: 58 },
      { name: "Smith Machine Shoulder Press", sets: 3, reps: "10", notes: "Sabit ray üzerinde güvenli ve ağır omuz presi uygulayın.", targetMuscle: "Omuz Hacim", estimatedCaloriesBurned: 72 },
      { name: "Single Arm Cable Lateral Raise", sets: 3, reps: "12 (Her Kol)", notes: "Tek kolla kabloyu yana çekerek kasın yanma sınırını zorlayın.", targetMuscle: "Yan Omuz Detay", estimatedCaloriesBurned: 50 }
    ]
  },
  // 5. BICEPS (ÖN KOL / PAZI)
  "Biceps": {
    "Evde (Vücut Ağırlığı)": [
      { name: "Havlu Biceps Curl (İzometrik)", sets: 3, reps: "20 Saniye", notes: "Havluyu ayağın altına alıp iki uçtan pazı gücüyle yukarı çekip bekleyin.", targetMuscle: "Pazı (Biceps)", estimatedCaloriesBurned: 30 },
      { name: "Masa Altı Dar Çekiş (Chin-Up)", sets: 3, reps: "8-10", notes: "Masa altına girip avuçlar kendinize bakacak şekilde yukarı çekilin.", targetMuscle: "Biceps & Kanat", estimatedCaloriesBurned: 50 },
      { name: "Kapı Kasası Tek Kol Çekiş", sets: 3, reps: "12 (Her Kol)", notes: "Kapı kenarını tutup ayakları yaklaştırıp vücudunuzu pazı gücüyle çekin.", targetMuscle: "Biceps İzolasyon", estimatedCaloriesBurned: 35 },
      { name: "Beden Ağırlığı Biceps Curl", sets: 3, reps: "10", notes: "Bir sandalye altında kendinizi sadece biceps gücüyle yukarı çekin.", targetMuscle: "Biceps", estimatedCaloriesBurned: 45 },
      { name: "Ters Ellerle Şınav (Biceps Sıkıştırma)", sets: 3, reps: "10", notes: "Elleri geriye döndürüp gövdeye yakın yerleştirerek şınav çekin.", targetMuscle: "Biceps & Göğüs", estimatedCaloriesBurned: 40 },
      { name: "Havlu ile Bacak Altından Çekiş", sets: 3, reps: "15 (Her Kol)", notes: "Havluyu bacağınızın altından geçirip bacak ağırlığıyla biceps curl yapın.", targetMuscle: "Pazı Gelişimi", estimatedCaloriesBurned: 38 },
      { name: "Statik Biceps Curl (90 Derece)", sets: 3, reps: "45 Saniye", notes: "Evdeki ağırlıkları veya su şişelerini dirsek 90 derece açıda havada tutun.", targetMuscle: "Biceps Dayanıklılık", estimatedCaloriesBurned: 28 },
      { name: "Yüzüstü Yerçekimi Curl", sets: 3, reps: "15", notes: "Yüzüstü yatıp kolları boşluğa sarkıtarak su şişeleriyle curl yapın.", targetMuscle: "Biceps Tepe Noktası", estimatedCaloriesBurned: 32 },
      { name: "Su Şişesiyle Biceps Curl", sets: 3, reps: "20", notes: "Evdeki büyük su şişelerini dirsekleri sabitleyerek yukarı bükün.", targetMuscle: "Pazı (Biceps)", estimatedCaloriesBurned: 35 },
      { name: "Su Şişesiyle Çekiç (Hammer) Curl", sets: 3, reps: "20", notes: "Avuçlar birbirine bakacak şekilde su şişelerini bükün.", targetMuscle: "Pazı & Ön Kol", estimatedCaloriesBurned: 35 }
    ],
    "Dumbbell ile": [
      { name: "Dumbbell Biceps Curl (Pazı Bükme)", sets: 4, reps: "12", notes: "Avuçlar yukarı bakacak şekilde dirsekleri sabitleyip dambılları kaldırın.", targetMuscle: "Pazı (Biceps)", estimatedCaloriesBurned: 50 },
      { name: "Dumbbell Hammer Curl (Çekiç)", sets: 3, reps: "12", notes: "Avuçlar birbirine bakacak şekilde dambılları bükerek kol kalınlığını artırın.", targetMuscle: "Biceps & Brachialis", estimatedCaloriesBurned: 50 },
      { name: "Dumbbell Concentration Curl (Konsantrasyon)", sets: 3, reps: "12 (Her Kol)", notes: "Dirseği uyluğun içine sabitleyip tek kolla dambılı yukarı bükün.", targetMuscle: "Pazı Tepe Noktası", estimatedCaloriesBurned: 45 },
      { name: "Incline Dumbbell Curl (Eğik Sehpa)", sets: 3, reps: "10", notes: "Eğimli sehpada kolları geriden çekerek biceps uzun başını esnetin.", targetMuscle: "Biceps Uzun Baş", estimatedCaloriesBurned: 48 },
      { name: "Dumbbell Preacher Curl (Pazı Sehpası)", sets: 3, reps: "12", notes: "Kolunuzu sehpaya dayayarak dambıllarla pazı bükme yapın.", targetMuscle: "Biceps Alt Baş", estimatedCaloriesBurned: 45 },
      { name: "Dumbbell Spider Curl (Yüzüstü)", sets: 3, reps: "12", notes: "Sehpaya yüzüstü yatıp kollarınızı sarkıtarak dambılları bükün.", targetMuscle: "Biceps Sıkıştırma", estimatedCaloriesBurned: 46 },
      { name: "Zottman Curl (Dönüşlü)", sets: 3, reps: "12", notes: "Yukarı kaldırırken avuçlar yukarı, indirirken avuçlar aşağı baksın.", targetMuscle: "Biceps & Ön Kol", estimatedCaloriesBurned: 52 },
      { name: "Dumbbell Drag Curl (Sürterek)", sets: 3, reps: "10", notes: "Dambılları gövdenize yakın sürterek arkaya doğru çekip bükün.", targetMuscle: "Pazı Tepe Noktası", estimatedCaloriesBurned: 48 },
      { name: "Cross Body Hammer Curl (Çapraz Çekiç)", sets: 3, reps: "12", notes: "Dambılı çapraz omuz yönüne doğru kaldırarak kol dışını uyarın.", targetMuscle: "Brachioradialis", estimatedCaloriesBurned: 50 },
      { name: "Seated Outer Biceps Curl (Dışa Doğru)", sets: 3, reps: "12", notes: "Otururken dambılları vücudun dış yanlarına doğru bükün.", targetMuscle: "İç Biceps Lifleri", estimatedCaloriesBurned: 48 }
    ],
    "Salonda (Full Ekipman)": [
      { name: "Z-Bar Biceps Curl (Z-Bar Pazı)", sets: 4, reps: "10", notes: "Bilekleri koruyan açılı Z-barla yüksek ağırlıklı pazı bükün.", targetMuscle: "Biceps (Hacim)", estimatedCaloriesBurned: 60 },
      { name: "Cable Biceps Curl (Kablo Pazı)", sets: 4, reps: "12-15", notes: "Kablolu istasyonda çekiş yaparak tepe kasılmasını artırın.", targetMuscle: "Biceps Sıkıştırma", estimatedCaloriesBurned: 55 },
      { name: "Preacher Curl Machine (Pazı Makinesi)", sets: 3, reps: "12", notes: "Preacher makinesinde omuzları devreden çıkarıp tamamen biceps çalışın.", targetMuscle: "Biceps Alt Bölge", estimatedCaloriesBurned: 50 },
      { name: "EZ-Bar Spider Curl (Z-Bar Yüzüstü)", sets: 3, reps: "12", notes: "Yüzüstü sehpada Z-barla bicepsleri izole edin.", targetMuscle: "Biceps Tepe", estimatedCaloriesBurned: 52 },
      { name: "High Cable Curl (Çift Kablo)", sets: 3, reps: "12", notes: "İki kabloyu yukarıdan tutup kulaklarınıza doğru çekip pazıları sıkın.", targetMuscle: "Biceps Tepe Noktası", estimatedCaloriesBurned: 48 },
      { name: "Cable Hammer Curl (Halat Çekiş)", sets: 3, reps: "12", notes: "Kablo alt makarada halat yardımıyla çekiç pazı büküşü yapın.", targetMuscle: "Brachialis & Ön Kol", estimatedCaloriesBurned: 50 },
      { name: "Single Arm Cable Preacher Curl", sets: 3, reps: "12 (Her Kol)", notes: "Preacher sehpasında kabloyla tek kolla pazı bükün.", targetMuscle: "Biceps İzolasyon", estimatedCaloriesBurned: 46 },
      { name: "Barbell Biceps Curl (Düz Bar)", sets: 4, reps: "8", notes: "Düz uzun barla temel kütle ve güç biceps curls yapın.", targetMuscle: "Biceps Genel", estimatedCaloriesBurned: 65 },
      { name: "Lying Cable Curl (Yatarak Pazı)", sets: 3, reps: "12", notes: "Yere yatıp kabloyu alından geriye doğru bükerek pazı çalışın.", targetMuscle: "Biceps Sıkıştırma", estimatedCaloriesBurned: 52 },
      { name: "Cable Concentration Curl (Kablo)", sets: 3, reps: "15", notes: "Kabloda tek kolla konsantrasyon yaparak maksimum kasılma sağlayın.", targetMuscle: "Biceps Tepe Detayı", estimatedCaloriesBurned: 48 }
    ]
  },
  // 6. TRICEPS (ARKA KOL)
  "Triceps": {
    "Evde (Vücut Ağırlığı)": [
      { name: "Bench Dips (Sandalye Arkası)", sets: 3, reps: "15", notes: "Elleri sandalyeye yerleştirip kalçayı indirip arka kolla kendinizi itin.", targetMuscle: "Arka Kol (Triceps)", estimatedCaloriesBurned: 40 },
      { name: "Yengeç Şınavı (Triceps Push-Up)", sets: 3, reps: "10-12", notes: "Elleri omuzdan dar yerleştirip dirsekleri arkaya bükerek şınav çekin.", targetMuscle: "Arka Kol (İç)", estimatedCaloriesBurned: 45 },
      { name: "Duvar Triceps Uzatması", sets: 3, reps: "12", notes: "Duvara karşı durup sadece dirsekleri büküp duvardan kendinizi itin.", targetMuscle: "Triceps İzolasyon", estimatedCaloriesBurned: 35 },
      { name: "Dirsek Yükseltme Şınavı (Tiger Push-Up)", sets: 3, reps: "8-10", notes: "Plank pozisyonunda dirsekleri aynı anda yerden kaldırıp şınav kilitleyin.", targetMuscle: "Triceps Gücü", estimatedCaloriesBurned: 48 },
      { name: "Sandalye Üzerinde Dar Şınav", sets: 3, reps: "12", notes: "Eller yüksekte, yakın el pozisyonuyla triceps şınavı çekin.", targetMuscle: "Triceps & İç Göğüs", estimatedCaloriesBurned: 42 },
      { name: "Tek Kol Duvar Triceps İtişi", sets: 3, reps: "10 (Her Yön)", notes: "Yandan duvara yaslanıp tek kolla kendinizi iterek arka kolu izole edin.", targetMuscle: "Triceps", estimatedCaloriesBurned: 38 },
      { name: "Statik Plank Triceps Sıkıştırma", sets: 3, reps: "45 Saniye", notes: "Dirsekleri hafif kaldırarak plankta bekleyip triceps kasılmasını koruyun.", targetMuscle: "Triceps Statik", estimatedCaloriesBurned: 35 },
      { name: "Sandalyede Baş Arkası Havlu İtişi", sets: 3, reps: "15", notes: "Havluyu baş arkasında tutup iki elle direnç uygulayarak yukarı itin.", targetMuscle: "Triceps Uzun Baş", estimatedCaloriesBurned: 30 },
      { name: "Decline Bench Dips (Ayaklar Yüksekte)", sets: 3, reps: "12", notes: "Ayakları da başka bir sandalyeye koyarak dips zorluğunu artırın.", targetMuscle: "Triceps Gücü", estimatedCaloriesBurned: 45 },
      { name: "Triceps Kickback (Vücut Ağırlığı)", sets: 3, reps: "15", notes: "Eğilip kolları arkada sabitleyin, sadece dirsekten geriye uzatarak sıkın.", targetMuscle: "Triceps Detay", estimatedCaloriesBurned: 28 }
    ],
    "Dumbbell ile": [
      { name: "Overhead Dumbbell Extension (Baş Arkası)", sets: 3, reps: "12", notes: "Dambılı iki elle baş arkasında tutup dirsekleri göğe doğru kilitleyin.", targetMuscle: "Triceps Uzun Baş", estimatedCaloriesBurned: 50 },
      { name: "Dumbbell Kickback (Arkaya Tekme)", sets: 3, reps: "12", notes: "Gövdeyi öne eğin, dirseği sabitleyip dambılı geriye doğru düzleştirin.", targetMuscle: "Triceps Dış Baş", estimatedCaloriesBurned: 45 },
      { name: "Lying Dumbbell Triceps Extension (Alna)", sets: 3, reps: "12", notes: "Yatarak dambılları şakak hizasına indirip dirsekten yukarı itin.", targetMuscle: "Triceps Genel", estimatedCaloriesBurned: 50 },
      { name: "Close Grip Dumbbell Press (Dar İtiş)", sets: 4, reps: "12", notes: "Dambılları göğüste birbirine yapıştırıp yukarı presleyin.", targetMuscle: "Triceps & İç Göğüs", estimatedCaloriesBurned: 55 },
      { name: "Tate Press (Dirsek İçe)", sets: 3, reps: "12", notes: "Yerde dambılları göğse doğru içe büküp yukarı dirsekten kilitleyin.", targetMuscle: "Triceps Detayı", estimatedCaloriesBurned: 48 },
      { name: "Incline Dumbbell Triceps Kickback", sets: 3, reps: "12", notes: "Eğik sehpada yüzüstü uzanarak dambılları arkaya tekmeleyin.", targetMuscle: "Triceps", estimatedCaloriesBurned: 48 },
      { name: "Single Arm Overhead Extension", sets: 3, reps: "10 (Her Kol)", notes: "Tek kolla dambılı baş arkasından yukarı presleyerek dengeli çalışın.", targetMuscle: "Triceps İzolasyon", estimatedCaloriesBurned: 46 },
      { name: "Seated Dumbbell French Press", sets: 3, reps: "12", notes: "Dik otururken dambılı iki elle tutup baş arkasına indirip kaldırın.", targetMuscle: "Triceps Uzun Baş", estimatedCaloriesBurned: 50 },
      { name: "Dumbbell Floor Close Grip Press", sets: 4, reps: "12", notes: "Yerde yatarken dar tutuş dambıl presi yaparak tricepslerinizi kalınlaştırın.", targetMuscle: "Triceps Hacim", estimatedCaloriesBurned: 55 },
      { name: "Dumbbell DB Cross-Body Extension", sets: 3, reps: "12", notes: "Dambılı karşı omuza doğru yatarak indirip dirsekten kilitleyin.", targetMuscle: "Triceps İzolasyon", estimatedCaloriesBurned: 48 }
    ],
    "Salonda (Full Ekipman)": [
      { name: "Triceps Rope Pushdown (Halat İtiş)", sets: 4, reps: "12-15", notes: "Halatı aşağı itin ve en altta iki ucu yana açarak arka kolu sıkın.", targetMuscle: "Arka Kol Dış Baş", estimatedCaloriesBurned: 55 },
      { name: "Cable Overhead Extension (Kablo Başüstü)", sets: 3, reps: "12", notes: "Kabloyu arkanıza alıp baş üstünden ileri doğru kilitleyin.", targetMuscle: "Triceps Uzun Baş", estimatedCaloriesBurned: 55 },
      { name: "Close Grip Barbell Bench Press (Dar Press)", sets: 4, reps: "8-10", notes: "Dar tutuşla barı benchte itin. Triceps kütlesi için en iyi harekettir.", targetMuscle: "Triceps Kütle", estimatedCaloriesBurned: 80 },
      { name: "Skull Crusher (Alna Z-Bar)", sets: 4, reps: "10", notes: "EZ barla alna veya baş arkasına doğru dirsekleri büküp uzatın.", targetMuscle: "Triceps Genel", estimatedCaloriesBurned: 75 },
      { name: "Cable V-Bar Pushdown (V-Bar İtiş)", sets: 3, reps: "12", notes: "V bar aparatı ile aşağıya pres yaparak yüksek gerilim sağlayın.", targetMuscle: "Triceps Dış/İç", estimatedCaloriesBurned: 58 },
      { name: "Machine Triceps Dips (Arka Kol Makinesi)", sets: 3, reps: "12", notes: "Dips makinesinde oturarak kolları aşağıya doğru presleyin.", targetMuscle: "Triceps Gücü", estimatedCaloriesBurned: 70 },
      { name: "Single Arm Cable Pushdown (Tek Kol)", sets: 3, reps: "12 (Her Kol)", notes: "Kabloda tek kolla ters tutuş veya düz tutuşla aşağı itin.", targetMuscle: "Triceps İzolasyon", estimatedCaloriesBurned: 50 },
      { name: "Smith Machine Close Grip Press", sets: 3, reps: "10", notes: "Smith makinesinde dar tutuşla arka kol odaklı kontrollü pres yapın.", targetMuscle: "Triceps Hacim", estimatedCaloriesBurned: 72 },
      { name: "Cable Underhand Pushdown (Ters Tutuş)", sets: 3, reps: "12", notes: "Avuçlar yukarı bakacak şekilde düz barı aşağı itin. İç baş hedeflenir.", targetMuscle: "Triceps İç Baş", estimatedCaloriesBurned: 52 },
      { name: "Weighted Bench Dips (Ağırlıklı Dips)", sets: 3, reps: "8-10", notes: "Bacakların üstüne ağırlık plakası koyarak sandalye/sehpa dips yapın.", targetMuscle: "Triceps Gücü", estimatedCaloriesBurned: 75 }
    ]
  },
  // 7. BACAK & KALÇA (LEGS & GLUTES)
  "Bacak & Kalça": {
    "Evde (Vücut Ağırlığı)": [
      { name: "Vücut Ağırlığı Squat (Çömelme)", sets: 4, reps: "20", notes: "Kalçayı geriye vererek dizler ayak parmak ucunu geçmeden çömelin.", targetMuscle: "Ön Bacak & Kalça", estimatedCaloriesBurned: 65 },
      { name: "Bulgar Split Squat", sets: 3, reps: "10 (Her Bacak)", notes: "Tek ayağınızı arkada sandalyeye koyup tek bacakla çömelin. Çok etkilidir.", targetMuscle: "Bacak & Kalça", estimatedCaloriesBurned: 70 },
      { name: "Yürüyen Lunge (Adımlama)", sets: 3, reps: "20 Adım", notes: "Geniş bir adımla öne çökün, dizinizi yere yaklaştırıp sırayla yürüyün.", targetMuscle: "Ön/Arka Bacak & Kalça", estimatedCaloriesBurned: 60 },
      { name: "Glute Bridge (Kalça Köprüsü)", sets: 3, reps: "15", notes: "Sırtüstü yatıp kalçanızı yukarı itin ve en üst noktada 2 saniye sıkın.", targetMuscle: "Kalça (Gluteus)", estimatedCaloriesBurned: 35 },
      { name: "Tek Ayak Kalça Köprüsü", sets: 3, reps: "10 (Her Bacak)", notes: "Tek bacağınızı düz havaya kaldırarak köprü kurup zorluğu artırın.", targetMuscle: "Kalça & Arka Bacak", estimatedCaloriesBurned: 40 },
      { name: "Donkey Kick (Eşek Tekmesi)", sets: 3, reps: "15 (Her Bacak)", notes: "Emekleme pozisyonunda bacağınızı bükülü olarak yukarı tekmeleyin.", targetMuscle: "Büyük Kalça Kası", estimatedCaloriesBurned: 30 },
      { name: "Fire Hydrant (Yana Bacak Açış)", sets: 3, reps: "15 (Her Bacak)", notes: "Emekleme pozisyonunda dizinizi yana doğru köpek gibi açın.", targetMuscle: "Yan Kalça (Glute Medius)", estimatedCaloriesBurned: 30 },
      { name: "Jump Squat (Zıplayarak)", sets: 3, reps: "12", notes: "Squattan yukarı doğru patlayıcı bir zıplama yapın. Nabız ve güç artışı.", targetMuscle: "Ön Bacak & Kardiyo", estimatedCaloriesBurned: 75 },
      { name: "Sumo Squat (Geniş Çömelme)", sets: 3, reps: "15", notes: "Ayakları geniş açıp parmak uçlarını dışa çevirerek iç bacak odaklı çömelin.", targetMuscle: "İç Bacak & Kalça", estimatedCaloriesBurned: 65 },
      { name: "Side Lunge (Yana Adımlama)", sets: 3, reps: "10 (Her Bacak)", notes: "Sağa ve sola geniş adımlar atarak tek bacak üzerine çökün.", targetMuscle: "İç/Dış Bacak & Kalça", estimatedCaloriesBurned: 58 }
    ],
    "Dumbbell ile": [
      { name: "Dumbbell Goblet Squat", sets: 4, reps: "15", notes: "Dambılı göğüs önünde dikey tutup dik durarak derin çömelin.", targetMuscle: "Ön Bacak & Kor", estimatedCaloriesBurned: 80 },
      { name: "Dumbbell Romanian Deadlift (RDL)", sets: 4, reps: "12", notes: "Dambıllarla kalçayı olabildiğince geriye itip arka bacakları esnetin.", targetMuscle: "Arka Bacak & Kalça", estimatedCaloriesBurned: 85 },
      { name: "Dumbbell Bulgarian Split Squat", sets: 3, reps: "10 (Her Bacak)", notes: "İki elde dambıllarla sandalye destekli split squat uygulayın.", targetMuscle: "Bacak Hacim & Güç", estimatedCaloriesBurned: 80 },
      { name: "Dumbbell Walking Lunge", sets: 3, reps: "16 Adım", notes: "Dambılları yanlarda tutarak adımlayarak lunge yapın.", targetMuscle: "Tüm Bacak Kasları", estimatedCaloriesBurned: 75 },
      { name: "Dumbbell Glute Bridge (Ağırlıklı)", sets: 3, reps: "15", notes: "Dambılı kalçanızın üstüne koyarak kalça köprüsü kurun.", targetMuscle: "Kalça Gücü", estimatedCaloriesBurned: 55 },
      { name: "Dumbbell Sumo Squat", sets: 3, reps: "12", notes: "Dambılı iki elle ortada sallandırıp geniş açıyla çömelin.", targetMuscle: "İç Bacak & Kalça", estimatedCaloriesBurned: 78 },
      { name: "Dumbbell Step-Up (Adımlama)", sets: 3, reps: "10 (Her Bacak)", notes: "Elinizde dambıllarla sandalye veya kutuya basıp yükselin.", targetMuscle: "Ön Bacak & Kalça", estimatedCaloriesBurned: 70 },
      { name: "Dumbbell Box Squat", sets: 3, reps: "12", notes: "Arkanızdaki kutuya dokunup dambıllarla geri yükselerek squat yapın.", targetMuscle: "Ön Bacak & Glute", estimatedCaloriesBurned: 72 },
      { name: "Dumbbell Curtsy Lunge", sets: 3, reps: "12 (Her Bacak)", notes: "Bir bacağı çapraz geriye atarak kalçayı hedefleyen lunge yapın.", targetMuscle: "Yan Kalça & Bacak", estimatedCaloriesBurned: 75 },
      { name: "Dumbbell Calf Raise (Kalf)", sets: 3, reps: "20", notes: "Dambıllarla parmak ucunda yükselip kalf kaslarını sıkıştırın.", targetMuscle: "Alt Bacak (Kalf)", estimatedCaloriesBurned: 40 }
    ],
    "Salonda (Full Ekipman)": [
      { name: "Barbell Back Squat (Klasik)", sets: 4, reps: "8-10", notes: "Barı trapezlere yerleştirip dik bir gövdeyle güvenle çömelin.", targetMuscle: "Tüm Alt Vücut Hacim", estimatedCaloriesBurned: 110 },
      { name: "Leg Press (Bacak İtme)", sets: 4, reps: "10-12", notes: "Platformu bacaklarınızla dik açıda yukarı doğru presleyin.", targetMuscle: "Ön Bacak & Kalça", estimatedCaloriesBurned: 90 },
      { name: "Leg Curl Machine (Arka Bacak)", sets: 3, reps: "15", notes: "Yüzüstü yatıp pedleri kalçaya bükerek arka bacakları izole edin.", targetMuscle: "Arka Bacak (Hamstring)", estimatedCaloriesBurned: 60 },
      { name: "Leg Extension Machine (Ön Bacak)", sets: 3, reps: "15", notes: "Oturup bacakları yukarı uzatıp en üstte 1 saniye sıkın.", targetMuscle: "Ön Bacak Detay", estimatedCaloriesBurned: 60 },
      { name: "Barbell Hip Thrust (Kalça İtme)", sets: 4, reps: "10-12", notes: "Sırtı sehpaya dayayıp kalça üzerine bar alarak köprü kurun.", targetMuscle: "Maksimum Kalça Gelişimi", estimatedCaloriesBurned: 95 },
      { name: "Hack Squat Machine", sets: 3, reps: "10", notes: "Sırtı makineye dayayarak güvenli açıda derin squat yapın.", targetMuscle: "Ön Bacak", estimatedCaloriesBurned: 85 },
      { name: "Lying Leg Press (Yatarak)", sets: 3, reps: "12", notes: "45 derece açılı bacak pres makinesinde antrenman yapın.", targetMuscle: "Bacak Genel", estimatedCaloriesBurned: 88 },
      { name: "Seated Calf Raise (Oturarak Kalf)", sets: 3, reps: "20", notes: "Oturarak kalf makinesinde kalf kaslarını derin uyarın.", targetMuscle: "Alt Bacak (Soleus)", estimatedCaloriesBurned: 35 },
      { name: "Standing Calf Raise (Ayakta Kalf)", sets: 3, reps: "20", notes: "Ayakta kalf makinesinde parmak ucunda maksimum yükselin.", targetMuscle: "Gastrocnemius (Kalf)", estimatedCaloriesBurned: 40 },
      { name: "Smith Machine Bulgarian Squat", sets: 3, reps: "10 (Her Kol)", notes: "Smith makinesinde tek bacak yüksekte kontrollü çöküş uygulayın.", targetMuscle: "Bacak & Kalça Gücü", estimatedCaloriesBurned: 80 }
    ]
  },
  // 8. KARIN & KOR (ABS & CORE)
  "Karın & Kor": {
    "Evde (Vücut Ağırlığı)": [
      { name: "Klasik Mekik (Crunch)", sets: 3, reps: "20", notes: "Kürek kemikleri yerden kesilene kadar kalkıp karın kasını sıkın.", targetMuscle: "Üst Karın", estimatedCaloriesBurned: 35 },
      { name: "Plank (Dirsek Üstü Duruş)", sets: 3, reps: "60 Saniye", notes: "Dirsekler üstünde gövdeyi düz tutup karın ve kalçayı sıkın.", targetMuscle: "Tüm Kor (Core)", estimatedCaloriesBurned: 45 },
      { name: "Bacak Kaldırma (Leg Raise)", sets: 3, reps: "15", notes: "Sırtüstü yatıp eller kalça altında bacakları düz kaldırıp indirin.", targetMuscle: "Alt Karın", estimatedCaloriesBurned: 40 },
      { name: "Rus Rotasyonu (Russian Twist)", sets: 3, reps: "20 (Toplam)", notes: "Otururken gövdeyi geriye eğip elleri sağa sola dokundurun.", targetMuscle: "Yan Karın (Oblih)", estimatedCaloriesBurned: 40 },
      { name: "Dağ Tırmanışı (Mountain Climber)", sets: 3, reps: "30 Saniye", notes: "Şınav pozisyonunda dizleri sırayla göğse çekip hızlıca koşun.", targetMuscle: "Karın & Kondisyon", estimatedCaloriesBurned: 55 },
      { name: "Bisiklet Mekik (Bicycle Crunch)", sets: 3, reps: "20 Adet", notes: "Sırtüstü yatıp zıt dirsekle zıt dizi birleştirerek pedal çevirin.", targetMuscle: "Tüm Karın Lifleri", estimatedCaloriesBurned: 45 },
      { name: "Makas Bacaklar (Flutter Kicks)", sets: 3, reps: "45 Saniye", notes: "Bacakları hafif kaldırıp sırayla aşağı yukarı makas gibi hareket ettirin.", targetMuscle: "Alt Karın & Kor", estimatedCaloriesBurned: 42 },
      { name: "Spiderman Plank (Örümcek)", sets: 3, reps: "12 (Toplam)", notes: "Plankta sırayla dizleri dışarıdan zıt dirseğe doğru çekin.", targetMuscle: "Yan Karın & Stabilite", estimatedCaloriesBurned: 48 },
      { name: "Yan Plank (Side Plank)", sets: 3, reps: "30 Saniye (Her Yön)", notes: "Tek dirsek üzerinde yana yatıp kalçayı havada düz tutarak bekleyin.", targetMuscle: "Yan Karın & Bel", estimatedCaloriesBurned: 38 },
      { name: "V-Up Mekik (V-Mekik)", sets: 3, reps: "10", notes: "Sırtüstü yatıştan kol ve bacakları aynı anda kaldırıp V şeklinde birleşin.", targetMuscle: "Tüm Karın Kasları", estimatedCaloriesBurned: 50 }
    ],
    "Dumbbell ile": [
      { name: "Dumbbell Russian Twist", sets: 3, reps: "20", notes: "Dambılı iki elle tutup sağa sola çevirerek yan karın kaslarını uyarın.", targetMuscle: "Oblihler & Güç", estimatedCaloriesBurned: 50 },
      { name: "Dumbbell Plank Transfer", sets: 3, reps: "12", notes: "Plankta dururken altınızdaki dambılı bir elinizle diğer tarafa çekin.", targetMuscle: "Stabilizasyon & Kor", estimatedCaloriesBurned: 55 },
      { name: "Ağırlıklı Mekik (Weighted Crunch)", sets: 3, reps: "15", notes: "Göğsünüzün üstünde bir dambıl tutarak mekik çekin. Hacim kazandırır.", targetMuscle: "Karın Kasları", estimatedCaloriesBurned: 45 },
      { name: "Dumbbell Side Bend (Yana)", sets: 3, reps: "15 (Her Yön)", notes: "Ayakta tek elde dambılla yana doğru eğilip doğrularak yan karın çalışın.", targetMuscle: "Yan Karın (Oblihler)", estimatedCaloriesBurned: 40 },
      { name: "Dumbbell Woodchopper", sets: 3, reps: "12 (Her Yön)", notes: "Dambılı çapraz aşağıdan yukarıya gövdeyi döndürerek savurun.", targetMuscle: "Karın & Güç", estimatedCaloriesBurned: 58 },
      { name: "Dumbbell Leg Raise Hold", sets: 3, reps: "12", notes: "Ayaklarınızın arasına dambıl sıkıştırıp bacak kaldırma yapın.", targetMuscle: "Alt Karın Gücü", estimatedCaloriesBurned: 52 },
      { name: "Dumbbell Turkish Get-Up", sets: 3, reps: "5 (Her Yön)", notes: "Yerde yatarken dambılı havada sabitleyip dikilerek ayağa kalkın.", targetMuscle: "Tüm Vücut & Kor", estimatedCaloriesBurned: 80 },
      { name: "Dumbbell Hollow Body Hold", sets: 3, reps: "30 Saniye", notes: "Yarım dairesel yatışta dambılı ellerle geride tutup karın sıkarak bekleyin.", targetMuscle: "Derin Kor Gücü", estimatedCaloriesBurned: 48 },
      { name: "Dumbbell Suitcase Carry", sets: 3, reps: "45 Saniye", notes: "Tek dambılla dik durup omuzları eşitleyerek ileriye doğru yürüyün.", targetMuscle: "Kor & Postür", estimatedCaloriesBurned: 50 },
      { name: "Dumbbell Bear Crawl Hold", sets: 3, reps: "30 Saniye", notes: "Ayı emekleme duruşunda dizler havada iken dambılı yerde kaydırın.", targetMuscle: "Karın & Denge", estimatedCaloriesBurned: 52 }
    ],
    "Salonda (Full Ekipman)": [
      { name: "Hanging Leg Raise (Asılarak)", sets: 3, reps: "12", notes: "Barfiks demirine asılıp düz bacaklarınızı 90 dereceye kaldırın.", targetMuscle: "Alt Karın & Tutuş Gücü", estimatedCaloriesBurned: 60 },
      { name: "Cable Woodchopper (Kablo)", sets: 3, reps: "15 (Her Yön)", notes: "Kabloyu çapraz yukarıdan aşağı gövdeyi çevirerek çekin.", targetMuscle: "Yan Karın & Rotasyon", estimatedCaloriesBurned: 55 },
      { name: "Ab Wheel Rollout (Tekerlek)", sets: 3, reps: "10-12", notes: "Dizler üzerinde karın tekerleğiyle öne uzanıp karınla geri çekilin.", targetMuscle: "Tüm Kor Gücü", estimatedCaloriesBurned: 65 },
      { name: "Eğik Sehpa Ağırlıklı Mekik", sets: 3, reps: "15", notes: "Eğik karın sehpasında baş aşağı plaka ile mekik çekin.", targetMuscle: "Üst Karın", estimatedCaloriesBurned: 50 },
      { name: "Cable Crunch (Diz Çökerek)", sets: 3, reps: "15", notes: "Diz çöküp halatı enseye alarak dirsekleri dize doğru büküp sıkın.", targetMuscle: "Üst & Orta Karın", estimatedCaloriesBurned: 55 },
      { name: "Captain's Chair Leg Raise", sets: 3, reps: "12-15", notes: "Kaptan koltuğu sehpasında dirseklere yaslanıp bacak kaldırın.", targetMuscle: "Alt Karın", estimatedCaloriesBurned: 48 },
      { name: "Roman Chair Core Extension", sets: 3, reps: "15", notes: "Roma sandalyesinde yan durup gövdeyi kaldırarak yan karın sıkın.", targetMuscle: "Oblihler", estimatedCaloriesBurned: 45 },
      { name: "Rotary Torso Machine", sets: 3, reps: "15 (Her Yön)", notes: "Rotasyon makinesinde gövdenizi kontrollü sağa sola döndürün.", targetMuscle: "Yan Karın (Oblih)", estimatedCaloriesBurned: 42 },
      { name: "Cable Side Bend (Kablo Yana)", sets: 3, reps: "15 (Her Kol)", notes: "Kablo istasyonunda tek kolla yana eğilerek dirençli çalışın.", targetMuscle: "Yan Karın", estimatedCaloriesBurned: 48 },
      { name: "Machine Crunch (Karın Makinesi)", sets: 3, reps: "15", notes: "Ağırlıklı karın makinesinde öne bükülerek karın kasını izole edin.", targetMuscle: "Karın Kasları", estimatedCaloriesBurned: 52 }
    ]
  }
};

export const SUB_REGIONS: Record<string, string[]> = {
  "Göğüs": ["Tümü", "Üst Göğüs", "Alt Göğüs"],
  "Kollar": ["Tümü", "Biceps", "Triceps"],
  "Sırt": ["Tümü", "Sırt & Kanat", "Bel & Alt Sırt"],
  "Omuz": ["Tümü", "Ön Omuz", "Yan Omuz", "Arka Omuz"],
  "Karın": ["Tümü", "Üst Karın", "Alt Karın", "Yan Karın", "Plank & Kor"],
  "Bacaklar": ["Tümü", "Ön Bacak", "Arka Bacak & Kalf", "Kalça"]
};

export default function AiPlanner({ onStartExercise, savedPlan, onSavePlan }: AiPlannerProps) {
  // Navigation Mode state: 'anatomical' or 'ai'
  const [plannerMode, setPlannerMode] = useState<'anatomical' | 'ai'>('anatomical');

  // AI Planner Questionnaire states
  const [age, setAge] = useState<string>("25");
  const [weight, setWeight] = useState<string>("70");
  const [height, setHeight] = useState<string>("175");
  const [gender, setGender] = useState<string>("Erkek");
  const [goal, setGoal] = useState<string>("Kilo Vermek & Yağ Yakımı");
  const [level, setLevel] = useState<string>("Başlangıç");
  const [duration, setDuration] = useState<string>("45");
  const [equipmentForAi, setEquipmentForAi] = useState<string>("Dumbbell ile");
  const [preference, setPreference] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  // Anatomical Selector states
  const [selectedEquipment, setSelectedEquipment] = useState<string>("Dumbbell ile");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("Göğüs");
  const [selectedSubRegion, setSelectedSubRegion] = useState<string>("Tümü");
  const [muscleHovered, setMuscleHovered] = useState<string | null>(null);

  const handleMuscleSelect = (muscle: string) => {
    setSelectedMuscle(muscle);
    setSelectedSubRegion("Tümü");
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/workout/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age,
          weight,
          height,
          gender,
          goal,
          level,
          duration,
          equipment: equipmentForAi,
          preference
        })
      });

      const data = await response.json();
      if (data.success && data.workoutPlan) {
        onSavePlan(data.workoutPlan);
        setExpandedDay(1); // auto expand first day
      } else {
        throw new Error(data.message || "Plan oluşturulurken hata oluştu.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Yapay zeka antrenman planlayıcısı şu anda çevrimdışı. Lütfen internet bağlantınızı ve API anahtarınızı kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (dayNum: number) => {
    setExpandedDay(expandedDay === dayNum ? null : dayNum);
  };

  // Get active workouts for regional anatomical selector (mapping to exact regional workout groups)
  const getWorkoutsForMuscle = () => {
    let list: any[] = [];
    if (selectedMuscle === "Göğüs") {
      if (selectedSubRegion === "Üst Göğüs") {
        list = REGIONAL_WORKOUTS["Üst Göğüs"]?.[selectedEquipment] || [];
      } else if (selectedSubRegion === "Alt Göğüs") {
        list = REGIONAL_WORKOUTS["Alt Göğüs"]?.[selectedEquipment] || [];
      } else {
        list = [
          ...(REGIONAL_WORKOUTS["Üst Göğüs"]?.[selectedEquipment] || []),
          ...(REGIONAL_WORKOUTS["Alt Göğüs"]?.[selectedEquipment] || [])
        ];
      }
    } else if (selectedMuscle === "Sırt") {
      const fullList = REGIONAL_WORKOUTS["Sırt & Kanat"]?.[selectedEquipment] || [];
      if (selectedSubRegion === "Sırt & Kanat") {
        list = fullList.filter(ex => 
          ex.name.toLowerCase().includes("kanat") || 
          ex.targetMuscle.toLowerCase().includes("kanat") ||
          ex.notes.toLowerCase().includes("kanat") ||
          ex.targetMuscle.toLowerCase().includes("lat")
        );
      } else if (selectedSubRegion === "Bel & Alt Sırt") {
        list = fullList.filter(ex => 
          ex.name.toLowerCase().includes("bel") || 
          ex.name.toLowerCase().includes("deadlift") ||
          ex.targetMuscle.toLowerCase().includes("bel") ||
          ex.targetMuscle.toLowerCase().includes("alt sırt") ||
          ex.notes.toLowerCase().includes("bel") ||
          ex.targetMuscle.toLowerCase().includes("erector")
        );
      } else {
        list = fullList;
      }
    } else if (selectedMuscle === "Kollar") {
      if (selectedSubRegion === "Biceps") {
        list = REGIONAL_WORKOUTS["Biceps"]?.[selectedEquipment] || [];
      } else if (selectedSubRegion === "Triceps") {
        list = REGIONAL_WORKOUTS["Triceps"]?.[selectedEquipment] || [];
      } else {
        list = [
          ...(REGIONAL_WORKOUTS["Biceps"]?.[selectedEquipment] || []),
          ...(REGIONAL_WORKOUTS["Triceps"]?.[selectedEquipment] || [])
        ];
      }
    } else if (selectedMuscle === "Bacaklar") {
      const fullList = REGIONAL_WORKOUTS["Bacak & Kalça"]?.[selectedEquipment] || [];
      if (selectedSubRegion === "Ön Bacak") {
        list = fullList.filter(ex => 
          ex.name.toLowerCase().includes("squat") || 
          ex.name.toLowerCase().includes("ön bacak") ||
          ex.name.toLowerCase().includes("extension") ||
          ex.name.toLowerCase().includes("çömelme") ||
          ex.targetMuscle.toLowerCase().includes("ön bacak") ||
          ex.targetMuscle.toLowerCase().includes("quads")
        );
      } else if (selectedSubRegion === "Arka Bacak & Kalf") {
        list = fullList.filter(ex => 
          ex.name.toLowerCase().includes("arka bacak") || 
          ex.name.toLowerCase().includes("curl") ||
          ex.name.toLowerCase().includes("kalf") ||
          ex.name.toLowerCase().includes("calf") ||
          ex.targetMuscle.toLowerCase().includes("arka bacak") ||
          ex.targetMuscle.toLowerCase().includes("kalf") ||
          ex.targetMuscle.toLowerCase().includes("soleus")
        );
      } else if (selectedSubRegion === "Kalça") {
        list = fullList.filter(ex => 
          ex.name.toLowerCase().includes("kalça") || 
          ex.name.toLowerCase().includes("glute") ||
          ex.name.toLowerCase().includes("bridge") ||
          ex.name.toLowerCase().includes("thrust") ||
          ex.name.toLowerCase().includes("kick") ||
          ex.name.toLowerCase().includes("hydrant") ||
          ex.name.toLowerCase().includes("curtsy") ||
          ex.targetMuscle.toLowerCase().includes("kalça") ||
          ex.targetMuscle.toLowerCase().includes("glute")
        );
      } else {
        list = fullList;
      }
    } else if (selectedMuscle === "Karın") {
      const fullList = REGIONAL_WORKOUTS["Karın & Kor"]?.[selectedEquipment] || [];
      if (selectedSubRegion === "Alt Karın") {
        list = fullList.filter(ex => 
          ex.name.toLowerCase().includes("alt karın") || 
          ex.name.toLowerCase().includes("bacak kaldırma") ||
          ex.name.toLowerCase().includes("leg raise") ||
          ex.name.toLowerCase().includes("flutter") ||
          ex.name.toLowerCase().includes("makas") ||
          ex.targetMuscle.toLowerCase().includes("alt karın")
        );
      } else if (selectedSubRegion === "Üst Karın") {
        list = fullList.filter(ex => 
          ex.name.toLowerCase().includes("mekik") || 
          ex.name.toLowerCase().includes("crunch") ||
          ex.targetMuscle.toLowerCase().includes("üst karın") ||
          ex.targetMuscle.toLowerCase().includes("orta karın")
        );
      } else if (selectedSubRegion === "Yan Karın") {
        list = fullList.filter(ex => 
          ex.name.toLowerCase().includes("yan karın") || 
          ex.name.toLowerCase().includes("russian") ||
          ex.name.toLowerCase().includes("twist") ||
          ex.name.toLowerCase().includes("side bend") ||
          ex.name.toLowerCase().includes("rotasyon") ||
          ex.name.toLowerCase().includes("bend") ||
          ex.targetMuscle.toLowerCase().includes("yan karın") ||
          ex.targetMuscle.toLowerCase().includes("oblih") ||
          ex.targetMuscle.toLowerCase().includes("oblihler")
        );
      } else if (selectedSubRegion === "Plank & Kor") {
        list = fullList.filter(ex => 
          ex.name.toLowerCase().includes("plank") || 
          ex.name.toLowerCase().includes("core") ||
          ex.name.toLowerCase().includes("kor") ||
          ex.name.toLowerCase().includes("bear") ||
          ex.name.toLowerCase().includes("hollow") ||
          ex.name.toLowerCase().includes("wheel") ||
          ex.targetMuscle.toLowerCase().includes("core") ||
          ex.targetMuscle.toLowerCase().includes("kor") ||
          ex.targetMuscle.toLowerCase().includes("stabil")
        );
      } else {
        list = fullList;
      }
    } else if (selectedMuscle === "Omuz") {
      const fullList = REGIONAL_WORKOUTS["Omuz"]?.[selectedEquipment] || [];
      if (selectedSubRegion === "Ön Omuz") {
        list = fullList.filter(ex => 
          ex.name.toLowerCase().includes("ön omuz") || 
          ex.name.toLowerCase().includes("press") ||
          ex.targetMuscle.toLowerCase().includes("ön omuz")
        );
      } else if (selectedSubRegion === "Yan Omuz") {
        list = fullList.filter(ex => 
          ex.name.toLowerCase().includes("yan omuz") || 
          ex.name.toLowerCase().includes("lateral") ||
          ex.name.toLowerCase().includes("yana") ||
          ex.targetMuscle.toLowerCase().includes("yan omuz")
        );
      } else if (selectedSubRegion === "Arka Omuz") {
        list = fullList.filter(ex => 
          ex.name.toLowerCase().includes("arka omuz") || 
          ex.name.toLowerCase().includes("rear") ||
          ex.name.toLowerCase().includes("face") ||
          ex.targetMuscle.toLowerCase().includes("arka omuz")
        );
      } else {
        list = fullList;
      }
    } else {
      list = REGIONAL_WORKOUTS[selectedMuscle]?.[selectedEquipment] || [];
    }

    // Fallback pool to backfill exercises from
    let backfillPool: any[] = [];
    if (selectedMuscle === "Göğüs") {
      backfillPool = [
        ...(REGIONAL_WORKOUTS["Üst Göğüs"]?.[selectedEquipment] || []),
        ...(REGIONAL_WORKOUTS["Alt Göğüs"]?.[selectedEquipment] || [])
      ];
    } else if (selectedMuscle === "Sırt") {
      backfillPool = REGIONAL_WORKOUTS["Sırt & Kanat"]?.[selectedEquipment] || [];
    } else if (selectedMuscle === "Kollar") {
      backfillPool = [
        ...(REGIONAL_WORKOUTS["Biceps"]?.[selectedEquipment] || []),
        ...(REGIONAL_WORKOUTS["Triceps"]?.[selectedEquipment] || [])
      ];
    } else if (selectedMuscle === "Bacaklar") {
      backfillPool = REGIONAL_WORKOUTS["Bacak & Kalça"]?.[selectedEquipment] || [];
    } else if (selectedMuscle === "Karın") {
      backfillPool = REGIONAL_WORKOUTS["Karın & Kor"]?.[selectedEquipment] || [];
    } else if (selectedMuscle === "Omuz") {
      backfillPool = REGIONAL_WORKOUTS["Omuz"]?.[selectedEquipment] || [];
    } else {
      backfillPool = REGIONAL_WORKOUTS[selectedMuscle]?.[selectedEquipment] || [];
    }

    // ALWAYS backfill the list up to at least 6 exercises using items from the parent muscle pool
    if (list.length < 6) {
      for (const ex of backfillPool) {
        if (list.length >= 6) break;
        if (!list.some(item => item.name.toLowerCase() === ex.name.toLowerCase())) {
          list.push(ex);
        }
      }
    }

    // Secondary fallback in case the entire thing is empty (safety net)
    if (list.length === 0) {
      list = backfillPool;
    }

    return list;
  };

  const activeWorkoutList = getWorkoutsForMuscle();

  return (
    <div className="space-y-6" id="ai-planner-tab">
      
      {/* Visual Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4FF00] opacity-[0.03] blur-3xl rounded-full"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#D4FF00]/10 text-[#D4FF00] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">AKTİF MODÜLLER</span>
          </div>
          <h2 className="text-3xl font-black italic tracking-tighter text-white mt-2 uppercase flex items-center gap-2">
            <Dumbbell className="w-7 h-7 text-[#D4FF00]" />
            Antrenman İstasyonu
          </h2>
          <p className="text-zinc-400 text-xs mt-1 max-w-xl">
            İster interaktif anatomik harita üzerinden dilediğiniz bölgeyi seçip anında çalışın, ister yapay zeka ile 5 günlük özel programınızı hazırlatın.
          </p>
        </div>

        {/* Mode Toggle Switcher */}
        <div className="flex bg-zinc-950 p-1 rounded-2xl border border-zinc-800 self-stretch md:self-auto relative z-10">
          <button 
            onClick={() => setPlannerMode('anatomical')}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${plannerMode === 'anatomical' ? 'bg-[#D4FF00] text-black shadow' : 'text-zinc-400 hover:text-white'}`}
          >
            <Layers className="w-3.5 h-3.5" />
            Anatomik Kas Seçici
          </button>
          <button 
            onClick={() => setPlannerMode('ai')}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${plannerMode === 'ai' ? 'bg-[#D4FF00] text-black shadow' : 'text-zinc-400 hover:text-white'}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Program Oluşturucu
          </button>
        </div>
      </div>

      {/* ================= MODE 1: ANATOMICAL WORKOUT SELECTOR ================= */}
      {plannerMode === 'anatomical' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Anatomical Map Controls and Visual (Left Column) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col">
            
            {/* Equipment selection card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-6 space-y-4">
              <h3 className="text-sm font-black italic text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4FF00]"></span>
                1. İmkan & Ekipman Seçimi
              </h3>
              
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "Evde (Vücut Ağırlığı)", label: "Evde", desc: "Vücut Ağırlığı" },
                  { id: "Dumbbell ile", label: "Dumbbell", desc: "Ev / Salon" },
                  { id: "Salonda (Full Ekipman)", label: "Salonda", desc: "Tüm Makineler" }
                ].map((eq) => (
                  <button
                    key={eq.id}
                    onClick={() => setSelectedEquipment(eq.id)}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col justify-center items-center gap-1 ${selectedEquipment === eq.id ? 'border-[#D4FF00] bg-[#D4FF00]/5 text-white' : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-white'}`}
                  >
                    <span className="text-xs font-black">{eq.label}</span>
                    <span className="text-[9px] opacity-75">{eq.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Muscle Group SVG Map Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-6 flex-1 flex flex-col items-center justify-center space-y-4 min-h-[420px] relative">
              <div className="absolute top-4 left-4">
                <h3 className="text-sm font-black italic text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4FF00]"></span>
                  2. Çalıştırılacak Bölge
                </h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Haritadan bir kasa dokunarak egzersizleri yükleyin.</p>
              </div>

              {/* Direct Muscle Selector Buttons (Quick select by name) */}
              <div className="w-full grid grid-cols-3 gap-1.5 pt-14 relative z-10">
                {["Göğüs", "Kollar", "Sırt", "Omuz", "Karın", "Bacaklar"].map((m) => (
                  <button
                    key={m}
                    onClick={() => handleMuscleSelect(m)}
                    className={`px-2 py-1.5 rounded-xl text-[10px] font-black transition cursor-pointer text-center uppercase tracking-wider duration-200 ${
                      selectedMuscle === m
                        ? "bg-[#D4FF00] text-black shadow-lg scale-105"
                        : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-850 hover:bg-zinc-900"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Vector Human Figure Silhouettes */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full pt-4 px-1">
                
                {/* FRONT BODY */}
                <div className="flex flex-col items-center w-full">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase mb-2 tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00]"></span>
                    Ön Profil
                  </span>
                  <div className="relative w-full aspect-[1/1.9] bg-zinc-950/65 rounded-[2rem] p-2.5 sm:p-4 border border-zinc-800 flex items-center justify-center shadow-inner hover:border-zinc-700 transition duration-300 group/front">
                    <svg viewBox="0 0 120 240" className="w-full h-full text-zinc-800 overflow-visible">
                      {/* Body base silhouette */}
                      <ellipse cx="60" cy="20" rx="9" ry="11" fill="#141416" stroke="#27272a" strokeWidth="1.2" />
                      <path d="M 55,31 L 55,42 L 65,42 L 65,31 Z" fill="#141416" stroke="#27272a" strokeWidth="1.2" />
                      <path d="M 36,42 C 45,42 48,36 55,42 L 65,42 C 72,36 75,42 84,42 Z" fill="#141416" stroke="#27272a" strokeWidth="1.2" />
                      <path d="M 34,42 L 20,54 L 12,96 C 11,106 14,110 18,110 C 22,110 24,96 26,82 L 30,60 L 40,73 L 46,116 L 32,120 L 30,220 L 46,220 L 48,120 L 60,120 L 72,120 L 74,220 L 90,220 L 88,120 L 74,116 L 80,73 L 90,60 L 94,82 C 96,96 98,110 102,110 C 106,110 109,106 108,96 L 100,54 L 86,42 Z" fill="#141416" stroke="#27272a" strokeWidth="1" className="opacity-40" />
                      
                      {/* Interactive Shoulders (Omuz) */}
                      <g 
                        onClick={() => handleMuscleSelect("Omuz")}
                        onMouseEnter={() => setMuscleHovered("Omuz")}
                        onMouseLeave={() => setMuscleHovered(null)}
                        className="cursor-pointer"
                      >
                        <path 
                          d="M 34,42 C 28,42 24,46 22,54 C 20,62 23,67 26,69 L 34,51 Z" 
                          fill={selectedMuscle === "Omuz" ? "#D4FF00" : (muscleHovered === "Omuz" ? "rgba(212, 255, 0, 0.45)" : "#222225")}
                          stroke={selectedMuscle === "Omuz" ? "#D4FF00" : "#444449"}
                          strokeWidth="1.2"
                          className="transition duration-200"
                        />
                        <path 
                          d="M 86,42 C 92,42 96,46 98,54 C 100,62 97,67 94,69 L 86,51 Z" 
                          fill={selectedMuscle === "Omuz" ? "#D4FF00" : (muscleHovered === "Omuz" ? "rgba(212, 255, 0, 0.45)" : "#222225")}
                          stroke={selectedMuscle === "Omuz" ? "#D4FF00" : "#444449"}
                          strokeWidth="1.2"
                          className="transition duration-200"
                        />
                        <rect 
                          x="43" 
                          y="34" 
                          width="34" 
                          height="12" 
                          rx="4" 
                          fill={selectedMuscle === "Omuz" ? "#000" : "#111113"} 
                          stroke={selectedMuscle === "Omuz" ? "#D4FF00" : "#444449"}
                          strokeWidth="1"
                        />
                        <text 
                          x="60" 
                          y="42" 
                          fill={selectedMuscle === "Omuz" ? "#D4FF00" : "#fff"} 
                          fontSize="7" 
                          fontWeight="900" 
                          textAnchor="middle" 
                          className="pointer-events-none select-none font-sans"
                        >
                          OMUZ
                        </text>
                      </g>

                      {/* Interactive Chest (Göğüs) */}
                      <g 
                        onClick={() => handleMuscleSelect("Göğüs")}
                        onMouseEnter={() => setMuscleHovered("Göğüs")}
                        onMouseLeave={() => setMuscleHovered(null)}
                        className="cursor-pointer"
                      >
                        <path 
                          d="M 36,46 C 45,49 50,51 59,51 L 59,70 C 48,70 41,66 36,46 Z" 
                          fill={selectedMuscle === "Göğüs" ? "#D4FF00" : (muscleHovered === "Göğüs" ? "rgba(212, 255, 0, 0.45)" : "#222225")}
                          stroke={selectedMuscle === "Göğüs" ? "#D4FF00" : "#444449"}
                          strokeWidth="1.2"
                          className="transition duration-200"
                        />
                        <path 
                          d="M 84,46 C 75,49 70,51 61,51 L 61,70 C 72,70 79,66 84,46 Z" 
                          fill={selectedMuscle === "Göğüs" ? "#D4FF00" : (muscleHovered === "Göğüs" ? "rgba(212, 255, 0, 0.45)" : "#222225")}
                          stroke={selectedMuscle === "Göğüs" ? "#D4FF00" : "#444449"}
                          strokeWidth="1.2"
                          className="transition duration-200"
                        />
                        <line x1="42" y1="52" x2="56" y2="52" stroke={selectedMuscle === "Göğüs" ? "rgba(0,0,0,0.3)" : "#3a3a3f"} strokeWidth="0.8" />
                        <line x1="44" y1="58" x2="56" y2="58" stroke={selectedMuscle === "Göğüs" ? "rgba(0,0,0,0.3)" : "#3a3a3f"} strokeWidth="0.8" />
                        <line x1="78" y1="52" x2="64" y2="52" stroke={selectedMuscle === "Göğüs" ? "rgba(0,0,0,0.3)" : "#3a3a3f"} strokeWidth="0.8" />
                        <line x1="76" y1="58" x2="64" y2="58" stroke={selectedMuscle === "Göğüs" ? "rgba(0,0,0,0.3)" : "#3a3a3f"} strokeWidth="0.8" />
                        <rect 
                          x="38" 
                          y="53" 
                          width="44" 
                          height="13" 
                          rx="4.5" 
                          fill={selectedMuscle === "Göğüs" ? "#000" : "#111113"} 
                          stroke={selectedMuscle === "Göğüs" ? "#D4FF00" : "#444449"}
                          strokeWidth="1"
                        />
                        <text 
                          x="60" 
                          y="62" 
                          fill={selectedMuscle === "Göğüs" ? "#D4FF00" : "#fff"} 
                          fontSize="7.5" 
                          fontWeight="900" 
                          textAnchor="middle" 
                          className="pointer-events-none select-none font-sans"
                        >
                          GÖĞÜS
                        </text>
                      </g>

                      {/* Interactive Arms (Kollar) */}
                      <g 
                        onClick={() => handleMuscleSelect("Kollar")}
                        onMouseEnter={() => setMuscleHovered("Kollar")}
                        onMouseLeave={() => setMuscleHovered(null)}
                        className="cursor-pointer"
                      >
                        <path 
                          d="M 21,57 C 16,68 14,80 13,96 C 12,104 15,110 19,110 C 22,110 24,96 26,82 L 30,60 Z" 
                          fill={selectedMuscle === "Kollar" ? "#D4FF00" : (muscleHovered === "Kollar" ? "rgba(212, 255, 0, 0.45)" : "#222225")}
                          stroke={selectedMuscle === "Kollar" ? "#D4FF00" : "#444449"}
                          strokeWidth="1.2"
                          className="transition duration-200"
                        />
                        <path 
                          d="M 99,57 C 104,68 106,80 107,96 C 108,104 105,110 101,110 C 98,110 96,96 94,82 L 90,60 Z" 
                          fill={selectedMuscle === "Kollar" ? "#D4FF00" : (muscleHovered === "Kollar" ? "rgba(212, 255, 0, 0.45)" : "#222225")}
                          stroke={selectedMuscle === "Kollar" ? "#D4FF00" : "#444449"}
                          strokeWidth="1.2"
                          className="transition duration-200"
                        />
                        <rect 
                          x="10" 
                          y="76" 
                          width="18" 
                          height="12" 
                          rx="4" 
                          fill={selectedMuscle === "Kollar" ? "#000" : "#111113"} 
                          stroke={selectedMuscle === "Kollar" ? "#D4FF00" : "#444449"}
                          strokeWidth="1"
                        />
                        <text 
                          x="19" 
                          y="84.5" 
                          fill={selectedMuscle === "Kollar" ? "#D4FF00" : "#fff"} 
                          fontSize="7" 
                          fontWeight="900" 
                          textAnchor="middle" 
                          className="pointer-events-none select-none font-sans"
                        >
                          KOL
                        </text>
                        <rect 
                          x="92" 
                          y="76" 
                          width="18" 
                          height="12" 
                          rx="4" 
                          fill={selectedMuscle === "Kollar" ? "#000" : "#111113"} 
                          stroke={selectedMuscle === "Kollar" ? "#D4FF00" : "#444449"}
                          strokeWidth="1"
                        />
                        <text 
                          x="101" 
                          y="84.5" 
                          fill={selectedMuscle === "Kollar" ? "#D4FF00" : "#fff"} 
                          fontSize="7" 
                          fontWeight="900" 
                          textAnchor="middle" 
                          className="pointer-events-none select-none font-sans"
                        >
                          KOL
                        </text>
                      </g>

                      {/* Interactive Core/Abs (Karın) */}
                      <g 
                        onClick={() => handleMuscleSelect("Karın")}
                        onMouseEnter={() => setMuscleHovered("Karın")}
                        onMouseLeave={() => setMuscleHovered(null)}
                        className="cursor-pointer"
                      >
                        <path 
                          d="M 40,73 L 80,73 L 74,116 L 46,116 Z" 
                          fill={selectedMuscle === "Karın" ? "#D4FF00" : (muscleHovered === "Karın" ? "rgba(212, 255, 0, 0.45)" : "#222225")}
                          stroke={selectedMuscle === "Karın" ? "#D4FF00" : "#444449"}
                          strokeWidth="1.2"
                          className="transition duration-200"
                        />
                        <line x1="60" y1="73" x2="60" y2="116" stroke={selectedMuscle === "Karın" ? "rgba(0,0,0,0.25)" : "#3a3a3f"} strokeWidth="0.8" />
                        <line x1="45" y1="84" x2="75" y2="84" stroke={selectedMuscle === "Karın" ? "rgba(0,0,0,0.25)" : "#3a3a3f"} strokeWidth="0.8" />
                        <line x1="47" y1="95" x2="73" y2="95" stroke={selectedMuscle === "Karın" ? "rgba(0,0,0,0.25)" : "#3a3a3f"} strokeWidth="0.8" />
                        <line x1="49" y1="106" x2="71" y2="106" stroke={selectedMuscle === "Karın" ? "rgba(0,0,0,0.25)" : "#3a3a3f"} strokeWidth="0.8" />
                        <rect 
                          x="40" 
                          y="88" 
                          width="40" 
                          height="13" 
                          rx="4.5" 
                          fill={selectedMuscle === "Karın" ? "#000" : "#111113"} 
                          stroke={selectedMuscle === "Karın" ? "#D4FF00" : "#444449"}
                          strokeWidth="1"
                        />
                        <text 
                          x="60" 
                          y="97" 
                          fill={selectedMuscle === "Karın" ? "#D4FF00" : "#fff"} 
                          fontSize="7.5" 
                          fontWeight="900" 
                          textAnchor="middle" 
                          className="pointer-events-none select-none font-sans"
                        >
                          KARIN
                        </text>
                      </g>

                      {/* Interactive Front Legs (Bacaklar) */}
                      <g 
                        onClick={() => handleMuscleSelect("Bacaklar")}
                        onMouseEnter={() => setMuscleHovered("Bacaklar")}
                        onMouseLeave={() => setMuscleHovered(null)}
                        className="cursor-pointer"
                      >
                        <path 
                          d="M 32,120 L 48,120 L 46,220 L 30,220 Z" 
                          fill={selectedMuscle === "Bacaklar" ? "#D4FF00" : (muscleHovered === "Bacaklar" ? "rgba(212, 255, 0, 0.45)" : "#222225")}
                          stroke={selectedMuscle === "Bacaklar" ? "#D4FF00" : "#444449"}
                          strokeWidth="1.2"
                          className="transition duration-200"
                        />
                        <path 
                          d="M 72,120 L 88,120 L 90,220 L 74,220 Z" 
                          fill={selectedMuscle === "Bacaklar" ? "#D4FF00" : (muscleHovered === "Bacaklar" ? "rgba(212, 255, 0, 0.45)" : "#222225")}
                          stroke={selectedMuscle === "Bacaklar" ? "#D4FF00" : "#444449"}
                          strokeWidth="1.2"
                          className="transition duration-200"
                        />
                        <line x1="40" y1="120" x2="38" y2="180" stroke={selectedMuscle === "Bacaklar" ? "rgba(0,0,0,0.2)" : "#3a3a3f"} strokeWidth="0.8" />
                        <line x1="80" y1="120" x2="82" y2="180" stroke={selectedMuscle === "Bacaklar" ? "rgba(0,0,0,0.2)" : "#3a3a3f"} strokeWidth="0.8" />
                        <rect 
                          x="19" 
                          y="155" 
                          width="26" 
                          height="13" 
                          rx="4.5" 
                          fill={selectedMuscle === "Bacaklar" ? "#000" : "#111113"} 
                          stroke={selectedMuscle === "Bacaklar" ? "#D4FF00" : "#444449"}
                          strokeWidth="1"
                        />
                        <text 
                          x="32" 
                          y="164" 
                          fill={selectedMuscle === "Bacaklar" ? "#D4FF00" : "#fff"} 
                          fontSize="7.5" 
                          fontWeight="900" 
                          textAnchor="middle" 
                          className="pointer-events-none select-none font-sans"
                        >
                          BACAK
                        </text>
                        <rect 
                          x="75" 
                          y="155" 
                          width="26" 
                          height="13" 
                          rx="4.5" 
                          fill={selectedMuscle === "Bacaklar" ? "#000" : "#111113"} 
                          stroke={selectedMuscle === "Bacaklar" ? "#D4FF00" : "#444449"}
                          strokeWidth="1"
                        />
                        <text 
                          x="88" 
                          y="164" 
                          fill={selectedMuscle === "Bacaklar" ? "#D4FF00" : "#fff"} 
                          fontSize="7.5" 
                          fontWeight="900" 
                          textAnchor="middle" 
                          className="pointer-events-none select-none font-sans"
                        >
                          BACAK
                        </text>
                      </g>
                    </svg>
                  </div>
                </div>

                {/* BACK BODY */}
                <div className="flex flex-col items-center w-full">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase mb-2 tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    Arka Profil
                  </span>
                  <div className="relative w-full aspect-[1/1.9] bg-zinc-950/65 rounded-[2rem] p-2.5 sm:p-4 border border-zinc-800 flex items-center justify-center shadow-inner hover:border-zinc-700 transition duration-300 group/rear">
                    <svg viewBox="0 0 120 240" className="w-full h-full text-zinc-800 overflow-visible">
                      {/* Body base silhouette */}
                      <ellipse cx="60" cy="20" rx="9" ry="11" fill="#141416" stroke="#27272a" strokeWidth="1.2" />
                      <path d="M 55,31 L 55,42 L 65,42 L 65,31 Z" fill="#141416" stroke="#27272a" strokeWidth="1.2" />
                      <path d="M 36,42 C 45,42 48,36 55,42 L 65,42 C 72,36 75,42 84,42 Z" fill="#141416" stroke="#27272a" strokeWidth="1.2" />
                      <path d="M 34,42 L 20,54 L 12,96 C 11,106 14,110 18,110 C 22,110 24,96 26,82 L 30,60 L 40,73 L 46,116 L 32,120 L 30,220 L 46,220 L 48,120 L 60,120 L 72,120 L 74,220 L 90,220 L 88,120 L 74,116 L 80,73 L 90,60 L 94,82 C 96,96 98,110 102,110 C 106,110 109,106 108,96 L 100,54 L 86,42 Z" fill="#141416" stroke="#27272a" strokeWidth="1" className="opacity-40" />
                      
                      {/* Interactive Shoulders (Omuz) */}
                      <g 
                        onClick={() => handleMuscleSelect("Omuz")}
                        onMouseEnter={() => setMuscleHovered("Omuz")}
                        onMouseLeave={() => setMuscleHovered(null)}
                        className="cursor-pointer"
                      >
                        <path 
                          d="M 34,42 C 28,42 24,46 22,54 C 20,62 23,67 26,69 L 34,51 Z" 
                          fill={selectedMuscle === "Omuz" ? "#D4FF00" : (muscleHovered === "Omuz" ? "rgba(212, 255, 0, 0.45)" : "#222225")}
                          stroke={selectedMuscle === "Omuz" ? "#D4FF00" : "#444449"}
                          strokeWidth="1.2"
                          className="transition duration-200"
                        />
                        <path 
                          d="M 86,42 C 92,42 96,46 98,54 C 100,62 97,67 94,69 L 86,51 Z" 
                          fill={selectedMuscle === "Omuz" ? "#D4FF00" : (muscleHovered === "Omuz" ? "rgba(212, 255, 0, 0.45)" : "#222225")}
                          stroke={selectedMuscle === "Omuz" ? "#D4FF00" : "#444449"}
                          strokeWidth="1.2"
                          className="transition duration-200"
                        />
                        <rect 
                          x="43" 
                          y="34" 
                          width="34" 
                          height="12" 
                          rx="4" 
                          fill={selectedMuscle === "Omuz" ? "#000" : "#111113"} 
                          stroke={selectedMuscle === "Omuz" ? "#D4FF00" : "#444449"}
                          strokeWidth="1"
                        />
                        <text 
                          x="60" 
                          y="42" 
                          fill={selectedMuscle === "Omuz" ? "#D4FF00" : "#fff"} 
                          fontSize="7" 
                          fontWeight="900" 
                          textAnchor="middle" 
                          className="pointer-events-none select-none font-sans"
                        >
                          OMUZ
                        </text>
                      </g>

                      {/* Interactive Back (Sırt) */}
                      <g 
                        onClick={() => handleMuscleSelect("Sırt")}
                        onMouseEnter={() => setMuscleHovered("Sırt")}
                        onMouseLeave={() => setMuscleHovered(null)}
                        className="cursor-pointer"
                      >
                        <path 
                          d="M 36,46 C 48,50 72,50 84,46 L 78,116 L 42,116 Z" 
                          fill={selectedMuscle === "Sırt" ? "#D4FF00" : (muscleHovered === "Sırt" ? "rgba(212, 255, 0, 0.45)" : "#222225")}
                          stroke={selectedMuscle === "Sırt" ? "#D4FF00" : "#444449"}
                          strokeWidth="1.2"
                          className="transition duration-200"
                        />
                        <line x1="42" y1="56" x2="60" y2="70" stroke={selectedMuscle === "Sırt" ? "rgba(0,0,0,0.3)" : "#3a3a3f"} strokeWidth="0.8" />
                        <line x1="78" y1="56" x2="60" y2="70" stroke={selectedMuscle === "Sırt" ? "rgba(0,0,0,0.3)" : "#3a3a3f"} strokeWidth="0.8" />
                        <line x1="44" y1="76" x2="60" y2="90" stroke={selectedMuscle === "Sırt" ? "rgba(0,0,0,0.3)" : "#3a3a3f"} strokeWidth="0.8" />
                        <line x1="76" y1="76" x2="60" y2="90" stroke={selectedMuscle === "Sırt" ? "rgba(0,0,0,0.3)" : "#3a3a3f"} strokeWidth="0.8" />
                        <rect 
                          x="43" 
                          y="76" 
                          width="34" 
                          height="13" 
                          rx="4.5" 
                          fill={selectedMuscle === "Sırt" ? "#000" : "#111113"} 
                          stroke={selectedMuscle === "Sırt" ? "#D4FF00" : "#444449"}
                          strokeWidth="1"
                        />
                        <text 
                          x="60" 
                          y="85" 
                          fill={selectedMuscle === "Sırt" ? "#D4FF00" : "#fff"} 
                          fontSize="7.5" 
                          fontWeight="900" 
                          textAnchor="middle" 
                          className="pointer-events-none select-none font-sans"
                        >
                          SIRT
                        </text>
                      </g>

                      {/* Interactive Arms (Kollar) */}
                      <g 
                        onClick={() => handleMuscleSelect("Kollar")}
                        onMouseEnter={() => setMuscleHovered("Kollar")}
                        onMouseLeave={() => setMuscleHovered(null)}
                        className="cursor-pointer"
                      >
                        <path 
                          d="M 21,57 C 16,68 14,80 13,96 C 12,104 15,110 19,110 C 22,110 24,96 26,82 L 30,60 Z" 
                          fill={selectedMuscle === "Kollar" ? "#D4FF00" : (muscleHovered === "Kollar" ? "rgba(212, 255, 0, 0.45)" : "#222225")}
                          stroke={selectedMuscle === "Kollar" ? "#D4FF00" : "#444449"}
                          strokeWidth="1.2"
                          className="transition duration-200"
                        />
                        <path 
                          d="M 99,57 C 104,68 106,80 107,96 C 108,104 105,110 101,110 C 98,110 96,96 94,82 L 90,60 Z" 
                          fill={selectedMuscle === "Kollar" ? "#D4FF00" : (muscleHovered === "Kollar" ? "rgba(212, 255, 0, 0.45)" : "#222225")}
                          stroke={selectedMuscle === "Kollar" ? "#D4FF00" : "#444449"}
                          strokeWidth="1.2"
                          className="transition duration-200"
                        />
                        <rect 
                          x="10" 
                          y="76" 
                          width="18" 
                          height="12" 
                          rx="4" 
                          fill={selectedMuscle === "Kollar" ? "#000" : "#111113"} 
                          stroke={selectedMuscle === "Kollar" ? "#D4FF00" : "#444449"}
                          strokeWidth="1"
                        />
                        <text 
                          x="19" 
                          y="84.5" 
                          fill={selectedMuscle === "Kollar" ? "#D4FF00" : "#fff"} 
                          fontSize="7" 
                          fontWeight="900" 
                          textAnchor="middle" 
                          className="pointer-events-none select-none font-sans"
                        >
                          KOL
                        </text>
                        <rect 
                          x="92" 
                          y="76" 
                          width="18" 
                          height="12" 
                          rx="4" 
                          fill={selectedMuscle === "Kollar" ? "#000" : "#111113"} 
                          stroke={selectedMuscle === "Kollar" ? "#D4FF00" : "#444449"}
                          strokeWidth="1"
                        />
                        <text 
                          x="101" 
                          y="84.5" 
                          fill={selectedMuscle === "Kollar" ? "#D4FF00" : "#fff"} 
                          fontSize="7" 
                          fontWeight="900" 
                          textAnchor="middle" 
                          className="pointer-events-none select-none font-sans"
                        >
                          KOL
                        </text>
                      </g>

                      {/* Interactive Back Legs (Bacaklar) */}
                      <g 
                        onClick={() => handleMuscleSelect("Bacaklar")}
                        onMouseEnter={() => setMuscleHovered("Bacaklar")}
                        onMouseLeave={() => setMuscleHovered(null)}
                        className="cursor-pointer"
                      >
                        <path 
                          d="M 32,120 L 48,120 L 46,220 L 30,220 Z" 
                          fill={selectedMuscle === "Bacaklar" ? "#D4FF00" : (muscleHovered === "Bacaklar" ? "rgba(212, 255, 0, 0.45)" : "#222225")}
                          stroke={selectedMuscle === "Bacaklar" ? "#D4FF00" : "#444449"}
                          strokeWidth="1.2"
                          className="transition duration-200"
                        />
                        <path 
                          d="M 72,120 L 88,120 L 90,220 L 74,220 Z" 
                          fill={selectedMuscle === "Bacaklar" ? "#D4FF00" : (muscleHovered === "Bacaklar" ? "rgba(212, 255, 0, 0.45)" : "#222225")}
                          stroke={selectedMuscle === "Bacaklar" ? "#D4FF00" : "#444449"}
                          strokeWidth="1.2"
                          className="transition duration-200"
                        />
                        <line x1="40" y1="120" x2="38" y2="180" stroke={selectedMuscle === "Bacaklar" ? "rgba(0,0,0,0.2)" : "#3a3a3f"} strokeWidth="0.8" />
                        <line x1="80" y1="120" x2="82" y2="180" stroke={selectedMuscle === "Bacaklar" ? "rgba(0,0,0,0.2)" : "#3a3a3f"} strokeWidth="0.8" />
                        <rect 
                          x="19" 
                          y="155" 
                          width="26" 
                          height="13" 
                          rx="4.5" 
                          fill={selectedMuscle === "Bacaklar" ? "#000" : "#111113"} 
                          stroke={selectedMuscle === "Bacaklar" ? "#D4FF00" : "#444449"}
                          strokeWidth="1"
                        />
                        <text 
                          x="32" 
                          y="164" 
                          fill={selectedMuscle === "Bacaklar" ? "#D4FF00" : "#fff"} 
                          fontSize="7.5" 
                          fontWeight="900" 
                          textAnchor="middle" 
                          className="pointer-events-none select-none font-sans"
                        >
                          BACAK
                        </text>
                        <rect 
                          x="75" 
                          y="155" 
                          width="26" 
                          height="13" 
                          rx="4.5" 
                          fill={selectedMuscle === "Bacaklar" ? "#000" : "#111113"} 
                          stroke={selectedMuscle === "Bacaklar" ? "#D4FF00" : "#444449"}
                          strokeWidth="1"
                        />
                        <text 
                          x="88" 
                          y="164" 
                          fill={selectedMuscle === "Bacaklar" ? "#D4FF00" : "#fff"} 
                          fontSize="7.5" 
                          fontWeight="900" 
                          textAnchor="middle" 
                          className="pointer-events-none select-none font-sans"
                        >
                          BACAK
                        </text>
                      </g>
                    </svg>
                  </div>
                </div>

              </div>

              {/* Status display showing active choices */}
              <div className="w-full text-center bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-black">SEÇİLİ BÖLGE VE EKİPMAN</p>
                <p className="text-xs text-white font-bold mt-1 flex items-center justify-center gap-1.5">
                  <span className="text-[#D4FF00] font-black">{selectedMuscle}</span> 
                  <span className="text-zinc-600">|</span> 
                  <span className="text-orange-400 font-bold">{selectedEquipment}</span>
                </p>
              </div>

              {/* Alt Bölge Seçimi (Sub-Region Selector) */}
              {SUB_REGIONS[selectedMuscle] && (
                <div className="w-full bg-zinc-950/40 p-4 rounded-3xl border border-zinc-850 space-y-2">
                  <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider flex items-center gap-1.5 justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    ALT KISIM / GRUP SEÇİN
                  </span>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {SUB_REGIONS[selectedMuscle].map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubRegion(sub)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                          selectedSubRegion === sub
                            ? "bg-[#D4FF00] text-black shadow-md font-extrabold"
                            : "bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-850"
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Regional Preset Exercises (Right Column) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <div>
                  <h3 className="font-black italic text-[#D4FF00] text-lg uppercase">
                    {selectedMuscle} Antrenman Listesi
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {selectedEquipment} şartlarına özel optimize edilmiş profesyonel egzersizler.
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-zinc-950 text-orange-400 px-3 py-1 rounded-full border border-zinc-800 font-black uppercase">
                  {activeWorkoutList.length} Hareket
                </span>
              </div>

              <div className="divide-y divide-zinc-850">
                {activeWorkoutList.map((ex, idx) => (
                  <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-[#D4FF00]/10 text-[#D4FF00] text-[10px] font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-white text-sm sm:text-base">{ex.name}</h4>
                        <span className="text-[9px] font-bold bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                          {ex.targetMuscle}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed italic pl-7">
                        "{ex.notes}"
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs font-mono text-zinc-500 pl-7">
                        <span className="flex items-center gap-1">
                          <Dumbbell className="w-3.5 h-3.5 text-[#D4FF00]" />
                          <strong>{ex.sets} Set</strong> x {ex.reps}
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-orange-500" />
                          ~{ex.estimatedCaloriesBurned} kcal
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => onStartExercise(ex, `${selectedMuscle} - ${selectedEquipment}`)}
                      className="self-start sm:self-center bg-[#D4FF00] hover:bg-[#bce600] text-black font-extrabold italic tracking-tighter text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Flame className="w-3.5 h-3.5" /> Antrenmanı Başlat
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Scientific tip block */}
            <div className="bg-[#D4FF00] text-black rounded-[2.5rem] p-6 flex items-start gap-4 shadow-xl">
              <div className="p-3 bg-black text-[#D4FF00] rounded-2xl shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-sm italic uppercase tracking-tight">Doğru Form ve Kas Gelişimi (Hipertrofi)</h4>
                <p className="text-xs leading-relaxed opacity-90 font-medium">
                  Seçtiğiniz bölgesel egzersizleri uygularken kas ile zihin arasındaki bağlantıya (mind-muscle connection) odaklanın. Setler arasında ortalama <strong>60-90 saniye</strong> dinlenin. Her tekrarda kasın esneme ve sıkışma fazlarını hissederek yavaş, kontrollü hareket edin.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}


      {/* ================= MODE 2: AI 5-DAY PLAN GENERATOR ================= */}
      {plannerMode === 'ai' && (
        <>
          {!savedPlan ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
              {/* Planner Form */}
              <form onSubmit={handleGenerate} className="bg-zinc-900 rounded-[2.5rem] p-6 md:p-8 border border-zinc-800 lg:col-span-7 space-y-6">
                <h3 className="font-bold text-lg text-white pb-3 border-b border-zinc-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#D4FF00] rounded-full animate-ping"></span>
                  Yapay Zeka Profil Soruları
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Yaş</label>
                    <input 
                      type="number" 
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
                      placeholder="Yaş"
                      min="12"
                      max="100"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Kilo (kg)</label>
                    <input 
                      type="number" 
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
                      placeholder="Kilo"
                      min="30"
                      max="250"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Boy (cm)</label>
                    <input 
                      type="number" 
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
                      placeholder="Boy"
                      min="100"
                      max="250"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Cinsiyet</label>
                    <select 
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
                    >
                      <option value="Erkek">Erkek</option>
                      <option value="Kadın">Kadın</option>
                      <option value="Belirtmek İstemiyorum">Diğer / Belirtmek İstemiyorum</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Fitness Seviyeniz</label>
                    <select 
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
                    >
                      <option value="Başlangıç">Başlangıç (Yeni başlayanlar)</option>
                      <option value="Orta">Orta Seviye (Düzenli spor yapanlar)</option>
                      <option value="İleri">İleri Seviye (Yoğun antrenman yapanlar)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ana Hedefiniz</label>
                    <select 
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
                    >
                      <option value="Kilo Vermek & Yağ Yakımı">Kilo Vermek & Yağ Yakımı</option>
                      <option value="Kas Kütlesi Kazanmak (Hipertrofi)">Kas Kütlesi Kazanmak (Hipertrofi)</option>
                      <option value="Güç ve Patlayıcılık Arttırmak">Güç ve Patlayıcılık Arttırmak</option>
                      <option value="Kondisyon ve Dayanıklılık">Kondisyon ve Dayanıklılık</option>
                      <option value="Esneklik ve Duruş Düzeltme (Postür)">Esneklik ve Postür Düzeltme</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Çalışma Ekipmanı (AI'ya Bildirilir)</label>
                    <select 
                      value={equipmentForAi}
                      onChange={(e) => setEquipmentForAi(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
                    >
                      <option value="Evde (Vücut Ağırlığı)">Evde (Sadece Vücut Ağırlığı)</option>
                      <option value="Dumbbell ile">Dumbbell ile (Ev veya Salon)</option>
                      <option value="Salonda (Full Ekipman)">Salonda (Tüm Ekipmanlar & Makineler)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Günlük Antrenman Süresi (Dakika)</label>
                    <select 
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
                    >
                      <option value="15">15 dakika (Hızlı seans)</option>
                      <option value="30">30 dakika (Etkili seans)</option>
                      <option value="45">45 dakika (Önerilen)</option>
                      <option value="60">60 dakika (Kapsamlı seans)</option>
                      <option value="90">90 dakika (Gelişmiş yoğun seans)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Sınırlamalar / Ek İstekler (İsteğe Bağlı)</label>
                  <textarea 
                    value={preference}
                    onChange={(e) => setPreference(e.target.value)}
                    placeholder="Örn: Bel fıtığım var, diz ağrım var, barfiks çekemiyorum..."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4FF00] h-20 resize-none"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-950/40 border border-red-900/50 rounded-2xl text-xs text-red-300 leading-relaxed">
                    <strong>Oluşturma Hatası:</strong> {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#D4FF00] hover:bg-[#bce600] disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-black italic tracking-tighter py-4 rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      YAPAY ZEKA PROGRAMI OLUŞTURUYOR (10-15 SANİYE)...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      KİŞİSEL ANTRENMAN PROGRAMIMI YARAT
                    </>
                  )}
                </button>
              </form>

              {/* Tips / Info Column (Right Side) */}
              <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
                <div className="bg-zinc-900 rounded-[2.5rem] p-6 border border-zinc-800 space-y-4">
                  <h4 className="font-bold text-lg text-white flex items-center gap-2">
                    <Apple className="w-5 h-5 text-[#D4FF00]" />
                    Neden AI Destekli Spor?
                  </h4>
                  <ul className="space-y-3.5 text-xs text-zinc-400">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D4FF00] shrink-0 mt-0.5" />
                      <span><strong>Kişiselleştirilmiş Hacim:</strong> Vücut kitle indeksinize ve hedefinize uygun set ve tekrar dağılımları.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D4FF00] shrink-0 mt-0.5" />
                      <span><strong>Ekipman Uyumlu:</strong> Seçmiş olduğunuz çalışma alanına (Ev/Dambıl/Salon) özel bilimsel hareket seçimi.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#D4FF00] shrink-0 mt-0.5" />
                      <span><strong>Eşzamanlı Takip:</strong> Oluşturulan programdan dilediğiniz günü seçip hemen interaktif kronometre ile başlatabilme.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#D4FF00] text-black rounded-[2.5rem] p-8 flex flex-col justify-between flex-1 min-h-[220px]">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-2.5 py-1 rounded-md">MEYDAN OKUMA</span>
                    <h3 className="font-black text-3xl italic leading-none mt-4 tracking-tighter">AI GÜÇ<br/>SERİSİ</h3>
                    <p className="text-sm mt-2 opacity-85 font-medium">Bu haftaki yapay zeka serisine katılın, gelişim puanı kazanın!</p>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button className="bg-black hover:bg-zinc-800 text-white px-6 py-2.5 rounded-full text-xs font-extrabold transition">
                      Hemen Katıl
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Generated Plan Display */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
              {/* Days & Exercises Column */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-zinc-900 rounded-[2.5rem] p-6 border border-zinc-800">
                  <h3 className="text-xl font-black italic tracking-tighter text-[#D4FF00] uppercase">
                    {savedPlan.programName}
                  </h3>
                  <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
                    {savedPlan.summary}
                  </p>
                </div>

                {/* 5 Days list */}
                <div className="space-y-3">
                  {savedPlan.days.map((day) => {
                    const isExpanded = expandedDay === day.dayNumber;
                    return (
                      <div 
                        key={day.dayNumber} 
                        className="bg-zinc-900/95 border border-zinc-800 rounded-3xl overflow-hidden transition-all duration-300"
                      >
                        {/* Header bar */}
                        <button 
                          onClick={() => toggleDay(day.dayNumber)}
                          className="w-full flex items-center justify-between p-5 text-left hover:bg-zinc-800/30 transition cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${isExpanded ? 'bg-[#D4FF00] text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                              G{day.dayNumber}
                            </span>
                            <div>
                              <p className="font-black italic tracking-tight text-white text-sm sm:text-base">{day.dayName}</p>
                              <p className="text-[11px] text-zinc-500 font-medium">{day.exercises.length} Egzersiz Seansı</p>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-zinc-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-zinc-400" />
                          )}
                        </button>

                        {/* Exercises Details */}
                        {isExpanded && (
                          <div className="px-5 pb-5 border-t border-zinc-800/60 divide-y divide-zinc-800/40">
                            {day.exercises.map((ex, idx) => (
                              <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-4 last:pb-0">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-white text-sm sm:text-base">{ex.name}</h4>
                                    <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                                      {ex.targetMuscle}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-zinc-400 leading-relaxed italic">
                                    "{ex.notes}"
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 text-xs font-mono text-zinc-500">
                                    <span className="flex items-center gap-1">
                                      <Dumbbell className="w-3.5 h-3.5 text-[#D4FF00]" />
                                      <strong>{ex.sets} Set</strong> x {ex.reps}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                                      ~{ex.estimatedCaloriesBurned} kcal
                                    </span>
                                  </div>
                                </div>

                                <button 
                                  onClick={() => onStartExercise(ex, day.dayName)}
                                  className="self-start sm:self-center bg-[#D4FF00] hover:bg-[#bce600] text-black font-extrabold italic tracking-tighter text-xs px-4 py-2 rounded-xl shadow-sm transition flex items-center gap-1 cursor-pointer"
                                >
                                  <Flame className="w-3.5 h-3.5" /> Antrenmanı Başlat
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Nutrition and Side Tips (Right Column) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-zinc-900 rounded-[2.5rem] p-6 border border-zinc-800 space-y-5">
                  <h4 className="font-bold text-base text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
                    <Apple className="w-5 h-5 text-[#D4FF00]" />
                    Özel Beslenme Tavsiyeleri
                  </h4>
                  <div className="space-y-4">
                    {savedPlan.nutritionTips.map((tip, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start">
                        <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-900 rounded-[2.5rem] p-6 border border-zinc-800 space-y-4">
                  <h4 className="font-bold text-base text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-500" />
                    Planın Amacı Nedir?
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Bu program, seçmiş olduğunuz <strong>{goal}</strong> hedefine ulaşabilmeniz için optimize edilmiştir. 
                    Kas gruplarının dinlenme süreleri gözetilerek 5 güne bölünmüştür. En iyi verim için gün aşırı antrenman yapabilir ya da haftada 2 gün dinlenme verebilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
