import { useEffect } from 'react'
import { useLocation } from 'wouter'
import root from 'react-shadow';
import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css?inline';


export default function AdminLogin() {
  const [, setLocation] = useLocation()

  useEffect(() => {
    // Redireciona automaticamente para a área do funcionário
    setLocation('/admin')
  }, [setLocation])

  return (
    <root.div>
    <style>{bootstrapCss}</style>    
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Redirecionando para a área do funcionário...</p>
      </div>
    </root.div>
  )
}



