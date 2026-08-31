/**
 * Curated Banking, Economics, Commerce & Financial Facts for Social Media & Video Reels
 */

import { SocialReelItem } from '../types';

export const INITIAL_SOCIAL_ITEMS: SocialReelItem[] = [
  {
    id: 'reel-1',
    title: 'Why Banks Prefer Hypothecation Over Pledge for Vehicle Loans',
    hook: 'Did you know why you get to drive your car even though the bank financed 85% of it?',
    category: 'BANKING LAW & CREDIT',
    factBite: 'In a Pledge, the lender keeps physical possession (like Gold Loans). In Hypothecation, possession stays with the borrower, but the charge is registered with RTO & CERSAI under SARFAESI.',
    keyPoints: [
      'Pledge = Physical custody with Bank (e.g. Gold, Warehouse receipts).',
      'Hypothecation = Borrower uses the asset (Car, Factory inventory).',
      'If defaulted, Bank has statutory repossession rights under SARFAESI Act 2002.'
    ],
    takeaway: 'Charge registration creates legal protection without stopping borrower commerce.',
    format: 'reel_vertical',
    audioTrack: 'corporate_ambient',
    platforms: ['instagram', 'facebook'],
    status: 'queued',
    scheduledDate: 'Today at 6:30 PM',
    caption: 'Ever wondered why you drive your car while the bank holds the loan? Here is the legal difference between Hypothecation and Pledge every banker & borrower should know! 🚗💼 #BankingDigests #BankingLaw #CreditAppraisal #SARFAESI',
    hashtags: ['#BankingLaw', '#CreditAppraisal', '#Hypothecation', '#SARFAESI', '#BankingExams', '#JAIIB', '#CAIIB'],
    bgTheme: 'navy',
    iconMotif: 'scales'
  },
  {
    id: 'reel-2',
    title: 'How RBI Controls Inflation Using the Repo Rate',
    hook: 'What happens in the economy when the RBI raises the Repo Rate by 25 basis points?',
    category: 'MONETARY POLICY & MACRO',
    factBite: 'Repo Rate is the interest rate at which commercial banks borrow short-term funds from RBI. When Repo rises, bank borrowing costs climb, cooling credit demand and checking inflation.',
    keyPoints: [
      'Repo Rate Hikes = Higher EMIs & tighter money supply.',
      'Reverse Repo = Rate RBI pays banks for parking surplus liquidity.',
      'Monetary Policy Committee (MPC) meets bi-monthly to target 4% (±2%) CPI inflation.'
    ],
    takeaway: 'A higher repo rate curbs runaway demand but increases home loan EMI tenures.',
    format: 'reel_vertical',
    audioTrack: 'lofi_study',
    platforms: ['instagram', 'facebook'],
    status: 'queued',
    scheduledDate: 'Tomorrow at 10:00 AM',
    caption: 'How a tiny 25 bps hike by RBI affects your monthly home loan EMI and national inflation. Save this for JAIIB/CAIIB and banking exams! 📈🏛️ #RBIPolicy #RepoRate #Economics #BankingTips',
    hashtags: ['#RepoRate', '#RBI', '#MonetaryPolicy', '#Macroeconomics', '#HomeLoans', '#FinanceFacts'],
    bgTheme: 'rbi',
    iconMotif: 'bank'
  },
  {
    id: 'reel-3',
    title: 'Why Indian Currency Notes Say "I Promise to Pay the Bearer"',
    hook: 'Have you ever noticed this line signed by the RBI Governor on a ₹500 note?',
    category: 'CENTRAL BANKING & COMMERCE',
    factBite: 'Indian banknotes are legal tender fiat currency backed by Section 26 of the RBI Act 1934. The Governor’s promise confirms the note is backed by national gold, sovereign securities, and forex reserves.',
    keyPoints: [
      'Section 26 guarantees unconditional sovereign value.',
      'Backed by Assets: Foreign currency, Gold bullions & Govt bonds.',
      'Only ₹1 notes are signed by the Finance Secretary, all others by RBI Governor.'
    ],
    takeaway: 'Fiat currency derives value from sovereign trust and statutory reserve backing.',
    format: 'carousel_post',
    audioTrack: 'deep_focus',
    platforms: ['instagram', 'facebook'],
    status: 'published',
    scheduledDate: 'Yesterday',
    caption: 'The secret law behind "I promise to pay the bearer" printed on your rupee notes! Did you know only ₹1 notes carry the Finance Secretary signature? 💵🔍 #Rupee #RBIAct #CommerceFacts #BankingKnowledge',
    hashtags: ['#IndianRupee', '#RBIAct1934', '#CentralBanking', '#FinancialLiteracy', '#BankingDigests'],
    bgTheme: 'dark',
    iconMotif: 'rupee'
  },
  {
    id: 'reel-4',
    title: 'Difference Between Letter of Credit (LC) and Bank Guarantee (BG)',
    hook: 'Trade Finance 101: When should an enterprise use an LC vs a BG?',
    category: 'TRADE FINANCE & FOREX',
    factBite: 'An LC is a primary payment mechanism used in international trade where the bank pays upon document presentation. A BG is a secondary safety net triggered only if the applicant defaults on performance.',
    keyPoints: [
      'Letter of Credit (LC) = Primary payment tool governed by UCPDC 600.',
      'Bank Guarantee (BG) = Secondary contingency assurance (Financial vs Performance).',
      'Under Indian law, court injunctions against unconditional BGs are strictly rare.'
    ],
    takeaway: 'LC guarantees payment upon compliant shipping; BG pays only upon contractual default.',
    format: 'reel_vertical',
    audioTrack: 'fintech_beat',
    platforms: ['instagram', 'facebook'],
    status: 'draft',
    scheduledDate: 'Friday at 7:00 PM',
    caption: 'LC vs BG explained in 45 seconds! Essential knowledge for trade finance officers and corporate borrowers. 🌐📦 #TradeFinance #LetterOfCredit #BankGuarantee #UCPDC600',
    hashtags: ['#TradeFinance', '#LC', '#BankGuarantee', '#Forex', '#CorporateBanking'],
    bgTheme: 'corporate',
    iconMotif: 'doc'
  },
  {
    id: 'reel-5',
    title: 'Digital Rupee (e-Rupee CBDC) vs UPI: What is the Real Difference?',
    hook: 'Why did RBI launch the Digital Rupee when India already has the world-beating UPI?',
    category: 'DIGITAL BANKING & FINTECH',
    factBite: 'UPI is a payment transfer rail moving money between commercial bank accounts. Digital Rupee (CBDC) is actual legal tender currency in digital token form held in a direct sovereign wallet.',
    keyPoints: [
      'UPI = Payment Highway between bank deposits (Inter-bank settlement).',
      'CBDC = The digital cash token itself (Direct sovereign liability of RBI).',
      'No bank intermediation risk in CBDC wallets; programmable offline transfers.'
    ],
    takeaway: 'UPI moves bank balance; CBDC represents digital sovereign currency units directly.',
    format: 'reel_vertical',
    audioTrack: 'fintech_beat',
    platforms: ['instagram', 'facebook'],
    status: 'draft',
    scheduledDate: 'Saturday at 11:00 AM',
    caption: 'Digital Rupee (CBDC) vs UPI: Why do we need both? Understand the revolution in sovereign digital currency! ⚡📱 #CBDC #DigitalRupee #UPI #Fintech #RBI',
    hashtags: ['#CBDC', '#DigitalRupee', '#UPI', '#Fintech', '#DigitalBanking'],
    bgTheme: 'digital',
    iconMotif: 'chip'
  }
];

export const BANKING_TOPIC_CATEGORIES = [
  'Banking Law & Credit Appraisal',
  'RBI Circulars & Monetary Policy',
  'Macroeconomics & Commerce',
  'Digital Banking & Fintech',
  'Trade Finance & Forex',
  'MSME & Priority Sector Lending',
  'JAIIB / CAIIB Exam Digest'
];
