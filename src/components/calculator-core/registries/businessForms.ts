import { lazy } from "react";

const Business = {
  MarkupForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.MarkupForm || (() => null) }))),
  InventoryTurnoverForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.InventoryTurnoverForm || (() => null) }))),
  EOQForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.EOQForm || (() => null) }))),
  TimeCardForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.TimeCardForm || (() => null) }))),
  OvertimeForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.OvertimeForm || (() => null) }))),
  SalaryToHourlyForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.SalaryToHourlyForm || (() => null) }))),
  MeetingCostForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.MeetingCostForm || (() => null) }))),
  ConversionRateForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.ConversionRateForm || (() => null) }))),
  CLVForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.CLVForm || (() => null) }))),
  CPCCPAForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.CPCCPAForm || (() => null) }))),
  EmployeeCostForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.EmployeeCostForm || (() => null) }))),
};

export const businessForms = {
  "markup-calculator":                 Business.MarkupForm,
  "inventory-turnover-calculator":     Business.InventoryTurnoverForm,
  "eoq-calculator":                    Business.EOQForm,
  "time-card-calculator":              Business.TimeCardForm,
  "overtime-calculator":               Business.OvertimeForm,
  "salary-to-hourly-calculator":       Business.SalaryToHourlyForm,
  "meeting-cost-calculator":           Business.MeetingCostForm,
  "conversion-rate-calculator":        Business.ConversionRateForm,
  "customer-lifetime-value-calculator": Business.CLVForm,
  "cpc-cpa-calculator":                Business.CPCCPAForm,
  "employee-cost-calculator":          Business.EmployeeCostForm,
};
