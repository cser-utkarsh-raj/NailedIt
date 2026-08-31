import JSZip from 'jszip';
import { PLUGIN_FILES } from '../data/pluginCode';

export async function downloadPluginZip(): Promise<void> {
  const zip = new JSZip();
  const rootFolder = zip.folder('bd-thumbnail-generator');
  if (!rootFolder) return;

  const includesFolder = rootFolder.folder('includes');
  const assetsFolder = rootFolder.folder('assets');
  const jsFolder = assetsFolder?.folder('js');
  const cssFolder = assetsFolder?.folder('css');
  const imagesFolder = assetsFolder?.folder('images');

  for (const file of PLUGIN_FILES) {
    if (file.name === 'bd-thumbnail-generator.php') {
      rootFolder.file(file.name, file.content);
    } else if (file.name.startsWith('class-bdtg-')) {
      includesFolder?.file(file.name, file.content);
    } else if (file.name.endsWith('.js')) {
      jsFolder?.file(file.name, file.content);
    } else if (file.name.endsWith('.css')) {
      cssFolder?.file(file.name, file.content);
    } else if (file.name.endsWith('.svg') || file.name.endsWith('.png')) {
      imagesFolder?.file(file.name, file.content);
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bd-thumbnail-generator.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadIndividualFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
