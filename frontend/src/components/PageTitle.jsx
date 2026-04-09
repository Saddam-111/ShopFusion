import React, { useEffect } from 'react'

export function PageTitle({ title }) {
  useEffect( () => {
    document.title = title;
  }, [title])
}