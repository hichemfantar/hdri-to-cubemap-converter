import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

const CrossLayout = (props: { selected: number; onClick: () => void }) => {
	const { selected, onClick } = props;
	return (
		<Card
			className={cn(
				"w-full bg-primary-foreground hover:bg-secondary hover:cursor-pointer transition border-2 border-transparent",
				selected === 1 && "border-primary"
			)}
			onClick={onClick}
		>
			<div className="flex justify-center items-center p-4">
				<div>
					<div className="flex">
						<div className="h-16 w-16"></div>
						<img className="h-16 w-16" src={"images/yp.png"} />
						<div className="h-16 w-16"></div>
						<div className="h-16 w-16"></div>
					</div>
					<div className="flex">
						<img className="h-16 w-16" src={"images/xn.png"} />
						<img className="h-16 w-16" src={"images/zp.png"} />
						<img className="h-16 w-16" src={"images/xp.png"} />
						<img className="h-16 w-16" src={"images/zn.png"} />
					</div>
					<div className="flex">
						<div className="h-16 w-16"></div>
						<img className="h-16 w-16" src={"images/yn.png"} />
						<div className="h-16 w-16"></div>
						<div className="h-16 w-16"></div>
					</div>
				</div>
			</div>
		</Card>
	);
};

export { CrossLayout };
