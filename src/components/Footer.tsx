import Link from "next/link";

export default function Footer() {
    return (
        <footer className="py-12 border-t border-slate-900/10 dark:border-white/10 bg-slate-100 dark:bg-slate-950 text-center text-slate-800 dark:text-slate-500 transition-colors duration-500">
            <p>© 2026 PNT Academy. All rights reserved.</p>
            <Link href="/admin" className="text-xs mt-2 inline-block hover:text-blue-600 transition-colors opacity-50 hover:opacity-100">
                Admin Portal
            </Link>
        </footer>
    );
}
