import { InsightCardProps } from '../../../../core/ui-system';
import { BMIResult } from '../engine/bmiEngine';

export function generateBMIInsights(result: BMIResult): InsightCardProps[] {
  const insights: InsightCardProps[] = [];
  
  if (result.category === 'Underweight') {
    insights.push({ 
      type: 'warn', 
      message: `Your BMI indicates you are underweight. A healthy weight for your height is between ${result.healthyWeightRange[0]} kg and ${result.healthyWeightRange[1]} kg.` 
    });
  } else if (result.category === 'Normal') {
    insights.push({ 
      type: 'good', 
      message: `You are within the healthy weight range (${result.healthyWeightRange[0]} kg - ${result.healthyWeightRange[1]} kg). Excellent work maintaining your health!` 
    });
  } else if (result.category === 'Overweight') {
    insights.push({ 
      type: 'warn', 
      message: `Your BMI indicates you are overweight. Consider dietary modifications and exercise. A healthy target weight is between ${result.healthyWeightRange[0]} kg and ${result.healthyWeightRange[1]} kg.` 
    });
  } else {
    insights.push({ 
      type: 'bad', 
      message: `Your BMI indicates obesity. We strongly recommend consulting a healthcare provider. A healthy target weight is between ${result.healthyWeightRange[0]} kg and ${result.healthyWeightRange[1]} kg.` 
    });
  }

  return insights;
}
