import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src/components');
const canvas = path.join(root, 'canvas');

const replacements = {
  'professional.ts': `corporate: {
      bgTop: '#07162F',
      bgBottom: '#102E5C',
      cardBg: 'rgba(9, 25, 52, 0.90)',
      cardBorder: 'rgba(96, 165, 250, 0.24)',
      ink: '#F8FAFF',
      muted: '#B9C9E2',
      accent: '#4F8CFF',
      accentSoft: 'rgba(79, 140, 255, 0.16)',
      pillBg: 'rgba(79, 140, 255, 0.10)',
      pillBorder: 'rgba(96, 165, 250, 0.34)',
      gold: '#60A5FA',
    },`,
  'minimalistic.ts': `corporate: {
    bg: '#081832',
    cardBg: '#10264A',
    ink: '#F8FAFF',
    muted: '#B8C8E0',
    line: 'rgba(148, 163, 184, 0.22)',
    accent: '#4F8CFF',
    pillBg: 'rgba(79, 140, 255, 0.10)',
    pillBorder: 'rgba(96, 165, 250, 0.34)',
  },`,
  'ethereal.ts': `corporate: { bg: '#081832', panel: '#10264A', ink: '#F8FAFF', muted: '#B8C8E0', accent: '#5B9CFF', line: 'rgba(96,165,250,.28)' },`,
  'bohemian.ts': `corporate: {
    background: '#081832',
    paper: '#10264A',
    ink: '#F8FAFF',
    muted: '#B8C8E0',
    accent: '#5B9CFF',
    accentSoft: 'rgba(91, 156, 255, 0.16)',
    line: 'rgba(148, 163, 184, 0.22)',
    pillBg: 'rgba(91, 156, 255, 0.10)',
    pillBorder: 'rgba(96, 165, 250, 0.34)',
  },`,
  'techSaas.ts': `corporate: { primary: '#5B9CFF', glow: 'rgba(91, 156, 255, 0.24)', bg: '#081832' },`,
  'youtubeBold.ts': `corporate: { bg: '#081832', text: '#F8FAFF', accent: '#5B9CFF', blockText: '#07162F', glow: '#2563EB' },`,
};

for (const [file, replacement] of Object.entries(replacements)) {
  const filePath = path.join(canvas, file);
  let source = fs.readFileSync(filePath, 'utf8');
  // Corporate entries are formatted both as compact one-line objects and multiline objects.
  const corporatePattern = /corporate\s*:\s*\{[\s\S]*?\},/m;
  if (!corporatePattern.test(source)) throw new Error(`Corporate palette not found in ${file}`);
  source = source.replace(corporatePattern, replacement);
  fs.writeFileSync(filePath, source);
}

// Minimalistic footer: labels only. No artificial [01] / [02] / [03] tracking.
{
  const filePath = path.join(canvas, 'minimalistic.ts');
  let source = fs.readFileSync(filePath, 'utf8');
  const footerPattern = /\n  \/\/ --- 8\. SWISS MODERNIST FOOTER LINKS ---[\s\S]*?(?=\n};\n)/;
  const footer = `
  // --- 8. SWISS MODERNIST FOOTER LINKS ---
  if (props.showFooterLinks !== false && props.footerLinks && props.footerLinks.length > 0) {
    const rawLinks = props.footerLinks.slice(0, 4).filter(Boolean);
    if (rawLinks.length > 0) {
      ctx.save();
      const footerY = botY - (isPortrait ? 20 : 12);
      const fontSz = isPortrait ? 16 : 12;
      ctx.font = \`600 \${fontSz}px "Space Grotesk", "Plus Jakarta Sans", sans-serif\`;
      ctx.fillStyle = palette.muted;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      let curX = padX + 24;
      rawLinks.forEach((link) => {
        const { label } = getLinkIconAndLabel(link);
        const itemW = ctx.measureText(label).width + (isPortrait ? 24 : 16);
        const itemH = isPortrait ? 32 : 22;
        if (curX + itemW > width - padX - 20 && curX > padX + 24) return;
        ctx.fillStyle = palette.cardBg;
        ctx.fillRect(curX, footerY - itemH / 2, itemW, itemH);
        ctx.strokeStyle = palette.pillBorder;
        ctx.lineWidth = 1;
        ctx.strokeRect(curX, footerY - itemH / 2, itemW, itemH);
        ctx.fillStyle = palette.ink;
        ctx.fillText(label, curX + (isPortrait ? 10 : 8), footerY);
        curX += itemW + (isPortrait ? 10 : 8);
      });
      ctx.restore();
    }
  }
`;
  if (!footerPattern.test(source)) throw new Error('Minimalistic footer block not found');
  source = source.replace(footerPattern, footer);
  fs.writeFileSync(filePath, source);
}

