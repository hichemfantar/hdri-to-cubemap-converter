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

	const onSelectChange = (name) => (event) => {
		this.setState({ [name]: event.target.value });
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
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Name
						</Label>
						<Input id="name" value="Pedro Duarte" className="col-span-3" />
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="username" className="text-right">
							Username
						</Label>
						<Input id="username" value="@peduarte" className="col-span-3" />
					</div>
				</div>
				<DialogFooter>
					<Button type="submit">Save changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
