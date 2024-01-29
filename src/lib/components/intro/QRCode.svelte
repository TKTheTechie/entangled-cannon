<script lang="ts">
	import { GAME_SESSION_ID } from '$lib/store/game-config';
	import { HTML } from '@threlte/extras';

	let controllerURL = window.location.href + 'controller?game_session_id=' + $GAME_SESSION_ID;
</script>

<HTML position={[2, 0.6, 0]}>
	<img
		src={`https://api.qrserver.com/v1/create-qr-code/?size=2000x200&data=${controllerURL}`}
		alt="qr-code"
	/>
</HTML>
