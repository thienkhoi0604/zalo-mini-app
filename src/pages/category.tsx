import { ProductItem } from "components/product/item";
import React, { FC, Suspense, useEffect } from "react";
import { useProductsStore } from "stores/products";
import { Box, Header, Page, Tabs, Text } from "zmp-ui";

const CategoryPicker: FC = () => {
  const categories = useProductsStore((s) => s.categories);
  const selectedCategory = useProductsStore((s) => s.selectedCategoryId);
  return (
    <Tabs
      scrollable
      defaultActiveKey={selectedCategory}
      className="category-tabs"
    >
      {categories.map((category) => (
        <Tabs.Tab key={category.id} label={category.name}>
          <Suspense>
            <CategoryProducts categoryId={category.id} />
          </Suspense>
        </Tabs.Tab>
      ))}
    </Tabs>
  );
};

const CategoryProducts: FC<{ categoryId: string }> = ({ categoryId }) => {
  const productsByCategorySelector = useProductsStore(
    (s) => s.productsByCategory
  );
  const loadProducts = useProductsStore((s) => s.loadProducts);
  const productsByCategory = productsByCategorySelector(categoryId);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (productsByCategory.length === 0) {
    return (
      <Box className="flex-1 bg-background p-4 flex justify-center items-center">
        <Text size="xSmall" className="text-gray">
          Không có sản phẩm trong danh mục
        </Text>
      </Box>
    );
  }
  return (
    <Box className="bg-background grid grid-cols-2 gap-4 p-4">
      {productsByCategory.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </Box>
  );
};

const CategoryPage: FC = () => {
  return (
    <Page className="flex flex-col">
      <Header title="Danh mục" />
      <CategoryPicker />
    </Page>
  );
};

export default CategoryPage;
