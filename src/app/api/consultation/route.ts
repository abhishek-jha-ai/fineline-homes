import { NextResponse } from "next/server";
import { validateContact, type ConsultationLead } from "@/lib/consultation";

/**
 * Consultation lead intake.
 *
 * Validates the lead, then forwards it to every destination configured via
 * environment variables (see src/config/consultation.ts for the full list).
 * With nothing configured it simply acknowledges the lead — the demo mode.
 */

function isLead(body: unknown): body is ConsultationLead {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return ["name", "email", "phone", "zip"].every((k) => typeof b[k] === "string");
}

async function postJson(url: string, data: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
}

function toHubSpot(lead: ConsultationLead) {
  const [firstname, ...rest] = lead.name.trim().split(/\s+/);
  return {
    fields: [
      { name: "firstname", value: firstname },
      { name: "lastname", value: rest.join(" ") },
      { name: "email", value: lead.email },
      { name: "phone", value: lead.phone },
      { name: "zip", value: lead.zip },
      {
        name: "message",
        value: [
          `Region: ${lead.region ?? "—"}`,
          `Looking for: ${lead.intent ?? "—"}`,
          `Bedrooms: ${lead.bedrooms ?? "—"} · Bathrooms: ${lead.bathrooms ?? "—"} · Size: ${lead.size ?? "—"}`,
          lead.planId ? `Plan of interest: ${lead.planId}` : null,
          lead.message ? `Message: ${lead.message}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      },
    ],
    context: { pageUri: lead.attribution?.referrer, pageName: "Consultation request" },
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!isLead(body)) {
    return NextResponse.json({ ok: false, error: "Missing contact details." }, { status: 400 });
  }

  const errors = validateContact(body);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const lead: ConsultationLead = {
    ...body,
    message: String(body.message ?? "").slice(0, 2000),
    submittedAt: new Date().toISOString(),
  };

  const tasks: Promise<void>[] = [];
  const env = process.env;

  if (env.CONSULTATION_WEBHOOK_URL) tasks.push(postJson(env.CONSULTATION_WEBHOOK_URL, lead));
  if (env.GHL_WEBHOOK_URL) tasks.push(postJson(env.GHL_WEBHOOK_URL, lead));
  if (env.LEAD_NOTIFY_WEBHOOK_URL) tasks.push(postJson(env.LEAD_NOTIFY_WEBHOOK_URL, lead));
  if (env.HUBSPOT_PORTAL_ID && env.HUBSPOT_FORM_GUID) {
    tasks.push(
      postJson(
        `https://api.hsforms.com/submissions/v3/integration/submit/${env.HUBSPOT_PORTAL_ID}/${env.HUBSPOT_FORM_GUID}`,
        toHubSpot(lead),
      ),
    );
  }

  if (tasks.length) {
    const results = await Promise.allSettled(tasks);
    const failures = results.filter((r) => r.status === "rejected");
    failures.forEach((f) => console.error("[consultation] delivery failed:", (f as PromiseRejectedResult).reason));
    // Only fail the request if every destination failed.
    if (failures.length === tasks.length) {
      return NextResponse.json({ ok: false, error: "We couldn't send your request. Please try again." }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true, mode: tasks.length ? "delivered" : "demo" });
}
