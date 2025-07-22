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
  const logs: string[] = [];

  for (const field in newData) {
    const oldValue = (oldData as any)[field];
    const newValue = (newData as any)[field];

    // Mảng nguyên liệu
    if (field === "recipeIngredients" && Array.isArray(newValue)) {
      const oldList = oldValue || [];
      const newList = newValue;

      const maxLength = Math.max(oldList.length, newList.length);

      for (let i = 0; i < maxLength; i++) {
        const oldItem = oldList[i];
        const newItem = newList[i];

        if (!oldItem && newItem) {
          logs.push(`- 🆕 **Mục [${field} #${i + 1}]**: Đã thêm`);
        } else if (oldItem && !newItem) {
          logs.push(`- 🗑️ **Mục [${field} #${i + 1}]**: Đã xóa`);
        } else if (oldItem && newItem) {
          for (const key in newItem) {
            if (key === "ingredient") {
              for (const subKey in newItem[key]) {
                const oldSubValue = oldItem[key]?.[subKey];
                const newSubValue = newItem[key]?.[subKey];

                if (
                  oldSubValue instanceof Date ||
                  newSubValue instanceof Date
                ) {
                  const oldTime = new Date(oldSubValue).getTime();
                  const newTime = new Date(newSubValue).getTime();
                  if (oldTime !== newTime) {
                    logs.push(
                      `- ✏️ **${field} #${
                        i + 1
                      } > ${key}.${subKey}**:\n  - Trước: \`${formatDate(
                        oldSubValue
                      )}\`\n  - Sau: \`${formatDate(newSubValue)}\``
                    );
                  }
                } else if (oldSubValue !== newSubValue) {
                  logs.push(
                    `- ✏️ **${field} #${
                      i + 1
                    } > ${key}.${subKey}**:\n  - Trước: \`${oldSubValue}\`\n  - Sau: \`${newSubValue}\``
                  );
                }
              }
            } else {
              const oldSubValue = oldItem[key];
              const newSubValue = newItem[key];

              if (oldSubValue instanceof Date || newSubValue instanceof Date) {
                const oldTime = new Date(oldSubValue).getTime();
                const newTime = new Date(newSubValue).getTime();
                if (oldTime !== newTime) {
                  logs.push(
                    `- ✏️ **${field} #${
                      i + 1
                    } > ${key}**:\n  - Trước: \`${formatDate(
                      oldSubValue
                    )}\`\n  - Sau: \`${formatDate(newSubValue)}\``
                  );
                }
              } else if (oldSubValue !== newSubValue) {
                logs.push(
                  `- ✏️ **${field} #${
                    i + 1
                  } > ${key}**:\n  - Trước: \`${oldSubValue}\`\n  - Sau: \`${newSubValue}\``
                );
              }
            }
          }
        }
      }
    }

    // Nếu là ngày thì so sánh kiểu getTime()
    // Các trường đơn giản khác
    // Trường đơn giản
    else if (oldValue instanceof Date || newValue instanceof Date) {
      const oldTime = new Date(oldValue).getTime();
      const newTime = new Date(newValue).getTime();
      if (oldTime !== newTime) {
        logs.push(
          `- 🕒 **${formatFieldName(
            field
          )}**:\n  - Trước khi cập nhật: \`${formatDate(
            oldValue
          )}\`\n  - Sau khi cập nhật: \`${formatDate(newValue)}\``
        );
      }
    } else if (oldValue !== newValue) {
      logs.push(
        `- ✏️ **${formatFieldName(
          field
        )}**:\n  - Trước khi cập nhật: \`${oldValue}\`\n  - Sau khi cập nhật: \`${newValue}\``
      );
    }
  }

  if (logs.length > 0) {
    const formattedLogs = logs
      // .map((log) => `- ${log}`) // Gạch đầu dòng từng dòng
      .join("\n");

    const fullLogMessage =
      `Cập nhật ${formatFieldName(entity)} "${entityLabel}":\n` +
      `${formattedLogs}\n` +
      `\nVào: *${logUpdateDate}*`;

    await logActivity("update", entity, entityId, fullLogMessage, userId);
  }

  return logs.length > 0;
};

function formatFieldName(field: string): string {
  switch (field) {
    case "name":
      return "Tên công thức";
    case "description":
      return "Mô tả";
    case "instructions":
      return "Hướng dẫn";
    case "volume":
      return "Thể tích mẻ (L)";
    case "boilTime":
      return "Thời gian đun sôi (phút)";
    case "fermentationTime":
      return "Thời gian lên men (ngày)";
    case "createdAt":
      return "Ngày tạo";
    case "updatedAt":
      return "Ngày cập nhật";
    case "Ingredient":
      return "nguyên liệu";
    case "lowStockThreshold":
      return "Giới hạn cảnh báo";
    default:
      return field;
  }
}
