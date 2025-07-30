import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
} from 'motion/react';

export function RotatingGlowBorder({ children }: { children: React.ReactNode }) {
  const rotate = useMotionValue(0);

  useAnimationFrame((t) => {
    rotate.set((t / 50) % 360);
  });

  const gradient = useTransform(
    rotate,
    (r) => `conic-gradient(from ${r}deg, #ff0, #f0f, #0ff, #ff0)`
  );

  return (
    <motion.div
      style={{ borderImage: gradient, borderImageSlice: 1 }}
      className="p-1 rounded-xl border-4 border-transparent"
    >
      {children}
    </motion.div>
  );
}