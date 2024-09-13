import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	ReinhardToneMapping,
	LinearToneMapping,
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
	resize();
	renderer.setPixelRatio(2);
};
const resize = () => {
	renderer.setSize(
		window.innerWidth * canvasProps.vww,
		window.innerWidth * canvasProps.vhw
	);
};
const setExposure = (val = renderProps.exposure) => {
	renderer.toneMappingExposure = val;
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
	mainScene,
	mainCamera,
	renderer,
	update,
	resize,
	setExposure,
	hdrToneMapping,
};
