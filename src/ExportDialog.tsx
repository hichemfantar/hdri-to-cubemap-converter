import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { CogIcon, Pencil, SaveIcon } from "lucide-react";
import { useState } from "react";
import { CrossLayout } from "./components/export-settings/CrossLayout";
import { FormatSelect } from "./components/export-settings/FormatSelect";
import { LineLayout } from "./components/export-settings/LineLayout";
import { ResolutionSelect } from "./components/export-settings/ResolutionSelect";
import { SeparateLayout } from "./components/export-settings/SeparateLayout";
import { Progress } from "./components/ui/progress";
import { cn } from "./lib/utils";
import {
	hdrProcRenderSep,
	hdrProcRenderUE4,
	hdrProcRenderUnity,
} from "./three-utils/render/hdrRenderProc";
import {
	procRenderSep,
	procRenderUE4,
	procRenderUnity,
} from "./three-utils/render/renderProc";
import { CopyCodeButton } from "./components/CopyCode";

type Selection = "cross" | "line" | "separate";

export function ExportDialog({ className, ...props }: { className?: string }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className={cn("gap-1.5 text-sm", className)} {...props}>
					<Pencil className="size-3.5" />
					Convert
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[700px] overflow-auto max-h-dvh">
				<Content />
			</DialogContent>
		</Dialog>
	);
}

function Content() {
	const [exportMode, setExportMode] = useState<Selection>("cross");
	const [url, setUrl] = useState<string | null>(null);
	const [downloadName, setDownloadName] = useState("");
	const [progress, setProgress] = useState(0);
	const [isProcessing, setIsProcessing] = useState(false);
	const [faceResolution, setFaceResolution] = useState(256);
	const [fileFormat, setFileFormat] = useState("png");

	const proccessFiles = () => {
		setIsProcessing(true);

		if (fileFormat === "hdr") {
			hdrProccess((href: string) => {
				setUrl(href);
				setDownloadName("Standard-Cube-Map.zip");
				setIsProcessing(false);
			});
		} else {
			regularProccess((href: string) => {
				setUrl(href);
				setDownloadName("Standard-Cube-Map.zip");
				setIsProcessing(false);
			});
		}
	};

	const hdrProccess = (callback: (href: string) => void) => {
		if (exportMode === "cross") {
			hdrProcRenderUnity(
				faceResolution,
				(href) => {
					callback(href);
				},
				(progress) => {
					const { progNow, progTotal } = progress;
					setProgress((progNow / progTotal) * 100);
				}
			);
		}
		if (exportMode === "line") {
			hdrProcRenderUE4(
				faceResolution,
				(href) => {
					callback(href);
				},
				(progress) => {
					const { progNow, progTotal } = progress;
					setProgress((progNow / progTotal) * 100);
				}
			);
		}
		if (exportMode === "separate") {
			hdrProcRenderSep(
				faceResolution,
				(href) => {
					callback(href);
				},
				(progress) => {
					const { progNow, progTotal } = progress;
					setProgress((progNow / progTotal) * 100);
				}
			);
		}
	};

	const regularProccess = (callback: (href: string) => void) => {
		if (exportMode === "cross") {
			procRenderUnity(
				faceResolution,
				(href) => {
					callback(href);
				},
				(progress) => {
					const { progNow, progTotal } = progress;
					setProgress((progNow / progTotal) * 100);
				}
			);
		}
		if (exportMode === "line") {
			procRenderUE4(
				faceResolution,
				(href) => {
					callback(href);
				},
				(progress) => {
					const { progNow, progTotal } = progress;
					setProgress((progNow / progTotal) * 100);
				}
			);
		}
		if (exportMode === "separate") {
			procRenderSep(
				faceResolution,
				(href) => {
					callback(href);
				},
				(progress) => {
					const { progNow, progTotal } = progress;
					setProgress((progNow / progTotal) * 100);
				}
			);
		}
	};

	const handleSelect = (value: Selection) => {
		setExportMode(value);
	};

	const onResolutionChange = (value: string) => {
		setFaceResolution(parseInt(value));
	};

	const onFormatChange = (value: string) => {
		setFileFormat(value);
	};

	const resetState = () => {
		setUrl("");
		setDownloadName("");
		setIsProcessing(false);
		setProgress(0);
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>Export Settings</DialogTitle>
				{/* <DialogDescription>
					There are 3 layouts available (Cross, Line, and Separate).
				</DialogDescription> */}
			</DialogHeader>
			<div className="grid gap-4 py-4">
				<div className="flex gap-4 items-center">
					<ResolutionSelect
						onChange={(e) => onResolutionChange(e)}
						value={faceResolution}
					/>
					<FormatSelect
						onChange={(e) => onFormatChange(e)}
						value={fileFormat}
					/>
				</div>
				<CrossLayout
					selected={exportMode === "cross"}
					onClick={() => handleSelect("cross")}
				/>
				<LineLayout
					selected={exportMode === "line"}
					onClick={() => handleSelect("line")}
				/>
				<SeparateLayout
					selected={exportMode === "separate"}
					onClick={() => handleSelect("separate")}
				/>
			</div>
			<Progress value={progress} />
			<DialogFooter>
				<CopyCodeButton variant={"outline"} />

				{url ? (
					<Button
						asChild
						variant="default"
						color="primary"
						disabled={isProcessing}
						className="gap-1.5 text-sm"
					>
						<a href={url} download={downloadName}>
							<SaveIcon className={cn("size-3.5")} />
							Download
						</a>
					</Button>
				) : null}
				<Button
					variant="default"
					disabled={isProcessing}
					onClick={() => {
						resetState();
						proccessFiles();
					}}
					className="gap-1.5 text-sm"
				>
					<CogIcon className={cn("size-3.5", isProcessing && "animate-spin")} />
					Process
				</Button>
			</DialogFooter>
		</>
	);
}
