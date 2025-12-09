import InvalidImage from "@/components/common/invalid-image";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Feature } from "@/config/permissions-config";
import { ARTICLE_CATEGORIES } from "@/constants/articles";
import { useFeaturePermissions } from "@/hooks/use-feature-permissions";
import { articleService } from "@/services/articleService";
import { IArticle } from "@/types/article";
import { formatNumberId } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useArticles } from "./articles-provider";

// Actions Cell Component with Confirm Dialog
function ActionsCell({ article }: { article: IArticle }) {
  const { setOpen, setCurrentRow } = useArticles();
  const queryClient = useQueryClient();
  const { canUpdate, canDelete } = useFeaturePermissions(Feature.ARTICLES);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await articleService.delete(article.id);
      toast.success("Đã xóa bài viết thành công");

      // Invalidate and refetch articles data
      await queryClient.invalidateQueries({
        queryKey: ["articles"],
      });
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa bài viết");
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  };

  // Don't show actions if user has no permissions
  if (!canUpdate && !canDelete) {
    return <div className="text-muted-foreground text-sm">Cần quyền</div>;
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {canUpdate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrentRow(article);
              setOpen("update");
            }}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Sửa</span>
          </Button>
        )}
        {canDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmOpen(true)}
            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Xóa</span>
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Xóa bài viết"
        desc={`Bạn có chắc muốn xóa bài viết "${article.title}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        destructive
        handleConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}

export const articlesColumns: ColumnDef<IArticle>[] = [
  {
    accessorKey: "id",
    header: "Mã",
    cell: ({ row }) => <div className="font-medium">{formatNumberId(row.getValue("id"))}</div>,
  },
  {
    accessorKey: "featuredImage",
    header: "Ảnh",
    cell: ({ row }) => {
      const featuredImage = row.getValue("featuredImage") as string;
      return featuredImage ? (
        <div className="relative w-12 h-12 rounded-md overflow-hidden border border-gray-200">
          <img src={featuredImage} alt="Article" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center">
          <InvalidImage />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Tiêu đề",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <div className="max-w-[300px] truncate" title={title}>
          {title}
        </div>
      );
    },
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("slug")}</div>,
  },
  {
    accessorKey: "category",
    header: "Danh mục",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return (
        <div className="capitalize">
          {ARTICLE_CATEGORIES.find((c) => c.slug === category)?.name || "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "isPublished",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") as boolean;
      return (
        <Badge variant={isPublished ? "default" : "secondary"}>
          {isPublished ? "Đã xuất bản" : "Nháp"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "publishedAt",
    header: "Ngày xuất bản",
    cell: ({ row }) => {
      const publishedAt = row.getValue("publishedAt") as string;
      return publishedAt ? (
        <div className="text-sm">{new Date(publishedAt).toLocaleDateString("vi-VN")}</div>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <ActionsCell article={row.original} />,
    enableSorting: false,
  },
];
