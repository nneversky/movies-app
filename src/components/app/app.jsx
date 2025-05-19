import React, { Component } from 'react'
import { Offline, Online } from 'react-detect-offline'
import { Alert, Image } from 'antd'
import MoveApp from '../../services'
import ListItem from '../listItem'
import ErrorItem from '../errorItem'
import './app.css'
import offlineErrImg from './pictures/offline-err.jpg'

export default class App extends Component {
  state = {
    moves: null,
    error: { errorStatus: false, errorCode: null },
  }

  componentDidMount() {
    this.loadMovies()
  }

  onLoaded = ({ results }) => {
    this.setState({
      moves: results,
    })
  }

  onError = (err) => {
    this.setState({
      error: { errorStatus: true, errorCode: err },
    })
  }

  loadMovies = () => {
    const moveData = new MoveApp()
    moveData
      .searchMoves('return')
      .then((data) => {
        this.onLoaded(data)
      })
      .catch((err) => this.onError(err))
  }

  OfflineError = () => {
    return (
      <div className="offline--error">
        <Alert
          style={{ marginBottom: '5px' }}
          message="Error"
          description="Turn on the internet)"
          showIcon
          type="error"
        />
        <Image style={{ borderRadius: '1%' }} preview={false} src={offlineErrImg} />
      </div>
    )
  }

  render() {
    const errLoading = this.state.error.errorStatus ? <ErrorItem error={this.state.error} /> : null

    return (
      <div className="container">
        <Online>
          {errLoading}
          <ListItem moves={this.state.moves} />
        </Online>
        <Offline>
          <this.OfflineError />
        </Offline>
      </div>
    )
  }
}