// Shared Role/Title card: never use a near-white card. It must remain quiet against every theme.
{
  const filePath = path.join(root, 'ThumbnailCanvas.tsx');
  let source = fs.readFileSync(filePath, 'utf8');
  const roleStart = source.indexOf('const renderSpeakerIdentity =');
  const roleEnd = source.indexOf('\n\n/** Normalize legacy light Corporate bases', roleStart);
  if (roleStart < 0 || roleEnd < 0) throw new Error('Shared role card block not found');

  const role = `const renderSpeakerIdentity = (ctx: CanvasRenderingContext2D, width: number, height: number, props: ThumbnailCanvasProps) => {
  if (!props.showSpeaker) return;
  const needsName = props.template === 'youtube_bold' || props.template === 'tech_saas';
  const needsRole = props.template === 'minimalistic' || props.template === 'bohemian' || props.template === 'youtube_bold' || props.template === 'tech_saas';
  if ((!needsName || !props.speakerName) && (!needsRole || !props.speakerRole)) return;

  const portrait = height > width;
  const cardW = Math.min(portrait ? width * .82 : 350, width - 48);
  const cardH = portrait ? 88 : 68;
  const x = portrait ? (width - cardW) / 2 : width * .58;
  const y = Math.max(24, height - cardH - (portrait ? 88 : 58));
  const accent = props.bgStyle === 'crimson' ? '#FB7185' : props.bgStyle === 'emerald' ? '#34D399' : props.bgStyle === 'digital' ? '#22D3EE' : props.bgStyle === 'corporate' ? '#5B9CFF' : props.bgStyle === 'obsidian' ? '#FACC15' : '#818CF8';

  ctx.save();
  roundRectPath(ctx, x, y, cardW, cardH, 12);
  ctx.fillStyle = 'rgba(8, 18, 36, 0.92)';
  ctx.fill();
  ctx.strokeStyle = \`\${accent}55\`;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = accent;
  roundRectPath(ctx, x, y, 3, cardH, 2);
  ctx.fill();

  let cy = y + 15;
  if (needsName && props.speakerName) {
    ctx.font = \`700 \${portrait ? 21 : 16}px "Plus Jakarta Sans", "Inter", sans-serif\`;
    ctx.fillStyle = '#F8FAFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(props.speakerName, x + 17, cy, cardW - 28);
    cy += portrait ? 29 : 23;
  }
  if (needsRole && props.speakerRole) {
    ctx.font = \`600 \${portrait ? 13 : 11}px "Plus Jakarta Sans", "Inter", sans-serif\`;
    ctx.fillStyle = accent;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(props.speakerRole.toUpperCase(), x + 17, cy, cardW - 28);
  }
  ctx.restore();
};`;
  source = source.slice(0, roleStart) + role + source.slice(roleEnd);

  const normalizePattern = /\n\/\*\* Normalize legacy light Corporate bases[\s\S]*?\n};\n\nconst applyThemeTone/;
  if (!normalizePattern.test(source)) throw new Error('Legacy Corporate normalization not found');
  source = source.replace(normalizePattern, '\nconst applyThemeTone');
  source = source.replace(/\n\s*if \(props\.bgStyle === 'corporate'\) normalizeCorporateBackground\(ctx, canvas\);/, '');
  fs.writeFileSync(filePath, source);
}

console.log('Design repair applied successfully.');
