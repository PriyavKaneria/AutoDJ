import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export function handleFetchError(err: Error, message: string) {
	console.error(message, err.message);
	throw err;
}

// export async function convertAacBlobToWavBlob(aacBlob: Blob) {
// 	const audioBuffer = await aacBlob.arrayBuffer();
// 	console.log(audioBuffer);

// 	// const [left, right] = [audioBuffer.getChannelData(0), audioBuffer.getChannelData(1)];

// 	// // interleaved
// 	// const interleaved = new Float32Array(left.length + right.length);
// 	// for (let src = 0, dst = 0; src < left.length; src++, dst += 2) {
// 	// 	interleaved[dst] = left[src];
// 	// 	interleaved[dst + 1] = right[src];
// 	// }

// 	// get WAV file bytes and audio params of your audio source
// 	const wavBytes = getWavBytes(audioBuffer, {
// 		isFloat: true, // floating point or 16-bit integer
// 		numChannels: 2,
// 		sampleRate: 48000
// 	});
// 	const wav = new Blob([wavBytes], { type: 'audio/wav' });
// 	return wav;
// }

// // Returns Uint8Array of WAV bytes
// function getWavBytes(
// 	buffer: ArrayBuffer,
// 	options: { isFloat: boolean; numChannels?: number; sampleRate?: number }
// ) {
// 	const type = options.isFloat ? Float32Array : Uint16Array;
// 	const numFrames = buffer?.byteLength / type.BYTES_PER_ELEMENT;

// 	const headerBytes = getWavHeader(Object.assign({}, options, { numFrames }));
// 	const wavBytes = new Uint8Array(headerBytes.length + buffer?.byteLength);

// 	// prepend header, then add pcmBytes
// 	wavBytes.set(headerBytes, 0);
// 	wavBytes.set(new Uint8Array(buffer), headerBytes.length);

// 	return wavBytes;
// }

// // adapted from https://gist.github.com/also/900023
// // returns Uint8Array of WAV header bytes
// function getWavHeader(options: {
// 	numFrames: number;
// 	numChannels?: number;
// 	sampleRate?: number;
// 	isFloat: unknown;
// }) {
// 	const numFrames: number = options?.numFrames;
// 	const numChannels: number = options?.numChannels || 2;
// 	const sampleRate: number = options?.sampleRate || 44100;
// 	const bytesPerSample: number = options.isFloat ? 4 : 2;
// 	const format: number = options.isFloat ? 3 : 1;

// 	const blockAlign: number = numChannels * bytesPerSample;
// 	const byteRate: number = sampleRate * blockAlign;
// 	const dataSize: number = numFrames * blockAlign;

// 	const buffer: ArrayBuffer = new ArrayBuffer(44);
// 	const dv: DataView = new DataView(buffer);

// 	let p: number = 0;

// 	function writeString(s: string) {
// 		for (let i = 0; i < s.length; i++) {
// 			dv.setUint8(p + i, s.charCodeAt(i));
// 		}
// 		p += s.length;
// 	}

// 	function writeUint32(d: number) {
// 		dv.setUint32(p, d, true);
// 		p += 4;
// 	}

// 	function writeUint16(d: number) {
// 		dv.setUint16(p, d, true);
// 		p += 2;
// 	}

// 	writeString('RIFF'); // ChunkID
// 	writeUint32(dataSize + 36); // ChunkSize
// 	writeString('WAVE'); // Format
// 	writeString('fmt '); // Subchunk1ID
// 	writeUint32(16); // Subchunk1Size
// 	writeUint16(format); // AudioFormat https://i.sstatic.net/BuSmb.png
// 	writeUint16(numChannels); // NumChannels
// 	writeUint32(sampleRate); // SampleRate
// 	writeUint32(byteRate); // ByteRate
// 	writeUint16(blockAlign); // BlockAlign
// 	writeUint16(bytesPerSample * 8); // BitsPerSample
// 	writeString('data'); // Subchunk2ID
// 	writeUint32(dataSize); // Subchunk2Size

// 	return new Uint8Array(buffer);
// }
