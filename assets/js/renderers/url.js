export const url = (file, content) => {
    return `<div class="p-4 flex flex-col items-center justify-center h-full text-[#ebdbb2]">
        <div class="text-4xl mb-4">${file.icon || '🌐'}</div>
        <div class="text-xl font-bold mb-2">${file.name}</div>
        <a href="${file.url}" target="_blank" class="text-[#83a598] hover:underline">${file.url}</a>
        <div class="mt-8 text-xs text-[#504945]">Press 'o' or Enter to open in new tab</div>
    </div>`;
};
