import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, Calendar, Gift, FileText, Clock } from "lucide-react";

export default function FilterPanel({ filters, setFilters }) {
  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="w-5 h-5 text-green-600" />
          詳細フィルター
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="can_reserve"
              checked={filters.can_reserve_online}
              onCheckedChange={(checked) =>
                setFilters({ ...filters, can_reserve_online: checked })
              }
            />
            <Label
              htmlFor="can_reserve"
              className="text-sm font-normal cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              LINEから予約可能
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="has_coupon"
              checked={filters.has_coupon}
              onCheckedChange={(checked) =>
                setFilters({ ...filters, has_coupon: checked })
              }
            />
            <Label
              htmlFor="has_coupon"
              className="text-sm font-normal cursor-pointer flex items-center gap-2"
            >
              <Gift className="w-4 h-4 text-red-600" />
              クーポン・特典あり
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="can_view_menu"
              checked={filters.can_view_menu}
              onCheckedChange={(checked) =>
                setFilters({ ...filters, can_view_menu: checked })
              }
            />
            <Label
              htmlFor="can_view_menu"
              className="text-sm font-normal cursor-pointer flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-purple-600" />
              LINEでメニュー確認可能
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}