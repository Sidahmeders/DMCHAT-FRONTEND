import { format, parseISO } from 'date-fns'
import { Trash2, Edit3 } from 'react-feather'

import { setPatient } from '@utils'

export const patientColumns = ({ onEditModalOpen, onDeleteModalOpen }) => [
  {
    name: 'Nom',
    selector: ({ fullName }) => fullName,
    sortable: true,
    minWidth: '35%',
  },
  {
    name: 'Téléphone',
    selector: ({ phoneNumber }) => phoneNumber || '###',
    minWidth: '250px',
  },
  {
    name: 'Date de création',
    selector: ({ createdAt }) => format(parseISO(createdAt), 'yyyy-MM-dd'),
    sortable: true,
    minWidth: '120px',
  },
  {
    name: 'Actions',
    selector: (row) => {
      const onEditClick = () => {
        setPatient(row)
        onEditModalOpen()
      }

      const onDeleteClick = () => {
        setPatient(row)
        onDeleteModalOpen()
      }

      return (
        <div className="actions-cell">
          <Edit3 onClick={onEditClick} width={20} color="#474aff" />
          <Trash2 onClick={onDeleteClick} width={20} color="#d00" />
        </div>
      )
    },
    width: '120px',
  },
]
