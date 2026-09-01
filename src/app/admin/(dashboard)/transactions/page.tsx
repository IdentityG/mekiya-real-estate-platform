import { db } from "@/db";
import { transactions, leads, visitRequests } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { AdminTransactionsClient } from "@/components/admin/AdminTransactionsClient";

export default async function AdminTransactionsPage() {
  const txs = await db
    .select({
      id: transactions.id,
      amount: transactions.amount,
      currency: transactions.currency,
      method: transactions.method,
      status: transactions.status,
      reference: transactions.reference,
      createdAt: transactions.createdAt,
      leadId: transactions.leadId,
      leadName: leads.name,
      visitorName: visitRequests.name,
    })
    .from(transactions)
    .leftJoin(leads, eq(transactions.leadId, leads.id))
    .leftJoin(visitRequests, eq(transactions.visitRequestId, visitRequests.id))
    .orderBy(desc(transactions.createdAt));

  const leadOptions = await db
    .select({ id: leads.id, name: leads.name })
    .from(leads)
    .orderBy(desc(leads.createdAt))
    .limit(20);

  return <AdminTransactionsClient transactions={txs} leads={leadOptions} />;
}
