import React, { useEffect } from 'react'

export function PageTitle() {
  useEffect( () => {
    document.title = title;
  },[title])
}