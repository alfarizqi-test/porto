export const image = (file, content) => {
    return `<div class="p-4 flex items-center justify-center h-full">
        <img src="${file.file}" class="max-w-full max-h-full rounded shadow-lg border border-[#504945]" />
    </div>`;
};
