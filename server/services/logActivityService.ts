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

  for (const field of fieldsToCompare) {
    const oldValue = oldData[field];
    const newValue = newData[field];

    if (Array.isArray(oldValue) && Array.isArray(newValue)) {
      for (let i = 0; i < Math.max(oldValue.length, newValue.length); i++) {
        const oldItem = oldValue[i];
        const newItem = newValue[i];

        // Nếu thêm hoặc xóa item
        if (!oldItem || !newItem) {
          logs.push(
            `### 🔄 Mục \`${field} #${i + 1}\`\n` +
              `- ${oldItem ? "🗑️ **Đã xóa**" : "🆕 **Đã thêm**"}`
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
                    `- ✏️ **${formatFieldName(field)} #${
                      i + 1
                    } > ${formatFieldName(key)}.${subKey}**\n` +
                      `  - Trước: \`${formatDate(oldSubValue)}\`\n` +
                      `  - Sau:   \`${formatDate(newSubValue)}\``
                  );
                }
              } else if (oldSubValue !== newSubValue) {
                logs.push(
                  `- ✏️ **${formatFieldName(field)} #${
                    i + 1
                  } > ${formatFieldName(key)}.${subKey}**\n` +
                    `  - Trước: \`${oldSubValue}\`\n` +
                    `  - Sau:   \`${newSubValue}\``
                );
              }
            }
          } else if (oldItemValue !== newItemValue) {
            logs.push(
              `- ✏️ **${formatFieldName(field)} #${i + 1} > ${formatFieldName(
                key
              )}**\n` +
                `  - Trước: \`${oldItemValue}\`\n` +
                `  - Sau:   \`${newItemValue}\``
            );
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
        )}**:\n  - Trước khi cập nhật: \`${formatFieldName(
          oldValue
        )}\`\n  - Sau khi cập nhật: \`${formatFieldName(newValue)}\``
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

    await logActivity(
      "update",
      formatTableName(entity),
      entityId,
      fullLogMessage,
      userId
    );
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
    case "Recipe":
      return "công thức";
    case "Batch":
      return "mẻ nấu";
    case "createdAt":
      return "Ngày tạo";
    case "updatedAt":
      return "Ngày cập nhật";
    case "Ingredient":
      return "nguyên liệu";
    case "lowStockThreshold":
      return "Giới hạn cảnh báo";
    case "note":
      return "Ghi chú";
    case "status":
      return "Trạng thái";
    case "boiling":
      return "Nấu sôi (boil)";
    case "fermenting":
      return "Lên men (ferment)";
    case "cold_crashing":
      return "Làm lạnh (cold crashing)";
    case "done":
      return "Hoàn thành";
    case "amountNeeded":
      return "Số lượng cần";
    case "recipeIngredients":
      return "Nguyên liệu";
    case "quantity":
      return "Số lượng";
    case "cancel":
      return "Hủy (cancel)";
    case "mash":
      return "Ngâm và nấu mạch nha (mash)";
    default:
      return field;
  }
}
function formatTableName(field: string): string {
  switch (field) {
    case "Recipe":
      return "Công thức";
    case "Batch":
      return "Mẻ";
    case "Ingredient":
      return "Nguyên liệu";
    case "Ingredient Import":
      return "Nhập kho nguyên liệu";
    default:
      return field;
  }
}
