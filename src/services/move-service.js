export default class MoveApp {
  _APIkey = 'de092b91941e35ae9c34e7edec80f95f'
  _baseUrl = 'https://api.themoviedb.org/3'
  _baseUrlImg = 'https://image.tmdb.org/t/p/original'

  async searchMovies(query, currentPage = 1) {
    const res = await fetch(`${this._baseUrl}/search/movie?query=${query}&api_key=${this._APIkey}&page=${currentPage}`)
    if (!res.ok) throw new Error(res.status)
    return await res.json()
  }

  searchImg(url) {
    return `${this._baseUrlImg}${url}`
  }
}
