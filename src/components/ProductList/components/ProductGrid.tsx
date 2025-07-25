// src/components/ProductList/components/ProductGrid.tsx

import React from "react";
import { Grid, Box, Pagination, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ProductCard from "@/components/common/ProductCard";
import { Product } from "@/types/Product";

interface ProductGridProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onFavoriteToggle?: (productId: string) => void;
  onProductClick?: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
                                                   products,
                                                   currentPage,
                                                   totalPages,
                                                   onPageChange,
                                                   onFavoriteToggle,
                                                   onProductClick,
                                                 }) => {
  const theme = useTheme();

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
    // 페이지 변경 시 스크롤을 맨 위로
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
      <Box>
        {/* 상품 그리드 */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {products.map((product) => (
              <Grid size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={product.productNumber}>
                <ProductCard
                    product={product}
                    onFavoriteToggle={onFavoriteToggle}
                    onClick={onProductClick}
                />
              </Grid>
          ))}
        </Grid>

        {/* 빈 상품일 경우 */}
        {products.length === 0 && (
            <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 8,
                }}
            >
              <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: 1,
                  }}
              >
                조건에 맞는 상품이 없습니다
              </Typography>
              <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    opacity: 0.7,
                  }}
              >
                다른 필터 조건을 시도해보세요
              </Typography>
            </Box>
        )}

        {/* 페이지네이션 */}
        {products.length > 0 && (
            <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                }}
            >
              <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="medium"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.main,
                      },
                      "&.Mui-selected": {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.primary.main, 0.8),
                        },
                      },
                    },
                  }}
              />
            </Box>
        )}
      </Box>
  );
};

export default ProductGrid;