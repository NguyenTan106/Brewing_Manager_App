import { useState, useEffect } from "react";
import { Table, Badge, Button } from "react-bootstrap";
import {
  getAllIngredientsAPI,
  getIngredientByIdAPI,
} from "../services/CRUD_API_Ingredient";
import IngredientDetail from "./IngredientDetailModal";
import { getIngredientIcon } from "./IngredientIcon";
import { AddIngredient } from "./AddNewIngredient";

export interface Ingredient {
  id: number;
  name: string;
  type: string;
  unit: string;
  quantity: number;
  lowStockThreshold: number;
  lastImportDate: string;
  notes?: string;
  status: string;
}

export default function IngredientManager() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [message, setMessage] = useState("");
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
    setSelectedIngredient(null);
  };

  useEffect(() => {
    handleGetAllIngredientsAPI();
  }, []);

  const handleGetAllIngredientsAPI = async () => {
    const data = await getAllIngredientsAPI();
    setIngredients(data.data);
    setMessage(data.message);
  };

  const handleGetIngredientByIdAPI = async (id: number) => {
    const data = await getIngredientByIdAPI(id);
    setSelectedIngredient(data);
    setShowModal(true);
  };

  return (
    <>
      <AddIngredient handleGetAllIngredientsAPI={handleGetAllIngredientsAPI} />
      <Table
        striped
        bordered
        hover
        responsive
        style={{ verticalAlign: "middle" }}
      >
        <thead>
          <tr>
            <th style={{ width: "5%" }}>ID</th>
            <th style={{ width: "15%" }}>Tên nguyên liệu</th>
            <th style={{ width: "10%" }}>Loại</th>
            <th style={{ width: "12%" }}>Số lượng tồn</th>
            <th style={{ width: "8%" }}>Đơn vị</th>
            <th style={{ width: "10%" }}>Trạng thái</th>
            <th style={{ width: "20%" }}>Ngày nhập kho gần nhất</th>
            <th style={{ width: "15%" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center text-muted">
                Không có sách nào
              </td>
            </tr>
          ) : (
            ingredients.map((i, idx) => (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{i.name}</td>
                <td>
                  {getIngredientIcon(i.type)}
                  {i.type}
                </td>
                <td>{i.quantity}</td>
                <td>{i.unit}</td>
                <td>
                  {i.status === "Đủ" && (
                    <Badge bg="success" className="me-1" key={idx}>
                      {i.status}
                    </Badge>
                  )}
                  {i.status === "Sắp hết" && (
                    <Badge bg="warning" className="me-1" key={idx}>
                      {i.status}
                    </Badge>
                  )}
                  {i.status === "Hết" && (
                    <Badge bg="danger" className="me-1" key={idx}>
                      {i.status}
                    </Badge>
                  )}
                </td>
                <td>
                  {new Date(i.lastImportDate).toLocaleString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh",
                    hour12: false,
                  })}
                </td>
                <td>
                  <Button
                    className=""
                    variant="info"
                    onClick={() => handleGetIngredientByIdAPI(i.id)}
                    style={{
                      padding: "5px 10px",
                      fontSize: "14px",
                    }}
                  >
                    📋 <span className="d-none d-sm-inline">Chi tiết</span>
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      <IngredientDetail
        showModal={showModal}
        setShowModal={setShowModal}
        handleClose={handleClose}
        selectedIngredient={selectedIngredient}
        getIngredientIcon={getIngredientIcon}
        handleGetAllIngredientsAPI={handleGetAllIngredientsAPI}
      />
    </>
  );
}
