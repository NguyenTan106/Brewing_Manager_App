import type {
  RecipeIngredient,
  RecipeUpate,
} from "../../services/CRUD_API_Recipe";
import { useState } from "react";
import UpdateRecipeModal from "./UpdateRecipeModal";
import { deleteRecipeByIdAPI } from "../../services/CRUD_API_Recipe";
import type { Ingredient } from "../../services/CRUD_API_Ingredient";
import IngredientDetailModalFromRecipe from "./IngredientDetailModalFromRecipe";
import { getIngredientByIdAPI } from "../../services/CRUD_API_Ingredient";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

interface Props {
  handleClose: () => void;
  showDetailModal: boolean;
  selectedRecipe: RecipeUpate | null;
  setSelectedRecipe: React.Dispatch<React.SetStateAction<RecipeUpate | null>>;
  selectedRecipeIngredient: RecipeIngredient[] | null;
  setSelectedRecipeIngredient: React.Dispatch<
    React.SetStateAction<RecipeIngredient[] | null>
  >;
  ingredients: Ingredient[];
  handlePaginationAPI: () => void;
}

export default function RecipeDetailModal({
  handleClose,
  showDetailModal,
  selectedRecipe,
  setSelectedRecipe,
  selectedRecipeIngredient,
  setSelectedRecipeIngredient,
  handlePaginationAPI,
  ingredients,
}: Props) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailIngredientModal, setShowDetailIngredientModal] =
    useState(false);
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const handleDeleteRecipeByIdAPI = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa công thức này?")) {
      const deleted = await deleteRecipeByIdAPI(id);
      console.log(deleted);
      const errorMessage = deleted.message;
      if (deleted.data == null) {
        alert(`${errorMessage}`);
        return;
      }
      alert(`${errorMessage}`);
      handlePaginationAPI();
      handleClose();
    }
  };

  const handleGetIngredientByIdAPI = async (id: number) => {
    const ingredient = await getIngredientByIdAPI(id);
    setSelectedIngredient(ingredient);
    setShowDetailIngredientModal(true);
  };

  return (
    <>
      <IngredientDetailModalFromRecipe
        showDetailIngredientModal={showDetailIngredientModal}
        handleClose={() => setShowDetailIngredientModal(false)}
        selectedIngredient={selectedIngredient as Ingredient}
      />
      <UpdateRecipeModal
        selectedRecipe={selectedRecipe}
        handleClose={() => {
          setShowUpdateModal(false);
        }}
        showUpdateModal={showUpdateModal}
        handlePaginationAPI={handlePaginationAPI}
        setSelectedRecipe={setSelectedRecipe}
        selectedRecipeIngredient={selectedRecipeIngredient}
        setSelectedRecipeIngredient={setSelectedRecipeIngredient}
        ingredients={ingredients}
      />
      <Dialog
        open={showDetailModal}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="w-full max-w-[95vw] sm:max-w-[440px] md:max-w-[600px]   max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Chi tiết công thức
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Chi tiết về công thức hiện tại.
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="grid gap-4 pt-2 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="text-base font-medium">{selectedRecipe?.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tên công thức</p>
                <p className="text-base font-medium">{selectedRecipe?.name}</p>
              </div>
              <div className="col-span-full">
                <p className="text-sm text-muted-foreground">Mô tả</p>
                <p className="text-base">{selectedRecipe?.description}</p>
              </div>
              <div className="col-span-full">
                <p className="text-sm text-muted-foreground">
                  Nguyên liệu cần dùng
                </p>
                <Table className="text-base">
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ width: "10%" }}>ID</TableHead>
                      <TableHead style={{ width: "20%" }}>Tên</TableHead>
                      <TableHead style={{ width: "20%" }}>
                        Số lượng cần
                      </TableHead>
                      <TableHead style={{ width: "20%" }}>Loại</TableHead>
                      <TableHead style={{ width: "15%" }}></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(selectedRecipeIngredient) &&
                    selectedRecipeIngredient.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center text-muted"
                        >
                          <p>Không có nguyên liệu</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedRecipeIngredient?.map((e) => (
                        <TableRow
                          className="align-middle"
                          key={e.ingredient.id}
                        >
                          <TableCell>{e.ingredient.id}</TableCell>
                          <TableCell>{e.ingredient.name}</TableCell>
                          <TableCell>
                            {e.amountNeeded}
                            {e.ingredient.unit} / 60L
                          </TableCell>
                          <TableCell>{e.ingredient.type}</TableCell>
                          <TableCell>
                            <Button
                              title="Xem chi tiết nguyên liệu"
                              variant="outline"
                              onClick={() =>
                                handleGetIngredientByIdAPI(e.ingredient.id)
                              }
                              style={{ padding: "5px 10px", fontSize: "14px" }}
                            >
                              📋{" "}
                              <span className="d-none d-sm-inline">
                                Chi tiết
                              </span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ghi chú</p>
                <p className="text-base">{selectedRecipe?.note}</p>
              </div>
              <div className="col-span-full">
                <p className="text-sm text-muted-foreground">
                  Các bước thực hiện
                </p>
                <p className="text-base ">
                  <ReactMarkdown>
                    {selectedRecipe?.instructions || ""}
                  </ReactMarkdown>
                </p>
              </div>
              <div className="col-span-full">
                <p className="text-sm text-muted-foreground">Ngày tạo</p>
                <p className="text-base">
                  {selectedRecipe?.createdAt &&
                    new Date(selectedRecipe.createdAt).toLocaleString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                      hour12: false,
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button
              variant="secondary"
              className="bg-blue-600 text-white hover:bg-blue-500"
              onClick={() => setShowUpdateModal(true)}
              style={{
                padding: "5px 10px",
                fontSize: "14px",
              }}
            >
              ✏️ <span className="d-none d-sm-inline">Chỉnh sửa</span>
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedRecipe?.id &&
                handleDeleteRecipeByIdAPI(selectedRecipe?.id)
              }
              style={{
                padding: "5px 10px",
                fontSize: "14px",
              }}
            >
              🗑️ <span className="d-none d-sm-inline">Xóa</span>
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
