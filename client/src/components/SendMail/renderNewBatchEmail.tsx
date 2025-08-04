import { minutesToOtherTimes } from "@/pages/Recipe/MinutesToOtherTimes";
import type { Batch } from "@/services/CRUD/CRUD_API_Batch";
import type { Ingredient } from "@/services/CRUD/CRUD_API_Ingredient";
import { marked } from "marked";

interface BatchIngredient {
  ingredient: Ingredient;
  amountUsed: number;
}
interface BatchStep {
  stepOrder: number;
  name: string;
  startedAt: string; // ISO string
  scheduledEndAt: string;
  notes?: string;
}

type FullBatch = Batch & {
  recipe?: { name: string };
  batchIngredients: BatchIngredient[];
  batchSteps: BatchStep[];
  ingredient: Ingredient[];
};

export default function renderNewBatchEmail(data: { data: FullBatch }) {
  const ingredients = data.data.batchIngredients as BatchIngredient[];
  const steps = data.data.batchSteps as BatchStep[];

  const html = `
  <div style="font-family:'Segoe UI', Tahoma, sans-serif; padding: 24px; border:1px solid #ccc; border-radius:8px; background-color:#f9f9f9; max-width:800px; margin:auto;">
    <h2 style="color:#1e88e5; text-align:center;">🍺 MẺ BIA MỚI ĐƯỢC TẠO</h2>
    <p style="font-size:16px; color:#555;">Xin chào,</p>
    <p style="font-size:16px; color:#555;">Một mẻ bia mới vừa được tạo thành công bởi <strong>${
      data.data.createdBy?.username || "Không rõ"
    }</strong>. Dưới đây là thông tin chi tiết:</p>

    <table style="width:100%; border-collapse:collapse; margin:16px 0;">
      <tbody>
        <tr>
          <td style="padding:8px;"><strong>Tên mẻ:</strong></td>
          <td style="padding:8px;">${data.data.beerName}</td>
        </tr>
        <tr style="background-color:#f1f1f1;">
          <td style="padding:8px;"><strong>Thể tích:</strong></td>
          <td style="padding:8px;">${data.data.volume} lít</td>
        </tr>
        <tr>
          <td style="padding:8px;"><strong>Công thức:</strong></td>
          <td style="padding:8px;">${data.data.recipe?.name || "Không rõ"}</td>
        </tr>
        <tr style="background-color:#f1f1f1;">
          <td style="padding:8px;"><strong>Ngày tạo:</strong></td>
          <td style="padding:8px;">${new Date(
            data.data.createdAt ?? ""
          ).toLocaleString("vi-VN")}</td>
        </tr>
        <tr>
          <td style="padding:8px;"><strong>Người tạo:</strong></td>
          <td style="padding:8px;">${
            data.data.createdBy?.username || "Không rõ"
          }</td>
        </tr>
      </tbody>
    </table>

    <h3 style="color:#43a047; margin-top:24px;">📦 Nguyên liệu tồn kho</h3>
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%; font-size:14px; text-align:left;">
      <thead style="background-color:#e3f2fd;">
        <tr>
          <th>Tên nguyên liệu</th>
          <th>Số lượng</th>
          <th>Đơn vị</th>
          <th>Loại</th>
          <th>Trạng thái</th>
          <th>Giá nhập (VNĐ/1)</th>
        </tr>
      </thead>
      <tbody>
        ${
          ingredients.length
            ? ingredients
                .map(
                  (item) => `
                    <tr>
                      <td>${item.ingredient.name}</td>
                      <td>${Number(item.ingredient.quantity).toFixed(2)}</td>
                      <td>${item.ingredient.unit}</td>
                      <td>${item.ingredient.type}</td>
                      <td>${item.ingredient.status}</td>
                      <td>${
                        item.ingredient.cost?.toLocaleString("vi-VN") || "0"
                      }</td>
                    </tr>
                  `
                )
                .join("")
            : `<tr><td colspan="6">Không có dữ liệu nguyên liệu</td></tr>`
        }
      </tbody>
    </table>

    <h3 style="color:#fb8c00; margin-top:24px;">🧾 Nguyên liệu sử dụng</h3>
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%; font-size:14px; text-align:left;">
      <thead style="background-color:#fff3e0;">
        <tr>
          <th>Tên nguyên liệu</th>
          <th>Số lượng cần</th>
          <th>Đơn vị</th>
          <th>Loại</th>
        </tr>
      </thead>
      <tbody>
        ${
          ingredients.length
            ? ingredients
                .map(
                  (item) => `
                    <tr>
                      <td>${item.ingredient.name}</td>
                      <td>${Number(item.amountUsed).toFixed(2)}</td>
                      <td>${item.ingredient.unit}</td>
                      <td>${item.ingredient.type}</td>
                    </tr>
                  `
                )
                .join("")
            : `<tr><td colspan="4">Không có dữ liệu nguyên liệu sử dụng</td></tr>`
        }
      </tbody>
    </table>

    <h3 style="color:#6d4c41; margin-top:24px;">🧪 Các bước thực hiện</h3>
    <ol style="padding-left:20px; font-size:15px;">
      ${
        steps.length
          ? steps
              .filter((step) => {
                const duration =
                  (Number(new Date(step.scheduledEndAt)) -
                    Number(new Date(step.startedAt))) /
                  1000 /
                  60;
                return duration > 0;
              })
              .sort((a, b) => a.stepOrder - b.stepOrder)
              .map((step) => {
                const duration =
                  (Number(new Date(step.scheduledEndAt)) -
                    Number(new Date(step.startedAt))) /
                  1000 /
                  60;
                const htmlFromMarkdown = marked(step.name);

                return `
                  <li style="margin-bottom:12px;">
                    <strong>Bước ${step.stepOrder}:</strong> ${htmlFromMarkdown}
                    <br />
                    <em>⏰ Bắt đầu:</em> ${new Date(
                      step.startedAt
                    ).toLocaleString("vi-VN")}
                    <br />
                    <em>⏱️ Thời lượng:</em> ${minutesToOtherTimes(duration)}
                  </li>
                `;
              })
              .join("")
          : "<li>Không có bước nào được thực hiện</li>"
      }
    </ol>

    <p style="margin-top:30px; font-size:15px; color:#333;">
      🔗 Truy cập hệ thống để theo dõi tiến độ và kiểm tra thông tin chi tiết.
    </p>
  </div>
  `;

  const text = `Mẻ ${data.data.beerName} đã được tạo với thể tích ${
    data.data.volume
  } lít vào lúc ${new Date(data.data.createdAt ?? "").toLocaleString(
    "vi-VN"
  )}.`;

  return {
    subject: "🔔 Thông báo: Đã tạo mẻ bia mới",
    html,
    text,
  };
}
