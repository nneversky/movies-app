import { Row, Col, Image } from 'antd'

import Item from '../item'
import './listItem.css'
import nothingFound from './pictures/nothing-found.png'

const ListItem = ({ text, movies }) => {
  let arr = []
  if (movies !== null && text !== '') {
    if (Object.keys(movies).length === 0)
      return <Image style={{ width: '600px', height: 'auto', marginTop: '30px' }} preview={false} src={nothingFound} />
    return (
      <section className="movies">
        {movies.map((value) => {
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
              <div key={id} className="movies-row">
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
