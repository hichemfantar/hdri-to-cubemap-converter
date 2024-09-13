import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { GridRender } from "./GridRender";
import { SaveDialog } from "./SaveDialog";
import { hdrToneMapping, setExposure } from "./threee/components/base";
import {
	hdrToneMappingConv,
	setExposureConv,
	updateConv,
} from "./threee/components/convert";
import { hdrToneMappingProc } from "./threee/components/process";
import { imageProps, renderProps } from "./threee/components/props";
import render from "./threee/render/render";
import preview from "./threee/scenes/preview";
import { updateImage } from "./threee/textures/userTexture";

type tabType = "3d_view" | "cubemap_view";

function App() {
	useEffect(() => {
		preview();
		render();

		return () => {};
	}, []);

	const [cubeUpdated, setCubeUpdated] = useState(false);
	const [showCanvas, setShowCanvas] = useState(false);
	console.log(showCanvas);

	const [exposure, setExposureState] = useState(
		(renderProps.exposure / renderProps.maxExposure) * 100
	);
	const [activeTab, setActiveTab] = useState<tabType>("3d_view");
	const handleTabChange = (value: tabType) => {
		setActiveTab(value);
		if (!cubeUpdated) {
			updateConv();
			setCubeUpdated(true);
		}
	};

	const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) {
			alert("No File Selected");
			return;
		}

		const file = e.target.files[0];
		const format = file.name.split(".").slice(-1)[0];
		const formats = ["png", "jpg", "hdr"];

		if (formats.includes(format)) {
			// console.log(`File Accepted (${file.name.split(".").slice(-1)[0]})`);
			setShowCanvas(true);
			imageProps.file = file;
			imageProps.loaded = true;
			imageProps.format = format;
			updateImage(() => {
				if (format === "hdr") {
					hdrToneMapping(true);
					hdrToneMappingConv(true);
					hdrToneMappingProc(true);
				} else {
					hdrToneMapping(false);
					hdrToneMappingConv(false);
					hdrToneMappingProc(false);
				}
				setExposureState(
					(renderProps.exposure / renderProps.maxExposure) * 100
				);
			});
		} else {
			// console.log(`Wrong File (${file.name.split('.').slice(-1)[0]})`)
			alert(
				`You used Wrong File (${
					file.name.split(".").slice(-1)[0]
				}) \n I accept only (.jpg,.png,.hdr) for now.`
			);
			setShowCanvas(false);
			imageProps.file = null;
			imageProps.loaded = false;
			imageProps.format = "";
		}
	};

	const onExposureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = parseInt(e.target.value);
		setExposureState(val);
		renderProps.exposure = parseFloat(
			(val * (renderProps.maxExposure / 100)).toFixed(2)
		);
		setExposure();
		setExposureConv();
	};

	return (
		<>
			<div className="container p-4 mx-auto space-y-8 max-w-4xl">
				{/* <TypographyH2>HDRI to Cubemap Converter</TypographyH2> */}
				<Tabs
					value={activeTab}
					// className="w-[400px]"
					onValueChange={(v) => {
						handleTabChange(v as tabType);
					}}
				>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="3d_view">3D View</TabsTrigger>
						<TabsTrigger value="cubemap_view">Cubemap View</TabsTrigger>
					</TabsList>
					<TabsContent
						forceMount
						value="3d_view"
						hidden={activeTab !== "3d_view"}
					>
						<Card>
							{/* <CardHeader>
								<CardTitle>Account</CardTitle>
								<CardDescription>
									Make changes to your account here. Click save when you're
									done.
								</CardDescription>
							</CardHeader> */}
							<CardContent className="space-y-2">
								<canvas id={"MainCanvas"} className="w-full rounded-md" />
							</CardContent>
							{/* <CardFooter>
								<Button>Save changes</Button>
							</CardFooter> */}
						</Card>
					</TabsContent>
					<TabsContent
						forceMount
						value="cubemap_view"
						hidden={activeTab !== "cubemap_view"}
					>
						<Card>
							{/* <CardHeader>
								<CardTitle>Password</CardTitle>
								<CardDescription>
									Change your password here. After saving, you'll be logged out.
								</CardDescription>
							</CardHeader> */}
							<CardContent className="space-y-2">
								<GridRender />
							</CardContent>
							{/* <CardFooter>
								<Button>Save password</Button>
							</CardFooter> */}
						</Card>
					</TabsContent>
				</Tabs>
				<div>
					<div style={{ textAlign: "center", fontSize: 13, fontWeight: 550 }}>
						Exposure = {(exposure * (renderProps.maxExposure / 100)).toFixed(2)}
					</div>
					<input
						type="range"
						min="0"
						max="100"
						value={exposure}
						onChange={onExposureChange}
						className="w-full"
					/>
				</div>

				<div className="flex justify-between items-center">
					<div>
						<Button>Upload HDRI</Button>
						<input id="flat-button-file" type="file" onChange={onFileUpload} />
					</div>

					<SaveDialog />
				</div>
			</div>
		</>
	);
}

export default App;
