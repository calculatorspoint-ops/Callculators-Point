import { lazy } from "react";

const Business = {
  MarkupForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.MarkupForm }))),
  InventoryTurnoverForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.InventoryTurnoverForm }))),
  EOQForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.EOQForm }))),
  TimeCardForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.TimeCardForm }))),
  OvertimeForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.OvertimeForm }))),
  SalaryToHourlyForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.SalaryToHourlyForm }))),
  MeetingCostForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.MeetingCostForm }))),
  ConversionRateForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.ConversionRateForm }))),
  CLVForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.CLVForm }))),
  CPCCPAForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.CPCCPAForm }))),
  EmployeeCostForm: lazy(() => import('../forms/BusinessForms').then((m: any) => ({ default: m.EmployeeCostForm }))),
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
