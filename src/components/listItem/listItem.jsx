import { Row, Col, Image } from 'antd'

import Item from '../item'

import './listItem.css'
import nothingFound from './pictures/nothing-found.png'

const ListItem = ({ text = '_', movies, handleAddRating, stateTabs = 'search', ratedMovies = null }) => {
  let arr = []
  const arrIdRatedMovies = []
  if (ratedMovies) {
    ratedMovies.map((value) => {
      const { id, rating } = value
      arrIdRatedMovies.push({ id: id, rating: rating })
    })
  }

  let counter
  if (movies !== null && text !== '') {
    counter = movies.length
    if (Object.keys(movies).length === 0)
      return (
        <div className="nothing-image">
          <Image preview={false} src={nothingFound} />
        </div>
      )
    return (
      <section className="movies">
        {movies.map((value) => {
          let { poster_path, title, overview, release_date, vote_average, id, genre_ids = null, rating = 0 } = value
          if (ratedMovies) {
            arrIdRatedMovies.forEach((value) => {
              const { id: idRate, rating: ratingRate } = value
              if (id === idRate) rating = ratingRate
            })
          }
          if (window.matchMedia('(max-width: 992px)').matches) {
            return (
              <div key={id} className="movies-row">
                <Row gutter={30}>
                  <Col key={id}>
                    <Item
                      poster_path={poster_path}
                      title={title}
                      overview={overview}
                      release_date={release_date}
                      vote_average={vote_average}
                      genre_ids={genre_ids}
                      id={id}
                      rating={rating}
                      handleAddRating={handleAddRating}
                      stateTabs={stateTabs}
                    />
                  </Col>
                </Row>
              </div>
            )
          }

          arr.push(
            <Col key={id}>
              <Item
                poster_path={poster_path}
                title={title}
                overview={overview}
                release_date={release_date}
                vote_average={vote_average}
                genre_ids={genre_ids}
                id={id}
                rating={rating}
                handleAddRating={handleAddRating}
                stateTabs={stateTabs}
              />
            </Col>
          )
          if (arr.length === 2 || counter === 1) {
            counter -= 2
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
