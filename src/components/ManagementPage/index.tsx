import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { AxiosRequestConfig } from 'axios'
import React, { FocusEvent, useEffect, useRef, useState } from 'react'
import { AiFillEdit, AiOutlineSave } from 'react-icons/ai'
import { BsCreditCard } from 'react-icons/bs'
import { FaTrashAlt } from 'react-icons/fa'
import { GiConfirmed } from 'react-icons/gi'
import { MdTitle } from 'react-icons/md'
import * as Yup from 'yup'
import constants from '../../constants/constants'
import errors from '../../constants/errors'
import { IEntity, IPayload } from '../../domains/management'
import { useToast } from '../../hooks/toast'
import { newEntitySchema } from '../../schemas'
import api from '../../services/apiClient'
import formatDate from '../../utils/formatDate'
import getValidationErrors from '../../utils/getValidationErrors'
import Button from '../Button'
import CheckboxInput from '../Checkbox'
import Header from '../Header'
import Input from '../Input'
import Pagination from '../Pagination'
import { Container, FormContainer, PageTitle, TableContainer } from './styles'

interface PageProps {
  pageLabel: string
  inputName: string
  hasStatement?: boolean
  entityPath: string
}

const ManagementPage: React.FC<PageProps> = ({ pageLabel, inputName, hasStatement, entityPath }) => {
  const { addToast } = useToast()
  const formRef = useRef<FormHandles>(null)
  const [entities, setEntities] = useState<IEntity[]>([])
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

  const sortEntities = (entityA: IEntity, entityB: IEntity): number => {
    const param = entityA.name || entityA.description
    return entityA[param] - entityB[param]
  }

  const loadEntities = async (): Promise<void> => {
    const token = sessionStorage.getItem(constants.sessionStorage.token)
    const config: AxiosRequestConfig = {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        offset: getOffset(),
        limit: currentPageLimit,
      },
    }
    const { data, headers } = await api.get(`/${entityPath}`, config)
    const entitiesList: IEntity[] = data
      .sort(sortEntities)
      .map((entity: any) => ({
        id: entity.id,
        ...entity.name ? { name: entity.name } : { description: entity.description },
        createdAt: formatDate(entity.created_at),
        ...entity.updated_at && { updatedAt: formatDate(entity.updated_at) },
        disabled: true,
        editMode: 'edit',
        deleteMode: 'delete',
        ...entity.isDeskTopScreen,
        ...entity.hasStatement && { hasStatement: entity.hasStatement },
      }))
    updatePageNumbers(headers[constants.headers.totalCount])
    setEntities(entitiesList)
  }

  const handleNewEntity = async (data: IPayload): Promise<void> => {
    try {
      formRef.current?.setErrors({})
      await newEntitySchema[entityPath].validate(data, { abortEarly: false })
      const token = sessionStorage.getItem(constants.sessionStorage.token)
      const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
      const payload = {
        ...data.name ? { name: data.name } : { description: data.description },
        ...data.hasStatement?.length && { hasStatement: true },
      }
      await api.post(`/${entityPath}`, payload, config)
      addToast({
        type: 'success',
        title: `Create ${pageLabel.toLowerCase()}`,
        description: `${pageLabel} created successfully`,
      })
      formRef.current?.reset()
      await loadEntities()
      setCurrentPage(1)
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const error = getValidationErrors(err)
        formRef.current?.setErrors(error)
        return
      }
      addToast({
        type: 'error',
        title: `Create ${pageLabel.toLowerCase()} error`,
        description: err.response.data.message === errors.alreadyExistingEntity[entityPath]
          ? `${pageLabel} already exists`
          : `Error on creating ${pageLabel.toLowerCase()}`,
      })
    }
  }

  const handleConfirmDelete = async (entityId: string): Promise<void> => {
    try {
      const token = sessionStorage.getItem(constants.sessionStorage.token)
      const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
      await api.delete(`/${entityPath}/${entityId}`, config)
      addToast({
        type: 'success',
        title: `Delete ${pageLabel}`,
        description: `${pageLabel} deleted successfully`,
      })
      await loadEntities()
    } catch (err) {
      addToast({
        type: 'error',
        title: `Delete ${pageLabel.toLowerCase()} error`,
        description: `Error on deleting ${pageLabel.toLowerCase()}`,
      })
    }
  }

  const handleEditEntity = (entityId: string): void => {
    setEntities(entities.map((entity) => {
      const isSameEntity = entity.id === entityId
      return {
        ...entity,
        disabled: !isSameEntity && entity.editMode === 'edit',
        editMode: isSameEntity ? 'save' : entity.editMode,
        className: isSameEntity || entity.className === 'editable' ? 'editable' : null,
      }
    }))
  }

  const handleDeleteEntity = (entityId: string): void => {
    setEntities(entities.map((entity) => ({
      ...entity,
      deleteMode: entity.id === entityId ? 'confirm' : entity.deleteMode,
    })))
  }

  const handleOnFocus = (target: HTMLInputElement): void => {
    target.className = 'editable'
  }

  const handleUpdateEntity = async (entityId: string): Promise<void> => {
    const input: HTMLInputElement = document.querySelector(`input#input-${entityId}`)
    const checkbox: HTMLInputElement = document.querySelector(`input#checkbox-${entityId}`)
    const selectedEntity = entities.find((entity) => entity.id === entityId)
    if (input?.value !== (selectedEntity?.name || selectedEntity?.description)
      || (checkbox && checkbox?.checked !== !!selectedEntity.hasStatement)
    ) {
      const payload = {
        ...selectedEntity.name ? { name: input.value } : { description: input.value },
        ...checkbox && { hasStatement: checkbox?.checked },
      }
      const token = sessionStorage.getItem(constants.sessionStorage.token)
      const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }}
      try {
        await api.patch(`/${entityPath}/${entityId}`, payload, config)
        addToast({
          type: 'success',
          title: `Update ${pageLabel}`,
          description: `${pageLabel} updated successfully`,
        })
      } catch (err) {
        addToast({
          type: 'error',
          title: `Update ${pageLabel.toLowerCase()} error`,
          description: err.response.data.message === errors.alreadyExistingUpdateEntity[entityPath]
            ? errors.alreadyExistingUpdateEntity[entityPath]
            : `Error on updating ${pageLabel.toLowerCase()}`,
        })
        input.value = selectedEntity.name
      }
    }
    setEntities(entities.map((entity) => (
      entity.id === entityId
        ? {
          ...entity,
          ...entity.name ? { name: input.value } : { description: input.value },
          disabled: true,
          editMode: 'edit',
          className: 'null',
          deleteMode: 'delete',
          hasStatement: checkbox?.checked,
        }
        : entity
    )))
  }

  const handleOnChangeInput = (fieldName: string): void => {
    if (formRef.current?.getFieldError(fieldName)) {
      formRef.current?.setFieldError(fieldName, '')
    }
  }

  const handleOnBlur = (event: FocusEvent<HTMLInputElement>, entityId: string): void => {
    const input = entities.find((entity) => entity.id === entityId)
    if (input) {
      event.target.className = null
      if (event.target.value === '') event.target.value = input.name
    }
  }

  useEffect(() => {
    async function loadDashboard(): Promise<void> {
      await loadEntities()
    }
    loadDashboard()
  }, [])

  useEffect(() => {
    async function refreshEntities(): Promise<void> {
      if (currentPage) await loadEntities()
    }
    refreshEntities()
  }, [currentPage])

  return (
    <>
      <Header current="Management" />
      <PageTitle>
        {pageLabel}
        {' '}
        Management
      </PageTitle>
      <Container>
        <FormContainer>
          <Form ref={formRef} onSubmit={handleNewEntity}>
            <Input
              icon={MdTitle}
              name={inputName}
              placeholder={pageLabel}
              cleanError={() => formRef.current?.setErrors({})}
              maxLength={20}
              onChange={() => handleOnChangeInput(pageLabel)}
            />
            {hasStatement && (
              <CheckboxInput
                icon={BsCreditCard}
                name="hasStatement"
                options={[{ id: 'hasStatement', value: 'hasStatement', label: 'Statement' }]}
                defaultOnChange={() => {}}
              />
            )}
            <Button type="submit">Save</Button>
          </Form>
        </FormContainer>
        {entities.length > 0 && (
          <>
            <TableContainer>
              <table>
                <thead>
                  <tr>
                    <th>{pageLabel}</th>
                    {hasStatement && (
                      <th>
                        {isDeskTopScreen ? 'Statement' : <BsCreditCard />}
                      </th>
                    )}
                    <th>Created</th>
                    {isDeskTopScreen && <th>Updated</th>}
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {entities.map((entity) => (
                    <tr key={entity.id} id={entity.id}>
                      <td onDoubleClick={() => handleEditEntity(entity.id)}>
                        <input
                          id={`input-${entity.id}`}
                          name={`${pageLabel}-${inputName}`}
                          type="text"
                          defaultValue={entity.name || entity.description}
                          disabled={entity.disabled}
                          onBlur={(event) => handleOnBlur(event, entity.id)}
                          onFocus={(event) => handleOnFocus(event.target)}
                          className={entity.className}
                        />
                      </td>
                      {hasStatement && (
                        <td>
                          <input
                            className="statement"
                            type="checkbox"
                            id={`checkbox-${entity.id}`}
                            value="hasStatement"
                            disabled={entity.disabled}
                            defaultChecked={entity.hasStatement}
                          />
                        </td>
                      )}
                      {(isDeskTopScreen || !hasStatement) && <td className="date-created">{entity.createdAt}</td>}
                      {(isDeskTopScreen || !hasStatement) && <td className="date-updated">{entity.updatedAt}</td>}
                      <td>
                        <Button
                          type="button"
                          onClick={() => (entity.editMode === 'edit'
                            ? handleEditEntity(entity.id)
                            : handleUpdateEntity(entity.id)
                          )}
                        >
                          {entity.editMode === 'edit' ? <AiFillEdit color="#5636D3" /> : <AiOutlineSave color="#5636D3" />}
                        </Button>
                      </td>
                      <td>
                        <Button
                          type="button"
                          onClick={() => (entity.deleteMode === 'delete'
                            ? handleDeleteEntity(entity.id)
                            : handleConfirmDelete(entity.id))}
                        >
                          {entity.deleteMode === 'delete' ? <FaTrashAlt color="#FF872C" /> : <GiConfirmed color="#FF872C" />}
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

export default ManagementPage
