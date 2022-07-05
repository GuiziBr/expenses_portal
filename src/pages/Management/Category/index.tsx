import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { AxiosRequestConfig } from 'axios'
import React, { FocusEvent, useCallback, useEffect, useRef, useState } from 'react'
import { AiFillEdit, AiOutlineSave } from 'react-icons/ai'
import { FaTrashAlt } from 'react-icons/fa'
import { GiConfirmed } from 'react-icons/gi'
import { MdTitle } from 'react-icons/md'
import * as Yup from 'yup'
import Button from '../../../components/Button'
import Header from '../../../components/Header'
import Input from '../../../components/Input'
import constants from '../../../constants/constants'
import errors from '../../../constants/errors'
import { useToast } from '../../../hooks/toast'
import { newCategorySchema } from '../../../schemas'
import api from '../../../services/apiClient'
import formatDate from '../../../utils/formatDate'
import getValidationErrors from '../../../utils/getValidationErrors'
import { Container, FormContainer, PageTitle, TableContainer } from './styles'

interface ICategory {
  id: string
  description: string
  createdAt: string
  updatedAt: string
  disabled: boolean
  editMode: 'edit' | 'save'
  deleteMode: 'delete' | 'confirm'
  className: string | null
}

interface IPayload {
  description: string
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([])
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const [isDeskTopScreen] = useState<boolean>(window.innerWidth > 720)

  const loadCategories = useCallback(async () => {
    const token = sessionStorage.getItem(constants.sessionStorage.token)
    const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
    const { data } = await api.get('/categories', config)
    const categoriesList: ICategory[] = data
      .sort((a: { description: string }, b: { description: string }) => ((a.description > b.description) ? 1 : -1))
      .map((category: any) => ({
        id: category.id,
        description: category.description,
        createdAt: formatDate(category.created_at),
        updatedAt: formatDate(category.updated_at),
        disabled: true,
        editMode: 'edit',
        deleteMode: 'delete',
      }))
    setCategories(categoriesList)
  }, [])

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
    setCategories(categories.map((category) => ({
      ...category,
      disabled: category.id !== categoryId && category.editMode === 'edit',
      editMode: category.id === categoryId ? 'save' : category.editMode,
      className: category.id === categoryId ? 'editable' : null,
    })))
  }

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.map((category) => ({
      ...category,
      disabled: category.id !== categoryId && category.deleteMode === 'delete',
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
    setCategories(categories.map((category) => ({
      ...category,
      description: category.id === categoryId ? input.value : category.description,
      disabled: category.id === categoryId,
      editMode: category.id === categoryId ? 'edit' : category.editMode,
      className: category.id === categoryId ? 'null' : category.className,
    })))
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
  }, [loadCategories])

  return (
    <>
      <Header current="Management" />
      <PageTitle>Category Management</PageTitle>
      <Container>
        <FormContainer>
          <Form ref={formRef} onSubmit={handleNewCategory}>
            <Input icon={MdTitle} name="description" placeholder="Category" cleanError={() => formRef.current?.setErrors({})} />
            <Button type="submit">Save</Button>
          </Form>
        </FormContainer>
        {categories.length > 0 && (
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
        )}
      </Container>
    </>
  )
}

export default CategoryManagement
