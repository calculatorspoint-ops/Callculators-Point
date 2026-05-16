import { z } from 'zod';
import { CalculatorFactory } from '../../../core/calculator-factory';

const EVSchema = z.object({
  batteryCapacity: z.number().min(1).max(200),
  currentCharge: z.number().min(0).max(99),
  targetCharge: z.number().min(1).max(100),
  chargerPower: z.coerce.number().min(1).max(350),
  efficiency: z.number().min(50).max(100),
});

function calculateEVCharge(data: any) {
  const { batteryCapacity, currentCharge, targetCharge, chargerPower, efficiency } = data;
  
  if (currentCharge >= targetCharge) {
    return { error: 'Target charge must be higher than current charge.' };
  }

  const chargeNeededPct = targetCharge - currentCharge;
  const energyNeededKwh = batteryCapacity * (chargeNeededPct / 100);
  
  // Apply charger efficiency loss
  const actualPowerKw = chargerPower * (efficiency / 100);
  
  const timeHours = energyNeededKwh / actualPowerKw;
  const hours = Math.floor(timeHours);
  const minutes = Math.round((timeHours - hours) * 60);

  let timeString = '';
  if (hours > 0) timeString += `${hours} hr `;
  if (minutes > 0) timeString += `${minutes} min`;
  if (hours === 0 && minutes === 0) timeString = '< 1 min';

  return {
    output: timeString,
    energyAdded: energyNeededKwh.toFixed(1) + ' kWh',
    actualPower: actualPowerKw.toFixed(1) + ' kW',
  };
}

export const EVChargingCalculator = CalculatorFactory.createSimple({
  id: 'ev-charging-calculator',
  domain: 'conversion',
  title: 'EV Charging Time Calculator',
  schema: EVSchema,
  defaultValues: { 
    batteryCapacity: 60, 
    currentCharge: 20, 
    targetCharge: 80, 
    chargerPower: 11, 
    efficiency: 90 
  },
  engine: calculateEVCharge,
  fields: [
    { name: 'batteryCapacity', label: 'Battery Capacity', unit: 'kWh' },
    { name: 'currentCharge', label: 'Current Charge', unit: '%' },
    { name: 'targetCharge', label: 'Target Charge', unit: '%' },
    { 
      name: 'chargerPower', 
      label: 'Charger Power', 
      type: 'select',
      options: [
        { label: 'Level 1 (1.4 kW - Home Outlet)', value: '1.4' },
        { label: 'Level 2 (7.2 kW - Home Charger)', value: '7.2' },
        { label: 'Level 2 (11 kW - 3 Phase)', value: '11' },
        { label: 'Level 2 (22 kW - Fast AC)', value: '22' },
        { label: 'DC Fast (50 kW)', value: '50' },
        { label: 'Supercharger (150 kW)', value: '150' },
        { label: 'Ultra-Fast (350 kW)', value: '350' },
      ]
    },
    { name: 'efficiency', label: 'Charging Efficiency', unit: '%' },
  ],
  resultLabel: 'Estimated Charge Time',
  resultFormatter: (result: any) => {
    if (result.error) return `Error: ${result.error}`;
    return `${result.output}\n(Added: ${result.energyAdded} @ ${result.actualPower})`;
  }
});
