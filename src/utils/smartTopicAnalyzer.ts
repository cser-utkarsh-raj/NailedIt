/**
 * Smart Topic Analyzer for Banking Digests
 * Automatically analyzes any blog or YouTube title to determine category, 
 * color theme, motif icon, topic pills, and suggested subtitle.
 */

import { BgStyle, IconMotif } from '../types';

export interface AnalyzedTopicResult {
  category: string;
  subtitle: string;
  bgStyle: BgStyle;
  iconMotif: IconMotif;
  keyPills: string;
  thematicArtName: string;
}

export function analyzeHeading(heading: string): AnalyzedTopicResult {
  const text = (heading || '').toLowerCase();

  // 1. Types of Charges / Securities / Loans / Mortgages
  if (
    text.includes('charge') ||
    text.includes('securit') ||
    text.includes('hypothecation') ||
    text.includes('pledge') ||
    text.includes('mortgage') ||
    text.includes('lien') ||
    text.includes('assignment') ||
    text.includes('sarfaesi')
  ) {
    return {
      category: 'BANKING LAW & CREDIT APPRAISAL',
      subtitle: 'Hypothecation, Pledge, Mortgage, Lien & Assignment Rules',
      bgStyle: 'navy',
      iconMotif: 'scales',
      keyPills: 'HYPOTHECATION • PLEDGE • MORTGAGE • LIEN • ASSIGNMENT',
      thematicArtName: 'loan_contract'
    };
  }

  // 2. RBI Circulars / Master Directions / Repo Rate / Monetary Policy
  if (
    text.includes('rbi') ||
    text.includes('repo') ||
    text.includes('monetary') ||
    text.includes('mpc') ||
    text.includes('master direction') ||
    text.includes('circular') ||
    text.includes('crr') ||
    text.includes('slr') ||
    text.includes('governor')
  ) {
    return {
      category: 'RBI CIRCULARS & GUIDELINES',
      subtitle: 'Regulatory Framework, Prudential Norms & Compliance',
      bgStyle: 'rbi',
      iconMotif: 'bank',
      keyPills: 'PRUDENTIAL NORMS • MASTER CIRCULAR • REPO RATE',
      thematicArtName: 'rbi_columns'
    };
  }

  // 3. MSME / Priority Sector / Agriculture / Mudra / Govt Schemes
  if (
    text.includes('msme') ||
    text.includes('priority sector') ||
    text.includes('psl') ||
    text.includes('mudra') ||
    text.includes('cgtmse') ||
    text.includes('agriculture') ||
    text.includes('kcc') ||
    text.includes('subsidy') ||
    text.includes('scheme')
  ) {
    return {
      category: 'MSME & GOVT SCHEMES',
      subtitle: 'Classification Norms, Guarantee Cover & Credit Flow',
      bgStyle: 'emerald',
      iconMotif: 'chart',
      keyPills: 'CGTMSE • RESTRUCTURE • CLUSTER FINANCING',
      thematicArtName: 'growth_chart'
    };
  }

  // 4. Digital Banking / UPI / Fintech / Cyber Security / AI / Core Banking
  if (
    text.includes('digital') ||
    text.includes('upi') ||
    text.includes('fintech') ||
    text.includes('cyber') ||
    text.includes('cbdc') ||
    text.includes('rupee') ||
    text.includes('cbs') ||
    text.includes('ai') ||
    text.includes('api') ||
    text.includes('fraud') ||
    text.includes('security')
  ) {
    return {
      category: 'DIGITAL BANKING & FINTECH',
      subtitle: 'API Banking, Cyber Resilience & Digital Architecture',
      bgStyle: 'digital',
      iconMotif: 'chip',
      keyPills: 'UPI • ZERO TRUST • API SECURITY • 24x7 RTGS',
      thematicArtName: 'digital_chip'
    };
  }

  // 5. Letter of Credit / Bank Guarantee / Trade Finance / Forex / FEMA
  if (
    text.includes('letter of credit') ||
    text.includes('lc') ||
    text.includes('guarantee') ||
    text.includes('bg') ||
    text.includes('forex') ||
    text.includes('fema') ||
    text.includes('incoterms') ||
    text.includes('export') ||
    text.includes('import') ||
    text.includes('swift')
  ) {
    return {
      category: 'TRADE FINANCE & FOREX',
      subtitle: 'UCPDC 600, Invocation Norms & FEMA Compliance',
      bgStyle: 'corporate',
      iconMotif: 'doc',
      keyPills: 'UCPDC 600 • INVOCATION • INJUNCTION NORMS',
      thematicArtName: 'trade_doc'
    };
  }

  // 6. Economics / Inflation / GDP / Fiscal / Stock Market / Banking Exams
  if (
    text.includes('inflation') ||
    text.includes('gdp') ||
    text.includes('fiscal') ||
    text.includes('economic') ||
    text.includes('budget') ||
    text.includes('tax') ||
    text.includes('npa') ||
    text.includes('sma') ||
    text.includes('jaiib') ||
    text.includes('caiib')
  ) {
    return {
      category: 'MACROECONOMICS & BANKING EXAMS',
      subtitle: 'Concepts, Analytical Case Studies & Exam Highlights',
      bgStyle: 'dark',
      iconMotif: 'rupee',
      keyPills: 'CORE CONCEPTS • EXAM DIGEST • CASE STUDY',
      thematicArtName: 'rupee_vault'
    };
  }

  // Default fallback
  return {
    category: 'BANKING & FINANCIAL DIGEST',
    subtitle: 'Knowledge, Analysis & Practical Case Studies for Bankers',
    bgStyle: 'navy',
    iconMotif: 'bank',
    keyPills: 'KNOWLEDGE DIGEST • CASE ANALYSIS • POLICY NORMS',
    thematicArtName: 'banking_pillars'
  };
}

/**
 * Converts a HTML5 canvas element to WebP blob and returns dataURL + estimated size
 */
export async function exportCanvasAsWebP(
  canvas: HTMLCanvasElement, 
  quality = 0.92
): Promise<{ dataUrl: string; sizeKb: number; mime: string }> {
  return new Promise((resolve) => {
    // Check if browser supports WebP canvas export
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          // Fallback to PNG if WebP fails
          const pngUrl = canvas.toDataURL('image/png', 1.0);
          const size = Math.round((pngUrl.length * 3) / 4 / 1024);
          resolve({ dataUrl: pngUrl, sizeKb: size, mime: 'image/png' });
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          const sizeKb = Math.round(blob.size / 1024);
          resolve({ dataUrl, sizeKb, mime: 'image/webp' });
        };
        reader.readAsDataURL(blob);
      }, 'image/webp', quality);
    } catch {
      const pngUrl = canvas.toDataURL('image/png', 1.0);
      const size = Math.round((pngUrl.length * 3) / 4 / 1024);
      resolve({ dataUrl: pngUrl, sizeKb: size, mime: 'image/png' });
    }
  });
}
