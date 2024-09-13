import { Label } from "../ui/label";
import { Select, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const options = ["png", "hdr"];

const FormatSelect = (props) => {
	const { classes, onChange, value } = props;
	return (
		<div className={classes.formControl}>
			<Label htmlFor="format-label">Format</Label>
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger id="format-label" className="w-[180px]" name="format">
					<SelectValue placeholder="Select a format" />
				</SelectTrigger>

				{options.map((option) => (
					<SelectItem key={option} value={option}>
						{option}
					</SelectItem>
				))}
			</Select>
		</div>
	);
};

export { FormatSelect };
