import { Alert, Image } from 'antd'
import './errorItem.css'

const httpCat = (codeError) => {
  return `https://http.cat/${codeError}`
}

const ErrorItem = ({ error }) => {
  const { errorCode } = error

  return (
    <div className="error-item">
      <Alert
        style={{ marginBottom: '5px' }}
        message={`Error ${errorCode.message}`}
        description="We are already trying to fix it!"
        showIcon
        type="error"
      />
      <Image style={{ borderRadius: '1%' }} preview={false} src={httpCat(errorCode.message)} />
    </div>
  )
}

export default ErrorItem
