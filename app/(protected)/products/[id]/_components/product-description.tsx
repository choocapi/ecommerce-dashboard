"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IProduct } from "@/types/products";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface ProductDescriptionProps {
  product: IProduct;
  className?: string;
}

export default function ProductDescription({ product, className }: ProductDescriptionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!product.description) {
    return null;
  }

  // Check if content is long enough to need truncation
  // Strip HTML to get approximate text length
  const textLength = product.description.replace(/<[^>]*>/g, "").length;
  const hasMoreContent = textLength > 300;

  return (
    <>
      <div className={className}>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Heading */}
          <h2 className="text-gray-900 font-bold text-2xl mb-4">Bài viết chi tiết</h2>

          {/* Preview Content */}
          <div className="relative mb-4">
            <div
              className={`article-content ${hasMoreContent ? "max-h-96 overflow-hidden" : ""}`}
              dangerouslySetInnerHTML={{
                __html: product.description,
              }}
            />
            {hasMoreContent && (
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            )}
          </div>

          {/* View Details Button */}
          {hasMoreContent && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                className="rounded-full px-6 py-2 font-semibold border-gray-200 text-gray-900 hover:bg-gray-50"
              >
                Xem chi tiết
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Full Content Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900 font-bold text-2xl">
              Bài viết chi tiết
            </DialogTitle>
          </DialogHeader>
          <div
            className="article-content mt-4"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
