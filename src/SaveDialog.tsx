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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
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
import { Progress } from "./components/ui/progress";
import { ResolutionSelect } from "./components/saveDialogComp/ResolutionSelect";
import { FormatSelect } from "./components/saveDialogComp/FormatSelect";
import { CrossLayout } from "./components/saveDialogComp/CrossLayout";
import { LineLayout } from "./components/saveDialogComp/LineLayout";
import { SeperateLayout } from "./components/saveDialogComp/SeperateLayout";

export function SaveDialog() {
	const [selected, setSelected] = useState(0);
	const [url, setUrl] = useState("");
	const [download, setDownload] = useState("");
	const [processed, setProcessed] = useState(false);
	const [processing, setProcessing] = useState(true);
	const [progress, setProgress] = useState(0);
	const [saveDisable, setSaveDisable] = useState(false);
	const [resolution, setResolution] = useState(256);
	const [format, setFormat] = useState("png");

	const proccessFiles = () => (event) => {
		console.log("saving files - index =", selected);
		console.log(event.handler);
		// console.dir(document.getElementById('SaveButton'))
		// const myButton = document.getElementById('SaveButton')
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
		// const myButton = document.getElementById('SaveButton')
		// console.dir(myButton)
		onClose();
	};

	const handleSelect =
		(index = 0) =>
		(event) => {
			console.log("works", index);
			setSelected(index);
		};

	const onResolutionChange = () => (event) => {
		setResolution(event.target.value);
	};

	const onFormatChange = () => (event) => {
		setFormat(event.target.value);
	};

	const onClose = () => {
		onClose();

		setUrl("");
		setDownload("");
		setProcessed(false);
		setSaveDisable(false);
		setProgress(0);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Save</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Chose Your Layout</DialogTitle>
					<DialogDescription>3 layouts available.</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div style={{ display: "flex" }}>
						<ResolutionSelect
							onChange={onResolutionChange()}
							value={resolution}
						/>
						<FormatSelect onChange={onFormatChange()} value={format} />
					</div>
					<CrossLayout selected={selected} onClick={handleSelect(1)} />
					<LineLayout selected={selected} onClick={handleSelect(2)} />
					<SeperateLayout selected={selected} onClick={handleSelect(3)} />
				</div>
				<DialogFooter>
					<Progress value={progress} />

					{processed ? (
						<Button
							asChild
							id={"SaveButton"}
							variant="secondary"
							color="primary"
							disabled={selected === 0 || saveDisable}
							onClick={saveFiles}
						>
							<a href={url} download={download}>
								Save
							</a>
						</Button>
					) : (
						<Button
							variant="secondary"
							disabled={selected === 0 || saveDisable}
							onClick={proccessFiles()}
						>
							Process
						</Button>
					)}

					{/* <Button type="submit">Save changes</Button> */}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
