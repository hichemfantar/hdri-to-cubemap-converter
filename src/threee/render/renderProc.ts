// @ts-nocheck

import { Vector3 as V3 } from "three";
import { mainCamera, mainScene } from "../components/base";
import { procCamera, procRenderer } from "../components/process";
import { updateMaterial } from "../materials/sphereMat";

const renderCatch: {
	blobs: Blob[];
	names: string[];
	packed: boolean[];
	zipping: boolean;
	progNow: number;
	progTotal: number;
	canvas: HTMLCanvasElement;
} = {
	blobs: [],
	names: [],
	packed: [],
	zipping: false,
	progNow: 0,
	progTotal: 0,
	canvas: document.createElement("canvas"),
};

const calcAngle = () => {
	const direction = new V3();
	mainCamera.getWorldDirection(direction);
	const angle = direction.multiply(new V3(1, 0, 1)).angleTo(new V3(0, 0, -1));
	if (direction.x < 0) {
		return angle;
	} else {
		return -angle;
	}
};

const packBlobsSep = (
	callback = (href: any) => {},
	progress = (prog: any) => {}
) => {
	const { names, blobs } = renderCatch;
	renderCatch.packed = [false, false, false, false, false, false];
	console.log(blobs);

	zip.createWriter(new zip.BlobWriter(), (writer: any) => {
		const nester = (startIndex = 0, endIndex = 5, callback = () => {}) => {
			console.log("startIndex0:", startIndex);
			writer.add(
				names[startIndex],
				new zip.BlobReader(blobs[startIndex]),
				() => {
					renderCatch.packed[startIndex] = true;
					console.log("startIndex:", startIndex);

					renderCatch.progNow++;
					const { progNow, progTotal } = renderCatch;
					progress({ progNow, progTotal });

					if (startIndex >= endIndex) {
						callback();
					} else {
						nester(startIndex + 1, endIndex, callback);
					}
				}
			);
		};
		nester(0, 5, () => {
			console.log(renderCatch.packed);
			writer.close((blob: Blob) => {
				callback(URL.createObjectURL(blob));
			});
		});
	});
};

const storeBlobsSep = (
	name: string,
	callback = (href: string) => {},
	progress = (prog: { progNow: number; progTotal: number }) => {}
) => {
	procRenderer.domElement.toBlob((blob) => {
		if (!blob) {
			throw new Error("Blob not found");
		}
		renderCatch.blobs.push(blob);
		renderCatch.names.push(`${name}.png`);
		renderCatch.progNow++;
		const { progNow, progTotal } = renderCatch;
		progress({ progNow, progTotal });
		console.log("blob", blob);
		if (renderCatch.blobs.length === 6) {
			packBlobsSep(callback, progress);
		}
	});
};

const procRenderSep = (
	size = 64,
	callback = (href: string) => {},
	progress = (prog: { progNow: number; progTotal: number }) => {}
) => {
	renderCatch.blobs = [];
	renderCatch.names = [];
	renderCatch.progNow = 0;
	renderCatch.progTotal = 12;
	procRenderer.setSize(size, size);
	procCamera.rotation.set(0, 0, 0);

	const angle = calcAngle();
	procCamera.rotateY(angle);

	//+x
	updateMaterial();
	procCamera.rotateY(-Math.PI / 2);
	procRenderer.render(mainScene, procCamera);
	storeBlobsSep("px", callback, progress);
	//-x
	updateMaterial();
	procCamera.rotateY(Math.PI);
	procRenderer.render(mainScene, procCamera);
	storeBlobsSep("nx", callback, progress);
	//+y
	updateMaterial();
	procCamera.rotateY(-Math.PI / 2);
	procCamera.rotateX(Math.PI / 2);
	procRenderer.render(mainScene, procCamera);
	storeBlobsSep("py", callback, progress);
	//-y
	updateMaterial();
	procCamera.rotateX(-Math.PI);
	procRenderer.render(mainScene, procCamera);
	storeBlobsSep("ny", callback, progress);
	//+z
	updateMaterial();
	procCamera.rotateX(Math.PI / 2);
	procRenderer.render(mainScene, procCamera);
	storeBlobsSep("pz", callback, progress);
	//-z
	updateMaterial();
	procCamera.rotateY(Math.PI);
	procRenderer.render(mainScene, procCamera);
	storeBlobsSep("nz", callback, progress);

	// packBlobs(callback);
};

