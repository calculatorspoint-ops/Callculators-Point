import { lazy } from "react";

const Tech = {
  SubnetForm: lazy(() => import('../forms/TechForms').then((m: any) => ({ default: m.SubnetForm || (() => null) }))),
  NumberBaseForm: lazy(() => import('../forms/TechForms').then((m: any) => ({ default: m.NumberBaseForm || (() => null) }))),
  ASCIIForm: lazy(() => import('../forms/TechForms').then((m: any) => ({ default: m.ASCIIForm || (() => null) }))),
  DataTransferForm: lazy(() => import('../forms/TechForms').then((m: any) => ({ default: m.DataTransferForm || (() => null) }))),
  PasswordStrengthForm: lazy(() => import('../forms/TechForms').then((m: any) => ({ default: m.PasswordStrengthForm || (() => null) }))),
  HashGeneratorForm: lazy(() => import('../forms/TechForms').then((m: any) => ({ default: m.HashGeneratorForm || (() => null) }))),
  RandomStringForm: lazy(() => import('../forms/TechForms').then((m: any) => ({ default: m.RandomStringForm || (() => null) }))),
  BandwidthForm: lazy(() => import('../forms/TechForms').then((m: any) => ({ default: m.BandwidthForm || (() => null) }))),
  IPRangeForm: lazy(() => import('../forms/TechForms').then((m: any) => ({ default: m.IPRangeForm || (() => null) }))),
  HexForm: lazy(() => import('../forms/TechForms').then((m: any) => ({ default: m.HexForm || (() => null) }))),
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
