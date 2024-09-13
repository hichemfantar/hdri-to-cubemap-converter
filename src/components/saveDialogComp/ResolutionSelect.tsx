import { Label } from "../ui/label";
import { Select, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const options = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192];

const ResolutionSelect = (props) => {
	const { classes, onChange, value } = props;
	return (
		<div className={classes.formControl}>
			<Label htmlFor="resolution-label">Piece resolution</Label>
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger id="resolution-label" className="w-[180px]">
					<SelectValue placeholder="Select a resolution" />
				</SelectTrigger>
				{options.map((option) => (
					<SelectItem key={option} value={option.toString()}>
						{option}
					</SelectItem>
				))}
			</Select>
		</div>
	);
};

export { ResolutionSelect };
