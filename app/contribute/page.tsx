"use client";

import InterventionCSVManager from "../../components/InterventionCSVManager";

export default function ContributePage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Contribute an Intervention</h1>
      <InterventionCSVManager />
    </div>
  );
}
