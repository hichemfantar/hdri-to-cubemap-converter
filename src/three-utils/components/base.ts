import {
	LinearSRGBColorSpace,
	LinearToneMapping,
	PerspectiveCamera,
	ReinhardToneMapping,
	Scene,
	WebGLRenderer,
} from "three";
import { canvasProps, renderProps } from "./props";

const { width, height } = canvasProps;

const mainScene = new Scene();

const mainCamera = new PerspectiveCamera(60, width / height, 0.1, 5000); //60

// set for referances
// let renderer = new WebGLRenderer();
let renderer: WebGLRenderer;
const update = () => {
	const canvas = document.getElementById("MainCanvas");

	if (!(canvas instanceof HTMLCanvasElement))
		throw new Error(
			`Expected canvasiFrameID to be an HTMLCanvasElement, was ${
				(canvas && canvas.constructor && canvas.constructor.name) || canvas
			}`
		);

	renderer = new WebGLRenderer({ canvas, antialias: true });
	renderer.toneMapping = ReinhardToneMapping;
	renderer.toneMappingExposure = renderProps.exposure;
	renderer.outputColorSpace = LinearSRGBColorSpace;
	resize();
	renderer.setPixelRatio(2);
};

const resize = () => {
	const canvas = document.getElementById("MainCanvas");

	if (!(canvas instanceof HTMLCanvasElement))
		throw new Error(
			`Expected canvasiFrameID to be an HTMLCanvasElement, was ${
				(canvas && canvas.constructor && canvas.constructor.name) || canvas
			}`
		);

	const parent = canvas.parentElement;
	if (!parent) {
		alert("Parent not found");
		return;
	}

	renderer.setSize(
		canvas.parentElement.clientWidth,
		(canvas.parentElement.clientWidth * 9) / 16
	);
	// renderer.setSize(
	// 	window.innerWidth * canvasProps.vww,
	// 	window.innerWidth * canvasProps.vhw
	// );
};

const setExposure = (val = renderProps.exposure) => {
	renderer.toneMappingExposure = val;
};

const setColorSpace = (val = renderProps.colorSpace) => {
	renderer.outputColorSpace = val;
};

const hdrToneMapping = (hdr = true) => {
	if (hdr) {
		renderer.toneMapping = ReinhardToneMapping;
		renderer.toneMappingExposure = 4;
		renderProps.exposure = 4;
	} else {
		renderer.toneMapping = LinearToneMapping;
		renderer.toneMappingExposure = 1;
		renderProps.exposure = 1;
	}
};

export {
	hdrToneMapping,
	mainCamera,
	mainScene,
	renderer,
	resize,
	setColorSpace,
	setExposure,
	update,
};
