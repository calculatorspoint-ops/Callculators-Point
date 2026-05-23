import { lazy } from "react";

const Construction = {
  ConcreteForm: lazy(() => import('../forms/ConstructionForms').then((m: any) => ({ default: m.ConcreteForm }))),
  PaintForm: lazy(() => import('../forms/ConstructionForms').then((m: any) => ({ default: m.PaintForm }))),
  SquareFootageForm: lazy(() => import('../forms/ConstructionForms').then((m: any) => ({ default: m.SquareFootageForm }))),
  ConstructionCostForm: lazy(() => import('../forms/ConstructionForms').then((m: any) => ({ default: m.ConstructionCostForm }))),
  ElectricalLoadForm: lazy(() => import('../forms/ConstructionForms').then((m: any) => ({ default: m.ElectricalLoadForm }))),
  DensityForm: lazy(() => import('../forms/ConstructionForms').then((m: any) => ({ default: m.DensityForm }))),
  PressureForm: lazy(() => import('../forms/ConstructionForms').then((m: any) => ({ default: m.PressureForm }))),
  PipeVolumeForm: lazy(() => import('../forms/ConstructionForms').then((m: any) => ({ default: m.PipeVolumeForm }))),
  MaterialForm: lazy(() => import('../forms/ConstructionForms').then((m: any) => ({ default: m.MaterialForm }))),
  CubicYardForm: lazy(() => import('../forms/ConstructionForms').then((m: any) => ({ default: m.CubicYardForm }))),
  RoofingForm: lazy(() => import('../forms/ConstructionForms').then((m: any) => ({ default: m.RoofingForm }))),
  SandForm:    lazy(() => import('../forms/ConstructionForms').then((m: any) => ({ default: () => m.MaterialForm({ type: "sand" }) }))),
  GravelForm:  lazy(() => import('../forms/ConstructionForms').then((m: any) => ({ default: () => m.MaterialForm({ type: "gravel" }) }))),
  CementForm:  lazy(() => import('../forms/ConstructionForms').then((m: any) => ({ default: () => m.MaterialForm({ type: "cement" }) }))),
  AsphaltForm: lazy(() => import('../forms/ConstructionForms').then((m: any) => ({ default: () => m.MaterialForm({ type: "asphalt" }) }))),
};

export const constructionForms = {
  "concrete-calculator":               Construction.ConcreteForm,
  "paint-calculator":                  Construction.PaintForm,
  "square-footage-calculator":         Construction.SquareFootageForm,
  "construction-cost-calculator":      Construction.ConstructionCostForm,
  "electrical-load-calculator":        Construction.ElectricalLoadForm,
  "density-calculator":                Construction.DensityForm,
  "pressure-calculator":               Construction.PressureForm,
  "pipe-volume-calculator":            Construction.PipeVolumeForm,
  "sand-calculator":                   Construction.SandForm,
  "gravel-calculator":                 Construction.GravelForm,
  "cement-calculator":                 Construction.CementForm,
  "asphalt-calculator":                Construction.AsphaltForm,
  "cubic-yard-calculator":             Construction.CubicYardForm,
  "roofing-calculator":                Construction.RoofingForm,
};