const procRenderUnity = (
	size = 64,
	callback = (href: string) => {},
	progress = (prog: { progNow: number; progTotal: number }) => {}
) => {
	renderCatch.progNow = 0;
	renderCatch.progTotal = 4;
	const { canvas } = renderCatch;
	canvas.width = size * 4;
	canvas.height = size * 3;
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new Error("Canvas context not found");
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	procRenderer.setSize(size, size);
	procCamera.rotation.set(0, 0, 0);

	const angle = calcAngle();
	procCamera.rotateY(angle);

	updateMaterial();
	procRenderer.render(mainScene, procCamera);
	ctx.drawImage(procRenderer.domElement, size, size);

	updateMaterial();
	procCamera.rotateY(-Math.PI / 2);
	procRenderer.render(mainScene, procCamera);
	ctx.drawImage(procRenderer.domElement, size * 2, size);

	updateMaterial();
	procCamera.rotateY(-Math.PI / 2);
	procRenderer.render(mainScene, procCamera);
	ctx.drawImage(procRenderer.domElement, size * 3, size);

	updateMaterial();
	procCamera.rotateY(-Math.PI / 2);
	procRenderer.render(mainScene, procCamera);
	ctx.drawImage(procRenderer.domElement, 0, size);

	updateMaterial();
	procCamera.rotateY(-Math.PI / 2);
	procCamera.rotateX(Math.PI / 2);
	procRenderer.render(mainScene, procCamera);
	ctx.drawImage(procRenderer.domElement, size, 0);

	updateMaterial();
	procCamera.rotateX(-Math.PI);
	procRenderer.render(mainScene, procCamera);
	ctx.drawImage(procRenderer.domElement, size, size * 2);

	renderCatch.progNow++;
	progress({ progNow: renderCatch.progNow, progTotal: renderCatch.progTotal });

	// document.body.appendChild(canvas);
	console.log("zip start");
	canvas.toBlob((blob) => {
		console.log("blob created");
		renderCatch.progNow++;
		progress({
			progNow: renderCatch.progNow,
			progTotal: renderCatch.progTotal,
		});

		zip.createWriter(new zip.BlobWriter(), (writer: any) => {
			writer.add("StandardCubeMap.png", new zip.BlobReader(blob), () => {
				renderCatch.progNow++;
				progress({
					progNow: renderCatch.progNow,
					progTotal: renderCatch.progTotal,
				});

				writer.close((blob: any) => {
					console.log("zip end");
					renderCatch.progNow++;
					progress({
						progNow: renderCatch.progNow,
						progTotal: renderCatch.progTotal,
					});

					callback(URL.createObjectURL(blob));
				});
			});
		});
	});
};

const procRenderUE4 = (
	size = 64,
	callback = (href: string) => {},
	progress = (prog: { progNow: number; progTotal: number }) => {}
) => {
	renderCatch.progNow = 0;
	renderCatch.progTotal = 4;
	const { canvas } = renderCatch;
	canvas.width = size * 6;
	canvas.height = size * 1;
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new Error("Canvas context not found");
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	procRenderer.setSize(size, size);
	procCamera.rotation.set(0, 0, 0);

	const angle = calcAngle();
	procCamera.rotateY(angle);
	//+z
	updateMaterial();
	procRenderer.render(mainScene, procCamera);
	ctx.drawImage(procRenderer.domElement, 3 * size, 0);
	//+x
	procCamera.rotateY(-Math.PI / 2);
	procCamera.rotateZ(-Math.PI / 2);
	updateMaterial();
	procRenderer.render(mainScene, procCamera);
	ctx.drawImage(procRenderer.domElement, 0, 0);
	//-z
	procCamera.rotateZ(Math.PI / 2);
	procCamera.rotateY(-Math.PI / 2);
	procCamera.rotateZ(Math.PI);
	updateMaterial();
	procRenderer.render(mainScene, procCamera);
	ctx.drawImage(procRenderer.domElement, 2 * size, 0);
	//-x
	procCamera.rotateZ(-Math.PI);
	procCamera.rotateY(-Math.PI / 2);
	procCamera.rotateZ(Math.PI / 2);
	updateMaterial();
	procRenderer.render(mainScene, procCamera);
	ctx.drawImage(procRenderer.domElement, 1 * size, 0);
	//+y
	procCamera.rotateZ(-Math.PI / 2);
	procCamera.rotateY(-Math.PI / 2);
	procCamera.rotateX(Math.PI / 2);
	updateMaterial();
	procRenderer.render(mainScene, procCamera);
	ctx.drawImage(procRenderer.domElement, 4 * size, 0);
	//-y
	procCamera.rotateX(-Math.PI);
	procCamera.rotateZ(Math.PI);
	updateMaterial();
	procRenderer.render(mainScene, procCamera);
	ctx.drawImage(procRenderer.domElement, 5 * size, 0);

	renderCatch.progNow++;
	progress({ progNow: renderCatch.progNow, progTotal: renderCatch.progTotal });

	console.log("zip start");
	canvas.toBlob((blob) => {
		console.log("blob created");
		renderCatch.progNow++;
		progress({
			progNow: renderCatch.progNow,
			progTotal: renderCatch.progTotal,
		});

		zip.createWriter(new zip.BlobWriter(), (writer: any) => {
			writer.add("StandardCubeMap.png", new zip.BlobReader(blob), () => {
				renderCatch.progNow++;
				progress({
					progNow: renderCatch.progNow,
					progTotal: renderCatch.progTotal,
				});

				writer.close((blob: any) => {
					console.log("zip end");
					renderCatch.progNow++;
					progress({
						progNow: renderCatch.progNow,
						progTotal: renderCatch.progTotal,
					});

					callback(URL.createObjectURL(blob));
				});
			});
		});
	});
};

export { procRenderSep, procRenderUE4, procRenderUnity };
