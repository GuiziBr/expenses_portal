import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { AxiosRequestConfig } from 'axios'
import React, { FocusEvent, useEffect, useRef, useState } from 'react'
import { AiFillEdit, AiOutlineSave } from 'react-icons/ai'
import { FaTrashAlt } from 'react-icons/fa'
import { GiConfirmed } from 'react-icons/gi'
import { MdTitle } from 'react-icons/md'
import * as Yup from 'yup'
import Button from '../../../components/Button'
import Header from '../../../components/Header'
import Input from '../../../components/Input'
import Pagination from '../../../components/Pagination'
import constants from '../../../constants/constants'
import errors from '../../../constants/errors'
import { ICategory, IPayload } from '../../../domains/management'
import { useToast } from '../../../hooks/toast'
import { newCategorySchema } from '../../../schemas'
import api from '../../../services/apiClient'
import formatDate from '../../../utils/formatDate'
import getValidationErrors from '../../../utils/getValidationErrors'
import { Container, FormContainer, PageTitle, TableContainer } from './styles'

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([])
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const [isDeskTopScreen] = useState<boolean>(window.innerWidth > 720)
  const [currentPage, setCurrentPage] = useState<number | null>(null)
  const [pages, setPages] = useState([])

  const currentPageLimit: number = isDeskTopScreen ? constants.desktopPageLimit : constants.mobilePageLimit

  const updatePageNumbers = (totalCount: number): void => {
    const totalPages: Number = Math.ceil(totalCount / currentPageLimit)
    const arrayPages = []
    for (let i = 1; i <= totalPages; i++) {
      arrayPages.push(i)
    }
    setPages(arrayPages)
  }

  const getOffset = (): number => ((currentPage || 1) * currentPageLimit) - currentPageLimit

  const loadCategories = async () => {
    const token = sessionStorage.getItem(constants.sessionStorage.token)
    const config: AxiosRequestConfig = {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        offset: getOffset(),
        limit: currentPageLimit,
      },
    }
    const { data, headers } = await api.get('/categories', config)
    const categoriesList: ICategory[] = data
      .sort((a: { description: string }, b: { description: string }) => ((a.description > b.description) ? 1 : -1))
      .map((category: any) => ({
        id: category.id,
        description: category.description,
        createdAt: formatDate(category.created_at),
        ...category.updatedAt && { updatedAt: formatDate(category.updated_at) },
        disabled: true,
        editMode: 'edit',
        deleteMode: 'delete',
      }))
    updatePageNumbers(headers[constants.headers.totalCount])
    setCategories(categoriesList)
  }

  const handleNewCategory = async (payload: IPayload) => {
    try {
      formRef.current?.setErrors({})
      await newCategorySchema.validate(payload, { abortEarly: false })
      const token = sessionStorage.getItem(constants.sessionStorage.token)
      const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
      await api.post('/categories', payload, config)
      addToast({
        type: 'success',
        title: 'Create Category',
        description: 'Category created successfully',
      })
      formRef.current?.reset()
      await loadCategories()
      setCurrentPage(1)
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const error = getValidationErrors(err)
        formRef.current?.setErrors(error)
        return
      }
      addToast({
        type: 'error',
        title: 'Create Category error',
        description: err.response.data.message === errors.alreadyExistingCategory
          ? 'Category already exists'
          : 'Error on creating category',
      })
    }
  }

  const handleConfirmDelete = async (categoryId: string) => {
    try {
      const token = sessionStorage.getItem(constants.sessionStorage.token)
      const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
      await api.delete(`/categories/${categoryId}`, config)
      addToast({
        type: 'success',
        title: 'Delete Category',
        description: 'Category deleted successfully',
      })
      await loadCategories()
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Delete Category error',
        description: 'Error on deleting category',
      })
    }
  }

  const handleEditCategory = (categoryId: string) => {
    setCategories(categories.map((category) => {
      const isSameCategory = category.id === categoryId
      return {
        ...category,
        disabled: !isSameCategory && category.editMode === 'edit',
        editMode: isSameCategory ? 'save' : category.editMode,
        className: isSameCategory || category.className === 'editable' ? 'editable' : null,
      }
    }))
  }

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.map((category) => ({
      ...category,
      deleteMode: category.id === categoryId ? 'confirm' : category.deleteMode,
    })))
  }

  const handleOnFocus = (target: HTMLInputElement) => {
    target.className = 'editable'
  }

  const handleUpdateCategory = async (categoryId: string) => {
    const input: HTMLInputElement = document.querySelector(`input#input-${categoryId}`)
    const selectedCategory = categories.find((category) => category.id === categoryId)
    if (input.value && input.value !== selectedCategory?.description) {
      const payload = { description: input.value }
      const token = sessionStorage.getItem(constants.sessionStorage.token)
      const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
      try {
        await api.patch(`/categories/${categoryId}`, payload, config)
        addToast({
          type: 'success',
          title: 'Update Category',
          description: 'Category updated successfully',
        })
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Create Category error',
          description: err.response.data.message === errors.alreadyExitingUpdateCategory
            ? errors.alreadyExitingUpdateCategory
            : 'Error on creating category',
        })
        input.value = selectedCategory.description
      }
    }
    setCategories(categories.map((category) => (
      category.id === categoryId
        ? {
          ...category,
          description: input.value,
          disabled: true,
          editMode: 'edit',
          className: null,
          deleteMode: 'delete',
        }
        : category
    )))
  }

  const handleOnBlur = (event: FocusEvent<HTMLInputElement>, categoryId: string) => {
    const input = categories.find((category) => category.id === categoryId)
    if (input) {
      event.target.className = null
      if (event.target.value === '') event.target.value = input.description
    }
  }

  useEffect(() => {
    async function loadDashboard(): Promise<void> {
      await loadCategories()
    }
    loadDashboard()
  }, [])

  useEffect(() => {
    async function refreshCategories(): Promise<void> {
      if (currentPage) await loadCategories()
    }
    refreshCategories()
  }, [currentPage])

  return (
    <>
      <Header current="Management" />
      <PageTitle>Category Management</PageTitle>
      <Container>
        <FormContainer>
          <Form ref={formRef} onSubmit={handleNewCategory}>
            <Input
              icon={MdTitle}
              name="description"
              placeholder="Category"
              cleanError={() => formRef.current?.setErrors({})}
              maxLength={20}
            />
            <Button type="submit">Save</Button>
          </Form>
        </FormContainer>
        {categories.length > 0 && (
          <>
            <TableContainer>
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Created</th>
                    {isDeskTopScreen && <th>Updated</th>}
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} id={category.id}>
                      <td className="description" onDoubleClick={() => handleEditCategory(category.id)}>
                        <input
                          name="category-description"
                          type="text"
                          defaultValue={category.description}
                          disabled={category.disabled}
                          onBlur={(event) => handleOnBlur(event, category.id)}
                          id={`input-${category.id}`}
                          className={category.className}
                          onFocus={(event) => handleOnFocus(event.target)}
                        />
                      </td>
                      <td className="date-created">{category.createdAt}</td>
                      {isDeskTopScreen && <td className="date-updated">{category.updatedAt}</td>}
                      <td>
                        <Button
                          type="button"
                          onClick={() => (category.editMode === 'edit'
                            ? handleEditCategory(category.id)
                            : handleUpdateCategory(category.id))}
                        >
                          { category.editMode === 'edit' ? <AiFillEdit color="#5636D3" /> : <AiOutlineSave color="#5636D3" /> }
                        </Button>
                      </td>
                      <td>
                        <Button
                          type="button"
                          onClick={() => (category.deleteMode === 'delete'
                            ? handleDeleteCategory(category.id)
                            : handleConfirmDelete(category.id))}
                        >
                          {category.deleteMode === 'delete' ? <FaTrashAlt color="#FF872C" /> : <GiConfirmed color="#FF872C" />}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableContainer>
            <Pagination currentPage={currentPage || 1} setCurrentPage={setCurrentPage} pages={pages} />
          </>
        )}
      </Container>
    </>
  )
}

export default CategoryManagement
