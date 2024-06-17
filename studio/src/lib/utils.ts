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

export const lyrics = [
	{
		id: 512348,
		name: 'Dhoom machale',
		trackName: 'Dhoom machale',
		artistName: 'Sunidhi Chauhan',
		albumName: 'Dhoom',
		duration: 375.0,
		instrumental: false,
		plainLyrics:
			'इश्क़-इश्क़ करना है, कर ले\nइश्क़-इश्क़ में जी ले, मर ले\nइश्क़-इश्क़ है सबसे प्यारा\n\nइश्क़-इश्क़ करना है, कर ले\nइश्क़-इश्क़ में जी ले, मर ले\nइश्क़-इश्क़ ना हो दोबारा\n\nइश्क़ ही तो ज़िन्दगी है\nइश्क़ ही तो हर खुशी है\nइश्क़ में खुदको भुला के झूम\n\nधूम मचाले, धूम मचाले, धूम\nधूम मचाले, धूम मचाले, धूम\nधूम मचाले, धूम मचाले, धूम\nधूम मचाले, धूम मचाले, धूम\n\n"होता है क्या, इश्क़ होता है क्या?," दीवानों से पूछ ले\n"ये मचलते हैं क्यूँ? हँस के जलते हैं क्यूँ?," परवानों से पूछ ले\n"होता है क्या, इश्क़ होता है क्या?," दीवानों से पूछ ले\n"ये मचलते हैं क्यूँ? हँस के जलते हैं क्यूँ?," परवानों से पूछ ले\n\nइश्क़ के दिन चार, प्यारे\nइश्क़ हो एक बार, प्यारे\nइश्क़ की परछाइयों को चूम\n\nधूम मचाले, धूम मचाले, धूम\nHey, धूम मचाले, धूम मचाले, धूम\nधूम मचाले, धूम मचाले, धूम\nधूम मचाले, धूम मचाले, धूम\n\n(Dance with me, dance with me)\n(This is my philosophy)\n(Dance with me, dance with me, oh, yeah)\n\n(Dance with me, dance with me)\n(This is my philosophy)\n(Dance with me, dance with me, oh, yeah)\n\nतनहा कोई कभी जी ना सके सबको यहाँ है पता\nबेखबर अजनबी मेरे दिल ने जो की, तू भी कर ले हसीं वो खता\nतनहा कोई कभी जी ना सके सबको यहाँ है पता\nबेखबर अजनबी मेरे दिल ने जो की, तू भी कर ले हसीं वो खता\n\nइश्क़ में हर पल मज़ा है\nइश्क़ धड़कन का नशा है\nइश्क की गलियों में आके घूम\n\nधूम मचाले, धूम मचाले, धूम\nधूम मचाले, धूम मचाले, धूम\nHey, धूम मचाले, धूम मचाले, धूम\nधूम मचाले, धूम मचाले, धूम\n\n(You want more? Are you sure? OK)\n(One, two, three, four)\n\nइश्क़-इश्क़ करना है, कर ले\nइश्क़-इश्क़ में जी ले, मर ले\nइश्क़-इश्क़ है सबसे प्यारा\n\nइश्क़-इश्क़ करना है, कर ले\nइश्क़-इश्क़ में जी ले, मर ले\nइश्क़-इश्क़ ना हो दोबारा\n\nहाँ, इश्क़ ही तो ज़िन्दगी है\nइश्क़ ही तो हर खुशी है\nइश्क़ में खुदको भुला के झूम\n\nधूम मचाले (Come on, you hit, boy)\nधूम मचाले, धूम मचाले, धूम\nधूम मचाले, धूम मचाले, धूम\nधूम मचाले, धूम मचाले, धूम',
		syncedLyrics: null
	},
	{
		id: 5789838,
		name: 'Dhoom Machale Dhoom',
		trackName: 'Dhoom Machale Dhoom',
		artistName: 'Aditi Singh Sharma, Pritam',
		albumName: 'Dhoom 3',
		duration: 235.0,
		instrumental: false,
		plainLyrics:
			"धूम धूम सर चढ़ी है धूम धूम\nबेख़ुदी है धूम धूम\nइसमें गुम हो जा\n\nधूम धूम खलबली है धूम धूम\nहर गली है धूम धूम\nइस में तू खो जा\n\nधूम नशा है\nधूम जुनूं है\nधूम है हलचल\nधूम सुकूँ है\nआज तू सब कुछ भुला के झूम\n\nधूम मचाले\nWe Rock It\nWe Roll It\nSo Come On You People\n\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...\n\nधूम धूम जिस्मों-जां में धूम धूम\nहो जहां में धूम धूम\nजोश वो भर जा\nधूम धूम हर ज़ुबां में धूम धूम\nज़िक्र तेरा धूम धूम\nऐसा कुछ कर जा\n\nहो ओ... धूम शरारा\nधूम इशारा\nधूम ओ यारा\nधूम दोबारा\nआजा दिल से दिल मिलाके झूम\nधूम मचाले\n\nWe Rock It\nWe Roll It\nYou Ready To Party\n\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...\n\nकर ना फ़िकर तू कल की\nलुफ्त ले आज का\nज़िंदगी है बस दो पल की\nएक एक पल चुरा\nजी भर के जी ले जी ले\nग़म धुऐं में उड़ाओ\n\nधूम मचा, मचा, मचा, मचा, मचा, मचा, मचा\nमचा, मचा, मचा, मचा, मचा, मचा, मचा\nIt's time now for a Big Big Dhoom\n\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...",
		syncedLyrics:
			"[00:41.51] धूम धूम सर चढ़ी है धूम धूम\n[00:44.87] बेख़ुदी है धूम धूम\n[00:47.10] इसमें गुम हो जा\n[00:50.05] धूम धूम खलबली है धूम धूम\n[00:53.34] हर गली है धूम धूम\n[00:55.55] इस में तू खो जा\n[00:58.87] धूम नशा है\n[00:59.87] धूम जुनूं है\n[01:01.14] धूम है हलचल\n[01:02.07] धूम सुकूँ है\n[01:03.27] आज तू सब कुछ भुला के झूम\n[01:07.48] धूम मचाले\n[01:09.84] We Rock It\n[01:10.63] We Roll It\n[01:11.28] So Come On You People\n[01:12.56] धूम मचाले, धूम मचाले\n[01:14.43] धूम मचाले, धूम मचाले\n[01:16.57] धूम मचाले, धूम मचाले\n[01:19.02] धूम...\n[01:21.16] धूम मचाले, धूम मचाले\n[01:23.20] धूम मचाले, धूम मचाले\n[01:25.57] धूम मचाले, धूम मचाले\n[01:27.83] धूम...\n[01:46.96] धूम धूम जिस्मों-जां में धूम धूम\n[01:51.06] हो जहां में धूम धूम\n[01:53.21] जोश वो भर जा\n[01:56.19] धूम धूम हर ज़ुबां में धूम धूम\n[01:59.23] ज़िक्र तेरा धूम धूम\n[02:01.42] ऐसा कुछ कर जा\n[02:03.17] हो ओ... धूम शरारा\n[02:05.52] धूम इशारा\n[02:06.93] धूम ओ यारा\n[02:08.45] धूम दोबारा\n[02:09.73] आजा दिल से दिल मिलाके झूम\n[02:13.89] धूम मचाले\n[02:16.09] We Rock It\n[02:16.79] We Roll It\n[02:17.26] You Ready To Party\n[02:18.56] धूम मचाले, धूम मचाले\n[02:20.63] धूम मचाले, धूम मचाले\n[02:22.84] धूम मचाले, धूम मचाले\n[02:25.04] धूम...\n[02:27.32] धूम मचाले, धूम मचाले\n[02:29.27] धूम मचाले, धूम मचाले\n[02:31.58] धूम मचाले, धूम मचाले\n[02:33.61] धूम...\n[02:52.94] कर ना फ़िकर तू कल की\n[02:55.50] लुफ्त ले आज का\n[02:57.57] ज़िंदगी है बस दो पल की\n[02:59.86] एक एक पल चुरा\n[03:02.07] जी भर के जी ले जी ले\n[03:04.27] ग़म धुऐं में उड़ाओ\n[03:06.23] धूम मचा, मचा, मचा, मचा, मचा, मचा, मचा\n[03:11.00] मचा, मचा, मचा, मचा, मचा, मचा, मचा\n[03:14.13] It's time now for a Big Big Dhoom\n[03:16.40] धूम मचाले, धूम मचाले\n[03:18.42] धूम मचाले, धूम मचाले\n[03:20.53] धूम मचाले, धूम मचाले\n[03:22.94] धूम...\n[03:25.04] धूम मचाले, धूम मचाले\n[03:27.71] धूम मचाले, धूम मचाले\n[03:29.96] धूम मचाले, धूम मचाले\n[03:32.28] धूम...\n[03:34.26] "
	},
	{
		id: 7469102,
		name: 'Dhoom Machale Dhoom',
		trackName: 'Dhoom Machale Dhoom',
		artistName: 'Pritam, Aditi Singh Sharma',
		albumName: 'Dhoom 3',
		duration: 235.0,
		instrumental: false,
		plainLyrics:
			"धूम धूम सर चढ़ी है धूम धूम\nबेख़ुदी है धूम धूम\nइसमें गुम हो जा\n\nधूम धूम खलबली है धूम धूम\nहर गली है धूम धूम\nइस में तू खो जा\n\nधूम नशा है\nधूम जुनूं है\nधूम है हलचल\nधूम सुकूँ है\nआज तू सब कुछ भुला के झूम\n\nधूम मचाले\nWe Rock It\nWe Roll It\nSo Come On You People\n\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...\n\nधूम धूम जिस्मों-जां में धूम धूम\nहो जहां में धूम धूम\nजोश वो भर जा\nधूम धूम हर ज़ुबां में धूम धूम\nज़िक्र तेरा धूम धूम\nऐसा कुछ कर जा\n\nहो ओ... धूम शरारा\nधूम इशारा\nधूम ओ यारा\nधूम दोबारा\nआजा दिल से दिल मिलाके झूम\nधूम मचाले\n\nWe Rock It\nWe Roll It\nYou Ready To Party\n\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...\n\nकर ना फ़िकर तू कल की\nलुफ्त ले आज का\nज़िंदगी है बस दो पल की\nएक एक पल चुरा\nजी भर के जी ले जी ले\nग़म धुऐं में उड़ाओ\n\nधूम मचा, मचा, मचा, मचा, मचा, मचा, मचा\nमचा, मचा, मचा, मचा, मचा, मचा, मचा\nIt's time now for a Big Big Dhoom\n\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...",
		syncedLyrics:
			"[00:41.51] धूम धूम सर चढ़ी है धूम धूम\n[00:44.87] बेख़ुदी है धूम धूम\n[00:47.10] इसमें गुम हो जा\n[00:50.05] धूम धूम खलबली है धूम धूम\n[00:53.34] हर गली है धूम धूम\n[00:55.55] इस में तू खो जा\n[00:58.87] धूम नशा है\n[00:59.87] धूम जुनूं है\n[01:01.14] धूम है हलचल\n[01:02.07] धूम सुकूँ है\n[01:03.27] आज तू सब कुछ भुला के झूम\n[01:07.48] धूम मचाले\n[01:09.84] We Rock It\n[01:10.63] We Roll It\n[01:11.28] So Come On You People\n[01:12.56] धूम मचाले, धूम मचाले\n[01:14.43] धूम मचाले, धूम मचाले\n[01:16.57] धूम मचाले, धूम मचाले\n[01:19.02] धूम...\n[01:21.16] धूम मचाले, धूम मचाले\n[01:23.20] धूम मचाले, धूम मचाले\n[01:25.57] धूम मचाले, धूम मचाले\n[01:27.83] धूम...\n[01:46.96] धूम धूम जिस्मों-जां में धूम धूम\n[01:51.06] हो जहां में धूम धूम\n[01:53.21] जोश वो भर जा\n[01:56.19] धूम धूम हर ज़ुबां में धूम धूम\n[01:59.23] ज़िक्र तेरा धूम धूम\n[02:01.42] ऐसा कुछ कर जा\n[02:03.17] हो ओ... धूम शरारा\n[02:05.52] धूम इशारा\n[02:06.93] धूम ओ यारा\n[02:08.45] धूम दोबारा\n[02:09.73] आजा दिल से दिल मिलाके झूम\n[02:13.89] धूम मचाले\n[02:16.09] We Rock It\n[02:16.79] We Roll It\n[02:17.26] You Ready To Party\n[02:18.56] धूम मचाले, धूम मचाले\n[02:20.63] धूम मचाले, धूम मचाले\n[02:22.84] धूम मचाले, धूम मचाले\n[02:25.04] धूम...\n[02:27.32] धूम मचाले, धूम मचाले\n[02:29.27] धूम मचाले, धूम मचाले\n[02:31.58] धूम मचाले, धूम मचाले\n[02:33.61] धूम...\n[02:52.94] कर ना फ़िकर तू कल की\n[02:55.50] लुफ्त ले आज का\n[02:57.57] ज़िंदगी है बस दो पल की\n[02:59.86] एक एक पल चुरा\n[03:02.07] जी भर के जी ले जी ले\n[03:04.27] ग़म धुऐं में उड़ाओ\n[03:06.23] धूम मचा, मचा, मचा, मचा, मचा, मचा, मचा\n[03:11.00] मचा, मचा, मचा, मचा, मचा, मचा, मचा\n[03:14.13] It's time now for a Big Big Dhoom\n[03:16.40] धूम मचाले, धूम मचाले\n[03:18.42] धूम मचाले, धूम मचाले\n[03:20.53] धूम मचाले, धूम मचाले\n[03:22.94] धूम...\n[03:25.04] धूम मचाले, धूम मचाले\n[03:27.71] धूम मचाले, धूम मचाले\n[03:29.96] धूम मचाले, धूम मचाले\n[03:32.28] धूम...\n[03:34.26] "
	},
	{
		id: 9684268,
		name: 'Dhoom Machale Dhoom - Arabic',
		trackName: 'Dhoom Machale Dhoom - Arabic',
		artistName: 'Naya, Sameer Anjaan',
		albumName: 'Dhoom 3',
		duration: 228.0,
		instrumental: false,
		plainLyrics:
			'You know that thing is gonna be 100 years old\n\nشوف، شوف، ملا جو، قوم، قوم، حتى نرقص، قوم، قوم، حتى نرقص، قوم\nعيش، عيش، أحلى ليلة اليوم، عيش، حتى ننسى الهم عيش، أحلى ليلة اليوم\nأنسى حالك حتغني، اسرقلي قلبي وروحي مني، سحرك أنت نسى عينيا النوم\n\nधूम मचा ले\n(We rock it, we roll it)\n(Now come on you people)\n\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम... (go crazy)\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम... (go crazy)\n\nشوف، شوف، ملا جو، قوم، قوم، حتى نرقص، قوم، قوم، حتى نرقص، قوم\nعيش، عيش، أحلى ليلة اليوم، عيش، حتى ننسى الهم عيش، أحلى ليلة اليوم\nأنسى حالك حتغني، اسرقلي قلبي وروحي مني، سحرك أنت نسى عينيا النوم\n\nधूम मचा ले\n(We rock it, we roll it)\n(We ready to party)\n\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम... (go crazy)\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम... (go crazy)\n\nيا حبيبي ليك الدنيا بتسرق أحلام\nخلينا نعيش الليلة وننسى الأيام\nنفرفش ونرقص أحلام نبقى على وج الضو\nسوى، سوى، سوى، سوى، سوى، سوى، سوى، سوى، سوى، سوى، سوى، سوى\n(الليلة نسهر ما ننام)\n\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम... (go crazy)\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम... (go crazy)',
		syncedLyrics:
			'[00:09.14] You know that thing is gonna be 100 years old\n[00:10.79] \n[00:41.67] شوف، شوف، ملا جو، قوم، قوم، حتى نرقص، قوم، قوم، حتى نرقص، قوم\n[00:50.09] عيش، عيش، أحلى ليلة اليوم، عيش، حتى ننسى الهم عيش، أحلى ليلة اليوم\n[00:58.89] أنسى حالك حتغني، اسرقلي قلبي وروحي مني، سحرك أنت نسى عينيا النوم\n[01:07.61] धूम मचा ले\n[01:09.89] (We rock it, we roll it)\n[01:10.96] (Now come on you people)\n[01:12.24] धूम मचा ले, धूम मचा ले\n[01:14.30] धूम मचा ले, धूम मचा ले\n[01:16.40] धूम मचा ले, धूम मचा ले\n[01:18.53] धूम... (go crazy)\n[01:20.81] धूम मचा ले, धूम मचा ले\n[01:22.87] धूम मचा ले, धूम मचा ले\n[01:25.20] धूम मचा ले, धूम मचा ले\n[01:27.27] धूम... (go crazy)\n[01:29.64] \n[01:47.10] شوف، شوف، ملا جو، قوم، قوم، حتى نرقص، قوم، قوم، حتى نرقص، قوم\n[01:55.54] عيش، عيش، أحلى ليلة اليوم، عيش، حتى ننسى الهم عيش، أحلى ليلة اليوم\n[02:04.70] أنسى حالك حتغني، اسرقلي قلبي وروحي مني، سحرك أنت نسى عينيا النوم\n[02:13.21] धूम मचा ले\n[02:15.19] (We rock it, we roll it)\n[02:16.32] (We ready to party)\n[02:17.62] धूम मचा ले, धूम मचा ले\n[02:19.51] धूम मचा ले, धूम मचा ले\n[02:21.63] धूम मचा ले, धूम मचा ले\n[02:24.05] धूम... (go crazy)\n[02:26.20] धूम मचा ले, धूम मचा ले\n[02:28.32] धूम मचा ले, धूम मचा ले\n[02:30.52] धूम मचा ले, धूम मचा ले\n[02:32.65] धूम... (go crazy)\n[02:34.85] \n[02:44.02] يا حبيبي ليك الدنيا بتسرق أحلام\n[02:48.37] خلينا نعيش الليلة وننسى الأيام\n[02:52.71] نفرفش ونرقص أحلام نبقى على وج الضو\n[02:57.29] سوى، سوى، سوى، سوى، سوى، سوى، سوى، سوى، سوى، سوى، سوى، سوى\n[03:05.35] (الليلة نسهر ما ننام)\n[03:07.88] धूम मचा ले, धूम मचा ले\n[03:09.79] धूम मचा ले, धूम मचा ले\n[03:11.96] धूम मचा ले, धूम मचा ले\n[03:14.04] धूम... (go crazy)\n[03:16.44] धूम मचा ले, धूम मचा ले\n[03:18.35] धूम मचा ले, धूम मचा ले\n[03:20.55] धूम मचा ले, धूम मचा ले\n[03:22.68] धूम... (go crazy)\n[03:24.85] '
	},
	{
		id: 3745528,
		name: 'Dhoom Machale - Extended Version',
		trackName: 'Dhoom Machale - Extended Version',
		artistName: 'Pritam feat. Sunidhi Chauhan & Sameer',
		albumName: 'Dhoom Machale - Extended Version',
		duration: 49.0,
		instrumental: false,
		plainLyrics:
			'इश्क़ इश्क़ करना है? करले\nइश्क़ इश्क़ में जी ले, मर ले\nइश्क़ इश्क़ है सबसे प्यारा\n\nइश्क़ इश्क़ करना है? करले\nइश्क़ इश्क़ में जी ले, मर ले\nइश्क़ इश्क़ न हो दुबारा\n\nइश्क़ ही तोह ज़िन्दगी है\nइश्क़ ही तोह हर ख़ुशी है\nइश्क़ में खुद को भूलके, धूम-\n\nधूम मचाले\n(Come on you people!)\n(धूम, धूम, धूम, धूम)\nधूम मचाले\nधूम मचाले\nधूम-\nधूम मचाले\nधूम मचाले\nधूम-\n(धूम, धूम, धूम)',
		syncedLyrics: null
	},
	{
		id: 4856776,
		name: 'Dhoom Machale Dhoom',
		trackName: 'Dhoom Machale Dhoom',
		artistName: 'Pritam, Aditi Singh Sharma, Sameer Anjaan',
		albumName: 'Dhoom:3',
		duration: 238.0,
		instrumental: false,
		plainLyrics:
			"You know that thing must be the hundred years old!\n\nDhoom Dhoom, Sar chadhi hai\nDhoom Dhoom, Bekhudi hai\nDhoom Dhoom, Race mein gum ho ja\nOne minute...\n\nDhoom Dhoom, khalbali hai\nDhoom Dhoom, har gali hai\nDhoom Dhoom, race mein tu kho ja\n\nDhoom nashaa hai\nDhoom junoon hai\nDhoom hai hulchul\nDhoom sukoon hai\nAaj tu sab kuchh bula ke jhoooom\nDhoom Machale...\n\nWe rock it, we roll it\nSo come on you people\n\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale, Dhoom...\n\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale, Dhoom...\n\nDhoom Dhoom, jism-o-jaan mein\nDhoom Dhoom, ho jahaan mein\nDhoom Dhoom, josh woh bhar ja\nLet's Go!\nDhoom Dhoom, Har zubaan pe\nDhoom Dhoom, Zikr tera\nDhoom Dhoom, aisa kuchh kar ja\n\nHo... dhoom sharara\nDhoom ishara\nDhoom o yaara\nDhoom dobaara\nAaja dil se dil milake jhooooom...\nC'mon...\n\nDhoom Machale...\nWe rock it, we roll it\nYou ready to party!\n\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale Dhoom...\n\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale Dhoom...\n\nKar na fikar tu kal ki\nLutf le aaj ka\nZindagi hai bas do pal ki\nEk ek pal chura\nJee bhar ke jee le, jee le\nGham dhuein mein uda\nDhoom macha macha macha...\n\nIt's time now for a big big DHOOM!\n\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale Dhoom...\n\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale Dhoom...",
		syncedLyrics:
			"[00:07.98] You know that thing must be the hundred years old!\n[00:41.87] Dhoom Dhoom, Sar chadhi hai\n[00:43.92] Dhoom Dhoom, Bekhudi hai\n[00:46.22] Dhoom Dhoom, Race mein gum ho ja\n[00:48.47] One minute...\n[00:50.76] Dhoom Dhoom, khalbali hai\n[00:52.84] Dhoom Dhoom, har gali hai\n[00:55.16] Dhoom Dhoom, race mein tu kho ja\n[00:59.41] Dhoom nashaa hai\n[01:00.56] Dhoom junoon hai\n[01:01.68] Dhoom hai hulchul\n[01:02.66] Dhoom sukoon hai\n[01:03.75] Aaj tu sab kuchh bula ke jhoooom\n[01:07.84] Dhoom Machale...\n[01:10.74] We rock it, we roll it\n[01:11.80] So come on you people\n[01:12.98] Dhoom Machale, Dhoom Machale.\n[01:14.54] Dhoom Machale, Dhoom Machale.\n[01:16.39] Dhoom Machale, Dhoom Machale, Dhoom...\n[01:21.24] Dhoom Machale, Dhoom Machale.\n[01:23.18] Dhoom Machale, Dhoom Machale.\n[01:25.41] Dhoom Machale, Dhoom Machale, Dhoom...\n[01:47.66] Dhoom Dhoom, jism-o-jaan mein\n[01:49.65] Dhoom Dhoom, ho jahaan mein\n[01:51.66] Dhoom Dhoom, josh woh bhar ja\n[01:55.82] Let's Go!\n[01:56.45] Dhoom Dhoom, Har zubaan pe\n[01:58.23] Dhoom Dhoom, Zikr tera\n[02:00.32] Dhoom Dhoom, aisa kuchh kar ja\n[02:04.14] Ho... dhoom sharara\n[02:05.70] Dhoom ishara\n[02:06.90] Dhoom o yaara\n[02:07.91] Dhoom dobaara\n[02:09.22] Aaja dil se dil milake jhooooom...\n[02:12.93] C'mon...\n[02:13.89] Dhoom Machale...\n[02:16.48] We rock it, we roll it\n[02:17.98] You ready to party!\n[02:18.65] Dhoom Machale, Dhoom Machale.\n[02:19.90] Dhoom Machale, Dhoom Machale.\n[02:21.73] Dhoom Machale, Dhoom Machale Dhoom...\n[02:26.64] Dhoom Machale, Dhoom Machale.\n[02:28.46] Dhoom Machale, Dhoom Machale.\n[02:30.69] Dhoom Machale, Dhoom Machale Dhoom...\n[02:53.48] Kar na fikar tu kal ki\n[02:55.10] Lutf le aaj ka\n[02:57.39] Zindagi hai bas do pal ki\n[03:00.06] Ek ek pal chura\n[03:01.84] Jee bhar ke jee le, jee le\n[03:03.99] Gham dhuein mein uda\n[03:06.29] Dhoom macha macha macha...\n[03:15.93] It's time now for a big big DHOOM!\n[03:17.00] Dhoom Machale, Dhoom Machale.\n[03:18.96] Dhoom Machale, Dhoom Machale.\n[03:20.89] Dhoom Machale, Dhoom Machale Dhoom...\n[03:25.67] Dhoom Machale, Dhoom Machale.\n[03:29.69] Dhoom Machale, Dhoom Machale.\n[03:31.94] Dhoom Machale, Dhoom Machale Dhoom...\n[03:35.40] "
	},
	{
		id: 6647791,
		name: 'Dhoom Machale Dhoom (Arabic)',
		trackName: 'Dhoom Machale Dhoom (Arabic)',
		artistName: 'Naya',
		albumName: 'Dhoom : 3 (Original Motion Picture Soundtrack)',
		duration: 227.0,
		instrumental: false,
		plainLyrics:
			'You know that thing is gonna be 100 years old\n\nشوف، شوف، ملا جو، قوم، قوم، حتى نرقص، قوم، قوم، حتى نرقص، قوم\nعيش، عيش، أحلى ليلة اليوم، عيش، حتى ننسى الهم عيش، أحلى ليلة اليوم\nأنسى حالك حتغني، اسرقلي قلبي وروحي مني، سحرك أنت نسى عينيا النوم\n\nधूम मचा ले\n(We rock it, we roll it)\n(Now come on you people)\n\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम... (go crazy)\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम... (go crazy)\n\nشوف، شوف، ملا جو، قوم، قوم، حتى نرقص، قوم، قوم، حتى نرقص، قوم\nعيش، عيش، أحلى ليلة اليوم، عيش، حتى ننسى الهم عيش، أحلى ليلة اليوم\nأنسى حالك حتغني، اسرقلي قلبي وروحي مني، سحرك أنت نسى عينيا النوم\n\nधूम मचा ले\n(We rock it, we roll it)\n(We ready to party)\n\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम... (go crazy)\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम... (go crazy)\n\nيا حبيبي ليك الدنيا بتسرق أحلام\nخلينا نعيش الليلة وننسى الأيام\nنفرفش ونرقص أحلام نبقى على وج الضو\nسوى، سوى، سوى، سوى، سوى، سوى، سوى، سوى، سوى، سوى، سوى، سوى\n(الليلة نسهر ما ننام)\n\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम... (go crazy)\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम मचा ले, धूम मचा ले\nधूम... (go crazy)',
		syncedLyrics:
			'[00:09.14] You know that thing is gonna be 100 years old\n[00:10.79] \n[00:41.67] شوف، شوف، ملا جو، قوم، قوم، حتى نرقص، قوم، قوم، حتى نرقص، قوم\n[00:50.09] عيش، عيش، أحلى ليلة اليوم، عيش، حتى ننسى الهم عيش، أحلى ليلة اليوم\n[00:58.89] أنسى حالك حتغني، اسرقلي قلبي وروحي مني، سحرك أنت نسى عينيا النوم\n[01:07.61] धूम मचा ले\n[01:09.89] (We rock it, we roll it)\n[01:10.96] (Now come on you people)\n[01:12.24] धूम मचा ले, धूम मचा ले\n[01:14.30] धूम मचा ले, धूम मचा ले\n[01:16.40] धूम मचा ले, धूम मचा ले\n[01:18.53] धूम... (go crazy)\n[01:20.81] धूम मचा ले, धूम मचा ले\n[01:22.87] धूम मचा ले, धूम मचा ले\n[01:25.20] धूम मचा ले, धूम मचा ले\n[01:27.27] धूम... (go crazy)\n[01:29.64] \n[01:47.10] شوف، شوف، ملا جو، قوم، قوم، حتى نرقص، قوم، قوم، حتى نرقص، قوم\n[01:55.54] عيش، عيش، أحلى ليلة اليوم، عيش، حتى ننسى الهم عيش، أحلى ليلة اليوم\n[02:04.70] أنسى حالك حتغني، اسرقلي قلبي وروحي مني، سحرك أنت نسى عينيا النوم\n[02:13.21] धूम मचा ले\n[02:15.19] (We rock it, we roll it)\n[02:16.32] (We ready to party)\n[02:17.62] धूम मचा ले, धूम मचा ले\n[02:19.51] धूम मचा ले, धूम मचा ले\n[02:21.63] धूम मचा ले, धूम मचा ले\n[02:24.05] धूम... (go crazy)\n[02:26.20] धूम मचा ले, धूम मचा ले\n[02:28.32] धूम मचा ले, धूम मचा ले\n[02:30.52] धूम मचा ले, धूम मचा ले\n[02:32.65] धूम... (go crazy)\n[02:34.85] \n[02:44.02] يا حبيبي ليك الدنيا بتسرق أحلام\n[02:48.37] خلينا نعيش الليلة وننسى الأيام\n[02:52.71] نفرفش ونرقص أحلام نبقى على وج الضو\n[02:57.29] سوى، سوى، سوى، سوى، سوى، سوى، سوى، سوى، سوى، سوى، سوى، سوى\n[03:05.35] (الليلة نسهر ما ننام)\n[03:07.88] धूम मचा ले, धूम मचा ले\n[03:09.79] धूम मचा ले, धूम मचा ले\n[03:11.96] धूम मचा ले, धूम मचा ले\n[03:14.04] धूम... (go crazy)\n[03:16.44] धूम मचा ले, धूम मचा ले\n[03:18.35] धूम मचा ले, धूम मचा ले\n[03:20.55] धूम मचा ले, धूम मचा ले\n[03:22.68] धूम... (go crazy)\n[03:24.85] '
	},
	{
		id: 3863420,
		name: 'Dhoom Machale Dhoom',
		trackName: 'Dhoom Machale Dhoom',
		artistName: 'Aditi Singh Sharma',
		albumName: 'Dhoom : 3 (Original Motion Picture Soundtrack)',
		duration: 235.0,
		instrumental: false,
		plainLyrics:
			"धूम धूम सर चढ़ी है धूम धूम\nबेख़ुदी है धूम धूम\nइसमें गुम हो जा\n\nधूम धूम खलबली है धूम धूम\nहर गली है धूम धूम\nइस में तू खो जा\n\nधूम नशा है\nधूम जुनूं है\nधूम है हलचल\nधूम सुकूँ है\nआज तू सब कुछ भुला के झूम\n\nधूम मचाले\nWe Rock It\nWe Roll It\nSo Come On You People\n\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...\n\nधूम धूम जिस्मों-जां में धूम धूम\nहो जहां में धूम धूम\nजोश वो भर जा\nधूम धूम हर ज़ुबां में धूम धूम\nज़िक्र तेरा धूम धूम\nऐसा कुछ कर जा\n\nहो ओ... धूम शरारा\nधूम इशारा\nधूम ओ यारा\nधूम दोबारा\nआजा दिल से दिल मिलाके झूम\nधूम मचाले\n\nWe Rock It\nWe Roll It\nYou Ready To Party\n\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...\n\nकर ना फ़िकर तू कल की\nलुफ्त ले आज का\nज़िंदगी है बस दो पल की\nएक एक पल चुरा\nजी भर के जी ले जी ले\nग़म धुऐं में उड़ाओ\n\nधूम मचा, मचा, मचा, मचा, मचा, मचा, मचा\nमचा, मचा, मचा, मचा, मचा, मचा, मचा\nIt's time now for a Big Big Dhoom\n\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...",
		syncedLyrics:
			"[00:41.51] धूम धूम सर चढ़ी है धूम धूम\n[00:44.87] बेख़ुदी है धूम धूम\n[00:47.10] इसमें गुम हो जा\n[00:50.05] धूम धूम खलबली है धूम धूम\n[00:53.34] हर गली है धूम धूम\n[00:55.55] इस में तू खो जा\n[00:58.87] धूम नशा है\n[00:59.87] धूम जुनूं है\n[01:01.14] धूम है हलचल\n[01:02.07] धूम सुकूँ है\n[01:03.27] आज तू सब कुछ भुला के झूम\n[01:07.48] धूम मचाले\n[01:09.84] We Rock It\n[01:10.63] We Roll It\n[01:11.28] So Come On You People\n[01:12.56] धूम मचाले, धूम मचाले\n[01:14.43] धूम मचाले, धूम मचाले\n[01:16.57] धूम मचाले, धूम मचाले\n[01:19.02] धूम...\n[01:21.16] धूम मचाले, धूम मचाले\n[01:23.20] धूम मचाले, धूम मचाले\n[01:25.57] धूम मचाले, धूम मचाले\n[01:27.83] धूम...\n[01:46.96] धूम धूम जिस्मों-जां में धूम धूम\n[01:51.06] हो जहां में धूम धूम\n[01:53.21] जोश वो भर जा\n[01:56.19] धूम धूम हर ज़ुबां में धूम धूम\n[01:59.23] ज़िक्र तेरा धूम धूम\n[02:01.42] ऐसा कुछ कर जा\n[02:03.17] हो ओ... धूम शरारा\n[02:05.52] धूम इशारा\n[02:06.93] धूम ओ यारा\n[02:08.45] धूम दोबारा\n[02:09.73] आजा दिल से दिल मिलाके झूम\n[02:13.89] धूम मचाले\n[02:16.09] We Rock It\n[02:16.79] We Roll It\n[02:17.26] You Ready To Party\n[02:18.56] धूम मचाले, धूम मचाले\n[02:20.63] धूम मचाले, धूम मचाले\n[02:22.84] धूम मचाले, धूम मचाले\n[02:25.04] धूम...\n[02:27.32] धूम मचाले, धूम मचाले\n[02:29.27] धूम मचाले, धूम मचाले\n[02:31.58] धूम मचाले, धूम मचाले\n[02:33.61] धूम...\n[02:52.94] कर ना फ़िकर तू कल की\n[02:55.50] लुफ्त ले आज का\n[02:57.57] ज़िंदगी है बस दो पल की\n[02:59.86] एक एक पल चुरा\n[03:02.07] जी भर के जी ले जी ले\n[03:04.27] ग़म धुऐं में उड़ाओ\n[03:06.23] धूम मचा, मचा, मचा, मचा, मचा, मचा, मचा\n[03:11.00] मचा, मचा, मचा, मचा, मचा, मचा, मचा\n[03:14.13] It's time now for a Big Big Dhoom\n[03:16.40] धूम मचाले, धूम मचाले\n[03:18.42] धूम मचाले, धूम मचाले\n[03:20.53] धूम मचाले, धूम मचाले\n[03:22.94] धूम...\n[03:25.04] धूम मचाले, धूम मचाले\n[03:27.71] धूम मचाले, धूम मचाले\n[03:29.96] धूम मचाले, धूम मचाले\n[03:32.28] धूम...\n[03:34.26] "
	},
	{
		id: 6444448,
		name: 'Dhoom Machale Dhoom',
		trackName: 'Dhoom Machale Dhoom',
		artistName: 'Aditi Singh Sharma',
		albumName: 'Dhoom : 3 (Tamil) [Original Motion Picture Soundtrack]',
		duration: 235.0,
		instrumental: false,
		plainLyrics:
			"धूम धूम सर चढ़ी है धूम धूम\nबेख़ुदी है धूम धूम\nइसमें गुम हो जा\n\nधूम धूम खलबली है धूम धूम\nहर गली है धूम धूम\nइस में तू खो जा\n\nधूम नशा है\nधूम जुनूं है\nधूम है हलचल\nधूम सुकूँ है\nआज तू सब कुछ भुला के झूम\n\nधूम मचाले\nWe Rock It\nWe Roll It\nSo Come On You People\n\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...\n\nधूम धूम जिस्मों-जां में धूम धूम\nहो जहां में धूम धूम\nजोश वो भर जा\nधूम धूम हर ज़ुबां में धूम धूम\nज़िक्र तेरा धूम धूम\nऐसा कुछ कर जा\n\nहो ओ... धूम शरारा\nधूम इशारा\nधूम ओ यारा\nधूम दोबारा\nआजा दिल से दिल मिलाके झूम\nधूम मचाले\n\nWe Rock It\nWe Roll It\nYou Ready To Party\n\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...\n\nकर ना फ़िकर तू कल की\nलुफ्त ले आज का\nज़िंदगी है बस दो पल की\nएक एक पल चुरा\nजी भर के जी ले जी ले\nग़म धुऐं में उड़ाओ\n\nधूम मचा, मचा, मचा, मचा, मचा, मचा, मचा\nमचा, मचा, मचा, मचा, मचा, मचा, मचा\nIt's time now for a Big Big Dhoom\n\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम मचाले, धूम मचाले\nधूम...",
		syncedLyrics:
			"[00:41.51] धूम धूम सर चढ़ी है धूम धूम\n[00:44.87] बेख़ुदी है धूम धूम\n[00:47.10] इसमें गुम हो जा\n[00:50.05] धूम धूम खलबली है धूम धूम\n[00:53.34] हर गली है धूम धूम\n[00:55.55] इस में तू खो जा\n[00:58.87] धूम नशा है\n[00:59.87] धूम जुनूं है\n[01:01.14] धूम है हलचल\n[01:02.07] धूम सुकूँ है\n[01:03.27] आज तू सब कुछ भुला के झूम\n[01:07.48] धूम मचाले\n[01:09.84] We Rock It\n[01:10.63] We Roll It\n[01:11.28] So Come On You People\n[01:12.56] धूम मचाले, धूम मचाले\n[01:14.43] धूम मचाले, धूम मचाले\n[01:16.57] धूम मचाले, धूम मचाले\n[01:19.02] धूम...\n[01:21.16] धूम मचाले, धूम मचाले\n[01:23.20] धूम मचाले, धूम मचाले\n[01:25.57] धूम मचाले, धूम मचाले\n[01:27.83] धूम...\n[01:46.96] धूम धूम जिस्मों-जां में धूम धूम\n[01:51.06] हो जहां में धूम धूम\n[01:53.21] जोश वो भर जा\n[01:56.19] धूम धूम हर ज़ुबां में धूम धूम\n[01:59.23] ज़िक्र तेरा धूम धूम\n[02:01.42] ऐसा कुछ कर जा\n[02:03.17] हो ओ... धूम शरारा\n[02:05.52] धूम इशारा\n[02:06.93] धूम ओ यारा\n[02:08.45] धूम दोबारा\n[02:09.73] आजा दिल से दिल मिलाके झूम\n[02:13.89] धूम मचाले\n[02:16.09] We Rock It\n[02:16.79] We Roll It\n[02:17.26] You Ready To Party\n[02:18.56] धूम मचाले, धूम मचाले\n[02:20.63] धूम मचाले, धूम मचाले\n[02:22.84] धूम मचाले, धूम मचाले\n[02:25.04] धूम...\n[02:27.32] धूम मचाले, धूम मचाले\n[02:29.27] धूम मचाले, धूम मचाले\n[02:31.58] धूम मचाले, धूम मचाले\n[02:33.61] धूम...\n[02:52.94] कर ना फ़िकर तू कल की\n[02:55.50] लुफ्त ले आज का\n[02:57.57] ज़िंदगी है बस दो पल की\n[02:59.86] एक एक पल चुरा\n[03:02.07] जी भर के जी ले जी ले\n[03:04.27] ग़म धुऐं में उड़ाओ\n[03:06.23] धूम मचा, मचा, मचा, मचा, मचा, मचा, मचा\n[03:11.00] मचा, मचा, मचा, मचा, मचा, मचा, मचा\n[03:14.13] It's time now for a Big Big Dhoom\n[03:16.40] धूम मचाले, धूम मचाले\n[03:18.42] धूम मचाले, धूम मचाले\n[03:20.53] धूम मचाले, धूम मचाले\n[03:22.94] धूम...\n[03:25.04] धूम मचाले, धूम मचाले\n[03:27.71] धूम मचाले, धूम मचाले\n[03:29.96] धूम मचाले, धूम मचाले\n[03:32.28] धूम...\n[03:34.26] "
	},
	{
		id: 512347,
		name: 'Dhoom Machale (From "Dhoom")',
		trackName: 'Dhoom Machale (From "Dhoom")',
		artistName: 'Sunidhi Chauhan',
		albumName: 'Mere Sang - Hits of Sunidhi Chauhan',
		duration: 375.0,
		instrumental: false,
		plainLyrics:
			'इश्क़-इश्क़ करना है, कर ले\nइश्क़-इश्क़ में जी ले, मर ले\nइश्क़-इश्क़ है सबसे प्यारा\n\nइश्क़-इश्क़ करना है, कर ले\nइश्क़-इश्क़ में जी ले, मर ले\nइश्क़-इश्क़ ना हो दोबारा\n\nइश्क़ ही तो ज़िन्दगी है\nइश्क़ ही तो हर खुशी है\nइश्क़ में खुदको भुला के झूम\n\nधूम मचाले, धूम मचाले, धूम\nधूम मचाले, धूम मचाले, धूम\nधूम मचाले, धूम मचाले, धूम\nधूम मचाले, धूम मचाले, धूम\n\n"होता है क्या, इश्क़ होता है क्या?," दीवानों से पूछ ले\n"ये मचलते हैं क्यूँ? हँस के जलते हैं क्यूँ?," परवानों से पूछ ले\n"होता है क्या, इश्क़ होता है क्या?," दीवानों से पूछ ले\n"ये मचलते हैं क्यूँ? हँस के जलते हैं क्यूँ?," परवानों से पूछ ले\n\nइश्क़ के दिन चार, प्यारे\nइश्क़ हो एक बार, प्यारे\nइश्क़ की परछाइयों को चूम\n\nधूम मचाले, धूम मचाले, धूम\nHey, धूम मचाले, धूम मचाले, धूम\nधूम मचाले, धूम मचाले, धूम\nधूम मचाले, धूम मचाले, धूम\n\n(Dance with me, dance with me)\n(This is my philosophy)\n(Dance with me, dance with me, oh, yeah)\n\n(Dance with me, dance with me)\n(This is my philosophy)\n(Dance with me, dance with me, oh, yeah)\n\nतनहा कोई कभी जी ना सके सबको यहाँ है पता\nबेखबर अजनबी मेरे दिल ने जो की, तू भी कर ले हसीं वो खता\nतनहा कोई कभी जी ना सके सबको यहाँ है पता\nबेखबर अजनबी मेरे दिल ने जो की, तू भी कर ले हसीं वो खता\n\nइश्क़ में हर पल मज़ा है\nइश्क़ धड़कन का नशा है\nइश्क की गलियों में आके घूम\n\nधूम मचाले, धूम मचाले, धूम\nधूम मचाले, धूम मचाले, धूम\nHey, धूम मचाले, धूम मचाले, धूम\nधूम मचाले, धूम मचाले, धूम\n\n(You want more? Are you sure? OK)\n(One, two, three, four)\n\nइश्क़-इश्क़ करना है, कर ले\nइश्क़-इश्क़ में जी ले, मर ले\nइश्क़-इश्क़ है सबसे प्यारा\n\nइश्क़-इश्क़ करना है, कर ले\nइश्क़-इश्क़ में जी ले, मर ले\nइश्क़-इश्क़ ना हो दोबारा\n\nहाँ, इश्क़ ही तो ज़िन्दगी है\nइश्क़ ही तो हर खुशी है\nइश्क़ में खुदको भुला के झूम\n\nधूम मचाले (Come on, you hit, boy)\nधूम मचाले, धूम मचाले, धूम\nधूम मचाले, धूम मचाले, धूम\nधूम मचाले, धूम मचाले, धूम',
		syncedLyrics: null
	},
	{
		id: 4856775,
		name: 'Dhoom Machale Dhoom (From "Dhoom:3")',
		trackName: 'Dhoom Machale Dhoom (From "Dhoom:3")',
		artistName: 'Pritam feat. Aditi Singh Sharma & Sameer Anjaan',
		albumName: '30 Hits of Pritam',
		duration: 238.0,
		instrumental: false,
		plainLyrics:
			"You know that thing must be the hundred years old!\n\nDhoom Dhoom, Sar chadhi hai\nDhoom Dhoom, Bekhudi hai\nDhoom Dhoom, Race mein gum ho ja\nOne minute...\n\nDhoom Dhoom, khalbali hai\nDhoom Dhoom, har gali hai\nDhoom Dhoom, race mein tu kho ja\n\nDhoom nashaa hai\nDhoom junoon hai\nDhoom hai hulchul\nDhoom sukoon hai\nAaj tu sab kuchh bula ke jhoooom\nDhoom Machale...\n\nWe rock it, we roll it\nSo come on you people\n\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale, Dhoom...\n\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale, Dhoom...\n\nDhoom Dhoom, jism-o-jaan mein\nDhoom Dhoom, ho jahaan mein\nDhoom Dhoom, josh woh bhar ja\nLet's Go!\nDhoom Dhoom, Har zubaan pe\nDhoom Dhoom, Zikr tera\nDhoom Dhoom, aisa kuchh kar ja\n\nHo... dhoom sharara\nDhoom ishara\nDhoom o yaara\nDhoom dobaara\nAaja dil se dil milake jhooooom...\nC'mon...\n\nDhoom Machale...\nWe rock it, we roll it\nYou ready to party!\n\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale Dhoom...\n\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale Dhoom...\n\nKar na fikar tu kal ki\nLutf le aaj ka\nZindagi hai bas do pal ki\nEk ek pal chura\nJee bhar ke jee le, jee le\nGham dhuein mein uda\nDhoom macha macha macha...\n\nIt's time now for a big big DHOOM!\n\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale Dhoom...\n\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale.\nDhoom Machale, Dhoom Machale Dhoom...",
		syncedLyrics:
			"[00:07.98] You know that thing must be the hundred years old!\n[00:41.87] Dhoom Dhoom, Sar chadhi hai\n[00:43.92] Dhoom Dhoom, Bekhudi hai\n[00:46.22] Dhoom Dhoom, Race mein gum ho ja\n[00:48.47] One minute...\n[00:50.76] Dhoom Dhoom, khalbali hai\n[00:52.84] Dhoom Dhoom, har gali hai\n[00:55.16] Dhoom Dhoom, race mein tu kho ja\n[00:59.41] Dhoom nashaa hai\n[01:00.56] Dhoom junoon hai\n[01:01.68] Dhoom hai hulchul\n[01:02.66] Dhoom sukoon hai\n[01:03.75] Aaj tu sab kuchh bula ke jhoooom\n[01:07.84] Dhoom Machale...\n[01:10.74] We rock it, we roll it\n[01:11.80] So come on you people\n[01:12.98] Dhoom Machale, Dhoom Machale.\n[01:14.54] Dhoom Machale, Dhoom Machale.\n[01:16.39] Dhoom Machale, Dhoom Machale, Dhoom...\n[01:21.24] Dhoom Machale, Dhoom Machale.\n[01:23.18] Dhoom Machale, Dhoom Machale.\n[01:25.41] Dhoom Machale, Dhoom Machale, Dhoom...\n[01:47.66] Dhoom Dhoom, jism-o-jaan mein\n[01:49.65] Dhoom Dhoom, ho jahaan mein\n[01:51.66] Dhoom Dhoom, josh woh bhar ja\n[01:55.82] Let's Go!\n[01:56.45] Dhoom Dhoom, Har zubaan pe\n[01:58.23] Dhoom Dhoom, Zikr tera\n[02:00.32] Dhoom Dhoom, aisa kuchh kar ja\n[02:04.14] Ho... dhoom sharara\n[02:05.70] Dhoom ishara\n[02:06.90] Dhoom o yaara\n[02:07.91] Dhoom dobaara\n[02:09.22] Aaja dil se dil milake jhooooom...\n[02:12.93] C'mon...\n[02:13.89] Dhoom Machale...\n[02:16.48] We rock it, we roll it\n[02:17.98] You ready to party!\n[02:18.65] Dhoom Machale, Dhoom Machale.\n[02:19.90] Dhoom Machale, Dhoom Machale.\n[02:21.73] Dhoom Machale, Dhoom Machale Dhoom...\n[02:26.64] Dhoom Machale, Dhoom Machale.\n[02:28.46] Dhoom Machale, Dhoom Machale.\n[02:30.69] Dhoom Machale, Dhoom Machale Dhoom...\n[02:53.48] Kar na fikar tu kal ki\n[02:55.10] Lutf le aaj ka\n[02:57.39] Zindagi hai bas do pal ki\n[03:00.06] Ek ek pal chura\n[03:01.84] Jee bhar ke jee le, jee le\n[03:03.99] Gham dhuein mein uda\n[03:06.29] Dhoom macha macha macha...\n[03:15.93] It's time now for a big big DHOOM!\n[03:17.00] Dhoom Machale, Dhoom Machale.\n[03:18.96] Dhoom Machale, Dhoom Machale.\n[03:20.89] Dhoom Machale, Dhoom Machale Dhoom...\n[03:25.67] Dhoom Machale, Dhoom Machale.\n[03:29.69] Dhoom Machale, Dhoom Machale.\n[03:31.94] Dhoom Machale, Dhoom Machale Dhoom...\n[03:35.40] "
	}
];
