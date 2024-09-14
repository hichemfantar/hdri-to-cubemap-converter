import { ColorSpace, LinearSRGBColorSpace } from "three";

const canvasProps = { width: 1280, height: 720, vww: 0.64, vhw: 0.36 };
const renderProps: {
	isRendering: boolean;
	exposure: number;
	maxExposure: number;
	colorSpace: ColorSpace;
} = {
	isRendering: false,
	exposure: 4,
	maxExposure: 12,
	colorSpace: LinearSRGBColorSpace,
};
const imageProps: {
	loaded: boolean;
	file: File | null;
	format: string;
} = { loaded: false, file: null, format: "" };
const convProps: { refs: (HTMLElement | null)[]; hdrToon: boolean } = {
	refs: [],
	hdrToon: true,
};

export { canvasProps, renderProps, imageProps, convProps };
