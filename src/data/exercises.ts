export interface ExerciseHotspot {
  label: string;
  x: number; // percentage from left
  y: number; // percentage from top
  tip: string;
}

export interface ExerciseStep {
  text: string;
  imageUrl: string;
}

export interface LibraryExercise {
  id: string;
  name: string;
  category: 'Kardiyo' | 'Güç' | 'Esneklik' | 'Karın / Merkez';
  targetMuscles: string[];
  difficulty: 'Başlangıç' | 'Orta' | 'İleri';
  description: string;
  steps: ExerciseStep[];
  caloriesPerMinute: number;
  videoUrl: string;
  imageUrl: string;
  hotspots: ExerciseHotspot[];
  safetyTips: string[];
  commonMistakes: string[];
  coachNotes: string;
  coachName: string;
}

export const EXERCISE_LIBRARY: LibraryExercise[] = [
  {
    id: "push-up",
    name: "Şınav (Push-up)",
    category: "Güç",
    targetMuscles: ["Göğüs (Pectoralis)", "Arka Kol (Triceps)", "Ön Omuz (Anterior Deltoids)"],
    difficulty: "Başlangıç",
    description: "Kendi vücut ağırlığınızla üst vücut gücünüzü geliştiren, her yerde yapabileceğiniz temel ve etkili bir egzersizdir.",
    steps: [
      {
        text: "Şınav pozisyonu (plank) alın: Eller omuz genişliğinden biraz daha açık, vücut düz bir çizgi halinde.",
        imageUrl: "https://images.unsplash.com/photo-1566241477600-ac026ad43874?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Karın ve kalça kaslarınızı sıkarak vücudunuzun sabit kalmasını sağlayın.",
        imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Nefes alarak, dirseklerinizi geriye doğru büküp göğsünüzü yere yaklaştırın.",
        imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Göğsünüz yere değmeye yakınken, nefes vererek ellerinizle yeri itin ve başlangıç pozisyonuna dönün.",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400"
      }
    ],
    caloriesPerMinute: 8,
    videoUrl: "https://www.youtube.com/embed/rjp0SjIclsc",
    imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&q=80&w=800",
    hotspots: [
      {
        label: "Boyun ve Bakışlar",
        x: 30,
        y: 35,
        tip: "BOYUN VE BAKIŞLAR: Boynunuzu bükmeyin veya kasmayın; omurganızla düz bir çizgi oluşturmalıdır. Bakışlar iki elin ortasındaki zeminde kalmalı."
      },
      {
        label: "Dirsekler ve Omuzlar",
        x: 45,
        y: 48,
        tip: "DİRSEKLER: Dirseklerinizi dışarıya doğru 90 derece açmayın. Gövdenizle 45 derecelik bir açı yapacak şekilde geriye yönlendirin."
      },
      {
        label: "Karın ve Bel (Core)",
        x: 62,
        y: 52,
        tip: "KARIN VE BEL: Belinizi aşağı doğru çukurlaştırmayın veya kalçanızı havaya dikmeyin. Core kaslarınız her zaman aktif ve sıkı olmalıdır."
      }
    ],
    safetyTips: [
      "Boynunuzu aşağı bükmeyin veya yukarı kasmayın; omurganızla düz bir çizgi oluşturmalıdır.",
      "Dirseklerinizi dışarıya doğru 90 derece açmayın. Gövdenizle 45 derecelik bir açı yapacak şekilde geriye yönlendirin.",
      "Belinizi aşağı doğru çukurlaştırmayın veya kalçanızı çok fazla havaya dikmeyin. Core kaslarınız her zaman aktif olmalıdır."
    ],
    commonMistakes: [
      "Yarım hareket aralığı (göğsü tam indirmemek veya kollar düzleşene kadar yükselmemek).",
      "Nefes tutmak (inerken nefes alınmalı, yukarı iterken güçlü şekilde nefes verilmelidir).",
      "Kalçanın çökmesi."
    ],
    coachNotes: "Merhaba! Ben Yapay Zeka Baş Antrenörün Defne. Şınav çekerken en sık yapılan hata belin çömesidir. Bunu önlemek için sanki ayakta duruyormuş gibi karın ve kalça kaslarını sonuna kadar sık. Baş parmaklarınla göğüs ucun aynı hizada olmalı. Hadi şimdi harekete başla, her tekrarda gücünü hisset!",
    coachName: "Defne Arslan (AI Kıdemli Antrenör)"
  },
  {
    id: "squat",
    name: "Squat (Çömelme)",
    category: "Güç",
    targetMuscles: ["Ön Bacak (Quadriceps)", "Kalça (Gluteus Maximus)", "Arka Bacak (Hamstrings)"],
    difficulty: "Başlangıç",
    description: "Alt vücut gücünü ve kalça mobilitesini artıran, vücut mekaniği için en önemli bileşik egzersizlerden biridir.",
    steps: [
      {
        text: "Ayaklarınızı omuz genişliğinde açın, ayak parmak uçlarınız hafifçe dışarı baksın.",
        imageUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Göğsünüzünü tamamen dik tutun, bakışlarınızı karşıya (ileri) yöneltin.",
        imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Sanki arkada görünmez bir sandalyeye oturuyormuş gibi, kalçanızı geriye vererek dizlerinizi bükün.",
        imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Dizlerinizin ayak parmak uçlarınızı geçmemesine dikkat ederek, uyluklarınız yere paralel olana kadar inin.",
        imageUrl: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Topuklarınızdan güç alarak nefes verin ve dik pozisyona geri dönün.",
        imageUrl: "https://images.unsplash.com/photo-1507390137201-774856af4ba0?auto=format&fit=crop&q=80&w=400"
      }
    ],
    caloriesPerMinute: 7,
    videoUrl: "https://www.youtube.com/embed/17_a_p-or9k",
    imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800",
    hotspots: [
      {
        label: "Göğüs ve Duruş",
        x: 50,
        y: 25,
        tip: "GÖĞÜS DİK: Göğsünüz açık, omuzlarınız geride ve omurganız dik durmalıdır. Sırtınızı kamburlaştırmayın."
      },
      {
        label: "Diz Hizası",
        x: 44,
        y: 65,
        tip: "DİZ AÇISI: Çömelirken dizlerinizi hafifçe dışarı itin, içe çökmesini önleyin. Dizler ayak parmak uçlarını geçmemelidir."
      },
      {
        label: "Topuk Teması",
        x: 42,
        y: 88,
        tip: "TOPUKLAR: Vücut ağırlığınızı ayak parmaklarınıza değil topuklarınıza yayın, topukların yerden kalkmasına izin vermeyin."
      }
    ],
    safetyTips: [
      "Ağırlığı ayak parmaklarınıza değil, mutlaka topuklarınıza ve ayak tabanının geneline yayın.",
      "Dizlerinizin içe doğru bükülmesine izin vermeyin; çömelirken dizlerinizi hafifçe dışarı, ayak parmaklarınızın yönüne doğru itin.",
      "Sırtınızı kamburlaştırmayın. Göğsünüz açık ve omurganız doğal eğrisinde dik durmalıdır."
    ],
    commonMistakes: [
      "Dizlerin aşırı öne gitmesi ve topukların yerden kalkması.",
      "Yeterince derin çömelmemek (ideal duruş uyluk kemiğinin yere paralel olmasıdır).",
      "Başın aşırı öne veya arkaya yatırılması."
    ],
    coachNotes: "Ben Defne! Squat yaparken dizlerinin içe çökmediğinden emin ol. Aşağı inerken dizlerini dışarıya, ayak serçe parmaklarına doğru yönlendir. Topuklarını yere çivi gibi sabitle and tüm gücü kalçandan al. Harika gidiyorsun!",
    coachName: "Defne Arslan (AI Kıdemli Antrenör)"
  },
  {
    id: "plank",
    name: "Plank (Düz Karın Duruşu)",
    category: "Karın / Merkez",
    targetMuscles: ["Karın Kasları (Abs/Core)", "Sırt ve Bel", "Omuzlar"],
    difficulty: "Başlangıç",
    description: "Merkez bölge (core) stabilitesini ve genel dayanıklılığı artırmak için mükemmel bir statik egzersizdir.",
    steps: [
      {
        text: "Ön kollarınızı yere koyun, dirsekleriniz tam omuzlarınızın altında olmalıdır.",
        imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Ayak parmak uçlarınızda yükselerek vücudunuzu yerden kaldırın.",
        imageUrl: "https://images.unsplash.com/photo-1566241477600-ac026ad43874?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Vücudunuz başınızdan topuklarınıza kadar dümdüz bir çizgi halinde olmalıdır. Kalçanızı havaya kaldırmayın veya aşağı düşürmeyin.",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Karın kaslarınızı ve kalçanızı sıkarak belirlenen süre boyunca bu pozisyonu koruyun. Düzenli nefes almaya devam edin.",
        imageUrl: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&q=80&w=400"
      }
    ],
    caloriesPerMinute: 4,
    videoUrl: "https://www.youtube.com/embed/TvxNkmjdhgU",
    imageUrl: "https://images.unsplash.com/photo-1566241477600-ac026ad43874?auto=format&fit=crop&q=80&w=800",
    hotspots: [
      {
        label: "Dirsek Pozisyonu",
        x: 28,
        y: 65,
        tip: "DİRSEKLER: Dirseklerinizi omuzlarınızın tam altına yerleştirin. Bu omuz eklemlerine binen yükü dengeler."
      },
      {
        label: "Karın ve Kalça",
        x: 52,
        y: 50,
        tip: "MERKEZ BÖLGE: Karın ve kalça kaslarınızı sonuna kadar sıkın. Belinizin aşağı sarkmasına asla izin vermeyin."
      },
      {
        label: "Ayak Uçları",
        x: 84,
        y: 58,
        tip: "AYAK UÇLARI: Ayak parmak uçlarınızda dengede kalın ve topuklarınızı geriye doğru iterek bacaklarınızı da gergin tutun."
      }
    ],
    safetyTips: [
      "Dirseklerinizin tam omuz hizasında olduğundan emin olun; omuz eklemlerine binen yükü hafifletmek için bu kural kritiktir.",
      "Nefesinizi kesinlikle tutmayın. Karın kaslarınız sıkılıyken derin ve düzenli nefes almaya odaklanın.",
      "Sırtınızın üst kısmını aşırı kamburlaştırmayın veya kürek kemiklerinizi birleştirmeyin; sırtı hafifçe yukarı itin."
    ],
    commonMistakes: [
      "Kalçanın çok yükseğe kalkması ya da tam aksine aşağı doğru çökerek bel kaslarını zorlaması.",
      "Boynu yukarı doğru bükerek karşıya bakmaya çalışmak (bakışlar doğrudan iki elin ortasındaki zemine olmalıdır)."
    ],
    coachNotes: "Plank pozisyonunda süreye odaklanma, formuna odaklan. Dirseklerin omuzlarının tam altında olsun. Kürek kemiklerini birbirinden uzaklaştırarak sırtını hafifçe yukarı doldur. Karın kaslarını sanki biri karnına vuracakmış gibi sımsıkı tut. Nefes almayı unutma!",
    coachName: "Defne Arslan (AI Kıdemli Antrenör)"
  },
  {
    id: "jumping-jacks",
    name: "Jumping Jacks (Zıplayarak Kol Bacak Açma)",
    category: "Kardiyo",
    targetMuscles: ["Tüm Vücut", "Kardiyovasküler Sistem", "Baldırlar"],
    difficulty: "Başlangıç",
    description: "Kalp ritmini hızla artıran, yağ yakımını destekleyen ve tüm vücudu ısıtan hareketli bir kardiyo egzersizidir.",
    steps: [
      {
        text: "Ayaklar bitişik, kollar yanlarda dik bir şekilde ayakta durun.",
        imageUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Hafifçe yukarı zıplarken ayaklarınızı omuz genişliğinden daha fazla açın ve kollarınızı başınızın üzerinde birleştirin.",
        imageUrl: "https://images.unsplash.com/photo-1607962837359-5e7e89f866ad?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Tekrar zıplayarak ayaklarınızı birleştirin ve kollarınızı yanlara indirerek başlangıç pozisyonuna dönün.",
        imageUrl: "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Hareketi ritmik ve hızlı bir şekilde tekrarlayın.",
        imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400"
      }
    ],
    caloriesPerMinute: 10,
    videoUrl: "https://www.youtube.com/embed/nUfJgCo8pS0",
    imageUrl: "https://images.unsplash.com/photo-1607962837359-5e7e89f866ad?auto=format&fit=crop&q=80&w=800",
    hotspots: [
      {
        label: "Kollar ve Omuzlar",
        x: 50,
        y: 15,
        tip: "KOLLAR: Kollar başınızın üzerinde geniş bir yay çizerek birleşmeli. Omuzlarınızı yukarı kasmadan rahat hareket ettirin."
      },
      {
        label: "Diz Esnekliği",
        x: 42,
        y: 65,
        tip: "DİZLER: Yere inerken dizlerinizi hafifçe bükerek eklemlere binen darbe gücünü sönümleyin. Asla düz dizle inmeyin."
      },
      {
        label: "Yumuşak İniş",
        x: 35,
        y: 90,
        tip: "AYAK TABANI: Yere basarken daima önce parmak uçlarınıza yumuşakça basın, tüm vücut ağırlığınızı doğrudan topuklara vurmayın."
      }
    ],
    safetyTips: [
      "Dizlerinizin üzerinde binen darbeyi azaltmak için her zaman parmak uçlarınıza yumuşakça inin.",
      "Dizlerinizin içe çökmesine izin vermeyin, ayaklarınızın açıldığı hizada hafifçe bükülü kalmalarına dikkat edin.",
      "Omuzlarınızı kasmayın, kollarınızı hareket ettirirken omuz eklemlerini rahat bırakın."
    ],
    commonMistakes: [
      "Sert ve düz dizlerle yere sert basmak (bu eklemlere zarar verebilir).",
      "Kolları yukarıda yarım açıda bırakmak (kollar başın üstünde neredeyse birbirine değmelidir)."
    ],
    coachNotes: "AI Antrenörün Defne burada! Bu harika bir kardiyo hareketi. Eklem sağlığın için yere inerken dizlerini hafifçe kırarak yay gibi esne, asla düz dizlerle sert basma. Temponu koru, nefes alışverişlerini ritmik tut!",
    coachName: "Defne Arslan (AI Kıdemli Antrenör)"
  },
  {
    id: "lunges",
    name: "Lunge (Adımlama)",
    category: "Güç",
    targetMuscles: ["Ön Bacak (Quadriceps)", "Kalça (Gluteus)", "Arka Bacak", "Denge Kasları"],
    difficulty: "Orta",
    description: "Bacak kaslarını tek taraflı olarak çalıştırarak denge, koordinasyon ve bacak gücünü optimize eden bir egzersizdir.",
    steps: [
      {
        text: "Ayakta tamamen dik durun, ellerinizi kalçanıza koyun veya vücudunuzun yanlarında serbest bırakın.",
        imageUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Bir bacağınızla ileriye doğru kontrollü ve büyük bir adım atın.",
        imageUrl: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Arkadaki diziniz yere hafifçe yaklaşana kadar kalçanızı aşağı indirin. Öndeki diziniz 90 derecelik açı yapmalı ve ayak parmağınızı geçmemelidir.",
        imageUrl: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Öndeki ayağınızın topuğuyla kendinizi geriye doğru güçlüce iterek başlangıç pozisyonuna dönün.",
        imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Aynı adımları diğer bacağınızla koordinasyonlu bir şekilde tekrarlayın.",
        imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400"
      }
    ],
    caloriesPerMinute: 6,
    videoUrl: "https://www.youtube.com/embed/COKYKgQ8KR0",
    imageUrl: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?auto=format&fit=crop&q=80&w=800",
    hotspots: [
      {
        label: "Dik Gövde",
        x: 48,
        y: 30,
        tip: "GÖVDE: Gövdenizi öne eğmeyin, üst vücudunuzu tamamen dik ve yere dikey tutun. Bakışlarınız tam karşıda olsun."
      },
      {
        label: "Ön Diz Hizası",
        x: 35,
        y: 65,
        tip: "ÖN DİZ: Öndeki diziniz tam 90 derecelik açı oluşturmalıdır. Diz kapağı asla ayak parmak ucunuzun önüne taşmamalıdır."
      },
      {
        label: "Arka Bacak ve Topuk",
        x: 65,
        y: 78,
        tip: "ARKA AYAK: Arkadaki topuk daima havada kalmalıdır. Kalçanızı indirirken arkadaki diz kontrollü bir şekilde yere yaklaşır."
      }
    ],
    safetyTips: [
      "Öndeki dizinizin ayak parmak ucunuzun ilerisine gitmesine izin vermeyin (bu durum diz kapağına aşırı yük bindirir).",
      "Arkadaki topuğunuzun yere değmesini beklemeyin, hareket boyunca arka topuk havada kalmalıdır.",
      "Dengenizi korumak için gövdenizi öne eğmeyin, üst vücudunuzu dik ve yere dik tutun."
    ],
    commonMistakes: [
      "Adımın çok dar atılması (dizlerin 90 derece bükülememesi).",
      "Arka dizi kontrollüce yere sert vurmak.",
      "Sağa sola yalpalamak (core kaslarının sıkılmamasından kaynaklanır)."
    ],
    coachNotes: "Lunge yaparken dengeni korumak için ayaklarını aynı çizgi üzerine koyma, sanki tren rayı üzerindeymiş gibi iki ayrı hizada tut. Adımını geniş at ki öndeki dizin 90 derece büküle bilsin. İnerken gövdeni dik tut!",
    coachName: "Defne Arslan (AI Kıdemli Antrenör)"
  },
  {
    id: "burpee",
    name: "Burpee (Tüm Vücut Kardiyo)",
    category: "Kardiyo",
    targetMuscles: ["Tüm Vücut", "Göğüs", "Bacaklar", "Karın Kasları", "Omuzlar"],
    difficulty: "İleri",
    description: "Kondisyonu, patlayıcı gücü ve kardiyovasküler kapasiteyi maksimuma çıkaran, yüksek yoğunluklu tüm vücut egzersizi.",
    steps: [
      {
        text: "Ayakta dik durun ve derin nefes alarak hazırlanın.",
        imageUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Hızlıca çömelerek ellerinizi önünüzde yere koyun.",
        imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Ayaklarınızı geriye doğru fırlatarak dengeli bir şınav pozisyonuna geçin.",
        imageUrl: "https://images.unsplash.com/photo-1566241477600-ac026ad43874?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Göğsünüzü yere değdirerek hızlı ve nizami bir şınav çekin.",
        imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Ayaklarınızı tekrar ellerinizin yanına çekerek çömelme pozisyonuna geri dönün.",
        imageUrl: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Çömelme pozisyonundan yukarı doğru patlayıcı bir şekilde zıplayın ve kollarınızı havaya kaldırın.",
        imageUrl: "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?auto=format&fit=crop&q=80&w=400"
      }
    ],
    caloriesPerMinute: 12,
    videoUrl: "https://www.youtube.com/embed/TU8QYVW0gDU",
    imageUrl: "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?auto=format&fit=crop&q=80&w=800",
    hotspots: [
      {
        label: "Plank Denge Noktası",
        x: 45,
        y: 50,
        tip: "PLANK GEÇİŞİ: Ayaklarınızı geriye fırlattığınız an karın kaslarınızı sıkarak kalçanızın aşağı sarkıp belinizi zorlamasını önleyin."
      },
      {
        label: "Patlayıcı Zıplama",
        x: 55,
        y: 85,
        tip: "SIÇRAMA VE İNİŞ: Sıçrama sonrası yere konarken dizlerinizi bükülü tutarak darbeleri sönümleyin. Yay gibi esneyerek inin."
      }
    ],
    safetyTips: [
      "Ayakları geriye fırlatırken karın kaslarınızı sımsıkı tutarak belinizin aşağı çökmesini kesinlikle engelleyin.",
      "Yukarı doğru zıpladıktan sonra yere inerken dizlerinizi hafifçe bükerek darbeleri sönümleyin.",
      "Hareketi aceleyle değil, akıcı ve kontrollü bir ritimle yapın."
    ],
    commonMistakes: [
      "Plank aşamasında belin aşırı bükülmesi (bel ağrılarına sebep olabilir).",
      "Yere basarken topukları kaldırarak tüm yükü parmak ucuna vermek."
    ],
    coachNotes: "Burpee en zorlayıcı ama en hızlı yağ yakan harekettir! Kendini yavaşlatmaktan korkma. Ayaklarını geriye fırlattığında belinin sarkmamasına çok dikkat et. Yukarı sıçradığında nefesini dışarı üfle ve parmak uçlarına yumuşakça in.",
    coachName: "Defne Arslan (AI Kıdemli Antrenör)"
  },
  {
    id: "mountain-climber",
    name: "Mountain Climber (Dağ Tırmanışı)",
    category: "Karın / Merkez",
    targetMuscles: ["Karın (Abs)", "Omuzlar", "Kardiyovasküler Sistem", "Kalça Fleksörleri"],
    difficulty: "Orta",
    description: "Şınav pozisyonunda bacakları ritmik olarak karına çekerek hem karın kaslarını çalıştıran hem de kardiyo etkisi yaratan egzersizdir.",
    steps: [
      {
        text: "Tam şınav pozisyonu alın: Eller omuzların altında, vücut düz olmalıdır.",
        imageUrl: "https://images.unsplash.com/photo-1566241477600-ac026ad43874?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Karın kaslarınızı sıkarak sağ dizinizi göğsünüze doğru çekin.",
        imageUrl: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Sağ ayağınızı başlangıç konumuna götürürken aynı anda sol dizinizi göğsünüze çekin.",
        imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Sanki dikey bir dağa tırmanıyormuş gibi, bacaklarınızı hızlı ve ritmik bir şekilde değiştirerek harekete devam edin.",
        imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400"
      }
    ],
    caloriesPerMinute: 9,
    videoUrl: "https://www.youtube.com/embed/kLh-5ElvIJo",
    imageUrl: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&q=80&w=800",
    hotspots: [
      {
        label: "El ve Omuz Hizası",
        x: 28,
        y: 65,
        tip: "OMUZLAR VE ELLER: Ellerinizi tam olarak omuzlarınızın altına yerleştirin. Omuz eklemleri ve el bilekleri dikey aynı hizada kalmalıdır."
      },
      {
        label: "Kalça Seviyesi",
        x: 55,
        y: 35,
        tip: "KALÇA YÜKSEKLİĞİ: Bacaklarınızı ritmik olarak çekerken kalçanızın havaya fırlamasına izin vermeyin. Kalça, sırt çizginizle uyumlu olmalı."
      },
      {
        label: "Diz Çekişi (Core)",
        x: 42,
        y: 55,
        tip: "KARIN SIKILIĞI: Dizlerinizi göğsünüze doğru patlayıcı bir şekilde çekerken tüm kontrolü karın kaslarınızla sağlayın."
      }
    ],
    safetyTips: [
      "Kalçanızın yukarı doğru çok kalkmasına izin vermeyin. Vücudunuz şınav pozisyonuna yakın, paralel kalmalıdır.",
      "Ellerinmi tam olarak omuzlarınızın altına yerleştirin. Öne veya arkaya kayması omuzlarınızı yorabilir.",
      "Dizlerinizi çekerken sırtınızı kamburlaştırmamaya çalışın, göğsünüz karşıya doğru açık kalsın."
    ],
    commonMistakes: [
      "Sanki zıplıyormuş gibi kalçayı havaya sıçratarak bacak değiştirmek.",
      "Başın aşağı sarkıtılarak ayaklara bakılması."
    ],
    coachNotes: "Harika bir core aktivasyonu için dağ tırmanışı yapıyoruz! Ellerini omuzlarının altına beton gibi sabitle. Bacaklarını çekerken kalçanı yukarı zıplatma, kalçan hep aynı yükseklikte kalsın. Karın kaslarını sıkarak dizini göğsüne çek!",
    coachName: "Defne Arslan (AI Kıdemli Antrenör)"
  },
  {
    id: "downward-dog",
    name: "Downward-Facing Dog (Aşağı Bakan Köpek)",
    category: "Esneklik",
    targetMuscles: ["Arka Zincir", "Omuzlar", "Arka Bacaklar", "Omurga"],
    difficulty: "Başlangıç",
    description: "Vücudu esneten, sakinleştiren ve omurga hizalanmasını sağlayan temel bir yoga duruşudur.",
    steps: [
      {
        text: "Ellerinizin ve dizlerinizin üzerinde başlayın (dört ayak pozisyonu).",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Nefes verirken dizlerinizi yerden kaldırın, kalçanızı yukarı ve geriye doğru itin.",
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Vücudunuzla ters 'V' şekli oluşturun. Topuklarınızı yere doğru yaklaştırmaya çalışın.",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Ellerinizle yeri güçlüce itin, başınızı kollarınızın arasında serbest bırakın.",
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400"
      },
      {
        text: "Pozisyonda kalarak derin ve sakin nefesler alın.",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400"
      }
    ],
    caloriesPerMinute: 3,
    videoUrl: "https://www.youtube.com/embed/EC7RG5913sc",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    hotspots: [
      {
        label: "El ve Omuz İtişi",
        x: 20,
        y: 75,
        tip: "ELLER: Avuç içlerinizle ve parmak eklemlerinizle yeri güçlüce ileri itin. Bileklerinize aşırı yük binmesini bu sayede engellersiniz."
      },
      {
        label: "Omurga ve Kalça",
        x: 52,
        y: 25,
        tip: "OMURGA: Kalçanızı olabildiğince yukarı ve geriye çekerek omurganızı uzatın. Sırtınızın kamburlaşmasına izin vermeyin."
      },
      {
        label: "Topuklar ve Hamstring",
        x: 82,
        y: 78,
        tip: "TOPUKLAR VE BACAKLAR: Topuklarınızı yere doğru ağırlaştırın. Arka bacak kaslarınız çok gergince dizlerinizi hafifçe bükün."
      }
    ],
    safetyTips: [
      "Eğer arka bacaklarınız çok gergince ve beliniz yuvarlanıyorsa, dizlerinizi hafifçe bükebilir ve topuklarınızı havada tutabilirsiniz.",
      "Ellerinizde ağırlığı parmak eklemlerine yayın; bileklerinize binen yükü azaltmak için avuç içlerinizle yeri güçlüce itin.",
      "Omuzlarınızı kulaklarınızdan uzaklaştırın; kürek kemiklerinizi sırtınızda dışarı doğru yayın."
    ],
    commonMistakes: [
      "Sırtın yuvarlanması (kambur durmak yerine omurgayı uzatmaya odaklanın).",
      "Başın yukarı kaldırılması (boyun tamamen rahat olmalı, bakışlar dizlere veya göbek deliğine yönelmelidir)."
    ],
    coachNotes: "Aşağı bakan köpek hareketinde amacımız topukları yere değdirmek değil, omurgayı olabildiğince düz tutmaktır. Eğer sırtında kamburlaşma oluyorsa dizlerini hafif büküp topuklarını havaya kaldır. Ellerinle yeri ileriye doğru it ve omurganın esnediğini hisset.",
    coachName: "Defne Arslan (AI Kıdemli Antrenör)"
  }
];
