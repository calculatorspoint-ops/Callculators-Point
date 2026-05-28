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

function FormLoader() {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:300, flexDirection:"column", gap:12 }}>
      <div style={{ width:28, height:28, border:"2.5px solid var(--border)", borderTopColor:"var(--brand)", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <p style={{ fontSize:12, fontWeight:600, color:"var(--text3)" }}>Loading Tool...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export function CalculatorWidget({ calc }: { calc: CalculatorConfig | null }) {
  const { setActiveCalc } = useAppStore();
  
  useEffect(() => { 
    if (calc) setActiveCalc(calc);
  }, [calc, setActiveCalc]);

  const FormComponent = calc?.slug ? FORMS[calc.slug] : undefined;

  if (!FormComponent && process.env.NODE_ENV !== "production") {
    throw new Error(`Calculator form for slug '${calc?.slug}' is missing in CalculatorWidget registry.`);
  }

  if (!FormComponent) return (
    <div style={{textAlign:"center",padding:"48px 20px",border:"2px dashed var(--border)",borderRadius:"var(--r-xl)",background:"var(--surface2)"}}>
      <div style={{fontSize:48,marginBottom:14}}>{calc?.icon || "🚀"}</div>
      <h3 style={{fontSize:17,fontWeight:700,color:"var(--text)",marginBottom:8}}>{calc?.name || "Calculator"}</h3>
      <p style={{fontSize:14,color:"var(--text3)",marginBottom:16}}>This calculator is coming soon!</p>
      <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 16px",borderRadius:100,background:"var(--surface)",border:"1.5px solid var(--border)",fontSize:12,fontWeight:700,color:"var(--text3)"}}>🚀 Coming Soon</span>
    </div>
  );

  return (
    <Suspense fallback={<FormLoader />}>
      <FormComponent />
    </Suspense>
  );
}

