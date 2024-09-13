import { Label } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

const options = ["png", "hdr"];

const FormatSelect = (props: {
	onChange: (value: string) => void;
	value: string;
}) => {
	const { onChange, value } = props;

	return (
		<div className="grid gap-2">
			<Label htmlFor="format">Format</Label>
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger id="format" className="w-[180px]" name="format">
					<SelectValue placeholder="Select a format" />
				</SelectTrigger>

				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option} value={option}>
							{option}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export { FormatSelect };
