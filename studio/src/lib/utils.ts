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

export const parsedLyrics = [
	[20, ' Saturday saturday'],
	[20, ' Phela ta kudi ne ludhiana vi ni tappeya si tappeya si'],
	[28, ' Phela ta kudi ne ludhiana vi ni tappeya'],
	[32, ' Puche bina gharo bhaar per vi ni rakheya'],
	[35, ' Jadi di madam duje ghar vich aai bas party diya galla kar di rehndi eh'],
	[42, ' Kudi saturday saturday kardi rehndi eh x-2'],
	[49, ' Saturday saturday kudi saturday saturday x-2'],
	[71, ' (Badshah Rap)'],
	[72, ' Hanji fir ek baar dekho aaya shanivaar'],
	[75, ' Party karne ke liye baby ji ho gai taiyaar'],
	[79, ' Sarojni ke kapde pehenke jaati madam disco'],
	[83, ' VIP mai complimentry shots bhi de do isko'],
	[88, ' Isko gaadi chahiye lambi usmai music chahiye loud'],
	[91, ' Ye jaati mehenge club mai jaha hota dhang ka crowd'],
	[94, ' Ludhiyane se aai ladki University padhti hai'],
	[98, ' Keheti to hai student hai but i doubt'],
	[102, ' Mundeya de palle ni tu chadeya ni kakh'],
	[105, ' Jado sunday monday kare tera jhutte khanda lakk'],
	[109, ' Aati honda mai audi mai jati tu khisak'],
	[113, ' Suck suck baby what the fu*****'],
	[116, ' Aag wangu kudiye club vich nachdi di di di di di'],
	[124, ' Aag wangu kudiye club vich nachdi'],
	[128, ' Step fer saare bollywood wale kar di'],
	[132, ' Naale maare vodka de shot utte shot'],
	[135, ' Naale mummy di vi call to vidardi rehndi eh'],
	[139, ' Kudi saturday saturday kardi rehndi eh'],
	[142, ' Kudi saturday saturday kardi rehndi eh'],
	[153, ' Saturday saturday kudi saturday saturday x-2'],
	[168, ' Mundeya nu apna bb pin vand di di di di di'],
	[175, ' Mundeya nu apna bb pin vand di'],
	[179, ' Mini skirt paave bhora fikar na thand di'],
	[183, ' Pind vich babe babe kardi hundi si'],
	[187, ' Ni tu seher aa ke baby baby kardi rehndi eh'],
	[190, ' Kudi saturday saturday kardi rehndi eh'],
	[193, ' Kudi saturday saturday kardi rehndi eh'],
	[209, ' ']
];
