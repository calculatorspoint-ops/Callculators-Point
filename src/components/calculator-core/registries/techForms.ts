import { lazy } from "react";

const Tech = {
  SubnetForm: lazy(() => import('../forms/TechForms').then((m: any) => ({ default: m.SubnetForm }))),
  NumberBaseForm: lazy(() => import('../forms/TechForms').then((m: any) => ({ default: m.NumberBaseForm }))),
  ASCIIForm: lazy(() => import('../forms/TechForms').then((m: any) => ({ default: m.ASCIIForm }))),
  DataTransferForm: lazy(() => import('../forms/TechForms').then((m: any) => ({ default: m.DataTransferForm }))),
  PasswordStrengthForm: lazy(() => import('../forms/TechForms').then((m: any) => ({ default: m.PasswordStrengthForm }))),
  HashGeneratorForm: lazy(() => import('../forms/TechForms').then((m: any) => ({ default: m.HashGeneratorForm }))),
  RandomStringForm: lazy(() => import('../forms/TechForms').then((m: any) => ({ default: m.RandomStringForm }))),
  BandwidthForm: lazy(() => import('../forms/TechForms').then((m: any) => ({ default: m.BandwidthForm }))),
  IPRangeForm: lazy(() => import('../forms/TechForms').then((m: any) => ({ default: m.IPRangeForm }))),
  HexForm: lazy(() => import('../forms/TechForms').then((m: any) => ({ default: m.HexForm }))),
};

export const techForms = {
  "subnet-calculator":                 Tech.SubnetForm,
  "number-base-converter":             Tech.NumberBaseForm,
  "ascii-converter":                   Tech.ASCIIForm,
  "data-transfer-calculator":          Tech.DataTransferForm,
  "password-strength-calculator":      Tech.PasswordStrengthForm,
  "hash-generator":                    Tech.HashGeneratorForm,
  "random-string-generator":           Tech.RandomStringForm,
  "bandwidth-calculator":              Tech.BandwidthForm,
  "ip-range-calculator":               Tech.IPRangeForm,
  "hexadecimal-calculator":            Tech.HexForm,
};
