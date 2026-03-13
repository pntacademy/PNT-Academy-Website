"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Shield, Bell, Key, User, Camera, Check, AlertCircle, Instagram, Linkedin, Twitter, Youtube, Briefcase, ExternalLink, Globe, CreditCard, Link as LinkIcon, Brain, Upload, Trash2, FileText } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fileToBase64 } from "@/lib/utils/fileToBase64";
import Image from "next/image";

interface SettingsForm {
    name: string;
    email: string;
    profileImage?: FileList;
    socialLinks: {
        instagram: string;
        linkedin: string;
        twitter: string;
        youtube: string;
    };
    careersLink: string;
    sheetsWebhookUrl: string;
    paymentDetails: {
        upiId: string;
        upiQrCodeImage?: FileList;
        accountName: string;
        accountNumber: string;
        ifscCode: string;
        bankName: string;
    };
}

export default function AdminSettings() {
    const { register, handleSubmit, setValue, watch } = useForm<SettingsForm>({
        defaultValues: {
            socialLinks: {
                instagram: "",
                linkedin: "",
                twitter: "",
                youtube: ""
            },
            careersLink: "",
            sheetsWebhookUrl: "",
            paymentDetails: {
                upiId: "",
                accountName: "",
                accountNumber: "",
                ifscCode: "",
                bankName: "",
            }
        }
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [qrPreviewImage, setQrPreviewImage] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Knowledge Base state
    const [kbFileName, setKbFileName] = useState<string>('');
    const [kbTextLength, setKbTextLength] = useState(0);
    const [kbUploading, setKbUploading] = useState(false);
    const [kbStatus, setKbStatus] = useState<string>('');

    // Active Tab state
    const [activeTab, setActiveTab] = useState("account");

    // Watch for image changes to update preview
    const profileImageFile = watch("profileImage");
    const qrImageFile = watch("paymentDetails.upiQrCodeImage");

    useEffect(() => {
        if (profileImageFile && profileImageFile[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(profileImageFile[0]);
        }
    }, [profileImageFile]);

    useEffect(() => {
        if (qrImageFile && qrImageFile[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setQrPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(qrImageFile[0]);
        }
    }, [qrImageFile]);

    // Fetch existing settings
    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch("/api/admin/settings");
                if (res.ok) {
                    const data = await res.json();
                    if (data?.name) setValue("name", data.name);
                    if (data?.email) setValue("email", data.email);
                    if (data?.profileImage) setPreviewImage(data.profileImage);
                    if (data?.socialLinks) {
                        setValue("socialLinks.instagram", data.socialLinks.instagram || "");
                        setValue("socialLinks.linkedin", data.socialLinks.linkedin || "");
                        setValue("socialLinks.twitter", data.socialLinks.twitter || "");
                        setValue("socialLinks.youtube", data.socialLinks.youtube || "");
                    }
                    if (data?.careersLink) setValue("careersLink", data.careersLink);
                    if (data?.sheetsWebhookUrl) setValue("sheetsWebhookUrl", data.sheetsWebhookUrl);
                    if (data?.paymentDetails) {
                        setValue("paymentDetails.upiId", data.paymentDetails.upiId || "");
                        setValue("paymentDetails.accountName", data.paymentDetails.accountName || "");
                        setValue("paymentDetails.accountNumber", data.paymentDetails.accountNumber || "");
                        setValue("paymentDetails.ifscCode", data.paymentDetails.ifscCode || "");
                        setValue("paymentDetails.bankName", data.paymentDetails.bankName || "");
                        if (data.paymentDetails.upiQrCodeBase64) setQrPreviewImage(data.paymentDetails.upiQrCodeBase64);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch settings", e);
            } finally {
                setInitialLoading(false);
            }
        }
        fetchSettings();

        // Also fetch knowledge base info
        fetch('/api/admin/knowledge-base').then(r => r.json()).then(data => {
            if (data.fileName) setKbFileName(data.fileName);
            if (data.textLength) setKbTextLength(data.textLength);
        }).catch(() => { });
    }, [setValue]);

    const onSubmit = async (formData: SettingsForm) => {
        setLoading(true);
        setSaveStatus(null);
        try {
            let profileImageBase64 = previewImage;
            let qrCodeBase64 = qrPreviewImage;

            // If a new file was uploaded, convert it
            if (formData.profileImage && formData.profileImage[0]) {
                profileImageBase64 = await fileToBase64(formData.profileImage[0]);
            }
            if (formData.paymentDetails?.upiQrCodeImage && formData.paymentDetails.upiQrCodeImage[0]) {
                qrCodeBase64 = await fileToBase64(formData.paymentDetails.upiQrCodeImage[0]);
            }

            const payload = {
                name: formData.name,
                email: formData.email,
                profileImage: profileImageBase64,
                socialLinks: formData.socialLinks,
                careersLink: formData.careersLink,
                sheetsWebhookUrl: formData.sheetsWebhookUrl,
                paymentDetails: {
                    ...formData.paymentDetails,
                    upiQrCodeBase64: qrCodeBase64
                },
            };

            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Save failed");

            setSaveStatus({ type: 'success', message: 'Settings updated successfully!' });
            // Refresh the page or update global state if necessary
            window.location.reload(); // Refresh to update Topbar
        } catch (e) {
            console.error(e);
            setSaveStatus({ type: 'error', message: 'Failed to update settings. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-8">
            {loading && <LoadingSpinner />}

            <header className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-600 to-slate-900 dark:from-slate-200 dark:to-white tracking-tight">Portal Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-lg">
                        Manage your director account, social media handles, and careers portal links here.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Navigation */}
                <div className="space-y-2">
                    {[
                        { id: "account", name: "My Account", icon: User },
                        { id: "links", name: "Public Links", icon: Globe, badge: "Social & Careers" },
                        { id: "integrations", name: "Integrations & Payments", icon: CreditCard, badge: "New" },
                        { id: "ai", name: "AI Knowledge", icon: Brain },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.id
                                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <tab.icon className="w-4 h-4" />
                                {tab.name}
                            </div>
                            {tab.badge && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === tab.id ? 'bg-slate-700 dark:bg-slate-200 text-white dark:text-slate-900' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Right Column - Content Panel */}
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 space-y-6"
                >
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
                        {/* Status Message */}
                        {saveStatus && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${saveStatus.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}
                            >
                                {saveStatus.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                                <span className="text-sm font-medium">{saveStatus.message}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                            {/* Section: Director Profile (My Account) */}
                            {activeTab === "account" && (
                                <section className="space-y-6">
                                    <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                                        <User className="w-5 h-5 text-blue-500" />
                                        <h3 className="text-xl font-bold">Director Profile</h3>
                                    </div>
                                    <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                                        <div className="relative group">
                                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg border-2 border-white dark:border-slate-900 overflow-hidden relative">
                                                {previewImage ? (
                                                    <Image src={previewImage} alt="Profile" fill className="object-cover" />
                                                ) : (
                                                    <span>{watch("name")?.[0]?.toUpperCase() || "A"}</span>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                                    <Camera size={20} className="text-white" />
                                                </div>
                                                <input type="file" accept="image/*" id="profileImage" {...register("profileImage")} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">{watch("name") || "Admin"}</h4>
                                            <p className="text-slate-500 text-xs">{watch("email") || "director@pntacademy.com"}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                                            <input type="text" {...register("name", { required: true })} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                                            <input type="email" {...register("email", { required: true })} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Section: Public Links */}
                            {activeTab === "links" && (
                                <>
                                    <section className="space-y-6">
                                        <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                                            <Globe className="w-5 h-5 text-purple-500" />
                                            <h3 className="text-xl font-bold">Social Media Handles</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 ml-1">
                                                    <Instagram className="w-3 h-3 text-pink-500" /> Instagram URL
                                                </label>
                                                <input type="url" {...register("socialLinks.instagram")} placeholder="https://instagram.com/pntacademy" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 ml-1">
                                                    <Linkedin className="w-3 h-3 text-blue-600" /> LinkedIn URL
                                                </label>
                                                <input type="url" {...register("socialLinks.linkedin")} placeholder="https://linkedin.com/company/pntacademy" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 ml-1">
                                                    <Twitter className="w-3 h-3 text-black dark:text-white" /> X / Twitter URL
                                                </label>
                                                <input type="url" {...register("socialLinks.twitter")} placeholder="https://twitter.com/pntacademy" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900/50 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 ml-1">
                                                    <Youtube className="w-3 h-3 text-red-600" /> YouTube URL
                                                </label>
                                                <input type="url" {...register("socialLinks.youtube")} placeholder="https://youtube.com/c/pntacademy" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all" />
                                            </div>
                                        </div>
                                    </section>

                                    <section className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                                                <Briefcase className="w-5 h-5 text-emerald-500" />
                                                <h3 className="text-xl font-bold">Careers Portal</h3>
                                            </div>
                                            <a href="https://docs.google.com/forms" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 dark:bg-blue-500/10 px-3 py-2 rounded-lg">
                                                Create Google Form <ExternalLink size={12} />
                                            </a>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Careers Form URL (Redirects from Careers Button)</label>
                                            <input type="url" {...register("careersLink")} placeholder="https://forms.gle/your-careers-form" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
                                        </div>
                                    </section>
                                </>
                            )}

                            {/* Section: Integrations & Payments */}
                            {activeTab === "integrations" && (
                                <>
                                    <section className="space-y-6">
                                        <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                                            <LinkIcon className="w-5 h-5 text-indigo-500" />
                                            <h3 className="text-xl font-bold">Integrations</h3>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Google Sheets Webhook URL (For Enquiries Auto-Sync)</label>
                                            <input type="url" {...register("sheetsWebhookUrl")} placeholder="https://script.google.com/macros/s/..." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono text-sm" />
                                            <p className="text-xs text-slate-500 ml-1">Leave blank to disable auto-sync. Needs a Google Apps Script Web App URL.</p>
                                        </div>
                                    </section>

                                    <section className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                                            <CreditCard className="w-5 h-5 text-amber-500" />
                                            <h3 className="text-xl font-bold">Payment Details</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">UPI ID (e.g., pratik@upi or phone number)</label>
                                                <input type="text" {...register("paymentDetails.upiId")} placeholder="yourid@upi" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center justify-between">
                                                    <span>Custom UPI QR Code Image</span>
                                                    {qrPreviewImage && <span className="text-emerald-500 font-normal">Uploaded</span>}
                                                </label>
                                                <div className="flex items-center gap-4">
                                                    {qrPreviewImage && (
                                                        <div className="w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden relative bg-white shrink-0">
                                                            <Image src={qrPreviewImage} alt="QR Preview" fill className="object-contain p-1" />
                                                        </div>
                                                    )}
                                                    <input type="file" accept="image/*" {...register("paymentDetails.upiQrCodeImage")} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 dark:file:bg-amber-500/10 dark:file:text-amber-400 dark:hover:file:bg-amber-500/20" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Account Holder Name</label>
                                                <input type="text" {...register("paymentDetails.accountName")} placeholder="e.g., PNT Academy" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Bank Name</label>
                                                <input type="text" {...register("paymentDetails.bankName")} placeholder="e.g., HDFC Bank" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Account Number</label>
                                                <input type="text" {...register("paymentDetails.accountNumber")} placeholder="e.g., 50100XXXXXXX" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">IFSC Code</label>
                                                <input type="text" {...register("paymentDetails.ifscCode")} placeholder="e.g., HDFC0001234" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all uppercase" />
                                            </div>
                                        </div>
                                    </section>
                                </>
                            )}

                            {/* Section: AI Knowledge Base */}
                            {activeTab === "ai" && (
                                <section className="space-y-6">
                                    <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                                        <Brain className="w-5 h-5 text-violet-500" />
                                        <h3 className="text-xl font-bold">AI Knowledge Base</h3>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 font-bold">NEW</span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Upload a company document (.txt or .docx) to make the AI chatbot smarter. It will use this information to answer visitor questions about PNT Academy.
                                    </p>

                                    {kbFileName && (
                                        <div className="flex items-center justify-between p-4 bg-violet-50 dark:bg-violet-500/10 rounded-xl border border-violet-100 dark:border-violet-500/20">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-5 h-5 text-violet-500" />
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{kbFileName}</p>
                                                    <p className="text-xs text-slate-500">{(kbTextLength / 1000).toFixed(1)}KB of knowledge loaded</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    if (!confirm('Remove the knowledge base? The AI will lose this context.')) return;
                                                    await fetch('/api/admin/knowledge-base', { method: 'DELETE' });
                                                    setKbFileName('');
                                                    setKbTextLength(0);
                                                    setKbStatus('Knowledge base removed.');
                                                }}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Upload Company Document (.txt)</label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="file"
                                                accept=".txt,text/plain"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    setKbUploading(true);
                                                    setKbStatus('Reading file...');
                                                    try {
                                                        const text = await file.text();
                                                        if (!text.trim()) throw new Error('File is empty');

                                                        setKbStatus('Uploading to knowledge base...');
                                                        const res = await fetch('/api/admin/knowledge-base', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ knowledgeBaseText: text, knowledgeBaseFileName: file.name }),
                                                        });
                                                        if (!res.ok) {
                                                            const err = await res.json();
                                                            throw new Error(err.error || 'Upload failed');
                                                        }
                                                        const result = await res.json();
                                                        setKbFileName(result.fileName);
                                                        setKbTextLength(result.textLength);
                                                        setKbStatus('✅ Knowledge base updated successfully!');
                                                    } catch (err: any) {
                                                        setKbStatus(`❌ Error: ${err.message}`);
                                                    } finally {
                                                        setKbUploading(false);
                                                    }
                                                }}
                                                disabled={kbUploading}
                                                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-500/10 dark:file:text-violet-400 dark:hover:file:bg-violet-500/20 disabled:opacity-50"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400 ml-1">💡 Tip: If you have a .docx file, open it in Google Docs or Word and save as .txt first.</p>
                                        {kbStatus && (
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 ml-1">{kbUploading ? '⏳ ' : ''}{kbStatus}</p>
                                        )}
                                    </div>
                                </section>
                            )}

                            <div className="pt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                <button type="button" onClick={() => window.location.reload()} className="px-6 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm">Discard</button>
                                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading} className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all text-sm disabled:opacity-70">
                                    {loading ? "Saving Changes..." : "Save All Settings"}
                                </motion.button>
                            </div>
                        </form>
                    </div>

                    {/* Security Tip Card */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-2xl backdrop-blur-md">
                                <SettingsIcon className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">Public Settings Sync</h3>
                                <p className="text-slate-400 text-sm">Updates to social links and careers URLs take effect instantly across the PNT Academy website footer and contact pages.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
