import Toaster from '@/components/toaster/toasts-container.js'
import useToast from '@/hooks/toaster.js'

const Example = () => {
  const [toasts, addToast, removeToast] = useToast()

  return (
    <div style={{padding: '24px'}}>
      <p>This is an example of using Toast</p>
      <button
        type='button'
        onClick={() => {
          addToast({title: 'Hello world', content: 'Du texte ou même un nœud', type: 'info', isClosable: true})
        }}
      >
        Add toast
      </button>

      <Toaster toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

export default Example
