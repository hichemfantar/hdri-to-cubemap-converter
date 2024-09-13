import { resize } from "../components/base";
import { resizeConv } from "../components/convert";
import cameraControl from "../controls/cameraControl";
import { convProps } from "../components/props";
const customEvents = () => {
	window.addEventListener("resize", () => {
		resize();
		resizeConv();
	});

	const canvas = document.getElementById("MainCanvas");
	if (!(canvas instanceof HTMLCanvasElement))
		throw new Error(
			`Expected canvasiFrameID to be an HTMLCanvasElement, was ${
				(canvas && canvas.constructor && canvas.constructor.name) || canvas
			}`
		);

	canvas.addEventListener("mouseover", () => {
		cameraControl.enabled = true;
	});
	canvas.addEventListener("mouseout", () => {
		cameraControl.enabled = false;
	});
};

const customEventsCanv = () => {
	const inside = [false, false, false, false, false, false];
	inside.map((_n, i) => {
		if (convProps.refs[i]) {
			convProps.refs[i].addEventListener("mouseover", () => {
				inside[i] = true;
				cameraControl.enabled = true;
			});
		}
		if (convProps.refs[i]) {
			convProps.refs[i].addEventListener("mouseout", () => {
				inside[i] = false;
				if (inside.every((bool) => !bool)) {
					cameraControl.enabled = false;
				}
			});
		}
	});
};

export { customEvents, customEventsCanv };
