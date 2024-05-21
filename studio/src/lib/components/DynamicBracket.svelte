<script lang="ts">
	export let progress: number = 0;

	let bracketWidth: number;
	let extrudingLine: HTMLDivElement;

	$: progress,
		(function () {
			const valueNumber = Number(progress);
			console.log(progress);
			const translateX = (valueNumber / 100) * (bracketWidth - 0) - (bracketWidth + 40) / 2;
			if (extrudingLine) {
				extrudingLine.style.transform = `translateX(${translateX}px)`;
			}
		})();
</script>

<div class="flex w-full items-center justify-center">
	<div class="bracket" bind:offsetWidth={bracketWidth}>
		<div bind:this={extrudingLine} class="extruding-line"></div>
		<div class="border-tip-left"></div>
		<div class="border-tip-right"></div>
		<input
			type="range"
			min="0"
			max="100"
			step="0.25"
			bind:value={progress}
			class="absolute w-full h-full opacity-0 cursor-pointer"
		/>
	</div>
</div>

<style lang="postcss">
	.bracket {
		position: relative;
		width: 100%;
		height: 50px;
		border-top: 3px solid black;
		border-left: 3px solid black;
		border-right: 3px solid black;
	}

	.bracket::before {
		content: '';
		position: absolute;
		top: -3px;
		left: -13px;
		width: 10px;
		height: 10px;
		background-image: radial-gradient(
			circle at 100% 0,
			transparent 0%,
			transparent 10px,
			black 10px
		);
		transform: rotate(180deg);
	}

	.bracket::after {
		content: '';
		position: absolute;
		top: -3px;
		right: -13px;
		width: 10px;
		height: 10px;
		background-image: radial-gradient(circle at 0% 0, transparent 0%, transparent 10px, black 10px);
		transform: rotate(180deg);
	}

	.border-tip-left {
		position: absolute;
		left: -0.5;
		width: 0;
		bottom: 0;
		height: 0;
		border-left: 4px solid transparent;
		border-bottom: 50px solid white;
		transform: translateX(-50%);
	}

	.border-tip-right {
		position: absolute;
		right: -5.5;
		width: 0;
		bottom: 0;
		height: 0;
		border-right: 4px solid transparent;
		border-bottom: 50px solid white;
		transform: translateX(-50%);
	}

	.extruding-line {
		position: absolute;
		top: -20px;
		left: 50%;
		width: 0;
		height: 0;
		border-left: 20px solid transparent;
		border-right: 20px solid transparent;
		border-bottom: 20px solid black;
		border-radius: 20%;
		transform: translateX(-50%);
	}

	.extruding-line::before {
		content: '';
		position: absolute;
		top: -20px;
		left: 50%;
		width: 0;
		height: 0;
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		border-bottom: 40px solid black;
		transform: translateX(-50%);
	}

	.extruding-line::after {
		content: '';
		position: absolute;
		top: -10px;
		left: 50%;
		width: 0;
		height: 0;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-bottom: 30px solid white;
		transform: translateX(-50%);
	}
</style>
