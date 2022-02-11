import React from 'react'
import { Container, PaginationButton, PaginationItem } from './styles'

interface PaginationProps {
  currentPage: number
  setCurrentPage: (page: number) => void
  pages: number[]
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, setCurrentPage, pages }) => (
  <Container className="pagination">
    <PaginationButton className="pagination-button">
      <PaginationItem onClick={() => setCurrentPage(currentPage - 1)} isDisabled={currentPage <= 1}>Previous</PaginationItem>
      {pages.map((page) => (
        <PaginationItem
          key={page}
          isSelected={page === currentPage}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </PaginationItem>
      ))}
      <PaginationItem
        onClick={() => setCurrentPage(currentPage + 1)}
        isDisabled={currentPage === pages.length || pages.length === 0}
      >
        Next
      </PaginationItem>
    </PaginationButton>
  </Container>
)

export default Pagination
