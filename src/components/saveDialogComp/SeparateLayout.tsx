import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

const SeparateLayout = (props: { selected: boolean; onClick: () => void }) => {
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
					Separate
				</Badge>
			</div>

			<div className="flex justify-center items-center  gap-3 md:gap-4">
				<img className="h-10 w-10 md:h-16 md:w-16" src={"images/xp.png"} />
				<img className="h-10 w-10 md:h-16 md:w-16" src={"images/xn.png"} />
				<img className="h-10 w-10 md:h-16 md:w-16" src={"images/yp.png"} />
				<img className="h-10 w-10 md:h-16 md:w-16" src={"images/yn.png"} />
				<img className="h-10 w-10 md:h-16 md:w-16" src={"images/zp.png"} />
				<img className="h-10 w-10 md:h-16 md:w-16" src={"images/zn.png"} />
			</div>
		</Card>
	);
};

export { SeparateLayout };
