<script lang="ts">
	import { SCORE } from '$lib/store/game-config';

	export let dialog;

	let initials = '';

	const submitHighScore = () => {
		if (initials.length != 0) {
			const score = {
				initials,
				score: $SCORE
			};
			console.log(score);
			dialog.close();
		}
	};
</script>

<dialog class="dialog-box" bind:this={dialog} on:close>
	<div class="title-bar">GAME OVER</div>
	<div class="content">
		<p>You scored {$SCORE}!</p>
		<p>Enter your initials to submit your score to the leaderboard!</p>
		<label>
			Initials:
			<input type="text" name="initials" bind:value={initials} size="3" maxlength="3" />
		</label>
		<div class="button-container">
			<button class="submit-button" on:click={submitHighScore}>Submit</button>
		</div>
	</div>
</dialog>

<style>
	.dialog-box {
		width: 400px;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 16px;
		color: white;
		background-color: #333;
		font-size: 12px;
		align-content: center;
		display: flex; /* Add this line */
		flex-direction: column; /* Add this line */
		justify-content: center; /* Add this line */
		align-items: center; /* Add this line */
	}

	.title-bar {
		color: #fff;
		padding: 2px;
		margin-bottom: 2px;
		align-content: center;
		font-weight: bold;
		font-size: 16px;
	}

	.content {
		margin-bottom: 2px;
	}

	label {
		display: block;
		margin-bottom: 8px;
	}

	input[type='text'] {
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.button-container {
		display: flex;
		justify-content: center;
	}

	.submit-button {
		padding: 4px 8px;
		background-color: #222;
		color: #fff;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		align-content: center;
		font-size: 10px;
		transition: background-color 0.3s ease;
	}

	.submit-button:hover {
		background-color: #444;
	}
</style>
