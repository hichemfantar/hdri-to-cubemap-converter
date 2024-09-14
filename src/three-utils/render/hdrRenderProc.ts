import { BlobReader, BlobWriter, ZipWriter } from "@zip.js/zip.js";
import { Vector3 as V3 } from "three";
import { hdrConverterEmmisive } from "../../converters/hdrConverterEmissive";
import { mainCamera } from "../components/base";
import {
	hdrProcRenderer,
	hdrRenderTarget,
	hdrScene,
	procCamera,
} from "../components/process";
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

const packBlobsSep = async (
	callback: (href: string) => void,
	progress: (prog: { progNow: number; progTotal: number }) => void
) => {
	const { names, blobs } = renderCatch;
	renderCatch.packed = Array(blobs.length).fill(false);

	// Create a BlobWriter to write the zip file
	const zipFileWriter = new BlobWriter();
	const zipWriter = new ZipWriter(zipFileWriter);

	// Function to recursively add blobs to the zip file
	const addBlobs = async (index = 0) => {
		if (index >= blobs.length) {
			await zipWriter.close(); // Close the writer when done
			const zipFileBlob = await zipFileWriter.getData(); // Retrieve the Blob
			callback(URL.createObjectURL(zipFileBlob)); // Call the callback with the Blob URL
			return;
		}

		// Add a blob to the zip file
		await zipWriter.add(names[index], new BlobReader(blobs[index]));
		renderCatch.packed[index] = true;

		// Update progress
		renderCatch.progNow++;
		progress({
			progNow: renderCatch.progNow,
			progTotal: renderCatch.progTotal,
		});

		// Recursively process the next blob
		await addBlobs(index + 1);
	};

	// Start adding blobs
	await addBlobs();
};

const storeBlobsSep = (
	name: string,
	callback: (href: string) => void,
	progress: (prog: { progNow: number; progTotal: number }) => void
) => {
	const width = hdrRenderTarget.width;
	const height = hdrRenderTarget.height;
	const rgbeBuffer = new Uint8ClampedArray(width * height * 4);
	hdrProcRenderer.readRenderTargetPixels(
		hdrRenderTarget,
		0,
		0,
		width,
		height,
		rgbeBuffer
	);
	console.log("PixelDataTest", rgbeBuffer);
	hdrConverterEmmisive({
		width: width,
		height: height,
		rgbeBuffer: rgbeBuffer,
	}).then((blob) => {
		renderCatch.blobs.push(blob);
		renderCatch.names.push(`${name}.hdr`);
		renderCatch.progNow++;
		progress({
			progNow: renderCatch.progNow,
			progTotal: renderCatch.progTotal,
		});
		console.log("blob", blob);
		if (renderCatch.blobs.length === 6) {
			packBlobsSep(callback, progress);
		}
	});
};

