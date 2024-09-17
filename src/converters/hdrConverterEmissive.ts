import { hadrEmmisiveWorker } from "../workers/hdrEmissive.worker";

export type MessageData = {
	width: number;
	height: number;
	rgbeBuffer: Uint8ClampedArray;
	fromBottom: boolean;
};

export const hdrConverterEmmisive = ({
	width,
	height,
	rgbeBuffer = new Uint8ClampedArray(),
	fromBottom = true,
}: Partial<Pick<MessageData, "rgbeBuffer" | "fromBottom">> &
	Omit<MessageData, "rgbeBuffer" | "fromBottom">) => {
	return new Promise<Blob>((resolve) => {
		const data = hadrEmmisiveWorker({ rgbeBuffer, width, height, fromBottom });

		console.log("dataBack", data);

		const header =
			"#?RADIANCE\n# Made with HDRI-to-Cubemap\nFORMAT=32-bit_rle_rgbe\n";
		const blankSpace = "\n";
		const Resolution = `-Y ${height} +X ${width}\n`;
		const text = header + blankSpace + Resolution;
		const blob = new Blob([text, data.binary], {
			type: "octet/stream",
		});

		resolve(blob);
	});
};
