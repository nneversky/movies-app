import { Input } from 'antd'
import './inputItem.css'

const InputItem = ({ stateText, handleText }) => {
  return (
    <div className="input">
      <Input
        onChange={(e) => handleText(e.target.value)}
        value={stateText}
        style={{ height: '40px' }}
        placeholder="Type to search..."
      />
    </div>
  )
}

export default InputItem
