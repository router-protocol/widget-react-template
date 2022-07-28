import { useEffect, useState } from 'react'

export default function useTabActive(){

  const [isTabActive, setIsTabActive] = useState(true)
  let timerOfInactivity:any
  const onFocus = () =>{
    console.log('Tab is Active',document.hasFocus())
    clearTimeout(timerOfInactivity)
    setIsTabActive(true)
  }

  const onBlur = () =>{
    console.log('Tab is Switched',!document.hasFocus())
    timerOfInactivity = setTimeout(() =>{
      setIsTabActive(false)
    },600000)
  }

  useEffect(() => {
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);
    // Specify how to clean up after this effect:
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, [])

  return isTabActive
}
