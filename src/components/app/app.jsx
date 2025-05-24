import React, { Component } from 'react'
import { Offline, Online } from 'react-detect-offline'
import { Alert, Image } from 'antd'
import _ from 'lodash'

import offlineErrImg from './pictures/offline-err.jpg'
import MoveApp from '../../services'
import ListItem from '../listItem'
import ErrorItem from '../errorItem'
import PaginationItem from '../PaginationItem'
import InputItem from '../inputItem'
import './app.css'

export default class App extends Component {
  state = {
    movies: null,
    error: { errorStatus: false, errorCode: null },
    page: { currentPage: 1, totalPages: null },
    showPagination: false,
    text: null,
    genreList: null,
  }

  componentDidMount() {
    this.loadMovies()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.page.currentPage !== this.state.page.currentPage) {
      this.loadMovies()
      window.scrollTo(0, 0)
    } else if (prevState.showPagination !== this.state.showPagination) {
      this.loadMovies()
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

  loadMovies = () => {
    if (this.state.text !== null) {
      const moveData = new MoveApp()
      moveData.getGenreList().then((data) => {
        const { genres } = data
        this.setState({
          genreList: genres,
        })
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
        .catch((err) => this.onError(err))
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
        <Image style={{ borderRadius: '1%', width: '500px', height: 'auto' }} preview={false} src={offlineErrImg} />
      </div>
    )
  }

  handleChange = _.debounce((value) => {
    if (value === '') this.resetDefaultState()
    this.setState({ text: value }, () => {
      this.loadMovies()
    })
  }, 300)

  render() {
    const errLoading = this.state.error.errorStatus ? <ErrorItem error={this.state.error} /> : null

    return (
      <div className="container">
        <Online>
          <section className="header-input">
            <InputItem inputText={this.text} handleChange={this.handleChange} />
          </section>
          <section className="main">
            {errLoading}
            <ListItem genreList={this.state.genreList} text={this.state.text} movies={this.state.movies} />
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
      </div>
    )
  }
}
