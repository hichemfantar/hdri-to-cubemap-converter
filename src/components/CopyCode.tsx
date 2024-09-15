import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

const exampleCode = `<Environment
		background
		files={
				[
					"/cubemap/px.png",
					"/cubemap/nx.png",
					"/cubemap/py.png",
					"/cubemap/ny.png",
					"/cubemap/pz.png",
					"/cubemap/nz.png",
			]
		}
	/>
`;

export function CopyCodeButton({
	className,
	...props
}: React.ComponentProps<typeof Button>) {
	const [hasCopied, setHasCopied] = React.useState(false);

	React.useEffect(() => {
		setTimeout(() => {
			setHasCopied(false);
		}, 2000);
	}, [hasCopied]);

	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<Button className={cn("flex", className)} {...props}>
						Copy code
					</Button>
				</DialogTrigger>
				<DialogContent className="max-w-2xl outline-none">
					<DialogHeader>
						<DialogTitle>Theme</DialogTitle>
						<DialogDescription>
							Copy and paste the following code into your R3F `Environment`
							component.
						</DialogDescription>
					</DialogHeader>
					<div className="relative">
						<CustomizerCode />
						{
							<Button
								size="sm"
								onClick={() => {
									try {
										navigator.clipboard.writeText(exampleCode);
										setHasCopied(true);
									} catch (error) {
										console.error("Failed to copy code", error);
									}
								}}
								className="absolute right-4 top-4 bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground"
							>
								{hasCopied ? (
									<CheckIcon className="mr-2 h-4 w-4" />
								) : (
									<CopyIcon className="mr-2 h-4 w-4" />
								)}
								Copy
							</Button>
						}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

function CustomizerCode() {
	return (
		<div data-rehype-pretty-code-fragment="">
			<pre className="max-h-[450px] overflow-auto rounded-lg border bg-primary-foreground py-4 xdark:bg-zinc-900">
				<code className="relative rounded xbg-muted px-7 py-4 font-mono text-sm">
					{exampleCode}
				</code>
			</pre>
		</div>
	);
}
