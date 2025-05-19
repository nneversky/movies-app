import { Component } from 'react'

import MoveApp from '../../services'
import ListItem from '../listItem'
import ErrorItem from '../errorItem'
import './app.css'

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

  render() {
    const errLoading = this.state.error.errorStatus ? <ErrorItem error={this.state.error} /> : null

    return (
      <div className="container">
        {errLoading}
        <ListItem moves={this.state.moves} />
      </div>
    )
  }
}
