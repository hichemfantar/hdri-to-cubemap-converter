import {
	DataTexture,
	LinearSRGBColorSpace,
	NearestFilter,
	Texture,
} from "three";
import { RGBELoader } from "../examples/RGBELoader";
import { updateSphereMap } from "../materials/sphereMat";

export const HdrTexture = new DataTexture();

const loader = new RGBELoader();

loader.load("images/venetian_crossroads_1k.hdr", (tex: Texture) => {
	tex.colorSpace = LinearSRGBColorSpace;
	tex.minFilter = NearestFilter;
	tex.magFilter = NearestFilter;
	tex.flipY = true;

	HdrTexture.copy(tex);
	HdrTexture.needsUpdate = true;

	updateSphereMap(tex);
});
