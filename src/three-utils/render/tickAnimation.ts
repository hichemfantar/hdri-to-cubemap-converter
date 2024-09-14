import { cameraControl } from "../controls/cameraControl";

function tickAnimation() {
	cameraControl.update();
}

export { tickAnimation };
