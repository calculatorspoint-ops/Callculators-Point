'use client';
import React, { useEffect, Suspense } from "react";
import { CalculatorConfig } from "@/data/calculatorConfigs";
import { useAppStore } from "@/store/useAppStore";

import { financeForms } from "./registries/financeForms";
import { healthForms } from "./registries/healthForms";
import { mathForms } from "./registries/mathForms";
import { educationForms } from "./registries/educationForms";
import { utilityForms } from "./registries/utilityForms";
import { constructionForms } from "./registries/constructionForms";
import { techForms } from "./registries/techForms";
import { businessForms } from "./registries/businessForms";

type FormsRegistry = Record<string, React.LazyExoticComponent<React.ComponentType<any>>>;

export const FORMS: FormsRegistry = {
  ...financeForms,
  ...healthForms,
  ...mathForms,
  ...educationForms,
  ...utilityForms,
  ...constructionForms,
  ...techForms,
  ...businessForms,
};

/**
 * StaticFormPlaceholder — SSR-visible semantic skeleton shown while the
 * lazy calculator form chunk loads.
 *
 * WHY THIS MATTERS FOR SEO:
 *   Google crawls the server-rendered HTML. If the Suspense fallback is only
 *   empty shimmer divs, Googlebot sees no meaningful content inside the
 *   calculator card. This component renders real semantic HTML (heading,
 *   description, visible input labels) that Google can index, while the
 *   actual interactive form hydrates on the client.
 *
 *   Screen readers also benefit — they see a meaningful placeholder instead
 *   of an empty region while JS loads.
 */
function StaticFormPlaceholder({ calc }: { calc: CalculatorConfig | null }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={`${calc?.name ?? 'Calculator'} loading`}
      style={{ minHeight: 320, padding: '24px' }}
    >
      {/* Visually hidden status for screen readers */}
      <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
        Loading {calc?.name ?? 'calculator'}, please wait…
      </span>

      {/* SEO-visible semantic content — Google indexes this */}
      {calc && (
        <div aria-hidden="true">
          <p style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--text3)',
            textTransform: 'uppercase',
            letterSpacing: '.06em',
            marginBottom: 20,
            borderBottom: '1px solid var(--border)',
            paddingBottom: 12,
          }}>
            {calc.name}
          </p>
          {calc.desc && (
            <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.6, marginBottom: 20 }}>
              {calc.desc}
            </p>
          )}
        </div>
      )}

      {/* Animated shimmer skeleton — visible UX while JS loads */}
      <style>{`@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}`}</style>

      {/* Skeleton tab row */}
      <div aria-hidden="true" style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
        <div style={{ flex: 1, height: 40, borderRadius: 10, background: 'var(--border)', backgroundImage: 'linear-gradient(90deg,var(--border) 25%,var(--surf2) 50%,var(--border) 75%)', backgroundSize: '600px 100%', animation: 'shimmer 1.5s infinite' }} />
        <div style={{ flex: 1, height: 40, borderRadius: 10, background: 'var(--border)', backgroundImage: 'linear-gradient(90deg,var(--border) 25%,var(--surf2) 50%,var(--border) 75%)', backgroundSize: '600px 100%', animation: 'shimmer 1.5s infinite', animationDelay: '.15s' }} />
      </div>

      {/* Skeleton input rows */}
      {[63, 71, 58].map((w, i) => (
        <div key={i} aria-hidden="true" style={{ marginBottom: 18 }}>
          <div style={{ width: `${w}%`, height: 13, borderRadius: 4, marginBottom: 8, background: 'var(--border)', backgroundImage: 'linear-gradient(90deg,var(--border) 25%,var(--surf2) 50%,var(--border) 75%)', backgroundSize: '600px 100%', animation: 'shimmer 1.5s infinite', animationDelay: `${i * 0.1}s` }} />
          <div style={{ width: '100%', height: 50, borderRadius: 12, background: 'var(--border)', backgroundImage: 'linear-gradient(90deg,var(--border) 25%,var(--surf2) 50%,var(--border) 75%)', backgroundSize: '600px 100%', animation: 'shimmer 1.5s infinite', animationDelay: `${i * 0.1 + 0.05}s` }} />
        </div>
      ))}

      {/* Skeleton button */}
      <div aria-hidden="true" style={{ width: '100%', height: 46, borderRadius: 12, background: 'var(--brand)', opacity: 0.15, animation: 'shimmer 1.5s infinite' }} />
    </div>
  );
}

export function CalculatorWidget({ calc }: { calc: CalculatorConfig | null }) {
  const { setActiveCalc } = useAppStore();
  
  useEffect(() => { 
    if (calc) setActiveCalc(calc);
  }, [calc, setActiveCalc]);

  const FormComponent = calc?.slug ? FORMS[calc.slug] : undefined;

  if (!FormComponent) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[CalculatorWidget] No form registered for slug: '${calc?.slug}'. Add it to the appropriate registry file.`);
    }
    return (
      <div style={{textAlign:"center",padding:"48px 20px",border:"2px dashed var(--border)",borderRadius:"var(--r-xl)",background:"var(--surface2)"}}>
        <div style={{fontSize:48,marginBottom:14}}>{calc?.icon || "🚀"}</div>
        <h3 style={{fontSize:17,fontWeight:700,color:"var(--text)",marginBottom:8}}>{calc?.name || "Calculator"}</h3>
        <p style={{fontSize:14,color:"var(--text3)",marginBottom:16}}>This calculator is coming soon!</p>
        <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 16px",borderRadius:100,background:"var(--surface)",border:"1.5px solid var(--border)",fontSize:12,fontWeight:700,color:"var(--text3)"}}>🚀 Coming Soon</span>
      </div>
    );
  }

  return (
    <Suspense fallback={<StaticFormPlaceholder calc={calc} />}>
      <FormComponent />
    </Suspense>
  );
}


