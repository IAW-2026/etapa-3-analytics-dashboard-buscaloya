import { BackgroundGrid } from '@/app/ui/layout/BackgroundGrid';
import { Scanline } from '@/app/ui/layout/Scanline';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black text-white font-mono">
      <BackgroundGrid />
      <Scanline />
      {children}
    </div>
  );
}
