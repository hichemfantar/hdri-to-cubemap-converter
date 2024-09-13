import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Dashboard } from "./Dashboard.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<Dashboard />
		</ThemeProvider>
	</StrictMode>
);
