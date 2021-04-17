import React from 'react'
import { Container, PaginationButton, PaginationItem } from './styles'

interface PaginationProps {
  currentPage: number
  setCurrentPage: (page: number) => void
  pages: number[]
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, setCurrentPage, pages }) => (
  <Container>
    <PaginationButton>
      <PaginationItem onClick={() => setCurrentPage(currentPage - 1)} isDisabled={currentPage === 1}>Previous</PaginationItem>
      {pages.map((page) => (
        <PaginationItem key={page} isSelected={page === currentPage} onClick={() => setCurrentPage(page)}>{page}</PaginationItem>
      ))}
      <PaginationItem onClick={() => setCurrentPage(currentPage + 1)} isDisabled={currentPage === pages.length}>Next</PaginationItem>
    </PaginationButton>
  </Container>
)

export default Pagination
