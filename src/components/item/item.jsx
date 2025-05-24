import './item.css'
import { Image, Typography, Layout, Spin } from 'antd'
import { parseISO, format } from 'date-fns'

import MoveApp from '../../services'

import undefinedImg from './pictures/undefined-img.jpeg'
import React from 'react'

const Item = ({ genreList, poster_path, title, overview, release_date, vote_average, genre_ids }) => {
  const { Title, Text } = Typography
  const { Header, Content, Sider, Footer } = Layout
  const moveData = new MoveApp()

  const DateTime = () => {
    try {
      return format(parseISO(release_date), 'MMMM d, y')
    } catch (e) {
      return 'Unknown date'
    }
  }

  const GetGenreList = () => {
    if (genre_ids.length === 0) return <Text style={genreStyles}>Unknown genre</Text>

    const newIds = genre_ids.length > 3 ? genre_ids.slice(0, 3) : genre_ids

    return (
      <React.Fragment>
        {newIds.map((idGenre) => {
          return genreList.map((idListGenre) => {
            const { id, name } = idListGenre
            if (id === idGenre) return <Text key={new Date().toISOString()} style={genreStyles}>{name}</Text>
          })
        })}
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
        <Image
          placeholder={
            <div className="loading-image">
              <Spin size="big" style={{ transform: 'scale(2)' }} />
            </div>
          }
          style={{ height: '279px', width: '200px' }}
          src={path}
        />
      )
    }

    if (poster_path !== null) {
      return getImage(moveData.searchImg(poster_path))
    } else {
      return getImage(undefinedImg)
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

  return (
    <section className="item">
      <Layout>
        <Sider style={{ backgroundColor: 'rgba(34, 60, 80, 0.2)' }}>
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
            <div className="vote-average">
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
                  <GetSliceOverview overview={overview} maxLength={200} />
                </Text>
              </div>
            </section>
          </Content>
          <Footer style={{ backgroundColor: '#FFFFFF' }}></Footer>
        </Layout>
      </Layout>
    </section>
  )
}

export default Item
