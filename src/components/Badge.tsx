export function Badge({ children }: { children: string }) {
  return (
    <span className="text-xs md:text-[13px] px-2.5 py-1 rounded-full border border-white/10 bg-white/70 dark:bg-white/5 font-semibold">
      {children}
    </span>
  );
}
