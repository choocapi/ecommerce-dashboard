"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import { toast } from "sonner";

// API base URL
const API_BASE =
  process.env.NEXT_PUBLIC_PROVINCE_API_BASE || "https://provinces.open-api.vn/api/v1";

// Types cho API response
type Province = {
  code: number;
  name: string;
  districts?: District[];
};

type District = {
  code: number;
  name: string;
  wards?: Ward[];
};

type Ward = {
  code: number;
  name: string;
};

type AddressOption = {
  value: string;
  label: string;
};

interface AddressSelectProps {
  control: Control<any>;
  setValue?: UseFormSetValue<any>;
  cityField: string;
  districtField: string;
  wardField: string;
  disabled?: boolean;
  className?: string;
}

export const AddressSelect = ({
  control,
  setValue,
  cityField,
  districtField,
  wardField,
  disabled = false,
  className,
}: AddressSelectProps) => {
  const [provinceOptions, setProvinceOptions] = useState<AddressOption[]>([]);
  const [districtOptions, setDistrictOptions] = useState<AddressOption[]>([]);
  const [wardOptions, setWardOptions] = useState<AddressOption[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Watch form values để sync với form state
  const cityValue = useWatch({ control, name: cityField });
  const districtValue = useWatch({ control, name: districtField });
  const wardValue = useWatch({ control, name: wardField });

  const showErrorNotification = useCallback((message: string) => {
    toast.error("Lỗi tải địa chỉ", {
      description: message,
    });
  }, []);

  const fetchProvinces = useCallback(async () => {
    setLoadingProvinces(true);
    try {
      const response = await fetch(`${API_BASE}/p/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Province[] = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Không thể tải danh sách tỉnh/thành phố");
      }

      const options: AddressOption[] = data.map((item) => ({
        value: String(item.code),
        label: item.name,
      }));

      setProvinceOptions(options);
    } catch (error: any) {
      console.error("Failed to fetch provinces:", error);
      showErrorNotification(error?.message || "Không thể tải danh sách tỉnh/thành phố");
    } finally {
      setLoadingProvinces(false);
    }
  }, [showErrorNotification]);

  const fetchDistricts = useCallback(
    async (provinceCode: string) => {
      if (!provinceCode) {
        setDistrictOptions([]);
        return;
      }

      setLoadingDistricts(true);
      try {
        const response = await fetch(`${API_BASE}/p/${provinceCode}?depth=2`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const province: Province = await response.json();

        if (!province.districts || !Array.isArray(province.districts)) {
          throw new Error("Không thể tải danh sách quận/huyện");
        }

        const options: AddressOption[] = province.districts.map((item) => ({
          value: String(item.code),
          label: item.name,
        }));

        setDistrictOptions(options);
      } catch (error: any) {
        console.error("Failed to fetch districts:", error);
        showErrorNotification(error?.message || "Không thể tải danh sách quận/huyện");
      } finally {
        setLoadingDistricts(false);
      }
    },
    [showErrorNotification],
  );

  const fetchWards = useCallback(
    async (districtCode: string) => {
      if (!districtCode) {
        setWardOptions([]);
        return;
      }

      setLoadingWards(true);
      try {
        const response = await fetch(`${API_BASE}/d/${districtCode}?depth=2`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const district: District = await response.json();

        if (!district.wards || !Array.isArray(district.wards)) {
          throw new Error("Không thể tải danh sách phường/xã");
        }

        const options: AddressOption[] = district.wards.map((item) => ({
          value: String(item.code),
          label: item.name,
        }));

        setWardOptions(options);
      } catch (error: any) {
        console.error("Failed to fetch wards:", error);
        showErrorNotification(error?.message || "Không thể tải danh sách phường/xã");
      } finally {
        setLoadingWards(false);
      }
    },
    [showErrorNotification],
  );

  // Load provinces on mount
  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  // Sync selectedProvince với form value
  useEffect(() => {
    if (!provinceOptions.length) {
      return;
    }

    if (typeof cityValue !== "string" || !cityValue) {
      setSelectedProvince(null);
      return;
    }

    const matchedProvince = provinceOptions.find((option) => option.label === cityValue);
    if (matchedProvince) {
      setSelectedProvince((prev) =>
        prev === matchedProvince.value ? prev : matchedProvince.value,
      );
    }
  }, [cityValue, provinceOptions]);

  // Fetch districts when province is selected
  useEffect(() => {
    if (!selectedProvince) {
      setDistrictOptions([]);
      setSelectedDistrict(null);
      return;
    }

    fetchDistricts(selectedProvince);
  }, [fetchDistricts, selectedProvince]);

  // Sync selectedDistrict với form value
  useEffect(() => {
    if (!districtOptions.length) {
      return;
    }

    if (typeof districtValue !== "string" || !districtValue) {
      setSelectedDistrict(null);
      return;
    }

    const matchedDistrict = districtOptions.find((option) => option.label === districtValue);
    if (matchedDistrict) {
      setSelectedDistrict((prev) =>
        prev === matchedDistrict.value ? prev : matchedDistrict.value,
      );
    }
  }, [districtValue, districtOptions]);

  // Fetch wards when district is selected
  useEffect(() => {
    if (!selectedDistrict) {
      setWardOptions([]);
      setSelectedWard(null);
      return;
    }

    fetchWards(selectedDistrict);
  }, [fetchWards, selectedDistrict]);

  // Sync selectedWard với form value
  useEffect(() => {
    if (!wardOptions.length) {
      return;
    }

    if (typeof wardValue !== "string" || !wardValue) {
      setSelectedWard(null);
      return;
    }

    const matchedWard = wardOptions.find((option) => option.label === wardValue);
    if (matchedWard) {
      setSelectedWard((prev) => (prev === matchedWard.value ? prev : matchedWard.value));
    }
  }, [wardValue, wardOptions]);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      {/* Province/City Select */}
      <FormField
        control={control}
        name={cityField}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900 font-medium">Thành phố/Tỉnh</FormLabel>
            <Select
              value={selectedProvince || ""}
              onValueChange={(value) => {
                setSelectedProvince(value);
                const selectedOption = provinceOptions.find((option) => option.value === value);
                field.onChange(selectedOption?.label || "");

                // Reset dependent fields
                setSelectedDistrict(null);
                setSelectedWard(null);
                setDistrictOptions([]);
                setWardOptions([]);
                if (setValue) {
                  setValue(districtField, "", { shouldValidate: false });
                  setValue(wardField, "", { shouldValidate: false });
                }
              }}
              disabled={disabled || loadingProvinces}
            >
              <FormControl>
                <SelectTrigger className="h-10 rounded-md border-gray-200 text-sm text-gray-900 bg-white disabled:bg-gray-100">
                  <SelectValue
                    placeholder={loadingProvinces ? "Đang tải..." : "Chọn thành phố/tỉnh"}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {provinceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-sm">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* District Select */}
      <FormField
        control={control}
        name={districtField}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900 font-medium">Quận/Huyện</FormLabel>
            <Select
              value={selectedDistrict || ""}
              onValueChange={(value) => {
                setSelectedDistrict(value);
                const selectedOption = districtOptions.find((option) => option.value === value);
                field.onChange(selectedOption?.label || "");

                // Reset dependent field
                setSelectedWard(null);
                setWardOptions([]);
                if (setValue) {
                  setValue(wardField, "", { shouldValidate: false });
                }
              }}
              disabled={disabled || !selectedProvince || loadingDistricts}
            >
              <FormControl>
                <SelectTrigger className="h-10 rounded-md border-gray-200 text-sm text-gray-900 bg-white disabled:bg-gray-100">
                  <SelectValue placeholder={loadingDistricts ? "Đang tải..." : "Chọn quận/huyện"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {districtOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-sm">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Ward Select */}
      <FormField
        control={control}
        name={wardField}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900 font-medium">Phường/Xã</FormLabel>
            <Select
              value={selectedWard || ""}
              onValueChange={(value) => {
                setSelectedWard(value);
                const selectedOption = wardOptions.find((option) => option.value === value);
                field.onChange(selectedOption?.label || "");
              }}
              disabled={disabled || !selectedDistrict || loadingWards}
            >
              <FormControl>
                <SelectTrigger className="h-10 rounded-md border-gray-200 text-sm text-gray-900 bg-white disabled:bg-gray-100">
                  <SelectValue placeholder={loadingWards ? "Đang tải..." : "Chọn phường/xã"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {wardOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-sm">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
