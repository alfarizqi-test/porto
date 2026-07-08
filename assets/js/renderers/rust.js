import { escapeHtml } from './utils.js';

export const rust = (file, content) => {
    let formatted = escapeHtml(content);
    const keywords = ['struct', 'fn', 'let', 'mut', 'impl', 'pub', 'return', 'String', 'Vec'];
    
    keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, 'g');
        formatted = formatted.replace(regex, `<span class="text-[#fb4934]">${kw}</span>`);
    });

    formatted = formatted.replace(/"(.*?)"/g, '<span class="text-[#b8bb26]">"$1"</span>');
    
    return `<div class="p-4 whitespace-pre-wrap font-mono">${formatted}</div>`;
};
