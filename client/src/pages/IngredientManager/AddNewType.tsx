import React, { useState } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import { createTypeAPI, deleteTypeAPI } from "../../services/CRUD_API_type";
type Props = {
  showTypeModal: boolean;
  handleClose: () => void;
  type: { id: number; typeName: string }[];
  handleGetAllTypesAPI: () => void;
};
export function AddNewType({
  showTypeModal,
  handleClose,
  type,
  handleGetAllTypesAPI,
}: Props) {
  const [newTypeName, setNewTypeName] = useState("");

  const handleCreateTypeAPI = async (typeName: string) => {
    if (typeName.trim() === "") {
      alert("Vui lòng nhập tên loại nguyên liệu");
      return;
    }
    const newType = await createTypeAPI(typeName);
    const errorMessage = newType.message;
    if (newType.data == null) {
      alert(`${errorMessage}`);
      return;
    }
    alert(`${errorMessage}`);
    setNewTypeName("");
    handleGetAllTypesAPI();
  };

  const handleDeleteTypeAPI = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa loại nguyên liệu này?")) {
      const response = await deleteTypeAPI(id);
      console.log(response);
      const errorMessage = response.message;
      if (response.data == null) {
        alert(`${errorMessage}`);
        return;
      }
      alert(`${errorMessage}`);
      handleGetAllTypesAPI();
    }
  };
  return (
    <>
      <Modal show={showTypeModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết nguyên liệu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <b>Thêm loại nguyên liệu mới:</b>
          </p>
          <Form.Group controlId="formTypeName" className="mb-3">
            <div className="d-flex gap-2 align-items-center">
              <Form.Control
                type="text"
                placeholder="Nhập tên loại nguyên liệu"
                value={newTypeName}
                onChange={(e) => {
                  setNewTypeName(e.target.value);
                }}
              />
              <Button
                variant="primary"
                onClick={() => handleCreateTypeAPI(newTypeName)}
              >
                <span className="d-none d-sm-inline">Thêm</span>
              </Button>
            </div>
          </Form.Group>

          <h5>Danh sách các loại nguyên liệu:</h5>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên loại</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {type.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.typeName}</td>
                  <td style={{ width: "25%" }}>
                    <Button
                      variant="danger"
                      onClick={() => {
                        handleDeleteTypeAPI(t.id);
                      }}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
