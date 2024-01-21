// game-config.ts

import { readable, writable } from 'svelte/store';

export const muted = writable(true);

export const GAME_TIME_IN_MINUTES = readable(3);

export enum GAME_STATES {
	START,
	PLAYING,
	END
}

export enum SOLACE_STATUS_CODES {
	CONNECTING,
	CONNECTED,
	DISCONNECTED
}

export const SOLACE_STATUS = writable<SOLACE_STATUS_CODES>(SOLACE_STATUS_CODES.CONNECTING);

export const GAME_STATE = writable<GAME_STATES>(GAME_STATES.END);

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
