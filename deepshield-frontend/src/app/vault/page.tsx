import { VaultManager } from "@/components/vault/VaultManager";
import { PageHeader } from "@/components/ui/PageHeader";

export default function VaultPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <PageHeader
        badge="Private"
        title="Safe evidence vault"
        subtitle="AES-256 encrypted storage in your browser. Your PIN is never sent to a server."
      />
      <VaultManager />
    </div>
  );
}
