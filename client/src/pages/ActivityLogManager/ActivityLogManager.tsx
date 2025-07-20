import { useEffect, useState } from "react";
import type { ActivityLog } from "../../services/CRUD_API_ActivityLog";
import { getAllActivityLogsAPI } from "../../services/CRUD_API_ActivityLog";
import { Table } from "react-bootstrap";
export default function ActivityLogManager() {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    handleGetAllActitivyLogsAPI();
  }, []);

  const handleGetAllActitivyLogsAPI = async () => {
    const data = await getAllActivityLogsAPI();
    setActivityLogs(data);
  };
  return (
    <>
      <h3 className="mb-0">Nhật kí hoạt động:</h3>
      <hr />

      <Table
        striped
        bordered
        hover
        responsive
        style={{ verticalAlign: "middle", marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Bảng</th>
            <th>Mô tả</th>
            <th>Ngày thực hiện</th>
          </tr>
        </thead>
        <tbody>
          {activityLogs.map((e, idx) => {
            return (
              <tr key={idx}>
                <td style={{ width: "5%" }}>{e.id}</td>
                <td style={{ width: "10%" }}>{e.entity}</td>
                <td style={{ width: "50%" }}>{e.description}</td>
                <td style={{ width: "20%" }}>
                  {e.timestamp &&
                    new Date(e.timestamp).toLocaleString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                      hour12: false,
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}
