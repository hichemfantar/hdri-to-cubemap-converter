import { resize } from "../components/base";
import { resizeConv } from "../components/convert";
import { cameraControl } from "../controls/cameraControl";
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
		console.log("MouseOver");

		cameraControl.enabled = true;
		cameraControl.update();
	});
	canvas.addEventListener("mouseout", () => {
		console.log("MouseOut");
		cameraControl.enabled = false;
		cameraControl.update();
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
