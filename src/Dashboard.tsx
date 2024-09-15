import {
	Book,
	Bot,
	Code2,
	LifeBuoy,
	Settings,
	Settings2,
	SquareTerminal,
	SquareUser,
	Triangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import { ColorSpace } from "three";
import { ModeToggle } from "./components/theme/mode-toggle";
import { Slider } from "./components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { CubemapRender } from "./CubemapRender";
import { cn } from "./lib/utils";
import { ExportDialog } from "./ExportDialog";
import {
	hdrToneMapping,
	setColorSpace,
	setExposure,
} from "./three-utils/components/base";
import {
	hdrToneMappingConv,
	setColorSpaceConv,
	setExposureConv,
	updateConv,
} from "./three-utils/components/convert";
import { hdrToneMappingProc } from "./three-utils/components/process";
import { imageProps, renderProps } from "./three-utils/components/props";
import { render } from "./three-utils/render/render";
import { preview } from "./three-utils/scenes/preview";
import { updateImage } from "./three-utils/textures/userTexture";

type tabType = "3d_view" | "cubemap_view";

export const description =
	"An AI playground with a sidebar navigation and a main content area. The playground has a header with a settings drawer and a share button. The sidebar has navigation links and a user menu. The main content area shows a form to configure the model and messages.";

function ExposureInput({
	value,
	onChange,
}: {
	value: number;
	onChange: (v: number) => void;
}) {
	return (
		<div className="grid gap-3">
			<Label htmlFor="exposure">
				Exposure (preview only) ={" "}
				{(value * (renderProps.maxExposure / 100)).toFixed(2)}
			</Label>
			<Slider
				id="exposure"
				value={[value]}
				min={0}
				max={100}
				step={1}
				onValueChange={(e) => onChange(e[0])}
				className="w-full"
			/>
		</div>
	);
}

function ImageInput({
	onChange,
}: {
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	return (
		<div>
			<label
				className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				htmlFor="file_input"
			>
				Upload file
			</label>
			<Input
				aria-describedby="file_input_help"
				id="file_input"
				type="file"
				accept="image/*, .hdr"
				onChange={onChange}
			/>
			<p
				className="mt-1 text-sm text-gray-500 dark:text-gray-300"
				id="file_input_help"
			>
				Accepted files: Images
			</p>
		</div>
	);
}

function ColorSpaceInput({
	onChange,
	value,
}: {
	onChange: (v: ColorSpace) => void;
	value: ColorSpace;
}) {
	return (
		<div className="grid gap-3">
			<Label htmlFor="color-space">Color Space (preview only)</Label>
			<Select onValueChange={(v) => onChange(v as ColorSpace)} value={value}>
				<SelectTrigger id="color-space" aria-label={value}>
					<SelectValue placeholder="Select a color space" />
				</SelectTrigger>
				<SelectContent>
					{(
						[
							"display-p3",
							"display-p3-linear",
							"srgb",
							"srgb-linear",
						] as ColorSpace[]
					).map((val) => (
						<SelectItem key={val} value={val}>
							{val}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

export function Dashboard() {
	useEffect(() => {
		preview();
		render();

		return () => {};
	}, []);

	const [cubeUpdated, setCubeUpdated] = useState(false);
	const [showCanvas, setShowCanvas] = useState(false);
	const [exposure, setExposureState] = useState(
		(renderProps.exposure / renderProps.maxExposure) * 100
	);
	const [colorSpace, setColorSpaceState] = useState(renderProps.colorSpace);
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
				`Unsupported file type (${
					file.name.split(".").slice(-1)[0]
				}) \n Accepted files are (.jpg,.png,.hdr) for now.`
			);
			setShowCanvas(false);
			imageProps.file = null;
			imageProps.loaded = false;
			imageProps.format = "";
		}
	};

	const onExposureChange = (v: number) => {
		setExposureState(v);
		renderProps.exposure = parseFloat(
			(v * (renderProps.maxExposure / 100)).toFixed(2)
		);
		setExposure();
		setExposureConv();
	};

	const onColorSpaceChange = (v: ColorSpace) => {
		setColorSpaceState(v);
		renderProps.colorSpace = v;
		setColorSpace();
		setColorSpaceConv();
	};

	return (
		<TooltipProvider>
			<div className="mx-auto container grid h-screen w-full xpl-[53px]">
				{/* <Aside /> */}
				<div className="flex flex-col">
					<header className="sticky top-0 z-10 flex py-2 items-center gap-1 border-b bg-background px-4 flex-wrap justify-between">
						<div>
							<h1 className="text-xl font-semibold">
								HDRI to Cubemap{" "}
								<span className="hidden md:inline">Converter</span>
							</h1>
						</div>
						<div className="flex items-center flex-wrap gap-1">
							{false && (
								<Drawer>
									<DrawerTrigger asChild>
										<Button variant="ghost" size="icon" className="md:hidden">
											<Settings className="size-4" />
											<span className="sr-only">Settings</span>
										</Button>
									</DrawerTrigger>
									<DrawerContent className="max-h-[80vh]">
										<DrawerHeader>
											<DrawerTitle>Configuration</DrawerTitle>
											<DrawerDescription>
												Configure the settings for the model and messages.
											</DrawerDescription>
										</DrawerHeader>
										<form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
											<fieldset className="grid gap-6 rounded-lg border p-4">
												<legend className="-ml-1 px-1 text-sm font-medium">
													Settings
												</legend>
												<ImageInput onChange={onFileUpload} />

												<ColorSpaceInput
													value={colorSpace}
													onChange={onColorSpaceChange}
												/>

												<ExposureInput
													value={exposure}
													onChange={onExposureChange}
												/>

												{/* <div className="grid gap-3">
											<Label htmlFor="temperature">Temperature</Label>
											<Input id="temperature" type="number" placeholder="0.4" />
										</div>
										<div className="grid gap-3">
											<Label htmlFor="top-p">Top P</Label>
											<Input id="top-p" type="number" placeholder="0.7" />
										</div>
										<div className="grid gap-3">
											<Label htmlFor="top-k">Top K</Label>
											<Input id="top-k" type="number" placeholder="0.0" />
										</div> */}
											</fieldset>
										</form>
									</DrawerContent>
								</Drawer>
							)}
							{/* <Button
							variant="outline"
							size="sm"
							className="ml-auto gap-1.5 text-sm"
						>
							<Share className="size-3.5" />
							Share
						</Button> */}
							{/* <div className="">
								<SaveDialog />
							</div> */}

							<Button asChild variant="ghost" size={"icon"} color="primary">
								<a
									href={
										"https://github.com/hichemfantar/hdri-to-cubemap-converter"
									}
									target="_blank"
									aria-label="Star me on github"
								>
									<GitHubLogoIcon className={cn("w-5 h-5")} />
								</a>
							</Button>
							<ModeToggle />
						</div>
					</header>
					<main className="grid md:flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
						<div className="xhidden flex-col items-start gap-8 md:flex">
							<form className="grid w-full items-start gap-6">
								<fieldset className="grid gap-6 rounded-lg border p-4">
									<legend className="-ml-1 px-1 text-sm font-medium">
										Settings
									</legend>

									<ImageInput onChange={onFileUpload} />

									<ColorSpaceInput
										value={colorSpace}
										onChange={onColorSpaceChange}
									/>

									<ExposureInput value={exposure} onChange={onExposureChange} />

									{/* <div className="grid gap-3">
										<Label htmlFor="temperature">Temperature</Label>
										<Input id="temperature" type="number" placeholder="0.4" />
									</div> */}

									{/* <div className="grid grid-cols-2 gap-4">
										<div className="grid gap-3">
											<Label htmlFor="top-p">Top P</Label>
											<Input id="top-p" type="number" placeholder="0.7" />
										</div>
										<div className="grid gap-3">
											<Label htmlFor="top-k">Top K</Label>
											<Input id="top-k" type="number" placeholder="0.0" />
										</div>
									</div> */}

									<ExportDialog className="w-full" />
								</fieldset>
							</form>
						</div>

						<div className="lg:col-span-2">
							<div className="relative flex xh-full xxmd:min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4">
								{/* <Badge variant="outline" className="absolute right-3 top-3">
								Output
							</Badge> */}
								<div className="flex-1">
									<Tabs
										value={activeTab}
										onValueChange={(v) => {
											handleTabChange(v as tabType);
										}}
									>
										<TabsList className="grid w-full grid-cols-2">
											<TabsTrigger value="3d_view">3D View</TabsTrigger>
											<TabsTrigger value="cubemap_view">
												Cubemap View
											</TabsTrigger>
										</TabsList>
										<TabsContent
											forceMount
											value="3d_view"
											hidden={activeTab !== "3d_view"}
										>
											<canvas id={"MainCanvas"} className="w-full rounded-md" />
										</TabsContent>
										<TabsContent
											forceMount
											value="cubemap_view"
											hidden={activeTab !== "cubemap_view"}
										>
											<CubemapRender />
										</TabsContent>
									</Tabs>
								</div>
								{/* <form
									className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
								>
									<Label htmlFor="message" className="sr-only">
										Message
									</Label>
									<Textarea
										id="message"
										placeholder="Type your message here..."
										className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
									/>
									<div className="flex items-center p-3 pt-0">
										<Tooltip>
											<TooltipTrigger asChild>
												<Button variant="ghost" size="icon">
													<Paperclip className="size-4" />
													<span className="sr-only">Attach file</span>
												</Button>
											</TooltipTrigger>
											<TooltipContent side="top">Attach File</TooltipContent>
										</Tooltip>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button variant="ghost" size="icon">
													<Mic className="size-4" />
													<span className="sr-only">Use Microphone</span>
												</Button>
											</TooltipTrigger>
											<TooltipContent side="top">Use Microphone</TooltipContent>
										</Tooltip>
										<Button type="submit" size="sm" className="ml-auto gap-1.5">
											Send Message
											<CornerDownLeft className="size-3.5" />
										</Button>
									</div>
								</form> */}
							</div>
						</div>
					</main>
				</div>
			</div>
		</TooltipProvider>
	);
}

function Aside() {
	return (
		<aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
			<div className="border-b p-2">
				<Button variant="outline" size="icon" aria-label="Home">
					<Triangle className="size-5 fill-foreground" />
				</Button>
			</div>
			<nav className="grid gap-1 p-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="rounded-lg bg-muted"
							aria-label="Playground"
						>
							<SquareTerminal className="size-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Playground
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="rounded-lg"
							aria-label="Models"
						>
							<Bot className="size-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Models
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="rounded-lg"
							aria-label="API"
						>
							<Code2 className="size-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						API
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="rounded-lg"
							aria-label="Documentation"
						>
							<Book className="size-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Documentation
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="rounded-lg"
							aria-label="Settings"
						>
							<Settings2 className="size-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Settings
					</TooltipContent>
				</Tooltip>
			</nav>
			<nav className="mt-auto grid gap-1 p-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="mt-auto rounded-lg"
							aria-label="Help"
						>
							<LifeBuoy className="size-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Help
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="mt-auto rounded-lg"
							aria-label="Account"
						>
							<SquareUser className="size-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Account
					</TooltipContent>
				</Tooltip>
			</nav>
		</aside>
	);
}
