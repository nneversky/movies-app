import { Row, Col } from 'antd'

import Item from '../item'
import './listItem.css'

const ListItem = ({ moves }) => {
  let arr = []
  if (moves !== null) {
    return (
      <section className="moves">
        {moves.map((value) => {
          const { poster_path, title, overview, release_date, vote_average, id } = value
          arr.push(
            <Col key={id}>
              <Item
                poster_path={poster_path}
                title={title}
                overview={overview}
                release_date={release_date}
                vote_average={vote_average}
              />
            </Col>
          )
          if (arr.length === 2) {
            const newArr = [...arr]
            arr = []
            return (
              <div key={id} className="moves__row">
                <Row gutter={30}>{newArr}</Row>
              </div>
            )
          }
        })}
      </section>
    )
  }
}

export default ListItem
