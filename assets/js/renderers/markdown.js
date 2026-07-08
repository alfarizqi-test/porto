import { escapeHtml } from './utils.js';

export const markdown = (file, content) => {
    let html = escapeHtml(content);

    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-[#fabd2f] mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-[#b8bb26] mt-4 mb-2">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-[#fb4934] mt-4 mb-4">$1</h1>');

    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-[#ebdbb2]">$1</strong>');
    html = html.replace(/`(.*?)`/gim, '<code class="bg-[#3c3836] px-1 rounded text-[#d3869b]">$1</code>');
    html = html.replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>');

    html = html.replace(/```([\s\S]*?)```/gim, '<pre class="bg-[#282828] p-4 rounded mt-2 mb-2 text-[#83a598] border border-[#504945]"><code>$1</code></pre>');

    return `<div class="p-4 font-mono text-[#a89984]">${html}</div>`;
};
