export const fastfetch = (systemInfo) => {
    if (!systemInfo) return `<div class="p-4">Loading system info...</div>`;

    return `
    <div class="flex flex-col md:flex-row gap-8 p-4 font-mono text-sm fade-in">
        <div class="text-[#83a598] whitespace-pre font-bold">
              .--.
             |o_o |
             |:_/ |
            //   \\
           (|     |)
          /'\\_   _/` + "`" + `\\
          \\___)=(___/
        </div>
        <div class="flex flex-col gap-1">
            <div class="text-[#ebdbb2] font-bold"><span class="text-[#fb4934]">Architect</span>@<span class="text-[#fb4934]">ArchLinux</span></div>
            <div class="text-[#504945]">────────────────────────────</div>
            
            <div class="flex"><span class="text-[#fabd2f] w-24">OS</span> <span>${systemInfo.os}</span></div>
            <div class="flex"><span class="text-[#fabd2f] w-24">Kernel</span> <span>${systemInfo.kernel}</span></div>
            <div class="flex"><span class="text-[#fabd2f] w-24">WM</span> <span>${systemInfo.wm}</span></div>
            <div class="flex"><span class="text-[#fabd2f] w-24">Shell</span> <span>${systemInfo.shell}</span></div>
            <div class="flex"><span class="text-[#fabd2f] w-24">Editor</span> <span>${systemInfo.editor}</span></div>
            <div class="flex"><span class="text-[#fabd2f] w-24">Browser</span> <span>${systemInfo.browser}</span></div>
            <div class="flex"><span class="text-[#fabd2f] w-24">Packages</span> <span>${systemInfo.packages}</span></div>
            
            <div class="mt-4 flex"><span class="text-[#b8bb26] w-24">Languages</span> <span class="text-[#83a598]">${systemInfo.languages.join(', ')}</span></div>
            <div class="flex"><span class="text-[#b8bb26] w-24">Backend</span> <span class="text-[#d3869b]">${systemInfo.backend.join(', ')}</span></div>
            <div class="flex"><span class="text-[#b8bb26] w-24">Projects</span> <span class="text-[#8ec07c]">${systemInfo.projects.join(', ')}</span></div>
            
            <div class="mt-4 flex gap-2">
                <span class="w-4 h-4 bg-[#282828] inline-block rounded-sm"></span>
                <span class="w-4 h-4 bg-[#cc241d] inline-block rounded-sm"></span>
                <span class="w-4 h-4 bg-[#98971a] inline-block rounded-sm"></span>
                <span class="w-4 h-4 bg-[#d79921] inline-block rounded-sm"></span>
                <span class="w-4 h-4 bg-[#458588] inline-block rounded-sm"></span>
                <span class="w-4 h-4 bg-[#b16286] inline-block rounded-sm"></span>
                <span class="w-4 h-4 bg-[#689d6a] inline-block rounded-sm"></span>
                <span class="w-4 h-4 bg-[#a89984] inline-block rounded-sm"></span>
            </div>
        </div>
    </div>
    `;
};
