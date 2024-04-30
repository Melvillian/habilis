import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.BMQFqo-e.js","_app/immutable/chunks/scheduler.Dk-snqIU.js","_app/immutable/chunks/index.DDRweiI9.js","_app/immutable/chunks/index.Ice1EKvx.js"];
export const stylesheets = ["_app/immutable/assets/2.Cs8KR-Bb.css"];
export const fonts = [];
