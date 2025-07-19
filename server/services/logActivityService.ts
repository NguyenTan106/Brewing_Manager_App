// utils/compareAndLog.ts
import { logActivity } from "../prisma/logActivity";

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

  const logUpdateDate = new Date().toLocaleString("vi-VN", {
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

    if (Array.isArray(oldValue) && Array.isArray(newValue)) {
      for (let i = 0; i < Math.max(oldValue.length, newValue.length); i++) {
        const oldItem = oldValue[i];
        const newItem = newValue[i];

        // Thêm hoặc xóa toàn bộ phần tử
        if (!oldItem || !newItem) {
          logs.push(
            `🔄 Mục [${field} #${i + 1}]: ${
              oldItem ? "🗑️ Đã xóa" : "🆕 Đã thêm"
            }`
          );
          continue;
        }

        // So sánh từng trường trong mỗi item
        for (const key of Object.keys(newItem)) {
          const oldItemValue = oldItem[key];
          const newItemValue = newItem[key];

          // Nếu là object con như ingredient
          if (
            typeof oldItemValue === "object" &&
            typeof newItemValue === "object"
          ) {
            for (const subKey of Object.keys(newItemValue)) {
              const oldSubValue = oldItemValue[subKey];
              const newSubValue = newItemValue[subKey];

              if (oldSubValue instanceof Date || newSubValue instanceof Date) {
                const oldTime = new Date(oldSubValue).getTime();
                const newTime = new Date(newSubValue).getTime();
                if (oldTime !== newTime) {
                  logs.push(
                    `🕒 ${field} #${
                      i + 1
                    } > ${key}.${subKey}:\n   📅 Trước: ${formatDate(
                      oldSubValue
                    )}\n   📅 Sau:   ${formatDate(newSubValue)}`
                  );
                }
              } else if (oldSubValue !== newSubValue) {
                logs.push(
                  `✏️ ${field} #${
                    i + 1
                  } > ${key}.${subKey}:\n   🧾 Trước: ${oldSubValue}\n   🧾 Sau:   ${newSubValue}`
                );
              }
            }
          } else if (oldItemValue !== newItemValue) {
            logs.push(
              `✏️ ${field} #${
                i + 1
              } > ${key}:\n   🧾 Trước: ${oldItemValue}\n   🧾 Sau:   ${newItemValue}`
            );
          }
        }
      }
    }

    // Nếu là ngày thì so sánh kiểu getTime()
    // Các trường đơn giản khác
    else if (
      oldValue instanceof Date ||
      newValue instanceof Date ||
      field.toLowerCase().includes("date")
    ) {
      const oldTime = new Date(oldValue).getTime();
      const newTime = new Date(newValue).getTime();

      if (oldTime !== newTime) {
        logs.push(
          `🕒 ${formatFieldName(field)}:\n   📅 Trước: ${formatDate(
            oldValue
          )}\n   📅 Sau:   ${formatDate(newValue)}`
        );
      }
    } else if (oldValue !== newValue) {
      logs.push(
        `✏️ ${formatFieldName(
          field
        )}:\n   🧾 Trước: ${oldValue}\n   🧾 Sau:   ${newValue}`
      );
    }
  }

  if (logs.length > 0) {
    await logActivity(
      "update",
      entity,
      entityId,
      `Cập nhật ${entity} "${entityLabel}":\n` +
        logs.join("\n") +
        ` vào ${logUpdateDate}`,
      userId
    );
  }

  return logs.length > 0;
};

function formatFieldName(field: string): string {
  return field
    .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase → camel Case
    .replace(/_/g, " ") // snake_case → snake case
    .replace(/\b\w/g, (c) => c.toUpperCase()); // viết hoa chữ cái đầu mỗi từ
}

function format(val: any): string {
  if (val === null || val === undefined) return "null";
  if (val instanceof Date) return new Date(val).toISOString();
  return typeof val === "string" ? `"${val}"` : val.toString();
}
