import {
	ImageLoader,
	LinearSRGBColorSpace,
	NearestFilter,
	Texture,
} from "three";
import { hdrToneMappingProc } from "../components/process";
import { imageProps } from "../components/props";
import { RGBELoader } from "../examples/RGBELoader";
import { updateSphereMap } from "../materials/sphereMat";
import { HdrTexture } from "./iniHdrTexture";

const userTexture = new Texture();

userTexture.minFilter = NearestFilter;
userTexture.magFilter = NearestFilter;

const updateImage = (callback = () => {}) => {
	const reader = new FileReader();
	if (!imageProps.file) {
		alert("No file selected");
		return;
	}
	reader.readAsDataURL(imageProps.file);
	if (imageProps.format === "hdr") {
		const loader = new RGBELoader();
		reader.onload = (theFile) => {
			if (!theFile.target) {
				alert("No file selected");
				return;
			}
			const dataURL = theFile.target.result;
			loader.load(
				dataURL,
				(tex: Texture) => {
					tex.colorSpace = LinearSRGBColorSpace;
					tex.minFilter = NearestFilter;
					tex.magFilter = NearestFilter;
					tex.flipY = true;

					HdrTexture.copy(tex);
					HdrTexture.needsUpdate = true;
					hdrToneMappingProc(true);
					updateSphereMap(tex);
					callback();
				},
				undefined,
				(err: any) => {
					console.error("failed to load HDR texture", err);
				}
			);
		};
	} else {
		const loader = new ImageLoader();
		reader.onload = (theFile) => {
			if (!theFile.target) {
				alert("No file selected");
				return;
			}

			const dataURL = theFile.target.result;
			if (!dataURL) {
				alert("No file selected");
				return;
			}
			if (!(dataURL instanceof ArrayBuffer)) {
				loader.load(
					dataURL,
					(image) => {
						userTexture.image = image;
						userTexture.flipY = true;
						userTexture.needsUpdate = true;
						hdrToneMappingProc(false);
						updateSphereMap(userTexture);
						callback();
					},
					undefined,
					(err) => {
						console.error("error - loading image", err);
					}
				);
			}
		};
	}
};

export { updateImage };
