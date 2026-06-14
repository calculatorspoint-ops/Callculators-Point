// BASE_FAQS — max 2 generic FAQs shown per page.
// The accuracy disclaimer and privacy statement are the only two that answer
// questions users genuinely have. Free/mobile/share are redundant with the UI.
// All remaining FAQ slots are filled by search-intent-matched CALC_FAQS below.
export const BASE_FAQS: { q: string; a: string }[] = [
  { q: "How accurate are the results?", a: "Our calculators use industry-standard formulas verified against academic sources and professional tools. Results are for informational and educational purposes — always verify important financial, health, or technical decisions with a qualified professional." },
  { q: "Does Calculators Point store my data?", a: "No. All calculations run entirely in your browser. Your inputs are never transmitted to any server, logged, or stored — complete privacy by design." },
];


export const CALC_FAQS: Record<string, { q: string; a: string }[]> = {
  "loan-emi-calculator": [
    { q: "What is the maximum EMI I can afford on a ₹10 lakh salary?", a: "A general rule is to keep total EMIs below 40–50% of monthly take-home pay. On a ₹10L/month salary (approx ₹7–8L take-home after tax), you can safely afford ₹3–4L/month in total EMIs. For a single home loan, most banks cap EMI at 40% of net monthly income." },
    { q: "Does prepaying a home loan reduce EMI or tenure?", a: "By default, most Indian banks reduce your loan tenure when you prepay — your EMI stays the same but the loan ends earlier. You can request tenure reduction (saves more interest) or EMI reduction (frees up monthly cash). Tenure reduction is mathematically superior if your goal is minimizing total interest." },
    { q: "What happens to my EMI if the interest rate increases?", a: "On a floating rate home loan, most banks extend the tenure rather than increase the EMI when rates rise. If the extended tenure would exceed the original approved period, the EMI increases instead. You can also choose to prepay a lump sum to keep the tenure unchanged." },
    { q: "How is EMI calculated?", a: "EMI = P × r × (1+r)ⁿ ÷ ((1+r)ⁿ − 1), where P = principal, r = monthly interest rate (annual rate ÷ 12), n = total months. For ₹50L at 8.5% for 20 years: r = 0.085/12 = 0.00708, n = 240 months → EMI ≈ ₹43,391/month." },
    { q: "What EMI-to-income ratio is healthy?", a: "Financial experts recommend keeping total EMIs (all loans combined) below 40–50% of monthly take-home pay. Above 50% is considered financially stretched and may lead to loan rejection by banks." },
  ],
  "concrete-calculator": [
    { q:"How do I calculate concrete volume for a slab?", a:"Concrete volume = Length × Width × Depth. For example, a 4 m × 3 m slab at 100 mm (0.1 m) thick = 4 × 3 × 0.1 = 1.2 m³. Always add a 10% waste factor, giving 1.32 m³ for this slab." },
    { q:"How many bags of concrete do I need per cubic metre?", a:"A 60 lb (27 kg) bag covers approximately 0.45 cu ft (0.0127 m³). For 1 m³ you need roughly 79 bags of 60 lb, or 59 bags of 80 lb. The exact number depends on the bag yield specified by the manufacturer." },
    { q:"What is the difference between a slab, footing, and column concrete calculation?", a:"Slabs and walls use cuboid volume (L × W × D). Round footings and columns use cylindrical volume (π × radius² × depth). The calculator handles each shape separately so you always get the correct formula for your pour type." },
    { q:"Should I use pre-mixed bags or ready-mix concrete?", a:"Pre-mixed bags are economical for small pours under 0.5 m³ (around 40 bags). For larger pours, a ready-mix truck is faster and cheaper per m³. The threshold is typically 1–2 cubic yards — consult your local supplier for quotes." },
    { q:"What is a typical concrete mix ratio?", a:"A standard general-purpose mix is 1:2:4 (cement:sand:aggregate by volume). For higher-strength structural work, use 1:1.5:3. The calculator assumes a standard mix; use the Cement Calculator for custom mix ratios." },
    { q:"Why do I need a waste allowance for concrete?", a:"Concrete pours always lose some material to spillage, uneven forms, and over-filling. A 10% waste factor is standard for slabs and walls. Footings and columns in unstable soil may need 15–20% more." },
  ],
  "cement-calculator": [
    { q:"How is the cement quantity calculated for a given mix ratio?", a:"For a 1:2:4 mix (cement:sand:aggregate), the total parts = 7. Cement proportion = 1/7. For 1 m³ of concrete, you need 1/7 = 0.143 m³ of cement, which equals approximately 4.4 bags of 50 kg cement (since 1 bag ≈ 0.033 m³)." },
    { q:"What is the difference between cement and concrete?", a:"Cement is a binding agent (powder) made from limestone and clay. Concrete is cement mixed with sand, aggregate, and water. Mortar is cement mixed with sand only (no aggregate). You need cement to make concrete, but cement alone is not concrete." },
    { q:"How many bags of cement per cubic metre of concrete?", a:"For a standard 1:2:4 mix: approximately 6–7 bags of 50 kg cement per m³. For a richer 1:1.5:3 mix: approximately 8–9 bags per m³. The exact quantity depends on your mix design and allowance for bulking of sand." },
  ],
  "sand-calculator": [
    { q:"How much sand do I need for a given area?", a:"Sand volume = Area × Depth. For example, a 10 m² patio at 50 mm (0.05 m) depth needs 10 × 0.05 = 0.5 m³ of sand. Convert to tonnes: 0.5 m³ × 1.6 t/m³ (dry sand density) = 0.8 tonnes." },
    { q:"What is the density of sand?", a:"Dry sand weighs approximately 1,600 kg/m³ (1.6 tonnes/m³). Wet sand is heavier at around 1,920 kg/m³. Bulk bags (1 tonne) contain about 0.625 m³ of dry sand. Always order by volume when mixing concrete for consistency." },
    { q:"How much sand do I need to mix with cement?", a:"For mortar (no aggregate): a 1:3 mix uses 3 parts sand to 1 part cement by volume. For concrete (with aggregate): a 1:2:4 mix uses 2 parts sand. Use the Cement Calculator to get precise material quantities for your specific mix and volume." },
  ],
  "gravel-calculator": [
    { q:"How do I calculate how much gravel I need?", a:"Gravel volume = Length × Width × Depth. For a 5 m × 3 m path at 75 mm (0.075 m) depth: 5 × 3 × 0.075 = 1.125 m³. Add 10% for compaction loss: 1.125 × 1.1 = 1.24 m³ (approximately 2 tonnes at 1.6 t/m³)." },
    { q:"What depth of gravel should I use for a driveway?", a:"A gravel driveway typically needs 100–150 mm (4–6 inches) of compacted gravel in two layers: 75–100 mm of base gravel, then 50 mm of decorative top gravel. Light foot traffic paths need only 50–75 mm total." },
    { q:"How much does a tonne of gravel cover?", a:"One tonne of gravel covers approximately 10–14 m² at 50 mm depth, or 7–9 m² at 75 mm depth, depending on the gravel type and density. Limestone tends to be lighter; basalt and granite are denser." },
  ],
  "inventory-turnover-calculator": [
    { q:"How is inventory turnover ratio calculated?", a:"Inventory Turnover = Cost of Goods Sold (COGS) ÷ Average Inventory. Average Inventory = (Beginning Inventory + Ending Inventory) ÷ 2. For example, COGS of $500,000 with average inventory of $100,000 gives a turnover ratio of 5, meaning inventory was replenished 5 times that year." },
    { q:"What is a good inventory turnover ratio?", a:"It depends on the industry. Grocery and food retail: 15–25× (high volume, perishable). General retail: 5–10×. Manufacturing: 4–8×. A ratio below 3× often signals slow-moving stock or over-purchasing. A ratio above 20× in non-food industries may indicate stock-outs and lost sales." },
    { q:"What is Days Sales of Inventory (DSI)?", a:"DSI = 365 ÷ Inventory Turnover Ratio. It shows how many days, on average, inventory sits before being sold. An inventory turnover of 5 equals a DSI of 73 days. Lower DSI means faster-selling inventory, which is generally better for cash flow." },
    { q:"What is the difference between FIFO and LIFO in inventory?", a:"FIFO (First In, First Out) assumes oldest inventory is sold first, resulting in lower COGS when prices rise. LIFO (Last In, First Out) assumes newest inventory is sold first, resulting in higher COGS and lower tax in rising price environments. LIFO is not permitted under IFRS (used outside the US)." },
    { q:"Why is a high inventory turnover not always good?", a:"Excessively high turnover can mean you're frequently running out of stock (stockouts), leading to lost sales and unhappy customers. The optimal turnover rate balances holding costs (storage, spoilage, capital tied up) against stockout risk. The right ratio depends on your reorder lead time and demand variability." },
  ],
  "compound-interest-calculator": [
    { q: "What is the difference between compound and simple interest?", a: "Simple interest is calculated only on the original principal: SI = P × R × T. Compound interest earns interest on the accumulated interest too — each period's interest is added to the principal. On ₹1L at 10% for 10 years: simple interest gives ₹2L, compound interest (annual) gives ₹2.59L — a 30% difference that grows dramatically over longer periods." },
    { q: "How does compounding frequency affect my returns?", a: "More frequent compounding produces higher effective returns. At 10% nominal rate: annual compounding gives 10% effective rate; monthly gives 10.47%; daily gives 10.52%. The difference seems small but compounds significantly over 10–20 year periods." },
    { q: "What is the Rule of 72?", a: "The Rule of 72 quickly estimates doubling time: divide 72 by the annual interest rate. At 8% p.a., money doubles in 72÷8 = 9 years. At 12%, it doubles in 6 years. It's an approximation — the actual formula is: doubling time = ln(2) / ln(1+r)." },
    { q: "What is a realistic compound interest rate for savings?", a: "In India: FDs offer 6.5–7.5%, PPF offers 7.1% (tax-free), equity mutual funds have historically given 12–15% CAGR over 10+ years. In the US: high-yield savings accounts offer 4–5%, S&P 500 historical average is ~10% nominal (7% inflation-adjusted). Always compare post-tax, inflation-adjusted returns." },
    { q: "How do I calculate how much I need to invest today to reach a goal?", a: "Use the Present Value formula: PV = FV ÷ (1+r)ⁿ. To have ₹1 crore in 20 years at 12% annual returns: PV = 1,00,00,000 ÷ (1.12)²⁰ = ₹10,37,000 today. This calculator's goal-seek mode does this calculation automatically." },
  ],
  "sip-calculator": [
    { q: "What is SIP and how does it work?", a: "SIP (Systematic Investment Plan) invests a fixed amount monthly into a mutual fund. Each month you buy units at the current NAV — when markets are down you buy more units, when up you buy fewer. This rupee cost averaging lowers your average purchase cost over time compared to lump-sum investing." },
    { q: "What returns can I realistically expect from SIP in 10–15 years?", a: "Indian diversified equity mutual funds have historically delivered 12–15% CAGR over 10+ year periods, though past returns don't guarantee future performance. A monthly SIP of ₹10,000 at 12% for 15 years grows to approximately ₹50 lakhs. At 15%, it reaches ₹67 lakhs." },
    { q: "What is a Step-Up SIP and should I use it?", a: "A Step-Up SIP increases your monthly contribution by a fixed percentage each year (e.g., 10% annually). Since salaries typically grow 8–15% per year, stepping up your SIP mirrors income growth and dramatically accelerates corpus accumulation. A ₹10,000 SIP stepped up 10% annually at 12% for 20 years creates a corpus ~40% larger than a flat SIP." },
    { q: "How is SIP return (XIRR) calculated?", a: "XIRR (Extended Internal Rate of Return) is the correct metric for SIP returns because it accounts for the timing of each monthly investment. A 12% XIRR means every rupee you invested earned a 12% annualized return adjusted for when it was invested — more accurate than simple annualized returns." },
    { q: "What is the minimum SIP amount?", a: "Most mutual funds allow SIPs starting from ₹100–₹500/month. SEBI regulations permit mutual funds to set their own minimum SIP amount. There is no maximum SIP limit. Many funds offer daily, weekly, fortnightly, and monthly SIP frequencies." },
  ],
  "bmi-calculator": [
    { q: "What is a healthy BMI for Indian and South Asian women?", a: "The WHO's Asian-specific guidelines classify BMI 18.5–22.9 as Normal, 23–27.4 as Overweight, and 27.5+ as Obese for South Asian populations. These thresholds are lower than Western standards (25/30) because research shows South and East Asians face metabolic risks (diabetes, cardiovascular disease) at lower BMI values." },
    { q: "Can BMI be accurate for athletes and bodybuilders?", a: "No. BMI cannot distinguish between fat mass and muscle mass. A muscular athlete may have a BMI of 27–30, classifying as 'overweight' despite having very low body fat. For athletes, body fat percentage (measured via DEXA scan or Navy circumference method) is a far more accurate health marker." },
    { q: "How does BMI differ from body fat percentage?", a: "BMI uses only height and weight — it estimates body size but not body composition. Body fat percentage directly measures what fraction of your weight is fat tissue. Two people with identical BMI can have very different body fat percentages and health profiles." },
    { q: "What BMI is considered obese?", a: "For general populations: Obese Class I = BMI 30–34.9, Class II = 35–39.9, Class III (severe) = 40+. For South and East Asian populations, obesity begins at 27.5. The WHO adopted these adjusted thresholds because Asian populations develop obesity-related diseases at lower BMI values." },
    { q: "Is BMI different for men and women?", a: "The same BMI formula and thresholds apply to both sexes in clinical classification. However, at the same BMI, women naturally carry more body fat than men due to hormonal differences. A man and woman both at BMI 24 will typically have different body fat percentages." },
  ],
  "percentage-calculator": [
    { q:"How do I calculate percentage increase?", a:"Percentage increase = ((New Value - Original Value) / Original Value) × 100. For example, from ₹1000 to ₹1250 is a 25% increase." },
    { q:"What is a percentage point?", a:"A percentage point is the arithmetic difference between two percentages. If interest rates go from 5% to 8%, that's a 3 percentage point increase, but a 60% relative increase." },
  ],
  "mortgage-calculator": [
    { q: "How much house can I afford on my salary?", a: "A common guideline is the 28/36 rule: spend no more than 28% of gross monthly income on housing (mortgage + insurance + taxes) and no more than 36% on total debt. On a $100,000 annual salary (~$8,333/month), your housing payment should stay below $2,333/month. Use the calculator to find the loan amount that hits that payment." },
    { q: "Is it better to choose a 15-year or 30-year mortgage?", a: "A 15-year mortgage has higher monthly payments but saves significantly on total interest — typically 50–60% less than a 30-year at the same rate. A 30-year offers lower monthly payments and more cash flow flexibility. If you can afford the 15-year payment, the interest savings are usually worth it — but a 30-year with voluntary extra payments can achieve a similar result with more flexibility." },
    { q: "How does a 1% difference in mortgage rate affect my payment?", a: "On a $400,000, 30-year mortgage: at 6%, monthly payment ≈ $2,398; at 7%, ≈ $2,661 — a difference of $263/month or $94,680 over the life of the loan. A 1% rate difference on a $400K mortgage costs roughly $95,000 extra in interest over 30 years." },
    { q: "What is PMI and when can I remove it?", a: "PMI (Private Mortgage Insurance) is required when your down payment is less than 20%. It typically costs 0.5–1.5% of the loan amount annually. You can request PMI cancellation once your equity reaches 20% of the original home value. Under the Homeowners Protection Act, lenders must automatically cancel PMI at 22% equity." },
    { q: "Should I choose a fixed or adjustable rate mortgage (ARM)?", a: "Fixed rates offer payment certainty for the full loan term — best when rates are historically low. ARMs (e.g., 5/1 ARM) offer lower initial rates for 5 years then adjust annually — better if you'll sell or refinance before the fixed period ends. In a high-rate environment, ARMs carry the risk of significantly higher payments after the fixed period." },
  ],
  "salary-calculator": [
    { q: "How much income tax will I pay on my salary?", a: "In India (FY2024-25, new regime): no tax on income up to ₹3L, 5% on ₹3–7L, 10% on ₹7–10L, 15% on ₹10–12L, 20% on ₹12–15L, 30% above ₹15L. Standard deduction of ₹75,000 applies. On ₹10L annual income under the new regime, you typically pay around ₹54,600 in taxes after the standard deduction." },
    { q: "What is CTC vs take-home salary?", a: "CTC (Cost to Company) is the total annual expense a company incurs for an employee — it includes basic salary, HRA, allowances, PF contributions, gratuity, and perks. Take-home salary is CTC minus the employee's share of PF (12%), income tax TDS, professional tax, and other deductions. Take-home is typically 70–80% of CTC." },
    { q: "How does HRA reduce my taxable salary?", a: "HRA (House Rent Allowance) is exempt from tax up to the minimum of: (1) actual HRA received, (2) 50% of basic salary for metro cities / 40% for others, (3) actual rent paid minus 10% of basic salary. If your basic is ₹5L and you pay ₹2L rent in a metro, you can exempt ₹1.5L from tax." },
    { q: "How do I convert monthly salary to annual CTC?", a: "Annual CTC ≈ Monthly CTC × 12. However, CTC includes variable components (performance bonus, annual incentives) that don't appear monthly. Always ask for the CTC breakup: fixed monthly × 12 + variable annual components. For hourly-to-annual: hourly rate × 2,080 hours (40h × 52 weeks)." },
    { q: "What is the difference between old and new tax regime in India?", a: "Old regime: higher tax rates but allows deductions (80C, HRA, home loan interest, NPS etc.) that can reduce taxable income by ₹2–5L. New regime: lower rates but almost no deductions. New regime is better if your total deductions are below ₹2.5L; old regime is better with higher deductions." },
  ],
  "tax-calculator": [
    { q:"What is effective tax rate?", a:"Effective tax rate is the actual percentage of your total income paid in taxes. It's usually lower than your marginal tax bracket because lower brackets are taxed at lower rates." },
    { q:"How are tax slabs applied?", a:"Tax slabs are progressive — only the income within each bracket is taxed at that rate. For example, if the first ₹600K is tax-free, you only pay tax on income above that threshold." },
  ],
  "discount-calculator": [
    { q: "How do stacked discounts work — is 30% off + 20% off = 50% off?", a: "No. Stacked discounts are applied sequentially, not added. A 30% off + 20% off deal works as: first, 30% off the original price, then 20% off the already-discounted price. The combined discount is 44%, not 50%. Formula: effective discount = 1 − (1−0.30) × (1−0.20) = 1 − 0.70 × 0.80 = 1 − 0.56 = 44%." },
    { q: "How do I find the original price before a discount?", a: "Original Price = Sale Price ÷ (1 − Discount%). If an item costs ₹840 after 30% off: Original = 840 ÷ 0.70 = ₹1,200. For finding the discount percentage: Discount% = (Original − Sale) ÷ Original × 100." },
    { q: "What is markdown vs discount?", a: "A discount is a price reduction offered to a specific customer (loyalty discount, coupon). A markdown is a permanent or semi-permanent price reduction applied to all customers (clearance pricing). Accounting treats them differently — discounts are revenue reductions, markdowns are COGS adjustments." },
    { q: "How does GST/VAT interact with discounts?", a: "Tax applies to the final discounted price, not the original. For a ₹1,000 item with 20% discount and 18% GST: discounted price = ₹800, then 18% GST = ₹144, final price = ₹944. Never add tax before applying the discount — that inflates the tax base incorrectly." },
    { q: "How do I calculate the break-even discount I can offer?", a: "Maximum discount% = Gross Margin% − (Minimum acceptable margin%). If your product has a 40% margin and you need at least 10% margin, you can offer up to 30% discount. At 30% off, your effective margin = 40% − 30% = 10% of original price. This calculator's reverse mode solves for this." },
  ],
  "gst-calculator": [
    { q: "What are the GST rates in India?", a: "India uses a four-tier GST structure: 5% (essential goods — food, books, medicines), 12% (processed food, textiles, computers), 18% (most goods and services — electronics, restaurants, telecom), and 28% (luxury goods — cars, tobacco, aerated drinks). Zero-rated items include fresh vegetables, milk, and exports." },
    { q: "What is the difference between CGST, SGST, and IGST?", a: "CGST (Central GST) and SGST (State GST) are each charged at half the applicable rate on intra-state sales — so an 18% GST item has 9% CGST + 9% SGST. IGST (Integrated GST) at the full rate applies to inter-state sales and imports. The split matters for tax credit claims." },
    { q: "How do I calculate GST from an inclusive price?", a: "To extract GST from a GST-inclusive price: GST Amount = Total Price × Rate ÷ (100 + Rate). For an ₹1,180 item at 18% GST: GST = 1180 × 18 ÷ 118 = ₹180. The base price is ₹1,000. This calculator's 'remove GST' mode handles this automatically." },
    { q: "Can I claim input tax credit (ITC) on GST paid?", a: "Registered GST businesses can claim ITC — deducting GST paid on purchases from GST collected on sales. ITC cannot be claimed on personal expenses, motor vehicles (exceptions apply), food and beverages for employees, or club memberships. Proper invoice documentation is required for all ITC claims." },
    { q: "Is GST applicable on imports and exports?", a: "Exports are zero-rated — exporters charge 0% GST and can claim refunds on input GST paid. Imports are treated as inter-state supply and attract IGST at the applicable rate, plus customs duty. IGST on imports can be claimed as ITC by registered importers." },
  ],
  "profit-margin-calculator": [
    { q: "What is the difference between profit margin and markup?", a: "Margin = Profit ÷ Revenue × 100 (profit as a percentage of selling price). Markup = Profit ÷ Cost × 100 (profit as a percentage of cost). A 50% markup equals a 33.3% margin. Margin is always lower than markup for the same product — confusing the two is one of the most common pricing mistakes." },
    { q: "What is a healthy profit margin by industry?", a: "Typical net profit margins: Grocery retail 1–3%; E-commerce 2–5%; Restaurants 3–9%; Manufacturing 5–10%; Software/SaaS 15–30%; Financial services 15–25%; Pharmaceuticals 10–20%. Compare your margin against industry benchmarks, not a universal 'good' number." },
    { q: "What is gross margin vs net profit margin?", a: "Gross margin = (Revenue − COGS) ÷ Revenue × 100. It shows profitability before operating expenses. Net profit margin = Net Profit ÷ Revenue × 100. It accounts for all costs including operating expenses, interest, and taxes. A business can have a healthy gross margin but a poor net margin due to high overhead costs." },
    { q: "How do I price a product to achieve a target margin?", a: "Selling Price = Cost ÷ (1 − Target Margin%). For a target 40% margin on a product that costs ₹600: Price = 600 ÷ 0.60 = ₹1,000. This is different from applying a 40% markup: Cost × 1.40 = ₹840, which gives only 28.6% margin." },
    { q: "Why is my margin shrinking even though revenue is growing?", a: "Margin compression despite revenue growth usually means COGS is growing faster than revenue (raw material inflation, supplier price increases), or fixed costs are scaling faster than expected. Calculate gross margin separately from net margin to isolate whether the issue is at the product level or the operational level." },
  ],
  "break-even-calculator": [
    { q:"What is the break-even point?", a:"The break-even point is where total revenue equals total costs — no profit, no loss. It tells you the minimum units you must sell to cover all fixed and variable costs." },
    { q:"How is break-even calculated?", a:"Break-Even Units = Fixed Costs ÷ (Selling Price per Unit - Variable Cost per Unit). The denominator is called the contribution margin per unit." },
  ],
  "roi-calculator": [
    { q:"What is ROI?", a:"Return on Investment (ROI) measures the profitability of an investment as a percentage. ROI = (Net Profit ÷ Investment Cost) × 100." },
    { q:"What is a good ROI?", a:"A 'good' ROI depends on the investment type. Stock markets historically average 7-10% annually. Real estate averages 8-12%. Any ROI above inflation is considered positive." },
  ],
  "simple-interest-calculator": [
    { q:"What is simple interest?", a:"Simple interest is calculated only on the original principal: SI = P × R × T ÷ 100. Unlike compound interest, it doesn't earn interest on accumulated interest." },
    { q:"Where is simple interest used?", a:"Simple interest is common in short-term personal loans, car loans (flat rate), fixed deposits in some countries, and certain government bonds." },
  ],
  "ppf-calculator": [
    { q:"What is PPF?", a:"Public Provident Fund (PPF) is a government-backed savings scheme offering guaranteed, tax-free returns. It has a 15-year lock-in period with partial withdrawal allowed after 7 years." },
    { q:"Is PPF tax-free?", a:"Yes, PPF enjoys EEE (Exempt-Exempt-Exempt) status — the investment, interest earned, and maturity amount are all tax-free under Section 80C." },
  ],
  "tip-calculator": [
    { q:"How much should I tip?", a:"Tipping norms vary by country. In the US, 15-20% is standard for restaurants. In many Asian and European countries, tipping is optional or included in the bill." },
    { q:"How do I split a bill with tip?", a:"Total with tip = Bill × (1 + Tip%). Then divide by the number of people. For example: ₹2000 bill + 15% tip = ₹2300 ÷ 4 people = ₹575 each." },
  ],
  "calorie-calculator": [
    { q: "How many calories should I eat to lose 1kg per week?", a: "1 kg of body fat ≈ 7,700 calories. To lose 1 kg/week, you need a deficit of 1,100 calories/day — which is aggressive and difficult to sustain. A more realistic target is 0.5 kg/week (550 cal/day deficit). Never go below 1,200 cal/day (women) or 1,500 cal/day (men) without medical supervision." },
    { q: "What is TDEE and how is it calculated?", a: "TDEE (Total Daily Energy Expenditure) = BMR × activity multiplier. Activity multipliers: Sedentary (desk job, no exercise) × 1.2; Lightly active (1–3 days/week) × 1.375; Moderately active (3–5 days) × 1.55; Very active (6–7 days) × 1.725; Extremely active (athlete/physical job) × 1.9." },
    { q: "Are all calories the same for weight loss?", a: "Mathematically yes — a calorie deficit drives weight loss regardless of source. Practically no — protein calories (4 cal/g) are more satiating and preserve muscle during a deficit; ultra-processed foods may disrupt hunger hormones. For body composition, calorie quantity is the primary driver, but macronutrient quality matters for health and adherence." },
    { q: "Why am I not losing weight in a calorie deficit?", a: "Common reasons: underestimating food intake (studies show people underreport by 20–50%), metabolic adaptation (TDEE decreases during prolonged dieting), water retention masking fat loss, or inaccurate activity factor. Try weighing food instead of estimating, take a 1–2 week diet break, or recalculate TDEE after significant weight change." },
    { q: "How does calorie need change with age?", a: "BMR decreases approximately 2–3% per decade after age 20, primarily due to muscle loss (sarcopenia). A 50-year-old typically burns 200–400 fewer calories/day than they did at 25. Strength training to preserve muscle mass is the most effective way to maintain metabolic rate as you age." },
  ],
  "bmr-calculator": [
    { q: "What is BMR and why does it matter?", a: "BMR (Basal Metabolic Rate) is the calories your body burns at complete rest — breathing, circulation, cell repair, temperature regulation. It accounts for 60–75% of total daily calorie burn. Knowing your BMR lets you set accurate calorie targets: eat below BMR × activity factor to lose weight, at maintenance to hold weight, or above to gain muscle." },
    { q: "Which BMR formula is most accurate — Mifflin-St Jeor, Harris-Benedict, or Katch-McArdle?", a: "Mifflin-St Jeor is considered the most accurate for average adults (within 10% for 80% of people). Harris-Benedict tends to overestimate by 5–15%. Katch-McArdle is the most accurate if you know your body fat percentage, because it calculates BMR from lean mass rather than total weight — making it ideal for athletes." },
    { q: "Does muscle mass increase BMR?", a: "Yes. Muscle tissue burns approximately 13 kcal/kg/day at rest vs 4.5 kcal/kg/day for fat tissue. A person with 60 kg of lean mass has a meaningfully higher BMR than someone with 45 kg of lean mass at the same total weight. This is the main metabolic advantage of strength training." },
    { q: "How does BMR change during a diet?", a: "BMR decreases during caloric restriction — your body adapts by reducing energy expenditure (metabolic adaptation). Studies show BMR can drop 10–15% below predicted levels after prolonged dieting. This is why weight loss plateaus occur and why diet breaks or refeeds help. Maintaining protein intake and resistance training minimizes this effect." },
    { q: "Why do men have higher BMR than women?", a: "Men typically have 10–15% higher BMR than women of the same height, weight, and age. The primary reason is body composition: men have more muscle mass and less fat tissue on average. The Mifflin-St Jeor formula accounts for this with different constants for men and women." },
  ],
  "body-fat-calculator": [
    { q: "What body fat percentage is healthy for my age?", a: "For men: Essential fat = 2–5%; Athletic = 6–13%; Fitness = 14–17%; Acceptable = 18–24%; Obese = 25%+. For women: Essential = 10–13%; Athletic = 14–20%; Fitness = 21–24%; Acceptable = 25–31%; Obese = 32%+. Body fat requirements shift with age — slightly higher acceptable ranges apply for those over 60." },
    { q: "What is the most accurate way to measure body fat?", a: "DEXA scan is the gold standard (±1–2% accuracy) but requires medical equipment. Hydrostatic weighing is also very accurate. The Navy circumference method (used in this calculator) is ±3–4% accurate and uses only a tape measure. Bioelectrical impedance (smart scales) varies widely (±5–8%) based on hydration levels." },
    { q: "Why does the Navy method use neck and waist measurements?", a: "The US Navy circumference method uses logarithmic formulas with waist and neck circumference (plus hip for women) to estimate body density. These specific sites were chosen because waist circumference correlates strongly with visceral fat (the metabolically harmful type), while neck circumference correlates with lean mass." },
    { q: "How is body fat percentage different from BMI?", a: "BMI uses only height and weight — it estimates body size but cannot distinguish fat from muscle. Body fat percentage directly measures what fraction of your total weight is fat. A muscular person may have BMI 28 (overweight) but 12% body fat (athletic). Body fat is more clinically meaningful for health assessment." },
    { q: "Can losing muscle increase my body fat percentage?", a: "Yes. Body fat percentage = fat mass ÷ total body mass. If you lose muscle (from crash dieting, inactivity, or illness) while fat stays the same, your body fat percentage rises even if the scale doesn't change. This is why protein intake and resistance training are critical during any weight loss program." },
  ],
  "ideal-weight-calculator": [
    { q:"How is ideal weight calculated?", a:"Multiple formulas exist: Devine, Miller, Robinson, and Hamwi. Each uses height and gender to estimate ideal weight. We show all four plus the BMI-based healthy range (18.5-24.9)." },
    { q:"Is ideal weight the same for everyone of the same height?", a:"No. Frame size, muscle mass, age, and ethnicity all affect ideal weight. These formulas provide estimates — consult a healthcare provider for personalized guidance." },
  ],
  "macro-calculator": [
    { q:"What are macros?", a:"Macronutrients (macros) are protein, carbohydrates, and fat — the three main nutrients that provide calories. Each plays a unique role in body function and performance." },
    { q:"What is the best macro ratio for weight loss?", a:"A common weight loss split is 35% protein, 35% carbs, 30% fat. Higher protein helps preserve muscle during a caloric deficit. Adjust based on activity level and personal response." },
  ],
  "water-intake-calculator": [
    { q:"How much water should I drink daily?", a:"A general guideline is 35ml per kg of body weight. A 70kg person needs about 2.45L daily. Increase by 0.3-1L for exercise and hot climates." },
    { q:"Does coffee count toward water intake?", a:"Yes, moderate coffee and tea consumption contributes to hydration. However, pure water remains the best choice. Heavily caffeinated or sugary drinks are less effective." },
  ],
  "heart-rate-calculator": [
    { q:"How are heart rate training zones calculated?", a:"Using the Karvonen formula: Target HR = Resting HR + (Percentage × Heart Rate Reserve). HRR = Max HR (220 - age) minus Resting HR. This gives more personalized zones than simple percentage of max HR." },
    { q:"Which heart rate zone burns the most fat?", a:"Zone 2 (60-70% of HRR) maximizes fat oxidation as a percentage of fuel. However, higher zones burn more total calories per minute, so overall caloric deficit matters more for weight loss." },
  ],
  "pregnancy-due-date": [
    { q:"How is the due date calculated?", a:"Using Naegele's Rule: add 280 days (40 weeks) to the first day of your last menstrual period (LMP). Only about 5% of babies are born on their exact due date." },
    { q:"What are the trimesters?", a:"First trimester: weeks 1-12 (organ formation). Second trimester: weeks 13-27 (growth and movement). Third trimester: weeks 28-40 (final development and preparation for birth)." },
  ],
  "one-rep-max-calculator": [
    { q:"What is 1RM?", a:"One Rep Max (1RM) is the maximum weight you can lift for a single repetition with proper form. It's used to program training percentages for strength and hypertrophy." },
    { q:"How accurate are 1RM estimations?", a:"Estimates are most accurate with 1-5 reps. Beyond 10 reps, accuracy decreases significantly. The Epley and Brzycki formulas are within 5% accuracy for low rep ranges." },
  ],
  "period-calculator": [
    { q:"How long is a normal menstrual cycle?", a:"Normal cycles range from 21-35 days, with 28 days being the average. Cycle length can vary month to month. Tracking 3+ cycles helps identify your personal pattern." },
    { q:"When is the fertile window?", a:"Ovulation typically occurs about 14 days BEFORE your next period. The fertile window spans approximately 5 days before ovulation through 1 day after." },
  ],
  "gpa-calculator": [
    { q:"How is GPA calculated?", a:"GPA = Sum of (Grade Points × Credit Hours) ÷ Total Credit Hours. Each letter grade corresponds to a point value: A+=4.0, A=4.0, A-=3.7, B+=3.3, B=3.0, B-=2.7, C+=2.3, C=2.0, D=1.0, F=0.0. A 3-credit A and a 3-credit F average to exactly 2.0." },
    { q:"What GPA do I need for Dean's List?", a:"Most universities require a GPA of 3.5–3.7 or higher for Dean's List. Cum Laude typically starts at 3.5, Magna Cum Laude at 3.7, and Summa Cum Laude at 3.9+. Requirements vary by institution — check your university's catalog." },
    { q:"How can I raise my GPA quickly?", a:"Focus on high-credit courses first — a 4-credit A has more impact than a 1-credit A. Retaking a failed course to replace the F can dramatically improve your GPA. Consistent A/A- performance is more sustainable than sporadic excellence." },
    { q:"What is the difference between semester GPA and cumulative GPA?", a:"Semester GPA reflects only that semester's courses. Cumulative GPA is the weighted average across all completed semesters. Cumulative GPA changes slowly the more credits you've earned." },
  ],
  "marks-percentage-calculator": [
    { q:"How do I calculate percentage from marks?", a:"Percentage = (Total Marks Obtained ÷ Total Maximum Marks) × 100. For example, if you scored 420 out of 500, your percentage = (420 ÷ 500) × 100 = 84%." },
    { q:"What is a distinction percentage?", a:"In most Indian and Pakistani university systems, 75%+ is Distinction, 60-74% is First Division, 50-59% is Second Division, 40-49% is Third Division/Pass, and below 40% is Fail. Standards vary by board and institution." },
    { q:"How does the reverse percentage mode work?", a:"Reverse mode calculates how many total marks you need to achieve a specific percentage. For example, to score 75% on a 500-mark exam, you need 375 marks. Useful for setting study targets." },
    { q:"Can I track multiple subjects separately?", a:"Yes! Add each subject with its own marks and total. The calculator shows per-subject percentage, grade classification, and pass/fail status, plus an overall percentage across all subjects combined." },
  ],
  "attendance-calculator": [
    { q:"What is the minimum attendance required?", a:"Most Indian and Pakistani universities require 75% minimum attendance to appear for semester exams. Some institutions require 80-85%. Always verify with your institution's specific policy." },
    { q:"How many classes can I miss safely?", a:"Safe Bunks = floor(Attended × 100 ÷ MinRequired - TotalHeld). For example, with 30/40 classes (75%), you can't skip any more without falling below 75%. With 38/40 (95%), you have room for several absences." },
    { q:"What does the Bunk Planner mode do?", a:"Bunk Planner shows exactly how many classes you can safely skip per subject without falling below your minimum attendance threshold. It also shows how many classes you need to attend to reach your target percentage." },
    { q:"How is attendance percentage calculated?", a:"Attendance % = (Classes Attended ÷ Total Classes Held) × 100. If you attended 36 out of 48 classes, your attendance = 75%. This is calculated per-subject and overall across all subjects." },
  ],
  "final-grade-calculator": [
    { q:"What grade do I need on my final exam?", a:"Required Grade = (Target% × TotalWeight - CompletedPoints) ÷ PendingWeight × 100. If your current weighted average is 78% with assignments worth 60%, and the final exam is 40%, you need 83.5% on the final to achieve 80% overall." },
    { q:"How do weighted grades work?", a:"Weighted grades multiply each component's score by its percentage weight. Example: Assignments (30% × 85) + Midterm (30% × 78) + Final (40% × ?) = overall. This ensures each component contributes proportionally to your final grade." },
    { q:"What is the best/worst case scenario?", a:"Best Case shows your maximum possible grade if you score 100% on all pending work. Worst Case shows your guaranteed minimum if you score 0% on all pending work. Your actual grade will fall between these two values." },
  ],
  "cgpa-percentage-calculator": [
    { q:"How do I convert CGPA to percentage?", a:"The standard formula is Percentage = CGPA × 9.5, used by many Indian universities per UGC guidelines. HEC Pakistan uses CGPA × 10. VTU Bangalore uses (CGPA × 10) - 5. Anna University uses CGPA × 10. Always verify with your specific institution." },
    { q:"Which CGPA formula should I use?", a:"Select your university system from the dropdown. If your university isn't listed, use Standard (×9.5) for most Indian universities, or ×10 for Pakistani universities. Many employers accept the standard ×9.5 formula." },
    { q:"What is the difference between CGPA and SGPA?", a:"CGPA (Cumulative Grade Point Average) is the overall average across all semesters. SGPA (Semester Grade Point Average) is the GPA for a single semester. CGPA is typically the weighted average of all SGPAs considering credits." },
  ],
  "ielts-band-calculator": [
    { q:"How is the IELTS overall band score calculated?", a:"The overall band is the average of the four sections (Listening, Reading, Writing, Speaking) rounded to the nearest 0.5. Averages that are exactly .25 or above round up. For example, an average of 6.625 rounds to 6.5, while 6.75 rounds to 7.0." },
    { q:"What IELTS score do I need for UK universities?", a:"Most UK universities require Band 6.5–7.5 overall with no section below 6.0 for undergraduate. Postgraduate programs and competitive universities typically require Band 7.0+. Oxford and Cambridge often require 7.5." },
    { q:"What is the difference between Academic and General IELTS?", a:"Academic IELTS is for university admission and professional registration. General Training is for work experience, secondary education, and immigration to Australia, Canada, and New Zealand. Both have the same Listening and Speaking tests; Reading and Writing differ." },
    { q:"Can I use raw scores for Listening and Reading?", a:"Yes! Switch to 'Raw Score' mode and enter the number of correct answers out of 40. The calculator converts these to official IELTS band scores using the official conversion table. Writing and Speaking must be entered as band scores (0–9 in 0.5 steps)." },
    { q:"What IELTS score do I need for Canada PR?", a:"For Canada Express Entry (Federal Skilled Worker), you need minimum CLB 7 which corresponds to IELTS 6.0 in all four sections. Higher scores earn more Comprehensive Ranking System (CRS) points." },
  ],
  "sat-score-calculator": [
    { q:"What is a good SAT score?", a:"The national average is around 1010–1060. A 1200 is above average (74th percentile), 1400 is very strong (95th percentile), and 1500+ is elite (98th+). 'Good' depends on your target universities — research average scores for admitted students." },
    { q:"What is the Digital SAT?", a:"The Digital SAT (launched 2024) replaced the paper SAT. It's shorter (2 hours 14 minutes vs. 3 hours), adaptive by section, and scored the same (400–1600). The Math section still covers Algebra, Advanced Math, Problem Solving & Data Analysis, and Geometry." },
    { q:"How is the SAT score converted to a percentile?", a:"Percentile rank shows what percentage of test takers you scored equal to or better than. A 1400 score is approximately the 95th percentile, meaning you scored higher than 95% of test takers. Percentiles are recalculated periodically by College Board." },
    { q:"How do I improve my SAT score?", a:"Targeted practice is most effective: identify weak areas using official practice tests, use Khan Academy's free personalized SAT prep (official College Board partner), and take 3+ full-length practice tests under real test conditions. Most students improve 50–150 points with 8+ weeks of dedicated prep." },
  ],
  "study-timer": [
    { q:"What is the Pomodoro Technique?", a:"Developed by Francesco Cirillo in the 1980s, the Pomodoro Technique uses 25-minute focused work sessions ('Pomodoros') separated by 5-minute breaks. After 4 Pomodoros, take a longer 15-30 minute break. Research shows this rhythm improves sustained attention and reduces mental fatigue." },
    { q:"How many Pomodoros should I do per day?", a:"Most productive people complete 8–12 Pomodoros (4–6 hours of focused work) per day. Quality matters more than quantity — consistent 2-hour daily sessions often outperform irregular 6-hour marathon sessions." },
    { q:"Can I customize the timer durations?", a:"Yes! Select 'Custom' mode to set your own focus, short break, and long break durations. Popular alternatives include 50/10 (Deep Work mode) and 15/3 (Short Burst mode). Research suggests 90-minute ultradian rhythms for complex problem-solving." },
  ],
  "target-gpa-calculator": [
    { q:"How do I calculate my target GPA?", a:"Required Future GPA = (Target × TotalCredits - CurrentGPA × CurrentCredits) ÷ FutureCredits. If your current GPA is 3.0 with 60 credits and you want 3.5 after 90 total credits, you need: (3.5×90 - 3.0×60) ÷ 30 = (315 - 180) ÷ 30 = 4.5 — which exceeds 4.0, making it impossible without more credits." },
    { q:"Can I realistically improve my GPA significantly in my final year?", a:"It depends on how many credits you've already earned. With 30 credits completed at 2.5 GPA, you can potentially reach 3.5 in the remaining 30 credits by earning a 4.5 (impossible). With fewer completed credits, more change is mathematically possible. Earlier action has exponentially more impact." },
    { q:"What GPA do I need for graduate school?", a:"Most graduate programs require a minimum 3.0 GPA. Competitive programs at top universities prefer 3.5+. Some professional programs (MBA, Law) weight undergraduate institution selectivity alongside GPA. A strong upward trend in your final semesters can offset a lower overall GPA." },
  ],
  "required-grade-calculator": [
    { q:"How do I calculate what grade I need on my final?", a:"Required Final Grade = (Target Overall% × TotalWeight - EarnedPoints) ÷ FinalWeight × 100. If you have 75% in a class (which is worth 70% of your grade) and want 80% overall, and your final is worth 30%: you need (80×100% - 75×70) ÷ 30 = (8000 - 5250) ÷ 30 = 91.7%." },
    { q:"What if the required grade exceeds 100%?", a:"If the required score is over 100%, your target grade is mathematically impossible with your current standing. You'll need to either lower your target, or accept that the best case scenario is your new maximum. The Best Case indicator shows your absolute maximum achievable grade." },
    { q:"How do I handle different grading scales?", a:"Select your institution's grading system from the Scale dropdown. US Letter Grade, UK Classification (First/2:1/2:2), German Grading (1–6), and Percentage-Only systems are all supported. The required grade and grade labels update automatically." },
  ],
  "scientific-calculator": [
    { q:"What is DEG vs RAD mode?", a:"DEG (degrees) uses the 360° system. RAD (radians) uses the 2π system. Most everyday calculations use degrees. Scientific and engineering formulas often use radians." },
    { q:"What operations does this calculator support?", a:"Basic arithmetic, trigonometric functions (sin, cos, tan), logarithms (log, ln), square root, exponents, constants (π, e), and parenthetical expressions." },
  ],
  "statistics-calculator": [
    { q:"What is the difference between mean and median?", a:"Mean is the arithmetic average. Median is the middle value when sorted. Median is more robust against outliers — use it when data is skewed." },
    { q:"What is standard deviation?", a:"Standard deviation measures how spread out values are from the mean. A low SD means data points cluster near the mean; high SD means they're spread out. About 68% of data falls within 1 SD of the mean." },
  ],
  "quadratic-calculator": [
    { q:"What is the quadratic formula?", a:"x = (-b ± √(b² - 4ac)) / 2a. It solves any equation of the form ax² + bx + c = 0 and gives up to two roots (solutions)." },
    { q:"What is the discriminant?", a:"The discriminant (Δ = b² - 4ac) determines the nature of roots. Δ > 0: two real roots. Δ = 0: one repeated root. Δ < 0: no real roots (complex roots)." },
  ],
  "pythagorean-calculator": [
    { q:"What is the Pythagorean theorem?", a:"a² + b² = c², where c is the hypotenuse (longest side) of a right triangle. It only applies to right-angled triangles (one 90° angle)." },
  ],
  "fraction-calculator": [
    { q:"How do I add fractions with different denominators?", a:"Find a common denominator by multiplying the denominators: a/b + c/d = (ad + bc) / bd. Then simplify by dividing numerator and denominator by their GCD." },
  ],
  "area-calculator": [
    { q:"How do I calculate the area of a circle?", a:"Area = π × r², where r is the radius. For example, a circle with radius 5cm has area = 3.14159 × 25 = 78.54 cm²." },
  ],
  "prime-number-checker": [
    { q:"What is a prime number?", a:"A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself. Examples: 2, 3, 5, 7, 11, 13. The number 2 is the only even prime." },
  ],
  "length-converter": [
    { q:"How do I convert inches to centimeters?", a:"Multiply inches by 2.54. For example, 12 inches = 12 × 2.54 = 30.48 cm. Conversely, divide cm by 2.54 to get inches." },
  ],
  "weight-converter": [
    { q:"How do I convert pounds to kilograms?", a:"Divide pounds by 2.205 (or multiply by 0.4536). For example, 150 lbs = 150 ÷ 2.205 = 68.04 kg." },
  ],
  "temperature-converter": [
    { q:"How do I convert Celsius to Fahrenheit?", a:"°F = (°C × 9/5) + 32. For example, 100°C = (100 × 1.8) + 32 = 212°F. For a quick estimate, double the Celsius and add 30." },
    { q:"What is absolute zero?", a:"Absolute zero is 0 Kelvin (-273.15°C / -459.67°F). It's the theoretical lowest possible temperature where all molecular motion stops." },
  ],
  "speed-converter": [
    { q:"How do I convert km/h to mph?", a:"Divide km/h by 1.609. For example, 100 km/h = 62.14 mph. To go the other way, multiply mph by 1.609." },
  ],
  "data-storage-converter": [
    { q:"What is the difference between KB and KiB?", a:"KB (kilobyte) = 1,000 bytes (decimal). KiB (kibibyte) = 1,024 bytes (binary). This calculator uses binary (1 KB = 1,024 B), which is how operating systems report storage." },
  ],
  "age-calculator": [
    { q:"How is exact age calculated?", a:"We calculate years, months, and days between your date of birth and today, accounting for varying month lengths and leap years for precise results." },
    { q:"How is zodiac sign determined?", a:"Zodiac signs are based on the position of the sun at birth. Each sign spans roughly 30 days. For example, Aries covers March 21 – April 19." },
  ],
  "date-difference-calculator": [
    { q:"How do I calculate business days between two dates?", a:"Count all days excluding Saturdays, Sundays, and public holidays. Our calculator has a business-days-only mode that handles this automatically." },
  ],
  "countdown-calculator": [
    { q:"How does the countdown timer work?", a:"Enter any future date and the calculator shows a live countdown in days, hours, minutes, and seconds — updating in real-time." },
  ],
  "work-hours-calculator": [
    { q:"How do I calculate monthly work hours?", a:"Daily hours × days per week × 52 weeks ÷ 12 months. For a standard 8h/day, 5 days/week: 8 × 5 × 52 ÷ 12 = 173.3 hours/month." },
  ],
  "fuel-cost-calculator": [
    { q:"How is fuel cost calculated?", a:"Fuel Cost = (Distance ÷ Fuel Efficiency) × Price per Litre. For example, a 200km trip at 15km/L with fuel at ₹100/L costs 200÷15×100 = ₹1,333." },
  ],
  "ev-charging-calculator": [
    { q:"How long does it take to charge an EV?", a:"Charge time = Battery Capacity (kWh) ÷ Charger Power (kW). A 60kWh battery on a 7kW home charger takes ~8.5 hours. DC fast chargers (50-150kW) can charge to 80% in 30-60 minutes." },
  ],
  "random-number-generator": [
    { q:"Are these random numbers truly random?", a:"We use the browser's crypto.getRandomValues() API, which provides cryptographically secure pseudo-random numbers suitable for most applications including games and simulations." },
  ],
  "password-generator": [
    { q:"What makes a strong password?", a:"Length (12+ characters), mix of uppercase, lowercase, numbers, and symbols. Our generator uses cryptographically secure randomness. A 16-character password with all character types has ~100 bits of entropy." },
    { q:"What is password entropy?", a:"Entropy measures password strength in bits. Higher = stronger. Entropy = Length × log₂(Character Set Size). 80+ bits is considered strong. 128+ bits is virtually uncrackable." },
  ],
  "roman-numeral-converter": [
    { q:"What is the range for Roman numerals?", a:"Standard Roman numerals represent numbers from 1 (I) to 3,999 (MMMCMXCIX). Numbers above 3,999 require vinculum notation (overline bars) which is not standard." },
  ],
  "word-counter": [
    { q:"How is reading time calculated?", a:"Average reading speed is ~200 words per minute (WPM) for adults. Speaking speed averages ~130 WPM. We calculate both reading and speaking time based on your word count." },
  ],
  "base64-encoder": [
    { q:"What is Base64 encoding?", a:"Base64 converts binary data into ASCII text using 64 characters (A-Z, a-z, 0-9, +, /). It's used to embed images in HTML/CSS, transmit data in URLs, and encode email attachments." },
    { q:"Does Base64 encrypt data?", a:"No. Base64 is encoding, not encryption. It's easily reversible and provides zero security. Anyone can decode Base64 text. Use encryption (AES, RSA) for security." },
  ],

  // ── NEW EDUCATION CALCULATOR FAQs ─────────────────────────────────────────
  "weighted-grade-calculator": [
    { q:"How is a weighted grade calculated?", a:"Weighted Grade = Σ(Score% × Weight%) / 100. Each component contributes proportionally based on its weight. For example, if assignments are 30% of your grade and you scored 85%, they contribute 25.5 points to your final grade out of 100." },
    { q:"What if my weights don't add up to 100%?", a:"If weights sum to less than 100%, the calculator shows a 'projected grade' based only on completed items, normalized against the total entered weight. This is useful for tracking your grade mid-semester before all components are assigned." },
    { q:"How does the what-if mode work?", a:"Leave a score blank for any pending assignment and enter a target grade. The calculator shows the exact score you need on that item to achieve your target. If multiple items are blank, the required score is distributed equally among them." },
    { q:"What's the difference between Weighted Grade and Final Grade calculators?", a:"The Weighted Grade Calculator is more general — you define any mix of components with custom weights. The Final Grade / Required Grade calculator focuses specifically on what you need on remaining work to hit a target. They complement each other." },
  ],
  "gre-score-calculator": [
    { q:"What is a good GRE score?", a:"The average GRE score is around 150 Verbal and 153 Quantitative. For competitive PhD programs, aim for 160+ Verbal and 165+ Quant. For professional Master's programs, 155+ in both is generally competitive. Always check median scores for admitted students at your specific program." },
    { q:"How is the GRE scored?", a:"Verbal and Quantitative Reasoning are each scored on a 130–170 scale in 1-point increments. Analytical Writing is scored 0–6 in 0.5-point increments. There is no penalty for wrong answers. Your total is the sum of Verbal + Quantitative (260–340); AWA is reported separately." },
    { q:"What is the difference between GRE raw and scaled scores?", a:"Raw scores are the number of questions you answer correctly. These are converted to scaled scores (130–170) using equating — a statistical process that adjusts for difficulty across test versions, ensuring scores from different test dates are comparable." },
    { q:"How long are GRE scores valid?", a:"GRE scores are valid for 5 years from the test date. You can send scores to up to 4 universities for free on test day; additional score reports cost $35 each. ETS's ScoreSelect option lets you choose which scores to send." },
  ],
  "toefl-score-calculator": [
    { q:"What is a good TOEFL score?", a:"Most US and UK universities require 80–100 for undergraduate and 90–105 for graduate admission. Top universities (MIT, Harvard, Oxbridge) typically require 100–110+. A score of 110+ is considered excellent. Each university sets its own minimum — always check requirements for your specific program." },
    { q:"How is the TOEFL iBT scored?", a:"Each section (Reading, Listening, Speaking, Writing) is scored 0–30. The total iBT score is the sum of all four sections, ranging from 0–120. Universities set their own minimum thresholds for admission — there is no single 'passing' score." },
    { q:"How does TOEFL compare to IELTS?", a:"TOEFL 100 ≈ IELTS 7.0; TOEFL 110 ≈ IELTS 7.5–8.0; TOEFL 80 ≈ IELTS 6.5. TOEFL is computer-based and American English focused; IELTS offers both paper and computer versions with both British and American English. Both are accepted by most universities worldwide." },
    { q:"What is MyBest™ Score?", a:"MyBest™ Score (SuperScore) combines your highest section scores from all TOEFL attempts within the past 2 years. For example, if you scored 24 Reading in one test and 27 Listening in another, your MyBest™ shows both highs. Many universities now accept MyBest™ scores." },
  ],
  "scholarship-gpa-planner": [
    { q:"How do I calculate the GPA I need each semester to qualify for a scholarship?", a:"Required Semester GPA = (Target GPA × Total Credits − Current GPA × Completed Credits) / Remaining Credits. Example: 2.8 GPA over 60 credits, need 3.2 over 120 credits → required = (3.2×120 − 2.8×60) / 60 = (384 − 168) / 60 = 3.6 per remaining semester." },
    { q:"What if the required semester GPA exceeds 4.0?", a:"If the required GPA per semester exceeds 4.0, the target is mathematically impossible with the given number of remaining semesters and credits. Options: enroll in additional semesters, take more credits per semester, or lower your target GPA." },
    { q:"What GPA is required for most scholarships?", a:"Merit scholarships typically require 3.0–3.5 GPA for renewal. Dean's List and honor scholarships usually require 3.5+. Full-ride scholarships at competitive universities often require 3.7–3.9+. Always verify the specific requirement in your scholarship agreement." },
    { q:"Does this calculator account for grade replacement or retakes?", a:"No — this calculator uses your current cumulative GPA as reported. If your school allows grade replacement for retaken courses, the effect is already reflected in your current GPA. The projection assumes future semesters contribute normally to cumulative GPA." },
  ],
  "assignment-grade-calculator": [
    { q:"How do I calculate my course grade from assignments?", a:"Course Grade = Σ(Assignment Score% × Assignment Weight%) across all items. Example: Homework (20% weight, 90%) + Midterm (35% weight, 78%) + Final (45% weight, 85%) = 18 + 27.3 + 38.25 = 83.55%." },
    { q:"What does 'Drop Lowest' do?", a:"Drop Lowest removes the assignment with the worst percentage score from the calculation and redistributes its weight proportionally among remaining items. This is common in courses where instructors drop one quiz or homework. Toggle it to see how your grade improves." },
    { q:"Why don't my weights sum to 100%?", a:"Many courses add assignments throughout the semester, so early in the term your total assigned weight may be less than 100%. In this case the calculator shows a 'projected grade' normalized against the sum of entered weights — your grade based on completed work only." },
    { q:"How do I calculate the impact of a single assignment?", a:"Each assignment's impact = (Score/MaxScore × Weight). The 'Impact' column shows exactly how many grade points each item adds to your final course grade. High-weight items with low scores have the biggest negative impact on your overall grade." },
  ],
  "cumulative-gpa-calculator": [
    { q:"How is cumulative GPA calculated across multiple semesters?", a:"Cumulative GPA = Total Quality Points / Total Credit Hours. Quality Points per semester = Semester GPA × Credit Hours. Example: Fall (3.2 GPA, 15 credits = 48 QP) + Spring (3.8 GPA, 18 credits = 68.4 QP) → Cumulative = 116.4 / 33 = 3.53." },
    { q:"Why is my cumulative GPA different from the average of my semester GPAs?", a:"Simple averaging is wrong unless you took exactly the same credits each semester. A 4.0 semester with 18 credits impacts your cumulative GPA much more than a 4.0 semester with 12 credits. Always weight by credit hours for accuracy." },
    { q:"How can I predict my future cumulative GPA?", a:"Use the 'Add Planned Semester' feature with expected GPA and credit hours for upcoming semesters. Example: current GPA 3.1 with 60 credits, planning 3.8 in 15 more credits → projected cumulative = (3.1×60 + 3.8×15) / 75 = 3.24." },
    { q:"What is the difference between SGPA and CGPA?", a:"SGPA (Semester GPA) reflects only that semester's courses. CGPA (Cumulative GPA) is your running weighted average across all completed semesters. CGPA is what appears on your official transcript and what graduate schools and employers evaluate." },
  ],
  "act-score-calculator": [
    { q:"What is a good ACT score?", a:"The national average ACT composite is around 20–21. A 24+ is above average (73rd percentile). A 30+ is very strong (93rd percentile). For highly selective universities, aim for 32–36. Research average scores for admitted students at your target schools." },
    { q:"How is the ACT composite score calculated?", a:"Composite ACT = average of English + Mathematics + Reading + Science (each 1–36), rounded to the nearest whole number. The optional Writing test (2–12) is NOT included in the composite. Many colleges allow superscoring — combining best section scores from multiple attempts." },
    { q:"What are ACT College Readiness Benchmarks?", a:"ACT's official benchmarks indicate readiness for first-year college courses: English 18 (50% chance of B+ in English Composition), Math 22 (College Algebra), Reading 22 (Social Sciences), Science 23 (Biology). Meeting all four is a strong indicator of college readiness." },
    { q:"Should I take the ACT or SAT?", a:"Both are accepted equally by US colleges. Take both once — most students score relatively higher on one test. ACT suits students stronger in science who prefer straightforward questions with time pressure. SAT suits those stronger in verbal reasoning and reading comprehension." },
  ],
  "test-score-calculator": [
    { q:"How do I convert marks to percentage?", a:"Percentage = (Marks Obtained / Total Maximum Marks) × 100. For multi-subject exams, calculate overall percentage using total obtained across all subjects divided by the total maximum — not the average of individual percentages, which would be mathematically incorrect." },
    { q:"What grading scale should I use?", a:"Select the scale that matches your institution. US Letter Grade is standard for American schools. Pakistani/Indian uses Distinction (80%+), A1 (70%+), A (60%+). UK uses First (70%+), Upper Second (60%+), Lower Second (50%+). Custom lets you set your own pass threshold." },
    { q:"What is a distinction in Pakistani and Indian grading?", a:"In most Pakistani and Indian university systems: Distinction = 80%+, A1 = 70–79%, A = 60–69%, B = 50–59%, C = 40–49%, Fail = below 40%. Standards vary significantly by university and board — always verify with your institution's specific grading policy." },
    { q:"How do I calculate GPA equivalent from a percentage?", a:"Approximate 4.0 scale: A+(97-100%)=4.0, A(93-96%)=4.0, A-(90-92%)=3.7, B+(87-89%)=3.3, B(83-86%)=3.0, B-(80-82%)=2.7, C+(77-79%)=2.3, C(73-76%)=2.0, D(60-69%)=1.0, F(below 60%)=0.0." },
  ],
  "gpa-converter": [
    { q:"How do I convert a 4.0 GPA to a 10-point scale?", a:"Normalize your GPA to a 0–1 range: normalized = GPA / 4.0. Then multiply by 10: 10-point = normalized × 10. Example: 3.5/4.0 = 0.875 × 10 = 8.75. Note: many Indian universities use CGPA × 9.5 for percentage conversion, which is different from this scale conversion." },
    { q:"How does the German grading scale work?", a:"German grades are inverse — 1.0 is the best (equivalent to A+) and 5.0 is fail (equivalent to F). Conversion: normalized = (5 - german_grade) / 4. So a German 1.3 = (5-1.3)/4 = 0.925 normalized ≈ 3.7 on a 4.0 scale." },
    { q:"What is the Australian 7-point GPA scale?", a:"Australian universities use a 7-point scale: 7=High Distinction (85%+), 6=Distinction (75-84%), 5=Credit (65-74%), 4=Pass (50-64%), 1-3=Fail. Approximate conversion: Australian 7 ≈ US 4.0, Australian 5 ≈ US 3.0, Australian 4 ≈ US 2.0." },
    { q:"Is my international GPA accepted by universities abroad?", a:"Most Western universities accept international transcripts and use professional evaluators (WES in North America, NARIC in UK) to assess foreign credentials. Always include both your native GPA on its scale AND the converted equivalent, along with official transcripts." },
  ],
  "class-rank-calculator": [
    { q:"How is class rank estimated?", a:"Class rank estimates how many classmates have a higher GPA than you (students above), then adds 1 (rank = students above + 1). Based on a GPA distribution for your school type, the calculator interpolates within each GPA bucket to provide an estimated rank and percentile." },
    { q:"Do all high schools report class rank?", a:"No — roughly 40% of US high schools no longer report class rank. In that case, this calculator gives an estimated rank for applications to schools that ask. Test scores and GPA matter more than rank at most colleges, especially those with test-optional policies." },
    { q:"What class rank do I need for selective colleges?", a:"Most highly selective universities (top 25) prefer students in the top 10%. State flagship universities often auto-admit the top 10-25%. For top-50 universities, top 25% is generally competitive alongside strong test scores." },
    { q:"How do I find my actual class rank?", a:"Your actual class rank is determined by your school's registrar using official grade data for your entire class. Ask your school counselor — they can provide your official rank or percentile, which carries much more weight than any estimated rank tool." },
  ],
  "study-schedule-planner": [
    { q:"How does the study schedule planner allocate hours?", a:"Hours are allocated proportionally based on a Priority × Difficulty weight matrix (High+Hard=9 down to Low+Easy=1). Each subject's share = (subject weight / total weight) × your weekly available hours. More urgent and harder subjects automatically receive more study time." },
    { q:"How many hours should I study per day?", a:"Research suggests 4–6 hours of focused, high-quality study per day is optimal for most students. More than 6 hours yields diminishing returns. Consistency matters more than volume — 2 hours daily for a month beats 14 hours the night before an exam." },
    { q:"What's the best way to distribute study sessions?", a:"Aim for no more than 2-hour blocks per subject with 10-minute breaks. Study the most difficult subject first when your focus is sharpest. Leave the 1–2 days before each exam for review and practice questions, not new material." },
    { q:"Should I study all subjects every day?", a:"Not necessarily. For subjects with exams far away (>2 weeks), every other day is sufficient. Focus more daily time on subjects with exams within 1 week. Spaced repetition — reviewing material at increasing intervals — significantly improves long-term retention versus daily cramming." },
  ],
  "gmat-score-calculator": [
    { q:"What is the GMAT Focus Edition?", a:"Launched in 2024, the GMAT Focus Edition replaced the legacy GMAT. It's shorter (2 hours 15 minutes), has three sections — Quantitative Reasoning, Verbal Reasoning, Data Insights (each 60–90) — and a total score of 205–805. Integrated Reasoning and Analytical Writing were removed." },
    { q:"What GMAT score do I need for top MBA programs?", a:"M7 programs (Harvard, Wharton, Booth, Kellogg, Sloan, Columbia, Stanford) typically see median GMAT scores of 720–740. Top-25 programs average 680–720. Top-50 programs average 640–680. Always aim to be at or above the published median score for your target school." },
    { q:"How are GMAT Focus Edition scores converted from the legacy GMAT?", a:"GMAC provides an official concordance table. Approximately: Focus 805 ≈ Legacy 800; Focus 755 ≈ Legacy 750; Focus 705 ≈ Legacy 700; Focus 655 ≈ Legacy 650. Always check your target school's stated policy on which format they accept." },
    { q:"How many times can I take the GMAT?", a:"You can take the GMAT up to 5 times in a rolling 12-month period, with a maximum of 8 lifetime attempts. A significant improvement (50+ points) on a retake generally helps your application." },
  ],
  "pass-fail-calculator": [
    { q:"How do I calculate what score I need to pass?", a:"Required Score = (Pass Mark × 100 − Current Average × Completed Weight%) / Remaining Weight% × 100. Example: pass mark 50%, current average 40% on 60% completed weight, remaining 40%: required = (50×100 − 40×60) / 40 = (5000 − 2400) / 40 = 65%." },
    { q:"What if the required score is over 100%?", a:"If the required score exceeds 100%, your current standing makes passing mathematically impossible. Options: speak to your instructor about extra credit, consider course withdrawal before the deadline, or plan to retake the course next semester." },
    { q:"What does 'Guaranteed Pass' mean?", a:"Guaranteed Pass means even if you score 0% on all remaining assessments, you will still pass based on your current standing. It doesn't mean you should stop studying — a higher grade may affect your GPA, scholarship eligibility, or academic standing." },
    { q:"How does assessment weight affect my passing chances?", a:"High-weight assessments (like finals worth 40–50%) dramatically affect your outcome. If a large portion of your grade is still pending, your current average is less predictive. The calculator accounts for the exact weight of remaining work to give an accurate required score." },
  ],
  "reading-level-calculator": [
    { q:"What is the Flesch-Kincaid grade level?", a:"FK Grade Level = 0.39×(words/sentences) + 11.8×(syllables/words) − 15.59. It estimates what US school grade a student needs to understand the text easily. A result of '8' means an 8th grader (age 13-14) should understand it without difficulty." },
    { q:"What is the Flesch Reading Ease score?", a:"Reading Ease scores text 0–100: 90–100 is very easy (5th grade), 60–70 is standard (8th–9th grade), 30–50 is difficult (college level), 0–30 is very confusing (graduate level). Higher scores = easier to read. Most newspapers target 60–70." },
    { q:"How are syllables counted?", a:"The calculator approximates syllables by counting groups of consecutive vowels (a, e, i, o, u) in each word, with adjustments for common patterns. This approximation is accurate enough for Flesch-Kincaid analysis — typically within 3–5% of manual counts." },
    { q:"What reading level should my academic essay be?", a:"Academic writing for college and above typically falls between grade levels 12–16. However, clarity is more important than complexity — even scholarly writing benefits from shorter sentences and precise vocabulary. Grade level 10–13 is considered clear academic writing." },
  ],
  "college-admission-estimator": [
    { q:"How accurate is the college admission estimator?", a:"This tool provides rough estimates only. Real admissions decisions involve dozens of holistic factors including personal essays, letters of recommendation, demonstrated interest, institutional priorities, geographic diversity, first-generation status, and more. Use this as a framework, not a prediction." },
    { q:"What is a Safety, Match, and Reach school?", a:"Safety school: your academic profile exceeds their median admitted student. Match school: your profile aligns with their typical admitted student. Reach school: your profile is below or at their median — admission is possible but uncertain. Aim for 2–3 of each category." },
    { q:"How much do extracurriculars affect college admission?", a:"At highly selective schools (acceptance rate < 20%), extracurriculars can be the differentiating factor among academically similar candidates. Depth matters more than breadth — sustained commitment to 2–3 activities with leadership roles carries more weight than superficial participation in many." },
    { q:"Does legacy status help with college admission?", a:"Studies show legacy status provides a modest advantage at some private universities, though many are moving away from this practice. Even with legacy status, you still need competitive academic credentials. Public universities generally give no advantage for legacy applicants." },
  ],
};
