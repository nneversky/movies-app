import { Alert, Image } from 'antd'

const ErrorItem = ({ error }) => {
  const { errorCode } = error
  return <Alert message={errorCode.message} showIcon description={errorCode.stack} type="error"></Alert>
}

export default ErrorItem
