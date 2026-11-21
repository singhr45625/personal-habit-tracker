import confetti from 'canvas-confetti';

export function fireConfetti(): void {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#34D399', '#6EE7B7', '#3B82F6', '#F59E0B'],
      disableForReducedMotion: true,
    });
  } catch {
    // Graceful fallback
  }
}

export function fireLevelUpConfetti(): void {
  try {
    const end = Date.now() + 1000;
    const colors = ['#10B981', '#F59E0B', '#3B82F6', '#EC4899'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {
    // Graceful fallback
  }
}
