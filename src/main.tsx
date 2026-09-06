import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@/index.css";

const Control = lazy(() => import("@/routes/Control"));
const Display = lazy(() => import("@/routes/Display"));

const router = createBrowserRouter([
  { path: "/", element: <Control /> },
  { path: "/projecao", element: <Display /> },
  { path: "*", element: <Control /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<div className="h-dvh bg-ink-950" />}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>,
);
