export default class MoveApp {
  _APIkey = 'de092b91941e35ae9c34e7edec80f95f'
  _baseUrl = 'https://api.themoviedb.org/3'
  _baseUrlImg = 'https://image.tmdb.org/t/p/original'

  async searchMovies(query, currentPage = 1) {
    const res = await fetch(`${this._baseUrl}/search/movie?query=${query}&api_key=${this._APIkey}&page=${currentPage}`)
    if (!res.ok) throw new Error(res.status)
    return await res.json()
  }

  async getGenreList() {
    const res = await fetch(`${this._baseUrl}/genre/movie/list?language=en?&api_key=${this._APIkey}`)
    if (!res.ok) throw new Error(res.status)
    return await res.json()
  }

  async createGuestSession() {
    const res = await fetch(`${this._baseUrl}/authentication/guest_session/new?api_key=${this._APIkey}`)
    if (!res.ok) throw new Error(res.status)
    return await res.json()
  }

  async addRating(sessionId, moveId, rating) {
    const res = await fetch(
      `${this._baseUrl}/movie/${moveId}/rating?api_key=${this._APIkey}&guest_session_id=${sessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: rating }),
      }
    )
    if (!res.ok) throw new Error(res.status)
    return await res.json()
  }

  async showRatedMovies(sessionId) {
    const res = await fetch(`${this._baseUrl}/guest_session/${sessionId}/rated/movies?api_key=${this._APIkey}`)
    if (!res.ok && res.status !== 404) {
      return new Error(res.status)
    } else {
      return await res.json()
    }
  }

  searchImg(url) {
    return `${this._baseUrlImg}${url}`
  }
}
