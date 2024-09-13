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
import { CrossLayout } from "./components/saveDialogComp/CrossLayout";
import { FormatSelect } from "./components/saveDialogComp/FormatSelect";
import { LineLayout } from "./components/saveDialogComp/LineLayout";
import { ResolutionSelect } from "./components/saveDialogComp/ResolutionSelect";
import { SeperateLayout } from "./components/saveDialogComp/SeperateLayout";
import { Progress } from "./components/ui/progress";
import { cn } from "./lib/utils";
import {
	hdrProcRenderSep,
	hdrProcRenderUE4,
	hdrProcRenderUnity,
} from "./threee/render/hdrRenderProc";
import {
	procRenderSep,
	procRenderUE4,
	procRenderUnity,
} from "./threee/render/renderProc";

export function SaveDialog() {
	const [selected, setSelected] = useState(0);
	const [url, setUrl] = useState("");
	const [download, setDownload] = useState("");
	const [processed, setProcessed] = useState(false);
	const [progress, setProgress] = useState(0);
	const [saveDisable, setSaveDisable] = useState(false);
	const [resolution, setResolution] = useState(256);
	const [format, setFormat] = useState("png");

	const proccessFiles = () => {
		console.log("saving files - index =", selected);
		setSaveDisable(true);

		if (format === "hdr") {
			hdrProccess((href: string) => {
				setUrl(href);
				setDownload("Standard-Cube-Map.zip");
				setProcessed(true);
				setSaveDisable(false);
			});
		} else {
			regularProccess((href: string) => {
				setUrl(href);
				setDownload("Standard-Cube-Map.zip");
				setProcessed(true);
				setSaveDisable(false);
			});
		}
	};

	const hdrProccess = (callback: (href: string) => void) => {
		if (selected === 1) {
			hdrProcRenderUnity(
				resolution,
				(href) => {
					callback(href);
				},
				(progress) => {
					const { progNow, progTotal } = progress;
					setProgress((progNow / progTotal) * 100);
				}
			);
		}
		if (selected === 2) {
			hdrProcRenderUE4(
				resolution,
				(href) => {
					callback(href);
				},
				(progress) => {
					const { progNow, progTotal } = progress;
					setProgress((progNow / progTotal) * 100);
				}
			);
		}
		if (selected === 3) {
			hdrProcRenderSep(
				resolution,
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
		if (selected === 1) {
			procRenderUnity(
				resolution,
				(href) => {
					callback(href);
				},
				(progress) => {
					const { progNow, progTotal } = progress;
					setProgress((progNow / progTotal) * 100);
				}
			);
		}
		if (selected === 2) {
			procRenderUE4(
				resolution,
				(href) => {
					callback(href);
				},
				(progress) => {
					const { progNow, progTotal } = progress;
					setProgress((progNow / progTotal) * 100);
				}
			);
		}
		if (selected === 3) {
			procRenderSep(
				resolution,
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

	const saveFiles = () => {
		onClose();
	};

	const handleSelect = (index: number) => {
		console.log("works", index);
		setSelected(index);
	};

	const onResolutionChange = (value: string) => {
		setResolution(parseInt(value));
	};

	const onFormatChange = (value: string) => {
		setFormat(value);
	};

	const onClose = () => {
		setUrl("");
		setDownload("");
		setProcessed(false);
		setSaveDisable(false);
		setProgress(0);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="gap-1.5 text-sm">
					<Pencil className="size-3.5" />
					Convert
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[700px]">
				<DialogHeader>
					<DialogTitle>Chose Your Layout</DialogTitle>
					<DialogDescription>3 layouts available.</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="flex gap-4 items-center">
						<ResolutionSelect
							onChange={(e) => onResolutionChange(e)}
							value={resolution}
						/>
						<FormatSelect onChange={(e) => onFormatChange(e)} value={format} />
					</div>
					<CrossLayout selected={selected} onClick={() => handleSelect(1)} />
					<LineLayout selected={selected} onClick={() => handleSelect(2)} />
					<SeperateLayout selected={selected} onClick={() => handleSelect(3)} />
				</div>
				<Progress value={progress} />
				<DialogFooter>
					{processed ? (
						<Button
							asChild
							variant="secondary"
							color="primary"
							disabled={selected === 0 || saveDisable}
							onClick={saveFiles}
							className="gap-1.5 text-sm"
						>
							<a href={url} download={download}>
								<SaveIcon className={cn("size-3.5")} />
								Save
							</a>
						</Button>
					) : (
						<Button
							variant="secondary"
							disabled={selected === 0 || saveDisable}
							onClick={proccessFiles}
							// size="sm"
							className="gap-1.5 text-sm"
						>
							<CogIcon
								className={cn("size-3.5", saveDisable && "animate-spin")}
							/>
							Process
						</Button>
					)}

					{/* <Button type="submit">Save changes</Button> */}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
