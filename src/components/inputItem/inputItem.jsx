import { Input } from 'antd'
import './inputItem.css'

const InputItem = ({ text, handleChange }) => {
  return (
    <Input
      onChange={(e) => handleChange(e.target.value)}
      value={text}
      style={{ height: '40px'}}
      placeholder="Type to search..."
    />
  )
}

export default InputItem
