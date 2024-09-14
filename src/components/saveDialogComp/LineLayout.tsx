import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

const LineLayout = (props: { selected: number; onClick: () => void }) => {
	const { selected, onClick } = props;

	return (
		<Card
			className={cn(
				"w-full bg-primary-foreground hover:bg-secondary hover:cursor-pointer transition border-2 border-transparent",
				selected === 2 && "border-primary"
			)}
			onClick={onClick}
		>
			<div className="flex justify-center items-center p-4">
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
