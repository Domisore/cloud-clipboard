import Link from "next/link";

export function Header() {
    return (
        <header className="w-full flex flex-col items-center">
            {/* Top Bar */}
            <div className="w-full bg-surface text-gray-400 text-[10px] sm:text-xs py-1 text-center border-b border-border-color">
                DRIVE.IO DOMAIN FOR SALE. SERIOUS INQUIRIES: contact@drive.io
            </div>

            {/* Main Branding */}
            <div className="py-12 sm:py-16 flex flex-col items-center gap-4 text-center px-4">
                <Link href="/" className="text-6xl sm:text-8xl font-bold tracking-tighter hover:text-accent transition-colors">
                    DRIVE.IO
                </Link>
                <p className="text-lg sm:text-xl text-gray-400 font-light">
                    Just drop it. Toss it here. Store your stuff.
                </p>
            </div>
        </header>
    );
}
