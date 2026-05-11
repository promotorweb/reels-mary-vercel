```tsx
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { tarotCards, type TarotCard } from "@/lib/tarot-cards";

const CARD_HEIGHT = 180;
const SLOT_SPEEDS = [620, 540, 700];

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = arr.slice();
  let s = seed;

  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
}

function Strip({
  cards,
  speed,
  onCurrentChange,
}: {
  cards: TarotCard[];
  speed: number;
  onCurrentChange: (name: string) => void;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const lastIndexRef = useRef<number>(-1);

  const repeated = useMemo(() => {
    const out: TarotCard[] = [];
    for (let i = 0; i < 4; i++) out.push(...cards);
    return out;
  }, [cards]);

  const cycle = cards.length * CARD_HEIGHT;

  useEffect(() => {
    let raf = 0;

    const tick = (t: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = t;

      const dt = (t - lastTimeRef.current) / 1000;
      lastTimeRef.current = t;

      let next = offsetRef.current + speed * dt;
      if (next >= cycle) next -= cycle;

      offsetRef.current = next;

      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(0, ${-next}px, 0)`;
      }

      const idx = Math.floor((next + CARD_HEIGHT / 2) / CARD_HEIGHT) % cards.length;

      if (idx !== lastIndexRef.current) {
        lastIndexRef.current = idx;
        onCurrentChange(cards[idx].name);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [speed, cycle, cards, onCurrentChange]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-[10px] ring-1 ring-tarot-gold/40 bg-black/40"
      style={{
        height: CARD_HEIGHT,
        filter:
          "drop-shadow(0 8px 24px rgba(0,0,0,0.75)) drop-shadow(0 0 18px rgba(212,175,55,0.18))",
      }}
    >
      <div ref={innerRef} style={{ willChange: "transform", transform: "translate3d(0,0,0)" }}>
        {repeated.map((card, i) => (
          <div
            key={`${card.id}-${i}`}
            style={{
              height: CARD_HEIGHT,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={card.image}
              alt={card.name}
              draggable={false}
              loading="eager"
              decoding="sync"
              style={{
                height: "100%",
                width: "100%",
                objectFit: "contain",
                display: "block",
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/70 to-transparent" />
    </div>
  );
}

function SlotColumn({ cards, speed }: { cards: TarotCard[]; speed: number }) {
  const [currentName, setCurrentName] = useState(cards[0].name);

  return (
    <div className="flex flex-col items-center gap-2 w-[29%]">
      <div
        className="font-serif text-[12px] sm:text-[14px] tracking-wide text-tarot-gold text-center px-1 leading-tight min-h-[1.2em] truncate w-full"
        style={{
          textShadow: "0 2px 6px rgba(0,0,0,0.85), 0 0 10px rgba(212,175,55,0.35)",
        }}
      >
        {currentName}
      </div>

      <Strip cards={cards} speed={speed} onCurrentChange={setCurrentName} />
    </div>
  );
}

function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 38 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 1 + Math.random() * 3.2,
        duration: 9 + Math.random() * 14,
        delay: -Math.random() * 20,
        opacity: 0.25 + Math.random() * 0.55,
        drift: (Math.random() - 0.5) * 60,
        blur: Math.random() < 0.35 ? 1.2 : 0,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-[-10px] rounded-full bg-tarot-gold"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              filter: `blur(${p.blur}px) drop-shadow(0 0 6px rgba(212,175,55,0.7))`,
              animation: `particle-rise ${p.duration}s linear ${p.delay}s infinite`,
              "--drift": `${p.drift}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function Watermarks() {
  const marks = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        id: i,
        top: 6 + Math.random() * 88,
        size: 11 + Math.random() * 7,
        duration: 28 + Math.random() * 22,
        delay: -Math.random() * 30,
        opacity: 0.06 + Math.random() * 0.08,
        gold: Math.random() < 0.5,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[5]">
      {marks.map((m) => (
        <span
          key={m.id}
          className="absolute whitespace-nowrap font-serif tracking-[0.25em]"
          style={{
            top: `${m.top}%`,
            left: "-30%",
            fontSize: m.size,
            opacity: m.opacity,
            color: m.gold ? "rgb(212,175,55)" : "rgba(255,255,255,0.9)",
            animation: `wm-drift ${m.duration}s linear ${m.delay}s infinite`,
            textShadow: "0 1px 2px rgba(0,0,0,0.6)",
          }}
        >
          @marymorgan_tarot
        </span>
      ))}
    </div>
  );
}

function Preloader({ progress, total }: { progress: number; total: number }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-tarot-black text-tarot-gold gap-6">
      <div className="font-serif text-2xl tracking-[0.35em] uppercase animate-pulse text-center">
        Carregando lâminas...
      </div>

      <div className="w-64 h-[2px] bg-tarot-gold/20 overflow-hidden">
        <div
          className="h-full bg-tarot-gold transition-all duration-200"
          style={{ width: `${(progress / total) * 100}%` }}
        />
      </div>

      <div className="text-xs text-tarot-gold/60 font-serif tracking-widest">
        {progress} / {total}
      </div>
    </div>
  );
}

export function TarotReel() {
  const [loadedCount, setLoadedCount] = useState(0);
  const [ready, setReady] = useState(false);

  const total = tarotCards.length;

  const decks = useMemo(
    () => [shuffle(tarotCards, 17), shuffle(tarotCards, 91), shuffle(tarotCards, 233)],
    [],
  );

  useEffect(() => {
    let cancelled = false;
    let loaded = 0;

    setLoadedCount(0);
    setReady(false);

    const markDone = () => {
      if (cancelled) return;

      loaded++;

      setLoadedCount(loaded);

      if (loaded >= tarotCards.length) {
        setReady(true);
      }
    };

    tarotCards.forEach((card) => {
      const img = new Image();

      img.onload = markDone;
      img.onerror = markDone;
      img.src = card.image;
    });

    const mary = new Image();
    mary.src = "/assets/mary/mary-morgan.webp";

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return <Preloader progress={loadedCount} total={total} />;
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-black flex items-center justify-center">
      <div
        className="relative overflow-hidden bg-tarot-black shadow-[0_0_60px_rgba(0,0,0,0.9)]"
        style={{
          width: "min(100vw, calc(100vh * 9 / 16), 420px)",
          height: "min(100vh, calc(100vw * 16 / 9), calc(420px * 16 / 9))",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/assets/mary/mary-morgan.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
          }}
        />

        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_35%,rgba(0,0,0,0.75)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(80,30,140,0.18),transparent_65%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

        <Particles />
        <Watermarks />

        <div className="relative z-10 h-full w-full flex flex-col items-center justify-between py-[5vh] px-4">
          <div className="text-center w-full">
            <div className="font-serif text-tarot-gold uppercase tracking-[0.4em] text-[10px] mb-2 opacity-85">
              Mary Morgan • Tarot
            </div>

            <h1
              className="font-serif text-white text-[20px] leading-tight px-4"
              style={{
                textShadow:
                  "0 2px 10px rgba(0,0,0,0.95), 0 0 22px rgba(212,175,55,0.35)",
              }}
            >
              Respire, pense na situação e pause o vídeo
            </h1>

            <div className="mt-2 mx-auto h-px w-20 bg-gradient-to-r from-transparent via-tarot-gold to-transparent opacity-70" />
          </div>

          <div className="w-full flex flex-col items-center gap-3">
            <div className="w-full flex items-end justify-center gap-2">
              <SlotColumn cards={decks[0]} speed={SLOT_SPEEDS[0]} />
              <SlotColumn cards={decks[1]} speed={SLOT_SPEEDS[1]} />
              <SlotColumn cards={decks[2]} speed={SLOT_SPEEDS[2]} />
            </div>

            <div
              className="font-serif tracking-[0.35em] uppercase text-[12px] text-tarot-gold"
              style={{
                textShadow: "0 2px 6px rgba(0,0,0,0.9), 0 0 14px rgba(212,175,55,0.45)",
              }}
            >
              @marymorgan_tarot
            </div>
          </div>

          <div className="text-center w-full -mt-12">
            <div className="mx-auto mb-2 h-px w-20 bg-gradient-to-r from-transparent via-tarot-gold to-transparent opacity-70" />

            <h2
              className="font-serif text-white text-[18px]"
              style={{
                textShadow:
                  "0 2px 10px rgba(0,0,0,0.95), 0 0 22px rgba(212,175,55,0.3)",
              }}
            >
              Comente o nome das 3 cartas
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
```
