// game-config-store.ts

import { readable, writable } from 'svelte/store';

export const muted = writable(true);

export const GAME_TIME_IN_MINUTES = readable(3);

export type GAME_STATES = 'start' | 'playing' | 'end';

export const GAME_STATE = writable<GAME_STATES>('start');

export const FLOOR_DIMENSIONS = readable({ x: 200, y: 1, z: 200 });

export const SCORE = (() => {
	const { subscribe, update } = writable(0);

	const add = (value: number) => {
		update((currentScore) => currentScore + value);
	};

	return {
		subscribe,
		add
	};
})();
