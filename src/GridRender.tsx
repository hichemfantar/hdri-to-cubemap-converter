export function GridRender() {
	function Cube() {
		return <div className="h-32 w-32"></div>;
	}

	return (
		<div
			id={"convCanvContainer"}
			className="w-full flex justify-center items-center bg-black rounded-md aspect-video"
		>
			<div>
				<div className="flex">
					<Cube />
					<canvas id={"convCanv4"} className={"bg-gray-600 w-32 h-32"} />
					<Cube />
					<Cube />
				</div>
				<div className="flex">
					<canvas id={"convCanv0"} className={"bg-[#222] w-32 h-32"} />
					<canvas id={"convCanv1"} className={"bg-[#222] w-32 h-32"} />
					<canvas id={"convCanv2"} className={"bg-[#222] w-32 h-32"} />
					<canvas id={"convCanv3"} className={"bg-[#222] w-32 h-32"} />
				</div>
				<div className="flex">
					<Cube />
					<canvas id={"convCanv5"} className={"bg-[#222] w-32 h-32"} />
					<Cube />
					<Cube />
				</div>
			</div>
		</div>
	);
}