const hdrProcRenderSep = (
	size = 64,
	callback: (href: string) => void,
	progress: (prog: { progNow: number; progTotal: number }) => void
) => {
	renderCatch.blobs = [];
	renderCatch.names = [];
	renderCatch.progNow = 0;
	renderCatch.progTotal = 12;
	hdrProcRenderer.setSize(size, size);
	hdrRenderTarget.setSize(size, size);
	procCamera.rotation.set(0, 0, 0);

	const angle = calcAngle();
	procCamera.rotateY(angle);

	//+x
	updateMaterial();
	procCamera.rotateY(-Math.PI / 2);
	hdrProcRenderer.render(hdrScene, procCamera);

	// hdrProcRenderer.render(hdrScene, procCamera, hdrRenderTarget);
	hdrProcRenderer.setRenderTarget(hdrRenderTarget);
	hdrProcRenderer.clear();
	hdrProcRenderer.render(hdrScene, procCamera);

	storeBlobsSep("px", callback, progress);
	//-x
	updateMaterial();
	procCamera.rotateY(Math.PI);
	hdrProcRenderer.render(hdrScene, procCamera);

	// hdrProcRenderer.render(hdrScene, procCamera, hdrRenderTarget);
	hdrProcRenderer.setRenderTarget(hdrRenderTarget);
	hdrProcRenderer.clear();
	hdrProcRenderer.render(hdrScene, procCamera);

	storeBlobsSep("nx", callback, progress);
	//+y
	updateMaterial();
	procCamera.rotateY(-Math.PI / 2);
	procCamera.rotateX(Math.PI / 2);
	hdrProcRenderer.render(hdrScene, procCamera);

	// hdrProcRenderer.render(hdrScene, procCamera, hdrRenderTarget);
	hdrProcRenderer.setRenderTarget(hdrRenderTarget);
	hdrProcRenderer.clear();
	hdrProcRenderer.render(hdrScene, procCamera);

	storeBlobsSep("py", callback, progress);
	//-y
	updateMaterial();
	procCamera.rotateX(-Math.PI);
	hdrProcRenderer.render(hdrScene, procCamera);

	// hdrProcRenderer.render(hdrScene, procCamera, hdrRenderTarget);
	hdrProcRenderer.setRenderTarget(hdrRenderTarget);
	hdrProcRenderer.clear();
	hdrProcRenderer.render(hdrScene, procCamera);

	storeBlobsSep("ny", callback, progress);
	//+z
	updateMaterial();
	procCamera.rotateX(Math.PI / 2);
	hdrProcRenderer.render(hdrScene, procCamera);

	// hdrProcRenderer.render(hdrScene, procCamera, hdrRenderTarget);
	hdrProcRenderer.setRenderTarget(hdrRenderTarget);
	hdrProcRenderer.clear();
	hdrProcRenderer.render(hdrScene, procCamera);

	storeBlobsSep("pz", callback, progress);
	//-z
	updateMaterial();
	procCamera.rotateY(Math.PI);
	hdrProcRenderer.render(hdrScene, procCamera);

	// hdrProcRenderer.render(hdrScene, procCamera, hdrRenderTarget);
	hdrProcRenderer.setRenderTarget(hdrRenderTarget);
	hdrProcRenderer.clear();
	hdrProcRenderer.render(hdrScene, procCamera);

	storeBlobsSep("nz", callback, progress);

	// packBlobs(callback);
};

const hdrProcRenderUnity = (
	size = 64,
	callback: (href: string) => void,
	progress: (prog: { progNow: number; progTotal: number }) => void
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

	hdrProcRenderer.setSize(size, size);
	procCamera.rotation.set(0, 0, 0);

	const angle = calcAngle();
	procCamera.rotateY(angle);

	updateMaterial();
	hdrProcRenderer.render(hdrScene, procCamera);
	ctx.drawImage(hdrProcRenderer.domElement, size, size);

	updateMaterial();
	procCamera.rotateY(-Math.PI / 2);
	hdrProcRenderer.render(hdrScene, procCamera);
	ctx.drawImage(hdrProcRenderer.domElement, size * 2, size);

	updateMaterial();
	procCamera.rotateY(-Math.PI / 2);
	hdrProcRenderer.render(hdrScene, procCamera);
	ctx.drawImage(hdrProcRenderer.domElement, size * 3, size);

	updateMaterial();
	procCamera.rotateY(-Math.PI / 2);
	hdrProcRenderer.render(hdrScene, procCamera);
	ctx.drawImage(hdrProcRenderer.domElement, 0, size);

	updateMaterial();
	procCamera.rotateY(-Math.PI / 2);
	procCamera.rotateX(Math.PI / 2);
	hdrProcRenderer.render(hdrScene, procCamera);
	ctx.drawImage(hdrProcRenderer.domElement, size, 0);

	updateMaterial();
	procCamera.rotateX(-Math.PI);
	hdrProcRenderer.render(hdrScene, procCamera);
	ctx.drawImage(hdrProcRenderer.domElement, size, size * 2);

	renderCatch.progNow++;
	progress({ progNow: renderCatch.progNow, progTotal: renderCatch.progTotal });

	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

	hdrConverterEmmisive({
		width: canvas.width,
		height: canvas.height,
		rgbeBuffer: imageData.data,
		fromBottom: false,
	}).then(async (blob) => {
		console.log("blob created");
		renderCatch.progNow++;
		progress({
			progNow: renderCatch.progNow,
			progTotal: renderCatch.progTotal,
		});

		// Create a BlobWriter to write the zip file
		const zipFileWriter = new BlobWriter();
		const zipWriter = new ZipWriter(zipFileWriter);

		// Add a single entry to the zip file
		await zipWriter.add("StandardCubeMap.hdr", new BlobReader(blob));

		// Update progress after adding the entry
		renderCatch.progNow++;
		const { progNow, progTotal } = renderCatch;
		progress({ progNow, progTotal });

		// Close the zip writer and handle the resulting Blob
		const zipFileBlob = await zipWriter.close();
		renderCatch.progNow++;
		progress({ progNow: renderCatch.progNow, progTotal });

		// Call the callback with the Blob URL
		callback(URL.createObjectURL(zipFileBlob));

		console.log("zip end");
	});
};

