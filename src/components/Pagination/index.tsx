import React, { useState } from 'react'
import { Container, PaginationButton, PaginationItem } from './styles'

interface PaginationProps {
  currentPage: number
  setCurrentPage: (page: number) => void
  pages: number[]
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, setCurrentPage, pages }) => {
  const pageNumberLimit = 10
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(pageNumberLimit)
  const [minPageNumberLimit, setMinPageNumberLImit] = useState(0)

  const handleNextButton = () => {
    setCurrentPage(currentPage + 1)
    if (currentPage + 1 > maxPageNumberLimit) {
      setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit)
      setMinPageNumberLImit(minPageNumberLimit + pageNumberLimit)
    }
  }

  const handlePreviousButton = () => {
    setCurrentPage(currentPage - 1)
    if ((currentPage - 1) % pageNumberLimit === 0) {
      setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit)
      setMinPageNumberLImit(minPageNumberLimit - pageNumberLimit)
    }
  }

  return (
    <Container>
      <PaginationButton>
        <PaginationItem onClick={handlePreviousButton} isDisabled={currentPage <= 1}>Previous</PaginationItem>
        {pages.map((page) => (
          page < maxPageNumberLimit + 1 && page > minPageNumberLimit && (
            <PaginationItem
              key={page}
              isSelected={page === currentPage}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </PaginationItem>
          )
        ))}
        <PaginationItem onClick={handleNextButton} isDisabled={currentPage === pages.length || pages.length === 0}>
          Next
        </PaginationItem>
      </PaginationButton>
    </Container>
  )
}

export default Pagination
