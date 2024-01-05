// game-config-store.ts

import { writable } from 'svelte/store';

export const CANNON_POSITION = writable({ x: 0, y: 0, z: 0 });

export const CANNON_FORCE = writable(0);
