import AuthGuard from "@/components/admin/AuthGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export const metadata = {
    title: "Admin Dashboard | PNT Academy",
    description: "Secure management portal for PNT Academy content.",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
                {/* Fixed Sidebar */}
                <AdminSidebar />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
                    {/* Background glow for theme matching */}
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-600/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-600/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

                    {/* Dashboard Header/Topbar */}
                    <AdminTopbar />

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto p-4 md:p-8 z-10">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
