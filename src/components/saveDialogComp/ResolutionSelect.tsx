import { Label } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

const options = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192];

const ResolutionSelect = (props: {
	onChange: (value: string) => void;
	value: number;
}) => {
	const { onChange, value } = props;

	return (
		<div className="grid gap-2">
			<Label htmlFor="resolution">Face Resolution</Label>
			<Select value={value.toString()} onValueChange={onChange}>
				<SelectTrigger id="resolution" name="resolution" className="w-[180px]">
					<SelectValue placeholder="Select a resolution" />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option} value={option.toString()}>
							{option}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export { ResolutionSelect };
