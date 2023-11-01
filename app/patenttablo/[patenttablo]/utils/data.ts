import React from 'react'

const columns = [
  { name: 'PATENT', uid: 'patent_title', sortable: true },
  { name: 'SINIFLAR', uid: 'class_no', sortable: true },
  { name: 'BAŞVURU TARİHİ', uid: 'basvuru_tarihi', sortable: true },
  { name: 'DURUM', uid: 'status', sortable: true },
  { name: 'AÇIKLAMA', uid: 'patent_durumu', sortable: true },
  { name: 'İŞLEVLER', uid: 'actions' },
]

const statusOptions = [
  { name: 'Tescil', uid: 'tescil' },
  { name: 'İptal', uid: 'iptal' },
  { name: 'Başvuru', uid: 'basvuru' },
]

export { columns, statusOptions }
