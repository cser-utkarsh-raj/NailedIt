import React, { useState } from 'react';
import { X, Shield, FileText, Info, Mail, Sparkles, CheckCircle2 } from 'lucide-react';

function DotLogo({ size = 42 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220" width={size} height={size * 1.1} fill="none" aria-hidden="true">
      <path d="M40 70 L160 70 L160 160 L100 190 L40 160 Z" fill="#E6E0F8" stroke="#1E1E24" strokeWidth="8" strokeLinejoin="round" />
      <path d="M55 85 L145 85 L145 150 L100 172 L55 150 Z" fill="#20B2AA" stroke="#1E1E24" strokeWidth="6" strokeLinejoin="round" />
      <path d="M100 25 L108 50 L135 45 L120 65 L145 75 L115 85 L100 110 L85 85 L55 75 L80 65 L65 45 L92 50 Z" fill="#20B2AA" stroke="#1E1E24" strokeWidth="6" strokeLinejoin="round" />
      <path d="M100 45 L105 60 L120 58 L110 70 L125 78 L105 85 L100 100 L95 85 L75 78 L90 70 L80 58 L95 60 Z" fill="#FFFFFF" />
      <path d="M140 100 Q160 80 170 90 L165 110 Z" fill="#9F7FF7" stroke="#1E1E24" strokeWidth="6" strokeLinejoin="round" />
      <path d="M165 85 C175 75, 185 85, 175 95 C185 95, 185 105, 175 105 C180 115, 170 120, 160 110 Z" fill="#9F7FF7" stroke="#1E1E24" strokeWidth="6" strokeLinejoin="round" />
      <path d="M60 110 Q40 130 45 150 L65 140 Z" fill="#9F7FF7" stroke="#1E1E24" strokeWidth="6" strokeLinejoin="round" />
      <path d="M35 145 C25 155, 35 165, 45 165 C45 175, 55 175, 60 165 C70 170, 75 160, 65 150 Z" fill="#9F7FF7" stroke="#1E1E24" strokeWidth="6" strokeLinejoin="round" />
      <path d="M80 165 L75 190 L95 190 L90 165 Z" fill="#9F7FF7" stroke="#1E1E24" strokeWidth="6" strokeLinejoin="round" />
      <path d="M120 165 L125 190 L105 190 L110 165 Z" fill="#9F7FF7" stroke="#1E1E24" strokeWidth="6" strokeLinejoin="round" />
      <path d="M70 190 L95 190 L95 200 L65 200 Z" fill="#9F7FF7" stroke="#1E1E24" strokeWidth="6" strokeLinejoin="round" />
      <path d="M105 190 L130 190 L135 200 L105 200 Z" fill="#9F7FF7" stroke="#1E1E24" strokeWidth="6" strokeLinejoin="round" />
      <circle cx="100" cy="115" r="45" fill="#20B2AA" stroke="#1E1E24" strokeWidth="8" />
      <circle cx="85" cy="110" r="5" fill="#1E1E24" /><circle cx="115" cy="110" r="5" fill="#1E1E24" />
      <circle cx="83" cy="108" r="1.5" fill="#FFFFFF" /><circle cx="113" cy="108" r="1.5" fill="#FFFFFF" />
      <path d="M95 118 Q100 125 105 118" fill="none" stroke="#1E1E24" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

type ModalType = 'about' | 'privacy' | 'terms' | 'contact' | null;

export function DotFooter() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactMessage.trim()) {
      setContactSubmitted(true);
      setTimeout(() => {
        setContactMessage('');
      }, 2000);
    }
  };

  return (
    <>
      <footer className="shrink-0 border-t border-slate-200/90 bg-white/95 backdrop-blur-sm px-4 sm:px-6 py-2.5 grid grid-cols-1 md:grid-cols-3 items-center justify-between gap-2.5 text-slate-500 text-xs shadow-2xs">
        {/* Left: Copyright */}
        <div className="flex items-center justify-center md:justify-start gap-2 order-2 md:order-1">
          <span className="font-semibold text-slate-700">NailedIt</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">© 2026 All rights reserved.</span>
        </div>

        {/* Center: Presented by .dot (Prominently in the middle) */}
        <div className="flex items-center justify-center gap-2 order-1 md:order-2">
          <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-slate-400">Presented by</span>
          <span className="flex items-center gap-1.5 text-[13px] font-black tracking-tight text-[#1E1E24]">
            <DotLogo size={22} />
            <span>.dot</span>
          </span>
        </div>

        {/* Right: Legal & Info Links */}
        <nav className="flex items-center justify-center md:justify-end gap-4 sm:gap-5 text-[11px] font-medium text-slate-600 order-3">
          <button
            type="button"
            onClick={() => { setActiveModal('about'); setContactSubmitted(false); }}
            className="hover:text-indigo-600 transition-colors cursor-pointer"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => { setActiveModal('privacy'); setContactSubmitted(false); }}
            className="hover:text-indigo-600 transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => { setActiveModal('terms'); setContactSubmitted(false); }}
            className="hover:text-indigo-600 transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            type="button"
            onClick={() => { setActiveModal('contact'); setContactSubmitted(false); }}
            className="hover:text-indigo-600 transition-colors cursor-pointer"
          >
            Contact
          </button>
        </nav>
      </footer>

      {/* Info / Legal Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                {activeModal === 'about' && <Info className="w-5 h-5 text-indigo-600" />}
                {activeModal === 'privacy' && <Shield className="w-5 h-5 text-emerald-600" />}
                {activeModal === 'terms' && <FileText className="w-5 h-5 text-blue-600" />}
                {activeModal === 'contact' && <Mail className="w-5 h-5 text-amber-600" />}
                
                <h3 className="font-bold text-base text-slate-900 capitalize">
                  {activeModal === 'about' && 'About NailedIt'}
                  {activeModal === 'privacy' && 'Privacy Policy'}
                  {activeModal === 'terms' && 'Terms of Service'}
                  {activeModal === 'contact' && 'Contact & Support'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-600 leading-relaxed">
              {activeModal === 'about' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-indigo-50/80 rounded-xl border border-indigo-100 text-indigo-900 text-xs font-medium">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Browser-native thumbnail design engine with 6 bespoke archetypes.</span>
                  </div>
                  <p>
                    <strong>NailedIt</strong> is a focused, high-precision thumbnail studio engineered for content creators, developers, and writers. It empowers you to craft click-worthy graphics for YouTube, blog headers, Open Graph previews, and vertical reels directly in the browser.
                  </p>
                  <p>
                    Built with high-DPI HTML5 Canvas rasterization, independent layer transformations, and zero external rendering latency.
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Version 2.4.0</span>
                    <span>An independent product under <strong>.dot</strong></span>
                  </div>
                </div>
              )}

              {activeModal === 'privacy' && (
                <div className="space-y-3">
                  <p className="font-semibold text-slate-800">Your data never leaves your device.</p>
                  <p>
                    NailedIt operates 100% locally on your client browser. We do not store, track, collect, or transmit any images, text, logos, or generated graphics to external servers.
                  </p>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>No Server Uploads:</strong> Photos and logos remain in local memory.</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>No Tracking Cookies:</strong> No behavioral tracking or third-party ad networks.</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Instant Local Exports:</strong> All PNG, WebP, and clipboard transfers occur in-memory.</span>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'terms' && (
                <div className="space-y-3">
                  <p className="font-semibold text-slate-800">100% Commercial & Personal Ownership</p>
                  <p>
                    All thumbnails, cards, and promotional graphics created using NailedIt are unconditionally owned by you. You have full commercial and personal distribution rights to export, modify, monetize, and publish your creations across YouTube, social platforms, and client work.
                  </p>
                  <p className="text-xs text-slate-500">
                    No attribution is required for exported artworks.
                  </p>
                </div>
              )}

              {activeModal === 'contact' && (
                <div className="space-y-4">
                  <p>
                    Have questions, suggestions, or template requests? Send a message directly to our product team.
                  </p>

                  {contactSubmitted ? (
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-center space-y-1">
                      <div className="flex items-center justify-center gap-1.5 font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Message Sent!
                      </div>
                      <p className="text-xs text-emerald-600">Thank you for your feedback. We'll be in touch soon.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Your Feedback or Request</label>
                        <textarea
                          rows={3}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Tell us what features or templates you'd like to see next..."
                          className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-none"
                          required
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-xs cursor-pointer"
                        >
                          Submit Note
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                    <span>Direct Inquiries: <strong className="text-slate-700">support@dot.app</strong></span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
