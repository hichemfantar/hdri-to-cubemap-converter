import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

const LineLayout = (props: { selected: boolean; onClick: () => void }) => {
	const { selected, onClick } = props;

	return (
		<Card
			className={cn(
				"w-full bg-primary-foreground hover:bg-secondary hover:cursor-pointer transition border-2 border-transparent p-4",
				selected && "border-primary"
			)}
			onClick={onClick}
		>
			<div className="flex">
				<Badge variant="default" className="mb-4">
					Line
				</Badge>
			</div>

			<div className="flex justify-center items-center">
				{/* <div
					className="bg-red-800 h-12 w-12 md:h-16 md:w-16 flex justify-center items-center text-white xfont-bold"
					style={{ transform: "rotate(-90deg)" }}
				>
					+X
				</div> */}
				<img
					className="h-12 w-12 md:h-16 md:w-16"
					src={"images/xp.png"}
					style={{ transform: "rotate(-90deg)" }}
				/>
				<img
					className="h-12 w-12 md:h-16 md:w-16"
					src={"images/xn.png"}
					style={{ transform: "rotate(90deg)" }}
				/>
				<img
					className="h-12 w-12 md:h-16 md:w-16"
					src={"images/yp.png"}
					style={{ transform: "rotate(180deg)" }}
				/>
				<img className="h-12 w-12 md:h-16 md:w-16" src={"images/yn.png"} />
				<img className="h-12 w-12 md:h-16 md:w-16" src={"images/zp.png"} />
				<img className="h-12 w-12 md:h-16 md:w-16" src={"images/zn.png"} />
			</div>
		</Card>
	);
};

export { LineLayout };
