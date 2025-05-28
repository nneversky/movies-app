import './item.css'
import { Image, Typography, Layout, Spin, Rate } from 'antd'
import { parseISO, format } from 'date-fns'
import React from 'react'

import MoveApp from '../../services'
import { Consumer } from '../movesApiContext'

import undefinedImg from './pictures/undefined-img.jpeg'

const Item = ({
  poster_path,
  title,
  overview,
  release_date,
  vote_average,
  genre_ids,
  id,
  rating,
  handleAddRating,
  stateTabs,
}) => {
  const { Title, Text } = Typography
  const { Header, Content, Sider, Footer } = Layout
  const moveData = new MoveApp()

  const DateTime = () => {
    try {
      return <div className="header_data">{format(parseISO(release_date), 'MMMM d, y')}</div>
    } catch (e) {
      return <div className="header_data">Unknown date</div>
    }
  }

  const GetGenreList = () => {
    return (
      <React.Fragment>
        <Consumer>
          {(genreList) => {
            if (genre_ids !== null && genreList !== null) {
              if (genre_ids.length === 0) return <Text style={genreStyles}>Unknown genre</Text>
              const newIds = genre_ids.length > 3 ? genre_ids.slice(0, 3) : genre_ids

              return newIds.map((idGenre) => {
                return genreList.map((idListGenre) => {
                  const { id, name } = idListGenre
                  if (id === idGenre) {
                    return (
                      <Text key={new Date().toISOString()} style={genreStyles}>
                        {name}
                      </Text>
                    )
                  }
                })
              })
            }
          }}
        </Consumer>
      </React.Fragment>
    )
  }

  const GetSliceOverview = ({ overview, maxLength }) => {
    if (overview.length === 0) return 'Unknown description'

    if (maxLength > overview.length) return overview

    overview = overview.slice(0, maxLength)
    for (let i = maxLength; i !== 0; i--) {
      if (overview.split('').at(i) !== ' ') continue
      return `${overview.slice(0, i)}...`
    }
  }

  const LoadingImage = () => {
    const getImage = (path) => {
      return (
        <div className="item__image">
          <Image
            placeholder={
              <div className="loading-image">
                <Spin
                  style={window.matchMedia('(min-width: 993px)').matches ? { transform: 'scale(2)' } : {}}
                  size="big"
                />
              </div>
            }
            style={
              window.matchMedia('(min-width: 993px)').matches
                ? { height: '279px', width: '200px' }
                : { height: '91px', width: '60px' }
            }
            src={path}
          />
        </div>
      )
    }

    if (poster_path !== null) {
      return getImage(moveData.searchImg(poster_path))
    } else {
      return getImage(undefinedImg)
    }
  }

  const voteAverageClassName = (num) => {
    num = Number(num)
    const className = 'vote-average'

    switch (true) {
      case num >= 0 && num < 3:
        return `${className} color--0-3`
      case num >= 3 && num < 5:
        return `${className} color--3-5`
      case num >= 5 && num < 7:
        return `${className} color--3-5`
      case num > 7:
        return `${className} color--7`
      default:
        return null
    }
  }

  const genreStyles = {
    color: '#605d5d',
    fontFamily: 'Inter, sans-serif',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '22px',
    letterSpacing: '0%',
    border: '1px #D9D9D9 solid',
    borderRadius: '2px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px',
  }

  const textStyles = {
    color: '#000000',
    fontFamily: 'Inter UI, sans-serif',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '22px',
    letterSpacing: '0%',
  }

  const titleStyles = {
    color: '#000000',
    fontFamily: 'Inter UI, sans-serif',
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '28px',
    letterSpacing: '0%',
  }

  if (window.matchMedia('(min-width: 992px)').matches) {
    return (
      <section className="item">
        <Layout>
          <Sider
            width={window.matchMedia('(min-width: 992px)').matches ? 200 : 60}
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <LoadingImage />
          </Sider>

          <Layout>
            <Header style={{ backgroundColor: '#FFFFFF' }}>
              <div className="header">
                <Title style={titleStyles} level={5}>
                  <div
                    title={title}
                    style={{ overflow: 'hidden', width: '190px', textOverflow: 'ellipsis' }}
                    className="header__title"
                  >
                    <span>{title}</span>
                  </div>
                </Title>
                <Text
                  style={{
                    color: '#827E7E',
                    fontFamily: 'Inter UI, sans-serif',
                    fontWeight: '400',
                    fontSize: '12px',
                    lineHeight: '22px',
                    letterSpacing: '0%',
                  }}
                >
                  <DateTime />
                </Text>
              </div>
              <div className={voteAverageClassName(vote_average)}>
                <Text style={textStyles}>{vote_average.toFixed(1)}</Text>
              </div>
            </Header>

            <Content style={{ backgroundColor: '#FFFFFF' }}>
              <section className="content">
                <div className="content__genre">
                  <GetGenreList />
                </div>
                <div className="content__text">
                  <Text style={textStyles}>
                    <GetSliceOverview overview={overview} maxLength={170} />
                  </Text>
                </div>
              </section>
            </Content>
            <Footer style={{ backgroundColor: '#FFFFFF' }}>
              <div className="footer__rate">
                <Rate
                  style={{ transform: 'translateX(-35px)' }}
                  onChange={(e) => handleAddRating(id, e)}
                  defaultValue={rating}
                  disabled={stateTabs === 'rated' ? true : false}
                />
              </div>
            </Footer>
          </Layout>
        </Layout>
      </section>
    )
  }
  return (
    <section className="item">
      <Layout>
        <Sider width={200} style={{ backgroundColor: '#FFFFFF' }}>
          <LoadingImage />
        </Sider>

        <Layout>
          <Header style={{ backgroundColor: '#FFFFFF' }}>
            <div className="header">
              <Title style={titleStyles} level={5}>
                <div
                  title={title}
                  style={{ overflow: 'hidden', width: '190px', textOverflow: 'ellipsis' }}
                  className="header__title"
                >
                  <span>{title}</span>
                </div>
              </Title>
              <Text
                style={{
                  color: '#827E7E',
                  fontFamily: 'Inter UI, sans-serif',
                  fontWeight: '400',
                  fontSize: '12px',
                  lineHeight: '22px',
                  letterSpacing: '0%',
                }}
              >
                <DateTime />
              </Text>
            </div>
            <div className={voteAverageClassName(vote_average)}>
              <Text style={textStyles}>{vote_average.toFixed(1)}</Text>
            </div>
          </Header>

          <Content style={{ backgroundColor: '#FFFFFF', height: '150px' }}>
            <section className="content">
              <div className="content__genre">
                <GetGenreList />
              </div>
              <div className="content__text">
                <Text style={textStyles}>
                  <GetSliceOverview overview={overview} maxLength={170} />
                </Text>
              </div>
            </section>
          </Content>
          <Footer style={{ backgroundColor: '#FFFFFF' }}>
            <div className="footer__rate">
              <Rate
                onChange={(e) => handleAddRating(id, e)}
                defaultValue={rating}
                disabled={stateTabs === 'rated' ? true : false}
              />
            </div>
          </Footer>
        </Layout>
      </Layout>
    </section>
  )
}

export default Item
