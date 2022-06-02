export const handlers = Array.from(Object.values(import.meta.globEager('./handlers/*.ts')), ({ handler }) => handler)
