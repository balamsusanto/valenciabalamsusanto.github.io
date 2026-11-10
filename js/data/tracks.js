/* "One role, one project" cards on the home page. Each stat must match the project's page in projects.js. */

export const tracks = [
  {
    role: 'Business Analyst & Consulting',
    slug: 'electronics-sales',
    stat: '+35%',
    statLabel: 'demand at 20–30% off vs no discount, in the same category and at the same price',
    why: 'An interactive dashboard on 8,149 Amazon products showing a seller where revenue sits, which discounts work and what to pair.',
  },
  {
    role: 'Financial Analyst',
    slug: 'loan-approval',
    stat: '11×',
    statLabel: 'how often the riskiest tenth of borrowers defaulted, compared with the safest tenth',
    why: "A default-risk model on 546,000 real loans that ranks borrowers better than Lending Club's own grades.",
  },
  {
    role: 'Financial Analyst',
    slug: 'gold-risk-ranges',
    stat: '95.8%',
    statLabel: 'of hourly prices inside my 95% risk range over six unseen weeks',
    why: 'Risk ranges for gold in Hong Kong dollars that hit their target on unseen weeks, plus a test showing an LSTM could not predict the price.',
  },
];
