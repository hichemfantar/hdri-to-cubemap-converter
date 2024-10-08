import {
	LinearSRGBColorSpace,
	LinearToneMapping,
	Mesh,
	PerspectiveCamera,
	ReinhardToneMapping,
	Scene,
	SphereGeometry,
	WebGLRenderer,
	WebGLRenderTarget,
} from "three";
import { sphereMatHdr } from "../materials/sphereMat-hdr";

const procRenderer = new WebGLRenderer();
const hdrProcRenderer = new WebGLRenderer({ alpha: true });
const hdrRenderTarget = new WebGLRenderTarget();
const procCamera = new PerspectiveCamera(90, 1, 1, 5000);

const hdrScene = new Scene();
const hdrGeo = new SphereGeometry(2000, 100, 100);
const hdrSphereMesh = new Mesh(hdrGeo, sphereMatHdr);
hdrSphereMesh.scale.set(-1, -1, -1);
hdrSphereMesh.rotateZ(Math.PI);
hdrSphereMesh.rotateY(-Math.PI / 2);
hdrSphereMesh.position.set(0, 0, 0);
hdrScene.add(hdrSphereMesh);

const hdrToneMappingProc = (hdr = true) => {
	procRenderer.outputColorSpace = LinearSRGBColorSpace;
	if (hdr) {
		procRenderer.toneMapping = ReinhardToneMapping;
		procRenderer.toneMappingExposure = 4;
	} else {
		procRenderer.toneMapping = LinearToneMapping;
		procRenderer.toneMappingExposure = 1;
	}
};

hdrToneMappingProc(true);

export {
	hdrProcRenderer,
	hdrRenderTarget,
	hdrScene,
	hdrToneMappingProc,
	procCamera,
	procRenderer,
};
