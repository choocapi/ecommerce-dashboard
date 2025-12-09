"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { returnRequestService } from "@/services/returnRequestService";
import { ReturnStatus, ReturnStatusEnum } from "@/types/enums";
import { IReturnRequest, RETURN_STATUS_LABELS, getReturnStatusColor } from "@/types/return-request";
import { getUserFullName } from "@/utils";
import ReturnRequestImages from "./return-request-images";

interface ReturnRequestsMutateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentReturnRequest: IReturnRequest | null;
}

// Status Badge Component
const StatusBadge = ({ status }: { status: ReturnStatus }) => {
  return (
    <Badge variant="outline" className={`text-sm px-3 py-1 ${getReturnStatusColor(status)}`}>
      {RETURN_STATUS_LABELS[status]}
    </Badge>
  );
};

// Info Row Component
const InfoRow = ({ label, value }: { label: string; value?: string | null }) => (
  <div>
    <label className="text-sm font-medium text-muted-foreground">{label}</label>
    <p className="text-sm mt-1">{value || "—"}</p>
  </div>
);

export function ReturnRequestsMutateDrawer({
  open,
  onOpenChange,
  currentReturnRequest,
}: ReturnRequestsMutateDrawerProps) {
  const queryClient = useQueryClient();
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async (status: ReturnStatus) => {
    if (!currentReturnRequest) return;

    if (status === ReturnStatusEnum.REJECTED && !adminNote.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    setLoading(true);
    try {
      await returnRequestService.update(currentReturnRequest.id, {
        status,
        adminNote: adminNote.trim() || undefined,
      });

      toast.success("Cập nhật yêu cầu trả hàng thành công");

      // Invalidate and refetch return requests data
      await queryClient.invalidateQueries({
        queryKey: ["return-requests"],
      });

      setAdminNote("");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || "Không thể cập nhật yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  if (!currentReturnRequest) return null;

  const user = currentReturnRequest.user;
  const userDisplayName = getUserFullName(user) || user?.email || currentReturnRequest.userId;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-2xl">
        <SheetHeader className="text-start">
          <SheetTitle>Yêu cầu trả hàng</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <div className="space-y-6">
            {/* Status Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Trạng thái yêu cầu</h3>
              <div className="rounded-lg border bg-card p-4">
                <StatusBadge status={currentReturnRequest.status} />
              </div>
            </div>

            {/* Request Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin yêu cầu</h3>
              <div className="rounded-lg border bg-card p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoRow label="Mã đơn hàng" value={currentReturnRequest.orderId} />
                  <InfoRow label="Khách hàng" value={userDisplayName} />
                  {user?.email && <InfoRow label="Email" value={user.email} />}
                  {user?.phoneNumber && <InfoRow label="Số điện thoại" value={user.phoneNumber} />}
                  <InfoRow
                    label="Ngày tạo"
                    value={new Date(currentReturnRequest.createdAt).toLocaleString("vi-VN")}
                  />
                </div>
              </div>
            </div>

            {/* Reason Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Lý do trả hàng</h3>
              <div className="rounded-lg border bg-card p-4">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {currentReturnRequest.reason}
                </p>
              </div>
            </div>

            {/* Images Section */}
            {currentReturnRequest.imageUrls && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Hình ảnh minh chứng</h3>
                <div className="rounded-lg bg-card">
                  <ReturnRequestImages returnRequest={currentReturnRequest} />
                </div>
              </div>
            )}

            {/* Admin Note Section */}
            {currentReturnRequest.adminNote && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Ghi chú của admin</h3>
                <div className="rounded-lg border bg-card p-4">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {currentReturnRequest.adminNote}
                  </p>
                </div>
              </div>
            )}

            {/* Admin Note Section - Only show for PENDING status when rejecting */}
            {currentReturnRequest.status === ReturnStatusEnum.PENDING && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Ghi chú</h3>
                <div className="rounded-lg border bg-card p-4">
                  <Textarea
                    placeholder="Nhập ghi chú (bắt buộc khi từ chối)..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="gap-2">
          {currentReturnRequest.status === ReturnStatusEnum.PENDING && (
            <>
              <Button
                variant="default"
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => handleUpdateStatus(ReturnStatusEnum.APPROVED)}
                disabled={loading}
              >
                Chấp nhận
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => handleUpdateStatus(ReturnStatusEnum.REJECTED)}
                disabled={loading}
              >
                Từ chối
              </Button>
            </>
          )}
          {currentReturnRequest.status === ReturnStatusEnum.APPROVED && (
            <Button
              variant="default"
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => handleUpdateStatus(ReturnStatusEnum.COMPLETED)}
              disabled={loading}
            >
              Đã nhận hàng trả
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
