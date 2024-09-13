import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

const SeperateLayout = (props: { selected: number; onClick: () => void }) => {
	const { selected, onClick } = props;
	return (
		<Card
			className={cn(
				"mt-4 w-full bg-[#444] hover:bg-[#bbb] hover:cursor-pointer",
				selected === 3 && "bg-[#bbbbff] hover:bg-[#bbbbff]"
			)}
			onClick={onClick}
		>
			<div className="flex justify-center items-center p-4 gap-4">
				<img className="h-16 w-16" src={"images/xp.png"} />
				<img className="h-16 w-16" src={"images/xn.png"} />
				<img className="h-16 w-16" src={"images/yp.png"} />
				<img className="h-16 w-16" src={"images/yn.png"} />
				<img className="h-16 w-16" src={"images/zp.png"} />
				<img className="h-16 w-16" src={"images/zn.png"} />
			</div>
		</Card>
	);
};

export { SeperateLayout };