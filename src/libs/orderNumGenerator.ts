import CounterModel from "@/models/counter.model";

function getTodayKey(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  return `${yyyy}${mm}${dd}`;
}

export async function generateOrderNumber(): Promise<string> {
  const dateKey = getTodayKey(); // 20251218
  const counterName = `order-${dateKey}`; // order-20251218

  const counter = await CounterModel.findOneAndUpdate(
    { name: counterName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  ).lean();

  const sequence = counter.seq.toString().padStart(4, "0");

  return `ORD-${dateKey}-${sequence}`;
}
