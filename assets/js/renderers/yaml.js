import { escapeHtml } from './utils.js';

export const yaml = (file, content) => {
    let formatted = escapeHtml(content);
    formatted = formatted.replace(/^([\s-]*)([\w-]+):/gm, '$1<span class="text-[#83a598]">$2</span>:');
    return `<div class="p-4 whitespace-pre-wrap font-mono">${formatted}</div>`;
};
