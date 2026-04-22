import { Toaster as SonnerToaster } from "sonner";

export default function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      expand={true}
      richColors={true}
      closeButton
      visibleToasts={10}
      swipeDirections={["left", "right"]}
      toastOptions={{
        className:
          "!font-poppins !rounded-xl !border !border-slate-200 !shadow-md !p-3",
      }}
    />
  );
}
