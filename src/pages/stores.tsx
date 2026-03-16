import React, { FC, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Box, Input, List, Page, Text, Icon, Select } from "zmp-ui";
import type { Store } from "types/store";
import { MOCK_STORES } from "mock/stores";

export const StoresPage: FC = () => {
  const navigate = useNavigate();
  const [stores] = useState<Store[]>(MOCK_STORES);
  const [search, setSearch] = useState<string>("");
  const [provinceFilter, setProvinceFilter] = useState<string>("all");
  const [wardFilter, setWardFilter] = useState<string>("all");

  const provinces = useMemo(() => {
    const provinceSet = new Set<string>();
    stores.forEach((store) => {
      if (store.province) {
        provinceSet.add(store.province);
      }
    });
    return Array.from(provinceSet).sort();
  }, [stores]);

  const wards = useMemo(() => {
    if (provinceFilter === "all") return [];
    const wardSet = new Set<string>();
    stores.forEach((store) => {
      if (store.province === provinceFilter && store.ward) {
        wardSet.add(store.ward);
      }
    });
    return Array.from(wardSet).sort();
  }, [stores, provinceFilter]);

  const filteredStores = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return stores.filter((store) => {
      const matchesProvince =
        provinceFilter === "all" ||
        store.province?.toLowerCase() === provinceFilter.toLowerCase();

      const matchesWard =
        wardFilter === "all" ||
        (store.ward &&
          store.ward.toLowerCase() === wardFilter.toLowerCase());

      if (!normalizedSearch) {
        return matchesProvince && matchesWard;
      }

      const keyword = (
        `${store.name} ${store.address} ${store.city ?? ""} ${store.ward ?? ""} ${
          store.province ?? ""
        }`
      ).toLowerCase();

      return matchesProvince && matchesWard && keyword.includes(normalizedSearch);
    });
  }, [stores, search, provinceFilter, wardFilter]);

  return (
    <Page className="relative flex-1 flex flex-col bg-white">
      <Box p={4} className="space-y-3 bg-white">
        <Text size="large" className="font-semibold">
          Hệ thống cửa hàng
        </Text>
        <Input.Search
          placeholder="Tìm kiếm theo tên, địa chỉ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {provinces.length > 0 && (
          <Box className="space-y-3">
            <Select
              label="Tỉnh / Thành phố"
              placeholder="Chọn tỉnh / TP"
              value={provinceFilter}
              onChange={(e) => {
                const newValue = (e.target.value || "all") as string;
                setProvinceFilter(newValue);
                setWardFilter("all");
              }}
            >
              <Select.Option value="all">Tất cả tỉnh / TP</Select.Option>
              {provinces.map((province) => (
                <Select.Option key={province} value={province}>
                  {province}
                </Select.Option>
              ))}
            </Select>

            {provinceFilter !== "all" && wards.length > 0 && (
              <Select
                label="Phường / Xã"
                placeholder="Chọn phường / xã"
                value={wardFilter}
                onChange={(e) => {
                  const newValue = (e.target.value || "all") as string;
                  setWardFilter(newValue);
                }}
              >
                <Select.Option value="all">Tất cả phường / xã</Select.Option>
                {wards.map((ward) => (
                  <Select.Option key={ward} value={ward}>
                    {ward}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Box>
        )}
      </Box>

      <Box className="flex-1 overflow-auto">
        {filteredStores.length === 0 && (
          <Box p={4}>
            <Text>Không tìm thấy cửa hàng phù hợp.</Text>
          </Box>
        )}
        {filteredStores.length > 0 && (
          <List>
            {filteredStores.map((store) => (
              <List.Item
                key={store.id}
                title={store.name}
                subTitle={store.address}
                prefix={<Icon icon="zi-location" />}
                onClick={() => navigate(`/stores/${store.id}`)}
              />
            ))}
          </List>
        )}
      </Box>
    </Page>
  );
};

export default StoresPage;

