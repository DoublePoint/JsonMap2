const modules = import.meta.glob('./demos/*.ts', { eager: true });
export const ALL_DEMO = Object.values(modules).sort((a: any, b: any) => a.default.id - b.default.id).map((mod: any) => mod.default);