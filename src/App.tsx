import React from "react";
import { TooltipProvider } from "./components/ui/tooltip";
import { Dashboard } from "./Dashboard";
import { Toaster } from "./components/ui/toaster";

export function App() {
	return (
		<>
			<TooltipProvider>
				<Dashboard />
				<Toaster />
			</TooltipProvider>
		</>
	);
}