const hdrProcRenderUE4 = (
	size = 64,
	callback: (href: string) => void,
	progress: (prog: { progNow: number; progTotal: number }) => void
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

	hdrProcRenderer.setSize(size, size);
	procCamera.rotation.set(0, 0, 0);

	const angle = calcAngle();
	procCamera.rotateY(angle);
	//+z
	updateMaterial();
	hdrProcRenderer.render(hdrScene, procCamera);
	ctx.drawImage(hdrProcRenderer.domElement, 3 * size, 0);
	//+x
	procCamera.rotateY(-Math.PI / 2);
	procCamera.rotateZ(-Math.PI / 2);
	updateMaterial();
	hdrProcRenderer.render(hdrScene, procCamera);
	ctx.drawImage(hdrProcRenderer.domElement, 0, 0);
	//-z
	procCamera.rotateZ(Math.PI / 2);
	procCamera.rotateY(-Math.PI / 2);
	procCamera.rotateZ(Math.PI);
	updateMaterial();
	hdrProcRenderer.render(hdrScene, procCamera);
	ctx.drawImage(hdrProcRenderer.domElement, 2 * size, 0);
	//-x
	procCamera.rotateZ(-Math.PI);
	procCamera.rotateY(-Math.PI / 2);
	procCamera.rotateZ(Math.PI / 2);
	updateMaterial();
	hdrProcRenderer.render(hdrScene, procCamera);
	ctx.drawImage(hdrProcRenderer.domElement, 1 * size, 0);
	//+y
	procCamera.rotateZ(-Math.PI / 2);
	procCamera.rotateY(-Math.PI / 2);
	procCamera.rotateX(Math.PI / 2);
	updateMaterial();
	hdrProcRenderer.render(hdrScene, procCamera);
	ctx.drawImage(hdrProcRenderer.domElement, 4 * size, 0);
	//-y
	procCamera.rotateX(-Math.PI);
	procCamera.rotateZ(Math.PI);
	updateMaterial();
	hdrProcRenderer.render(hdrScene, procCamera);
	ctx.drawImage(hdrProcRenderer.domElement, 5 * size, 0);

	renderCatch.progNow++;
	progress({ progNow: renderCatch.progNow, progTotal: renderCatch.progTotal });

	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	console.log("zip start");
	hdrConverterEmmisive({
		width: canvas.width,
		height: canvas.height,
		rgbeBuffer: imageData.data,
		fromBottom: false,
	}).then(async (blob) => {
		console.log("blob created");
		renderCatch.progNow++;
		progress({
			progNow: renderCatch.progNow,
			progTotal: renderCatch.progTotal,
		});

		// Create a BlobWriter to write the zip file
		const zipFileWriter = new BlobWriter();
		const zipWriter = new ZipWriter(zipFileWriter);

		// Add a single entry to the zip file
		await zipWriter.add("StandardCubeMap.hdr", new BlobReader(blob));

		// Update progress after adding the entry
		renderCatch.progNow++;
		progress({
			progNow: renderCatch.progNow,
			progTotal: renderCatch.progTotal,
		});

		// Close the zip writer and handle the resulting Blob
		const zipFileBlob = await zipWriter.close();
		renderCatch.progNow++;
		progress({
			progNow: renderCatch.progNow,
			progTotal: renderCatch.progTotal,
		});

		// Call the callback with the Blob URL
		callback(URL.createObjectURL(zipFileBlob));

		console.log("zip end");
	});

	// console.log('zip start')
	// canvas.toBlob(blob => {
	//   console.log('blob created')
	//   renderCatch.progNow++
	//   progress({ progNow: renderCatch.progNow, progTotal: renderCatch.progTotal });

	//   zip.createWriter(new zip.BlobWriter(), writer => {
	//     writer.add('StandardCubeMap.hdr', new zip.BlobReader(blob), () => {
	//       renderCatch.progNow++
	//       progress({ progNow: renderCatch.progNow, progTotal: renderCatch.progTotal });

	//       writer.close(blob => {
	//         console.log('zip end')
	//         renderCatch.progNow++
	//         progress({ progNow: renderCatch.progNow, progTotal: renderCatch.progTotal });

	//         callback(URL.createObjectURL(blob));
	//       });
	//     });
	//   });
	// });
};

export { hdrProcRenderSep, hdrProcRenderUE4, hdrProcRenderUnity };
