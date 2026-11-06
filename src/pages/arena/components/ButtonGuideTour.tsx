import React from 'react';

interface ButtonGuideTourProps {
  isOpen: boolean;
  onClose: () => void;
  playSound: (sound: 'click') => void;
}

interface TourStep {
  targetId: string;
    title: string;
  desc: string;
}

// Urutan pengenalan tombol — sesuai tombol asli di CommandPanel (arena)
const STEPS: TourStep[] = [
  { targetId: 'add-btn-RIGHT',  title: 'Tombol Kanan',  desc: 'Menggerakkan Petugas Sampah 1 petak ke kanan.' },
  { targetId: 'add-btn-LEFT',   title: 'Tombol Kiri',   desc: 'Menggerakkan Petugas Sampah 1 petak ke kiri.' },
  { targetId: 'add-btn-UP',     title: 'Tombol Loncat', desc: 'Petugas melompat untuk melewati rintangan batu di jalan.' },
  { targetId: 'add-btn-PICK',   title: 'Tombol Ambil',  desc: 'Mengambil sampah yang ada di petak yang sama, lalu memasukkannya ke tas.' },
  { targetId: 'add-btn-DROP',   title: 'Tombol Buang',  desc: 'Membuang sampah paling atas dari tas ke tong di depan petugas.' },
  { targetId: 'add-btn-RESET',  title: 'Tombol Ulang',  desc: 'Mengatur ulang level dan menghapus semua langkah yang sudah disusun.' },
  { targetId: 'run-execution-btn', title: 'Tombol Mulai', desc: 'Menjalankan semua langkah yang sudah kamu susun secara berurutan.' },
  { targetId: 'instructions-dropzone-scrollable', title: 'Area Program', desc: 'Setiap tombol yang kamu klik akan muncul di sini sebagai urutan langkah.' },
];

interface Rect { top: number; left: number; width: number; height: number; }

export default function ButtonGuideTour({ isOpen, onClose, playSound }: ButtonGuideTourProps) {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [rect, setRect] = React.useState<Rect | null>(null);

  // Reset ke langkah awal setiap kali tur dibuka
  React.useEffect(() => {
    if (isOpen) setStepIndex(0);
  }, [isOpen]);

  // Ukur posisi elemen target pada langkah aktif
  React.useLayoutEffect(() => {
    if (!isOpen) return;

    const measure = () => {
      const el = document.getElementById(STEPS[stepIndex].targetId);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      } else {
        setRect(null);
      }
    };

    // Ukur setelah paint agar layout sudah stabil
    const raf = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [isOpen, stepIndex]);

  if (!isOpen) return null;

  const step = STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  const goNext = () => {
    playSound('click');
    if (isLast) onClose();
    else setStepIndex((i) => Math.min(STEPS.length - 1, i + 1));
  };
  const goPrev = () => {
    playSound('click');
    setStepIndex((i) => Math.max(0, i - 1));
  };

  // Padding spotlight di sekitar tombol
  const pad = 8;
  const spot = rect
    ? {
        top: rect.top - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }
    : null;

  // Posisi kartu tooltip: di atas target jika ruang bawah sempit, selain itu di bawah
  const cardWidth = 300;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 768;

  let cardStyle: React.CSSProperties;
  if (spot) {
    const spaceBelow = vh - (spot.top + spot.height);
    const placeBelow = spaceBelow > 220;
    const centerX = spot.left + spot.width / 2;
    const left = Math.max(12, Math.min(vw - cardWidth - 12, centerX - cardWidth / 2));
    cardStyle = {
      position: 'fixed',
      left,
      width: cardWidth,
      top: placeBelow ? spot.top + spot.height + 14 : undefined,
      bottom: placeBelow ? undefined : vh - spot.top + 14,
    };
  } else {
    // Fallback: tengah layar
    cardStyle = {
      position: 'fixed',
      left: Math.max(12, vw / 2 - cardWidth / 2),
      top: vh / 2 - 90,
      width: cardWidth,
    };
  }

  return (
    <div className="fixed inset-0 z-[200] animate-fade-in" aria-modal="true" role="dialog">
      {/* Lapisan gelap + lubang spotlight via box-shadow besar */}
      {spot ? (
        <div
          className="fixed rounded-2xl ring-4 ring-amber-400 transition-all duration-300 ease-out pointer-events-none"
          style={{
            top: spot.top,
            left: spot.left,
            width: spot.width,
            height: spot.height,
            boxShadow: '0 0 0 9999px rgba(28, 25, 23, 0.72)',
          }}
        />
      ) : (
        <div className="fixed inset-0 bg-stone-900/72 pointer-events-none" />
      )}

      {/* Penangkap klik agar tombol tidak terpakai saat tur berjalan */}
      <div className="fixed inset-0" onClick={goNext} />

      {/* Kartu penjelasan */}
      <div
        style={cardStyle}
        className="bg-[#FAF5EE] rounded-2xl border-4 border-[#EED4B7] shadow-2xl p-4 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 border border-amber-300 rounded-full px-2 py-0.5">
            {stepIndex + 1}/{STEPS.length}
          </span>
          <button
            type="button"
            onClick={() => { playSound('click'); onClose(); }}
            className="text-[10px] font-bold text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            Lewati ✕
          </button>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-extrabold text-stone-800 text-base font-heading">{step.title}</h3>
        </div>
        <p className="text-[13px] text-stone-600 font-sans leading-relaxed mb-3">{step.desc}</p>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={isFirst}
            className={`px-3.5 py-2 border border-[#EED4B7] bg-white rounded-xl text-xs font-bold text-stone-600 cursor-pointer hover:bg-stone-50 transition-colors shadow-sm ${isFirst ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            Sebelumnya
          </button>

          <div className="flex gap-1">
            {STEPS.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${idx === stepIndex ? 'bg-amber-500 w-3' : 'bg-stone-300'}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-colors cursor-pointer shadow-sm border ${
              isLast
                ? 'bg-emerald-400 hover:bg-emerald-300 border-emerald-500 text-stone-950'
                : 'bg-amber-400 hover:bg-amber-300 border-amber-500 text-stone-900'
            }`}
          >
            {isLast ? 'Selesai, Mulai!' : 'Lanjut'}
          </button>
        </div>
      </div>
    </div>
  );
}
