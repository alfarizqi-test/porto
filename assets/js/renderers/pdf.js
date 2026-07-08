export const pdf = (file, content) => {
    return `<div class="p-4 flex flex-col items-center justify-center h-full text-[#ebdbb2]">
        <div class="text-4xl mb-4">📕</div>
        <div class="text-xl font-bold">${file.name}</div>
        <div class="mt-4 text-xs text-[#504945]">Press 'o' to open PDF</div>
    </div>`;
};
