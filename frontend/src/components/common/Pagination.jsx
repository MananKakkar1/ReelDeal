import React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const PageButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)"
      : "rgba(15, 23, 42, 0.5)"};
  color: ${(props) => (props.$active ? "white" : "#94a3b8")};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: ${(props) => (props.$active ? "600" : "500")};
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${(props) =>
      props.$active
        ? "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)"
        : "rgba(6, 182, 212, 0.1)"};
    border-color: ${(props) =>
      props.$active ? "transparent" : "rgba(6, 182, 212, 0.3)"};
    color: ${(props) => (props.$active ? "white" : "#06b6d4")};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.15);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media (max-width: 640px) {
    min-width: 2.25rem;
    height: 2.25rem;
    padding: 0 0.5rem;
    font-size: 0.8rem;
  }
`;

const NavigationButton = styled(PageButton)`
  background: rgba(15, 23, 42, 0.5);
  border-color: rgba(148, 163, 184, 0.2);
  color: #94a3b8;

  &:hover:not(:disabled) {
    background: rgba(6, 182, 212, 0.1);
    border-color: rgba(6, 182, 212, 0.3);
    color: #06b6d4;
  }
`;

const Ellipsis = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  color: #64748b;
  font-weight: 500;

  @media (max-width: 640px) {
    min-width: 2.25rem;
    height: 2.25rem;
  }
`;

const PageInfo = styled.div`
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 0 1rem;
  text-align: center;

  @media (max-width: 640px) {
    margin: 0 0.5rem;
    font-size: 0.8rem;
  }
`;

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalResults = 0,
  itemsPerPage = 20,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalResults);

  return (
    <PaginationContainer>
      <PageInfo>
        Showing {startItem}-{endItem} of {totalResults} results
      </PageInfo>

      <NavigationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft size={16} />
      </NavigationButton>

      {getVisiblePages().map((page, index) => {
        if (page === "...") {
          return (
            <Ellipsis key={`ellipsis-${index}`}>
              <MoreHorizontal size={16} />
            </Ellipsis>
          );
        }

        return (
          <PageButton
            key={page}
            $active={currentPage === page}
            onClick={() => onPageChange(page)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {page}
          </PageButton>
        );
      })}

      <NavigationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronRight size={16} />
      </NavigationButton>
    </PaginationContainer>
  );
};

export default Pagination;
