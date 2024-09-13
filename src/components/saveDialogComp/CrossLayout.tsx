import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

const CrossLayout = (props) => {
	const { selected, onClick } = props;
	return (
		<Card
			className={cn(
				"relative w-[496px] h-[224px] bg-[#444] hover:bg-[#bbb] hover:cursor-pointer",
				selected === 2 && "bg-[#bbbbff]"
			)}
			onClick={onClick}
		>
			<img
				src={"images/xn.png"}
				style={{ position: "absolute", top: 80, left: 16 }}
			/>
			<img
				src={"images/zp.png"}
				style={{ position: "absolute", top: 80, left: 80 }}
			/>
			<img
				src={"images/xp.png"}
				style={{ position: "absolute", top: 80, left: 144 }}
			/>
			<img
				src={"images/zn.png"}
				style={{ position: "absolute", top: 80, left: 208 }}
			/>
			<img
				src={"images/yp.png"}
				style={{ position: "absolute", top: 16, left: 80 }}
			/>
			<img
				src={"images/yn.png"}
				style={{ position: "absolute", top: 144, left: 80 }}
			/>
		</Card>
	);
};

export { CrossLayout };
