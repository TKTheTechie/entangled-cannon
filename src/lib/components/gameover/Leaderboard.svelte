<script lang="ts">
	import { HTML } from '@threlte/extras';
	import { onMount } from 'svelte';
	import ScoreSubmissionForm from './ScoreSubmissionForm.svelte';

	const LEADERBOARD_URL = import.meta.env.VITE_LEADERBOARD_URL;

	let entries: { id: number; initials: string; score: number; datetime: string }[] = Array(10).fill(
		{}
	);

	let dialog;

	let showLeaderboard = false;

	const fetchLeaderboard = async () => {
		return new Promise((resolve, reject) => {
			setTimeout(async () => {
				const response = await fetch(LEADERBOARD_URL, {
					method: 'GET'
				});
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const retrievedEntries = await response.json();
				retrievedEntries.forEach((entry, index) => {
					entries[index] = entry;
				});

				console.log(entries);
				resolve(undefined);
			}, 2500);
		});
	};

	onMount(() => {
		dialog.showModal();
	});

	const loadLeaderboard = () => {
		showLeaderboard = true;
	};
</script>

<HTML position.x={1.25} position.y={[2.75]}>
	{#if !showLeaderboard}
		<ScoreSubmissionForm bind:dialog on:close={loadLeaderboard} />
	{:else}
		{#await fetchLeaderboard()}
			<div class="loading-leaderboard">Loading Leaderboard...</div>
		{:then}
			{#if entries.length > 0}
				<div class="table-container">
					<div class="table-row table-header">
						<div class="table-data" />
						<div class="table-data">Initials</div>
						<div class="table-data">Score</div>
						<div class="table-data">Date</div>
					</div>
					{#each entries as { initials, score, datetime }, i}
						<div class="table-row">
							<div class="table-data">{i + 1}</div>
							<div class="table-data">{initials ? initials : '-'}</div>
							<div class="table-data">{score ? score : '-'}</div>
							<div class="table-data">
								{datetime
									? new Date(datetime).toLocaleDateString('en-US', {
											month: 'short',
											day: 'numeric',
											year: 'numeric'
									  })
									: '-'}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<p>No entries yet.</p>
			{/if}
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	{/if}
</HTML>

<style>
	/* Style for the container div */
	.table-container {
		background-color: #f1f1f1;
		border-collapse: collapse;
		width: 100%;
		margin: 10px;
		overflow: hidden;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		font-size: 15pt;
	}

	/* Style for the table row divs */
	.table-row {
		display: flex;
		justify-content: space-between;
		text-align: center;
		padding: 5px;
		border-bottom: 1px solid #ddd;
	}

	/* Style for the table header div */
	.table-header {
		background-color: #f1f1f1;
		font-weight: bold;
		color: #333;
		justify-content: baseline;
		text-align: center;
		min-width: 100px;
	}

	/* Style for the table data divs */
	.table-data {
		flex: 1;
		min-width: 100px;
	}

	/* Different shadings for odd and even rows */
	.table-row:nth-child(odd) {
		background-color: #f9f9f9;
	}

	.table-row:nth-child(even) {
		background-color: #eaeaea;
	}

	.loading-leaderboard {
		width: 300px;
		border: 1px solid black;
		background-color: white;
		font-size: 2em;
	}
</style>
