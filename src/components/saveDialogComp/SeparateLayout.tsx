import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

const SeparateLayout = (props: { selected: number; onClick: () => void }) => {
	const { selected, onClick } = props;
	return (
		<Card
			className={cn(
				"w-full bg-primary-foreground hover:bg-secondary hover:cursor-pointer transition border-2 border-transparent",
				selected === 3 && "border-primary"
			)}
			onClick={onClick}
		>
			<div className="flex justify-center items-center p-4 gap-3 md:gap-4">
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
