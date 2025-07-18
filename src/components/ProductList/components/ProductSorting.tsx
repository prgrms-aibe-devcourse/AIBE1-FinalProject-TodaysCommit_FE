// src/components/ProductList/components/ProductSorting.tsx

import React from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";

import {PetType, ProductType, SORT_OPTIONS} from "@/components/ProductList/types/product.types";

interface ProductSortingProps {
  sortBy: string;
  sortDirection: "asc" | "desc";
  totalCount: number;
  filters: {
      petType: PetType | null;
      productType: ProductType | null;
  };
  onSortChange: (sortBy: string) => void;
  onSortDirectionChange: (direction: "asc" | "desc") => void;
}

const ProductSorting: React.FC<ProductSortingProps> = ({
  sortBy,
  totalCount,
  filters,
  onSortChange,
}) => {
  const theme = useTheme();

    let title = "";
    if (filters.petType) {
        title += filters.petType + " 간식";
        if (filters.productType) {
            title += " / " + filters.productType;
        }
    } else {
        title = "전체 간식";
    }
  // const handleSortChange = (event: SelectChangeEvent) => {
  //   onSortChange(event.target.value);
  // };
  //
  // const handleDirectionToggle = () => {
  //   onSortDirectionChange(sortDirection === "asc" ? "desc" : "asc");
  // };
  //
  // const getDirectionLabel = () => {
  //   switch (sortBy) {
  //     case "price":
  //       return sortDirection === "asc" ? "낮은순" : "높은순";
  //     case "rating":
  //       return sortDirection === "asc" ? "낮은순" : "높은순";
  //     case "latest":
  //       return sortDirection === "asc" ? "오래된순" : "최신순";
  //     case "sales":
  //     default:
  //       return sortDirection === "asc" ? "적은순" : "많은순";
  //   }
  // };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", md: "center" },
        mb: 3,
        gap: 2,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontSize: "2rem",
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 0.5,
            fontFamily: theme.typography.fontFamily,
          }}
        >
            {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "0.875rem",
          }}
        >
          총 {totalCount.toLocaleString()}개 상품
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mt: { xs: 2, md: 0 },
        }}
      >
        {/* 정렬 기준 선택 */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                  value={sortBy}
                  onChange={e => onSortChange(e.target.value)}
              >
                  {SORT_OPTIONS.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                          {option.label}
                      </MenuItem>
                  ))}
              </Select>
          </FormControl>

        {/* 정렬 방향 토글 버튼 */}
        {/*<Box sx={{ display: "flex", alignItems: "center" }}>*/}
        {/*  <IconButton*/}
        {/*    onClick={handleDirectionToggle}*/}
        {/*    sx={{*/}
        {/*      borderRadius: 2,*/}
        {/*      border: `1px solid ${theme.palette.grey[200]}`,*/}
        {/*      backgroundColor: theme.palette.background.paper,*/}
        {/*      color: theme.palette.text.primary,*/}
        {/*      "&:hover": {*/}
        {/*        borderColor: theme.palette.primary.main,*/}
        {/*        backgroundColor: theme.palette.action.hover,*/}
        {/*      },*/}
        {/*      minWidth: 40,*/}
        {/*      height: 40,*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    {sortDirection === "desc" ? (*/}
        {/*      <ArrowDownIcon fontSize="small" />*/}
        {/*    ) : (*/}
        {/*      <ArrowUpIcon fontSize="small" />*/}
        {/*    )}*/}
        {/*  </IconButton>*/}
        {/*  <Typography*/}
        {/*    variant="body2"*/}
        {/*    sx={{*/}
        {/*      ml: 1,*/}
        {/*      color: theme.palette.text.secondary,*/}
        {/*      fontSize: "0.75rem",*/}
        {/*      minWidth: 60,*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    {getDirectionLabel()}*/}
        {/*  </Typography>*/}
        {/*</Box>*/}
      </Box>
    </Box>
  );
};

export { ProductSorting };
