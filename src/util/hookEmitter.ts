import { EventEmitter } from "node:events";
const em = new EventEmitter();

// attach
function insertHookEvent(hook: string, fn: (...args: any[]) => void) {
	em.addListener(hook, fn);
}

export { insertHookEvent };
export default em;
