import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, CheckCircle, AlertCircle, Loader2,
  Mail, User, MessageSquare, Sparkles
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { trackEvent } from "../lib/analytics";

// ---------------- Types ----------------
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string; // honeypot
}
interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const SUBJECT_SUGGESTIONS = [
  "Graduate Software Engineer Opportunity",
  "Interview Availability",
  "Collaboration / Side Project",
  "General Enquiry"
];

const MESSAGE_MAX = 1000;

export function ContactForm() {
  // ------------- State -------------
  const [formData, setFormData] = useState<FormData>({
    name: "", email: "", subject: "", message: "", website: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);

  // ------------- Helpers -------------
  const setField =
    (name: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = name === "message"
        ? e.target.value.slice(0, MESSAGE_MAX)
        : e.target.value;
      setFormData((s) => ({ ...s, [name]: value }));
      if (errors[name as keyof FormErrors]) {
        setErrors((p) => ({ ...p, [name]: undefined }));
      }
    };

  function validate(): boolean {
    const next: FormErrors = {};
    if (!formData.name.trim()) next.name = "Name is required.";
    else if (formData.name.trim().length < 2) next.name = "At least 2 characters.";

    if (!formData.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      next.email = "Enter a valid email.";

    if (!formData.subject.trim()) next.subject = "Subject is required.";
    else if (formData.subject.trim().length < 5) next.subject = "At least 5 characters.";

    if (!formData.message.trim()) next.message = "Message is required.";
    else if (formData.message.trim().length < 10) next.message = "At least 10 characters.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // fake progress animation while submitting (premium feel)
  useEffect(() => {
    if (!isSubmitting) { setProgress(0); return; }
    let v = 0;
    const id = setInterval(() => {
      v = Math.min(98, v + Math.random() * 12);
      setProgress(v);
    }, 120);
    return () => clearInterval(id);
  }, [isSubmitting]);

  // ------------- Submit -------------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // Honeypot: if bots fill this, abort silently
    if (formData.website && formData.website.trim().length > 0) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await addDoc(collection(db, "messages"), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });

      // Track form submission
      try {
        await trackEvent({
          type: 'contact_form_submit',
          metadata: {
            subject: formData.subject.trim(),
            name: formData.name.trim()
          }
        });
      } catch (error) {
        console.log('Analytics tracking disabled - form submission not tracked');
      }

      setProgress(100);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "", website: "" });

      // auto-hide after 6s
      setTimeout(() => setSubmitStatus("idle"), 6000);
    } catch (err) {
      console.error("Error sending message:", err);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 6000);
    } finally {
      setIsSubmitting(false);
    }
  }

  // ------------- UI -------------
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Glow background */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-brand/15 via-fuchsia-500/10 to-cyan-400/10 blur-2xl" />
      {/* Card */}
      <div className="relative card border-white/10 bg-white/75 dark:bg-white/5 p-6 md:p-8 rounded-3xl">
        {/* Top progress strip */}
        <div className="h-1 w-full rounded-full bg-neutral-200/50 dark:bg-white/10 overflow-hidden mb-6">
          <motion.div
            className="h-full bg-gradient-to-r from-brand via-fuchsia-500 to-cyan-400"
            animate={{ width: isSubmitting ? `${progress}%` : "0%" }}
            transition={{ ease: "easeOut", duration: 0.2 }}
            style={{ width: 0 }}
          />
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-fuchsia-500 grid place-items-center shadow-soft">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h3 className="mt-4 text-2xl font-extrabold tracking-tight">
            Let’s build something great
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            I usually reply within 24 hours.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* honeypot */}
          <input
            type="text"
            name="website"
            autoComplete="off"
            tabIndex={-1}
            value={formData.website}
            onChange={setField("website")}
            className="hidden"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatInput
              id="name"
              label="Full Name *"
              icon={<User className="w-4 h-4" />}
              value={formData.name}
              onChange={setField("name")}
              error={errors.name}
              autoComplete="name"
            />
            <FloatInput
              id="email"
              label="Email Address *"
              icon={<Mail className="w-4 h-4" />}
              type="email"
              value={formData.email}
              onChange={setField("email")}
              error={errors.email}
              autoComplete="email"
            />
          </div>

          {/* Subject with chips */}
          <div className="space-y-2">
            <FloatInput
              id="subject"
              label="Subject *"
              value={formData.subject}
              onChange={setField("subject")}
              error={errors.subject}
            />
            <div className="flex flex-wrap gap-2">
              {SUBJECT_SUGGESTIONS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setFormData((p) => ({ ...p, subject: s }))}
                  className="text-xs px-2.5 py-1 rounded-full border border-white/10 bg-white/70 dark:bg-white/5 hover:bg-neutral-100/70 dark:hover:bg-white/10 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Message + counter */}
          <FloatTextarea
            id="message"
            label="Message *"
            value={formData.message}
            onChange={setField("message")}
            error={errors.message}
            rows={7}
            icon={<MessageSquare className="w-4 h-4" />}
            footer={
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Be as detailed as you like.</span>
                <span>{formData.message.length}/{MESSAGE_MAX}</span>
              </div>
            }
          />

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.015 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.985 }}
            className={`
              w-full py-3.5 px-6 rounded-2xl font-semibold tracking-wide
              text-white dark:text-neutral-900
              bg-neutral-900 dark:bg-white
              focus-ring transition shadow-soft
              ${isSubmitting ? "opacity-80 cursor-not-allowed" : "hover:opacity-95"}
            `}
          >
            <div className="flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </div>
          </motion.button>
        </form>

        {/* Status */}
        <AnimatePresence mode="popLayout">
          {submitStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="mt-5 p-4 rounded-2xl border border-emerald-200/70 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-900/20"
              role="status" aria-live="polite"
            >
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Message sent successfully!</span>
              </div>
              <p className="text-xs mt-1 text-emerald-700/90 dark:text-emerald-300/90">
                Thanks for reaching out — I’ll get back to you shortly.
              </p>
            </motion.div>
          )}

          {submitStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="mt-5 p-4 rounded-2xl border border-red-200/70 dark:border-red-800/60 bg-red-50/70 dark:bg-red-900/20"
              role="alert" aria-live="assertive"
            >
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Couldn’t send your message.</span>
              </div>
              <p className="text-xs mt-1 text-red-700/90 dark:text-red-300/90">
                Please try again later or email me directly.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ----------- Floating Inputs ----------- */
function FloatInput({
  id, label, value, onChange, error, icon, type = "text", autoComplete
}: {
  id: string; label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string; icon?: React.ReactNode;
  type?: string; autoComplete?: string;
}) {
  return (
    <div className="relative">
      <div className={cnInput(error)}>
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70">{icon}</span>}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder=" "
          className="peer w-full bg-transparent outline-none px-10 py-3 text-sm"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-sm text-neutral-500 transition-all
                     peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm
                     peer-focus:top-2 peer-focus:text-xs
                     peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-xs"
        >
          {label}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

function FloatTextarea({
  id, label, value, onChange, error, rows = 6, icon, footer
}: {
  id: string; label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string; rows?: number; icon?: React.ReactNode; footer?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className={cnInput(error)}>
        {icon && <span className="absolute left-3 top-3 opacity-70">{icon}</span>}
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder=" "
          rows={rows}
          className="peer w-full bg-transparent outline-none px-10 py-3 text-sm resize-y"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-10 top-3 text-sm text-neutral-500 transition-all
                     peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                     peer-focus:top-1 peer-focus:text-xs
                     peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-xs"
        >
          {label}
        </label>
      </div>
      {footer}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

/* -------------- Styles -------------- */
function cnInput(error?: string) {
  return [
    "relative rounded-2xl border transition focus-within:ring-2",
    "bg-white/70 dark:bg-white/5 backdrop-blur",
    error
      ? "border-red-300 dark:border-red-600 focus-within:ring-red-400/30"
      : "border-neutral-300/70 dark:border-white/10 focus-within:ring-brand/25 focus-within:border-brand/60"
  ].join(" ");
}
