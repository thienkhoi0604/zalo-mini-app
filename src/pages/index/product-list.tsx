import React, { FC, Suspense, useEffect } from "react";
import { Section } from "components/section";
import { useProductsStore } from "stores/products";
import { Box } from "zmp-ui";
import { ProductItem } from "components/product/item";
import { ProductItemSkeleton } from "components/skeletons";

export const ProductListContent: FC = () => {
  const products = useProductsStore((s) => s.products);
  const loadProducts = useProductsStore((s) => s.loadProducts);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <Section title="Danh sách sản phẩm">
      <Box className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </Box>
    </Section>
  );
};

export const ProductListFallback: FC = () => {
  const products = [...new Array(12)];

  return (
    <Section title="Danh sách sản phẩm">
      <Box className="grid grid-cols-2 gap-4">
        {products.map((_, i) => (
          <ProductItemSkeleton key={i} />
        ))}
      </Box>
    </Section>
  );
};

export const ProductList: FC = () => {
  return (
    <Suspense fallback={<ProductListFallback />}>
      <ProductListContent />
    </Suspense>
  );
};
