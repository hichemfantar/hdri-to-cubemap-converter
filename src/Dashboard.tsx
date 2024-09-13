import {
	Bird,
	Book,
	Bot,
	Code2,
	LifeBuoy,
	Rabbit,
	Settings,
	Settings2,
	SquareTerminal,
	SquareUser,
	Triangle,
	Turtle,
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
import React, { useEffect, useState } from "react";
import { ModeToggle } from "./components/mode-toggle";
import { Slider } from "./components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { GridRender } from "./GridRender";
import { SaveDialog } from "./SaveDialog";
import {
	hdrToneMapping,
	setColorSpace,
	setExposure,
} from "./threee/components/base";
import {
	hdrToneMappingConv,
	setColorSpaceConv,
	setExposureConv,
	updateConv,
} from "./threee/components/convert";
import { hdrToneMappingProc } from "./threee/components/process";
import { imageProps, renderProps } from "./threee/components/props";
import render from "./threee/render/render";
import preview from "./threee/scenes/preview";
import { updateImage } from "./threee/textures/userTexture";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { cn } from "./lib/utils";
import { ColorSpace } from "three";

type tabType = "3d_view" | "cubemap_view";

export const description =
	"An AI playground with a sidebar navigation and a main content area. The playground has a header with a settings drawer and a share button. The sidebar has navigation links and a user menu. The main content area shows a form to configure the model and messages.";

export function Dashboard() {
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

	const onExposureChange = (v: number[]) => {
		const val = v[0];
		setExposureState(val);
		renderProps.exposure = parseFloat(
			(val * (renderProps.maxExposure / 100)).toFixed(2)
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

	// const onExposureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	const val = parseInt(e.target.value);
	// 	setExposureState(val);
	// 	renderProps.exposure = parseFloat(
	// 		(val * (renderProps.maxExposure / 100)).toFixed(2)
	// 	);
	// 	setExposure();
	// 	setExposureConv();
	// };

	function ExposureInput() {
		return (
			<div className="grid gap-3">
				<Label htmlFor="exposure">
					Exposure (preview only) ={" "}
					{(exposure * (renderProps.maxExposure / 100)).toFixed(2)}
				</Label>
				<Slider
					id="exposure"
					value={[exposure]}
					min={0}
					max={100}
					step={1}
					onValueChange={onExposureChange}
					className="w-full"
				/>
				{/* <input
						type="range"
						min="0"
						max="100"
						value={exposure}
						onChange={onExposureChange}
						className="w-full"
					/> */}
			</div>
		);
	}
	function ImageInput() {
		return (
			<div className="grid gap-3">
				<Label htmlFor="model">Color Space (preview only)</Label>
				<Select
					onValueChange={(v) => onColorSpaceChange(v as ColorSpace)}
					value={colorSpace}
				>
					<SelectTrigger
						id="model"
						className="items-start [&_[data-description]]:hidden"
					>
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
								<div className="flex items-start gap-3 text-muted-foreground">
									<span>{val}</span>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		);
	}

	return (
		<TooltipProvider>
			<div className="mx-auto container grid h-screen w-full xpl-[53px]">
				{/* <Aside /> */}
				<div className="flex flex-col">
					<header className="sticky top-0 z-10 flex py-2 items-center gap-1 border-b bg-background px-4 flex-wrap">
						<h1 className="text-xl font-semibold">HDRI to Cubemap Converter</h1>
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
										<div className="grid gap-3">
											<Label htmlFor="model">Model</Label>
											<Select>
												<SelectTrigger
													id="model"
													className="items-start [&_[data-description]]:hidden"
												>
													<SelectValue placeholder="Select a model" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="genesis">
														<div className="flex items-start gap-3 text-muted-foreground">
															<Rabbit className="size-5" />
															<div className="grid gap-0.5">
																<p>
																	Neural{" "}
																	<span className="font-medium text-foreground">
																		Genesis
																	</span>
																</p>
																<p className="text-xs" data-description>
																	Our fastest model for general use cases.
																</p>
															</div>
														</div>
													</SelectItem>
													<SelectItem value="explorer">
														<div className="flex items-start gap-3 text-muted-foreground">
															<Bird className="size-5" />
															<div className="grid gap-0.5">
																<p>
																	Neural{" "}
																	<span className="font-medium text-foreground">
																		Explorer
																	</span>
																</p>
																<p className="text-xs" data-description>
																	Performance and speed for efficiency.
																</p>
															</div>
														</div>
													</SelectItem>
													<SelectItem value="quantum">
														<div className="flex items-start gap-3 text-muted-foreground">
															<Turtle className="size-5" />
															<div className="grid gap-0.5">
																<p>
																	Neural{" "}
																	<span className="font-medium text-foreground">
																		Quantum
																	</span>
																</p>
																<p className="text-xs" data-description>
																	The most powerful model for complex
																	computations.
																</p>
															</div>
														</div>
													</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<ExposureInput />

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
						{/* <Button
							variant="outline"
							size="sm"
							className="ml-auto gap-1.5 text-sm"
						>
							<Share className="size-3.5" />
							Share
						</Button> */}
						<div className="ml-auto">
							<SaveDialog />
						</div>

						<Button asChild variant="ghost" size={"icon"} color="primary">
							<a
								href={
									"https://github.com/hichemfantar/hdri-to-cubemap-converter"
								}
								target="_blank"
							>
								<GitHubLogoIcon className={cn("w-5 h-5")} />
							</a>
						</Button>
						<ModeToggle />
					</header>
					<main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
						<div
							className="relative hidden flex-col items-start gap-8 md:flex"
							x-chunk="dashboard-03-chunk-0"
						>
							<form className="grid w-full items-start gap-6">
								<fieldset className="grid gap-6 rounded-lg border p-4">
									<legend className="-ml-1 px-1 text-sm font-medium">
										Settings
									</legend>
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
											onChange={onFileUpload}
										/>
										<p
											className="mt-1 text-sm text-gray-500 dark:text-gray-300"
											id="file_input_help"
										>
											Accepted files: Images
										</p>
									</div>

									<ImageInput />

									<ExposureInput />

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
								</fieldset>
							</form>
						</div>
						<div className="lg:col-span-2">
							<div className="relative flex xh-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4">
								{/* <Badge variant="outline" className="absolute right-3 top-3">
								Output
							</Badge> */}
								<div className="flex-1">
									<Tabs
										value={activeTab}
										// className="w-[400px]"
										onValueChange={(v) => {
											handleTabChange(v as tabType);
										}}
										// className="h-full"
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
											// className="h-full"
										>
											<canvas id={"MainCanvas"} className="w-full rounded-md" />
										</TabsContent>
										<TabsContent
											forceMount
											value="cubemap_view"
											hidden={activeTab !== "cubemap_view"}
										>
											<GridRender />
										</TabsContent>
									</Tabs>
								</div>
								{/* <form
									className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
									x-chunk="dashboard-03-chunk-1"
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
