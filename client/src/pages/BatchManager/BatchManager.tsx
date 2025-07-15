import { Button, Table, Badge } from "react-bootstrap";
import {
  getAllBatchesAPI,
  getAllBatchByIdAPI,
} from "../../services/CRUD_API_Batch";
import { useState, useEffect } from "react";
import { FaAngleRight, FaAngleLeft, FaPlus } from "react-icons/fa";
import BatchDetailModal from "./BatchDetailModal";

// eslint-disable-next-line react-refresh/only-export-components
export enum Status {
  boiling = "boiling",
  fermenting = "fermenting",
  cold_crashing = "cold_crashing",
  done = "done",
}

export interface Batch {
  id: number;
  code: string;
  beerName: string;
  status: Status;
  volume: number;
  notes?: string;
  recipeId?: number;
  createdAt?: string;
}

export default function BatchManager() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    handleGetAllBatchesAPI();
  }, []);

  const statusOptions = Object.values(Status).map((s) => ({
    label: s.replace("_", " ").toUpperCase(), // "COLD CRASHING"
    value: s,
  }));

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case Status.boiling:
        return <Badge bg="primary">Đun sôi</Badge>;
      case Status.fermenting:
        return <Badge bg="warning">Lên men</Badge>;
      case Status.cold_crashing:
        return <Badge bg="info">Làm lạnh</Badge>;
      case Status.done:
        return <Badge bg="success">Hoàn thành</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const handleGetAllBatchesAPI = async () => {
    const data = await getAllBatchesAPI();
    setBatches(data);
  };
  const handleGetBatchesByIdAPI = async (id: number) => {
    const data = await getAllBatchByIdAPI(id);
    setSelectedBatch(data);
    setShowModal(true);
  };

  return (
    <>
      <BatchDetailModal
        showModal={showModal}
        handleClose={() => setShowModal(false)}
        statusOptions={statusOptions}
        selectedBatch={selectedBatch}
        getStatusBadge={getStatusBadge}
      />
      <div className="d-flex justify-content-start align-items-center mt-3 flex-wrap gap-2">
        <h3 className="mb-0">Danh sách mẻ:</h3>
        <Button
          title="Thêm nguyên liệu mới"
          variant="primary"
          className="d-flex align-items-center gap-2"
        >
          <FaPlus />
          <span className="d-none d-sm-inline">Thêm</span>
        </Button>
      </div>

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
            <th style={{ width: "5%" }}>Mã mẻ</th>
            <th style={{ width: "10%" }}>Tên mẻ</th>
            <th style={{ width: "12%" }}>Trạng thái</th>
            <th style={{ width: "10%" }}>Khối lượng (lít)</th>
            <th style={{ width: "10%" }}>Ngày tạo</th>
            <th style={{ width: "10%" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {batches.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center text-muted">
                Không có mẻ nào
              </td>
            </tr>
          ) : (
            batches.map((i) => (
              <tr key={i.id}>
                <td>{i.code}</td>
                <td>{i.beerName}</td>
                <td>{getStatusBadge(i.status)}</td>
                <td>{i.volume}</td>
                <td>
                  {i.createdAt &&
                    new Date(i.createdAt).toLocaleString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                      hour12: false,
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </td>

                <td>
                  <Button
                    title="Xem chi tiết nguyên liệu"
                    variant="info"
                    onClick={() => handleGetBatchesByIdAPI(i.id)}
                    style={{ padding: "5px 10px", fontSize: "14px" }}
                  >
                    📋 <span className="d-none d-sm-inline">Chi tiết</span>
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  );
}
