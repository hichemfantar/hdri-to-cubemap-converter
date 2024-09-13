import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

const SeperateLayout = (props) => {
	const { selected, onClick } = props;
	return (
		<Card
			className={cn(
				"mt-4 w-[496px] h-[96px] bg-[#444] hover:bg-[#bbb] hover:cursor-pointer",
				selected === 3 && "bg-[#bbbbff]"
			)}
			onClick={onClick}
		>
			<div style={{ padding: 16 }}>
				<img src={"images/xp.png"} />
				<img src={"images/xn.png"} style={{ marginLeft: 16 }} />
				<img src={"images/yp.png"} style={{ marginLeft: 16 }} />
				<img src={"images/yn.png"} style={{ marginLeft: 16 }} />
				<img src={"images/zp.png"} style={{ marginLeft: 16 }} />
				<img src={"images/zn.png"} style={{ marginLeft: 16 }} />
			</div>
		</Card>
	);
};

export { SeperateLayout };
