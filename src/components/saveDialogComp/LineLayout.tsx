import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

const LineLayout = (props) => {
	const { selected, onClick } = props;
	return (
		<Card
			className={cn(
				"mt-4 w-[496px] h-[96px] bg-[#444] hover:bg-[#bbb] hover:cursor-pointer",
				selected === 2 && "bg-[#bbbbff]"
			)}
			onClick={onClick}
		>
			<div style={{ padding: 16 }}>
				<img src={"images/xp.png"} style={{ transform: "rotate(-90deg)" }} />
				<img src={"images/xn.png"} style={{ transform: "rotate(90deg)" }} />
				<img src={"images/yp.png"} style={{ transform: "rotate(180deg)" }} />
				<img src={"images/yn.png"} />
				<img src={"images/zp.png"} />
				<img src={"images/zn.png"} />
			</div>
		</Card>
	);
};

export { LineLayout };
