import { MessageData } from "@/converters/hdrConverterEmissive";

class ByteData {
	binaryData: Uint8Array;
	_cIndex: number;

	constructor(size: number) {
		this.binaryData = new Uint8Array(size);
		this._cIndex = 0;
		this.push = this.push.bind(this);
	}

	push(...bytes: number[]) {
		for (let i = 0; i < bytes.length; i++) {
			this.binaryData[this._cIndex] = bytes[i];
			this._cIndex++;
		}
	}
}

export const hadrEmmisiveWorker = (event: MessageData) => {
	const width = event.width;
	const height = event.height;
	const rgbeBuffer = event.rgbeBuffer;
	const fromBottom = event.fromBottom;
	// pixel data starts at lower left corner, but we are writing hdr from upper left one,
	// this function gives me upper left pixel row based on y, where y = 0 -> top row
	const topIndex = (y: number) =>
		fromBottom ? width * height * 4 - width * 4 - width * y * 4 : width * y * 4;
	// calculates repetitions in line for given channel
	const getLine = (y = 0, channel = 0) => {
		const array = [];
		let localVal = 0;
		let localLength = 0;
		const lengthConstant = 128;
		for (let i = 0; i < width * 4; i += 4) {
			if (localLength === 0) {
				localVal = rgbeBuffer[topIndex(y) + i + channel];
				localLength++;
			} else if (
				localVal === rgbeBuffer[topIndex(y) + i + channel] &&
				localLength < 127
			) {
				localLength++;
			} else {
				array.push({ value: localVal, length: localLength + lengthConstant });
				localVal = rgbeBuffer[topIndex(y) + i + channel];
				localLength = 1;
			}
		}
		array.push({ value: localVal, length: localLength + lengthConstant });
		return array;
	};

	const compressed = [];
	let fileSize = 0;
	for (let i = 0; i < height; i++) {
		const lineReds = getLine(i, 0);
		const lineGreens = getLine(i, 1);
		const lineBlues = getLine(i, 2);
		const lineEmissive = getLine(i, 3);
		const lineInitiator = 4;
		// multiplied channels by 2, because they contain value and length if that value
		fileSize +=
			lineInitiator +
			lineReds.length * 2 +
			lineGreens.length * 2 +
			lineBlues.length * 2 +
			lineEmissive.length * 2;
		compressed.push([lineReds, lineGreens, lineBlues, lineEmissive]);
	}
	console.log(`Worker, hdr file size = ${(fileSize / 1024).toFixed(2)}kb`);
	const lineSize = new Uint8Array(new Uint16Array([width]).buffer);
	const byteData = new ByteData(fileSize);

	for (let i = 0; i < height; i++) {
		// Each line starts the same
		byteData.push(2, 2, lineSize[1], lineSize[0]); //line iniciators // no idea why but linesize is flipped
		for (let k = 0; k < 4; k++) {
			compressed[i][k].forEach((channel) => {
				byteData.push(channel.length, channel.value);
			});
		}
	}

	return { binary: byteData.binaryData };
};
