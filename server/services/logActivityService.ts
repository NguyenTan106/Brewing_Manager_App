// utils/compareAndLog.ts
import { logActivity } from "../prisma/CRUD_ingredient_service";

type EntityData = Record<string, any>;

export const compareAndLogChanges = async (
  oldData: EntityData,
  newData: EntityData,
  fieldsToCompare: string[],
  entity: string,
  entityId: number,
  entityLabel: string, // ví dụ: oldData.name
  userId?: number
) => {
  const logs: string[] = [];
  const formatDate = (d: any) =>
    new Date(d).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour12: false,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  for (const field of fieldsToCompare) {
    const oldValue = oldData[field];
    const newValue = newData[field];

    // Nếu là ngày thì so sánh kiểu getTime()
    if (
      oldValue instanceof Date ||
      newValue instanceof Date ||
      field.toLowerCase().includes("date")
    ) {
      const oldTime = new Date(oldValue).getTime();
      const newTime = new Date(newValue).getTime();
      if (oldTime !== newTime) {
        logs.push(
          `${field}: ${formatDate(oldValue)} → ${formatDate(newValue)}`
        );
      }
    } else {
      if (oldValue !== newValue) {
        logs.push(`${field}: ${oldValue} → ${newValue}`);
      }
    }
  }

  if (logs.length > 0) {
    await logActivity(
      "update",
      entity,
      entityId,
      `Cập nhật ${entity} "${entityLabel}":\n` + logs.join("\n"),
      userId
    );
  }

  return logs.length > 0;
};

function format(val: any): string {
  if (val === null || val === undefined) return "null";
  if (val instanceof Date) return new Date(val).toISOString();
  return typeof val === "string" ? `"${val}"` : val.toString();
}
