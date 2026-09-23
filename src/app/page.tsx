import { Dashboard } from "../components/layout/Dashboard";
import { Analytics } from "@vercel/analytics/next";

export default function Home() {
  return (
    <>
      <Dashboard />
      <Analytics />
    </>
  );
}
