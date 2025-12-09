import { Toaster } from "react-hot-toast";

export function AppToaster() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 2500,
                style: { fontSize: "14px" },
            }}
        />
    );
}
