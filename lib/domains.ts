// Centralized domain list with emoji labels
export type DomainOption = {
    value: string;
    label: string;
};

export const defaultDomains: DomainOption[] = [
    { value: "Frontend Developer", label: "🎨 Frontend Developer" },
    { value: "Backend Developer", label: "⚙️ Backend Developer" },
    { value: "Database Management", label: "🗄️ Database Management" },
    { value: "Web Developer", label: "🌐 Web Developer" },
    { value: "Android Developer", label: "🪐 Android Developer" },
    { value: "Full Stack Developer", label: "🦄 Full Stack Developer" },
    { value: "UI/UX Designer", label: "🎭 UI/UX Designer" },
    { value: "Digital Marketing", label: "📈 Digital Marketing" }
];

// Utility to get domains from localStorage or fallback to default
export function getDomainOptions(): DomainOption[] {
    let options = defaultDomains;
    if (typeof window !== "undefined") {
        const stored = localStorage.getItem("domains");
        if (stored) {
            try {
                const parsed: DomainOption[] = JSON.parse(stored);
                // Remove duplicates (case-insensitive)
                let unique = Array.from(
                    new Map(parsed.map(d => [d.value.toLowerCase(), d])).values()
                );
                // Remove any duplicate 'Database Management' from localStorage
                unique = unique.filter((d, i, arr) => arr.findIndex(x => x.value === d.value) === i);
                // Remove 'Database Management' from defaultDomains if already present in unique
                const hasDatabaseManagement = unique.some(d => d.value === "Database Management");
                if (hasDatabaseManagement) {
                    options = unique;
                } else {
                    options = [...unique, { value: "Database Management", label: "🗄️ Database Management" }];
                }
            } catch {
                options = defaultDomains;
            }
        }
    }
    // Filter out HR Executive, Others, and Database if present
    return options.filter(d => d.value !== "HR Executive" && d.value !== "Others" && d.value !== "Database");
}