"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { consultationConfig } from "@/config/consultation";
import { siteConfig, telHref } from "@/config/site";
import { regions, getRegion, type RegionId } from "@/data/regions";
import { plans } from "@/data/plans";
import { captureAttribution, formatPhone, validateContact, type ConsultationLead, type ValidationErrors } from "@/lib/consultation";
import { trackEvent, trackEventOnce } from "@/lib/analytics";
import { useSite } from "./SiteProvider";
import { ArrowLeft, ArrowRight, Check, Close, MapPin, Phone } from "./icons";
import { cn } from "@/lib/cn";

const STEPS = ["Location", "Goals", "Preferences", "Contact"] as const;

interface FormState {
  intent: string | null;
  bedrooms: string | null;
  bathrooms: string | null;
  size: string | null;
  name: string;
  email: string;
  phone: string;
  zip: string;
  message: string;
}

const initialForm: FormState = {
  intent: null,
  bedrooms: null,
  bathrooms: null,
  size: null,
  name: "",
  email: "",
  phone: "",
  zip: "",
  message: "",
};

function OptionButton({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "flex min-h-14 w-full items-center justify-between gap-3 rounded-sm border px-4 py-3 text-left text-[15px] font-medium transition-colors",
        selected ? "border-charcoal bg-charcoal text-cream" : "border-line bg-white hover:border-charcoal",
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
          selected ? "border-accent bg-accent text-white" : "border-line text-transparent",
        )}
      >
        <Check size={14} />
      </span>
    </button>
  );
}

function ChipRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly (string | { id: string; label: string })[];
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const id = `wiz-${label.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <div role="radiogroup" aria-labelledby={id}>
      <p id={id} className="mb-2.5 text-sm font-semibold">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const v = typeof o === "string" ? o : o.id;
          const l = typeof o === "string" ? o : o.label;
          return (
            <button key={v} type="button" role="radio" aria-checked={value === v} onClick={() => onChange(value === v ? null : v)} className="chip">
              {l}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label} {optional && <span className="font-normal text-stone">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-[#b42318]">
          {error}
        </p>
      )}
    </div>
  );
}

export function ConsultationWizard() {
  const { region, selectRegion, interestedPlanId: planId, setInterestedPlanId: setPlanId } = useSite();
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const didMount = useRef(false);

  // Move focus to the step heading whenever the step changes (not on first render).
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    if (status === "success") {
      document.getElementById("contact")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }, [step, status, reduce]);

  const plan = plans.find((p) => p.id === planId) ?? null;
  const activeRegion = getRegion(region);

  const touch = () => trackEventOnce("consultation_started", { source: "wizard" });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    touch();
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const chooseRegion = (id: RegionId) => {
    touch();
    selectRegion(id, "consultation_wizard");
    window.setTimeout(next, reduce ? 0 : 180);
  };

  const chooseIntent = (id: string) => {
    set("intent", id);
    window.setTimeout(next, reduce ? 0 : 180);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = validateContact(form);
    setErrors(v);
    if (Object.keys(v).length) {
      document.getElementById(`wiz-${Object.keys(v)[0]}`)?.focus();
      return;
    }

    setStatus("submitting");
    setServerError(null);
    const lead: ConsultationLead = {
      region,
      intent: form.intent,
      bedrooms: form.bedrooms,
      bathrooms: form.bathrooms,
      size: form.size,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone,
      zip: form.zip.trim(),
      message: form.message.trim(),
      planId,
      attribution: captureAttribution(),
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(consultationConfig.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.error ?? "Something went wrong.");
      }
      setStatus("success");
      trackEvent("consultation_submitted", {
        region: region ?? "unspecified",
        intent: form.intent ?? "unspecified",
        plan_id: planId ?? undefined,
      });
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  const resetAll = () => {
    setForm(initialForm);
    setPlanId(null);
    setStep(0);
    setStatus("idle");
  };

  const intentLabel = consultationConfig.intents.find((i) => i.id === form.intent)?.label;

  const stepVariants = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, x: 16 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -16 } };

  if (status === "success") {
    return (
      <div className="rounded-sm bg-cream p-6 text-charcoal shadow-2xl sm:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white">
          <Check size={28} />
        </div>
        <h3 ref={headingRef} tabIndex={-1} className="mt-6 font-serif text-3xl outline-none">
          You&apos;re all set, {form.name.split(" ")[0]}.
        </h3>
        <p className="mt-3 leading-relaxed text-stone">{consultationConfig.successMessage}</p>
        <dl className="mt-6 space-y-2 rounded-sm border border-line bg-white p-5 text-sm">
          {activeRegion && (
            <div className="flex justify-between gap-4">
              <dt className="text-stone">Region</dt>
              <dd className="text-right font-medium">{activeRegion.name}</dd>
            </div>
          )}
          {intentLabel && (
            <div className="flex justify-between gap-4">
              <dt className="text-stone">Looking to</dt>
              <dd className="text-right font-medium">{intentLabel}</dd>
            </div>
          )}
          {plan && (
            <div className="flex justify-between gap-4">
              <dt className="text-stone">Plan of interest</dt>
              <dd className="text-right font-medium">{plan.name}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <dt className="text-stone">We&apos;ll reach you at</dt>
            <dd className="text-right font-medium break-all">{form.email}</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {consultationConfig.schedulingUrl && (
            <a href={consultationConfig.schedulingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Pick a Time Now <ArrowRight size={16} />
            </a>
          )}
          <a href="#plans" className="btn btn-outline-dark">
            Keep Exploring Plans
          </a>
          <button type="button" onClick={resetAll} className="btn text-stone underline-offset-4 hover:underline">
            Start a new request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm bg-cream text-charcoal shadow-2xl">
      {/* Progress */}
      <div className="border-b border-line px-5 pt-5 pb-4 sm:px-8 sm:pt-7">
        <div className="flex items-center justify-between text-xs font-semibold tracking-[0.14em] text-stone uppercase">
          <span>
            Step {step + 1} of {STEPS.length}
          </span>
          <span>{STEPS[step]}</span>
        </div>
        <div
          className="mt-3 grid grid-cols-4 gap-1.5"
          role="progressbar"
          aria-label="Consultation progress"
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={step + 1}
        >
          {STEPS.map((s, i) => (
            <span key={s} className={cn("h-1 rounded-full transition-colors duration-300", i <= step ? "bg-accent" : "bg-line")} />
          ))}
        </div>
      </div>

      {plan && (
        <div className="flex items-center justify-between gap-3 border-b border-line bg-sand px-5 py-3 text-sm sm:px-8">
          <p>
            Asking about <span className="font-semibold">{plan.name}</span>
          </p>
          <button type="button" onClick={() => setPlanId(null)} className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-sand-dark" aria-label={`Remove ${plan.name}`}>
            <Close size={16} />
          </button>
        </div>
      )}

      <form onSubmit={submit} noValidate className="px-5 py-6 sm:px-8 sm:py-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} {...stepVariants} transition={{ duration: 0.22 }}>
            {step === 0 && (
              <fieldset>
                <legend className="contents">
                  <h3 ref={headingRef} tabIndex={-1} data-wizard-focus className="font-serif text-2xl outline-none sm:text-[1.75rem]">
                    Where are you looking to build?
                  </h3>
                </legend>
                <div role="radiogroup" aria-label="Region" className="mt-6 grid gap-3">
                  {regions.map((r) => (
                    <OptionButton key={r.id} selected={region === r.id} onClick={() => chooseRegion(r.id)}>
                      <span className="flex items-center gap-3">
                        <MapPin size={18} className={region === r.id ? "text-accent-soft" : "text-accent-ink"} />
                        {r.id === "nc" ? "North Carolina — Triad" : r.name}
                      </span>
                    </OptionButton>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <fieldset>
                <legend className="contents">
                  <h3 ref={headingRef} tabIndex={-1} className="font-serif text-2xl outline-none sm:text-[1.75rem]">
                    What are you looking for?
                  </h3>
                </legend>
                <div role="radiogroup" aria-label="What are you looking for" className="mt-6 grid gap-3">
                  {consultationConfig.intents.map((i) => (
                    <OptionButton key={i.id} selected={form.intent === i.id} onClick={() => chooseIntent(i.id)}>
                      {i.label}
                    </OptionButton>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <div>
                <h3 ref={headingRef} tabIndex={-1} className="font-serif text-2xl outline-none sm:text-[1.75rem]">
                  Home preferences
                </h3>
                <p className="mt-2 text-sm text-stone">Rough ideas are perfect — you can change everything later.</p>
                <div className="mt-6 space-y-6">
                  <ChipRow label="Bedrooms" options={consultationConfig.bedrooms} value={form.bedrooms} onChange={(v) => set("bedrooms", v)} />
                  <ChipRow label="Bathrooms" options={consultationConfig.bathrooms} value={form.bathrooms} onChange={(v) => set("bathrooms", v)} />
                  <ChipRow label="Approximate size" options={consultationConfig.sizes} value={form.size} onChange={(v) => set("size", v)} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 ref={headingRef} tabIndex={-1} className="font-serif text-2xl outline-none sm:text-[1.75rem]">
                  How can we reach you?
                </h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field id="wiz-name" label="Full name" error={errors.name}>
                      <input
                        id="wiz-name"
                        className="field"
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "wiz-name-error" : undefined}
                        required
                      />
                    </Field>
                  </div>
                  <Field id="wiz-email" label="Email" error={errors.email}>
                    <input
                      id="wiz-email"
                      type="email"
                      inputMode="email"
                      className="field"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "wiz-email-error" : undefined}
                      required
                    />
                  </Field>
                  <Field id="wiz-phone" label="Phone" error={errors.phone}>
                    <input
                      id="wiz-phone"
                      type="tel"
                      inputMode="tel"
                      className="field"
                      autoComplete="tel-national"
                      value={form.phone}
                      onChange={(e) => set("phone", formatPhone(e.target.value))}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "wiz-phone-error" : undefined}
                      required
                    />
                  </Field>
                  <Field id="wiz-zip" label="ZIP code" error={errors.zip}>
                    <input
                      id="wiz-zip"
                      inputMode="numeric"
                      className="field"
                      autoComplete="postal-code"
                      maxLength={10}
                      value={form.zip}
                      onChange={(e) => set("zip", e.target.value.replace(/[^\d-]/g, ""))}
                      aria-invalid={!!errors.zip}
                      aria-describedby={errors.zip ? "wiz-zip-error" : undefined}
                      required
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field id="wiz-message" label="Anything else we should know?" optional>
                      <textarea
                        id="wiz-message"
                        rows={3}
                        className="field resize-y"
                        value={form.message}
                        onChange={(e) => set("message", e.target.value)}
                        placeholder="Timeline, land, must-haves…"
                      />
                    </Field>
                  </div>
                </div>
                {status === "error" && serverError && (
                  <p role="alert" className="mt-4 rounded-sm border border-[#b42318]/30 bg-[#b42318]/5 px-4 py-3 text-sm text-[#b42318]">
                    {serverError}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button type="button" onClick={back} className="btn -ml-3 px-3 text-stone hover:text-charcoal">
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <span />
          )}

          {step === 0 && (
            <button type="button" onClick={next} disabled={!region} className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-40">
              Continue <ArrowRight size={16} />
            </button>
          )}
          {step === 1 && (
            <button type="button" onClick={next} disabled={!form.intent} className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-40">
              Continue <ArrowRight size={16} />
            </button>
          )}
          {step === 2 && (
            <button type="button" onClick={next} className="btn btn-primary">
              {form.bedrooms || form.bathrooms || form.size ? "Continue" : "Skip for now"} <ArrowRight size={16} />
            </button>
          )}
          {step === 3 && (
            <button type="submit" disabled={status === "submitting"} className="btn btn-primary disabled:opacity-60">
              {status === "submitting" ? "Sending…" : "Schedule My Consultation"} {status !== "submitting" && <ArrowRight size={16} />}
            </button>
          )}
        </div>

        {step === 3 && (
          <p className="mt-5 text-xs leading-relaxed text-stone">
            By submitting, you agree to be contacted by Fine Line Homes about your request.
          </p>
        )}
      </form>

      {siteConfig.contact.phone && (
        <div className="border-t border-line px-5 py-4 text-sm sm:px-8">
          Prefer to talk now?{" "}
          <a
            href={telHref(siteConfig.contact.phone)}
            onClick={() => trackEvent("phone_clicked", { source: "wizard" })}
            className="inline-flex items-center gap-1.5 font-semibold text-accent-ink"
          >
            <Phone size={14} /> {siteConfig.contact.phone}
          </a>
        </div>
      )}
    </div>
  );
}
