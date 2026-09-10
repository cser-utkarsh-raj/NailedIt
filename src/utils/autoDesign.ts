import { BgStyle, CanvasTemplate, PostData } from '../types';

export type DesignPlan = {
  template: CanvasTemplate;
  bgStyle: BgStyle;
  title: string;
  subtitle: string;
  category: string;
  keyPills: string;
  showKeyPills: boolean;
  textScale: number;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const words = (value: string) => value.toUpperCase().replace(/[^A-Z0-9&+ ]/g, ' ').split(/\s+/).filter(Boolean);

const stopWords = new Set(['THE','A','AN','AND','OR','OF','TO','IN','ON','FOR','WITH','FROM','YOUR','YOU','IS','ARE','HOW','WHY','WHAT','THIS','THAT','IT','MY','OUR','THEIR']);

export function extractHook(title: string): string {
  const source = words(title);
  if (!source.length) return 'YOUR STORY';
  const meaningful = source.filter(w => !stopWords.has(w));
  const picked = (meaningful.length >= 2 ? meaningful : source).slice(0, 4);
  return picked.join(' ');
}

export function inferCategory(post: Pick<PostData, 'title' | 'subtitle' | 'category'>): string {
  if (post.category?.trim()) return post.category.trim().toUpperCase();
  const text = `${post.title} ${post.subtitle}`.toLowerCase();
  if (/ai|machine learning|software|code|developer|app|saas|tech/.test(text)) return 'TECHNOLOGY';
  if (/business|startup|growth|leadership|marketing|sales|finance/.test(text)) return 'BUSINESS';
  if (/design|creative|brand|ux|ui/.test(text)) return 'DESIGN';
  if (/health|wellness|mindful|fitness|life/.test(text)) return 'LIFESTYLE';
  return 'FEATURED';
}

function inferTemplate(post: PostData): CanvasTemplate {
  const text = `${post.title} ${post.subtitle} ${post.category}`.toLowerCase();
  if (/code|developer|software|programming|saas|api|ai|machine learning|cyber/.test(text)) return 'tech_saas';
  if (/youtube|creator|viral|challenge|how i|results|mistake|secret/.test(text)) return 'youtube_bold';
  if (/design|architecture|typography|art|culture|interview|story/.test(text)) return 'bohemian';
  if (/wellness|mindful|lifestyle|travel|beauty/.test(text)) return 'ethereal';
  if (post.title.length <= 34) return 'minimalistic';
  return 'professional';
}

function inferTheme(post: PostData, template: CanvasTemplate): BgStyle {
  const text = `${post.title} ${post.subtitle} ${post.category}`.toLowerCase();
  if (/ai|code|developer|software|cyber|tech|saas/.test(text)) return 'digital';
  if (/business|finance|leadership|enterprise|strategy/.test(text)) return 'corporate';
  if (/wellness|mindful|lifestyle|health|beauty/.test(text)) return 'emerald';
  if (/creative|design|art|culture|fashion/.test(text)) return 'obsidian';
  if (template === 'youtube_bold' || /urgent|breaking|results|mistake|secret/.test(text)) return 'crimson';
  return 'midnight';
}

export function buildLocalDesign(post: PostData): DesignPlan {
  const template = inferTemplate(post);
  const bgStyle = inferTheme(post, template);
  const title = post.title.trim().replace(/\s+/g, ' ').toUpperCase();
  const subtitle = post.subtitle.trim();
  const category = inferCategory(post);
  const hookWords = extractHook(title).split(' ');
  const tags = hookWords.filter(w => w.length > 3 && !stopWords.has(w)).slice(0, 3).join(' • ');
  const textScale = clamp(title.length > 58 ? 0.82 : title.length > 42 ? 0.9 : 1, 0.78, 1);

  return {
    template,
    bgStyle,
    title,
    subtitle,
    category,
    keyPills: tags,
    showKeyPills: Boolean(tags),
    textScale,
  };
}

export async function generateDesign(post: PostData): Promise<DesignPlan> {
  const local = buildLocalDesign(post);
  try {
    const response = await fetch('/api/generate-design', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: post.title,
        subtitle: post.subtitle,
        category: post.category,
        currentTemplate: post.template,
        currentTheme: post.bgStyle,
      }),
    });
    if (!response.ok) return local;
    const ai = await response.json();
    return {
      ...local,
      template: ai.template || local.template,
      bgStyle: ai.bgStyle || local.bgStyle,
      title: ai.title || local.title,
      subtitle: ai.subtitle || local.subtitle,
      category: ai.category || local.category,
      keyPills: Array.isArray(ai.keyPills) ? ai.keyPills.slice(0, 4).join(' • ') : local.keyPills,
      showKeyPills: true,
      textScale: clamp(Number(ai.textScale) || local.textScale, 0.78, 1.04),
    };
  } catch {
    return local;
  }
}
