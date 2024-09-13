import {
	LinearSRGBColorSpace,
	LinearToneMapping,
	PerspectiveCamera,
	ReinhardToneMapping,
	Vector3 as V3,
	WebGLRenderer,
} from "three";
import { updateMaterial } from "../materials/sphereMat";
import { customEventsCanv } from "../render/events";
import { mainCamera, mainScene } from "./base";
import { convProps, renderProps } from "./props";

const convCamera = new PerspectiveCamera(90, 1, 0.1, 5000);

// let convRenderers = [new WebGLRenderer(), new WebGLRenderer(), new WebGLRenderer(), new WebGLRenderer(), new WebGLRenderer(), new WebGLRenderer()]
let convRenderers: (WebGLRenderer | null)[] = [
	null,
	null,
	null,
	null,
	null,
	null,
];

const updateConv = () => {
	convRenderers = convRenderers.map((_r, i) => {
		const canvas = document.getElementById(`convCanv${i}`);
		if (!(canvas instanceof HTMLCanvasElement))
			throw new Error(
				`Expected canvasiFrameID to be an HTMLCanvasElement, was ${
					(canvas && canvas.constructor && canvas.constructor.name) || canvas
				}`
			);

		convProps.refs.push(canvas);
		return new WebGLRenderer({ canvas, antialias: true });
	});

	const convCanv = document.getElementById("convCanvContainer");
	if (!convCanv) {
		throw new Error(
			"Expected convCanvContainer to be an HTMLDivElement, was not found"
		);
	}

	// convProps.refs.push(convCanv);
	if (convProps.hdrToon) {
		convRenderers.map((renderer) => {
			if (renderer) {
				renderer.toneMapping = ReinhardToneMapping;
				renderer.toneMappingExposure = 4;
				renderer.outputColorSpace = LinearSRGBColorSpace;
			}
		});
	} else {
		convRenderers.map((renderer) => {
			if (renderer) {
				renderer.toneMapping = LinearToneMapping;
				renderer.toneMappingExposure = 1;
				renderer.outputColorSpace = LinearSRGBColorSpace;
			}
		});
	}
	console.log("EndUpdate");
	resizeConv();
	customEventsCanv();
};

function convertRemToPixels(rem: number) {
	return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

const resizeConv = () => {
	if (convProps.refs.length !== 0) {
		const w = convertRemToPixels(8);
		// const segSize = Math.floor((window.innerWidth * canvasProps.vhw) / 3);
		// if (convProps.refs[0]) convProps.refs[0].style.top = `${segSize}px`;
		// if (convProps.refs[1]) convProps.refs[1].style.top = `${segSize}px`;
		// if (convProps.refs[1]) convProps.refs[1].style.left = `${segSize}px`;
		// if (convProps.refs[2]) convProps.refs[2].style.top = `${segSize}px`;
		// if (convProps.refs[2]) convProps.refs[2].style.left = `${segSize * 2}px`;
		// if (convProps.refs[3]) convProps.refs[3].style.top = `${segSize}px`;
		// if (convProps.refs[3]) convProps.refs[3].style.left = `${segSize * 3}px`;
		// if (convProps.refs[4]) convProps.refs[4].style.left = `${segSize}px`;
		// if (convProps.refs[5]) convProps.refs[5].style.top = `${segSize * 2}px`;
		// if (convProps.refs[5]) convProps.refs[5].style.left = `${segSize}px`;
		// // thats a container of canvases
		// if (convProps.refs[6]) convProps.refs[6].style.width = `${segSize * 4}px`;
		// if (convProps.refs[6]) convProps.refs[6].style.height = `${segSize * 3}px`;

		convRenderers.map((renderer) => {
			if (renderer) {
				renderer.setSize(w, w);
			}
		});
	}
};

const convRender = () => {
	if (convRenderers[0]) {
		convCamera.rotation.set(0, 0, 0);
		const direction = new V3();
		mainCamera.getWorldDirection(direction);
		const angle = direction.multiply(new V3(1, 0, 1)).angleTo(new V3(0, 0, -1));
		if (direction.x < 0) {
			convCamera.rotateY(angle);
		} else {
			convCamera.rotateY(-angle);
		}
		updateMaterial();
		if (convRenderers[1]) convRenderers[1].render(mainScene, convCamera);
		convCamera.rotateY(-Math.PI / 2);
		updateMaterial();
		if (convRenderers[2]) convRenderers[2].render(mainScene, convCamera);
		convCamera.rotateY(-Math.PI / 2);
		updateMaterial();
		if (convRenderers[3]) convRenderers[3].render(mainScene, convCamera);
		convCamera.rotateY(-Math.PI / 2);
		updateMaterial();
		convRenderers[0].render(mainScene, convCamera);
		convCamera.rotateY(-Math.PI / 2);
		convCamera.rotateX(Math.PI / 2);
		updateMaterial();
		if (convRenderers[4]) convRenderers[4].render(mainScene, convCamera);
		convCamera.rotateX(-Math.PI);
		updateMaterial();
		if (convRenderers[5]) convRenderers[5].render(mainScene, convCamera);
	}
};

const setExposureConv = (val = renderProps.exposure) => {
	convRenderers.map((renderer) => {
		if (renderer) renderer.toneMappingExposure = val;
	});
};

const hdrToneMappingConv = (hdr = true) => {
	convProps.hdrToon = hdr;
	if (hdr) {
		convRenderers.map((renderer) => {
			if (renderer) {
				renderer.toneMapping = ReinhardToneMapping;
				renderer.toneMappingExposure = 4;
			}
		});
	} else {
		convRenderers.map((renderer) => {
			if (renderer) {
				renderer.toneMapping = LinearToneMapping;
				renderer.toneMappingExposure = 1;
			}
		});
	}
};

export {
	convRender,
	hdrToneMappingConv,
	resizeConv,
	setExposureConv,
	updateConv,
};
