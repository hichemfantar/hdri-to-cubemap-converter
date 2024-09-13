export function GridRender() {
	return (
		<div
			style={{
				width: "64vw",
				height: "36vw",
				borderRadius: 4,
				background: "#ccc",
			}}
		>
			<div
				id={"convCanvContainer"}
				style={{
					width: 512,
					height: 384,
					position: "relative",
					background: "#ccc",
					marginLeft: "auto",
					marginRight: "auto",
				}}
			>
				<canvas
					id={"convCanv0"}
					className={"absolute bg-[#222] w-32 h-32"}
					style={{ top: 128 }}
				/>
				<canvas
					id={"convCanv1"}
					className={"absolute bg-[#222] w-32 h-32"}
					style={{ top: 128, left: 128 }}
				/>
				<canvas
					id={"convCanv2"}
					className={"absolute bg-[#222] w-32 h-32"}
					style={{ top: 128, left: 256 }}
				/>
				<canvas
					id={"convCanv3"}
					className={"absolute bg-[#222] w-32 h-32"}
					style={{ top: 128, left: 384 }}
				/>
				<canvas
					id={"convCanv4"}
					className={"absolute bg-[#222] w-32 h-32"}
					style={{ top: 0, left: 128 }}
				/>
				<canvas
					id={"convCanv5"}
					className={"absolute bg-[#222] w-32 h-32"}
					style={{ top: 256, left: 128 }}
				/>
			</div>
		</div>
	);
}
