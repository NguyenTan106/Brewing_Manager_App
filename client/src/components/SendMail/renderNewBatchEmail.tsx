import { minutesToOtherTimes } from "@/pages/Recipe/MinutesToOtherTimes";
import type { Batch } from "@/services/CRUD/CRUD_API_Batch";
import { marked } from "marked";

interface BatchIngredient {
  ingredient: {
    name: string;
    unit: string;
    type: string;
  };
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
  batchIngredients: (BatchIngredient & {
    ingredient: {
      name: string;
      unit: string;
      type: string;
    };
  })[];
  batchSteps: BatchStep[];
};

export default function renderNewBatchEmail(data: { data: FullBatch }) {
  const ingredients = data.data.batchIngredients as BatchIngredient[];
  const steps = data.data.batchSteps as BatchStep[];
  const html = `
  <div style="font-family:Arial,sans-serif;padding:20px;border:1px solid #e0e0e0;border-radius:8px;">
    <h2 style="color:#2c3e50;">🍺 Mẻ bia mới đã được tạo thành công bởi ${
      data.data.createdBy?.username
    }!</h2>
    <ul style="font-size:16px;line-height:1.6;">
      <li><strong>Tên mẻ:</strong> ${data.data.beerName}</li>
      <li><strong>Thể tích:</strong> ${data.data.volume} lít</li>
      <li><strong>Công thức:</strong> ${
        data.data.recipe?.name || "Không rõ"
      }</li>
      <li><strong>Thời gian tạo:</strong> ${new Date(
        data.data.createdAt ?? ""
      ).toLocaleString("vi-VN")}</li>
       <li><strong>Người tạo:</strong> ${
         data.data.createdBy?.username || "Không rõ"
       }</li>
    </ul>

    <h3 style="color:#2980b9;">📦 Nguyên liệu sử dụng:</h3>
    <ul>
      ${
        ingredients.length
          ? ingredients
              .map(
                (item) =>
                  `<li>${item.ingredient.name}: ${Number(
                    item.amountUsed
                  ).toFixed(2)} ${item.ingredient.unit} (${
                    item.ingredient.type
                  })</li>`
              )
              .join("")
          : "<li>Không rõ</li>"
      }
    </ul>

    <h3 style="color:#27ae60;">🧪 Các bước thực hiện:</h3>
    <ol>
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
                <li>
                  <strong>Bước ${step.stepOrder}:</strong> ${htmlFromMarkdown}
                  <br />
                  <em>Thời gian bắt đầu:</em> ${new Date(
                    step.startedAt
                  ).toLocaleString("vi-VN")}
                  <br />
                  <em>Tổng thời gian thực hiện:</em> ${minutesToOtherTimes(
                    duration
                  )}
                </li>
              `;
              })
              .join("")
          : "<li>Không có bước nào</li>"
      }
    </ol>
    
    <p style="margin-top:20px;">🔗 Vui lòng truy cập hệ thống để xem chi tiết.</p>
  </div>
`;

  const text = `Mẻ ${data.data.beerName} đã được tạo với thể tích ${
    data.data.volume
  } lít vào lúc ${new Date(data.data.createdAt ?? "").toLocaleString(
    "vi-VN"
  )}.`;

  return { subject: "🔔 Thông báo: Đã tạo mẻ bia mới", html, text };
}
