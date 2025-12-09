"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "./_components/overview";
import { ProductsInventoryOverview } from "./_components/products-inventory-overview";
import { SalesOverview } from "./_components/sales-overview";

export default function DashboardPage() {
  return (
    <>
      <Tabs orientation="vertical" defaultValue="overview" className="space-y-4">
        <div className="w-full overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="sales">Bán hàng</TabsTrigger>
            <TabsTrigger value="products">Sản phẩm/Tồn kho</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="overview" className="space-y-4">
          <Overview />
        </TabsContent>
        <TabsContent value="sales" className="space-y-4">
          <SalesOverview />
        </TabsContent>
        <TabsContent value="products" className="space-y-4">
          <ProductsInventoryOverview />
        </TabsContent>
      </Tabs>
    </>
  );
}
