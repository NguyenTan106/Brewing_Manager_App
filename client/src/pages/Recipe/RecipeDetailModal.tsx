import type {
  RecipeIngredient,
  RecipeUpate,
} from "../../services/CRUD/CRUD_API_Recipe";
import { useState } from "react";
import UpdateRecipeModal from "./UpdateRecipeModal";
import { deleteRecipeByIdAPI } from "../../services/CRUD/CRUD_API_Recipe";
import type { Ingredient } from "../../services/CRUD/CRUD_API_Ingredient";
import IngredientDetailModalFromRecipe from "./IngredientDetailModalFromRecipe";
import { getIngredientByIdAPI } from "../../services/CRUD/CRUD_API_Ingredient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { minutesToOtherTimes } from "./MinutesToOtherTimes";

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
    const deleted = await deleteRecipeByIdAPI(id);
    const errorMessage = deleted.message;
    if (deleted.data == null) {
      toast.error(`${errorMessage}`);
      return;
    }
    toast.success(`${errorMessage}`);
    handlePaginationAPI();
    handleClose();
  };

  const handleGetIngredientByIdAPI = async (id: number) => {
    const ingredient = await getIngredientByIdAPI(id);
    setSelectedIngredient(ingredient);
    setShowDetailIngredientModal(true);
  };

  const handleShowUpdateModal = async () => {
    setShowUpdateModal(true);
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
                  {selectedRecipe?.steps.map((p, idx) => (
                    <div key={idx}>
                      {/* Hiển thị bước */}
                      <div className="p-2 border rounded shadow-sm text-center">
                        <strong className="text-xl">
                          Bước {p.stepOrder}:{" "}
                        </strong>
                        <ReactMarkdown>{p.name}</ReactMarkdown>
                      </div>

                      {/* Hiển thị mũi tên + thời gian (nếu không phải bước cuối) */}
                      {idx < selectedRecipe?.steps.length - 1 && (
                        <div className="relative my-5 mt-4 h-6">
                          {/* Mũi tên ở giữa */}
                          <div className="absolute left-1/2 -top-2 transform -translate-x-1/2 text-4xl text-gray-500">
                            ↓
                          </div>

                          {/* Thời gian nằm bên phải mũi tên */}
                          <div className="absolute left-1/2 top-1 transform -translate-x-2 ml-6 text-sm text-gray-600 italic">
                            {minutesToOtherTimes(p.durationMinutes)}
                          </div>
                        </div>
                      )}
                      {idx == selectedRecipe?.steps.length - 1 && <div></div>}
                    </div>
                  ))}
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
              onClick={() => handleShowUpdateModal()}
              style={{
                padding: "5px 10px",
                fontSize: "14px",
              }}
            >
              ✏️ <span className="d-none d-sm-inline">Chỉnh sửa</span>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  style={{
                    padding: "5px 10px",
                    fontSize: "14px",
                  }}
                >
                  🗑️ <span className="d-none d-sm-inline">Xóa</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Bạn có chắc muốn xóa nguyên liệu này?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Công thức này sẽ bị đưa vào mục đã xóa, các liên kết của
                    công thức này vẫn được giữ nguyên.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      selectedRecipe?.id &&
                      handleDeleteRecipeByIdAPI(selectedRecipe?.id)
                    }
                  >
                    Xác nhận
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button variant="outline" onClick={handleClose}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
