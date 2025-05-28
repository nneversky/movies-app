import React, { Component } from 'react'
import { Offline, Online } from 'react-detect-offline'
import { Alert, Image, Tabs } from 'antd'
import _ from 'lodash'

import MoveApp from '../../services'
import ListItem from '../listItem'
import ErrorItem from '../errorItem'
import PaginationItem from '../PaginationItem'
import InputItem from '../inputItem'
import { Provider } from '../movesApiContext'

import offlineErrImg from './pictures/offline-err.jpg'
import './app.css'

export default class App extends Component {
  state = {
    movies: null,
    error: { errorStatus: false, errorCode: null },
    page: { currentPage: 1, totalPages: null },
    showPagination: false,
    text: null,
    stateText: null,
    genreList: null,
    stateTabs: 'search',
    guestSessionId: null,
    ratedMovies: null,
    ratedPages: { currentPage: 1, totalPages: null },
    sizeDisplay: window.matchMedia('(max-width: 992px)').matches,
  }

  componentDidMount() {
    this.handleShowRatedMovies()
    this.addGuestSession()
    this.loadMovies()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.page.currentPage !== this.state.page.currentPage) {
      this.loadMovies()
      window.scrollTo(0, 0)
    } else if (prevState.showPagination !== this.state.showPagination) {
      this.loadMovies()
    } else if (prevState.stateTabs !== this.state.stateTabs) {
      this.addGuestSession()
      this.loadMovies()
      this.handleShowRatedMovies()
    } else if (JSON.stringify(prevState.ratedMovies) != JSON.stringify(this.state.ratedMovies)) {
      this.loadMovies()
      this.handleShowRatedMovies()
    }
  }

  onLoaded = (data) => {
    this.setState({
      movies: data.results,
      page: { currentPage: this.state.page.currentPage, totalPages: data.total_pages },
    })
  }

  onTogglePage = (page) => {
    this.setState({
      page: { currentPage: page, totalPages: this.state.page.totalPages },
    })
  }

  onError = (err) => {
    this.setState({
      error: { errorStatus: true, errorCode: err },
    })
  }

  handleAddRating = (moveId, rating) => {
    if (this.state.guestSessionId) {
      const moveData = new MoveApp()
      moveData
        .addRating(this.state.guestSessionId, moveId, rating)
        .then(() => {
          this.handleShowRatedMovies()
        })
        .catch((err) => this.onError(err))
    }
  }

  handleShowRatedMovies = () => {
    const moveData = new MoveApp()
    if (this.state.guestSessionId) {
      moveData
        .showRatedMovies(this.state.guestSessionId)
        .then((data) => {
          const { results, page, total_pages, success = true } = data
          if (success) {
            this.setState(
              {
                ratedMovies: results,
                ratedPages: { currentPage: page, totalPages: total_pages },
              },
              () => this.loadMovies()
            )
          }
        })
        .catch((err) => this.onError(err))
    }
  }

  handleText = (value) => {
    this.setState({
      stateText: value,
    })
    this.handleChange(value)
  }

  handleChange = _.debounce((value) => {
    if (value === '') this.resetDefaultState()
    this.setState({ text: value }, () => {
      this.loadMovies()
    })
  }, 300)

  items = [
    { key: 'search', label: 'Search' },
    { key: 'rated', label: 'Rated' },
  ]

  handleChangeTabs = (key) => {
    this.setState({
      stateTabs: key,
    })
  }

  addGuestSession = () => {
    const sessionId = localStorage.getItem('guestSessionId')
    if (sessionId !== null) {
      this.setState(
        {
          guestSessionId: sessionId,
        },
        () => this.handleShowRatedMovies()
      )
    } else {
      const moveData = new MoveApp()
      moveData
        .createGuestSession()
        .then((data) => {
          const { guest_session_id, success } = data
          if (success) {
            localStorage.setItem('guestSessionId', guest_session_id)
            this.setState(
              {
                guestSessionId: guest_session_id,
              },
              () => this.handleShowRatedMovies()
            )
          }
        })
        .catch((err) => this.onError(err))
    }
  }

  loadMovies = () => {
    if (this.state.text !== null) {
      const moveData = new MoveApp()
      moveData
        .getGenreList()
        .then((data) => {
          const { genres } = data
          this.setState({
            genreList: genres,
          })
        })
        .catch((err) => {
          this.onError(err)
        })
      moveData
        .searchMovies(this.state.text, this.state.page.currentPage)
        .then((data) => {
          if (this.state.text === null || this.state.text === '' || Object.keys(data.results).length === 0) {
            this.setState({
              showPagination: false,
            })
          } else {
            this.setState({
              showPagination: true,
            })
          }
          this.onLoaded(data)
        })
        .catch((err) => {
          this.onError(err)
        })
    }
  }

  resetDefaultState = () => {
    this.setState({
      movies: null,
      error: { errorStatus: false, errorCode: null },
      page: { currentPage: 1, totalPages: null },
      showPagination: false,
      text: null,
    })
  }

  OfflineError = () => {
    return (
      <div className="offline-error">
        <Alert
          style={{ marginBottom: '5px' }}
          message="Error"
          description="Turn on the internet)"
          showIcon
          type="error"
        />
        <Image style={{ borderRadius: '1%' }} alt="Error" preview={false} src={offlineErrImg} />
      </div>
    )
  }

  intervalRender = setInterval(() => {
    if (window.matchMedia('(max-width: 992px)').matches !== this.state.sizeDisplay) {
      this.setState({ sizeDisplay: window.matchMedia('(max-width: 992px)').matches }, () => this.loadMovies())
    }
  })

  render() {
    const errLoading = this.state.error.errorStatus ? <ErrorItem error={this.state.error} /> : null

    if (errLoading) return <div className="error">{errLoading}</div>

    if (this.state.stateTabs === 'rated') {
      return (
        <div className="container">
          <Provider value={this.state.genreList}>
            <Online>
              <section className="header-input">
                <div className="items-tabs">
                  <Tabs items={this.items} onChange={(e) => this.handleChangeTabs(e)} />
                </div>
              </section>
              <section className="main">
                <ListItem movies={this.state.ratedMovies} stateTabs={this.state.stateTabs} />
              </section>
              <section className="footer">
                <PaginationItem
                  showPagination={this.state.showPagination}
                  page={this.state.ratedPages}
                  onTogglePage={this.onTogglePage}
                />
              </section>
            </Online>
            <Offline>
              <this.OfflineError />
            </Offline>
          </Provider>
        </div>
      )
    }
    //--------------------------------------------
    return (
      <div className="container">
        <Provider value={this.state.genreList}>
          <Online>
            <section className="header-input">
              <div className="items-tabs">
                <Tabs items={this.items} onChange={(e) => this.handleChangeTabs(e)} />
              </div>
              <InputItem stateText={this.state.stateText} handleText={this.handleText} />
            </section>
            <section className="main">
              <ListItem
                text={this.state.text}
                movies={this.state.movies}
                handleAddRating={this.handleAddRating}
                ratedMovies={this.state.ratedMovies}
              />
            </section>
            <section className="footer">
              <PaginationItem
                showPagination={this.state.showPagination}
                page={this.state.page}
                onTogglePage={this.onTogglePage}
              />
            </section>
          </Online>
          <Offline>
            <this.OfflineError />
          </Offline>
        </Provider>
      </div>
    )
  }
}
