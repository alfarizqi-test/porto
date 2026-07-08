import { escapeHtml } from './utils.js';

export const toml = (file, content) => {
    let formatted = escapeHtml(content);
    formatted = formatted.replace(/^\[(.*?)\]/gm, '<span class="text-[#8ec07c]">[$1]</span>');
    formatted = formatted.replace(/^([\w-]+)\s*=/gm, '<span class="text-[#83a598]">$1</span> =');
    formatted = formatted.replace(/"(.*?)"/g, '<span class="text-[#b8bb26]">"$1"</span>');
    return `<div class="p-4 whitespace-pre-wrap font-mono">${formatted}</div>`;
};
